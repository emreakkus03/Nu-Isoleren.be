<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactSubmissionRequest;
use App\Models\ContactSubmission;
use App\Services\BrevoService;
use App\Services\LeadsAppDispatch;
use App\Services\TurnstileService;
use Illuminate\Http\JsonResponse;
use Throwable;

class ContactSubmissionController extends Controller
{
    public function store(
        StoreContactSubmissionRequest $request,
        BrevoService $brevo
    ): JsonResponse {
        $turnstile = app(TurnstileService::class);
        if (! $turnstile->verify($request->input('turnstile_token'))) {
            $message = $turnstile->failureMessage($request->validated('locale'));

            return response()->json(['message' => $message, 'errors' => ['turnstile_token' => [$message]]], 422);
        }

        $validated = $request->validated();

        $submission = ContactSubmission::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'message' => $validated['message'],
            'locale' => $validated['locale'],
            'source' => $validated['source'] ?? 'contact_page',
            'privacy_accepted_at' => now(),
            'status' => 'new',
            'crm_status' => 'pending',
        ]);

        try {
            $html = view('emails.contact-submission', [
                'submission' => $submission,
            ])->render();

            $brevo->send(
                to: [
                    'email' => config('services.brevo.admin.email'),
                    'name' => config('services.brevo.admin.name'),
                ],
                subject: "Nieuwe contactaanvraag van {$submission->full_name}",
                htmlContent: $html,
                replyTo: [
                    'email' => $submission->email,
                    'name' => $submission->full_name,
                ],
                tags: [
                    'contact-submission',
                    'admin',
                ],
            );
        } catch (Throwable $exception) {
            report($exception);
        }

        app(LeadsAppDispatch::class)->dispatch($submission);

        return response()->json([
            'success' => true,
            'message' => 'Contactaanvraag ontvangen.',
            'id' => $submission->id,
        ], 201);
    }
}
