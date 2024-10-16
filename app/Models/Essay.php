<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Essay extends Model
{
    use HasFactory;
    protected $table = "essays";
    // only these two can be mass assigned
    protected $fillable = ['title', 'content'];

    // Each essay belongs to one word bucket
    public function wordBucket()
    {
        return $this->belongsTo(WordBucket::class);
    }

     // An essay has many iterations
     public function iterations()
     {
         return $this->hasMany(Iteration::class);
     }
}
