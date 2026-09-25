<?php

namespace App\Providers;

use App\Models\City;
use App\Models\Faq;
use App\Models\KnowledgeArticle;
use App\Models\KnowledgeCategory;
use App\Models\Material;
use App\Models\Project;
use App\Models\ProjectImage;
use App\Models\SeoRelation;
use App\Models\Service;
use App\Observers\SeoContentObserver;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        foreach ([Service::class, City::class, KnowledgeArticle::class, KnowledgeCategory::class, Project::class, ProjectImage::class, Material::class, Faq::class, SeoRelation::class] as $model) {
            $model::observe(SeoContentObserver::class);
        }
    }
}
