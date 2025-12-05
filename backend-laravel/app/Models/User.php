<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Auth\Passwords\CanResetPassword;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasApiTokens, HasFactory, Notifiable, CanResetPassword;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'role',
        'address',
        'phone',
        'year',
        'bio',
        'profile_picture_path',
        'profile_picture',
        'password',
        'counselor_id',
        'date_of_birth',
        'grade_level',
        'guardian_name',
        'guardian_contact',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function documentRequests()
    {
        return $this->hasMany(DocumentRequest::class);
    }

    public function certificateRequests()
    {
        return $this->hasMany(CertificateRequest::class);
    }

    // Relationship for counselor requests where this user is the counselor
    public function counselorRequests()
    {
        return $this->hasMany(CounselorRequest::class, 'counselor_id', 'id');
    }

    // Relationship for students created by this counselor
    public function students()
    {
        return $this->hasMany(User::class, 'counselor_id', 'id')
            ->where('role', 'student');
    }

    // Relationship for the counselor who created this student
    public function counselor()
    {
        return $this->belongsTo(User::class, 'counselor_id', 'id');
    }

    // Relationship for messages where user is the student
    public function messagesAsStudent()
    {
        return $this->hasMany(Message::class, 'student_id', 'id');
    }

    // Relationship for messages where user is the counselor
    public function messagesAsCounselor()
    {
        return $this->hasMany(Message::class, 'counselor_id', 'id');
    }

    // Get all messages for a user (both sent and received)
    public function allMessages()
    {
        return Message::where('student_id', $this->id)
            ->orWhere('counselor_id', $this->id)
            ->orderBy('created_at', 'desc');
    }

    // Relationship for reviews written by this student
    public function reviewsWritten()
    {
        return $this->hasMany(CounselorReview::class, 'student_id', 'id');
    }

    // Relationship for reviews received by this counselor
    public function reviews()
    {
        return $this->hasMany(CounselorReview::class, 'counselor_id', 'id');
    }

    // Relationship for announcements created by this counselor
    public function announcements()
    {
        return $this->hasMany(Announcement::class, 'counselor_id', 'id');
    }

    // Relationship for comments made by this user
    public function announcementComments()
    {
        return $this->hasMany(AnnouncementComment::class);
    }

    // Relationship for reactions made by this user
    public function announcementReactions()
    {
        return $this->hasMany(AnnouncementReaction::class);
    }

    /**
     * Send the password reset notification.
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token)
    {
        $resetLink = route('password.reset', ['token' => $token, 'email' => $this->email]);
        \Mail::to($this->email)->send(new \App\Mail\ResetPassword($resetLink));
    }
}
