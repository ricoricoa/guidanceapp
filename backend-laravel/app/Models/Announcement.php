<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'counselor_id',
        'title',
        'content',
        'category',
        'is_active',
        'published_at',
    ];

    protected $casts = [
        'published_at' => 'datetime',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the counselor that created this announcement
     */
    public function counselor()
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }

    /**
     * Get all comments on this announcement
     */
    public function comments()
    {
        return $this->hasMany(AnnouncementComment::class)->whereNull('deleted_at')->orderBy('created_at', 'desc');
    }

    /**
     * Get all reactions on this announcement
     */
    public function reactions()
    {
        return $this->hasMany(AnnouncementReaction::class);
    }

    /**
     * Scope to get only active announcements
     */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope to get only published announcements
     */
    public function scopePublished($query)
    {
        return $query->whereNotNull('published_at')->orderBy('published_at', 'desc');
    }
}
