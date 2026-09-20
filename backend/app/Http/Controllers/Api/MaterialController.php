<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Material;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MaterialController extends Controller
{
    private array $locales = [
        'nl',
        'fr',
        'en',
    ];

    public function index(Request $request): JsonResponse
    {
        $locale = $this->getLocale($request);

        app()->setLocale($locale);

        $materials = Material::query()
            ->where('is_active', true)
            ->with([
                'services' => function ($query) {
                    $query->where('services.is_active', true);
                },
            ])
            ->orderBy('sort_order')
            ->get()
            ->map(
                fn (Material $material) =>
                    $this->transformMaterial(
                        material: $material,
                        locale: $locale,
                        includeSections: false,
                    )
            );

        return response()->json([
            'data' => $materials,
        ]);
    }

    public function show(
        Request $request,
        string $slug,
    ): JsonResponse {
        $locale = $this->getLocale($request);

        app()->setLocale($locale);

        $material = Material::query()
            ->where('is_active', true)
            ->where(function ($query) use ($slug) {
                foreach ($this->locales as $locale) {
                    $query->orWhere(
                        "slug->{$locale}",
                        $slug,
                    );
                }
            })
            ->with([
                'services' => function ($query) {
                    $query->where('services.is_active', true);
                },
            ])
            ->firstOrFail();

        return response()->json([
            'data' => $this->transformMaterial(
                material: $material,
                locale: $locale,
                includeSections: true,
            ),
        ]);
    }

    private function transformMaterial(
        Material $material,
        string $locale,
        bool $includeSections,
    ): array {
        $data = [
            'id' => $material->id,

            'name' => $material->getTranslation(
                'name',
                $locale,
            ),

            'slug' => $material->getTranslation(
                'slug',
                $locale,
            ),

            'alternate_slugs' => [
                'nl' => $material->getTranslation(
                    'slug',
                    'nl',
                    false,
                ),

                'fr' => $material->getTranslation(
                    'slug',
                    'fr',
                    false,
                ),

                'en' => $material->getTranslation(
                    'slug',
                    'en',
                    false,
                ),
            ],

            'eyebrow' => $material->getTranslation(
                'eyebrow',
                $locale,
                false,
            ),

            'hero_title' => $material->getTranslation(
                'hero_title',
                $locale,
                false,
            ),

            'short_description' => $material->getTranslation(
                'short_description',
                $locale,
                false,
            ),

            'intro_text' => $material->getTranslation(
                'intro_text',
                $locale,
                false,
            ),

            'hero_image' => $this->getFileUrl(
                $material->hero_image,
            ),

            'thumbnail' => $this->getFileUrl(
                $material->thumbnail,
            ),

            'seo' => [
                'title' => $material->getTranslation(
                    'seo_title',
                    $locale,
                    false,
                ),

                'description' => $material->getTranslation(
                    'seo_description',
                    $locale,
                    false,
                ),
            ],

           'services' => $material->services
    ->map(function ($service) use ($locale) {
        return [
            'id' => $service->id,

            'name' => $service->getTranslation(
                'name',
                $locale,
            ),

            'slug' => $service->getTranslation(
                'slug',
                $locale,
            ),

            'badge' => $service->getTranslation(
                'badge',
                $locale,
                false,
            ),

            'short_description' => $service->getTranslation(
                'short_description',
                $locale,
                false,
            ),

            'thumbnail' => $this->getFileUrl(
                $service->thumbnail,
            ),
        ];
    })
    ->values(),

            'sort_order' => $material->sort_order,
        ];

        if ($includeSections) {
            $sections = $material->getTranslation(
                'sections',
                $locale,
                false,
            );

            $data['sections'] = collect(
                is_array($sections)
                    ? $sections
                    : []
            )
                ->filter(
                    fn (array $section) =>
                        $section['is_active'] ?? true
                )
                ->map(function (array $section) {
                    $section['images'] = collect(
                        $section['images'] ?? []
                    )
                        ->map(
                            fn (string $image) =>
                                $this->getFileUrl($image)
                        )
                        ->values()
                        ->all();

                    return $section;
                })
                ->values()
                ->all();
        }

        return $data;
    }

    private function getLocale(Request $request): string
    {
        $locale = $request->query(
            'locale',
            'nl',
        );

        return in_array(
            $locale,
            $this->locales,
            true,
        )
            ? $locale
            : 'nl';
    }

    private function getFileUrl(
        ?string $path,
    ): ?string {
        if (!$path) {
            return null;
        }

        /** @var \Illuminate\Filesystem\FilesystemAdapter $disk */
        $disk = Storage::disk('s3');

        return $disk->url(
            $path,
        );
    }
}