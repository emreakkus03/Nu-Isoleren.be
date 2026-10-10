<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class VacancyFactory extends Factory
{
    public function definition(): array
    {
        $slug = fake()->unique()->slug();

        return ['status' => 'published', 'published_at' => now()->subDay(),
            'title' => ['nl' => 'Testfunctie', 'fr' => 'Fonction de test', 'en' => 'Test position'],
            'slug' => ['nl' => "nl-$slug", 'fr' => "fr-$slug", 'en' => "en-$slug"],
            'short_description' => ['nl' => 'Omschrijving', 'fr' => 'Présentation', 'en' => 'Description'],
            'content' => ['nl' => '<p>Inhoud</p>', 'fr' => '<p>Contenu</p>', 'en' => '<p>Content</p>'],
            'region' => 'Testregio', 'location_region' => 'Testregio', 'location_country' => 'BE',
            'employment_type' => 'CONTRACTOR', 'require_cv_or_linkedin' => true];
    }
}
