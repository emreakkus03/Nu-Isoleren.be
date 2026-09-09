<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class ProjectImage extends Model
{
    protected $fillable = [
        'project_id',
        'image',
        'alt',
        'caption',
        'sort_order',
    ];

    protected $appends = ['image_url'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        if (! $this->image) {
            return null;
        }

        $baseUrl = config('filesystems.disks.minio.url');

        return $baseUrl
            ? rtrim((string) $baseUrl, '/') . '/' . ltrim($this->image, '/')
            : null;
    }
}