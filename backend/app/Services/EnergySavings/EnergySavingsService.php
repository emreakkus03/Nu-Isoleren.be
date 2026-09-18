<?php

namespace App\Services\EnergySavings;

class EnergySavingsService
{
    private const UTILISATION_FACTOR = 0.85;

    public function calculate(array $data): array
    {
        $region = $data['region'];

        $measure = $data['measure']['type'];

        $surfaceArea = (float) $data['measure']['surfaceArea'];

        $constructionYear =
            (int) $data['building']['constructionYear'];

        $annualConsumption =
            (float) $data['heating']['annualConsumptionKwh'];

        $annualHeatingCost =
            isset($data['heating']['annualHeatingCost'])
            && $data['heating']['annualHeatingCost'] !== null
                ? (float) $data['heating']['annualHeatingCost']
                : null;

        $insulationStatus =
            $measure === 'roof'
                ? $data['currentInsulation']['roof']
                : $data['currentInsulation']['walls'];

        $uBefore = $this->currentUValue(
            $measure,
            $insulationStatus,
            $constructionYear
        );

        $uAfter = $this->targetUValue(
            $measure
        );

        $deltaU = max(
            0,
            $uBefore - $uAfter
        );

        $degreeDays =
            $this->heatingDegreeDays(
                $region
            );

        $usefulHeatSaving =
            $deltaU
            * $surfaceArea
            * $degreeDays
            * 24
            / 1000;

        $usefulHeatSaving *=
            self::UTILISATION_FACTOR;

        $systemEfficiency =
            $this->heatingEfficiency(
                $data['heating']['source']
            );

        $finalEnergySaving =
            $usefulHeatSaving
            / $systemEfficiency;

        $maximumSaving =
            $annualConsumption * 0.60;

        $finalEnergySaving = min(
            $finalEnergySaving,
            $maximumSaving
        );

        $finalEnergySaving = max(
            0,
            $finalEnergySaving
        );

        $percentageSaving =
            $annualConsumption > 0
                ? (
                    $finalEnergySaving
                    / $annualConsumption
                ) * 100
                : 0;

        $percentageSaving = min(
            60,
            max(0, $percentageSaving)
        );

        $uncertainty =
            $insulationStatus === 'unknown'
                ? 0.35
                : 0.25;

        $energySavingMin =
            $finalEnergySaving
            * (1 - $uncertainty);

        $energySavingMax =
            $finalEnergySaving
            * (1 + $uncertainty);

        $energySavingMax = min(
            $energySavingMax,
            $maximumSaving
        );

        $estimatedCostSaving = null;
        $costSavingMin = null;
        $costSavingMax = null;

        if (
            $annualHeatingCost !== null
            && $annualHeatingCost > 0
        ) {
            $estimatedCostSaving =
                $annualHeatingCost
                * ($percentageSaving / 100);

            $costSavingMin =
                $estimatedCostSaving
                * (1 - $uncertainty);

            $costSavingMax =
                $estimatedCostSaving
                * (1 + $uncertainty);
        }

        return [
            'estimatedEnergySavingKwh' =>
                $this->roundEnergy(
                    $finalEnergySaving
                ),

            'energySavingMinKwh' =>
                $this->roundEnergy(
                    $energySavingMin
                ),

            'energySavingMaxKwh' =>
                $this->roundEnergy(
                    $energySavingMax
                ),

            'estimatedPercentageSaving' =>
                round(
                    $percentageSaving,
                    1
                ),

            'estimatedCostSaving' =>
                $estimatedCostSaving !== null
                    ? (int) round(
                        $estimatedCostSaving
                    )
                    : null,

            'costSavingMin' =>
                $costSavingMin !== null
                    ? (int) round(
                        $costSavingMin
                    )
                    : null,

            'costSavingMax' =>
                $costSavingMax !== null
                    ? (int) round(
                        $costSavingMax
                    )
                    : null,

            'confidence' =>
                $insulationStatus === 'unknown'
                    ? 'limited'
                    : 'medium',

            'methodologyVersion' =>
                'nu-isoleren-energy-savings-2026-v1',

            'isIndicative' => true,
        ];
    }

    private function currentUValue(
        string $measure,
        string $status,
        int $constructionYear
    ): float {
        if ($measure === 'roof') {
            return $this->roofUValue(
                $status,
                $constructionYear
            );
        }

        return $this->wallUValue(
            $status,
            $constructionYear
        );
    }

    private function roofUValue(
        string $status,
        int $constructionYear
    ): float {
        return match ($status) {
            'none' => 2.50,

            'limited' => 0.80,

            'insulated' => 0.30,

            'unknown' =>
                $this->estimatedRoofUByYear(
                    $constructionYear
                ),

            default => 1.00,
        };
    }

    private function wallUValue(
        string $status,
        int $constructionYear
    ): float {
        return match ($status) {
            'none' => 1.80,

            'limited' => 1.00,

            'insulated' => 0.45,

            'unknown' =>
                $this->estimatedWallUByYear(
                    $constructionYear
                ),

            default => 1.00,
        };
    }

    private function estimatedRoofUByYear(
        int $year
    ): float {
        return match (true) {
            $year < 1971 => 2.50,
            $year <= 1985 => 1.50,
            $year <= 1995 => 0.75,
            $year <= 2005 => 0.55,
            $year <= 2015 => 0.35,
            default => 0.24,
        };
    }

    private function estimatedWallUByYear(
        int $year
    ): float {
        return match (true) {
            $year < 1971 => 1.80,
            $year <= 1985 => 1.50,
            $year <= 1995 => 1.15,
            $year <= 2005 => 0.80,
            $year <= 2015 => 0.45,
            default => 0.24,
        };
    }

    private function targetUValue(
        string $measure
    ): float {
        return match ($measure) {
            'cavity_wall' => 0.55,

            'roof' => 0.24,

            'external_wall' => 0.24,

            default => 0.50,
        };
    }

    private function heatingDegreeDays(
        string $region
    ): float {
        return match ($region) {
            'flanders' => 2400,
            'brussels' => 2400,
            'wallonia' => 2800,
            default => 2500,
        };
    }

    private function heatingEfficiency(
        string $source
    ): float {
        return match ($source) {
            'gas' => 0.90,
            'oil' => 0.82,
            'electric' => 1.00,
            'heat_pump' => 3.20,
            'wood_pellets' => 0.80,
            'other' => 0.85,
            default => 0.85,
        };
    }

    private function roundEnergy(
        float $value
    ): int {
        return (int) (
            round($value / 10) * 10
        );
    }
}