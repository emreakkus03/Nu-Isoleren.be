<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CalculateEnergySavingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'region' => [
                'required',
                'string',
                'in:flanders,brussels,wallonia',
            ],

            'building' => [
                'required',
                'array',
            ],

            'building.type' => [
                'required',
                'string',
                'in:detached,semi_detached,terraced,apartment',
            ],

            'building.constructionYear' => [
                'required',
                'integer',
                'min:1800',
                'max:' . now()->year,
            ],

            'building.heatedFloorArea' => [
                'required',
                'numeric',
                'min:10',
                'max:2000',
            ],

            'currentInsulation' => [
                'required',
                'array',
            ],

            'currentInsulation.roof' => [
                'required',
                'string',
                'in:none,limited,insulated,unknown',
            ],

            'currentInsulation.walls' => [
                'required',
                'string',
                'in:none,limited,insulated,unknown',
            ],

            'measure' => [
                'required',
                'array',
            ],

            'measure.type' => [
                'required',
                'string',
                'in:cavity_wall,roof,external_wall',
            ],

            'measure.surfaceArea' => [
                'required',
                'numeric',
                'min:1',
                'max:1000',
            ],

            'heating' => [
                'required',
                'array',
            ],

            'heating.source' => [
                'required',
                'string',
                'in:gas,oil,electric,heat_pump,wood_pellets,other',
            ],

            'heating.annualConsumptionKwh' => [
                'required',
                'numeric',
                'min:100',
                'max:250000',
            ],

            'heating.annualHeatingCost' => [
                'nullable',
                'numeric',
                'min:0',
                'max:100000',
            ],
        ];
    }
}