<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    use HasFactory;

    protected $fillable = ['word'];

    public function essays()
    {
        return $this->belongsToMany(Essay::class, 'essay_word_join');
    }


    public function buckets()
    {
        return $this->belongsToMany(Bucket::class, 'bucket_word_join')
            ->withPivot(['grade']);
    }
}
