<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Spatie\Permission\Traits\HasRoles;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasRoles;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
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

    public function buckets()
    {
        return $this->hasMany(Bucket::class);
    }

    public function essays()
    {
        return $this->hasMany(Essay::class);
    }

    public function tutors()
    {
        return $this->belongsToMany(User::class, 'student_tutor', 'student_id', 'tutor_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_tutor', 'tutor_id', 'student_id');
    }

    public function isStudent(): bool
    {
        return $this->hasRole('student');
    }

    public function isTutor(): bool
    {
        return $this->hasRole('tutor');
    }

}
