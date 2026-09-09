<?php

namespace App\Filament\Resources\Cities;

use App\Filament\Resources\Cities\Pages;
use App\Models\City;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Resources\Resource;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class CityResource extends Resource
{
    protected static ?string $model = City::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-map-pin';

    protected static ?string $navigationLabel = 'Gemeenten / Steden';

    protected static ?string $modelLabel = 'Stad';

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            TextInput::make('name')
                ->label('Stad / Gemeente')
                ->required()
                ->live(onBlur: true)
                ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),

            TextInput::make('slug')
                ->required()
                ->unique(ignoreRecord: true),

            TextInput::make('province')
                ->label('Provincie'),

            TextInput::make('region')
                ->label('Regio'),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Stad')
                    ->sortable()
                    ->searchable(),

                Tables\Columns\TextColumn::make('province')
                    ->label('Provincie'),

                Tables\Columns\TextColumn::make('projects_count')
                    ->counts('projects')
                    ->label('Projecten'),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCities::route('/'),
            'create' => Pages\CreateCity::route('/create'),
            'edit' => Pages\EditCity::route('/{record}/edit'),
        ];
    }
}