<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    protected $fillable = ['name',
        'postal_code',
        'slug',
        'province',
        'region',
        'is_featured',];


        protected $casts = [
        'is_featured' => 'boolean',
    ];
    
    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}