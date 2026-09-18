<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreQuoteRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'service_ids' => [
                'required',
                'array',
                'min:1',
            ],

            'service_ids.*' => [
                'required',
                'integer',
                'distinct',
                'exists:services,id',
            ],

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
                'required',
                'string',
                'max:50',
            ],

            'street' => [
                'required',
                'string',
                'max:150',
            ],

            'house_number' => [
                'required',
                'string',
                'max:20',
            ],

            'postcode' => [
                'required',
                'string',
                'max:20',
            ],

            'city' => [
                'required',
                'string',
                'max:100',
            ],

            'message' => [
                'nullable',
                'string',
                'max:5000',
            ],

            'locale' => [
                'required',
                'string',
                Rule::in(['nl', 'fr', 'en']),
            ],

            'privacy_consent' => [
                'required',
                'accepted',
            ],
        ];
    }
}