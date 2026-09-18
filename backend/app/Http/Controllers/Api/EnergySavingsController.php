<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CalculateEnergySavingsRequest;
use App\Services\EnergySavings\EnergySavingsService;
use Illuminate\Http\JsonResponse;

class EnergySavingsController extends Controller
{
    public function __construct(
        private readonly EnergySavingsService $energySavingsService,
    ) {
    }

    public function calculate(
        CalculateEnergySavingsRequest $request
    ): JsonResponse {
        return response()->json(
            $this->energySavingsService->calculate(
                $request->validated()
            )
        );
    }
}