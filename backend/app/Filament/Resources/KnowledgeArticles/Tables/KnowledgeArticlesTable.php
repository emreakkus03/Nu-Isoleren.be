<?php

namespace App\Filament\Resources\KnowledgeArticles\Tables;

use App\Models\KnowledgeArticle;
use App\Models\KnowledgeCategory;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\TernaryFilter;
use Filament\Tables\Table;

class KnowledgeArticlesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('title')
                    ->label('Titel')
                    ->formatStateUsing(
                        fn (KnowledgeArticle $record) =>
                            $record->getTranslation(
                                'title',
                                'nl',
                                false
                            )
                    )
                    ->wrap(),

                TextColumn::make('knowledgeCategory.name')
                    ->label('Categorie')
                    ->formatStateUsing(
                        fn (
                            mixed $state,
                            KnowledgeArticle $record
                        ) =>
                            $record->knowledgeCategory
                                ?->getTranslation(
                                    'name',
                                    'nl',
                                    false
                                )
                    )
                    ->badge(),

                TextColumn::make('service.name')
                    ->label('Dienst')
                    ->formatStateUsing(
                        fn (
                            mixed $state,
                            KnowledgeArticle $record
                        ) =>
                            $record->service
                                ?->getTranslation(
                                    'name',
                                    'nl',
                                    false
                                )
                    )
                    ->placeholder('—'),

                IconColumn::make('featured')
                    ->label('Uitgelicht')
                    ->boolean(),

                IconColumn::make('published')
                    ->label('Online')
                    ->boolean(),

                TextColumn::make('published_at')
                    ->label('Publicatie')
                    ->dateTime('d/m/Y H:i')
                    ->placeholder('—')
                    ->sortable(),

                TextColumn::make('updated_at')
                    ->label('Gewijzigd')
                    ->dateTime('d/m/Y H:i')
                    ->sortable(),
            ])
            ->filters([
                SelectFilter::make('knowledge_category_id')
                    ->label('Categorie')
                    ->options(
                        fn () => KnowledgeCategory::query()
                            ->orderBy('sort_order')
                            ->get()
                            ->mapWithKeys(
                                fn (KnowledgeCategory $category) => [
                                    $category->id =>
                                        $category->getTranslation(
                                            'name',
                                            'nl',
                                            false
                                        ),
                                ]
                            )
                            ->all()
                    ),

                TernaryFilter::make('published')
                    ->label('Gepubliceerd'),

                TernaryFilter::make('featured')
                    ->label('Uitgelicht'),
            ])
            ->defaultSort('published_at', 'desc')
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