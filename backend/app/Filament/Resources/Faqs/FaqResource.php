<?php

namespace App\Filament\Resources\Faqs;

use App\Filament\Resources\Faqs\Pages;
use App\Models\Faq;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\RichEditor;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Group;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class FaqResource extends Resource
{
    protected static ?string $model = Faq::class;

    protected static string | \BackedEnum | null $navigationIcon = 'heroicon-o-question-mark-circle';

    protected static ?string $navigationLabel = 'Veelgestelde vragen';

    protected static ?string $modelLabel = 'Vraag';

    protected static ?string $pluralModelLabel = 'Veelgestelde vragen';

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Group::make()->schema([
                Tabs::make('Talen')->tabs([
                    Tab::make('Nederlands (NL)')->schema([
                        TextInput::make('question.nl')
                            ->label('Vraag (NL)')
                            ->required(),

                        RichEditor::make('answer.nl')
                            ->label('Antwoord (NL)')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'link',
                                'bulletList',
                                'orderedList',
                            ])
                            ->required(),
                    ]),

                    Tab::make('Français (FR)')->schema([
                        TextInput::make('question.fr')
                            ->label('Question (FR)'),

                        RichEditor::make('answer.fr')
                            ->label('Réponse (FR)')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'link',
                                'bulletList',
                                'orderedList',
                            ]),
                    ]),

                    Tab::make('English (EN)')->schema([
                        TextInput::make('question.en')
                            ->label('Question (EN)'),

                        RichEditor::make('answer.en')
                            ->label('Answer (EN)')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'link',
                                'bulletList',
                                'orderedList',
                            ]),
                    ]),
                ]),
            ])->columnSpan(['lg' => 2]),

            Group::make()->schema([
                Section::make('Koppeling & Status')->schema([
                    Select::make('service_id')
                        ->label('Dienst')
                        ->relationship('service', 'name')
                        ->getOptionLabelFromRecordUsing(fn($record) => $record->getTranslation('name', 'nl', false) ?: 'Geen naam')
                        ->searchable()
                        ->preload()
                        ->nullable()
                        ->helperText('Laat leeg voor algemene vragen.'),

                    Select::make('category')
                        ->label('Categorie')
                        ->options([
                            'general' => 'Algemeen',
                            'grants' => 'Premies & Subsidies',
                            'pricing' => 'Prijzen & Offertes',
                        ])
                        ->default('general')
                        ->required(),

                    TextInput::make('sort_order')
                        ->label('Volgorde')
                        ->numeric()
                        ->default(0),

                    Toggle::make('is_featured_home')
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
                Tables\Columns\TextColumn::make('question')
                    ->label('Vraag (NL)')
                    ->formatStateUsing(fn($record) => $record->getTranslation('question', 'nl', false) ?: '-')
                    ->searchable()
                    ->limit(60),

                Tables\Columns\TextColumn::make('service.name')
                    ->label('Dienst')
                    ->formatStateUsing(fn($record) => $record->service ? $record->service->getTranslation('name', 'nl', false) : 'Algemeen')
                    ->badge(),

                Tables\Columns\TextColumn::make('category')
                    ->label('Categorie')
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'general' => 'Algemeen',
                        'grants' => 'Premies',
                        'pricing' => 'Prijzen',
                        default => $state,
                    })
                    ->badge()
                    ->color('gray'),

                Tables\Columns\IconColumn::make('is_featured_home')
                    ->label('Home')
                    ->boolean(),

                Tables\Columns\TextColumn::make('sort_order')
                    ->label('Volgorde')
                    ->sortable(),
            ])
            ->defaultSort('sort_order', 'asc')
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListFaqs::route('/'),
            'create' => Pages\CreateFaq::route('/create'),
            'edit' => Pages\EditFaq::route('/{record}/edit'),
        ];
    }
}
