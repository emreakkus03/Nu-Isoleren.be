<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\Translatable\HasTranslations;

class Vacancy extends Model
{
    use HasFactory, HasTranslations;

    public const LOCALES = ['nl' => 'Nederlands', 'fr' => 'Français', 'en' => 'English'];

    public const STATUSES = ['draft' => 'Concept', 'published' => 'Gepubliceerd', 'closed' => 'Gesloten'];

    public const EMPLOYMENT_TYPES = ['FULL_TIME' => 'Voltijds', 'PART_TIME' => 'Deeltijds', 'CONTRACTOR' => 'Zelfstandige samenwerking', 'TEMPORARY' => 'Tijdelijk', 'INTERN' => 'Stage', 'OTHER' => 'Andere'];

    public array $translatable = ['title', 'slug', 'short_description', 'content', 'meta_title', 'meta_description'];

    protected $attributes = ['published_locales' => '["nl","fr","en"]'];

    protected $fillable = ['published_locales', 'status', 'title', 'slug', 'short_description', 'content', 'meta_title', 'meta_description', 'published_at', 'valid_through', 'image', 'region', 'employment_type', 'location_city', 'location_region', 'location_country', 'sort_order', 'is_indexable', 'require_cv_or_linkedin'];

    protected function casts(): array
    {
        return ['published_locales' => 'array', 'published_at' => 'datetime', 'valid_through' => 'datetime', 'is_indexable' => 'boolean', 'require_cv_or_linkedin' => 'boolean'];
    }

    protected static function booted(): void
    {
        static::saving(function (Vacancy $vacancy): void {
            if ($vacancy->status === 'published' && ! $vacancy->published_at) {
                $vacancy->published_at = now();
            }
        });
    }

    public function publishedLocales(): array
    {
        return array_values(array_intersect($this->published_locales ?? array_keys(self::LOCALES), array_keys(self::LOCALES)));
    }

    public function isPublishedIn(string $locale): bool
    {
        return in_array($locale, $this->publishedLocales(), true);
    }

    public function scopePublishedIn(Builder $query, string $locale): Builder
    {
        return $query->where(fn (Builder $query) => $query->whereJsonContains('published_locales', $locale)->orWhereNull('published_locales'));
    }

    public function scopeOpen(Builder $query): Builder
    {
        return $query->where('status', 'published')->whereNotNull('published_at')->where('published_at', '<=', now())
            ->where(fn (Builder $q) => $q->whereNull('valid_through')->orWhere('valid_through', '>', now()));
    }

    public function isOpen(): bool
    {
        return $this->status === 'published' && $this->published_at?->lte(now()) && (! $this->valid_through || $this->valid_through->gt(now()));
    }

    public function questions(): HasMany
    {
        return $this->hasMany(VacancyQuestion::class)->orderBy('sort_order')->orderBy('id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(JobApplication::class);
    }
}
