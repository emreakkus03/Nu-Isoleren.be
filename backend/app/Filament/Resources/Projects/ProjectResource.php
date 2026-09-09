<?php

namespace App\Filament\Resources\Projects;

use App\Filament\Resources\Projects\Pages;
use App\Models\Project;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\RichEditor;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ProjectResource extends Resource
{
    protected static ?string $model = Project::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-photo';

    protected static ?string $navigationLabel = 'Realisaties';

    protected static ?string $modelLabel = 'Realisatie';

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Group::make()->schema([
                Tabs::make('Talen')->tabs([
                    Tab::make('Nederlands (NL)')->schema([
                        TextInput::make('title.nl')
                            ->label('Titel realisatie (NL)')
                            ->required()
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.nl', Str::slug($state))),

                        TextInput::make('slug.nl')
                            ->label('Slug (NL)')
                            ->required(),

                        Textarea::make('short_description.nl')
                            ->label('Korte samenvatting (NL)')
                            ->rows(3),

                        RichEditor::make('description.nl')
                            ->label('Volledige projectbeschrijving (NL)'),

                        TextInput::make('meta_title.nl')
                            ->label('Meta Title (NL)')
                            ->placeholder('Optioneel'),

                        Textarea::make('meta_description.nl')
                            ->label('Meta Description (NL)')
                            ->rows(2),
                    ]),

                    Tab::make('Français (FR)')->schema([
                        TextInput::make('title.fr')
                            ->label('Titre (FR)')
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.fr', Str::slug($state))),

                        TextInput::make('slug.fr')
                            ->label('Slug (FR)'),

                        Textarea::make('short_description.fr')
                            ->label('Description courte (FR)')
                            ->rows(3),

                        RichEditor::make('description.fr')
                            ->label('Description complète (FR)'),

                        TextInput::make('meta_title.fr')
                            ->label('Meta Title (FR)'),

                        Textarea::make('meta_description.fr')
                            ->label('Meta Description (FR)')
                            ->rows(2),
                    ]),

                    Tab::make('English (EN)')->schema([
                        TextInput::make('title.en')
                            ->label('Title (EN)')
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($set, ?string $state) => $set('slug.en', Str::slug($state))),

                        TextInput::make('slug.en')
                            ->label('Slug (EN)'),

                        Textarea::make('short_description.en')
                            ->label('Short description (EN)')
                            ->rows(3),

                        RichEditor::make('description.en')
                            ->label('Full description (EN)'),

                        TextInput::make('meta_title.en')
                            ->label('Meta Title (EN)'),

                        Textarea::make('meta_description.en')
                            ->label('Meta Description (EN)')
                            ->rows(2),
                    ]),
                ]),

                Section::make('Afbeeldingen (MinIO Bucket)')->schema([
                    Repeater::make('images')
                        ->relationship('images')
                        ->schema([
                            FileUpload::make('image')
                                ->label('Foto')
                                ->image()
                                ->disk('minio')
                                ->directory('realisaties')
                                ->visibility('public')
                                ->required(),

                            TextInput::make('alt')
                                ->label('Alt-tekst (SEO)'),

                            TextInput::make('caption')
                                ->label('Onderschrift'),
                        ])
                        ->orderColumn('sort_order')
                        ->collapsible()
                        ->defaultItems(1)
                        ->columns(3),
                ]),
            ])->columnSpan(['lg' => 2]),

            Group::make()->schema([
                Section::make('Koppelingen & Status')->schema([
                    Select::make('service_id')
                        ->label('Dienst')
                        ->relationship('service', 'name')
                        ->getOptionLabelFromRecordUsing(fn ($record) => $record->getTranslation('name', 'nl', false) ?: 'Geen naam')
                        ->searchable()
                        ->preload()
                        ->required(),

                    Select::make('city_id')
                        ->label('Stad / Gemeente')
                        ->relationship('city', 'name')
                        ->searchable()
                        ->preload()
                        ->required(),

                    Toggle::make('published')
                        ->label('Gepubliceerd')
                        ->default(true),

                    Toggle::make('featured_on_home')
                        ->label('Tonen op Homepage')
                        ->default(false),
                ]),
            ])->columnSpan(['lg' => 1]),
        ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('title')
                    ->label('Titel (NL)')
                    ->formatStateUsing(fn ($record) => $record->getTranslation('title', 'nl', false) ?: '-')
                    ->searchable(),

                Tables\Columns\TextColumn::make('service.name')
                    ->label('Dienst')
                    ->formatStateUsing(fn ($record) => $record->service ? $record->service->getTranslation('name', 'nl', false) : '-')
                    ->badge(),

                Tables\Columns\TextColumn::make('city.name')
                    ->label('Stad'),

                Tables\Columns\IconColumn::make('featured_on_home')
                    ->label('Home')
                    ->boolean(),

                Tables\Columns\IconColumn::make('published')
                    ->label('Status')
                    ->boolean(),
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProjects::route('/'),
            'create' => Pages\CreateProject::route('/create'),
            'edit' => Pages\EditProject::route('/{record}/edit'),
        ];
    }
}