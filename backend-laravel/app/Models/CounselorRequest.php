<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CounselorRequest extends Model
{
    /** @use HasFactory<\Database\Factories\CounselorRequestFactory> */
    use HasFactory;

    protected $fillable = [
        'student_id',
        'counselor_id',
        'requested_date',
        'requested_time',
        'topic',
        'status',
        'notes',
    ];

    protected $casts = [
        'requested_date' => 'date',
    ];

    /**
     * Get the student who made the request.
     */
    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the assigned counselor.
     */
    public function counselor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }
}
