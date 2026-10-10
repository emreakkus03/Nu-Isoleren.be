<?php

namespace App\Services;

use App\Models\Vacancy;
use Illuminate\Validation\ValidationException;

class ApplicationAnswers
{
    public function snapshots(Vacancy $vacancy, array $answers, string $locale): array
    {
        $questions = $vacancy->questions()->where('active', true)->get();
        $allowed = $questions->pluck('id')->map(fn (int $id): string => (string) $id)->all();
        foreach (array_keys($answers) as $id) {
            if (! in_array((string) $id, $allowed, true)) {
                throw ValidationException::withMessages(['answers' => __('recruitment.invalid_answers', [], $locale)]);
            }
        }
        $snapshots = [];
        foreach ($questions as $question) {
            $value = $answers[$question->id] ?? null;
            $empty = $value === null || $value === '' || $value === [];
            if ($empty && ! $question->required) {
                continue;
            }
            $options = collect($question->options ?? []);
            $valid = ! $empty && match ($question->type) {
                'yes_no' => is_bool($value),
                'single_choice' => is_string($value) && $options->containsStrict('value', $value),
                'multiple_choice' => is_array($value) && array_is_list($value) && count($value) <= $options->count() && collect($value)->every(fn (mixed $v): bool => is_string($v) && $options->containsStrict('value', $v)) && count(array_unique($value)) === count($value),
                'short_text', 'long_text' => is_string($value) && trim($value) !== '' && mb_strlen($value) <= ($question->type === 'short_text' ? 500 : 5000),
                default => false,
            };
            if (! $valid) {
                throw ValidationException::withMessages(["answers.{$question->id}" => __('recruitment.invalid_answers', [], $locale)]);
            }
            $label = match ($question->type) {
                'yes_no' => __('recruitment.'.($value ? 'yes' : 'no'), [], $locale),
                'single_choice' => $options->firstWhere('value', $value)['labels'][$locale] ?? '',
                'multiple_choice' => implode(', ', array_map(fn (string $v): string => $options->firstWhere('value', $v)['labels'][$locale] ?? '', $value)),
                default => $value,
            };
            $text = $question->getTranslation('question', $locale, false);
            if (blank($text) || blank($label)) {
                throw ValidationException::withMessages(['answers' => __('recruitment.unavailable', [], $locale)]);
            }
            $snapshots[] = ['question_id' => $question->id, 'question' => $text, 'type' => $question->type,
                'short_label' => $question->short_label, 'show_in_email_subject' => $question->show_in_email_subject,
                'value' => $value, 'answer_label' => $label, 'locale' => $locale, 'sort_order' => $question->sort_order];
        }

        return $snapshots;
    }
}
