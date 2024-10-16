<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WordBank extends Model
{
    use HasFactory;

    protected $fillable = ['name'];

    // A word bank has many words
    public function words()
    {
        return $this->hasMany(Word::class);
    }
}
