<?php

namespace App\Filament\Resources\QuoteRequests\Schemas;

use App\Models\QuoteRequest;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class QuoteRequestInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('Aanvraag')
                    ->schema([
                        TextEntry::make('reference')
                            ->label('Referentie')
                            ->weight('bold')
                            ->copyable(),

                        TextEntry::make('status')
                            ->label('Status')
                            ->badge()
                            ->formatStateUsing(
                                fn (string $state): string => match ($state) {
                                    'new' => 'Nieuw',
                                    'contacted' => 'Gecontacteerd',
                                    'quoted' => 'Offerte verstuurd',
                                    'won' => 'Gewonnen',
                                    'lost' => 'Verloren',
                                    default => $state,
                                }
                            )
                            ->color(
                                fn (string $state): string => match ($state) {
                                    'new' => 'info',
                                    'contacted' => 'warning',
                                    'quoted' => 'primary',
                                    'won' => 'success',
                                    'lost' => 'danger',
                                    default => 'gray',
                                }
                            ),

                        TextEntry::make('services')
                            ->label('Aangevraagde diensten')
                            ->state(
                                fn (QuoteRequest $record): array => $record
                                    ->services
                                    ->map(
                                        fn ($service): string => $service
                                            ->getTranslation(
                                                'name',
                                                'nl',
                                                false
                                            )
                                    )
                                    ->filter()
                                    ->values()
                                    ->all()
                            )
                            ->badge(),
                    ])
                    ->columns(2),

                Section::make('Klantgegevens')
                    ->schema([
                        TextEntry::make('first_name')
                            ->label('Voornaam'),

                        TextEntry::make('last_name')
                            ->label('Achternaam'),

                        TextEntry::make('email')
                            ->label('E-mailadres')
                            ->copyable(),

                        TextEntry::make('phone')
                            ->label('Telefoonnummer')
                            ->copyable(),
                    ])
                    ->columns(2),

                Section::make('Adres')
                    ->schema([
                        TextEntry::make('street')
                            ->label('Straat'),

                        TextEntry::make('house_number')
                            ->label('Huisnummer'),

                        TextEntry::make('postcode')
                            ->label('Postcode'),

                        TextEntry::make('city')
                            ->label('Gemeente'),
                    ])
                    ->columns(2),

                Section::make('Opmerking of vraag')
                    ->schema([
                        TextEntry::make('message')
                            ->label('')
                            ->placeholder('Geen opmerking toegevoegd.')
                            ->columnSpanFull(),
                    ]),

                Section::make('Systeeminformatie')
                    ->schema([
                        TextEntry::make('locale')
                            ->label('Taal')
                            ->formatStateUsing(
                                fn (string $state): string => match ($state) {
                                    'nl' => 'Nederlands',
                                    'fr' => 'Frans',
                                    'en' => 'Engels',
                                    default => $state,
                                }
                            ),

                        TextEntry::make('privacy_consent_at')
                            ->label('Privacy geaccepteerd')
                            ->dateTime('d/m/Y H:i'),

                        TextEntry::make('created_at')
                            ->label('Aanvraag ontvangen')
                            ->dateTime('d/m/Y H:i'),
                    ])
                    ->columns(3),
            ]);
    }
}