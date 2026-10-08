<?php

namespace App\Services;

use App\Jobs\SendLeadToLeadsApp;
use App\Models\ContactSubmission;
use App\Models\QuoteRequest;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Throwable;

final class LeadsAppDispatch
{
    public function dispatch(ContactSubmission|QuoteRequest $lead): void
    {
        if (! config('services.leads_app.enabled')) {
            return;
        }

        $type = $lead instanceof QuoteRequest ? 'quote' : 'contact';
        $id = (int) $lead->getKey();
        try {
            DB::afterCommit(function () use ($type, $id): void {
                try {
                    Bus::dispatch((new SendLeadToLeadsApp($type, $id))->afterCommit());
                } catch (Throwable) {
                    Log::warning('Leads App dispatch failed.', ['type' => $type, 'id' => $id]);
                }
            });
        } catch (Throwable) {
            Log::warning('Leads App dispatch registration failed.', ['type' => $type, 'id' => $id]);
        }
    }
}
