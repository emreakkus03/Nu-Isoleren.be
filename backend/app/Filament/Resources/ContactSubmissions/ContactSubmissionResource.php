<?php

namespace App\Filament\Resources\ContactSubmissions;

use App\Filament\Resources\ContactSubmissions\Pages;
use App\Models\ContactSubmission;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Resources\Resource;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;
use Filament\Tables;
use Filament\Tables\Table;

class ContactSubmissionResource extends Resource
{
    protected static ?string $model = ContactSubmission::class;

    protected static string | \BackedEnum | null $navigationIcon =
        'heroicon-o-envelope';

    protected static ?string $navigationLabel =
        'Contactaanvragen';

    protected static ?string $modelLabel =
        'Contactaanvraag';

    protected static ?string $pluralModelLabel =
        'Contactaanvragen';

    protected static ?string $recordTitleAttribute =
        'email';

    public static function form(Schema $schema): Schema
    {
        return $schema->schema([
            Section::make('Contactgegevens')
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('first_name')
                            ->label('Voornaam')
                            ->disabled(),

                        TextInput::make('last_name')
                            ->label('Achternaam')
                            ->disabled(),

                        TextInput::make('email')
                            ->label('E-mail')
                            ->disabled(),

                        TextInput::make('phone')
                            ->label('Telefoon')
                            ->disabled(),
                    ]),
                ]),

            Section::make('Bericht')
                ->schema([
                    Textarea::make('message')
                        ->label('Bericht')
                        ->rows(10)
                        ->disabled(),
                ]),

            Section::make('Behandeling')
                ->schema([
                    Grid::make(2)->schema([
                        Select::make('status')
                            ->label('Status')
                            ->options([
                                'new' => 'Nieuw',
                                'in_progress' => 'In behandeling',
                                'contacted' => 'Gecontacteerd',
                                'closed' => 'Afgesloten',
                            ])
                            ->required(),

                        Select::make('crm_status')
                            ->label('CRM status')
                            ->options([
                                'pending' => 'Nog niet gesynchroniseerd',
                                'synced' => 'Gesynchroniseerd',
                                'failed' => 'Synchronisatie mislukt',
                            ])
                            ->disabled(),
                    ]),

                    Textarea::make('internal_notes')
                        ->label('Interne notities')
                        ->rows(5)
                        ->placeholder(
                            'Notities voor intern gebruik...'
                        ),
                ]),

            Section::make('Technische gegevens')
                ->collapsed()
                ->schema([
                    Grid::make(2)->schema([
                        TextInput::make('locale')
                            ->label('Taal')
                            ->disabled(),

                        TextInput::make('source')
                            ->label('Bron')
                            ->disabled(),

                        TextInput::make('created_at')
                            ->label('Ontvangen op')
                            ->disabled(),

                        TextInput::make('privacy_accepted_at')
                            ->label('Privacy geaccepteerd op')
                            ->disabled(),
                    ]),
                ]),
        ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->formatStateUsing(
                        fn (string $state): string =>
                            match ($state) {
                                'new' => 'Nieuw',
                                'in_progress' => 'In behandeling',
                                'contacted' => 'Gecontacteerd',
                                'closed' => 'Afgesloten',
                                default => $state,
                            }
                    )
                    ->color(
                        fn (string $state): string =>
                            match ($state) {
                                'new' => 'danger',
                                'in_progress' => 'warning',
                                'contacted' => 'success',
                                'closed' => 'gray',
                                default => 'gray',
                            }
                    ),

                Tables\Columns\TextColumn::make('first_name')
                    ->label('Naam')
                    ->formatStateUsing(
                        fn (ContactSubmission $record): string =>
                            $record->full_name
                    )
                    ->searchable([
                        'first_name',
                        'last_name',
                    ]),

                Tables\Columns\TextColumn::make('email')
                    ->label('E-mail')
                    ->searchable()
                    ->copyable(),

                Tables\Columns\TextColumn::make('phone')
                    ->label('Telefoon')
                    ->placeholder('-'),

                Tables\Columns\TextColumn::make('locale')
                    ->label('Taal')
                    ->badge()
                    ->formatStateUsing(
                        fn (string $state): string =>
                            strtoupper($state)
                    ),

                Tables\Columns\TextColumn::make('created_at')
    ->label('Ontvangen')
    ->dateTime('d/m/Y H:i')
    ->timezone('Europe/Brussels')
    ->sortable(),
            ])
            ->defaultSort(
                'created_at',
                'desc'
            )
            ->actions([
                EditAction::make()
                    ->label('Bekijken'),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' =>
                Pages\ListContactSubmissions::route('/'),

            'edit' =>
                Pages\EditContactSubmission::route('/{record}/edit'),
        ];
    }
}