<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactSubmissionRequest;
use App\Mail\NewContactSubmissionMail;
use App\Models\ContactSubmission;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Mail;
use Throwable;

class ContactSubmissionController extends Controller
{
    public function store(
        StoreContactSubmissionRequest $request
    ): JsonResponse {
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
            Mail::to('emreakkus003@gmail.com')
                ->queue(
                    new NewContactSubmissionMail(
                        $submission
                    )
                );
        } catch (Throwable $exception) {
            report($exception);
        }

        return response()->json([
            'success' => true,
            'message' => 'Contactaanvraag ontvangen.',
            'id' => $submission->id,
        ], 201);
    }
}