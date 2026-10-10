<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class JobApplication extends Model
{
    public const STATUSES = ['new' => 'Nieuw', 'contacted' => 'Gecontacteerd', 'suitable' => 'Geschikt', 'interview_scheduled' => 'Kennismaking gepland', 'rejected' => 'Afgewezen'];

    protected $fillable = ['vacancy_id', 'vacancy_title', 'first_name', 'last_name', 'email', 'phone', 'city', 'linkedin_url', 'has_cv', 'locale', 'status', 'submitted_at', 'privacy_accepted_at', 'source', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'internal_notes', 'internal_mail_status', 'confirmation_mail_status'];

    protected function casts(): array
    {
        return ['has_cv' => 'boolean', 'submitted_at' => 'datetime', 'privacy_accepted_at' => 'datetime'];
    }

    public function vacancy(): BelongsTo
    {
        return $this->belongsTo(Vacancy::class);
    }

    public function answers(): HasMany
    {
        return $this->hasMany(JobApplicationAnswer::class)->orderBy('sort_order')->orderBy('id');
    }
}
