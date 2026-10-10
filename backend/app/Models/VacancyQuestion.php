<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;

class VacancyQuestion extends Model
{
    use HasTranslations;

    public const TYPES = ['yes_no' => 'Ja / nee', 'single_choice' => 'Eén keuze', 'multiple_choice' => 'Meerdere keuzes', 'short_text' => 'Korte tekst', 'long_text' => 'Lange tekst'];

    public array $translatable = ['question', 'help_text'];

    protected $fillable = ['vacancy_id', 'type', 'question', 'help_text', 'options', 'short_label', 'show_in_email_subject', 'required', 'active', 'sort_order'];

    protected function casts(): array
    {
        return ['options' => 'array', 'required' => 'boolean', 'active' => 'boolean', 'show_in_email_subject' => 'boolean'];
    }

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function localized(string $locale): array
    {
        return ['id' => $this->id, 'type' => $this->type, 'required' => $this->required,
            'question' => $this->getTranslation('question', $locale, false),
            'help_text' => $this->getTranslation('help_text', $locale, false),
            'options' => array_map(fn (array $option): array => ['value' => $option['value'], 'label' => $option['labels'][$locale] ?? ''], $this->options ?? [])];
    }
}
