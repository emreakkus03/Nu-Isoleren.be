<?php

use App\Models\City;
use App\Models\Project;
use App\Models\Service;
use App\Models\Faq;
use App\Models\KnowledgeArticle;
use App\Models\KnowledgeCategory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\ContactSubmissionController;
use App\Http\Controllers\Api\EnergySavingsController;
use App\Http\Controllers\Api\QuoteRequestController;
use App\Http\Controllers\Api\EnergyRatingController;
use Illuminate\Support\Facades\Storage;

Route::post(
    '/contact-submissions',
    [ContactSubmissionController::class, 'store']
)->middleware('throttle:10,1');

Route::middleware('throttle:60,1')->get('/featured-projects', function (Request $request) {
    $locale = $request->query('locale', 'nl');

    return Project::query()
        ->where('published', true)
        ->where('featured_on_home', true)
        ->with([
            'service',
            'city',
            'images' => fn($q) => $q->orderBy('sort_order'),
        ])
        ->orderBy('sort_order')
        ->latest()
        ->take(3)
        ->get()
        ->map(fn($project) => formatProjectResponse($project, $locale));
});

Route::middleware('throttle:60,1')->get('/recent-projects', function (Request $request) {
    $locale = $request->query('locale', 'nl');
    $limit = min((int) $request->query('limit', 3), 6);

    return Project::query()
        ->where('published', true)
        ->with([
            'service',
            'city',
            'images' => fn($q) => $q->orderBy('sort_order'),
        ])
        ->latest()
        ->take($limit)
        ->get()
        ->map(fn($project) => formatProjectResponse($project, $locale));
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
            'images' => fn($q) => $q->orderBy('sort_order'),
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
        'data' => collect($paginated->items())->map(fn($project) => formatProjectResponse($project, $locale)),
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
        ->where('is_active', true)
        ->whereHas('projects', function ($query) {
            $query->where('published', true);
        })
        ->withCount([
            'projects as projects_count' => function ($query) {
                $query->where('published', true);
            },
        ])
        ->orderBy('order_column')
        ->get()
        ->map(fn($service) => [
            'id' => $service->id,
            'name' => $service->getTranslation('name', $locale, false)
                ?: $service->getTranslation('name', 'nl'),
            'slug' => $service->getTranslation('slug', $locale, false)
                ?: $service->getTranslation('slug', 'nl'),
            'count' => $service->projects_count,
        ]);

    $cities = City::query()
        ->whereHas('projects', function ($query) {
            $query->where('published', true);
        })
        ->withCount([
            'projects as projects_count' => function ($query) {
                $query->where('published', true);
            },
        ])
        ->orderBy('name')
        ->get()
        ->map(fn($city) => [
            'id' => $city->id,
            'name' => $city->name,
            'slug' => $city->slug,
            'province' => $city->province,
            'count' => $city->projects_count,
        ]);

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
            'images' => fn($q) => $q->orderBy('sort_order'),
        ])
        ->firstOrFail();

    return formatProjectResponse($project, $locale);
});

Route::middleware('throttle:60,1')->get('/faqs', function (Request $request) {
    $locale = $request->query('locale', 'nl');
    $serviceSlug = $request->query('service') ?? $request->query('dienst');
    $category = $request->query('category');
    $featuredHome = $request->boolean('featured_home');

    $query = Faq::query()
        ->with('service')
        ->orderBy('sort_order', 'asc');

    if ($featuredHome) {
        $query->where('is_featured_home', true);
    }

    if ($category) {
        $query->where('category', $category);
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
            'question' => $faq->getTranslation('question', $locale, false)
                ?: $faq->getTranslation('question', 'nl'),
            'answer' => $faq->getTranslation('answer', $locale, false)
                ?: $faq->getTranslation('answer', 'nl'),
            'category' => $faq->category,
            'service' => $faq->service ? [
                'id' => $faq->service->id,
                'name' => $faq->service->getTranslation('name', $locale, false)
                    ?: $faq->service->getTranslation('name', 'nl'),
                'slug' => $faq->service->getTranslation('slug', $locale, false)
                    ?: $faq->service->getTranslation('slug', 'nl'),
            ] : null,
            'is_featured_home' => (bool) $faq->is_featured_home,
            'sort_order' => (int) $faq->sort_order,
        ];
    });
});

Route::middleware('throttle:60,1')->get('/services', function (Request $request) {
    $locale = $request->query('locale', 'nl');
    $featuredHome = $request->boolean('featured_home');

    $query = Service::query()
        ->where('is_active', true);

    if ($featuredHome) {
        $query->where('is_featured_home', true);
    }

    $services = $query
        ->orderBy('order_column', 'asc')
        ->get();

    return response()->json([
        'data' => $services->map(function ($service) use ($locale) {
            /** @var \Illuminate\Filesystem\FilesystemAdapter $s3 */
            $s3 = Storage::disk('s3');

            $thumbnailUrl = $service->thumbnail
                ? $s3->url($service->thumbnail)
                : null;

            $heroImageUrl = $service->hero_image
                ? $s3->url($service->hero_image)
                : null;

            $sections = $service->getTranslation(
                'sections',
                $locale,
                false
            ) ?? [];

            if (is_array($sections)) {
                $sections = array_map(
                    function ($sec) use ($s3) {
                        if (
                            !empty($sec['images']) &&
                            is_array($sec['images'])
                        ) {
                            $sec['images'] = array_map(
                                fn($img) => $s3->url($img),
                                $sec['images']
                            );
                        }

                        return $sec;
                    },
                    $sections
                );
            }

            $nlSlug = $service->getTranslation(
                'slug',
                'nl',
                false
            );

            return [
                'id' => $service->id,

                'name' =>
                $service->getTranslation(
                    'name',
                    $locale,
                    false
                )
                    ?: $service->getTranslation(
                        'name',
                        'nl'
                    ),

                'slug' =>
                $service->getTranslation(
                    'slug',
                    $locale,
                    false
                )
                    ?: $nlSlug,

                'alternate_slugs' => [
                    'nl' =>
                    $nlSlug,

                    'fr' =>
                    $service->getTranslation(
                        'slug',
                        'fr',
                        false
                    )
                        ?: $nlSlug,

                    'en' =>
                    $service->getTranslation(
                        'slug',
                        'en',
                        false
                    )
                        ?: $nlSlug,
                ],

                'badge' =>
                $service->getTranslation(
                    'badge',
                    $locale,
                    false
                )
                    ?: $service->getTranslation(
                        'badge',
                        'nl'
                    ),

                'short_description' =>
                $service->getTranslation(
                    'short_description',
                    $locale,
                    false
                ),

                'eyebrow' =>
                $service->getTranslation(
                    'eyebrow',
                    $locale,
                    false
                ),

                'hero_title' =>
                $service->getTranslation(
                    'hero_title',
                    $locale,
                    false
                ),

                'intro_text' =>
                $service->getTranslation(
                    'intro_text',
                    $locale,
                    false
                ),

                'thumbnail' =>
                $thumbnailUrl,

                'hero_image' =>
                $heroImageUrl,

                'sections' =>
                $sections,

                'seo_title' =>
                $service->getTranslation(
                    'seo_title',
                    $locale,
                    false
                ),

                'seo_description' =>
                $service->getTranslation(
                    'seo_description',
                    $locale,
                    false
                ),
            ];
        }),
    ]);
});

Route::middleware('throttle:60,1')->get('/services/{slug}', function (
    Request $request,
    string $slug
) {
    $locale = $request->query('locale', 'nl');

    $service = Service::query()
        ->where('is_active', true)
        ->where(function ($query) use ($slug, $locale) {
            $query
                ->where("slug->{$locale}", $slug)
                ->orWhere('slug->nl', $slug)
                ->orWhere('slug->fr', $slug)
                ->orWhere('slug->en', $slug);
        })
        ->first();

    if (!$service) {
        return response()->json([
            'message' => 'Service not found',
        ], 404);
    }

    /** @var \Illuminate\Filesystem\FilesystemAdapter $s3 */
    $s3 = Storage::disk('s3');

    $thumbnailUrl = $service->thumbnail
        ? $s3->url($service->thumbnail)
        : null;

    $heroImageUrl = $service->hero_image
        ? $s3->url($service->hero_image)
        : null;

    $sections = $service->getTranslation(
        'sections',
        $locale,
        false
    ) ?? [];

    if (is_array($sections)) {
        $sections = array_map(
            function ($sec) use ($s3) {
                if (
                    !empty($sec['images']) &&
                    is_array($sec['images'])
                ) {
                    $sec['images'] = array_map(
                        fn($img) => $s3->url($img),
                        $sec['images']
                    );
                }

                if (
                    !empty($sec['image']) &&
                    is_string($sec['image'])
                ) {
                    $sec['image'] =
                        $s3->url($sec['image']);
                }

                return $sec;
            },
            $sections
        );
    }

    $nlSlug = $service->getTranslation(
        'slug',
        'nl',
        false
    );

    return response()->json([
        'data' => [
            'id' => $service->id,

            'name' =>
            $service->getTranslation(
                'name',
                $locale,
                false
            )
                ?: $service->getTranslation(
                    'name',
                    'nl'
                ),

            'slug' =>
            $service->getTranslation(
                'slug',
                $locale,
                false
            )
                ?: $nlSlug,

            'alternate_slugs' => [
                'nl' =>
                $nlSlug,

                'fr' =>
                $service->getTranslation(
                    'slug',
                    'fr',
                    false
                )
                    ?: $nlSlug,

                'en' =>
                $service->getTranslation(
                    'slug',
                    'en',
                    false
                )
                    ?: $nlSlug,
            ],

            'badge' =>
            $service->getTranslation(
                'badge',
                $locale,
                false
            )
                ?: $service->getTranslation(
                    'badge',
                    'nl'
                ),

            'short_description' =>
            $service->getTranslation(
                'short_description',
                $locale,
                false
            ),

            'eyebrow' =>
            $service->getTranslation(
                'eyebrow',
                $locale,
                false
            ),

            'hero_title' =>
            $service->getTranslation(
                'hero_title',
                $locale,
                false
            ),

            'intro_text' =>
            $service->getTranslation(
                'intro_text',
                $locale,
                false
            ),

            'thumbnail' =>
            $thumbnailUrl,

            'hero_image' =>
            $heroImageUrl,

            'sections' =>
            $sections,

            'seo_title' =>
            $service->getTranslation(
                'seo_title',
                $locale,
                false
            ),

            'seo_description' =>
            $service->getTranslation(
                'seo_description',
                $locale,
                false
            ),
        ],
    ]);
});

Route::get('/cities', function (Request $request) {
    $query = City::query()->orderBy('name');

    if ($request->boolean('featured')) {
        $query->where('is_featured', true);
    }

    $cities = $query->get();

    return response()->json([
        'all' => $cities,
        'grouped' => $cities->groupBy('province'),
    ]);
});

Route::get('/cities/{slug}', function ($slug) {
    $city = City::where('slug', $slug)
        ->with(['projects' => function ($query) {
            $query->latest()->take(6);
        }])
        ->firstOrFail();

    return response()->json($city);
});

Route::middleware('throttle:20,1')->post(
    '/energy-rating/estimate',
    [EnergyRatingController::class, 'estimate']
);

Route::middleware('throttle:20,1')->post(
    '/energy-savings/calculate',
    [EnergySavingsController::class, 'calculate']
);


Route::post('/quote-requests', [QuoteRequestController::class, 'store'])
    ->middleware('throttle:10,1');


Route::middleware('throttle:60,1')->get('/knowledge-categories', function (Request $request) {
    $locale = $request->query('locale', 'nl');

    $categories = KnowledgeCategory::query()
        ->where('is_active', true)
        ->whereHas('articles', function ($query) {
            $query->published();
        })
        ->withCount([
            'articles as articles_count' => function ($query) {
                $query->published();
            },
        ])
        ->orderBy('sort_order')
        ->get()
        ->map(fn(KnowledgeCategory $category) => [
            'id' => $category->id,

            'name' => $category->getTranslation('name', $locale, false)
                ?: $category->getTranslation('name', 'nl'),

            'slug' => $category->getTranslation('slug', $locale, false)
                ?: $category->getTranslation('slug', 'nl'),

            'alternate_slugs' => [
                'nl' => $category->getTranslation('slug', 'nl', false),
                'fr' => $category->getTranslation('slug', 'fr', false)
                    ?: $category->getTranslation('slug', 'nl', false),
                'en' => $category->getTranslation('slug', 'en', false)
                    ?: $category->getTranslation('slug', 'nl', false),
            ],

            'description' => $category->getTranslation('description', $locale, false)
                ?: $category->getTranslation('description', 'nl'),

            'count' => $category->articles_count,
        ]);

    return response()->json([
        'data' => $categories,
    ]);
});

Route::middleware('throttle:60,1')->get('/knowledge-articles', function (Request $request) {
    $locale = $request->query('locale', 'nl');
    $categorySlug = $request->query('category');
    $perPage = min((int) $request->query('per_page', 9), 24);

    $query = KnowledgeArticle::query()
        ->published()
        ->with([
            'knowledgeCategory',
            'service',
        ]);

    if ($categorySlug) {
        $query->whereHas('knowledgeCategory', function ($q) use ($categorySlug) {
            $q->where('slug->nl', $categorySlug)
                ->orWhere('slug->fr', $categorySlug)
                ->orWhere('slug->en', $categorySlug);
        });
    }

    $paginated = $query
        ->orderBy('sort_order')
        ->orderByDesc('published_at')
        ->paginate($perPage);

    return response()->json([
        'data' => collect($paginated->items())
            ->map(
                fn (KnowledgeArticle $article) =>
                    formatKnowledgeArticleCard($article, $locale)
            ),

        'meta' => [
            'current_page' => $paginated->currentPage(),
            'last_page' => $paginated->lastPage(),
            'per_page' => $paginated->perPage(),
            'total' => $paginated->total(),
        ],
    ]);
});

Route::middleware('throttle:60,1')->get('/featured-knowledge-articles', function (Request $request) {
    $locale = $request->query('locale', 'nl');
    $limit = min((int) $request->query('limit', 3), 6);

    $articles = KnowledgeArticle::query()
        ->published()
        ->where('featured', true)
        ->with([
            'knowledgeCategory',
            'service',
        ])
        ->orderBy('sort_order')
        ->orderByDesc('published_at')
        ->take($limit)
        ->get();

    return response()->json([
        'data' => $articles->map(
            fn (KnowledgeArticle $article) =>
                formatKnowledgeArticleCard($article, $locale)
        ),
    ]);
});


Route::middleware('throttle:60,1')->get('/knowledge-articles/{slug}', function (
    string $slug,
    Request $request
) {
    $locale = $request->query('locale', 'nl');

    $article = KnowledgeArticle::query()
        ->published()
        ->where(function ($query) use ($slug) {
            $query->where('slug->nl', $slug)
                ->orWhere('slug->fr', $slug)
                ->orWhere('slug->en', $slug);
        })
        ->with([
            'knowledgeCategory',
            'service',
        ])
        ->firstOrFail();

    $relatedArticles = KnowledgeArticle::query()
        ->published()
        ->where('id', '!=', $article->id)
        ->where(
            'knowledge_category_id',
            $article->knowledge_category_id
        )
        ->with([
            'knowledgeCategory',
            'service',
        ])
        ->orderByDesc('published_at')
        ->take(3)
        ->get();

    return response()->json([
        'data' => formatKnowledgeArticleDetail(
            $article,
            $locale
        ),

        'related_articles' => $relatedArticles
            ->map(
                fn (KnowledgeArticle $related) =>
                    formatKnowledgeArticleCard(
                        $related,
                        $locale
                    )
            )
            ->values(),
    ]);
});

function formatKnowledgeArticleDetail(
    KnowledgeArticle $article,
    string $locale
): array {
    /** @var \Illuminate\Filesystem\FilesystemAdapter $s3 */
    $s3 = Storage::disk('s3');

    $heroImageUrl = $article->hero_image
        ? $s3->url($article->hero_image)
        : null;

    $sections = $article->getTranslation(
        'sections',
        $locale,
        false
    ) ?? [];

    if (is_array($sections)) {
        $sections = array_map(
            function ($section) use ($s3) {
                if (
                    ! empty($section['images']) &&
                    is_array($section['images'])
                ) {
                    $section['images'] = array_map(
                        fn ($image) => $s3->url($image),
                        $section['images']
                    );
                }

                if (
                    ! empty($section['image']) &&
                    is_string($section['image'])
                ) {
                    $section['image'] = $s3->url(
                        $section['image']
                    );
                }

                return $section;
            },
            $sections
        );
    }

    return [
        'id' => $article->id,

        'title' => $article->getTranslation(
            'title',
            $locale,
            false
        ) ?: $article->getTranslation(
            'title',
            'nl'
        ),

        'slug' => $article->getTranslation(
            'slug',
            $locale,
            false
        ) ?: $article->getTranslation(
            'slug',
            'nl'
        ),

        'alternate_slugs' => [
            'nl' => $article->getTranslation(
                'slug',
                'nl',
                false
            ),

            'fr' => $article->getTranslation(
                'slug',
                'fr',
                false
            ) ?: $article->getTranslation(
                'slug',
                'nl',
                false
            ),

            'en' => $article->getTranslation(
                'slug',
                'en',
                false
            ) ?: $article->getTranslation(
                'slug',
                'nl',
                false
            ),
        ],

        'excerpt' => $article->getTranslation(
            'excerpt',
            $locale,
            false
        ) ?: $article->getTranslation(
            'excerpt',
            'nl'
        ),

        'intro' => $article->getTranslation(
            'intro',
            $locale,
            false
        ) ?: $article->getTranslation(
            'intro',
            'nl'
        ),

        'hero_image' => $heroImageUrl,

        'sections' => $sections,

        'seo_title' => $article->getTranslation(
            'seo_title',
            $locale,
            false
        ),

        'seo_description' => $article->getTranslation(
            'seo_description',
            $locale,
            false
        ),

        'published_at' => $article->published_at
            ?->toIso8601String(),

        'updated_at' => $article->updated_at
            ?->toIso8601String(),

        'category' => $article->knowledgeCategory
            ? [
                'id' => $article->knowledgeCategory->id,

                'name' => $article->knowledgeCategory
                    ->getTranslation(
                        'name',
                        $locale,
                        false
                    )
                    ?: $article->knowledgeCategory
                        ->getTranslation(
                            'name',
                            'nl'
                        ),

                'slug' => $article->knowledgeCategory
                    ->getTranslation(
                        'slug',
                        $locale,
                        false
                    )
                    ?: $article->knowledgeCategory
                        ->getTranslation(
                            'slug',
                            'nl'
                        ),
            ]
            : null,

        'service' => $article->service
            ? [
                'id' => $article->service->id,

                'name' => $article->service
                    ->getTranslation(
                        'name',
                        $locale,
                        false
                    )
                    ?: $article->service
                        ->getTranslation(
                            'name',
                            'nl'
                        ),

                'slug' => $article->service
                    ->getTranslation(
                        'slug',
                        $locale,
                        false
                    )
                    ?: $article->service
                        ->getTranslation(
                            'slug',
                            'nl'
                        ),

                'alternate_slugs' => [
                    'nl' => $article->service
                        ->getTranslation(
                            'slug',
                            'nl',
                            false
                        ),

                    'fr' => $article->service
                        ->getTranslation(
                            'slug',
                            'fr',
                            false
                        )
                        ?: $article->service
                            ->getTranslation(
                                'slug',
                                'nl',
                                false
                            ),

                    'en' => $article->service
                        ->getTranslation(
                            'slug',
                            'en',
                            false
                        )
                        ?: $article->service
                            ->getTranslation(
                                'slug',
                                'nl',
                                false
                            ),
                ],
            ]
            : null,
    ];
}

function formatKnowledgeArticleCard(
    KnowledgeArticle $article,
    string $locale
): array {
    /** @var \Illuminate\Filesystem\FilesystemAdapter $s3 */
    $s3 = Storage::disk('s3');

    $heroImageUrl = $article->hero_image
        ? $s3->url($article->hero_image)
        : null;

    return [
        'id' => $article->id,

        'title' => $article->getTranslation(
            'title',
            $locale,
            false
        ) ?: $article->getTranslation(
            'title',
            'nl'
        ),

        'slug' => $article->getTranslation(
            'slug',
            $locale,
            false
        ) ?: $article->getTranslation(
            'slug',
            'nl'
        ),

        'alternate_slugs' => [
            'nl' => $article->getTranslation(
                'slug',
                'nl',
                false
            ),

            'fr' => $article->getTranslation(
                'slug',
                'fr',
                false
            ) ?: $article->getTranslation(
                'slug',
                'nl',
                false
            ),

            'en' => $article->getTranslation(
                'slug',
                'en',
                false
            ) ?: $article->getTranslation(
                'slug',
                'nl',
                false
            ),
        ],

        'excerpt' => $article->getTranslation(
            'excerpt',
            $locale,
            false
        ) ?: $article->getTranslation(
            'excerpt',
            'nl'
        ),

        'hero_image' => $heroImageUrl,

        'category' => $article->knowledgeCategory
            ? [
                'id' => $article->knowledgeCategory->id,

                'name' => $article->knowledgeCategory
                    ->getTranslation(
                        'name',
                        $locale,
                        false
                    )
                    ?: $article->knowledgeCategory
                        ->getTranslation(
                            'name',
                            'nl'
                        ),

                'slug' => $article->knowledgeCategory
                    ->getTranslation(
                        'slug',
                        $locale,
                        false
                    )
                    ?: $article->knowledgeCategory
                        ->getTranslation(
                            'slug',
                            'nl'
                        ),
            ]
            : null,

        'published_at' => $article->published_at
            ?->toIso8601String(),

        'featured' => (bool) $article->featured,
    ];
}

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
