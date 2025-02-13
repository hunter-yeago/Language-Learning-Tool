<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Essay extends Model
{
    use HasFactory;
    protected $table = "essays";
    // only these two can be mass assigned
    protected $fillable = ['title', 'content', 'user_id', 'word_bucket_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Each essay belongs to one word bucket
    public function wordBucket()
    {
        return $this->belongsTo(WordBucket::class);
    }
}
