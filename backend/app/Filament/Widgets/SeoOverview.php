<?php

namespace App\Filament\Widgets;

use App\Services\SeoInventory;
use App\Services\SeoRefresh;
use Filament\Notifications\Notification;
use Filament\Widgets\Widget;
use Illuminate\Support\Facades\DB;

final class SeoOverview extends Widget
{
    protected string $view = 'filament.widgets.seo-overview';

    protected int|string|array $columnSpan = 'full';

    public function refreshSeo(): void
    {
        abort_unless(auth()->check(), 403);
        app(SeoRefresh::class)->request(SeoRefresh::ALL);
        Notification::make()->title('SEO-refresh aangevraagd')->body('De queue vernieuwt onze eigen cache en sitemapdata.')->success()->send();
    }

    protected function getViewData(): array
    {
        $entries = collect(app(SeoInventory::class)->entries())->where('is_indexable', true);

        return ['counts' => $entries->countBy('type'), 'urls' => $entries->sum(fn (array $entry) => count($entry['slugs'])), 'status' => DB::table('seo_refresh_status')->where('id', 1)->first(), 'origin' => rtrim(config('seo.frontend_url'), '/')];
    }
}
