<?php

namespace App\Console\Commands;

use App\Models\City;
use App\Support\CityContent;
use Illuminate\Console\Command;

class SyncCityContent extends Command
{
    protected $signature = 'cities:sync-content
                            {--city= : Vul slechts één stad in}';

    protected $description = 'Synchroniseer unieke city-detail content';

    public function handle(): int
    {
        $content = CityContent::all();

        $onlyCity = $this->option('city');

        if ($onlyCity) {
            if (! isset($content[$onlyCity])) {
                $this->error("Onbekende city slug: {$onlyCity}");

                return self::FAILURE;
            }

            $content = [
                $onlyCity => $content[$onlyCity],
            ];
        }

        foreach ($content as $slug => $data) {
            $city = City::where('slug', $slug)->first();

            if (! $city) {
                $this->warn("Niet gevonden: {$slug}");

                continue;
            }

            foreach ([
                'hero_title',
                'hero_intro',
                'local_title',
                'local_content',
                'solution_intro',
                'local_faqs',
                'seo_title',
                'seo_description',
            ] as $field) {
                $city->setTranslations(
                    $field,
                    $data[$field]
                );
            }

            $city->save();

            $this->info("✓ {$city->name}");
        }

        return self::SUCCESS;
    }
}