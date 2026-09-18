<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class QuoteRequest extends Model
{
    protected $fillable = [
        'reference',
        'first_name',
        'last_name',
        'email',
        'phone',
        'street',
        'house_number',
        'postcode',
        'city',
        'message',
        'locale',
        'status',
        'privacy_consent_at',
    ];

    protected function casts(): array
    {
        return [
            'privacy_consent_at' => 'datetime',
        ];
    }

    public function services(): BelongsToMany
    {
        return $this->belongsToMany(Service::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getFullAddressAttribute(): string
    {
        return "{$this->street} {$this->house_number}, {$this->postcode} {$this->city}";
    }
}