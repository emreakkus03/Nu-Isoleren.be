<?php

namespace App\Support;

use App\Models\KnowledgeArticle;
use App\Models\Project;
use Illuminate\Filesystem\FilesystemAdapter;
use Illuminate\Support\Facades\Storage;

final class ContentResponse
{
    public static function formatKnowledgeArticleDetail(
        KnowledgeArticle $article,
        string $locale
    ): array {
        /** @var FilesystemAdapter $s3 */
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

            'alternate_slugs' => ContentSeo::slugs($article),

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

                'alternate_slugs' => ContentSeo::slugs($article),
            ]
                : null,
        ];
    }

    public static function formatKnowledgeArticleCard(
        KnowledgeArticle $article,
        string $locale
    ): array {
        /** @var FilesystemAdapter $s3 */
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

            'alternate_slugs' => ContentSeo::slugs($article),

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

    public static function formatProjectResponse(Project $project, string $locale): array
    {
        return [
            'id' => $project->id,
            'title' => $project->getTranslation('title', $locale, false) ?: $project->getTranslation('title', 'nl'),
            'slug' => $project->getTranslation('slug', $locale, false) ?: $project->getTranslation('slug', 'nl'),
            'all_slugs' => ContentSeo::slugs($project),
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
}
