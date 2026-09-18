<?php

namespace App\Listeners;

use App\Events\QuoteRequestCreated;
use App\Services\BrevoService;

class SendQuoteRequestCustomerEmail
{
    public function __construct(
        private readonly BrevoService $brevo,
    ) {
    }

    public function handle(QuoteRequestCreated $event): void
    {

        $quoteRequest = $event->quoteRequest->loadMissing('services');

        $locale = in_array(
            $quoteRequest->locale,
            ['nl', 'fr', 'en'],
            true
        )
            ? $quoteRequest->locale
            : 'nl';

        $services = $quoteRequest->services
            ->map(
                fn ($service) => $service->getTranslation(
                    'name',
                    $locale,
                    false
                )
            )
            ->filter()
            ->values();

        $subject = match ($locale) {
            'fr' => "Nous avons bien reçu votre demande de devis - {$quoteRequest->reference}",
            'en' => "We received your quote request - {$quoteRequest->reference}",
            default => "We hebben uw offerteaanvraag ontvangen - {$quoteRequest->reference}",
        };

        $html = view(
            "emails.quote-requests.customer-{$locale}",
            [
                'quoteRequest' => $quoteRequest,
                'services' => $services,
            ]
        )->render();

        $this->brevo->send(
            to: [
                'email' => $quoteRequest->email,
                'name' => $quoteRequest->full_name,
            ],
            subject: $subject,
            htmlContent: $html,
            replyTo: [
                'email' => config('services.brevo.admin.email'),
                'name' => config('services.brevo.admin.name'),
            ],
            tags: [
                'quote-request',
                'customer',
                $locale,
            ],
        );
    }
}