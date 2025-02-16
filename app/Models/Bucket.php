<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class bucket extends Model
{
    /** @use HasFactory<\Database\Factories\bucketFactory> */
    use HasFactory;

    protected $fillable = ['title', 'description', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // A word bank has many words
    public function words()
    {
        return $this->hasMany(Word::class);
    }
}
