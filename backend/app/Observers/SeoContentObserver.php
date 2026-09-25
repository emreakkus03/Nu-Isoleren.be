<?php

namespace App\Observers;

use App\Services\SeoRefresh;
use Illuminate\Database\Eloquent\Model;

final class SeoContentObserver
{
    public function saved(Model $record): void
    {
        app(SeoRefresh::class)->request(app(SeoRefresh::class)->tags($record));
    }

    public function deleted(Model $record): void
    {
        app(SeoRefresh::class)->request(app(SeoRefresh::class)->tags($record));
    }
}
