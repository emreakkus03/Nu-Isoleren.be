<?php

use App\Models\City;
use App\Models\Project;
use App\Models\Service;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;

Route::middleware('throttle:60,1')->get('/featured-projects', function (Request $request) {
    $locale = $request->query('locale', 'nl');

    return Project::query()
        ->where('published', true)
        ->where('featured_on_home', true)
        ->with([
            'service',
            'city',
            'images' => fn ($q) => $q->orderBy('sort_order'),
        ])
        ->orderBy('sort_order')
        ->latest()
        ->take(3)
        ->get()
        ->map(fn ($project) => formatProjectResponse($project, $locale));
});

Route::middleware('throttle:60,1')->get('/projects', function (Request $request) {
    $locale = $request->query('locale', 'nl');
    $serviceSlug = $request->query('dienst') ?? $request->query('service');
    $citySlug = $request->query('locatie') ?? $request->query('localisation') ?? $request->query('location') ?? $request->query('city');
    $perPage = (int) $request->query('per_page', 9);

    $query = Project::query()
        ->where('published', true)
        ->with([
            'service',
            'city',
            'images' => fn ($q) => $q->orderBy('sort_order'),
        ]);

    if ($serviceSlug) {
        $query->whereHas('service', function ($q) use ($serviceSlug) {
            $q->where('slug->nl', $serviceSlug)
              ->orWhere('slug->fr', $serviceSlug)
              ->orWhere('slug->en', $serviceSlug);
        });
    }

    if ($citySlug) {
        $query->whereHas('city', function ($q) use ($citySlug) {
            $q->where('slug', $citySlug);
        });
    }

    $paginated = $query->orderBy('sort_order')
        ->latest()
        ->paginate($perPage);

    return response()->json([
        'data' => collect($paginated->items())->map(fn ($project) => formatProjectResponse($project, $locale)),
        'meta' => [
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'per_page' => $paginated->perPage(),
            'total' => $paginated->total(),
        ],
    ]);
});

Route::middleware('throttle:60,1')->get('/project-filters', function (Request $request) {
    $locale = $request->query('locale', 'nl');

    $services = Service::query()
        ->get()
        ->map(fn ($s) => [
            'id' => $s->id,
            'name' => $s->getTranslation('name', $locale, false) ?: $s->getTranslation('name', 'nl'),
            'slug' => $s->getTranslation('slug', $locale, false) ?: $s->getTranslation('slug', 'nl'),
        ]);

    $cities = City::query()
        ->whereHas('projects', fn ($q) => $q->where('published', true))
        ->orderBy('name')
        ->get(['id', 'name', 'slug', 'province']);

    return response()->json([
        'services' => $services,
        'cities' => $cities,
    ]);
});

Route::middleware('throttle:60,1')->get('/projects/{slug}', function (string $slug, Request $request) {
    $locale = $request->query('locale', 'nl');

    $project = Project::query()
        ->where('published', true)
        ->where(function ($query) use ($slug) {
            $query->where("slug->nl", $slug)
                  ->orWhere("slug->fr", $slug)
                  ->orWhere("slug->en", $slug);
        })
        ->with([
            'service',
            'city',
            'images' => fn ($q) => $q->orderBy('sort_order'),
        ])
        ->firstOrFail();

    return formatProjectResponse($project, $locale);
});

Route::middleware('throttle:60,1')->get('/faqs', function (Request $request) {
    $locale = $request->query('locale', 'nl');
    $serviceSlug = $request->query('service') ?? $request->query('dienst');
    $featuredHome = $request->boolean('featured_home');

    $query = Faq::query()
        ->with('service')
        ->orderBy('sort_order', 'asc');

    if ($featuredHome) {
        $query->where('is_featured_home', true);
    }

    if ($serviceSlug) {
        $query->whereHas('service', function ($q) use ($serviceSlug) {
            $q->where('slug->nl', $serviceSlug)
              ->orWhere('slug->fr', $serviceSlug)
              ->orWhere('slug->en', $serviceSlug);
        });
    }

    return $query->get()->map(function (Faq $faq) use ($locale) {
        return [
            'id' => $faq->id,
            'question' => $faq->getTranslation('question', $locale, false) ?: $faq->getTranslation('question', 'nl'),
            'answer' => $faq->getTranslation('answer', $locale, false) ?: $faq->getTranslation('answer', 'nl'),
            'category' => $faq->category,
            'service' => $faq->service ? [
                'id' => $faq->service->id,
                'name' => $faq->service->getTranslation('name', $locale, false) ?: $faq->service->getTranslation('name', 'nl'),
                'slug' => $faq->service->getTranslation('slug', $locale, false) ?: $faq->service->getTranslation('slug', 'nl'),
            ] : null,
            'is_featured_home' => (bool) $faq->is_featured_home,
            'sort_order' => (int) $faq->sort_order,
        ];
    });
});

Route::middleware('throttle:60,1')->get('/services', function (Request $request) {
    $locale = $request->query('locale', 'nl');
    $featuredHome = $request->boolean('featured_home');

    $query = Service::query()->where('is_active', true);

    if ($featuredHome) {
        $query->where('is_featured_home', true);
    }

    $services = $query->orderBy('order_column', 'asc')->get();

    return response()->json([
        'data' => $services->map(function ($service) use ($locale) {
            $thumbnailUrl = null;
                /** @var \Illuminate\Filesystem\FilesystemAdapter $s3 */
                $s3 = Storage::disk('s3');
            if ($service->thumbnail) {
                    $thumbnailUrl = $s3->url($service->thumbnail);
            }

            $heroImageUrl = null;
            if ($service->hero_image) {
                    $heroImageUrl = $s3->url($service->hero_image);
            }

            $sections = $service->getTranslation('sections', $locale, false) ?? [];
            if (is_array($sections)) {
                $sections = array_map(function ($sec) use ($s3) {
                    if (!empty($sec['images']) && is_array($sec['images'])) {
                        $sec['images'] = array_map(fn ($img) => $s3->url($img), $sec['images']);
                    }
                    return $sec;
                }, $sections);
            }

            return [
                'id' => $service->id,
                'name' => $service->getTranslation('name', $locale, false) ?: $service->getTranslation('name', 'nl'),
                'slug' => $service->getTranslation('slug', $locale, false) ?: $service->getTranslation('slug', 'nl'),
                'badge' => $service->getTranslation('badge', $locale, false) ?: $service->getTranslation('badge', 'nl'),
                'short_description' => $service->getTranslation('short_description', $locale, false),
                'eyebrow' => $service->getTranslation('eyebrow', $locale, false),
                'hero_title' => $service->getTranslation('hero_title', $locale, false),
                'intro_text' => $service->getTranslation('intro_text', $locale, false),
                'thumbnail' => $thumbnailUrl,
                'hero_image' => $heroImageUrl,
                'sections' => $sections,
                'seo_title' => $service->getTranslation('seo_title', $locale, false),
                'seo_description' => $service->getTranslation('seo_description', $locale, false),
            ];
        }),
    ]);
});

Route::middleware('throttle:60,1')->get('/services/{slug}', function (Request $request, string $slug) {
    $locale = $request->query('locale', 'nl');

    $service = Service::query()
        ->where('is_active', true)
        ->where(function ($query) use ($slug, $locale) {
            $query->where("slug->{$locale}", $slug)
                  ->orWhere("slug->nl", $slug);
        })
        ->first();

    if (! $service) {
        return response()->json(['message' => 'Service not found'], 404);
    }

    /** @var \Illuminate\Filesystem\FilesystemAdapter $s3 */
    $s3 = Storage::disk('s3');
    $thumbnailUrl = $service->thumbnail ? $s3->url($service->thumbnail) : null;
    $heroImageUrl = $service->hero_image ? $s3->url($service->hero_image) : null;

    $sections = $service->getTranslation('sections', $locale, false) ?? [];
    if (is_array($sections)) {
        $sections = array_map(function ($sec) use ($s3) {
            if (!empty($sec['images']) && is_array($sec['images'])) {
                $sec['images'] = array_map(fn ($img) => $s3->url($img), $sec['images']);
            }
            if (!empty($sec['image']) && is_string($sec['image'])) {
                $sec['image'] = $s3->url($sec['image']);
            }
            return $sec;
        }, $sections);
    }

    return response()->json([
        'data' => [
            'id' => $service->id,
            'name' => $service->getTranslation('name', $locale, false) ?: $service->getTranslation('name', 'nl'),
            'slug' => $service->getTranslation('slug', $locale, false) ?: $service->getTranslation('slug', 'nl'),
            'badge' => $service->getTranslation('badge', $locale, false) ?: $service->getTranslation('badge', 'nl'),
            'short_description' => $service->getTranslation('short_description', $locale, false),
            'eyebrow' => $service->getTranslation('eyebrow', $locale, false),
            'hero_title' => $service->getTranslation('hero_title', $locale, false),
            'intro_text' => $service->getTranslation('intro_text', $locale, false),
            'thumbnail' => $thumbnailUrl,
            'hero_image' => $heroImageUrl,
            'sections' => $sections,
            'seo_title' => $service->getTranslation('seo_title', $locale, false),
            'seo_description' => $service->getTranslation('seo_description', $locale, false),
        ],
    ]);
});

function formatProjectResponse(Project $project, string $locale): array
{
    return [
        'id' => $project->id,
        'title' => $project->getTranslation('title', $locale, false) ?: $project->getTranslation('title', 'nl'),
        'slug' => $project->getTranslation('slug', $locale, false) ?: $project->getTranslation('slug', 'nl'),
        'all_slugs' => [
            'nl' => $project->getTranslation('slug', 'nl', false),
            'fr' => $project->getTranslation('slug', 'fr', false) ?: $project->getTranslation('slug', 'nl', false),
            'en' => $project->getTranslation('slug', 'en', false) ?: $project->getTranslation('slug', 'nl', false),
        ],
        'short_description' => $project->getTranslation('short_description', $locale, false) ?: $project->getTranslation('short_description', 'nl'),
        'description' => $project->getTranslation('description', $locale, false) ?: $project->getTranslation('description', 'nl'),
        'meta_title' => $project->getTranslation('meta_title', $locale, false),
        'meta_description' => $project->getTranslation('meta_description', $locale, false),
        'service' => [
            'id' => $project->service?->id,
            'name' => $project->service?->getTranslation('name', $locale, false) ?: $project->service?->getTranslation('name', 'nl'),
            'slug' => $project->service?->getTranslation('slug', $locale, false) ?: $project->service?->getTranslation('slug', 'nl'),
        ],
        'city' => [
            'id' => $project->city?->id,
            'name' => $project->city?->name,
            'slug' => $project->city?->slug,
            'province' => $project->city?->province,
        ],
        'images' => $project->images,
    ];
}