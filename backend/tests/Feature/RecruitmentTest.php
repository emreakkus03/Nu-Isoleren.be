<?php

namespace Tests\Feature;

use App\Filament\Resources\JobApplications\Pages\EditJobApplication;
use App\Filament\Resources\JobApplications\Pages\ListJobApplications;
use App\Filament\Resources\Vacancies\Pages\CreateVacancy;
use App\Filament\Resources\Vacancies\Pages\EditVacancy;
use App\Filament\Resources\Vacancies\Pages\ListVacancies;
use App\Mail\ApplicationConfirmation;
use App\Mail\RecruitmentApplication;
use App\Models\JobApplication;
use App\Models\User;
use App\Models\Vacancy;
use App\Models\VacancyQuestion;
use App\Services\SeoInventory;
use Filament\Facades\Filament;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Testing\TestResponse;
use Livewire\Livewire;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\TestCase;

class RecruitmentTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        config(['services.turnstile.enabled' => false, 'recruitment.to' => 'recruitment@example.test', 'mail.default' => 'smtp', 'recruitment.max_cv_mb' => 5]);
        Mail::fake();
        Queue::fake();
        Http::preventStrayRequests();
        Storage::fake('local');
        Storage::fake('public');
        Storage::fake('s3');
    }

    private function vacancy(array $attributes = []): Vacancy
    {
        return Vacancy::factory()->create($attributes);
    }

    private function payload(array $extra = []): array
    {
        return array_replace(['first_name' => 'Ada', 'last_name' => 'Test', 'email' => 'ada@example.test', 'phone' => '123', 'city' => 'Teststad', 'linkedin_url' => 'https://www.linkedin.com/in/test', 'locale' => 'nl', 'privacy_accepted' => true, 'answers' => []], $extra);
    }

    private function submit(Vacancy $vacancy, array $extra = []): TestResponse
    {
        return $this->postJson("/api/vacancies/{$vacancy->id}/applications", $this->payload($extra));
    }

    private function question(Vacancy $vacancy, string $type = 'yes_no', array $extra = []): VacancyQuestion
    {
        return $vacancy->questions()->create(array_replace(['type' => $type, 'question' => ['nl' => 'Vraag?', 'fr' => 'Question ?', 'en' => 'Question?'], 'required' => true, 'active' => true, 'sort_order' => 1, 'short_label' => 'Screening', 'show_in_email_subject' => true, 'options' => [['value' => 'one', 'labels' => ['nl' => 'Eén', 'fr' => 'Un', 'en' => 'One']], ['value' => 'two', 'labels' => ['nl' => 'Twee', 'fr' => 'Deux', 'en' => 'Two']]]], $extra));
    }

    public function test_localized_publication_and_inventory(): void
    {
        $vacancy = $this->vacancy();
        $draft = $this->vacancy(['status' => 'draft']);
        $closed = $this->vacancy(['status' => 'closed']);
        $expired = $this->vacancy(['valid_through' => now()->subSecond()]);
        $future = $this->vacancy(['published_at' => now()->addDay()]);
        foreach (['nl', 'fr', 'en'] as $locale) {
            $this->getJson("/api/vacancies?locale=$locale")->assertOk()->assertJsonCount(1, 'data')->assertJsonPath('data.0.id', $vacancy->id);
            $this->getJson('/api/vacancies/'.$vacancy->getTranslation('slug', $locale)."?locale=$locale")->assertOk()->assertJsonPath('data.title', $vacancy->getTranslation('title', $locale))->assertJsonPath('data.alternate_slugs', $vacancy->getTranslations('slug'));
        }
        $this->getJson('/api/vacancies/'.$vacancy->getTranslation('slug', 'nl').'?locale=fr')->assertNotFound();
        $this->getJson('/api/vacancies/'.$draft->getTranslation('slug', 'nl'))->assertNotFound();
        $this->getJson('/api/vacancies/'.$closed->getTranslation('slug', 'nl'))->assertOk()->assertJsonPath('data.is_open', false);
        foreach ([$draft, $closed, $expired, $future] as $record) {
            $this->submit($record)->assertUnprocessable();
        }
        $entries = collect(app(SeoInventory::class)->entries())->where('type', 'vacancies');
        $this->assertSame([$vacancy->id], $entries->pluck('id')->all());
        $this->assertDatabaseCount('job_applications', 0);
        Mail::assertNothingSent();
    }

    public static function answerCases(): array
    {
        return [['yes_no', true, 'Ja'], ['yes_no', false, 'Nee'], ['single_choice', 'one', 'Eén'], ['multiple_choice', ['two', 'one'], 'Twee, Eén'], ['short_text', 'Korte ervaring', 'Korte ervaring'], ['long_text', 'Lange ervaring', 'Lange ervaring']];
    }

    #[DataProvider('answerCases')]
    public function test_answers_and_snapshots(string $type, mixed $value, string $label): void
    {
        $vacancy = $this->vacancy();
        $question = $this->question($vacancy, $type);
        $this->submit($vacancy, ['answers' => [$question->id => $value], 'utm_source' => 'facebook', 'utm_medium' => 'paid_social', 'utm_campaign' => 'test', 'utm_content' => 'ad', 'utm_term' => 'term'])->assertCreated();
        $application = JobApplication::sole();
        $this->assertSame('new', $application->status);
        $this->assertSame('nl', $application->locale);
        $this->assertSame('facebook', $application->source);
        $this->assertSame('ad', $application->utm_content);
        $this->assertSame('https://www.linkedin.com/in/test', $application->linkedin_url);
        $this->assertNotNull($application->privacy_accepted_at);
        $answer = $application->answers->sole();
        $this->assertSame($value, $answer->value);
        $this->assertSame($label, $answer->answer_label);
        $question->update(['question' => ['nl' => 'Gewijzigd'], 'options' => []]);
        $question->delete();
        $this->assertSame('Vraag?', $answer->fresh()->question);
        $this->assertSame($label, $answer->fresh()->answer_label);
        Mail::assertSent(RecruitmentApplication::class, function ($mail) use ($label): bool {
            $this->assertStringContainsString($label, $mail->render());
            $this->assertStringContainsString('facebook', $mail->render());
            $this->assertSame('ada@example.test', $mail->envelope()->replyTo[0]->address);
            $this->assertStringContainsString('Screening', $mail->envelope()->subject);

            return $mail->hasTo('recruitment@example.test');
        });
        Mail::assertSent(ApplicationConfirmation::class);
    }

    public static function invalidAnswers(): array
    {
        return [['yes_no', 'yes'], ['single_choice', 'injected'], ['multiple_choice', ['injected']], ['multiple_choice', ['one', 'one']], ['short_text', ['bad']], ['short_text', str_repeat('a', 501)], ['long_text', str_repeat('a', 5001)], ['yes_no', null]];
    }

    #[DataProvider('invalidAnswers')]
    public function test_invalid_or_missing_answers_are_rejected(string $type, mixed $value): void
    {
        $vacancy = $this->vacancy();
        $q = $this->question($vacancy, $type);
        $this->submit($vacancy, ['answers' => [$q->id => $value]])->assertUnprocessable();
        $this->assertDatabaseCount('job_applications', 0);
        Mail::assertNothingSent();
    }

    public function test_questions_from_other_vacancies_and_inactive_questions_are_rejected(): void
    {
        $vacancy = $this->vacancy();
        $other = $this->question($this->vacancy());
        $this->submit($vacancy, ['answers' => [$other->id => true]])->assertUnprocessable();
        $own = $this->question($vacancy, 'yes_no', ['active' => false]);
        $this->submit($vacancy, ['answers' => [$own->id => true]])->assertUnprocessable();
        $this->assertDatabaseCount('job_applications', 0);
    }

    public function test_optional_questions_and_optional_documents(): void
    {
        $vacancy = $this->vacancy(['require_cv_or_linkedin' => false]);
        $this->question($vacancy, 'short_text', ['required' => false]);
        $this->submit($vacancy, ['linkedin_url' => null])->assertCreated();
        $this->assertFalse(JobApplication::sole()->has_cv);
    }

    public function test_required_document_and_linkedin_domain(): void
    {
        $vacancy = $this->vacancy();
        $this->submit($vacancy, ['linkedin_url' => null])->assertUnprocessable()->assertJsonValidationErrors('cv');
        $this->submit($vacancy, ['linkedin_url' => 'https://linkedin.com.evil.test/in/test'])->assertUnprocessable();
        $this->submit($vacancy, ['privacy_accepted' => false])->assertUnprocessable();
        $this->assertDatabaseCount('job_applications', 0);
    }

    public static function documents(): array
    {
        return [[false], [true]];
    }

    #[DataProvider('documents')]
    public function test_pdf_only_and_pdf_with_linkedin_use_temporary_attachment(bool $linkedin): void
    {
        $file = UploadedFile::fake()->createWithContent('candidate.pdf', "%PDF-1.4\n1 0 obj\n<< /Type /Catalog >>\nendobj\n%%EOF");
        $vacancy = $this->vacancy();
        $this->submit($vacancy, ['cv' => $file, 'linkedin_url' => $linkedin ? 'https://linkedin.com/in/test' : null])->assertCreated();
        $application = JobApplication::sole();
        $this->assertTrue($application->has_cv);
        $this->assertFalse(Schema::hasColumn('job_applications', 'cv_path'));
        $this->assertFalse(Schema::hasColumn('job_applications', 'cv'));
        Mail::assertSent(RecruitmentApplication::class, function ($mail): bool {
            $attachment = $mail->attachments()[0];
            $this->assertSame('cv.pdf', $attachment->as);
            $this->assertSame('application/pdf', $attachment->mime);
            $this->assertTrue($mail->hasAttachment($attachment));

            return true;
        });
        foreach (['local', 'public', 's3'] as $disk) {
            $this->assertSame([], Storage::disk($disk)->allFiles());
        }
        $this->assertStringNotContainsString($file->getRealPath(), $application->toJson());
    }

    public function test_invalid_extension_mime_and_size(): void
    {
        $vacancy = $this->vacancy();
        foreach ([UploadedFile::fake()->create('bad.txt', 1, 'text/plain'), UploadedFile::fake()->create('bad.pdf', 1, 'text/plain'), UploadedFile::fake()->create('bad.txt', 1, 'application/pdf'), UploadedFile::fake()->create('large.pdf', 5121, 'application/pdf')] as $file) {
            $this->submit($vacancy, ['cv' => $file])->assertUnprocessable()->assertJsonValidationErrors('cv');
        }
        $this->assertDatabaseCount('job_applications', 0);
        Mail::assertNothingSent();
    }

    public function test_turnstile_rejection_and_success(): void
    {
        config(['services.turnstile.enabled' => true, 'services.turnstile.secret' => 'test-secret']);
        Http::fake(['*' => Http::sequence()->push(['success' => false])->push(['success' => true])]);
        $vacancy = $this->vacancy();
        $this->submit($vacancy)->assertUnprocessable();
        $this->submit($vacancy, ['turnstile_token' => 'test'])->assertUnprocessable();
        $this->assertDatabaseCount('job_applications', 0);
        Mail::assertNothingSent();
        $this->submit($vacancy, ['turnstile_token' => 'test'])->assertCreated();
        Http::assertSent(fn ($request): bool => $request['secret'] === 'test-secret' && $request['response'] === 'test');
    }

    public static function locales(): array
    {
        return [['nl'], ['fr'], ['en']];
    }

    #[DataProvider('locales')]
    public function test_confirmation_language_and_multipart_answers(string $locale): void
    {
        $vacancy = $this->vacancy();
        $question = $this->question($vacancy);
        $this->submit($vacancy, ['locale' => $locale, 'answers' => json_encode([$question->id => true])])->assertCreated();
        Mail::assertSent(ApplicationConfirmation::class, function ($mail) use ($locale): bool {
            $this->assertSame(__('recruitment.confirmation_subject', [], $locale), $mail->envelope()->subject);
            $this->assertStringContainsString(__('recruitment.confirmation_body', [], $locale), html_entity_decode($mail->render()));

            return $mail->hasTo('ada@example.test');
        });
    }

    public function test_mail_failure_retains_record_and_returns_honest_error_without_pii_logs(): void
    {
        Mail::shouldReceive('to')->once()->andThrow(new \RuntimeException('private upstream detail'));
        Log::shouldReceive('error')->once()->with('Recruitment internal mail delivery failed', \Mockery::on(fn (array $context): bool => array_keys($context) === ['application_id']));
        $this->submit($this->vacancy())->assertStatus(503)->assertJsonPath('recorded', true)->assertJsonPath('success', false);
        $this->assertSame('failed', JobApplication::sole()->internal_mail_status);
    }

    public function test_confirmation_failure_does_not_report_internal_delivery_as_lost(): void
    {
        $recipient = \Mockery::mock();
        $recipient->shouldReceive('send')->once();
        Mail::shouldReceive('to')->once()->with('recruitment@example.test', 'Nu-Isoleren Sollicitaties')->andReturn($recipient);
        Mail::shouldReceive('to')->once()->with('ada@example.test')->andThrow(new \RuntimeException('failure'));
        $this->submit($this->vacancy())->assertCreated();
        $this->assertSame('sent', JobApplication::sole()->internal_mail_status);
        $this->assertSame('failed', JobApplication::sole()->confirmation_mail_status);
    }

    public function test_log_transport_never_logs_candidate_mail(): void
    {
        config(['mail.default' => 'log']);
        $this->submit($this->vacancy())->assertStatus(503);
        Mail::assertNothingSent();
    }

    public function test_filament_pages_render_and_only_application_followup_is_editable(): void
    {
        $this->actingAs(User::factory()->create());
        Filament::setCurrentPanel(Filament::getPanel('admin'));
        $vacancy = $this->vacancy();
        $question = $this->question($vacancy);
        $this->submit($vacancy, ['answers' => [$question->id => true]])->assertCreated();
        $application = JobApplication::sole();
        Livewire::test(ListVacancies::class)->assertSuccessful();
        Livewire::test(CreateVacancy::class)->assertSuccessful();
        Livewire::test(EditVacancy::class, ['record' => $vacancy->id])->assertSuccessful();
        Livewire::test(ListJobApplications::class)->assertSuccessful();
        Livewire::test(EditJobApplication::class, ['record' => $application->id])
            ->assertSuccessful()->assertSee('Vraag?')->assertSee('Ja')
            ->fillForm(['status' => 'suitable', 'internal_notes' => 'Opvolgen'])
            ->call('save')->assertHasNoFormErrors();
        $this->assertSame('suitable', $application->fresh()->status);
        $this->assertSame('ada@example.test', $application->fresh()->email);
        $this->assertSame('Ja', $application->answers()->sole()->answer_label);
    }

    public function test_absent_translations_are_not_advertised_and_nonindexable_vacancy_is_public(): void
    {
        $vacancy = $this->vacancy(['is_indexable' => false, 'content' => ['nl' => '<p>Inhoud</p>', 'en' => '<p>Content</p>']]);
        $this->getJson('/api/vacancies?locale=fr')->assertJsonCount(0, 'data');
        $this->getJson('/api/vacancies/'.$vacancy->getTranslation('slug', 'fr').'?locale=fr')->assertNotFound();
        $this->getJson('/api/vacancies/'.$vacancy->getTranslation('slug', 'nl'))->assertOk()->assertJsonPath('data.is_indexable', false)->assertJsonMissingPath('data.alternate_slugs.fr');
        $this->assertFalse(collect(app(SeoInventory::class)->entries())->where('type', 'vacancies')->first()['is_indexable']);
    }
}
