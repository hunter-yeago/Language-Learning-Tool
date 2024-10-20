<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Word extends Model
{
    use HasFactory;

    protected $fillable = ['word', 'word_bank_id'];

    // Each word belongs to one word bank
    public function wordBank()
    {
        return $this->belongsTo(WordBank::class);
    }
}
