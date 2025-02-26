<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Essay extends Model
{
    use HasFactory;
    protected $table = "essays";
    // only these two can be mass assigned
    protected $fillable = ['title', 'content', 'user_id', 'bucket_id'];

      // Relationship with Word model via the essay_word_join pivot table
      public function words()
      {
          return $this->belongsToMany(Word::class, 'essay_word_join');
      }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Each essay belongs to one word bucket
    public function bucket()
    {
        return $this->belongsTo(Bucket::class);
    }
}
