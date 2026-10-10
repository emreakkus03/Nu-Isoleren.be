<?php

namespace App\Filament\Resources\JobApplications\Tables;

use App\Models\JobApplication;
use Filament\Actions\EditAction;
use Filament\Forms\Components\DatePicker;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class JobApplicationsTable
{
    public static function configure(Table $table): Table
    {
        return $table->columns([
            TextColumn::make('first_name')->label('Voornaam')->searchable(),
            TextColumn::make('last_name')->label('Achternaam')->searchable()->sortable(),
            TextColumn::make('email')->label('E-mail')->searchable()->toggleable(),
            TextColumn::make('vacancy_title')->label('Vacature')->searchable(),
            TextColumn::make('city')->label('Gemeente')->searchable(),
            TextColumn::make('status')->label('Status')->badge()->formatStateUsing(fn (string $state): string => JobApplication::STATUSES[$state] ?? $state),
            TextColumn::make('submitted_at')->label('Datum')->dateTime()->sortable(),
            TextColumn::make('source')->label('Bron'),
            IconColumn::make('linkedin_url')->label('LinkedIn')->boolean()->getStateUsing(fn (JobApplication $record): bool => filled($record->linkedin_url)),
            IconColumn::make('has_cv')->label('CV')->boolean(),
            TextColumn::make('internal_mail_status')->label('Recruitmentmail')->badge()->formatStateUsing(fn (string $state): string => ['pending' => 'In behandeling', 'sent' => 'Verzonden', 'failed' => 'Mislukt'][$state] ?? $state),
        ])->filters([
            SelectFilter::make('vacancy_id')->label('Vacature')->relationship('vacancy', 'title'),
            SelectFilter::make('status')->options(JobApplication::STATUSES),
            SelectFilter::make('source')->label('Bron')->options(fn (): array => JobApplication::query()->distinct()->pluck('source', 'source')->all()),
            SelectFilter::make('internal_mail_status')->label('Recruitmentmail')->options(['failed' => 'Mislukt', 'sent' => 'Verzonden', 'pending' => 'In behandeling']),
            Filter::make('submitted_at')->label('Datum')->schema([DatePicker::make('from')->label('Vanaf'), DatePicker::make('until')->label('Tot en met')])
                ->query(fn (Builder $query, array $data): Builder => $query->when($data['from'] ?? null, fn (Builder $q, string $date): Builder => $q->whereDate('submitted_at', '>=', $date))->when($data['until'] ?? null, fn (Builder $q, string $date): Builder => $q->whereDate('submitted_at', '<=', $date))),
        ])->recordActions([EditAction::make()->label('Bekijken / opvolgen')])->defaultSort('submitted_at', 'desc');
    }
}
