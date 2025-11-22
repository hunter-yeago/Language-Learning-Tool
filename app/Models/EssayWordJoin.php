<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EssayWordJoin extends Model
{
    protected $table = 'essay_word_join';

    protected $fillable = [
        'essay_id',
        'word_id',
        'grade',
        'comment',
        'used_in_essay',
        'consensus_grade',
        'consensus_confidence',
        'student_approved_grade',
        'review_count',
        'student_approved_at',
    ];

    protected $casts = [
        'used_in_essay' => 'boolean',
        'consensus_confidence' => 'integer',
        'review_count' => 'integer',
        'student_approved_at' => 'datetime',
    ];

    public function essay()
    {
        return $this->belongsTo(Essay::class);
    }

    public function word()
    {
        return $this->belongsTo(Word::class);
    }
}
