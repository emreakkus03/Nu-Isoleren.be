<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Vacancy;
use App\Support\ContentSeo;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VacancyController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $locale = ContentSeo::locale((string) $request->query('locale', 'nl'));
        $vacancies = ContentSeo::availableQuery('vacancies', $locale)->orderBy('sort_order')->orderByDesc('published_at')->get();

        return response()->json(['data' => $vacancies->map(fn (Vacancy $vacancy): array => $this->format($vacancy, $locale))]);
    }

    public function show(Request $request, string $slug): JsonResponse
    {
        $locale = ContentSeo::locale((string) $request->query('locale', 'nl'));
        $records = Vacancy::whereIn('status', ['published', 'closed'])->where('published_at', '<=', now())
            ->where("slug->{$locale}", $slug)->limit(2)->get();
        abort_unless($records->count() === 1, 404);
        $vacancy = $records->first();
        abort_unless((ContentSeo::slugs($vacancy)[$locale] ?? null) === $slug, 404);
        $questions = $vacancy->questions()->where('active', true)->get()->map(fn ($q): array => $q->localized($locale));
        $ready = $questions->every(fn (array $q): bool => filled($q['question']) && collect($q['options'])->every(fn (array $o): bool => filled($o['label'])));

        return response()->json(['data' => $this->format($vacancy, $locale) + [
            'content' => $vacancy->getTranslation('content', $locale, false),
            'questions' => $questions,
            'application_available' => $vacancy->isOpen() && $ready,
            'require_cv_or_linkedin' => $vacancy->require_cv_or_linkedin,
            'max_cv_mb' => max(1, config('recruitment.max_cv_mb')),
        ]]);
    }

    private function format(Vacancy $vacancy, string $locale): array
    {
        return [
            'id' => $vacancy->id, 'status' => $vacancy->status, 'is_open' => $vacancy->isOpen(),
            'title' => $vacancy->getTranslation('title', $locale, false),
            'slug' => $vacancy->getTranslation('slug', $locale, false),
            'short_description' => $vacancy->getTranslation('short_description', $locale, false),
            'meta_title' => $vacancy->getTranslation('meta_title', $locale, false),
            'meta_description' => $vacancy->getTranslation('meta_description', $locale, false),
            'region' => $vacancy->region, 'employment_type' => $vacancy->employment_type,
            'location_city' => $vacancy->location_city, 'location_region' => $vacancy->location_region,
            'location_country' => $vacancy->location_country,
            'published_at' => $vacancy->published_at?->toIso8601String(),
            'valid_through' => $vacancy->valid_through?->toIso8601String(),
            'image' => $vacancy->image ? Storage::disk('s3')->url($vacancy->image) : null,
            ...ContentSeo::metadata($vacancy),
        ];
    }
}
