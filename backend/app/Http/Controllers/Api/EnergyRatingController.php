<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CalculateEnergyRatingRequest;
use App\Services\EnergyRating\EnergyRatingService;
use Illuminate\Http\JsonResponse;
use RuntimeException;

class EnergyRatingController extends Controller
{
    public function __construct(
        private readonly EnergyRatingService $energyRatingService,
    ) {
    }

    public function estimate(
        CalculateEnergyRatingRequest $request,
    ): JsonResponse {
        try {
            $result = $this->energyRatingService->calculate(
                $request->validated()
            );

            return response()->json($result);
        } catch (RuntimeException $exception) {
            return response()->json([
                'message' => $exception->getMessage(),
            ], 503);
        }
    }
}