<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EssayWordReview extends Model
{
    protected $fillable = [
        'essay_review_id',
        'word_id',
        'grade',
        'comment',
    ];

    /**
     * Get the review this word grade belongs to
     */
    public function essayReview(): BelongsTo
    {
        return $this->belongsTo(EssayReview::class);
    }

    /**
     * Get the word being graded
     */
    public function word(): BelongsTo
    {
        return $this->belongsTo(Word::class);
    }

    /**
     * Check if word was graded as correct
     */
    public function isCorrect(): bool
    {
        return $this->grade === 'correct';
    }

    /**
     * Check if word was graded as partially correct
     */
    public function isPartiallyCorrect(): bool
    {
        return $this->grade === 'partially_correct';
    }

    /**
     * Check if word was graded as incorrect
     */
    public function isIncorrect(): bool
    {
        return $this->grade === 'incorrect';
    }

    /**
     * Check if word was not used
     */
    public function isNotUsed(): bool
    {
        return $this->grade === 'not_used';
    }

    /**
     * Get numeric score for grade (for calculations)
     */
    public function getNumericScore(): float
    {
        return match ($this->grade) {
            'correct' => 1.0,
            'partially_correct' => 0.5,
            'incorrect' => 0.0,
            'not_used' => 0.0,
            default => 0.0,
        };
    }
}
