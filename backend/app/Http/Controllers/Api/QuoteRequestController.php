<?php

namespace App\Http\Controllers\Api;

use App\Events\QuoteRequestCreated;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreQuoteRequestRequest;
use App\Models\QuoteRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Throwable;

class QuoteRequestController extends Controller
{
    public function store(
        StoreQuoteRequestRequest $request
    ): JsonResponse {
        try {
            $quoteRequest = DB::transaction(function () use ($request) {
                $validated = $request->validated();

                $quoteRequest = QuoteRequest::create([
                    'reference' => 'TMP-' . Str::uuid(),
                    'first_name' => $validated['first_name'],
                    'last_name' => $validated['last_name'],
                    'email' => $validated['email'],
                    'phone' => $validated['phone'],
                    'street' => $validated['street'],
                    'house_number' => $validated['house_number'],
                    'postcode' => $validated['postcode'],
                    'city' => $validated['city'],
                    'message' => $validated['message'] ?? null,
                    'locale' => $validated['locale'],
                    'status' => 'new',
                    'privacy_consent_at' => now(),
                ]);

                $quoteRequest->update([
                    'reference' => sprintf(
                        'OFF-%s-%06d',
                        now()->format('Y'),
                        $quoteRequest->id
                    ),
                ]);

                $quoteRequest
                    ->services()
                    ->sync($validated['service_ids']);

                return $quoteRequest->load('services');
            });
        } catch (Throwable $exception) {
            report($exception);

            return response()->json([
                'success' => false,
                'message' => 'Could not create quote request.',
            ], 500);
        }

        try {
            QuoteRequestCreated::dispatch($quoteRequest);
        } catch (Throwable $exception) {
            report($exception);
        }

        return response()->json([
            'success' => true,
            'message' => 'Quote request created successfully.',
            'data' => [
                'reference' => $quoteRequest->reference,
                'status' => $quoteRequest->status,
                'created_at' => $quoteRequest->created_at,
                'services' => $quoteRequest->services
                    ->map(
                        fn ($service) => [
                            'id' => $service->id,
                            'name' => $service->getTranslation(
                                'name',
                                $quoteRequest->locale,
                                false
                            ),
                        ]
                    )
                    ->values(),
            ],
        ], 201);
    }
}