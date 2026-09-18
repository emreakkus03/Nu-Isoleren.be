<?php

namespace App\Filament\Resources\QuoteRequests\Schemas;

use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class QuoteRequestForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Status')
                    ->schema([
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'new' => 'Nieuw',
                                'contacted' => 'Gecontacteerd',
                                'quoted' => 'Offerte verstuurd',
                                'won' => 'Gewonnen',
                                'lost' => 'Verloren',
                            ])
                            ->required(),
                    ]),
            ]);
    }
}