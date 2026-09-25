<?php

namespace App\Services;

use App\Jobs\RefreshFrontendSeo;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

final class SeoRefresh
{
    public const ALL = ['services', 'cities', 'articles', 'projects', 'materials', 'faqs', 'sitemap'];

    public function tags(Model $record): array
    {
        $type = match ($record->getTable()) {
            'knowledge_articles', 'knowledge_categories' => 'articles',
            'project_images' => 'projects',
            'material_service' => 'materials',
            'city_nearby_city' => 'cities',
            default => $record->getTable(),
        };
        $related = match ($type) {
            'services' => ['projects', 'articles', 'materials', 'faqs'],
            'cities' => ['projects', 'services'],
            'projects' => ['services', 'cities'],
            'faqs' => ['services'],
            'materials' => ['services'],
            default => [],
        };

        return array_values(array_unique([$type, ...$related, 'sitemap']));
    }

    public function request(array $tags): void
    {
        $tags = array_values(array_intersect(self::ALL, $tags));
        DB::afterCommit(function () use ($tags) {
            Cache::forget('seo.inventory');
            RefreshFrontendSeo::dispatch($tags)->onConnection(config('seo.queue_connection'));
        });
    }
}
