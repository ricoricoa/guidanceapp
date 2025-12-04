<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AnnouncementReaction extends Model
{
    use HasFactory;

    public $timestamps = true;

    protected $fillable = [
        'announcement_id',
        'user_id',
        'emoji',
    ];

    /**
     * Get the announcement this reaction is for
     */
    public function announcement()
    {
        return $this->belongsTo(Announcement::class);
    }

    /**
     * Get the user who made this reaction
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
