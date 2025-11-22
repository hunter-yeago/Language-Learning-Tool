<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class EssayReview extends Model
{
    protected $fillable = [
        'essay_id',
        'reviewer_id',
        'reviewer_name',
        'reviewer_type',
        'status',
        'feedback',
        'submitted_at',
        'completed_at',
    ];

    protected $casts = [
        'submitted_at' => 'datetime',
        'completed_at' => 'datetime',
    ];

    /**
     * Get the essay this review belongs to
     */
    public function essay(): BelongsTo
    {
        return $this->belongsTo(Essay::class);
    }

    /**
     * Get the reviewer (if authenticated)
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Get all word grades for this review
     */
    public function wordGrades(): HasMany
    {
        return $this->hasMany(EssayWordReview::class);
    }

    /**
     * Check if review is completed
     */
    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    /**
     * Check if review is pending
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Mark review as in progress
     */
    public function markInProgress(): void
    {
        $this->update(['status' => 'in_progress']);
    }

    /**
     * Mark review as completed
     */
    public function markCompleted(): void
    {
        $this->update([
            'status' => 'completed',
            'completed_at' => now(),
        ]);
    }

    /**
     * Check if reviewer is a tutor
     */
    public function isTutorReview(): bool
    {
        return $this->reviewer_type === 'tutor';
    }

    /**
     * Check if reviewer is public
     */
    public function isPublicReview(): bool
    {
        return $this->reviewer_type === 'public';
    }

    /**
     * Check if review is anonymous
     */
    public function isAnonymous(): bool
    {
        return $this->reviewer_id === null;
    }

    /**
     * Get display name for reviewer
     */
    public function getReviewerDisplayName(): string
    {
        if ($this->reviewer_id) {
            return $this->reviewer->name;
        }

        return $this->reviewer_name ?? 'Anonymous Reviewer';
    }
}
