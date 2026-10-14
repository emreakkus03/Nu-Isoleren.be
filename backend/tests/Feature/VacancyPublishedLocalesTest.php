<?php

namespace Tests\Feature;

use App\Filament\Resources\Vacancies\Pages\EditVacancy;
use App\Jobs\RefreshFrontendSeo;
use App\Models\JobApplication;
use App\Models\User;
use App\Models\Vacancy;
use App\Services\SeoInventory;
use App\Support\ContentSeo;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class VacancyPublishedLocalesTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        Http::preventStrayRequests();
        Cache::forget('seo.inventory');
        config(['services.turnstile.enabled' => false]);
    }

    public static function publicationLocales(): array
    {
        return [[['nl']], [['nl', 'fr']], [['nl', 'fr', 'en']], [['fr']], [['en']]];
    }

    #[DataProvider('publicationLocales')]
    public function test_api_lists_details_and_inventory_only_expose_selected_languages(array $locales): void
    {
        $vacancy = Vacancy::factory()->create(['published_locales' => $locales]);
        foreach (['nl', 'fr', 'en'] as $locale) {
            $response = $this->getJson('/api/vacancies?locale='.$locale)->assertOk();
            $this->assertCount(in_array($locale, $locales, true) ? 1 : 0, $response->json('data'));
            $detail = $this->getJson('/api/vacancies/'.$vacancy->getTranslation('slug', $locale, false).'?locale='.$locale);
            if (in_array($locale, $locales, true)) {
                $detail->assertOk()->assertJsonPath('data.published_locales', $locales);
                $this->assertSame($locales, array_keys($detail->json('data.alternate_slugs')));
            } else {
                $detail->assertNotFound();
            }
        }
        $entries = collect(app(SeoInventory::class)->entries())->where('type', 'vacancies')->sole();
        $this->assertSame($locales, array_keys($entries['slugs']));
        $this->assertSame($locales, array_keys(ContentSeo::slugs($vacancy)));
    }

    public function test_default_and_legacy_null_preserve_existing_three_language_availability(): void
    {
        foreach ([['nl', 'fr', 'en'], null] as $locales) {
            $vacancy = Vacancy::factory()->create(['published_locales' => $locales]);
            $this->assertSame(['nl', 'fr', 'en'], array_keys(ContentSeo::slugs($vacancy)));
            foreach (['nl', 'fr', 'en'] as $locale) {
                $this->getJson('/api/vacancies/'.$vacancy->getTranslation('slug', $locale, false).'?locale='.$locale)->assertOk();
            }
        }
        $this->assertSame(['nl', 'fr', 'en'], Vacancy::factory()->create()->published_locales);
    }

    public function test_unpublished_language_cannot_submit_application_directly_to_api(): void
    {
        $vacancy = Vacancy::factory()->create(['published_locales' => ['nl']]);
        foreach (['fr', 'en'] as $locale) {
            $this->postJson("/api/vacancies/{$vacancy->id}/applications", [
                'locale' => $locale, 'first_name' => 'Test', 'last_name' => 'Candidate',
                'email' => 'candidate@example.test', 'phone' => '123', 'city' => 'Teststad',
                'linkedin_url' => 'https://linkedin.com/in/test', 'privacy_accepted' => true, 'answers' => [],
            ])->assertUnprocessable()->assertJsonValidationErrors('vacancy');
        }
        $this->assertSame(0, JobApplication::count());
        Http::assertNothingSent();
    }

    public function test_filament_unselected_translations_are_optional_and_preserved(): void
    {
        $this->actingAs(User::factory()->create());
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $vacancy = Vacancy::factory()->create();
        $original = $vacancy->getTranslations('content');
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])
            ->fillForm(['published_locales' => ['nl']])->call('save')->assertHasNoFormErrors();
        $this->assertSame($original, $vacancy->fresh()->getTranslations('content'));
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])
            ->fillForm(['title.fr' => '', 'slug.fr' => '', 'short_description.fr' => '', 'content.fr' => '',
                'title.en' => '', 'slug.en' => '', 'short_description.en' => '', 'content.en' => ''])
            ->call('save')->assertHasNoFormErrors();
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])
            ->fillForm(['published_locales' => ['nl', 'fr']])->call('save')
            ->assertHasFormErrors(['title.fr' => 'required', 'slug.fr' => 'required', 'short_description.fr' => 'required', 'content.fr']);
    }

    public function test_published_requires_at_least_one_supported_language_and_draft_allows_none(): void
    {
        $this->actingAs(User::factory()->create());
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $vacancy = Vacancy::factory()->create();
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])
            ->fillForm(['published_locales' => []])->call('save')->assertHasFormErrors(['published_locales' => 'required']);
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])
            ->fillForm(['status' => 'draft', 'published_locales' => []])->call('save')->assertHasNoFormErrors();
        $this->assertSame([], $vacancy->fresh()->published_locales);
    }

    public function test_questions_and_option_labels_are_required_only_for_published_languages(): void
    {
        $this->actingAs(User::factory()->create());
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $vacancy = Vacancy::factory()->create(['published_locales' => ['nl']]);
        $question = $vacancy->questions()->create(['type' => 'single_choice', 'question' => ['nl' => 'Vraag?'],
            'options' => [['value' => 'yes', 'labels' => ['nl' => 'Ja']]], 'required' => true, 'active' => true]);
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])->call('save')->assertHasNoFormErrors();
        $form = Livewire::test(EditVacancy::class, ['record' => $vacancy->id])->fillForm(['published_locales' => ['nl', 'fr']]);
        $questionKey = array_key_first($form->get('data.questions'));
        $optionKey = array_key_first($form->get('data.questions')[$questionKey]['options']);
        $form->call('save')->assertHasFormErrors([
            "questions.$questionKey.question.fr" => 'required',
            "questions.$questionKey.options.$optionKey.labels.fr" => 'required',
        ]);
        $this->assertSame(['nl' => 'Vraag?'], $question->fresh()->getTranslations('question'));
    }

    public function test_language_change_invalidates_the_existing_inventory_and_vacancy_cache(): void
    {
        $vacancy = Vacancy::factory()->create();
        $this->assertCount(3, collect(app(SeoInventory::class)->entries())->where('type', 'vacancies')->sole()['slugs']);
        $vacancy->update(['published_locales' => ['nl']]);
        $this->assertSame(['nl'], array_keys(collect(app(SeoInventory::class)->entries())->where('type', 'vacancies')->sole()['slugs']));
        Queue::assertPushed(RefreshFrontendSeo::class, fn ($job): bool => in_array('vacancies', $job->tags, true) && in_array('sitemap', $job->tags, true));
    }

    public function test_disabling_languages_keeps_question_translations_and_choice_labels(): void
    {
        $this->actingAs(User::factory()->create());
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $vacancy = Vacancy::factory()->create();
        $question = $vacancy->questions()->create(['type' => 'single_choice',
            'question' => ['nl' => 'Vraag?', 'fr' => 'Question ?', 'en' => 'Question?'],
            'options' => [['value' => 'yes', 'labels' => ['nl' => 'Ja', 'fr' => 'Oui', 'en' => 'Yes']]],
            'required' => true, 'active' => true]);
        $translations = $question->getTranslations('question');
        $options = $question->options;
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])
            ->fillForm(['published_locales' => ['nl']])->call('save')->assertHasNoFormErrors();
        $this->assertSame($translations, $question->fresh()->getTranslations('question'));
        $this->assertSame($options, $question->fresh()->options);
    }

    public function test_french_only_publication_does_not_require_dutch_content_or_question_labels(): void
    {
        $this->actingAs(User::factory()->create());
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $vacancy = Vacancy::factory()->make(['published_locales' => ['fr']]);
        foreach (['title', 'slug', 'short_description', 'content'] as $field) {
            $vacancy->replaceTranslations($field, ['fr' => $vacancy->getTranslation($field, 'fr', false)]);
        }
        $vacancy->save();
        $vacancy->questions()->create(['type' => 'single_choice', 'question' => ['fr' => 'Question ?'],
            'options' => [['value' => 'yes', 'labels' => ['fr' => 'Oui']]], 'required' => true, 'active' => true]);
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])->call('save')->assertHasNoFormErrors();
        $this->getJson('/api/vacancies/'.$vacancy->getTranslation('slug', 'fr', false).'?locale=fr')->assertOk();
    }

    public function test_migration_backfills_existing_records_without_altering_translations_or_timestamps(): void
    {
        $vacancy = Vacancy::factory()->create();
        $original = $vacancy->getTranslations('title');
        $updated = $vacancy->updated_at;
        $migration = require database_path('migrations/2026_10_13_145927_add_published_locales_to_vacancies_table.php');
        $migration->down();
        $migration->up();
        $this->assertSame(['nl', 'fr', 'en'], $vacancy->fresh()->published_locales);
        $this->assertSame($original, $vacancy->fresh()->getTranslations('title'));
        $this->assertTrue($updated->eq($vacancy->fresh()->updated_at));
    }
}
