<?php

namespace App\Services\EnergyRating;

class IndicativeEnergyEstimator
{
    private const CEILING_HEIGHT = 2.6;
    private const ELECTRICITY_PRIMARY_FACTOR = 2.5;

    public function calculate(array $data, string $region): array
    {
        $floorArea = max(
            10,
            (float) $data['building']['heatedFloorArea']
        );

        $constructionYear = (int) $data['building']['constructionYear'];

        $geometry = $this->estimateGeometry(
            $data,
            $floorArea
        );

        $roofU = $this->roofUValue(
            $data['roof'],
            $constructionYear
        );

        $wallU = $this->wallUValue(
            $data['walls'],
            $constructionYear
        );

        $floorU = $this->floorUValue(
            $data['floor'],
            $constructionYear
        );

        $windowU = $this->windowUValue(
            $data['windows'],
            $constructionYear
        );

        $transmissionHeatLoss =
            ($roofU * $geometry['roofArea']) +
            ($wallU * $geometry['wallArea']) +
            ($floorU * $geometry['floorArea']) +
            ($windowU * $geometry['windowArea']);

        $transmissionHeatLoss *= 1.08;

        $ventilationHeatLoss =
            $this->ventilationHeatLoss(
                $data['ventilation'],
                $geometry['volume']
            );

        $totalHeatLossCoefficient =
            $transmissionHeatLoss +
            $ventilationHeatLoss;

        $degreeDays = $this->heatingDegreeDays(
            $region
        );

        $usefulHeatingDemand =
            $totalHeatLossCoefficient *
            $degreeDays *
            24 /
            1000;

        $usefulHeatingDemand *= 0.72;

        $spaceHeatingPrimary =
            $this->spaceHeatingPrimaryEnergy(
                $usefulHeatingDemand,
                $data['heating']
            );

        $hotWaterPrimary =
            $this->hotWaterPrimaryEnergy(
                $floorArea,
                $data['hotWater'],
                $data['heating'],
                $data['renewableEnergy']
            );

        $coolingPrimary =
            $this->coolingPrimaryEnergy(
                $floorArea,
                $data['cooling']
            );

        $auxiliaryPrimary =
            $this->auxiliaryPrimaryEnergy(
                $floorArea,
                $data['ventilation']
            );

        $grossPrimaryEnergy =
            $spaceHeatingPrimary +
            $hotWaterPrimary +
            $coolingPrimary +
            $auxiliaryPrimary;

        $pvCredit =
            $this->photovoltaicPrimaryCredit(
                $region,
                $data['renewableEnergy']
            );

        $pvCredit = min(
            $pvCredit,
            $grossPrimaryEnergy * 0.45
        );

        $netPrimaryEnergy =
            $grossPrimaryEnergy - $pvCredit;

        $estimatedScore = (int) round(
            $netPrimaryEnergy / $floorArea
        );

        $estimatedScore = max(
            -20,
            min(750, $estimatedScore)
        );

        $unknownCount = $this->countUnknowns(
            $data
        );

        $margin = $this->calculateMargin(
            $estimatedScore,
            $unknownCount
        );

        $scoreMin = max(
            -20,
            $estimatedScore - $margin
        );

        $scoreMax =
            $estimatedScore + $margin;

        return [
            'region' => $region,
            'estimatedScore' => $estimatedScore,
            'scoreMin' => $scoreMin,
            'scoreMax' => $scoreMax,
            'label' => $this->labelForRegion(
                $region,
                $estimatedScore
            ),
            'unit' => 'kWh/(m² jaar)',
            'methodologyVersion' => 'nu-isoleren-indicative-energy-balance-2026-v2',
            'confidence' => $unknownCount <= 2
                ? 'medium'
                : 'limited',
            'isOfficial' => false,
            'recommendations' => [],
        ];
    }

    private function estimateGeometry(
        array $data,
        float $floorArea
    ): array {
        $buildingType = $data['building']['type'];

        $floors = match ($buildingType) {
            'apartment' => 1,
            default => $floorArea >= 90 ? 2 : 1,
        };

        $footprint = $floorArea / $floors;

        $side = sqrt($footprint);

        $perimeter = 4 * $side;

        $facadeExposure = match ($buildingType) {
            'detached' => 1.00,
            'semi_detached' => 0.75,
            'terraced' => 0.50,
            'apartment' => 0.35,
            default => 0.75,
        };

        $grossWallArea =
            $perimeter *
            self::CEILING_HEIGHT *
            $floors *
            $facadeExposure;

        $windowRatio = $buildingType === 'apartment'
            ? 0.22
            : 0.18;

        $windowArea =
            $grossWallArea * $windowRatio;

        $wallArea = max(
            0,
            $grossWallArea - $windowArea
        );

        $roofFactor = match ($data['roof']['type']) {
            'pitched' => 1.15,
            'mixed' => 1.08,
            'flat' => 1.00,
            default => 0,
        };

        $roofArea =
            $data['roof']['type'] === 'no_direct_roof'
                ? 0
                : $footprint * $roofFactor;

        $floorBoundary =
            $data['floor']['boundary'];

        $exposedFloorArea =
            $floorBoundary === 'heated_space'
                ? 0
                : $footprint;

        return [
            'floors' => $floors,
            'footprint' => $footprint,
            'wallArea' => $wallArea,
            'windowArea' => $windowArea,
            'roofArea' => $roofArea,
            'floorArea' => $exposedFloorArea,
            'volume' =>
                $floorArea * self::CEILING_HEIGHT,
        ];
    }

    private function roofUValue(
        array $roof,
        int $year
    ): float {
        if ($roof['type'] === 'no_direct_roof') {
            return 0;
        }

        return match ($roof['insulationLocation']) {
            'none' => 2.50,

            'unknown', null =>
                $this->defaultUValue(
                    'roof',
                    $year
                ),

            'roof',
            'attic_floor',
            'both' =>
                $this->insulatedUValue(
                    'roof',
                    $roof['insulationMaterial'] ?? null,
                    $roof['insulationThicknessCm'] ?? null,
                    $year
                ),

            default =>
                $this->defaultUValue(
                    'roof',
                    $year
                ),
        };
    }

    private function wallUValue(
        array $walls,
        int $year
    ): float {
        return match ($walls['insulationType']) {
            'none' => 1.80,

            'unknown', null =>
                $this->defaultUValue(
                    'wall',
                    $year
                ),

            default =>
                $this->insulatedUValue(
                    'wall',
                    $walls['insulationMaterial'] ?? null,
                    $walls['insulationThicknessCm'] ?? null,
                    $year
                ),
        };
    }

    private function floorUValue(
        array $floor,
        int $year
    ): float {
        if ($floor['boundary'] === 'heated_space') {
            return 0;
        }

        return match ($floor['insulated']) {
            'no' => 1.70,

            'unknown', null =>
                $this->defaultUValue(
                    'floor',
                    $year
                ),

            'yes' =>
                $this->insulatedUValue(
                    'floor',
                    $floor['insulationMaterial'] ?? null,
                    $floor['insulationThicknessCm'] ?? null,
                    $year
                ),

            default =>
                $this->defaultUValue(
                    'floor',
                    $year
                ),
        };
    }

    private function insulatedUValue(
        string $part,
        ?string $material,
        ?float $thicknessCm,
        int $year
    ): float {
        if (
            $material === null ||
            $material === 'unknown' ||
            $thicknessCm === null ||
            $thicknessCm <= 0
        ) {
            return $this->defaultInsulatedUValue(
                $part,
                $year
            );
        }

        $lambda = match ($material) {
            'pir_pur' => 0.026,
            'eps_xps' => 0.034,
            'mineral_wool' => 0.037,
            'cellulose_wood_fibre' => 0.040,
            'other' => 0.040,
            default => 0.040,
        };

        $baseResistance = match ($part) {
            'roof' => 0.35,
            'wall' => 0.45,
            'floor' => 0.35,
            default => 0.35,
        };

        $insulationResistance =
            ($thicknessCm / 100) / $lambda;

        $uValue =
            1 /
            ($baseResistance +
                $insulationResistance);

        return max(
            0.12,
            min(2.50, $uValue)
        );
    }

    private function defaultUValue(
        string $part,
        int $year
    ): float {
        return match ($part) {
            'roof' => match (true) {
                $year < 1971 => 2.50,
                $year <= 1985 => 1.50,
                $year <= 1995 => 0.75,
                $year <= 2005 => 0.55,
                $year <= 2015 => 0.35,
                default => 0.24,
            },

            'wall' => match (true) {
                $year < 1971 => 1.80,
                $year <= 1985 => 1.50,
                $year <= 1995 => 1.15,
                $year <= 2005 => 0.80,
                $year <= 2015 => 0.45,
                default => 0.24,
            },

            'floor' => match (true) {
                $year < 1971 => 1.70,
                $year <= 1985 => 1.40,
                $year <= 1995 => 1.00,
                $year <= 2005 => 0.80,
                $year <= 2015 => 0.50,
                default => 0.30,
            },

            default => 1.00,
        };
    }

    private function defaultInsulatedUValue(
        string $part,
        int $year
    ): float {
        return match ($part) {
            'roof' => match (true) {
                $year < 1990 => 0.90,
                $year <= 2005 => 0.60,
                $year <= 2015 => 0.35,
                default => 0.24,
            },

            'wall' => match (true) {
                $year < 1990 => 1.00,
                $year <= 2005 => 0.70,
                $year <= 2015 => 0.40,
                default => 0.24,
            },

            'floor' => match (true) {
                $year < 1990 => 1.00,
                $year <= 2005 => 0.80,
                $year <= 2015 => 0.50,
                default => 0.30,
            },

            default => 0.80,
        };
    }

    private function windowUValue(
        array $windows,
        int $year
    ): float {
        $base = match ($windows['glazing']) {
            'single' => 5.80,
            'double' => 2.90,
            'high_efficiency_double' => 1.30,
            'triple' => 0.85,
            'mixed' => 2.10,

            'unknown' =>
                $this->defaultWindowUValue(
                    $year
                ),

            default =>
                $this->defaultWindowUValue(
                    $year
                ),
        };

        $frameAdjustment = match ($windows['frame']) {
            'pvc' => 0.00,
            'wood' => 0.10,
            'aluminium' => 0.30,
            'mixed' => 0.15,
            'unknown' => 0.20,
            default => 0.15,
        };

        return max(
            0.70,
            $base + $frameAdjustment
        );
    }

    private function defaultWindowUValue(
        int $year
    ): float {
        return match (true) {
            $year < 1980 => 5.20,
            $year <= 1999 => 2.90,
            $year <= 2009 => 1.80,
            $year <= 2015 => 1.50,
            default => 1.20,
        };
    }

    private function ventilationHeatLoss(
        array $ventilation,
        float $volume
    ): float {
        $airChanges = match (true) {
            $ventilation['mechanicalExtraction'] === 'yes' &&
            $ventilation['mechanicalSupply'] === 'yes' &&
            $ventilation['heatRecovery'] === 'yes'
                => 0.30,

            $ventilation['mechanicalExtraction'] === 'yes' &&
            $ventilation['mechanicalSupply'] === 'yes'
                => 0.55,

            $ventilation['mechanicalExtraction'] === 'yes'
                => 0.65,

            $ventilation['naturalOpenings'] === 'yes'
                => 0.75,

            default => 0.85,
        };

        return 0.34 *
            $airChanges *
            $volume;
    }

    private function heatingDegreeDays(
        string $region
    ): float {
        return match ($region) {
            'flanders' => 2500,
            'brussels' => 2400,
            'wallonia' => 2800,
            default => 2500,
        };
    }

    private function spaceHeatingPrimaryEnergy(
        float $usefulDemand,
        array $heating
    ): float {
        $system = $heating['systemType'];
        $source = $heating['energySource'];

        $performance = match ($system) {
            'condensing_boiler' => 0.92,
            'non_condensing_boiler' => 0.75,
            'heat_pump_air_water' => 3.20,
            'heat_pump_ground_water' => 4.00,
            'heat_pump_air_air' => 3.00,
            'electric_resistance' => 1.00,
            'stove' => 0.75,
            'district' => 0.95,
            'other' => 0.80,
            'unknown' => 0.75,
            default => 0.75,
        };

        $primaryFactor =
            $this->primaryEnergyFactor(
                $source,
                $system
            );

        return ($usefulDemand / $performance) *
            $primaryFactor;
    }

    private function primaryEnergyFactor(
        string $source,
        string $system
    ): float {
        if (
            in_array(
                $system,
                [
                    'heat_pump_air_water',
                    'heat_pump_ground_water',
                    'heat_pump_air_air',
                    'electric_resistance',
                ],
                true
            )
        ) {
            return self::ELECTRICITY_PRIMARY_FACTOR;
        }

        if (
            in_array(
                $source,
                [
                    'electric',
                    'heat_pump',
                ],
                true
            )
        ) {
            return self::ELECTRICITY_PRIMARY_FACTOR;
        }

        return 1.00;
    }

    private function hotWaterPrimaryEnergy(
        float $floorArea,
        array $hotWater,
        array $heating,
        array $renewable
    ): float {
        $usefulDemand =
            $floorArea * 18;

        if ($renewable['solarThermal'] === 'yes') {
            $usefulDemand *= 0.65;
        }

        return match ($hotWater['systemType']) {
            'same_as_heating' =>
                $this->spaceHeatingPrimaryEnergy(
                    $usefulDemand,
                    $heating
                ),

            'electric_boiler' =>
                ($usefulDemand / 0.90) *
                self::ELECTRICITY_PRIMARY_FACTOR,

            'heat_pump_boiler' =>
                ($usefulDemand / 2.50) *
                self::ELECTRICITY_PRIMARY_FACTOR,

            'gas_water_heater' =>
                $usefulDemand / 0.82,

            'solar_supported' =>
                ($usefulDemand * 0.55) / 0.90,

            'other' =>
                $usefulDemand / 0.80,

            'unknown' =>
                $usefulDemand / 0.75,

            default =>
                $usefulDemand / 0.75,
        };
    }

    private function coolingPrimaryEnergy(
        float $floorArea,
        array $cooling
    ): float {
        $finalEnergyPerM2 = match ($cooling['type']) {
            'none' => 0,
            'air_conditioning' => 6,
            'heat_pump' => 4,
            'other' => 5,
            'unknown' => 2,
            default => 0,
        };

        return
            $finalEnergyPerM2 *
            $floorArea *
            self::ELECTRICITY_PRIMARY_FACTOR;
    }

    private function auxiliaryPrimaryEnergy(
        float $floorArea,
        array $ventilation
    ): float {
        $finalEnergyPerM2 = 0.5;

        if (
            $ventilation['mechanicalExtraction'] === 'yes'
        ) {
            $finalEnergyPerM2 += 1.5;
        }

        if (
            $ventilation['mechanicalSupply'] === 'yes'
        ) {
            $finalEnergyPerM2 += 1.5;
        }

        if (
            $ventilation['heatRecovery'] === 'yes'
        ) {
            $finalEnergyPerM2 += 0.5;
        }

        return
            $finalEnergyPerM2 *
            $floorArea *
            self::ELECTRICITY_PRIMARY_FACTOR;
    }

    private function photovoltaicPrimaryCredit(
        string $region,
        array $renewable
    ): float {
        if (
            $renewable['solarPanels'] !== 'yes'
        ) {
            return 0;
        }

        $kwp = (float) (
            $renewable['solarPowerKwp'] ?? 0
        );

        $yieldPerKwp = match ($region) {
            'flanders' => 900,
            'brussels' => 900,
            'wallonia' => 850,
            default => 875,
        };

        $electricityProduction =
            $kwp * $yieldPerKwp;

        return
            $electricityProduction *
            self::ELECTRICITY_PRIMARY_FACTOR;
    }

    private function calculateMargin(
        int $score,
        int $unknownCount
    ): int {
        $percentage =
            0.18 +
            min(
                0.27,
                $unknownCount * 0.035
            );

        return max(
            35,
            (int) round(
                abs($score) * $percentage
            )
        );
    }

    private function labelForRegion(
        string $region,
        int $score
    ): string {
        return match ($region) {
            'flanders' =>
                $this->flandersLabel($score),

            'brussels' =>
                $this->brusselsLabel($score),

            'wallonia' =>
                $this->walloniaLabel($score),

            default => 'N/A',
        };
    }

    private function flandersLabel(
        int $score
    ): string {
        return match (true) {
            $score <= 0 => 'A+',
            $score <= 100 => 'A',
            $score <= 200 => 'B',
            $score <= 300 => 'C',
            $score <= 400 => 'D',
            $score <= 500 => 'E',
            default => 'F',
        };
    }

    private function brusselsLabel(
        int $score
    ): string {
        return match (true) {
            $score <= 45 => 'A',
            $score <= 95 => 'B',
            $score <= 150 => 'C',
            $score <= 210 => 'D',
            $score <= 275 => 'E',
            $score <= 345 => 'F',
            default => 'G',
        };
    }

    private function walloniaLabel(
        int $score
    ): string {
        return match (true) {
            $score <= 0 => 'A++',
            $score <= 45 => 'A+',
            $score <= 85 => 'A',
            $score <= 170 => 'B',
            $score <= 255 => 'C',
            $score <= 340 => 'D',
            $score <= 425 => 'E',
            $score <= 510 => 'F',
            default => 'G',
        };
    }

    private function countUnknowns(
        array $data
    ): int {
        $values = [
            $data['roof']['insulationLocation'] ?? null,
            $data['roof']['insulationMaterial'] ?? null,
            $data['walls']['insulationType'] ?? null,
            $data['walls']['insulationMaterial'] ?? null,
            $data['floor']['boundary'] ?? null,
            $data['floor']['insulated'] ?? null,
            $data['floor']['insulationMaterial'] ?? null,
            $data['windows']['glazing'] ?? null,
            $data['windows']['frame'] ?? null,
            $data['heating']['energySource'] ?? null,
            $data['heating']['systemType'] ?? null,
            $data['hotWater']['systemType'] ?? null,
            $data['cooling']['type'] ?? null,
            $data['ventilation']['naturalOpenings'] ?? null,
            $data['ventilation']['mechanicalExtraction'] ?? null,
            $data['ventilation']['mechanicalSupply'] ?? null,
            $data['ventilation']['heatRecovery'] ?? null,
            $data['renewableEnergy']['solarPanels'] ?? null,
            $data['renewableEnergy']['solarThermal'] ?? null,
        ];

        return count(
            array_filter(
                $values,
                fn ($value) =>
                    $value === null ||
                    $value === 'unknown'
            )
        );
    }
}