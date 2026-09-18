<?php

namespace App\Listeners;

use App\Events\QuoteRequestCreated;
use App\Services\CrmWebhookService;
use Throwable;

class SendQuoteRequestToCrm
{
    public function __construct(
        private readonly CrmWebhookService $crm,
    ) {
    }

    public function handle(QuoteRequestCreated $event): void
    {
        if (! $this->crm->enabled()) {
            return;
        }

        try {
            $this->crm->sendQuoteRequestCreated(
                $event->quoteRequest
            );
        } catch (Throwable $exception) {
            report($exception);
        }
    }
}