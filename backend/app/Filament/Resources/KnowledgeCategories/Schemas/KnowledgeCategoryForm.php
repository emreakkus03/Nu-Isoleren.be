<?php

namespace App\Filament\Resources\KnowledgeCategories\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Utilities\Set;
use Illuminate\Support\Str;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;

class KnowledgeCategoryForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Tabs::make('Vertalingen')
                    ->tabs([
                        self::languageTab(
                            locale: 'nl',
                            label: 'Nederlands',
                            required: true,
                        ),

                        self::languageTab(
                            locale: 'fr',
                            label: 'Français',
                        ),

                        self::languageTab(
                            locale: 'en',
                            label: 'English',
                        ),
                    ])
                    ->columnSpanFull(),

                Section::make('Instellingen')
                    ->schema([
                        TextInput::make('sort_order')
                            ->label('Volgorde')
                            ->numeric()
                            ->default(0)
                            ->minValue(0),

                        Toggle::make('is_active')
                            ->label('Actief')
                            ->default(true),
                    ])
                    ->columns(2),
            ]);
    }

    private static function languageTab(
        string $locale,
        string $label,
        bool $required = false,
    ): Tab {
        return Tab::make($label)
            ->schema([
                TextInput::make("name.{$locale}")
    ->label('Naam')
    ->required($required)
    ->maxLength(255)
    ->live(onBlur: true)
    ->afterStateUpdated(function (
        ?string $state,
        Set $set,
        string $operation,
    ) use ($locale) {
        if ($operation !== 'create') {
            return;
        }

        $set(
            "slug.{$locale}",
            Str::slug($state ?? '')
        );
    }),

TextInput::make("slug.{$locale}")
    ->label('Slug')
    ->required($required)
    ->maxLength(255)
    ->helperText('Wordt automatisch ingevuld op basis van de naam.'),
                Textarea::make("description.{$locale}")
                    ->label('Beschrijving')
                    ->rows(4)
                    ->columnSpanFull(),
            ])
            ->columns(2);
    }
}