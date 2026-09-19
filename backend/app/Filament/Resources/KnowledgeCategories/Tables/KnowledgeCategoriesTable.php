<?php

namespace App\Filament\Resources\KnowledgeCategories\Tables;

use App\Models\KnowledgeCategory;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class KnowledgeCategoriesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Naam')
                    ->formatStateUsing(
                        fn (KnowledgeCategory $record) =>
                            $record->getTranslation('name', 'nl', false)
                    ),

                TextColumn::make('articles_count')
                    ->label('Artikels')
                    ->counts('articles')
                    ->sortable(),

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