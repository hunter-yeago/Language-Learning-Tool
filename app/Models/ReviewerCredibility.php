<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReviewerCredibility extends Model
{
    protected $table = 'reviewer_credibility';

    protected $fillable = [
        'reviewer_id',
        'credibility_score',
        'total_reviews',
        'approved_reviews',
        'helpful_votes',
    ];

    protected $casts = [
        'credibility_score' => 'float',
    ];

    /**
     * Get the reviewer user
     */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    /**
     * Calculate approval rate
     */
    public function getApprovalRate(): float
    {
        if ($this->total_reviews === 0) {
            return 0.0;
        }

        return ($this->approved_reviews / $this->total_reviews) * 100;
    }

    /**
     * Get helpful vote rate
     */
    public function getHelpfulRate(): float
    {
        if ($this->total_reviews === 0) {
            return 0.0;
        }

        return ($this->helpful_votes / $this->total_reviews) * 100;
    }

    /**
     * Check if reviewer is highly credible
     */
    public function isHighlyCredible(): bool
    {
        return $this->credibility_score >= 0.80;
    }

    /**
     * Check if reviewer is trusted
     */
    public function isTrusted(): bool
    {
        return $this->credibility_score >= 0.60;
    }

    /**
     * Get credibility tier
     */
    public function getTier(): string
    {
        return match (true) {
            $this->credibility_score >= 0.90 => 'expert',
            $this->credibility_score >= 0.75 => 'highly_trusted',
            $this->credibility_score >= 0.60 => 'trusted',
            $this->credibility_score >= 0.40 => 'developing',
            default => 'new',
        };
    }

    /**
     * Increment review count
     */
    public function incrementReviews(): void
    {
        $this->increment('total_reviews');
    }

    /**
     * Increment approved reviews
     */
    public function incrementApproved(): void
    {
        $this->increment('approved_reviews');
    }

    /**
     * Increment helpful votes
     */
    public function incrementHelpful(): void
    {
        $this->increment('helpful_votes');
    }

    /**
     * Recalculate credibility score
     * Formula: (approved_reviews / total_reviews) * 0.7 + (helpful_votes / total_reviews) * 0.3
     */
    public function recalculateScore(): void
    {
        if ($this->total_reviews === 0) {
            $this->credibility_score = 0.50; // Default for new reviewers
            $this->save();
            return;
        }

        $approvalComponent = ($this->approved_reviews / $this->total_reviews) * 0.7;
        $helpfulComponent = ($this->helpful_votes / $this->total_reviews) * 0.3;

        $newScore = $approvalComponent + $helpfulComponent;

        // Clamp between 0.1 and 1.0
        $this->credibility_score = max(0.10, min(1.00, $newScore));
        $this->save();
    }
}
