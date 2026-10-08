<?php

namespace App\Jobs;

use App\Models\ContactSubmission;
use App\Models\QuoteRequest;
use App\Services\LeadsAppClient;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;
use RuntimeException;
use Throwable;

final class SendLeadToLeadsApp implements ShouldQueue
{
    use Queueable;

    public int $tries = 1;

    public int $timeout = 20;

    public bool $failOnTimeout = true;

    public function __construct(public string $type, public int $id) {}

    public function handle(LeadsAppClient $client): void
    {
        if (! config('services.leads_app.enabled')) {
            return;
        }

        try {
            $lead = match ($this->type) {
                'contact' => ContactSubmission::find($this->id),
                'quote' => QuoteRequest::with('services')->find($this->id),
                default => null,
            };
            if (! $lead) {
                return;
            }
            $client->send($lead);
        } catch (Throwable) {
            Log::warning('Leads App delivery failed; verify delivery before any manual retry.', ['type' => $this->type, 'id' => $this->id]);
            throw new RuntimeException('Leads App delivery failed; verify delivery before any manual retry.');
        }
    }
}
