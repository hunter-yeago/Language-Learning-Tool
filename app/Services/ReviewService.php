<?php

namespace App\Services;

use App\Models\Essay;
use App\Models\EssayReview;
use App\Models\EssayWordReview;
use App\Models\EssayWordJoin;
use App\Models\BucketWordJoin;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class ReviewService
{
    protected ConsensusService $consensusService;
    protected CredibilityService $credibilityService;

    public function __construct(
        ConsensusService $consensusService,
        CredibilityService $credibilityService
    ) {
        $this->consensusService = $consensusService;
        $this->credibilityService = $credibilityService;
    }

    /**
     * Create a new review session for an essay
     */
    public function createReview(
        Essay $essay,
        ?int $reviewerId,
        string $reviewerType,
        ?string $reviewerName = null
    ): EssayReview {
        return EssayReview::create([
            'essay_id' => $essay->id,
            'reviewer_id' => $reviewerId,
            'reviewer_name' => $reviewerName,
            'reviewer_type' => $reviewerType,
            'status' => 'pending',
            'submitted_at' => now(),
        ]);
    }

    /**
     * Submit a completed review with word grades
     */
    public function submitReview(
        EssayReview $review,
        array $wordGrades,
        string $feedback
    ): void {
        DB::transaction(function () use ($review, $wordGrades, $feedback) {
            // Save word grades
            foreach ($wordGrades as $wordGrade) {
                EssayWordReview::create([
                    'essay_review_id' => $review->id,
                    'word_id' => $wordGrade['word_id'],
                    'grade' => $wordGrade['grade'],
                    'comment' => $wordGrade['comment'] ?? null,
                ]);
            }

            // Update review as completed
            $review->update([
                'feedback' => $feedback,
                'status' => 'completed',
                'completed_at' => now(),
            ]);

            // Calculate consensus for the essay
            $this->consensusService->calculateConsensusForEssay($review->essay);

            // Update reviewer credibility count
            if ($review->reviewer_id) {
                $credibility = $this->credibilityService->getOrCreateCredibility($review->reviewer_id);
                $credibility->incrementReviews();
            }
        });
    }

    /**
     * Process student approval of review grades
     */
    public function processStudentApproval(
        Essay $essay,
        array $approvedGrades
    ): void {
        DB::transaction(function () use ($essay, $approvedGrades) {
            foreach ($approvedGrades as $wordId => $approvedGrade) {
                // Update essay_word_join with student's approved grade
                $essayWord = EssayWordJoin::where('essay_id', $essay->id)
                    ->where('word_id', $wordId)
                    ->first();

                if ($essayWord) {
                    $essayWord->update([
                        'student_approved_grade' => $approvedGrade['grade'],
                        'student_approved_at' => now(),
                    ]);

                    // Update bucket_word_join with the approved grade
                    BucketWordJoin::where('bucket_id', $essay->bucket_id)
                        ->where('word_id', $wordId)
                        ->update(['grade' => $approvedGrade['grade']]);
                }
            }

            // Mark essay as reviewed by student
            $essay->update([
                'requires_student_review' => false,
                'student_reviewed_at' => now(),
                'status' => 'graded',
            ]);

            // Update credibility for all reviewers based on student's choices
            $this->updateReviewerCredibilityFromApproval($essay, $approvedGrades);
        });
    }

    /**
     * Update reviewer credibility based on student's approval choices
     */
    protected function updateReviewerCredibilityFromApproval(
        Essay $essay,
        array $approvedGrades
    ): void {
        $reviews = $essay->completedReviews()->get();

        foreach ($reviews as $review) {
            if (!$review->reviewer_id) {
                continue; // Skip anonymous reviewers
            }

            $reviewerWordGrades = $review->wordGrades;
            $approvedCount = 0;
            $totalCount = $reviewerWordGrades->count();

            foreach ($reviewerWordGrades as $wordGrade) {
                $approvedGrade = $approvedGrades[$wordGrade->word_id] ?? null;

                if ($approvedGrade && $approvedGrade['grade'] === $wordGrade->grade) {
                    $approvedCount++;
                }
            }

            // Update credibility
            $this->credibilityService->updateFromStudentApproval(
                $review->reviewer_id,
                $totalCount,
                $approvedCount
            );
        }
    }

    /**
     * Get review summary for student to approve
     */
    public function getReviewSummary(Essay $essay): array
    {
        return $this->consensusService->getConsensusSummary($essay);
    }

    /**
     * Auto-approve grades if consensus is strong
     */
    public function autoApproveIfPossible(Essay $essay): bool
    {
        if (!$this->consensusService->canAutoApprove($essay)) {
            return false;
        }

        // Auto-approve all words with consensus grade
        $essayWords = EssayWordJoin::where('essay_id', $essay->id)->get();

        $approvedGrades = [];
        foreach ($essayWords as $essayWord) {
            if ($essayWord->consensus_grade) {
                $approvedGrades[$essayWord->word_id] = [
                    'grade' => $essayWord->consensus_grade,
                ];
            }
        }

        $this->processStudentApproval($essay, $approvedGrades);

        return true;
    }

    /**
     * Get all reviews for an essay with reviewer details
     */
    public function getEssayReviews(Essay $essay)
    {
        return $essay->reviews()
            ->with(['reviewer', 'wordGrades.word'])
            ->get()
            ->map(function ($review) {
                return [
                    'id' => $review->id,
                    'reviewer_name' => $review->getReviewerDisplayName(),
                    'reviewer_type' => $review->reviewer_type,
                    'status' => $review->status,
                    'feedback' => $review->feedback,
                    'completed_at' => $review->completed_at,
                    'word_grades' => $review->wordGrades->map(function ($wordGrade) {
                        return [
                            'word_id' => $wordGrade->word_id,
                            'word_text' => $wordGrade->word->word,
                            'grade' => $wordGrade->grade,
                            'comment' => $wordGrade->comment,
                        ];
                    }),
                ];
            });
    }
}
