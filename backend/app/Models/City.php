<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    protected $fillable = ['name', 'slug', 'province', 'region'];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }
}