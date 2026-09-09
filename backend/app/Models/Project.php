<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Project extends Model
{
    use HasTranslations;

    protected $fillable = [
        'service_id',
        'city_id',
        'title',
        'slug',
        'short_description',
        'description',
        'meta_title',
        'meta_description',
        'featured_on_home',
        'published',
        'sort_order',
    ];

    public array $translatable = [
        'title',
        'slug',
        'short_description',
        'description',
        'meta_title',
        'meta_description',
    ];

    protected $casts = [
        'featured_on_home' => 'boolean',
        'published' => 'boolean',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }

    public function city(): BelongsTo
    {
        return $this->belongsTo(City::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProjectImage::class)->orderBy('sort_order');
    }
}