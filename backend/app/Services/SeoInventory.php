<?php

namespace App\Services;

use App\Support\ContentSeo;
use Illuminate\Support\Facades\Cache;

final class SeoInventory
{
    public function entries(): array
    {
        return Cache::remember('seo.inventory', config('seo.inventory_ttl'), function () {
            $entries = [];
            foreach (ContentSeo::MODELS as $type => $model) {
                $fields = match ($type) {
                    'cities' => ['hero_title', 'local_content'],
                    'projects' => ['title', 'description'],
                    'articles' => ['title', 'intro'],
                    default => ['name', 'intro_text'],
                };
                foreach (ContentSeo::publicQuery($type)->get(['id', 'slug', 'is_indexable', 'updated_at', ...$fields]) as $record) {
                    $slugs = ContentSeo::slugs($record);
                    if ($slugs !== []) {
                        $entries[] = ['type' => $type, 'id' => $record->id, 'slugs' => $slugs, 'is_indexable' => (bool) $record->is_indexable, 'updated_at' => $record->updated_at?->toIso8601String()];
                    }
                }
            }

            return $entries;
        });
    }
}
