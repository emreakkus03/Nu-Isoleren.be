<?php

use App\Models\KnowledgeArticle;
use App\Services\SeoRefresh;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::call(function () {
    $ids = KnowledgeArticle::published()->orderBy('id')->pluck('id')->all();
    $signature = hash('sha256', json_encode($ids));
    $previous = Cache::get('seo.published-articles');
    if ($previous !== $signature) {
        app(SeoRefresh::class)->request(['articles', 'sitemap']);
        Cache::forever('seo.published-articles', $signature);
    }
})->name('seo-scheduled-publications')->everyMinute()->withoutOverlapping();
