<?php

namespace App\Filament\Resources\Materials\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class MaterialsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Naam')
                    ->formatStateUsing(
                        fn ($record) =>
                            $record->getTranslation('name', 'nl')
                    )
                    ->searchable(),

                TextColumn::make('services.name')
                    ->label('Diensten')
                    ->badge()
                    ->formatStateUsing(
                        fn ($state) => $state
                    ),

                TextColumn::make('sort_order')
                    ->label('Volgorde')
                    ->sortable(),

                IconColumn::make('is_active')
                    ->label('Actief')
                    ->boolean(),

                TextColumn::make('updated_at')
                    ->label('Gewijzigd')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->defaultSort('sort_order')
            ->recordActions([
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}