<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Throwable;

final class RefreshFrontendSeo implements ShouldQueue
{
    use Queueable;

    public int $tries = 5;

    public int $timeout = 25;

    public function __construct(public array $tags) {}

    public function backoff(): array
    {
        return [10, 30, 120, 300];
    }

    public function handle(): void
    {
        try {
            $url = config('seo.revalidation_url');
            $secret = config('seo.revalidation_secret');
            if (! $url || ! $secret) {
                throw new \RuntimeException('SEO refresh is not configured.');
            }
            $response = Http::acceptJson()->withToken($secret)->connectTimeout(5)->timeout(15)->post($url, ['tags' => $this->tags]);
            if (! $response->successful() || $response->json('revalidated') !== true) {
                throw new \RuntimeException('SEO refresh was not acknowledged.');
            }
            DB::table('seo_refresh_status')->updateOrInsert(['id' => 1], ['succeeded_at' => now(), 'last_error' => null]);
        } catch (Throwable $error) {
            DB::table('seo_refresh_status')->updateOrInsert(['id' => 1], ['failed_at' => now(), 'last_error' => 'Frontend SEO-refresh mislukt; controleer configuratie, verbinding en queue.']);
            Log::warning('Frontend SEO refresh failed', ['tags' => $this->tags]);
            throw new \RuntimeException('Frontend SEO refresh failed.');
        }
    }
}
