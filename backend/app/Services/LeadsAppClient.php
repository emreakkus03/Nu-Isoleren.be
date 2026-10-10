<?php

namespace App\Services;

use App\Models\ContactSubmission;
use Illuminate\Support\Facades\Log;
use App\Models\QuoteRequest;
use App\Models\Service;
use Illuminate\Support\Facades\Http;
use RuntimeException;
use Throwable;

final class LeadsAppClient
{
    public function send(ContactSubmission|QuoteRequest $lead): void
    {
        if (! config('services.leads_app.enabled')) {
            return;
        }

        foreach (['url', 'user', 'pass', 'sender'] as $key) {
            if (! is_string(config("services.leads_app.{$key}")) || blank(config("services.leads_app.{$key}"))) {
                throw new RuntimeException('Leads App configuration is incomplete.');
            }
        }

        $message = (string) $lead->message;
        if ($lead instanceof QuoteRequest) {
            $lead->loadMissing('services');
            $names = $lead->services->map(fn (Service $service): string => $service->getTranslation('name', $lead->locale));
            if ($names->isEmpty() || $names->contains(fn (string $name): bool => blank($name))) {
                throw new RuntimeException('Leads App service names are unavailable.');
            }
            $message = 'Diensten: '.$names->implode(', ');
            if (filled($lead->message)) {
                $message .= "\n\nOpmerking:\n".$lead->message;
            }
        }

        $payload = [
            'name' => trim($lead->first_name.' '.$lead->last_name),
            'email' => $lead->email,
            'phone' => (string) $lead->phone,
            'company' => '',
            'address' => $lead instanceof QuoteRequest ? trim($lead->street.' '.$lead->house_number) : '',
            'postal' => $lead instanceof QuoteRequest ? $lead->postcode : '',
            'place' => $lead instanceof QuoteRequest ? $lead->city : '',
            'message' => $message,
            'sender' => config('services.leads_app.sender'),
        ];

        try {
            $response = Http::acceptJson()->asJson()->withHeaders([
                'Api-Key' => config('services.leads_app.user'),
                'Api-Password' => config('services.leads_app.pass'),
            ])->connectTimeout(5)->timeout(10)->withoutRedirecting()
                ->post(config('services.leads_app.url'), $payload);
        } catch (Throwable $e) {
    Log::warning('Leads App transport failed.', [
        'exception' => $e::class,
        'message' => $e->getMessage(),
    ]);

    throw new RuntimeException(
        'Leads App transport failed; delivery is uncertain.',
        previous: $e
    );
}

       if (! $response->successful()) {
    Log::warning('Leads App returned non-success response.', [
        'status' => $response->status(),
        'body' => mb_substr($response->body(), 0, 1000),
    ]);

    throw new RuntimeException('Leads App returned a non-success response.');
}
    }
}
