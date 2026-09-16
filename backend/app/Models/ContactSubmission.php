<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ContactSubmission extends Model
{
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'message',
        'locale',
        'source',
        'privacy_accepted_at',
        'status',
        'internal_notes',
        'crm_status',
        'crm_external_id',
        'crm_synced_at',
    ];

    protected function casts(): array
    {
        return [
            'privacy_accepted_at' => 'datetime',
            'crm_synced_at' => 'datetime',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }
}