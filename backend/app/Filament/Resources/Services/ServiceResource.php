<?php

namespace App\Filament\Resources\Services;

use App\Filament\Resources\Services\Pages;
use App\Models\Service;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ServiceResource extends Resource
{
    protected static ?string $model = Service::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-wrench';

    protected static ?string $navigationLabel = 'Diensten';

    protected static ?string $modelLabel = 'Dienst';

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Tabs::make('Translations')->tabs([
                Tab::make('Nederlands (NL)')->schema([
                    TextInput::make('name.nl')
                        ->label('Naam dienst (NL)')
                        ->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.nl', Str::slug($state))),
                    TextInput::make('slug.nl')
                        ->label('Slug (NL)')
                        ->required(),
                ]),
                Tab::make('Français (FR)')->schema([
                    TextInput::make('name.fr')
                        ->label('Nom du service (FR)')
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.fr', Str::slug($state))),
                    TextInput::make('slug.fr')
                        ->label('Slug (FR)'),
                ]),
                Tab::make('English (EN)')->schema([
                    TextInput::make('name.en')
                        ->label('Service name (EN)')
                        ->live(onBlur: true)
                        ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.en', Str::slug($state))),
                    TextInput::make('slug.en')
                        ->label('Slug (EN)'),
                ]),
            ])->columnSpanFull(),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Dienst (NL)')
                    ->formatStateUsing(fn ($record) => $record->getTranslation('name', 'nl', false) ?: '-')
                    ->searchable(),
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
            'index' => Pages\ListServices::route('/'),
            'create' => Pages\CreateService::route('/create'),
            'edit' => Pages\EditService::route('/{record}/edit'),
        ];
    }
}