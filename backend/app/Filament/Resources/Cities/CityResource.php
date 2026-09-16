<?php

namespace App\Filament\Resources\Cities;

use App\Filament\Resources\Cities\Pages;
use App\Models\City;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
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

            Toggle::make('is_featured')
                ->label('Zichtbaar op homepage')
                ->helperText('Schakel in om deze stad direct uit te lichten op de homepagina.')
                ->default(false),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->label('Stad')
                    ->sortable()
                    ->searchable(),

                TextColumn::make('province')
                    ->label('Provincie')
                    ->sortable(),

                TextColumn::make('projects_count')
                    ->counts('projects')
                    ->label('Projecten'),

                ToggleColumn::make('is_featured')
                    ->label('Op Homepage')
                    ->sortable(),
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