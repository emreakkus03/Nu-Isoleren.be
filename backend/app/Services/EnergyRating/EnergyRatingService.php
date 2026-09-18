<?php

namespace App\Services\EnergyRating;

use App\Services\EnergyRating\Providers\BrusselsPebProvider;
use App\Services\EnergyRating\Providers\FlandersEpcProvider;
use App\Services\EnergyRating\Providers\WalloniaPebProvider;
use InvalidArgumentException;

class EnergyRatingService
{
    public function __construct(
        private readonly FlandersEpcProvider $flanders,
        private readonly BrusselsPebProvider $brussels,
        private readonly WalloniaPebProvider $wallonia,
    ) {
    }

    public function calculate(array $data): array
    {
        return match ($data['region']) {
            'flanders' => $this->flanders->calculate($data),
            'brussels' => $this->brussels->calculate($data),
            'wallonia' => $this->wallonia->calculate($data),

            default => throw new InvalidArgumentException(
                'Unsupported energy region.'
            ),
        };
    }
}