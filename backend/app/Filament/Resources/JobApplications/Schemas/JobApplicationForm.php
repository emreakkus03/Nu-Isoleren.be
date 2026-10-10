<?php

namespace App\Filament\Resources\JobApplications\Schemas;

use App\Models\JobApplication;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\View;
use Filament\Schemas\Schema;

class JobApplicationForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema->components([
            View::make('filament.recruitment-screening')->columnSpanFull(),
            Section::make('Opvolging')->schema([
                Select::make('status')->label('Status')->options(JobApplication::STATUSES)->required(),
                Textarea::make('internal_notes')->label('Interne notities')->rows(6)->maxLength(20000),
            ])->columnSpanFull(),
        ]);
    }
}
