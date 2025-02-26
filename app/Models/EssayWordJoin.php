<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EssayWordJoin extends Model

{
    protected $table = 'essay_word_join';
    protected $fillable = [ 'essay_id', 'word_id', 'status', 'used'];

    public function essay()
    {
        return $this->belongsTo(Essay::class);
    }

    public function word()
    {
        return $this->belongsTo(Word::class);
    }
}
