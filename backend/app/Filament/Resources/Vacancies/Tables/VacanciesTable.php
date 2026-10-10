<?php

namespace App\Filament\Resources\Vacancies\Tables;

use App\Models\Vacancy;
use Filament\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;

class VacanciesTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('title')->label('Vacature')->searchable()->sortable(),
            TextColumn::make('region')->label('Regio')->searchable(),
            TextColumn::make('status')->label('Status')->badge()->formatStateUsing(fn (string $state): string => Vacancy::STATUSES[$state] ?? $state),
            TextColumn::make('published_at')->label('Gepubliceerd')->dateTime()->sortable(),
            TextColumn::make('valid_through')->label('Sluitingsdatum')->dateTime()->sortable(),
        ])->filters([SelectFilter::make('status')->options(Vacancy::STATUSES)])->recordActions([EditAction::make()])->defaultSort('sort_order');
    }
}
