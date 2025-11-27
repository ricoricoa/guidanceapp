<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CounselorReview extends Model
{
    /** @use HasFactory<\Database\Factories\CounselorReviewFactory> */
    use HasFactory;

    protected $fillable = [
        'student_id',
        'counselor_id',
        'rating',
        'comment',
    ];

    protected $casts = [
        'rating' => 'integer',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the student who submitted the review
     */
    public function student()
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    /**
     * Get the counselor being reviewed
     */
    public function counselor()
    {
        return $this->belongsTo(User::class, 'counselor_id');
    }
}
