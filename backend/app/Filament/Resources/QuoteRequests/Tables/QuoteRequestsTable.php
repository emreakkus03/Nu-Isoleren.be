<?php

namespace App\Filament\Resources\QuoteRequests\Tables;

use App\Models\QuoteRequest;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class QuoteRequestsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->defaultSort('created_at', 'desc')
            ->columns([
                TextColumn::make('reference')
                    ->label('Referentie')
                    ->searchable()
                    ->sortable()
                    ->weight('bold'),

                TextColumn::make('customer_name')
                    ->label('Klant')
                    ->state(
                        fn (QuoteRequest $record): string =>
                            "{$record->first_name} {$record->last_name}"
                    )
                    ->searchable([
                        'first_name',
                        'last_name',
                    ]),

                TextColumn::make('services_list')
                    ->label('Diensten')
                    ->state(
                        fn (QuoteRequest $record): array => $record
                            ->services
                            ->map(
                                fn ($service): string => $service
                                    ->getTranslation(
                                        'name',
                                        'nl',
                                        false
                                    )
                            )
                            ->filter()
                            ->values()
                            ->all()
                    )
                    ->badge(),

                TextColumn::make('city')
                    ->label('Gemeente')
                    ->searchable()
                    ->sortable(),

                TextColumn::make('postcode')
                    ->label('Postcode')
                    ->searchable(),

                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(
                        fn (string $state): string => match ($state) {
                            'new' => 'Nieuw',
                            'contacted' => 'Gecontacteerd',
                            'quoted' => 'Offerte verstuurd',
                            'won' => 'Gewonnen',
                            'lost' => 'Verloren',
                            default => $state,
                        }
                    )
                    ->color(
                        fn (string $state): string => match ($state) {
                            'new' => 'info',
                            'contacted' => 'warning',
                            'quoted' => 'primary',
                            'won' => 'success',
                            'lost' => 'danger',
                            default => 'gray',
                        }
                    )
                    ->sortable(),

                TextColumn::make('created_at')
                    ->label('Ontvangen')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'new' => 'Nieuw',
                        'contacted' => 'Gecontacteerd',
                        'quoted' => 'Offerte verstuurd',
                        'won' => 'Gewonnen',
                        'lost' => 'Verloren',
                    ]),
            ])
            ->recordActions([
                ViewAction::make(),

                EditAction::make()
                    ->label('Status wijzigen'),
            ]);
    }
}