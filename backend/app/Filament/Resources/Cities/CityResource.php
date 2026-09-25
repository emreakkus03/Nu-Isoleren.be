<?php

namespace App\Filament\Resources\Cities;

use App\Models\City;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class CityResource extends Resource
{
    protected static ?string $model = City::class;

    protected static string|\BackedEnum|null $navigationIcon = 'heroicon-o-map-pin';

    protected static ?string $navigationLabel = 'Gemeenten / Steden';

    protected static ?string $modelLabel = 'Stad';

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([

            Section::make('Algemeen')
                ->description('Basisgegevens van de stad of gemeente.')
                ->schema([
                    TextInput::make('name')
                        ->label('Stad / Gemeente')
                        ->required()
                        ->live(onBlur: true)
                        ->afterStateUpdated(
                            fn ($set, ?string $state) => $set('slug', Str::slug($state))
                        ),

                    TextInput::make('postal_code')
                        ->label('Postcode'),

                    TextInput::make('slug')
                        ->required()
                        ->unique(ignoreRecord: true),

                    TextInput::make('province')
                        ->label('Provincie'),

                    TextInput::make('region')
                        ->label('Regio'),

                    Toggle::make('is_featured')
                        ->label('Zichtbaar op homepage')
                        ->helperText(
                            'Schakel in om deze stad direct uit te lichten op de homepagina.'
                        )
                        ->default(false),
                ])
                ->columns(2),

            Section::make('Omliggende werkgebieden')
                ->description(
                    'Kies maximaal 6 steden of gemeenten die logisch rond deze locatie liggen.'
                )
                ->schema([
                    Select::make('nearbyCities')
                        ->label('Nabijgelegen steden')
                        ->relationship(
                            name: 'nearbyCities',
                            titleAttribute: 'name'
                        )
                        ->multiple()
                        ->searchable()
                        ->preload()
                        ->maxItems(6)
                        ->helperText(
                            'Gebruik alleen steden waarvoor een echte werkgebiedpagina bestaat.'
                        ),
                ]),

            Section::make('Hero')
                ->description(
                    'Unieke hero-inhoud voor deze werkgebiedpagina.'
                )
                ->schema([
                    FileUpload::make('hero_image')
                        ->label('Hero afbeelding')
                        ->image()
                        ->disk('s3')
                        ->directory('cities/heroes')
                        ->visibility('public'),

                    TextInput::make('hero_title.nl')
                        ->label('Hero titel NL')
                        ->placeholder(
                            'Isolatie en gevelwerken in Dendermonde'
                        ),

                    RichEditor::make('hero_intro.nl')
                        ->label('Hero intro NL')
                        ->columnSpanFull(),

                    TextInput::make('hero_title.fr')
                        ->label('Hero titel FR'),

                    RichEditor::make('hero_intro.fr')
                        ->label('Hero intro FR')
                        ->columnSpanFull(),

                    TextInput::make('hero_title.en')
                        ->label('Hero titel EN'),

                    RichEditor::make('hero_intro.en')
                        ->label('Hero intro EN')
                        ->columnSpanFull(),
                ])
                ->columns(2),

            Section::make('Lokale content')
                ->description(
                    'Dit is de belangrijkste unieke SEO/GEO-inhoud per stad. Schrijf dit echt specifiek voor de locatie.'
                )
                ->schema([
                    TextInput::make('local_title.nl')
                        ->label('Titel NL')
                        ->placeholder(
                            'Uw woning isoleren in Dendermonde'
                        ),

                    RichEditor::make('local_content.nl')
                        ->label('Lokale inhoud NL')
                        ->helperText(
                            'Schrijf hier unieke inhoud over isolatie, gevelwerken en renovatie in deze stad.'
                        )
                        ->columnSpanFull(),

                    TextInput::make('local_title.fr')
                        ->label('Titel FR'),

                    RichEditor::make('local_content.fr')
                        ->label('Lokale inhoud FR')
                        ->columnSpanFull(),

                    TextInput::make('local_title.en')
                        ->label('Titel EN'),

                    RichEditor::make('local_content.en')
                        ->label('Lokale inhoud EN')
                        ->columnSpanFull(),
                ])
                ->columns(2),

            Section::make('Oplossingen')
                ->description(
                    'Korte unieke introductie boven de blokken over spouwmuur, gevel en dak.'
                )
                ->schema([
                    RichEditor::make('solution_intro.nl')
                        ->label('Intro oplossingen NL')
                        ->columnSpanFull(),

                    RichEditor::make('solution_intro.fr')
                        ->label('Intro oplossingen FR')
                        ->columnSpanFull(),

                    RichEditor::make('solution_intro.en')
                        ->label('Intro oplossingen EN')
                        ->columnSpanFull(),
                ]),

            Section::make('Lokale FAQ')
                ->description(
                    'Voeg alleen vragen toe die echt relevant zijn voor deze stad of regio.'
                )
                ->schema([
                    Repeater::make('local_faqs.nl')
                        ->label('FAQ NL')
                        ->schema([
                            TextInput::make('question')
                                ->label('Vraag')
                                ->required(),

                            RichEditor::make('answer')
                                ->label('Antwoord')
                                ->required(),
                        ])
                        ->defaultItems(0)
                        ->collapsible()
                        ->itemLabel(
                            fn (array $state): ?string => $state['question'] ?? 'Nieuwe vraag'
                        )
                        ->columnSpanFull(),

                    Repeater::make('local_faqs.fr')
                        ->label('FAQ FR')
                        ->schema([
                            TextInput::make('question')
                                ->label('Vraag')
                                ->required(),

                            RichEditor::make('answer')
                                ->label('Antwoord')
                                ->required(),
                        ])
                        ->defaultItems(0)
                        ->collapsible()
                        ->itemLabel(
                            fn (array $state): ?string => $state['question'] ?? 'Nieuwe vraag'
                        )
                        ->columnSpanFull(),

                    Repeater::make('local_faqs.en')
                        ->label('FAQ EN')
                        ->schema([
                            TextInput::make('question')
                                ->label('Vraag')
                                ->required(),

                            RichEditor::make('answer')
                                ->label('Antwoord')
                                ->required(),
                        ])
                        ->defaultItems(0)
                        ->collapsible()
                        ->itemLabel(
                            fn (array $state): ?string => $state['question'] ?? 'Nieuwe vraag'
                        )
                        ->columnSpanFull(),
                ]),

            Section::make('SEO')
                ->description(
                    'Unieke metadata voor Google en andere zoekmachines.'
                )
                ->schema([
                    TextInput::make('seo_title.nl')
                        ->label('SEO titel NL')
                        ->maxLength(70),

                    TextInput::make('seo_description.nl')
                        ->label('Meta description NL')
                        ->maxLength(180),

                    TextInput::make('seo_title.fr')
                        ->label('SEO titel FR')
                        ->maxLength(70),

                    TextInput::make('seo_description.fr')
                        ->label('Meta description FR')
                        ->maxLength(180),

                    TextInput::make('seo_title.en')
                        ->label('SEO titel EN')
                        ->maxLength(70),

                    TextInput::make('seo_description.en')
                        ->label('Meta description EN')
                        ->maxLength(180),
                ])
                ->columns(2),

            Section::make('Indexering')
                ->description(
                    'Laat een stad pas indexeren wanneer de unieke lokale inhoud en SEO-velden klaar zijn.'
                )
                ->schema([
                    Toggle::make('is_published')->label('Publiek beschikbaar')->default(true),
                    Toggle::make('is_indexable')
                        ->label('Indexeerbaar door Google')
                        ->helperText(
                            'Uit laten zolang de lokale content nog niet volledig is ingevuld.'
                        )
                        ->default(false),
                ]),
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

                TextColumn::make('region')
                    ->label('Regio')
                    ->sortable(),

                TextColumn::make('projects_count')
                    ->counts('projects')
                    ->label('Projecten'),

                ToggleColumn::make('is_featured')
                    ->label('Op Homepage')
                    ->sortable(),

                ToggleColumn::make('is_indexable')
                    ->label('Indexeerbaar')
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
