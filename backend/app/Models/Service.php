<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Service extends Model
{
    use HasTranslations;

    protected $fillable = [
        'name',
        'slug',
        'badge',
        'short_description',
        'thumbnail',
        'hero_image',
        'eyebrow',
        'hero_title',
        'intro_text',
        'sections',
        'seo_title',
        'seo_description',
        'order_column',
        'is_active',
        'is_featured_home',
    ];

    public array $translatable = [
        'name',
        'slug',
        'badge',
        'short_description',
        'eyebrow',
        'hero_title',
        'intro_text',
        'sections',
        'seo_title',
        'seo_description',
    ];

    protected $casts = [
        'sections' => 'array',
        'is_active' => 'boolean',
        'is_featured_home' => 'boolean',
        'order_column' => 'integer',
    ];

    public function faqs(): HasMany
    {
        return $this->hasMany(Faq::class)->orderBy('order_column');
    }
    
    public function projects(): HasMany
{
    return $this->hasMany(Project::class);
}
}