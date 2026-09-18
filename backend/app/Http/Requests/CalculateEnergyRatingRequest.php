<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CalculateEnergyRatingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $currentYear = now()->year;

        $roofType = $this->input('roof.type');
        $roofLocation = $this->input('roof.insulationLocation');
        $roofMaterial = $this->input('roof.insulationMaterial');

        $wallType = $this->input('walls.insulationType');
        $wallMaterial = $this->input('walls.insulationMaterial');

        $floorBoundary = $this->input('floor.boundary');
        $floorInsulated = $this->input('floor.insulated');
        $floorMaterial = $this->input('floor.insulationMaterial');

        $solarPanels = $this->input('renewableEnergy.solarPanels');

        return [
            'region' => [
                'required',
                Rule::in([
                    'flanders',
                    'brussels',
                    'wallonia',
                ]),
            ],

            'building' => [
                'required',
                'array',
            ],

            'building.type' => [
                'required',
                Rule::in([
                    'detached',
                    'semi_detached',
                    'terraced',
                    'apartment',
                ]),
            ],

            'building.constructionYear' => [
                'required',
                'integer',
                'min:1800',
                "max:{$currentYear}",
            ],

            'building.heatedFloorArea' => [
                'required',
                'numeric',
                'min:10',
                'max:2000',
            ],

            'roof' => [
                'required',
                'array',
            ],

            'roof.type' => [
                'required',
                Rule::in([
                    'pitched',
                    'flat',
                    'mixed',
                    'no_direct_roof',
                ]),
            ],

            'roof.insulationLocation' => [
                Rule::requiredIf(
                    $roofType !== 'no_direct_roof'
                ),
                'nullable',
                Rule::in([
                    'roof',
                    'attic_floor',
                    'both',
                    'none',
                    'unknown',
                ]),
            ],

            'roof.insulationMaterial' => [
                Rule::requiredIf(
                    in_array(
                        $roofLocation,
                        ['roof', 'attic_floor', 'both'],
                        true
                    )
                ),
                'nullable',
                Rule::in([
                    'mineral_wool',
                    'pir_pur',
                    'eps_xps',
                    'cellulose_wood_fibre',
                    'other',
                    'unknown',
                ]),
            ],

            'roof.insulationThicknessCm' => [
                Rule::requiredIf(
                    in_array(
                        $roofLocation,
                        ['roof', 'attic_floor', 'both'],
                        true
                    ) &&
                    $roofMaterial !== null &&
                    $roofMaterial !== 'unknown'
                ),
                'nullable',
                'numeric',
                'gt:0',
                'max:100',
            ],

            'walls' => [
                'required',
                'array',
            ],

            'walls.insulationType' => [
                'required',
                Rule::in([
                    'cavity',
                    'external',
                    'internal',
                    'mixed',
                    'none',
                    'unknown',
                ]),
            ],

            'walls.insulationMaterial' => [
                Rule::requiredIf(
                    $wallType !== null &&
                    !in_array(
                        $wallType,
                        ['none', 'unknown'],
                        true
                    )
                ),
                'nullable',
                Rule::in([
                    'mineral_wool',
                    'pir_pur',
                    'eps_xps',
                    'cellulose_wood_fibre',
                    'other',
                    'unknown',
                ]),
            ],

            'walls.insulationThicknessCm' => [
                Rule::requiredIf(
                    $wallType !== null &&
                    !in_array(
                        $wallType,
                        ['none', 'unknown'],
                        true
                    ) &&
                    $wallMaterial !== null &&
                    $wallMaterial !== 'unknown'
                ),
                'nullable',
                'numeric',
                'gt:0',
                'max:100',
            ],

            'floor' => [
                'required',
                'array',
            ],

            'floor.boundary' => [
                'required',
                Rule::in([
                    'ground',
                    'basement',
                    'crawl_space',
                    'outside',
                    'heated_space',
                    'unknown',
                ]),
            ],

            'floor.insulated' => [
                Rule::requiredIf(
                    $floorBoundary !== null &&
                    $floorBoundary !== 'heated_space'
                ),
                'nullable',
                Rule::in([
                    'yes',
                    'no',
                    'unknown',
                ]),
            ],

            'floor.insulationMaterial' => [
                Rule::requiredIf(
                    $floorInsulated === 'yes'
                ),
                'nullable',
                Rule::in([
                    'mineral_wool',
                    'pir_pur',
                    'eps_xps',
                    'cellulose_wood_fibre',
                    'other',
                    'unknown',
                ]),
            ],

            'floor.insulationThicknessCm' => [
                Rule::requiredIf(
                    $floorInsulated === 'yes' &&
                    $floorMaterial !== null &&
                    $floorMaterial !== 'unknown'
                ),
                'nullable',
                'numeric',
                'gt:0',
                'max:100',
            ],

            'windows' => [
                'required',
                'array',
            ],

            'windows.glazing' => [
                'required',
                Rule::in([
                    'single',
                    'double',
                    'high_efficiency_double',
                    'triple',
                    'mixed',
                    'unknown',
                ]),
            ],

            'windows.frame' => [
                'required',
                Rule::in([
                    'wood',
                    'pvc',
                    'aluminium',
                    'mixed',
                    'unknown',
                ]),
            ],

            'heating' => [
                'required',
                'array',
            ],

            'heating.energySource' => [
                'required',
                Rule::in([
                    'gas',
                    'oil',
                    'heat_pump',
                    'electric',
                    'wood_pellets',
                    'district',
                    'other',
                    'unknown',
                ]),
            ],

            'heating.systemType' => [
                'required',
                Rule::in([
                    'condensing_boiler',
                    'non_condensing_boiler',
                    'heat_pump_air_water',
                    'heat_pump_ground_water',
                    'heat_pump_air_air',
                    'electric_resistance',
                    'stove',
                    'district',
                    'other',
                    'unknown',
                ]),
            ],

            'heating.installationYear' => [
                'nullable',
                'integer',
                'min:1950',
                "max:{$currentYear}",
            ],

            'hotWater' => [
                'required',
                'array',
            ],

            'hotWater.systemType' => [
                'required',
                Rule::in([
                    'same_as_heating',
                    'electric_boiler',
                    'heat_pump_boiler',
                    'gas_water_heater',
                    'solar_supported',
                    'other',
                    'unknown',
                ]),
            ],

            'cooling' => [
                'required',
                'array',
            ],

            'cooling.type' => [
                'required',
                Rule::in([
                    'none',
                    'air_conditioning',
                    'heat_pump',
                    'other',
                    'unknown',
                ]),
            ],

            'ventilation' => [
                'required',
                'array',
            ],

            'ventilation.naturalOpenings' => [
                'required',
                Rule::in([
                    'yes',
                    'no',
                    'unknown',
                ]),
            ],

            'ventilation.mechanicalExtraction' => [
                'required',
                Rule::in([
                    'yes',
                    'no',
                    'unknown',
                ]),
            ],

            'ventilation.mechanicalSupply' => [
                'required',
                Rule::in([
                    'yes',
                    'no',
                    'unknown',
                ]),
            ],

            'ventilation.heatRecovery' => [
                'required',
                Rule::in([
                    'yes',
                    'no',
                    'unknown',
                ]),
            ],

            'renewableEnergy' => [
                'required',
                'array',
            ],

            'renewableEnergy.solarPanels' => [
                'required',
                Rule::in([
                    'yes',
                    'no',
                    'unknown',
                ]),
            ],

            'renewableEnergy.solarPowerKwp' => [
                Rule::requiredIf(
                    $solarPanels === 'yes'
                ),
                'nullable',
                'numeric',
                'gt:0',
                'max:100',
            ],

            'renewableEnergy.solarThermal' => [
                'required',
                Rule::in([
                    'yes',
                    'no',
                    'unknown',
                ]),
            ],
        ];
    }
}