<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreJobApplicationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        if (in_array($this->input('locale'), ['nl', 'fr', 'en'], true)) {
            app()->setLocale($this->input('locale'));
        }
        if (is_string($this->input('answers'))) {
            $this->merge(['answers' => json_decode($this->input('answers'), true)]);
        }
    }

    public function rules(): array
    {
        return [
            'locale' => ['required', Rule::in(['nl', 'fr', 'en'])],
            'first_name' => ['required', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:50'],
            'city' => ['required', 'string', 'max:255'],
            'linkedin_url' => ['nullable', 'url:https', 'max:500', function (string $attribute, mixed $value, \Closure $fail): void {
                $host = strtolower(parse_url($value, PHP_URL_HOST) ?? '');
                $path = parse_url($value, PHP_URL_PATH) ?? '';
                if (! ($host === 'linkedin.com' || str_ends_with($host, '.linkedin.com')) || ! preg_match('~^/(in|pub)/[^/]+~', $path)) {
                    $fail(__('recruitment.linkedin'));
                }
            }],
            'cv' => ['nullable', 'file', 'mimetypes:application/pdf', 'extensions:pdf', 'max:'.(max(1, config('recruitment.max_cv_mb')) * 1024)],
            'privacy_accepted' => ['required', 'accepted'],
            'answers' => ['present', 'array', 'max:100'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
            'utm_content' => ['nullable', 'string', 'max:255'],
            'utm_term' => ['nullable', 'string', 'max:255'],
            'turnstile_token' => ['nullable', 'string', 'max:2048'],
        ];
    }
}
