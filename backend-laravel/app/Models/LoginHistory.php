<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LoginHistory extends Model
{
    protected $fillable = [
        'user_id',
        'login_time',
        'logout_time',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'login_time' => 'datetime',
        'logout_time' => 'datetime',
    ];

    /**
     * Get the user associated with this login history
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
