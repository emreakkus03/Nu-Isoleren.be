<?php

namespace App\Filament\Resources\Vacancies\Schemas;

use App\Models\Vacancy;
use App\Models\VacancyQuestion;
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
use Illuminate\Validation\Rule;

class VacancyForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            Section::make('Algemeen')->columns(2)->schema([
                Select::make('status')->label('Status')->options(Vacancy::STATUSES)->default('draft')->required(),
                TextInput::make('region')->label('Regio')->required()->maxLength(255),
                Select::make('employment_type')->label('Samenwerkingstype')->options(Vacancy::EMPLOYMENT_TYPES)->required(),
                DateTimePicker::make('published_at')->label('Publicatiedatum')->seconds(false),
                DateTimePicker::make('valid_through')->label('Sluitingsdatum')->seconds(false),
                TextInput::make('location_city')->label('Werklocatie: gemeente')->maxLength(255),
                TextInput::make('location_region')->label('Werklocatie: regio')->maxLength(255),
                TextInput::make('location_country')->label('Landcode werklocatie')->helperText('ISO-landcode, bijvoorbeeld BE.')->required()->length(2)->regex('/^[A-Z]{2}$/'),
                TextInput::make('sort_order')->label('Volgorde')->numeric()->default(0)->minValue(0),
                Toggle::make('require_cv_or_linkedin')->label('CV of LinkedIn verplicht')->default(true),
                Toggle::make('is_indexable')->label('Indexeerbaar')->default(true),
                FileUpload::make('image')->label('Afbeelding')->disk('s3')->directory('vacancies/images')->image()->columnSpanFull(),
            ]),
            Tabs::make('Vertalingen')->tabs(array_map(fn (string $locale): Tab => self::translation($locale), ['nl', 'fr', 'en']))->columnSpanFull(),
            Section::make('Sollicitatievragen')->description('Vul vragen en keuzelabels in voor elke gepubliceerde taal. Historische antwoorden blijven bewaard.')->schema([
                Repeater::make('questions')->label('Vragen')->relationship()->maxItems(100)->orderColumn('sort_order')->reorderable()->collapsible()->schema([
                    Select::make('type')->label('Vraagtype')->options(VacancyQuestion::TYPES)->required()->live(),
                    TextInput::make('short_label')->label('Kort screeninglabel')->maxLength(80),
                    Toggle::make('required')->label('Verplicht')->default(true),
                    Toggle::make('active')->label('Actief')->default(true),
                    Toggle::make('show_in_email_subject')->label('In mailonderwerp')->default(false),
                    Tabs::make('Vraagvertalingen')->tabs(array_map(fn (string $locale): Tab => Tab::make(strtoupper($locale))->schema([
                        TextInput::make("question.$locale")->label('Vraag')->required($locale === 'nl')->maxLength(500),
                        Textarea::make("help_text.$locale")->label('Helptekst')->maxLength(1000),
                    ]), ['nl', 'fr', 'en']))->columnSpanFull(),
                    Repeater::make('options')->label('Keuzes')->visible(fn (Get $get): bool => in_array($get('type'), ['single_choice', 'multiple_choice'], true))->required(fn (Get $get): bool => in_array($get('type'), ['single_choice', 'multiple_choice'], true))->minItems(1)->schema([
                        TextInput::make('value')->label('Vaste interne waarde')->required()->regex('/^[a-zA-Z0-9_-]+$/')->maxLength(80)->distinct(),
                        TextInput::make('labels.nl')->label('Label NL')->required()->maxLength(255),
                        TextInput::make('labels.fr')->label('Label FR')->maxLength(255),
                        TextInput::make('labels.en')->label('Label EN')->maxLength(255),
                    ])->columnSpanFull(),
                ])->columns(2)->columnSpanFull(),
            ])->columnSpanFull(),
        ]);
    }

    private static function translation(string $locale): Tab
    {
        return Tab::make(strtoupper($locale))->schema([
            TextInput::make("title.$locale")->label('Titel')->required($locale === 'nl')->maxLength(255)->live(onBlur: true)
                ->afterStateUpdated(function (?string $state, Set $set, string $operation) use ($locale): void {
                    if ($operation === 'create') {
                        $set("slug.$locale", Str::slug($state ?? ''));
                    }
                }),
            TextInput::make("slug.$locale")->label('Slug')->required($locale === 'nl')->maxLength(255)->regex('/^[a-z0-9]+(?:-[a-z0-9]+)*$/')
                ->rules(fn (?Vacancy $record): array => [Rule::unique('vacancies', "slug->$locale")->ignore($record?->id)]),
            Textarea::make("short_description.$locale")->label('Korte omschrijving')->required($locale === 'nl')->maxLength(2000),
            RichEditor::make("content.$locale")->label('Inhoud')->required($locale === 'nl')->columnSpanFull(),
            TextInput::make("meta_title.$locale")->label('SEO-titel')->maxLength(255),
            Textarea::make("meta_description.$locale")->label('SEO-omschrijving')->maxLength(500),
        ]);
    }
}
