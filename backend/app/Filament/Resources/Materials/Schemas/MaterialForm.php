<?php

namespace App\Filament\Resources\Materials\Schemas;

use App\Models\Service;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class MaterialForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Instellingen')
                    ->schema([
                        Select::make('services')
                            ->label('Gekoppelde diensten')
                            ->relationship(
                                name: 'services',
                                titleAttribute: 'name',
                            )
                            ->getOptionLabelFromRecordUsing(
                                fn (Service $record): string =>
                                    $record->getTranslation('name', 'nl')
                            )
                            ->multiple()
                            ->preload()
                            ->searchable()
                            ->helperText(
                                'Selecteer de diensten waarbij dit materiaal gebruikt wordt.'
                            )
                            ->columnSpanFull(),

                        FileUpload::make('hero_image')
                            ->label('Hero afbeelding')
                            ->disk('s3')
                            ->directory('materials/heroes')
                            ->image()
                            ->imageEditor()
                            ->columnSpanFull(),

                        FileUpload::make('thumbnail')
                            ->label('Thumbnail')
                            ->disk('s3')
                            ->directory('materials/thumbnails')
                            ->image()
                            ->imageEditor()
                            ->columnSpanFull(),

                        TextInput::make('sort_order')
                            ->label('Volgorde')
                            ->numeric()
                            ->default(0)
                            ->required(),

                        Toggle::make('is_active')
                            ->label('Actief')
                            ->default(true),
                    ])
                    ->columns(2),

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
            ]);
    }

    private static function languageTab(
        string $locale,
        string $label,
        bool $required = false,
    ): Tab {
        return Tab::make($label)
            ->schema([
                Section::make('Algemeen')
                    ->schema([
                        TextInput::make("name.{$locale}")
                            ->label('Naam')
                            ->required($required)
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(function (
                                ?string $state,
                                Get $get,
                                Set $set,
                                string $operation,
                            ) use ($locale) {
                                if ($operation !== 'create') {
                                    return;
                                }

                                if (blank($get("slug.{$locale}"))) {
                                    $set(
                                        "slug.{$locale}",
                                        Str::slug($state ?? ''),
                                    );
                                }
                            }),

                        TextInput::make("slug.{$locale}")
                            ->label('Slug')
                            ->required($required)
                            ->maxLength(255)
                            ->helperText(
                                'Wordt bij het aanmaken automatisch ingevuld.'
                            ),

                        TextInput::make("eyebrow.{$locale}")
                            ->label('Eyebrow')
                            ->maxLength(255),

                        TextInput::make("hero_title.{$locale}")
                            ->label('Hero titel')
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Textarea::make("short_description.{$locale}")
                            ->label('Korte omschrijving')
                            ->rows(3)
                            ->columnSpanFull(),

                        RichEditor::make("intro_text.{$locale}")
                            ->label('Introductie')
                            ->columnSpanFull(),
                    ])
                    ->columns(2),

                Section::make('Secties')
                    ->schema([
                        Repeater::make("sections.{$locale}")
                            ->label('Secties')
                            ->schema([
                                TextInput::make('nav_title')
                                    ->label('Navigatietitel')
                                    ->required()
                                    ->maxLength(100)
                                    ->live(onBlur: true)
                                    ->afterStateUpdated(function (
                                        ?string $state,
                                        Get $get,
                                        Set $set,
                                    ) {
                                        if (blank($get('slug'))) {
                                            $set(
                                                'slug',
                                                Str::slug($state ?? ''),
                                            );
                                        }
                                    }),

                                TextInput::make('slug')
                                    ->label('Sectie slug')
                                    ->required()
                                    ->maxLength(150)
                                    ->helperText(
                                        'Wordt automatisch aangemaakt vanuit de navigatietitel.'
                                    ),

                                TextInput::make('heading')
                                    ->label('Titel')
                                    ->required()
                                    ->columnSpanFull(),

                                RichEditor::make('body')
                                    ->label('Inhoud')
                                    ->columnSpanFull(),

                                FileUpload::make('images')
                                    ->label('Afbeeldingen')
                                    ->disk('s3')
                                    ->directory('materials/sections')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->columnSpanFull(),

                                Toggle::make('show_in_menu')
                                    ->label('Tonen in inhoudsopgave')
                                    ->default(true),

                                Toggle::make('is_active')
                                    ->label('Actief')
                                    ->default(true),
                            ])
                            ->columns(2)
                            ->collapsible()
                            ->reorderable()
                            ->itemLabel(
                                fn (array $state): ?string =>
                                    $state['heading']
                                    ?? $state['nav_title']
                                    ?? 'Nieuwe sectie'
                            )
                            ->columnSpanFull(),
                    ]),

                Section::make('SEO')
                    ->schema([
                        TextInput::make("seo_title.{$locale}")
                            ->label('SEO titel')
                            ->maxLength(255)
                            ->columnSpanFull(),

                        Textarea::make("seo_description.{$locale}")
                            ->label('SEO description')
                            ->rows(3)
                            ->maxLength(320)
                            ->columnSpanFull(),
                    ]),
            ]);
    }
}