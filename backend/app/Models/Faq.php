<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Spatie\Translatable\HasTranslations;

class Faq extends Model
{
    use HasTranslations;

    protected $fillable = [
        'service_id',
        'category',
        'question',
        'answer',
        'is_featured_home',
        'sort_order',
    ];

    public array $translatable = [
        'question',
        'answer',
    ];

    public function service(): BelongsTo
    {
        return $this->belongsTo(Service::class);
    }
}