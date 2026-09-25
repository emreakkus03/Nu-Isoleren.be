<?php

namespace App\Filament\Resources\KnowledgeArticles\Schemas;

use App\Models\KnowledgeCategory;
use App\Models\Service;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Schemas\Schema;
use Illuminate\Support\Str;

class KnowledgeArticleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Artikel')
                    ->schema([
                        Select::make('knowledge_category_id')
                            ->label('Categorie')
                            ->options(
                                fn () => KnowledgeCategory::query()
                                    ->where('is_active', true)
                                    ->orderBy('sort_order')
                                    ->get()
                                    ->mapWithKeys(
                                        fn (KnowledgeCategory $category) => [
                                            $category->id => $category->getTranslation(
                                                'name',
                                                'nl',
                                                false
                                            ),
                                        ]
                                    )
                                    ->all()
                            )
                            ->searchable()
                            ->required(),

                        Select::make('service_id')
                            ->label('Gerelateerde dienst')
                            ->options(
                                fn () => Service::query()
                                    ->where('is_active', true)
                                    ->orderBy('order_column')
                                    ->get()
                                    ->mapWithKeys(
                                        fn (Service $service) => [
                                            $service->id => $service->getTranslation(
                                                'name',
                                                'nl',
                                                false
                                            ),
                                        ]
                                    )
                                    ->all()
                            )
                            ->searchable()
                            ->nullable(),

                        FileUpload::make('hero_image')
                            ->label('Hero afbeelding')
                            ->disk('s3')
                            ->directory('knowledge/articles/heroes')
                            ->image()
                            ->columnSpanFull(),

                        TextInput::make('sort_order')
                            ->label('Volgorde')
                            ->numeric()
                            ->default(0)
                            ->minValue(0),

                        Toggle::make('featured')
                            ->label('Uitgelicht')
                            ->default(false),

                        Toggle::make('is_indexable')->label('Indexeerbaar')->default(true),
                        Toggle::make('published')
                            ->label('Gepubliceerd')
                            ->default(false),

                        DateTimePicker::make('published_at')
                            ->label('Publicatiedatum')
                            ->seconds(false),
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
                TextInput::make("title.{$locale}")
                    ->label('Titel')
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
                    })
                    ->columnSpanFull(),

                TextInput::make("slug.{$locale}")
                    ->label('Slug')
                    ->required($required)
                    ->maxLength(255)
                    ->helperText('Wordt automatisch ingevuld op basis van de titel.')
                    ->columnSpanFull(),

                Textarea::make("excerpt.{$locale}")
                    ->label('Korte omschrijving')
                    ->rows(3)
                    ->helperText(
                        'Wordt gebruikt op de kennisbank-overzichtpagina.'
                    )
                    ->columnSpanFull(),

                RichEditor::make("intro.{$locale}")
                    ->label('Introductie')
                    ->columnSpanFull(),

                Section::make('Artikelinhoud')
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
                                                Str::slug($state ?? '')
                                            );
                                        }
                                    }),

                                TextInput::make('slug')
                                    ->label('Sectie slug')
                                    ->required()
                                    ->maxLength(150)
                                    ->helperText(
                                        'Wordt automatisch ingevuld op basis van de navigatietitel.'
                                    ),

                                TextInput::make('heading')
                                    ->label('Titel')
                                    ->required()
                                    ->maxLength(255)
                                    ->columnSpanFull(),

                                RichEditor::make('body')
                                    ->label('Inhoud')
                                    ->required()
                                    ->columnSpanFull(),

                                FileUpload::make('images')
                                    ->label('Afbeeldingen')
                                    ->disk('s3')
                                    ->directory('knowledge/articles/sections')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->columnSpanFull(),
                            ])
                            ->columns(2)
                            ->collapsible()
                            ->cloneable()
                            ->reorderable()
                            ->itemLabel(
                                fn (array $state): ?string => $state['nav_title']
                                        ?? $state['heading']
                                        ?? 'Nieuwe sectie'
                            )
                            ->columnSpanFull(),
                    ])
                    ->columnSpanFull(),

                Section::make('SEO')
                    ->schema([
                        TextInput::make("seo_title.{$locale}")
                            ->label('SEO titel')
                            ->maxLength(70),

                        Textarea::make("seo_description.{$locale}")
                            ->label('SEO beschrijving')
                            ->rows(3)
                            ->maxLength(170),
                    ])
                    ->columns(1)
                    ->collapsed()
                    ->columnSpanFull(),
            ]);
    }
}
