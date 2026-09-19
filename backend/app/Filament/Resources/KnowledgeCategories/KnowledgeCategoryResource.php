<?php

namespace App\Filament\Resources\KnowledgeCategories;

use App\Filament\Resources\KnowledgeCategories\Pages\CreateKnowledgeCategory;
use App\Filament\Resources\KnowledgeCategories\Pages\EditKnowledgeCategory;
use App\Filament\Resources\KnowledgeCategories\Pages\ListKnowledgeCategories;
use App\Filament\Resources\KnowledgeCategories\Schemas\KnowledgeCategoryForm;
use App\Filament\Resources\KnowledgeCategories\Tables\KnowledgeCategoriesTable;
use App\Models\KnowledgeCategory;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables\Table;

class KnowledgeCategoryResource extends Resource
{
    protected static ?string $model = KnowledgeCategory::class;

    protected static ?string $navigationLabel = 'Kennisbank categorieën';

    protected static ?string $modelLabel = 'kennisbank categorie';

    protected static ?string $pluralModelLabel = 'kennisbank categorieën';

    protected static ?int $navigationSort = 20;

    public static function form(Schema $schema): Schema
    {
        return KnowledgeCategoryForm::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return KnowledgeCategoriesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListKnowledgeCategories::route('/'),
            'create' => CreateKnowledgeCategory::route('/create'),
            'edit' => EditKnowledgeCategory::route('/{record}/edit'),
        ];
    }
}