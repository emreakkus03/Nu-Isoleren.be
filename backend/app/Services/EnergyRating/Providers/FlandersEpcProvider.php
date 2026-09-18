<?php

namespace App\Services\EnergyRating\Providers;

use App\Services\EnergyRating\IndicativeEnergyEstimator;

class FlandersEpcProvider
{
    public function __construct(
        private readonly IndicativeEnergyEstimator $estimator,
    ) {
    }

    public function calculate(array $data): array
    {
        return $this->estimator->calculate(
            $data,
            'flanders'
        );
    }
}