<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    use HasFactory;

    protected $fillable = ['word', 'word_bucket_id'];

    public function wordBucket()
    {
        return $this->belongsTo(WordBucket::class);
    }
}
