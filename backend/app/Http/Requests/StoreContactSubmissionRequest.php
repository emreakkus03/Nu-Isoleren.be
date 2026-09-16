<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreContactSubmissionRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'first_name' => [
                'required',
                'string',
                'max:100',
            ],
            'last_name' => [
                'required',
                'string',
                'max:100',
            ],
            'email' => [
                'required',
                'email',
                'max:255',
            ],
            'phone' => [
                'nullable',
                'string',
                'max:50',
            ],
            'message' => [
                'required',
                'string',
                'min:10',
                'max:5000',
            ],
            'privacy_accepted' => [
                'required',
                'accepted',
            ],
            'locale' => [
                'required',
                Rule::in([
                    'nl',
                    'fr',
                    'en',
                ]),
            ],
            'source' => [
                'nullable',
                'string',
                'max:100',
            ],
        ];
    }
}