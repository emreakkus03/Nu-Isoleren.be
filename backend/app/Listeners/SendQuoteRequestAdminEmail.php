<?php

namespace App\Listeners;

use App\Events\QuoteRequestCreated;
use App\Services\BrevoService;

class SendQuoteRequestAdminEmail
{
    public function __construct(
        private readonly BrevoService $brevo,
    ) {
    }

    public function handle(QuoteRequestCreated $event): void
    {

        $quoteRequest = $event->quoteRequest->loadMissing('services');

        $services = $quoteRequest->services
            ->map(
                fn ($service) => $service->getTranslation(
                    'name',
                    'nl',
                    false
                )
            )
            ->filter()
            ->implode(', ');

        $filamentUrl = rtrim(
            (string) config('services.filament_url'),
            '/'
        );

        $quoteUrl = $filamentUrl
            ? "{$filamentUrl}/quote-requests/{$quoteRequest->id}"
            : null;

        $html = view(
            'emails.quote-requests.admin',
            [
                'quoteRequest' => $quoteRequest,
                'services' => $services,
                'quoteUrl' => $quoteUrl,
            ]
        )->render();

        $this->brevo->send(
            to: [
                'email' => config('services.brevo.admin.email'),
                'name' => config('services.brevo.admin.name'),
            ],
            subject: "Nieuwe offerteaanvraag {$quoteRequest->reference} - {$quoteRequest->city}",
            htmlContent: $html,
            replyTo: [
                'email' => $quoteRequest->email,
                'name' => $quoteRequest->full_name,
            ],
            tags: [
                'quote-request',
                'admin',
            ],
        );
    }
}