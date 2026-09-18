<?php

namespace App\Filament\Resources\QuoteRequests\Pages;

use App\Filament\Resources\QuoteRequests\QuoteRequestResource;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditQuoteRequest extends EditRecord
{
    protected static string $resource = QuoteRequestResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl(
            'view',
            [
                'record' => $this->record,
            ]
        );
    }
}