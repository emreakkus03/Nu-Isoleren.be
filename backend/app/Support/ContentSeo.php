<?php

namespace App\Support;

use App\Models\City;
use App\Models\KnowledgeArticle;
use App\Models\Material;
use App\Models\Project;
use App\Models\Service;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

final class ContentSeo
{
    public const MODELS = ['services' => Service::class, 'cities' => City::class, 'articles' => KnowledgeArticle::class, 'projects' => Project::class, 'materials' => Material::class];

    public const LOCALES = ['nl', 'fr', 'en'];

    public static function locale(string $locale): string
    {
        abort_unless(in_array($locale, self::LOCALES, true), 404);

        return $locale;
    }

    public static function publicQuery(string $type): Builder
    {
        $query = self::MODELS[$type]::query();

        return match ($type) {
            'cities' => $query->where('is_published', true),
            'articles' => $query->published(),
            'projects' => $query->where('published', true),
            default => $query->where('is_active', true),
        };
    }

    public static function availableQuery(string $type, string $locale): Builder
    {
        self::locale($locale);
        $fields = match ($type) {
            'cities' => ['hero_title', 'local_content'],
            'projects' => ['slug', 'title', 'description'],
            'articles' => ['slug', 'title', 'intro'],
            default => ['slug', 'name', 'intro_text'],
        };
        $query = self::publicQuery($type);
        foreach ($fields as $field) {
            $query->whereNotNull("{$field}->{$locale}")->where("{$field}->{$locale}", '!=', '');
        }

        return $query;
    }

    public static function slugs(Model $record): array
    {
        $result = [];
        foreach (self::LOCALES as $locale) {
            if ($record instanceof City) {
                $slug = $record->slug;
                $title = $record->getTranslation('hero_title', $locale, false);
                $body = $record->getTranslation('local_content', $locale, false);
            } else {
                $slug = $record->getTranslation('slug', $locale, false);
                $title = $record->getTranslation($record instanceof Project || $record instanceof KnowledgeArticle ? 'title' : 'name', $locale, false);
                $field = match (true) {
                    $record instanceof KnowledgeArticle => 'intro',
                    $record instanceof Project => 'description',
                    default => 'intro_text',
                };
                $body = $record->getTranslation($field, $locale, false);
            }
            if (is_string($slug) && trim($slug) !== '' && filled($title) && filled($body)) {
                $result[$locale] = $slug;
            }
        }

        return $result;
    }

    public static function resolve(string $type, string $locale, string $slug): Model
    {
        self::locale($locale);
        $records = self::publicQuery($type)->where($type === 'cities' ? 'slug' : "slug->{$locale}", $slug)->limit(2)->get();
        abort_unless($records->count() === 1, 404);
        $record = $records->first();
        abort_unless((self::slugs($record)[$locale] ?? null) === $slug, 404);

        return $record;
    }

    public static function metadata(Model $record): array
    {
        return [
            'is_indexable' => (bool) $record->is_indexable,
            'alternate_slugs' => self::slugs($record),
            'updated_at' => $record->updated_at?->toIso8601String(),
        ];
    }
}
