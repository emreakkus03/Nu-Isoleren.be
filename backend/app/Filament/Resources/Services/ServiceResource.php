<?php

namespace App\Filament\Resources\Services;

use App\Filament\Resources\Services\Pages;
use App\Models\Service;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\ColorPicker;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
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
                    Section::make('Overzicht & Kaart Info')->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name.nl')
                                ->label('Naam dienst (NL)')
                                ->required()
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.nl', Str::slug($state))),
                            TextInput::make('slug.nl')
                                ->label('Slug (NL)')
                                ->required(),
                        ]),
                        TextInput::make('badge.nl')
                            ->label('Badge')
                            ->placeholder('bijv. Isolatie of Gevelwerken')
                            ->required(),
                        Textarea::make('short_description.nl')
                            ->label('Korte beschrijving (Hover op kaart)')
                            ->rows(2),
                    ]),

                    Section::make('Detailpagina Hero')->schema([
                        TextInput::make('eyebrow.nl')
                            ->label('Eyebrow tekst')
                            ->placeholder('bijv. SPOUWMUURISOLATIE'),
                        TextInput::make('hero_title.nl')
                            ->label('Hoofdtitel (H1)')
                            ->placeholder('bijv. Uw spouwmuur professioneel isoleren'),
                        RichEditor::make('intro_text.nl')
                            ->label('Introductietekst')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'bulletList',
                                'orderedList',
                                'link',
                            ]),
                    ]),

                    Section::make('Inhoud & Linker Sticky Menu')->schema([
                        Repeater::make('sections.nl')
                            ->label('Inhoudsblokken')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('nav_title')
                                        ->label('Titel in linkermenu')
                                        ->placeholder('bijv. Voordelen')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),
                                    TextInput::make('slug')
                                        ->label('Anker ID (#)')
                                        ->required(),
                                ]),
                                TextInput::make('heading')
                                    ->label('Koptekst van het blok (H2)')
                                    ->required(),
                                RichEditor::make('body')
                                    ->label('Inhoud')
                                    ->toolbarButtons([
                                        'bold',
                                        'italic',
                                        'bulletList',
                                        'orderedList',
                                        'link',
                                    ]),
                                Repeater::make('bullet_points')
                                    ->label('Opsommingen / Punten')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            Select::make('icon')
                                                ->label('Icoon')
                                                ->options([
                                                    'check' => 'Vinkje (standaard)',
                                                    'check-circle' => 'Vinkje in cirkel',
                                                    'star' => 'Ster',
                                                    'arrow' => 'Pijl',
                                                ])
                                                ->default('check')
                                                ->required(),
                                            ColorPicker::make('color')
                                                ->label('Kleur')
                                                ->default('#1A669A')
                                                ->required(),
                                            TextInput::make('text')
                                                ->label('Tekst')
                                                ->required(),
                                        ]),
                                    ])
                                    ->collapsible()
                                    ->collapsed()
                                    ->itemLabel(fn (array $state): ?string => $state['text'] ?? null),
                                FileUpload::make('images')
                                    ->label('Foto\'s bij dit blok')
                                    ->disk('s3')
                                    ->directory('services/sections')
                                    ->visibility('public')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->panelLayout('grid'),
                            ])
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['nav_title'] ?? null),
                    ]),

                    Section::make('SEO')->collapsed()->schema([
                        TextInput::make('seo_title.nl')
                            ->label('SEO Titel'),
                        Textarea::make('seo_description.nl')
                            ->label('SEO Beschrijving')
                            ->rows(2),
                    ]),
                ]),

                Tab::make('Français (FR)')->schema([
                    Section::make('Overzicht & Kaart Info (FR)')->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name.fr')
                                ->label('Nom du service (FR)')
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.fr', Str::slug($state))),
                            TextInput::make('slug.fr')
                                ->label('Slug (FR)'),
                        ]),
                        TextInput::make('badge.fr')
                            ->label('Badge (FR)')
                            ->placeholder('ex. Isolation'),
                        Textarea::make('short_description.fr')
                            ->label('Description courte (FR)')
                            ->rows(2),
                    ]),

                    Section::make('Detailpagina Hero (FR)')->schema([
                        TextInput::make('eyebrow.fr')
                            ->label('Texte eyebrow (FR)'),
                        TextInput::make('hero_title.fr')
                            ->label('Titre principal (H1) (FR)'),
                        RichEditor::make('intro_text.fr')
                            ->label('Texte d\'introduction (FR)')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'bulletList',
                                'orderedList',
                                'link',
                            ]),
                    ]),

                    Section::make('Inhoud & Linker Sticky Menu (FR)')->schema([
                        Repeater::make('sections.fr')
                            ->label('Blocs de contenu (FR)')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('nav_title')
                                        ->label('Titre dans le menu')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),
                                    TextInput::make('slug')
                                        ->label('ID Ancre (#)')
                                        ->required(),
                                ]),
                                TextInput::make('heading')
                                    ->label('Titre du bloc (H2)')
                                    ->required(),
                                RichEditor::make('body')
                                    ->label('Contenu')
                                    ->toolbarButtons([
                                        'bold',
                                        'italic',
                                        'bulletList',
                                        'orderedList',
                                        'link',
                                    ]),
                                Repeater::make('bullet_points')
                                    ->label('Puces / Points')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            Select::make('icon')
                                                ->label('Icône')
                                                ->options([
                                                    'check' => 'Coche (défaut)',
                                                    'check-circle' => 'Coche dans un cercle',
                                                    'star' => 'Étoile',
                                                    'arrow' => 'Flèche',
                                                ])
                                                ->default('check')
                                                ->required(),
                                            ColorPicker::make('color')
                                                ->label('Couleur')
                                                ->default('#1A669A')
                                                ->required(),
                                            TextInput::make('text')
                                                ->label('Texte')
                                                ->required(),
                                        ]),
                                    ])
                                    ->collapsible()
                                    ->collapsed()
                                    ->itemLabel(fn (array $state): ?string => $state['text'] ?? null),
                                FileUpload::make('images')
                                    ->label('Photos')
                                    ->disk('s3')
                                    ->directory('services/sections')
                                    ->visibility('public')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->panelLayout('grid'),
                            ])
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['nav_title'] ?? null),
                    ]),

                    Section::make('SEO (FR)')->collapsed()->schema([
                        TextInput::make('seo_title.fr')
                            ->label('SEO Titre'),
                        Textarea::make('seo_description.fr')
                            ->label('SEO Description')
                            ->rows(2),
                    ]),
                ]),

                Tab::make('English (EN)')->schema([
                    Section::make('Overzicht & Kaart Info (EN)')->schema([
                        Grid::make(2)->schema([
                            TextInput::make('name.en')
                                ->label('Service name (EN)')
                                ->live(onBlur: true)
                                ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.en', Str::slug($state))),
                            TextInput::make('slug.en')
                                ->label('Slug (EN)'),
                        ]),
                        TextInput::make('badge.en')
                            ->label('Badge (EN)')
                            ->placeholder('e.g. Insulation'),
                        Textarea::make('short_description.en')
                            ->label('Short description (EN)')
                            ->rows(2),
                    ]),

                    Section::make('Detailpagina Hero (EN)')->schema([
                        TextInput::make('eyebrow.en')
                            ->label('Eyebrow text (EN)'),
                        TextInput::make('hero_title.en')
                            ->label('Main title (H1) (EN)'),
                        RichEditor::make('intro_text.en')
                            ->label('Intro text (EN)')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'bulletList',
                                'orderedList',
                                'link',
                            ]),
                    ]),

                    Section::make('Inhoud & Linker Sticky Menu (EN)')->schema([
                        Repeater::make('sections.en')
                            ->label('Content blocks (EN)')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('nav_title')
                                        ->label('Title in menu')
                                        ->required()
                                        ->live(onBlur: true)
                                        ->afterStateUpdated(fn ($set, ?string $state) => $set('slug', Str::slug($state))),
                                    TextInput::make('slug')
                                        ->label('Anchor ID (#)')
                                        ->required(),
                                ]),
                                TextInput::make('heading')
                                    ->label('Block heading (H2)')
                                    ->required(),
                                RichEditor::make('body')
                                    ->label('Content')
                                    ->toolbarButtons([
                                        'bold',
                                        'italic',
                                        'bulletList',
                                        'orderedList',
                                        'link',
                                    ]),
                                Repeater::make('bullet_points')
                                    ->label('Bullet points')
                                    ->schema([
                                        Grid::make(3)->schema([
                                            Select::make('icon')
                                                ->label('Icon')
                                                ->options([
                                                    'check' => 'Checkmark (default)',
                                                    'check-circle' => 'Checkmark in circle',
                                                    'star' => 'Star',
                                                    'arrow' => 'Arrow',
                                                ])
                                                ->default('check')
                                                ->required(),
                                            ColorPicker::make('color')
                                                ->label('Color')
                                                ->default('#1A669A')
                                                ->required(),
                                            TextInput::make('text')
                                                ->label('Text')
                                                ->required(),
                                        ]),
                                    ])
                                    ->collapsible()
                                    ->collapsed()
                                    ->itemLabel(fn (array $state): ?string => $state['text'] ?? null),
                                FileUpload::make('images')
                                    ->label('Photos')
                                    ->disk('s3')
                                    ->directory('services/sections')
                                    ->visibility('public')
                                    ->image()
                                    ->multiple()
                                    ->reorderable()
                                    ->panelLayout('grid'),
                            ])
                            ->collapsible()
                            ->itemLabel(fn (array $state): ?string => $state['nav_title'] ?? null),
                    ]),

                    Section::make('SEO (EN)')->collapsed()->schema([
                        TextInput::make('seo_title.en')
                            ->label('SEO Title'),
                        Textarea::make('seo_description.en')
                            ->label('SEO Description')
                            ->rows(2),
                    ]),
                ]),
            ])->columnSpanFull(),

            Section::make('Media (MinIO)')->schema([
                Grid::make(2)->schema([
                    FileUpload::make('thumbnail')
                        ->label('Thumbnail (Kaart foto op Home/Overzicht)')
                        ->disk('s3')
                        ->directory('services/thumbnails')
                        ->visibility('public')
                        ->image()
                        ->required(),

                    FileUpload::make('hero_image')
                        ->label('Hero foto (Grote foto op Detailpagina)')
                        ->disk('s3')
                        ->directory('services/heroes')
                        ->visibility('public')
                        ->image(),
                ]),
            ]),

            Section::make('Instellingen')->schema([
                Grid::make(3)->schema([
                    TextInput::make('order_column')
                        ->label('Volgorde')
                        ->numeric()
                        ->default(0),

                    Toggle::make('is_active')
                        ->label('Actief')
                        ->default(true),

                    Toggle::make('is_featured_home')
                        ->label('Tonen op Homepage')
                        ->default(false),
                ]),
            ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('thumbnail')
                    ->disk('s3')
                    ->circular(),
                Tables\Columns\TextColumn::make('name')
                    ->label('Dienst (NL)')
                    ->formatStateUsing(fn ($record) => $record->getTranslation('name', 'nl', false) ?: '-')
                    ->searchable(),
                Tables\Columns\TextColumn::make('badge')
                    ->label('Badge (NL)')
                    ->formatStateUsing(fn ($record) => $record->getTranslation('badge', 'nl', false) ?: '-')
                    ->badge(),
                Tables\Columns\IconColumn::make('is_active')
                    ->label('Actief')
                    ->boolean(),
                Tables\Columns\IconColumn::make('is_featured_home')
                    ->label('Homepage')
                    ->boolean(),
                Tables\Columns\TextColumn::make('order_column')
                    ->label('Volgorde')
                    ->sortable(),
            ])
            ->defaultSort('order_column', 'asc')
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