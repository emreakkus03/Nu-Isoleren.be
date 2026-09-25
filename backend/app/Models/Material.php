<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Translatable\HasTranslations;

class Material extends Model
{
    use HasTranslations;

    public array $translatable = [
        'name',
        'slug',
        'eyebrow',
        'hero_title',
        'short_description',
        'intro_text',
        'sections',
        'seo_title',
        'seo_description',
    ];

    protected $fillable = [
        'is_indexable',
        'name',
        'slug',
        'eyebrow',
        'hero_title',
        'short_description',
        'intro_text',
        'hero_image',
        'thumbnail',
        'sections',
        'seo_title',
        'seo_description',
        'is_active',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_indexable' => 'boolean',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class)
            ->using(SeoRelation::class)
            ->withPivot('sort_order')
            ->withTimestamps()
            ->orderByPivot('sort_order');
    }
}
