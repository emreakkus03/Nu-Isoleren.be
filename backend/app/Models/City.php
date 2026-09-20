<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class City extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name',
        'postal_code',
        'slug',
        'province',
        'region',
        'is_featured',
        'hero_image',
        'hero_title',
        'hero_intro',
        'local_title',
        'local_content',
        'solution_intro',
        'local_faqs',
        'seo_title',
        'seo_description',
        'is_indexable',
    ];

    public array $translatable = [
        'hero_title',
        'hero_intro',
        'local_title',
        'local_content',
        'solution_intro',
        'local_faqs',
        'seo_title',
        'seo_description',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'is_indexable' => 'boolean',
    ];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function nearbyCities(): BelongsToMany
{
    return $this->belongsToMany(
        City::class,
        'city_nearby_city',
        'city_id',
        'nearby_city_id'
    )->withTimestamps();
}
}