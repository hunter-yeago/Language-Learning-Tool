<?php

namespace App\Services;

use App\Models\Essay;
use App\Models\EssayWordJoin;
use App\Models\EssayReview;
use App\Models\ReviewerCredibility;
use Illuminate\Support\Collection;

class ConsensusService
{
    /**
     * Calculate consensus for all words in an essay based on completed reviews
     */
    public function calculateConsensusForEssay(Essay $essay): void
    {
        $reviews = $essay->completedReviews()->with('wordGrades')->get();

        if ($reviews->isEmpty()) {
            return;
        }

        // Get all words in the essay
        $essayWords = $essay->words;

        foreach ($essayWords as $word) {
            $this->calculateConsensusForWord($essay->id, $word->id, $reviews);
        }

        // Mark essay as requiring student review if there are multiple reviews
        if ($reviews->count() > 1) {
            $essay->update(['requires_student_review' => true]);
        }
    }

    /**
     * Calculate consensus for a specific word based on multiple reviews
     */
    protected function calculateConsensusForWord(int $essayId, int $wordId, Collection $reviews): array
    {
        $votes = [];
        $totalWeight = 0;

        foreach ($reviews as $review) {
            // Get this reviewer's grade for this word
            $wordGrade = $review->wordGrades()->where('word_id', $wordId)->first();

            if (!$wordGrade) {
                continue;
            }

            // Get reviewer's credibility score
            $credibility = $this->getReviewerCredibility($review);

            // Add weighted vote
            if (!isset($votes[$wordGrade->grade])) {
                $votes[$wordGrade->grade] = 0;
            }

            $votes[$wordGrade->grade] += $credibility;
            $totalWeight += $credibility;
        }

        // No votes means no consensus
        if ($totalWeight === 0) {
            return [
                'grade' => null,
                'confidence' => 0,
                'review_count' => 0,
            ];
        }

        // Find winning grade and confidence
        arsort($votes);
        $winningGrade = array_key_first($votes);
        $winningVotes = $votes[$winningGrade];
        $confidence = (int) (($winningVotes / $totalWeight) * 100);

        // Update essay_word_join with consensus
        EssayWordJoin::where('essay_id', $essayId)
            ->where('word_id', $wordId)
            ->update([
                'consensus_grade' => $winningGrade,
                'consensus_confidence' => $confidence,
                'review_count' => $reviews->count(),
            ]);

        return [
            'grade' => $winningGrade,
            'confidence' => $confidence,
            'review_count' => $reviews->count(),
        ];
    }

    /**
     * Get credibility score for a reviewer
     */
    protected function getReviewerCredibility(EssayReview $review): float
    {
        // If no reviewer (anonymous), use base credibility
        if (!$review->reviewer_id) {
            return 0.30; // Low credibility for anonymous
        }

        // Check if reviewer has credibility record
        $credibility = ReviewerCredibility::where('reviewer_id', $review->reviewer_id)->first();

        if (!$credibility) {
            // Default credibility based on reviewer type
            return match ($review->reviewer_type) {
                'tutor' => 0.90, // Tutors start high
                'public' => 0.50, // Public reviewers start medium
                'ai' => 0.70, // AI starts medium-high
                default => 0.50,
            };
        }

        return $credibility->credibility_score;
    }

    /**
     * Get consensus summary for an essay
     */
    public function getConsensusSummary(Essay $essay): array
    {
        $reviews = $essay->completedReviews()->with(['wordGrades', 'reviewer'])->get();

        $essayWords = EssayWordJoin::where('essay_id', $essay->id)
            ->with('word')
            ->get();

        $wordSummaries = [];

        foreach ($essayWords as $essayWord) {
            // Get all reviewer grades for this word
            $reviewerGrades = [];

            foreach ($reviews as $review) {
                $wordGrade = $review->wordGrades()->where('word_id', $essayWord->word_id)->first();

                if ($wordGrade) {
                    $reviewerGrades[] = [
                        'reviewer_name' => $review->getReviewerDisplayName(),
                        'reviewer_type' => $review->reviewer_type,
                        'grade' => $wordGrade->grade,
                        'comment' => $wordGrade->comment,
                        'credibility' => $this->getReviewerCredibility($review),
                    ];
                }
            }

            $wordSummaries[] = [
                'word_id' => $essayWord->word_id,
                'word_text' => $essayWord->word->word,
                'consensus_grade' => $essayWord->consensus_grade,
                'consensus_confidence' => $essayWord->consensus_confidence,
                'review_count' => $essayWord->review_count,
                'reviewer_grades' => $reviewerGrades,
                'student_approved_grade' => $essayWord->student_approved_grade,
            ];
        }

        return [
            'essay_id' => $essay->id,
            'total_reviews' => $reviews->count(),
            'requires_student_review' => $essay->requires_student_review,
            'words' => $wordSummaries,
        ];
    }

    /**
     * Detect high conflict words (low consensus confidence)
     */
    public function getConflictWords(Essay $essay, int $threshold = 60): Collection
    {
        return EssayWordJoin::where('essay_id', $essay->id)
            ->where('consensus_confidence', '<', $threshold)
            ->where('review_count', '>', 1)
            ->with('word')
            ->get();
    }

    /**
     * Check if consensus is strong enough to auto-approve
     */
    public function canAutoApprove(Essay $essay, int $threshold = 80): bool
    {
        $lowConfidenceCount = EssayWordJoin::where('essay_id', $essay->id)
            ->where('consensus_confidence', '<', $threshold)
            ->where('review_count', '>', 0)
            ->count();

        // If all words have high confidence, can auto-approve
        return $lowConfidenceCount === 0;
    }
}
