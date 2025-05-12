<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tutor extends Model
{
    
    public function students()
    {
        return $this->belongsToMany(User::class, 'student_tutor', 'tutor_id', 'student_id');
    }
}
