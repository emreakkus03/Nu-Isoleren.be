<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class JobApplicationAnswer extends Model
{
    protected $fillable = ['question_id', 'question', 'type', 'short_label', 'show_in_email_subject', 'value', 'answer_label', 'locale', 'sort_order'];

    protected function casts(): array
    {
        return ['value' => 'json', 'show_in_email_subject' => 'boolean'];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(JobApplication::class, 'job_application_id');
    }
}
