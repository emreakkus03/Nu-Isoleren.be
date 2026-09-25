<?php

namespace Tests\Feature;

use App\Filament\Widgets\SeoOverview;
use App\Jobs\RefreshFrontendSeo;
use App\Models\City;
use App\Models\KnowledgeArticle;
use App\Models\KnowledgeCategory;
use App\Models\Service;
use App\Models\User;
use App\Services\SeoInventory;
use App\Services\SeoRefresh;
use App\Support\ContentSeo;
use Illuminate\Foundation\Testing\DatabaseMigrations;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Queue;
use Livewire\Livewire;
use Tests\TestCase;

class SeoContentTest extends TestCase
{
    use DatabaseMigrations;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
    }

    private function service(): Service
    {
        return Service::create(['name' => ['nl' => 'Spouw', 'fr' => 'Isolation'], 'slug' => ['nl' => 'spouw', 'fr' => 'isolation'], 'badge' => ['nl' => 'Isolatie'], 'intro_text' => ['nl' => 'Inhoud', 'fr' => 'Contenu'], 'is_active' => true, 'is_indexable' => true]);
    }

    public function test_exact_locale_slug_and_real_translations(): void
    {
        $service = $this->service();
        $this->assertSame($service->id, ContentSeo::resolve('services', 'fr', 'isolation')->id);
        $this->assertSame(['nl' => 'spouw', 'fr' => 'isolation'], ContentSeo::slugs($service));
        $this->getJson('/api/services/spouw?locale=fr')->assertNotFound();
        $this->getJson('/api/services/spouw?locale=en')->assertNotFound();
        $this->getJson('/api/services/spouw?locale=xx')->assertNotFound();
    }

    public function test_inventory_distinguishes_public_noindex_and_unpublished(): void
    {
        $service = $this->service();
        $service->update(['is_indexable' => false]);
        $entries = app(SeoInventory::class)->entries();
        $this->assertCount(1, $entries);
        $this->assertFalse($entries[0]['is_indexable']);
        $this->assertSame($service->updated_at->toIso8601String(), $entries[0]['updated_at']);
        $service->update(['is_active' => false]);
        $this->assertSame([], app(SeoInventory::class)->entries());
        $this->getJson('/api/services/spouw?locale=nl')->assertNotFound();
    }

    public function test_city_publication_is_separate_from_indexability(): void
    {
        $city = City::create(['name' => 'Hamme', 'slug' => 'hamme', 'hero_title' => ['nl' => 'Hamme'], 'local_content' => ['nl' => 'Lokale inhoud'], 'is_indexable' => true, 'is_published' => false]);
        $this->getJson('/api/cities/hamme?locale=nl')->assertNotFound();
        $this->assertSame([], app(SeoInventory::class)->entries());
        $city->update(['is_published' => true, 'is_indexable' => false]);
        $this->assertCount(1, app(SeoInventory::class)->entries());
        $this->assertFalse(app(SeoInventory::class)->entries()[0]['is_indexable']);
    }

    public function test_unpublishing_keeps_original_article_date_and_future_articles_are_private(): void
    {
        $category = KnowledgeCategory::create(['name' => ['nl' => 'Kennis'], 'slug' => ['nl' => 'kennis'], 'is_active' => true]);
        $article = KnowledgeArticle::create(['knowledge_category_id' => $category->id, 'title' => ['nl' => 'Artikel'], 'slug' => ['nl' => 'artikel'], 'intro' => ['nl' => 'Inhoud'], 'published' => true, 'published_at' => '2025-01-02 09:00:00']);
        $article->update(['published' => false]);
        $this->assertSame('2025-01-02 09:00:00', $article->fresh()->published_at->format('Y-m-d H:i:s'));
        $this->assertSame([], app(SeoInventory::class)->entries());
        $article->update(['published' => true, 'published_at' => now()->addDay()]);
        $this->getJson('/api/knowledge-articles/artikel?locale=nl')->assertNotFound();
        $this->assertSame([], app(SeoInventory::class)->entries());
    }

    public function test_refresh_is_dispatched_only_after_commit_and_invalidates_inventory(): void
    {
        Cache::put('seo.inventory', ['old'], 300);
        DB::beginTransaction();
        app(SeoRefresh::class)->request(['services', 'sitemap']);
        Queue::assertNothingPushed();
        DB::commit();
        Queue::assertPushed(RefreshFrontendSeo::class, fn ($job) => $job->tags === ['services', 'sitemap'] && $job->connection === 'database');
        $this->assertNull(Cache::get('seo.inventory'));
    }

    public function test_refresh_job_sends_authentication_and_records_acknowledged_success(): void
    {
        config(['seo.revalidation_url' => 'https://frontend.example/api/revalidate', 'seo.revalidation_secret' => str_repeat('s', 32)]);
        Http::fake(['frontend.example/*' => Http::response(['revalidated' => true])]);
        (new RefreshFrontendSeo(['articles', 'sitemap']))->handle();
        Http::assertSent(fn ($request) => $request->hasHeader('Authorization', 'Bearer '.str_repeat('s', 32)) && $request['tags'] === ['articles', 'sitemap']);
        $this->assertNotNull(DB::table('seo_refresh_status')->value('succeeded_at'));
    }

    public function test_refresh_failure_is_recorded_without_claiming_success(): void
    {
        config(['seo.revalidation_url' => 'https://frontend.example/api/revalidate', 'seo.revalidation_secret' => str_repeat('s', 32)]);
        Http::fake(['*' => Http::response([], 503)]);
        try {
            (new RefreshFrontendSeo(['sitemap']))->handle();
            $this->fail('Expected failure');
        } catch (\RuntimeException) {
        }
        $this->assertNull(DB::table('seo_refresh_status')->value('succeeded_at'));
        $this->assertNotNull(DB::table('seo_refresh_status')->value('last_error'));
    }

    public function test_a_slug_in_another_language_cannot_select_the_wrong_record(): void
    {
        $other = $this->service();
        $other->update(['slug' => ['nl' => 'isolation', 'fr' => 'autre']]);
        $expected = $this->service();
        $this->getJson('/api/services/isolation?locale=fr')->assertOk()->assertJsonPath('data.id', $expected->id);
    }

    public function test_filament_fallback_uses_the_same_refresh_queue(): void
    {
        $this->service();
        $this->actingAs(User::factory()->create());
        Livewire::test(SeoOverview::class)
            ->assertSee('SEO & indexering')
            ->assertSee('SEO-cache & sitemap vernieuwen', false)
            ->call('refreshSeo')
            ->assertHasNoErrors();
        Queue::assertPushed(RefreshFrontendSeo::class, fn ($job) => $job->tags === SeoRefresh::ALL);
    }
}
