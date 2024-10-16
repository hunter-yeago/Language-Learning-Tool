<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Iteration extends Model
{
    use HasFactory;

    protected $fillable = ['essay_id', 'word_bank_id', 'notes'];

    // Each iteration belongs to one essay
    public function essay()
    {
        return $this->belongsTo(Essay::class);
    }

    // Each iteration has a word bank
    public function wordBank()
    {
        return $this->belongsTo(WordBank::class);
    }
}
