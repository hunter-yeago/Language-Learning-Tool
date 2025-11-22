<?php

namespace App\Services;

use App\Models\User;
use App\Models\ReviewerCredibility;
use App\Models\EssayReview;
use App\Models\EssayWordJoin;

class CredibilityService
{
    /**
     * Get or create credibility record for a reviewer
     */
    public function getOrCreateCredibility(int $reviewerId): ReviewerCredibility
    {
        return ReviewerCredibility::firstOrCreate(
            ['reviewer_id' => $reviewerId],
            [
                'credibility_score' => $this->getInitialCredibilityScore($reviewerId),
                'total_reviews' => 0,
                'approved_reviews' => 0,
                'helpful_votes' => 0,
            ]
        );
    }

    /**
     * Determine initial credibility score based on user role
     */
    protected function getInitialCredibilityScore(int $reviewerId): float
    {
        $user = User::find($reviewerId);

        if (!$user) {
            return 0.50;
        }

        // Tutors start with high credibility
        if ($user->hasRole('tutor')) {
            return 0.90;
        }

        // Regular users start with medium credibility
        return 0.50;
    }

    /**
     * Update credibility when student approves/rejects review grades
     */
    public function updateFromStudentApproval(
        int $reviewerId,
        int $totalWords,
        int $approvedWords
    ): void {
        $credibility = $this->getOrCreateCredibility($reviewerId);

        // Increment total reviews
        $credibility->incrementReviews();

        // Calculate approval percentage for this review
        $approvalRate = $totalWords > 0 ? ($approvedWords / $totalWords) : 0;

        // If majority of words were approved, count as approved review
        if ($approvalRate >= 0.50) {
            $credibility->incrementApproved();
        }

        // Recalculate credibility score
        $credibility->recalculateScore();
    }

    /**
     * Mark a review as helpful (student feedback)
     */
    public function markReviewHelpful(int $reviewerId): void
    {
        $credibility = $this->getOrCreateCredibility($reviewerId);
        $credibility->incrementHelpful();
        $credibility->recalculateScore();
    }

    /**
     * Process student approval for entire essay review
     */
    public function processStudentApproval(
        EssayReview $review,
        array $approvedWordIds
    ): void {
        if (!$review->reviewer_id) {
            // Don't update credibility for anonymous reviewers
            return;
        }

        $totalWords = $review->wordGrades()->count();
        $approvedWords = count($approvedWordIds);

        $this->updateFromStudentApproval(
            $review->reviewer_id,
            $totalWords,
            $approvedWords
        );
    }

    /**
     * Get credibility stats for a reviewer
     */
    public function getStats(int $reviewerId): array
    {
        $credibility = ReviewerCredibility::where('reviewer_id', $reviewerId)->first();

        if (!$credibility) {
            return [
                'credibility_score' => $this->getInitialCredibilityScore($reviewerId),
                'total_reviews' => 0,
                'approved_reviews' => 0,
                'approval_rate' => 0.0,
                'helpful_votes' => 0,
                'helpful_rate' => 0.0,
                'tier' => 'new',
            ];
        }

        return [
            'credibility_score' => $credibility->credibility_score,
            'total_reviews' => $credibility->total_reviews,
            'approved_reviews' => $credibility->approved_reviews,
            'approval_rate' => $credibility->getApprovalRate(),
            'helpful_votes' => $credibility->helpful_votes,
            'helpful_rate' => $credibility->getHelpfulRate(),
            'tier' => $credibility->getTier(),
        ];
    }

    /**
     * Get top reviewers by credibility
     */
    public function getTopReviewers(int $limit = 10)
    {
        return ReviewerCredibility::with('reviewer')
            ->where('total_reviews', '>=', 5) // At least 5 reviews
            ->orderBy('credibility_score', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Calculate weighted credibility for consensus algorithm
     */
    public function getWeightedCredibility(int $reviewerId, string $reviewerType): float
    {
        $credibility = ReviewerCredibility::where('reviewer_id', $reviewerId)->first();

        if (!$credibility) {
            // Return default based on type
            return match ($reviewerType) {
                'tutor' => 0.90,
                'public' => 0.50,
                'ai' => 0.70,
                default => 0.50,
            };
        }

        return $credibility->credibility_score;
    }
}
