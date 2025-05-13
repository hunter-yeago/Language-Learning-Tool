<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Bucket extends Model
{
    /** @use HasFactory<\Database\Factories\BucketFactory> */
    use HasFactory;

    protected $fillable = ['title', 'description', 'user_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function words()
    {
        return $this->belongsToMany(Word::class, 'bucket_word_join')
            ->withPivot(['grade', 'comment']);
    }


}
