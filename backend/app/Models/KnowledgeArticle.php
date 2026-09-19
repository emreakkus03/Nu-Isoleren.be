<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;

class KnowledgeArticle extends Model
{
    use HasTranslations;

    public array $translatable = [
        'title',
        'slug',
        'excerpt',
        'intro',
        'sections',
        'seo_title',
        'seo_description',
    ];

    protected $fillable = [
        'knowledge_category_id',
        'service_id',
        'title',
        'slug',
        'excerpt',
        'intro',
        'hero_image',
        'sections',
        'seo_title',
        'seo_description',
        'published',
        'featured',
        'published_at',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'published' => 'boolean',
            'featured' => 'boolean',
            'published_at' => 'datetime',
            'sort_order' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (KnowledgeArticle $article) {
            if ($article->published && ! $article->published_at) {
                $article->published_at = now();
            }

            if (! $article->published) {
                $article->published_at = null;
            }
        });
    }

    public function knowledgeCategory(): BelongsTo
    {
        return $this->belongsTo(KnowledgeCategory::class);
    }

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query
            ->where('published', true)
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now());
    }
}