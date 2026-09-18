<?php

namespace App\Services;

use App\Models\QuoteRequest;
use Illuminate\Http\Client\Response;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class CrmWebhookService
{
    public function enabled(): bool
    {
        return (bool) config('services.crm.enabled')
            && filled(config('services.crm.webhook_url'))
            && filled(config('services.crm.webhook_secret'));
    }

    public function sendQuoteRequestCreated(
        QuoteRequest $quoteRequest
    ): ?Response {
        if (! $this->enabled()) {
            return null;
        }

        $quoteRequest->loadMissing('services');

        $payload = [
            'event' => 'quote_request.created',
            'version' => 1,

            'idempotency_key' => sprintf(
                'quote_request.created:%s',
                $quoteRequest->reference
            ),

            'occurred_at' => now()->toIso8601String(),

            'data' => [
                'id' => $quoteRequest->id,
                'reference' => $quoteRequest->reference,
                'status' => $quoteRequest->status,
                'locale' => $quoteRequest->locale,

                'customer' => [
                    'first_name' => $quoteRequest->first_name,
                    'last_name' => $quoteRequest->last_name,
                    'email' => $quoteRequest->email,
                    'phone' => $quoteRequest->phone,
                ],

                'address' => [
                    'street' => $quoteRequest->street,
                    'house_number' => $quoteRequest->house_number,
                    'postcode' => $quoteRequest->postcode,
                    'city' => $quoteRequest->city,
                ],

                'services' => $quoteRequest->services
                    ->map(
                        fn ($service) => [
                            'id' => $service->id,

                            'name' => $service->getTranslation(
                                'name',
                                $quoteRequest->locale,
                                false
                            ),

                            'slug' => $service->getTranslation(
                                'slug',
                                $quoteRequest->locale,
                                false
                            ),
                        ]
                    )
                    ->values()
                    ->all(),

                'message' => $quoteRequest->message,

                'privacy_consent_at' => $quoteRequest
                    ->privacy_consent_at
                    ?->toIso8601String(),

                'created_at' => $quoteRequest
                    ->created_at
                    ?->toIso8601String(),
            ],
        ];

        $body = json_encode(
            $payload,
            JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
        );

        if ($body === false) {
            throw new RuntimeException(
                'Could not encode CRM webhook payload.'
            );
        }

        $timestamp = (string) now()->timestamp;

        $signature = hash_hmac(
            'sha256',
            $timestamp . '.' . $body,
            config('services.crm.webhook_secret')
        );

        $response = Http::acceptJson()
            ->withHeaders([
                'X-Nu-Isoleren-Event' => 'quote_request.created',
                'X-Nu-Isoleren-Timestamp' => $timestamp,
                'X-Nu-Isoleren-Signature' => $signature,
                'X-Idempotency-Key' => sprintf(
                    'quote_request.created:%s',
                    $quoteRequest->reference
                ),
            ])
            ->withBody($body, 'application/json')
            ->timeout(config('services.crm.timeout'))
            ->post(config('services.crm.webhook_url'));

        if ($response->failed()) {
            throw new RuntimeException(
                sprintf(
                    'CRM webhook failed with status %s: %s',
                    $response->status(),
                    $response->body()
                )
            );
        }

        return $response;
    }
}