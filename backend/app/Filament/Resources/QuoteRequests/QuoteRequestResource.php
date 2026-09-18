<?php

namespace App\Filament\Resources\QuoteRequests;

use App\Filament\Resources\QuoteRequests\Pages\EditQuoteRequest;
use App\Filament\Resources\QuoteRequests\Pages\ListQuoteRequests;
use App\Filament\Resources\QuoteRequests\Pages\ViewQuoteRequest;
use App\Filament\Resources\QuoteRequests\Schemas\QuoteRequestForm;
use App\Filament\Resources\QuoteRequests\Tables\QuoteRequestsTable;
use App\Models\QuoteRequest;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use UnitEnum;

class QuoteRequestResource extends Resource
{
    protected static ?string $model = QuoteRequest::class;

    protected static string | BackedEnum | null $navigationIcon =
        Heroicon::OutlinedDocumentText;

    protected static string | UnitEnum | null $navigationGroup =
        'Aanvragen';

    protected static ?string $navigationLabel =
        'Offerteaanvragen';

    protected static ?string $modelLabel =
        'offerteaanvraag';

    protected static ?string $pluralModelLabel =
        'offerteaanvragen';

    protected static ?string $recordTitleAttribute =
        'reference';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return QuoteRequestForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return QuoteRequestsTable::configure($table);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->with('services');
    }

    public static function canCreate(): bool
    {
        return false;
    }

    public static function getNavigationBadge(): ?string
    {
        $count = QuoteRequest::query()
            ->where('status', 'new')
            ->count();

        return $count > 0
            ? (string) $count
            : null;
    }

    public static function getNavigationBadgeColor(): ?string
    {
        return 'danger';
    }

    public static function getPages(): array
    {
        return [
            'index' => ListQuoteRequests::route('/'),
            'view' => ViewQuoteRequest::route('/{record}'),
            'edit' => EditQuoteRequest::route('/{record}/edit'),
        ];
    }
}