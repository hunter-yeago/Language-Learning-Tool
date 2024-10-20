<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WordBucket extends Model
{
    /** @use HasFactory<\Database\Factories\WordBucketFactory> */
    use HasFactory;
    
        protected $fillable = ['title'];
        protected $casts = ['words' => 'array'];

        // A word bank has many words
        // public function words()
        // {
        //     return $this->hasMany(Word::class);
        // }
    
        // belongs to an iteration
        // public function essay()
        // {
        //     return $this->hasMany(Essay::class);
        // }
}
