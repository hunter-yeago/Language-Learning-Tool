<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    use HasFactory;

    // Allow mass-assignment for these fields
    protected $fillable = ['word', 'word_bucket_id'];

    /** 
     * A Word belongs to a Word Bucket.
     */
    public function wordBucket()
    {
        return $this->belongsTo(WordBucket::class);
    }
}
