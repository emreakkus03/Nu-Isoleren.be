<?php

namespace App\Filament\Resources\KnowledgeArticles;

use App\Filament\Resources\KnowledgeArticles\Pages\CreateKnowledgeArticle;
use App\Filament\Resources\KnowledgeArticles\Pages\EditKnowledgeArticle;
use App\Filament\Resources\KnowledgeArticles\Pages\ListKnowledgeArticles;
use App\Filament\Resources\KnowledgeArticles\Schemas\KnowledgeArticleForm;
use App\Filament\Resources\KnowledgeArticles\Tables\KnowledgeArticlesTable;
use App\Models\KnowledgeArticle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class KnowledgeArticleResource extends Resource
{
    protected static ?string $model = KnowledgeArticle::class;

    protected static ?string $navigationLabel = 'Kennisbank artikels';

    protected static ?string $modelLabel = 'kennisbank artikel';

    protected static ?string $pluralModelLabel = 'kennisbank artikels';

    protected static ?int $navigationSort = 21;

    public static function form(Schema $schema): Schema
    {
        return KnowledgeArticleForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KnowledgeArticlesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListKnowledgeArticles::route('/'),
            'create' => CreateKnowledgeArticle::route('/create'),
            'edit' => EditKnowledgeArticle::route('/{record}/edit'),
        ];
    }
}