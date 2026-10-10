<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreJobApplicationRequest;
use App\Models\JobApplication;
use App\Models\Vacancy;
use App\Services\ApplicationAnswers;
use App\Services\RecruitmentMailService;
use App\Services\TurnstileService;
use App\Support\ContentSeo;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class JobApplicationController extends Controller
{
    public function store(StoreJobApplicationRequest $request, Vacancy $vacancy, TurnstileService $turnstile, ApplicationAnswers $answers, RecruitmentMailService $mail): JsonResponse
    {
        $data = $request->validated();
        $locale = $data['locale'];
        if (! $vacancy->isOpen() || ! isset(ContentSeo::slugs($vacancy)[$locale])) {
            throw ValidationException::withMessages(['vacancy' => __('recruitment.closed', [], $locale)]);
        }
        if (! $turnstile->verify($data['turnstile_token'] ?? null)) {
            return response()->json(['message' => $turnstile->failureMessage($locale), 'errors' => ['turnstile_token' => [$turnstile->failureMessage($locale)]]], 422);
        }
        if ($vacancy->require_cv_or_linkedin && ! $request->hasFile('cv') && empty($data['linkedin_url'])) {
            throw ValidationException::withMessages(['cv' => __('recruitment.cv_or_linkedin', [], $locale)]);
        }
        $application = DB::transaction(function () use ($data, $locale, $vacancy, $request, $answers): JobApplication {
            $current = Vacancy::whereKey($vacancy->id)->lockForUpdate()->firstOrFail();
            if (! $current->isOpen()) {
                throw ValidationException::withMessages(['vacancy' => __('recruitment.closed', [], $locale)]);
            }
            $snapshots = $answers->snapshots($current, $data['answers'], $locale);
            $application = $current->applications()->create([
                ...Arr::only($data, ['first_name', 'last_name', 'email', 'phone', 'city', 'linkedin_url', 'locale', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']),
                'vacancy_title' => $current->getTranslation('title', $locale, false),
                'has_cv' => $request->hasFile('cv'), 'source' => $data['utm_source'] ?? 'direct',
                'status' => 'new', 'submitted_at' => now(), 'privacy_accepted_at' => now(),
            ]);
            $application->answers()->createMany($snapshots);

            return $application;
        });
        $delivered = $mail->send($application, $request->file('cv'));

        return response()->json(['success' => $delivered, 'recorded' => true,
            'message' => __('recruitment.'.($delivered ? 'received' : 'mail_failed'), [], $locale)], $delivered ? 201 : 503);
    }
}
