<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Service extends Model
{
    use HasTranslations;

    protected $fillable = ['name', 'slug'];

    public array $translatable = ['name', 'slug'];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function faqs()
{
    return $this->hasMany(Faq::class)->orderBy('sort_order');
}
}