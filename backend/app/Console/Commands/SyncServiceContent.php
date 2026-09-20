<?php

namespace App\Console\Commands;

use App\Models\Service;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class SyncServiceContent extends Command
{
    protected $signature = 'services:sync-content
                            {--service= : Alleen één specifieke dienst synchroniseren}
                            {--dry-run : Alleen controleren zonder iets op te slaan}';

    protected $description = 'Vult de inhoud van bestaande diensten vanuit database/content/services.php';

    public function handle(): int
    {
        $path = database_path('content/services.php');

        if (!file_exists($path)) {
            $this->error('database/content/services.php bestaat niet.');

            return self::FAILURE;
        }

        $content = require $path;

        if (!is_array($content)) {
            $this->error('services.php moet een array retourneren.');

            return self::FAILURE;
        }

        $requestedService = $this->option('service');

        if ($requestedService) {
            if (!isset($content[$requestedService])) {
                $this->error(
                    "Dienst '{$requestedService}' bestaat niet in services.php."
                );

                return self::FAILURE;
            }

            $content = [
                $requestedService => $content[$requestedService],
            ];
        }

        foreach ($content as $key => $data) {
            $lookupSlug = $data['lookup_slug'] ?? $key;

            $service = Service::query()
                ->where('slug->nl', $lookupSlug)
                ->first();

            if (!$service) {
                $this->warn(
                    "Dienst niet gevonden: {$lookupSlug}"
                );

                continue;
            }

            $this->line(
                "Gevonden: {$service->getTranslation('name', 'nl', false)}"
            );

            if ($this->option('dry-run')) {
                continue;
            }

            DB::transaction(function () use (
                $service,
                $data
            ) {
                $fields = [
                    'name',
                    'slug',
                    'badge',
                    'short_description',
                    'eyebrow',
                    'hero_title',
                    'intro_text',
                    'sections',
                    'seo_title',
                    'seo_description',
                ];

                foreach ($fields as $field) {
                    if (!array_key_exists($field, $data)) {
                        continue;
                    }

                    $service->setTranslations(
                        $field,
                        $data[$field]
                    );
                }

                /*
                 * Deze velden worden BEWUST niet aangepast:
                 *
                 * thumbnail
                 * hero_image
                 * order_column
                 * is_active
                 * is_featured_home
                 *
                 * Relaties worden ook niet aangeraakt.
                 */

                $service->save();
            });

            $this->info("✓ {$lookupSlug} bijgewerkt");
        }

        if ($this->option('dry-run')) {
            $this->newLine();
            $this->warn(
                'DRY RUN voltooid. Er is niets aangepast.'
            );
        } else {
            $this->newLine();
            $this->info(
                'Alle dienstcontent is bijgewerkt.'
            );
        }

        return self::SUCCESS;
    }
}