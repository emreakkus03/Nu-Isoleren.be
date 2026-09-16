<?php

namespace App\Filament\Resources\Services;

use App\Filament\Resources\Services\Pages;
use App\Models\Service;
use Filament\Actions\DeleteAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\Builder;
use Filament\Forms\Components\Builder\Block;
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

    private static function serviceSections(string $locale): Repeater
    {
        $labels = [
            'nl' => [
                'sections' => 'Inhoudsblokken',
                'section_settings' => 'Sectie instellingen',
                'nav_title' => 'Titel in linkermenu',
                'nav_placeholder' => 'bijv. Voordelen',
                'slug' => 'Anker ID (#)',
                'heading' => 'Koptekst van het blok (H2)',
                'show_in_menu' => 'Tonen in sticky menu',
                'active' => 'Sectie actief',
                'background' => 'Achtergrondkleur',
                'text_color' => 'Tekstkleur',
                'content_width' => 'Contentbreedte',
                'body' => 'Basistekst',
                'bullets' => 'Eenvoudige opsommingen',
                'images' => 'Eenvoudige foto\'s',
                'builder' => 'Flexibele content',
                'add_section' => 'Sectie toevoegen',
            ],
            'fr' => [
                'sections' => 'Blocs de contenu',
                'section_settings' => 'Paramètres de la section',
                'nav_title' => 'Titre dans le menu',
                'nav_placeholder' => 'ex. Avantages',
                'slug' => 'ID d\'ancre (#)',
                'heading' => 'Titre du bloc (H2)',
                'show_in_menu' => 'Afficher dans le menu sticky',
                'active' => 'Section active',
                'background' => 'Couleur de fond',
                'text_color' => 'Couleur du texte',
                'content_width' => 'Largeur du contenu',
                'body' => 'Texte principal',
                'bullets' => 'Liste simple',
                'images' => 'Photos simples',
                'builder' => 'Contenu flexible',
                'add_section' => 'Ajouter une section',
            ],
            'en' => [
                'sections' => 'Content sections',
                'section_settings' => 'Section settings',
                'nav_title' => 'Title in menu',
                'nav_placeholder' => 'e.g. Benefits',
                'slug' => 'Anchor ID (#)',
                'heading' => 'Section heading (H2)',
                'show_in_menu' => 'Show in sticky menu',
                'active' => 'Section active',
                'background' => 'Background color',
                'text_color' => 'Text color',
                'content_width' => 'Content width',
                'body' => 'Main text',
                'bullets' => 'Simple bullet points',
                'images' => 'Simple photos',
                'builder' => 'Flexible content',
                'add_section' => 'Add section',
            ],
        ];

        $t = $labels[$locale];

        return Repeater::make("sections.{$locale}")
            ->label($t['sections'])
            ->schema([
                Section::make($t['section_settings'])
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('nav_title')
                                ->label($t['nav_title'])
                                ->placeholder($t['nav_placeholder'])
                                ->required()
                                ->live(onBlur: true)
                                ->afterStateUpdated(
                                    fn ($set, ?string $state) =>
                                        $set('slug', Str::slug($state))
                                ),

                            TextInput::make('slug')
                                ->label($t['slug'])
                                ->required(),
                        ]),

                        TextInput::make('heading')
                            ->label($t['heading'])
                            ->required(),

                        Grid::make(3)->schema([
                            Toggle::make('show_in_menu')
                                ->label($t['show_in_menu'])
                                ->default(true),

                            Toggle::make('is_active')
                                ->label($t['active'])
                                ->default(true),

                            Select::make('content_width')
                                ->label($t['content_width'])
                                ->options([
                                    'normal' => 'Normal',
                                    'wide' => 'Wide',
                                    'full' => 'Full width',
                                ])
                                ->default('normal'),
                        ]),

                        Grid::make(2)->schema([
                            ColorPicker::make('background_color')
                                ->label($t['background'])
                                ->default('#FFFFFF'),

                            ColorPicker::make('text_color')
                                ->label($t['text_color'])
                                ->default('#0F172A'),
                        ]),
                    ])
                    ->collapsible(),

                Section::make($t['body'])
                    ->schema([
                        RichEditor::make('body')
                            ->label($t['body'])
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'bulletList',
                                'orderedList',
                                'link',
                            ]),

                        Repeater::make('bullet_points')
                            ->label($t['bullets'])
                            ->schema([
                                Grid::make(3)->schema([
                                    Select::make('icon')
                                        ->label('Icoon / Icon')
                                        ->options([
                                            'check' => 'Check',
                                            'check-circle' => 'Check circle',
                                            'star' => 'Star',
                                            'arrow' => 'Arrow',
                                            'shield' => 'Shield',
                                            'home' => 'Home',
                                            'energy' => 'Energy',
                                            'water' => 'Water',
                                            'info' => 'Info',
                                        ])
                                        ->default('check')
                                        ->required(),

                                    ColorPicker::make('color')
                                        ->label('Kleur / Color')
                                        ->default('#1A669A')
                                        ->required(),

                                    TextInput::make('text')
                                        ->label('Tekst / Text')
                                        ->required(),
                                ]),
                            ])
                            ->collapsible()
                            ->collapsed()
                            ->reorderable()
                            ->itemLabel(
                                fn (array $state): ?string =>
                                    $state['text'] ?? null
                            ),

                        FileUpload::make('images')
                            ->label($t['images'])
                            ->disk('s3')
                            ->directory('services/sections')
                            ->visibility('public')
                            ->image()
                            ->multiple()
                            ->reorderable()
                            ->panelLayout('grid'),
                    ])
                    ->collapsible()
                    ->collapsed(),

                self::contentBuilder($locale),
            ])
            ->collapsible()
            ->cloneable()
            ->reorderable()
            ->addActionLabel($t['add_section'])
            ->itemLabel(
                fn (array $state): ?string =>
                    $state['nav_title'] ?? null
            );
    }

    private static function contentBuilder(string $locale): Builder
    {
        $labels = [
            'nl' => [
                'builder' => 'Flexibele content',
                'add' => 'Contentblok toevoegen',
                'text' => 'Tekst',
                'text_image' => 'Tekst + afbeelding',
                'image' => 'Afbeelding',
                'bullets' => 'Checklist / opsomming',
                'cards' => 'Cards',
                'steps' => 'Stappenplan',
                'buttons' => 'Buttons / interne links',
                'callout' => 'Info / CTA blok',
                'table' => 'Tabel',
                'document' => 'Document / certificaat',
                'projects' => 'Realisaties',
                'faq' => 'FAQ',
                'divider' => 'Tussenruimte / scheidingslijn',
            ],
            'fr' => [
                'builder' => 'Contenu flexible',
                'add' => 'Ajouter un bloc',
                'text' => 'Texte',
                'text_image' => 'Texte + image',
                'image' => 'Image',
                'bullets' => 'Liste / checklist',
                'cards' => 'Cartes',
                'steps' => 'Étapes',
                'buttons' => 'Boutons / liens internes',
                'callout' => 'Bloc info / CTA',
                'table' => 'Tableau',
                'document' => 'Document / certificat',
                'projects' => 'Réalisations',
                'faq' => 'FAQ',
                'divider' => 'Espace / séparateur',
            ],
            'en' => [
                'builder' => 'Flexible content',
                'add' => 'Add content block',
                'text' => 'Text',
                'text_image' => 'Text + image',
                'image' => 'Image',
                'bullets' => 'Checklist / bullet list',
                'cards' => 'Cards',
                'steps' => 'Steps',
                'buttons' => 'Buttons / internal links',
                'callout' => 'Info / CTA block',
                'table' => 'Table',
                'document' => 'Document / certificate',
                'projects' => 'Projects',
                'faq' => 'FAQ',
                'divider' => 'Spacing / divider',
            ],
        ];

        $t = $labels[$locale];

        return Builder::make('content_blocks')
            ->label($t['builder'])
            ->blocks([
                Block::make('rich_text')
                    ->label($t['text'])
                    ->schema([
                        RichEditor::make('content')
                            ->label($t['text'])
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'bulletList',
                                'orderedList',
                                'link',
                            ]),
                    ]),

                Block::make('text_image')
                    ->label($t['text_image'])
                    ->schema([
                        Grid::make(2)->schema([
                            Select::make('image_position')
                                ->label('Afbeeldingspositie / Image position')
                                ->options([
                                    'left' => 'Left',
                                    'right' => 'Right',
                                ])
                                ->default('right')
                                ->required(),

                            Select::make('vertical_alignment')
                                ->label('Verticale uitlijning / Vertical alignment')
                                ->options([
                                    'start' => 'Top',
                                    'center' => 'Center',
                                    'end' => 'Bottom',
                                ])
                                ->default('center'),
                        ]),

                        RichEditor::make('content')
                            ->label('Tekst / Text')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'bulletList',
                                'orderedList',
                                'link',
                            ]),

                        FileUpload::make('image')
                            ->label('Afbeelding / Image')
                            ->disk('s3')
                            ->directory('services/sections')
                            ->visibility('public')
                            ->image()
                            ->required(),

                        TextInput::make('image_alt')
                            ->label('Alt-tekst / Alt text')
                            ->required(),

                        TextInput::make('caption')
                            ->label('Bijschrift / Caption'),

                        Grid::make(2)->schema([
                            ColorPicker::make('background_color')
                                ->label('Achtergrondkleur / Background')
                                ->default('#FFFFFF'),

                            Select::make('image_radius')
                                ->label('Afronding afbeelding / Image radius')
                                ->options([
                                    'none' => 'None',
                                    'small' => 'Small',
                                    'medium' => 'Medium',
                                    'large' => 'Large',
                                ])
                                ->default('large'),
                        ]),
                    ]),

                Block::make('image')
                    ->label($t['image'])
                    ->schema([
                        FileUpload::make('image')
                            ->label('Afbeelding / Image')
                            ->disk('s3')
                            ->directory('services/sections')
                            ->visibility('public')
                            ->image()
                            ->required(),

                        TextInput::make('alt')
                            ->label('Alt-tekst / Alt text')
                            ->helperText('Beschrijf wat daadwerkelijk op de afbeelding staat.')
                            ->required(),

                        TextInput::make('caption')
                            ->label('Bijschrift / Caption'),

                        Grid::make(3)->schema([
                            Select::make('width')
                                ->label('Breedte / Width')
                                ->options([
                                    'small' => 'Small',
                                    'medium' => 'Medium',
                                    'large' => 'Large',
                                    'full' => 'Full width',
                                ])
                                ->default('full'),

                            Select::make('alignment')
                                ->label('Uitlijning / Alignment')
                                ->options([
                                    'left' => 'Left',
                                    'center' => 'Center',
                                    'right' => 'Right',
                                ])
                                ->default('center'),

                            Select::make('aspect_ratio')
                                ->label('Beeldverhouding / Aspect ratio')
                                ->options([
                                    'auto' => 'Automatic',
                                    'square' => '1:1',
                                    'landscape' => '4:3',
                                    'wide' => '16:9',
                                ])
                                ->default('auto'),
                        ]),
                    ]),

                Block::make('bullets')
                    ->label($t['bullets'])
                    ->schema([
                        Grid::make(3)->schema([
                            Select::make('style')
                                ->label('Stijl / Style')
                                ->options([
                                    'simple' => 'Simple',
                                    'checklist' => 'Checklist',
                                    'icons' => 'Icons',
                                ])
                                ->default('checklist'),

                            Select::make('columns')
                                ->label('Kolommen / Columns')
                                ->options([
                                    '1' => '1',
                                    '2' => '2',
                                    '3' => '3',
                                ])
                                ->default('1'),

                            ColorPicker::make('icon_color')
                                ->label('Icoonkleur / Icon color')
                                ->default('#1A669A'),
                        ]),

                        Repeater::make('items')
                            ->label('Punten / Items')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('title')
                                        ->label('Titel / Title'),

                                    Select::make('icon')
                                        ->label('Icoon / Icon')
                                        ->options([
                                            'check' => 'Check',
                                            'check-circle' => 'Check circle',
                                            'arrow' => 'Arrow',
                                            'star' => 'Star',
                                            'shield' => 'Shield',
                                            'home' => 'Home',
                                            'energy' => 'Energy',
                                            'water' => 'Water',
                                            'clock' => 'Clock',
                                            'euro' => 'Euro',
                                            'info' => 'Info',
                                        ])
                                        ->default('check'),
                                ]),

                                Textarea::make('text')
                                    ->label('Tekst / Text')
                                    ->rows(2)
                                    ->required(),
                            ])
                            ->collapsible()
                            ->reorderable()
                            ->cloneable()
                            ->itemLabel(
                                fn (array $state): ?string =>
                                    $state['title']
                                    ?? $state['text']
                                    ?? null
                            ),
                    ]),

                Block::make('cards')
                    ->label($t['cards'])
                    ->schema([
                        Grid::make(4)->schema([
                            Select::make('columns')
                                ->label('Kolommen / Columns')
                                ->options([
                                    '2' => '2',
                                    '3' => '3',
                                    '4' => '4',
                                ])
                                ->default('3')
                                ->required(),

                            ColorPicker::make('background_color')
                                ->label('Standaard achtergrond')
                                ->default('#F7F8FA'),

                            ColorPicker::make('border_color')
                                ->label('Standaard randkleur')
                                ->default('#E2E8F0'),

                            ColorPicker::make('text_color')
                                ->label('Standaard tekstkleur')
                                ->default('#0F172A'),
                        ]),

                        Select::make('card_style')
                            ->label('Card stijl')
                            ->options([
                                'default' => 'Default',
                                'minimal' => 'Minimal',
                                'bordered' => 'Bordered',
                                'filled' => 'Filled',
                            ])
                            ->default('default'),

                        Repeater::make('items')
                            ->label('Cards')
                            ->schema([
                                TextInput::make('title')
                                    ->label('Titel')
                                    ->required(),

                                Textarea::make('description')
                                    ->label('Beschrijving')
                                    ->rows(3),

                                Grid::make(3)->schema([
                                    Select::make('icon')
                                        ->label('Icoon')
                                        ->options([
                                            'check' => 'Check',
                                            'check-circle' => 'Check circle',
                                            'shield' => 'Shield',
                                            'home' => 'Home',
                                            'energy' => 'Energy',
                                            'water' => 'Water',
                                            'star' => 'Star',
                                            'clock' => 'Clock',
                                            'euro' => 'Euro',
                                            'tools' => 'Tools',
                                            'info' => 'Info',
                                        ]),

                                    ColorPicker::make('background_color')
                                        ->label('Eigen achtergrond'),

                                    ColorPicker::make('icon_color')
                                        ->label('Icoonkleur')
                                        ->default('#1A669A'),
                                ]),

                                FileUpload::make('image')
                                    ->label('Optionele afbeelding')
                                    ->disk('s3')
                                    ->directory('services/cards')
                                    ->visibility('public')
                                    ->image(),

                                TextInput::make('image_alt')
                                    ->label('Alt-tekst afbeelding'),

                                Grid::make(2)->schema([
                                    TextInput::make('link_label')
                                        ->label('Optionele linktekst'),

                                    TextInput::make('url')
                                        ->label('Optionele URL')
                                        ->placeholder('/diensten/...'),
                                ]),
                            ])
                            ->collapsible()
                            ->cloneable()
                            ->reorderable()
                            ->itemLabel(
                                fn (array $state): ?string =>
                                    $state['title'] ?? null
                            ),
                    ]),

                Block::make('steps')
                    ->label($t['steps'])
                    ->schema([
                        Grid::make(2)->schema([
                            Select::make('layout')
                                ->label('Layout')
                                ->options([
                                    'vertical' => 'Vertical',
                                    'horizontal' => 'Horizontal',
                                    'cards' => 'Cards',
                                ])
                                ->default('vertical'),

                            ColorPicker::make('accent_color')
                                ->label('Accentkleur')
                                ->default('#1A669A'),
                        ]),

                        Repeater::make('items')
                            ->label('Stappen')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('number')
                                        ->label('Nummer')
                                        ->placeholder('01'),

                                    TextInput::make('title')
                                        ->label('Titel')
                                        ->required(),
                                ]),

                                Textarea::make('description')
                                    ->label('Beschrijving')
                                    ->rows(3),

                                FileUpload::make('image')
                                    ->label('Optionele foto')
                                    ->disk('s3')
                                    ->directory('services/steps')
                                    ->visibility('public')
                                    ->image(),

                                TextInput::make('image_alt')
                                    ->label('Alt-tekst foto'),
                            ])
                            ->reorderable()
                            ->cloneable()
                            ->collapsible()
                            ->itemLabel(
                                fn (array $state): ?string =>
                                    trim(
                                        ($state['number'] ?? '')
                                        . ' '
                                        . ($state['title'] ?? '')
                                    )
                            ),
                    ]),

                Block::make('buttons')
                    ->label($t['buttons'])
                    ->schema([
                        Select::make('alignment')
                            ->label('Uitlijning')
                            ->options([
                                'left' => 'Links',
                                'center' => 'Midden',
                                'right' => 'Rechts',
                            ])
                            ->default('left'),

                        Repeater::make('items')
                            ->label('Buttons')
                            ->schema([
                                Grid::make(2)->schema([
                                    TextInput::make('label')
                                        ->label('Buttontekst')
                                        ->required(),

                                    TextInput::make('url')
                                        ->label('URL')
                                        ->placeholder('/diensten/eps-isolatie')
                                        ->required(),
                                ]),

                                Grid::make(2)->schema([
                                    Select::make('link_type')
                                        ->label('Type link')
                                        ->options([
                                            'internal' => 'Interne link',
                                            'external' => 'Externe link',
                                            'anchor' => 'Ankerlink',
                                            'phone' => 'Telefoon',
                                            'email' => 'E-mail',
                                        ])
                                        ->default('internal'),

                                    Select::make('style')
                                        ->label('Buttonstijl')
                                        ->options([
                                            'filled' => 'Gevuld',
                                            'outline' => 'Outline',
                                            'text' => 'Tekstlink',
                                        ])
                                        ->default('filled')
                                        ->required(),
                                ]),

                                Grid::make(3)->schema([
                                    ColorPicker::make('background_color')
                                        ->label('Achtergrond')
                                        ->default('#D42127'),

                                    ColorPicker::make('text_color')
                                        ->label('Tekstkleur')
                                        ->default('#FFFFFF'),

                                    ColorPicker::make('border_color')
                                        ->label('Randkleur')
                                        ->default('#D42127'),
                                ]),

                                Grid::make(2)->schema([
                                    Select::make('icon')
                                        ->label('Icoon')
                                        ->options([
                                            'none' => 'Geen',
                                            'arrow-right' => 'Pijl rechts',
                                            'phone' => 'Telefoon',
                                            'calculator' => 'Calculator',
                                            'document' => 'Document',
                                            'external' => 'Externe link',
                                        ])
                                        ->default('arrow-right'),

                                    Toggle::make('new_tab')
                                        ->label('Openen in nieuw tabblad')
                                        ->default(false),
                                ]),
                            ])
                            ->collapsible()
                            ->cloneable()
                            ->reorderable()
                            ->itemLabel(
                                fn (array $state): ?string =>
                                    $state['label'] ?? null
                            ),
                    ]),

                Block::make('callout')
                    ->label($t['callout'])
                    ->schema([
                        TextInput::make('title')
                            ->label('Titel'),

                        RichEditor::make('content')
                            ->label('Tekst')
                            ->toolbarButtons([
                                'bold',
                                'italic',
                                'bulletList',
                                'link',
                            ]),

                        Grid::make(3)->schema([
                            ColorPicker::make('background_color')
                                ->label('Achtergrond')
                                ->default('#F1F5F9'),

                            ColorPicker::make('text_color')
                                ->label('Tekstkleur')
                                ->default('#0F172A'),

                            ColorPicker::make('border_color')
                                ->label('Randkleur')
                                ->default('#CBD5E1'),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('button_label')
                                ->label('Optionele buttontekst'),

                            TextInput::make('button_url')
                                ->label('Optionele button URL'),
                        ]),

                        Grid::make(3)->schema([
                            Select::make('button_style')
                                ->label('Buttonstijl')
                                ->options([
                                    'filled' => 'Gevuld',
                                    'outline' => 'Outline',
                                    'text' => 'Tekstlink',
                                ])
                                ->default('filled'),

                            ColorPicker::make('button_background')
                                ->label('Button achtergrond')
                                ->default('#D42127'),

                            ColorPicker::make('button_text_color')
                                ->label('Button tekstkleur')
                                ->default('#FFFFFF'),
                        ]),
                    ]),

                Block::make('table')
                    ->label($t['table'])
                    ->schema([
                        TextInput::make('caption')
                            ->label('Titel boven tabel'),

                        Repeater::make('rows')
                            ->label('Rijen')
                            ->schema([
                                Grid::make(3)->schema([
                                    TextInput::make('label')
                                        ->label('Label')
                                        ->required(),

                                    TextInput::make('value')
                                        ->label('Waarde')
                                        ->required(),

                                    TextInput::make('extra')
                                        ->label('Extra info'),
                                ]),
                            ])
                            ->reorderable()
                            ->cloneable(),

                        Grid::make(3)->schema([
                            ColorPicker::make('header_background')
                                ->label('Header achtergrond')
                                ->default('#1A669A'),

                            ColorPicker::make('header_text_color')
                                ->label('Header tekst')
                                ->default('#FFFFFF'),

                            ColorPicker::make('border_color')
                                ->label('Randkleur')
                                ->default('#E2E8F0'),
                        ]),
                    ]),

                Block::make('document')
                    ->label($t['document'])
                    ->schema([
                        Grid::make(2)->schema([
                            TextInput::make('title')
                                ->label('Titel')
                                ->required(),

                            TextInput::make('document_number')
                                ->label('Nummer / referentie'),
                        ]),

                        Textarea::make('description')
                            ->label('Beschrijving')
                            ->rows(3),

                        Grid::make(2)->schema([
                            TextInput::make('issuer')
                                ->label('Uitgever / instantie'),

                            TextInput::make('url')
                                ->label('Publieke URL'),
                        ]),

                        FileUpload::make('file')
                            ->label('Document uploaden')
                            ->disk('s3')
                            ->directory('services/documents')
                            ->visibility('public'),

                        FileUpload::make('preview_image')
                            ->label('Optionele preview')
                            ->disk('s3')
                            ->directory('services/documents/previews')
                            ->visibility('public')
                            ->image(),

                        TextInput::make('button_label')
                            ->label('Buttontekst')
                            ->default('Bekijk document'),

                        Grid::make(3)->schema([
                            ColorPicker::make('background_color')
                                ->label('Achtergrond')
                                ->default('#F7F8FA'),

                            ColorPicker::make('accent_color')
                                ->label('Accentkleur')
                                ->default('#1A669A'),

                            ColorPicker::make('text_color')
                                ->label('Tekstkleur')
                                ->default('#0F172A'),
                        ]),
                    ]),

                Block::make('projects')
                    ->label($t['projects'])
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('limit')
                                ->label('Aantal projecten')
                                ->numeric()
                                ->default(3)
                                ->minValue(1)
                                ->maxValue(12),

                            Toggle::make('show_location')
                                ->label('Locatie tonen')
                                ->default(true),

                            Toggle::make('show_description')
                                ->label('Beschrijving tonen')
                                ->default(false),
                        ]),

                        Toggle::make('current_service_only')
                            ->label('Alleen realisaties van deze dienst')
                            ->default(true),

                        Grid::make(2)->schema([
                            TextInput::make('button_label')
                                ->label('Buttontekst')
                                ->default('Bekijk alle realisaties'),

                            TextInput::make('button_url')
                                ->label('Button URL')
                                ->default('/realisaties'),
                        ]),
                    ]),

                Block::make('faq')
                    ->label($t['faq'])
                    ->schema([
                        Grid::make(3)->schema([
                            TextInput::make('limit')
                                ->label('Maximum aantal vragen')
                                ->numeric()
                                ->default(8)
                                ->minValue(1),

                            Toggle::make('current_service_only')
                                ->label('Alleen FAQ van deze dienst')
                                ->default(true),

                            Toggle::make('accordion')
                                ->label('Accordion')
                                ->default(true),
                        ]),

                        Grid::make(2)->schema([
                            TextInput::make('button_label')
                                ->label('Optionele linktekst')
                                ->default('Bekijk alle veelgestelde vragen'),

                            TextInput::make('button_url')
                                ->label('URL')
                                ->default('/faq'),
                        ]),
                    ]),

                Block::make('divider')
                    ->label($t['divider'])
                    ->schema([
                        Grid::make(3)->schema([
                            Select::make('style')
                                ->label('Type')
                                ->options([
                                    'space' => 'Alleen witruimte',
                                    'line' => 'Scheidingslijn',
                                ])
                                ->default('space'),

                            Select::make('size')
                                ->label('Grootte')
                                ->options([
                                    'small' => 'Klein',
                                    'medium' => 'Normaal',
                                    'large' => 'Groot',
                                ])
                                ->default('medium'),

                            ColorPicker::make('color')
                                ->label('Lijnkleur')
                                ->default('#E2E8F0'),
                        ]),
                    ]),
            ])
            ->collapsible()
            ->cloneable()
            ->reorderable()
            ->addActionLabel($t['add']);
    }

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
                                ->afterStateUpdated(
                                    fn ($set, ?string $state) =>
                                        $set('slug.nl', Str::slug($state))
                                ),

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
                        self::serviceSections('nl'),
                    ]),

                    Section::make('SEO')
                        ->collapsed()
                        ->schema([
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
                                ->afterStateUpdated(
                                    fn ($set, ?string $state) =>
                                        $set('slug.fr', Str::slug($state))
                                ),

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

                    Section::make('Contenu & Menu Sticky')->schema([
                        self::serviceSections('fr'),
                    ]),

                    Section::make('SEO (FR)')
                        ->collapsed()
                        ->schema([
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
                                ->afterStateUpdated(
                                    fn ($set, ?string $state) =>
                                        $set('slug.en', Str::slug($state))
                                ),

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

                    Section::make('Content & Sticky Menu')->schema([
                        self::serviceSections('en'),
                    ]),

                    Section::make('SEO (EN)')
                        ->collapsed()
                        ->schema([
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
                    ->formatStateUsing(
                        fn ($record) =>
                            $record->getTranslation('name', 'nl', false) ?: '-'
                    )
                    ->searchable(),

                Tables\Columns\TextColumn::make('badge')
                    ->label('Badge (NL)')
                    ->formatStateUsing(
                        fn ($record) =>
                            $record->getTranslation('badge', 'nl', false) ?: '-'
                    )
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