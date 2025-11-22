<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use App\Models\EssayReview;
use App\Services\ReviewService;
use App\Services\CredibilityService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ReviewController extends Controller
{
    protected ReviewService $reviewService;
    protected CredibilityService $credibilityService;

    public function __construct(
        ReviewService $reviewService,
        CredibilityService $credibilityService
    ) {
        $this->reviewService = $reviewService;
        $this->credibilityService = $credibilityService;
    }

    /**
     * Submit a public/anonymous review for an essay
     */
    public function submitPublicReview(Request $request, $token)
    {
        $validated = $request->validate([
            'reviewer_name' => 'nullable|string|max:255',
            'feedback' => 'required|string',
            'word_grades' => 'required|array',
            'word_grades.*.word_id' => 'required|integer|exists:words,id',
            'word_grades.*.grade' => 'required|in:correct,partially_correct,incorrect,not_used',
            'word_grades.*.comment' => 'nullable|string',
        ]);

        $visibility = \App\Models\EssayVisibility::where('public_url_token', $token)->first();

        if (!$visibility || !$visibility->isAccessible()) {
            return response()->json(['error' => 'Essay not found or no longer available'], 404);
        }

        if (!$visibility->allow_anonymous && !Auth::check()) {
            return response()->json(['error' => 'Anonymous reviews are not allowed for this essay'], 403);
        }

        $essay = $visibility->essay;

        // Create review session
        $review = $this->reviewService->createReview(
            $essay,
            Auth::id(), // null if anonymous
            Auth::check() ? 'public' : 'public',
            $validated['reviewer_name'] ?? null
        );

        // Submit the review
        $this->reviewService->submitReview(
            $review,
            $validated['word_grades'],
            $validated['feedback']
        );

        return response()->json([
            'message' => 'Review submitted successfully!',
            'review_id' => $review->id,
        ]);
    }

    /**
     * Get review summary for student approval
     */
    public function getReviewSummary($essayId)
    {
        $essay = Essay::findOrFail($essayId);

        // Verify user owns this essay
        if ($essay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $summary = $this->reviewService->getReviewSummary($essay);
        $reviews = $this->reviewService->getEssayReviews($essay);

        return response()->json([
            'summary' => $summary,
            'reviews' => $reviews,
            'requires_review' => $essay->requires_student_review,
        ]);
    }

    /**
     * Student approves review grades
     */
    public function approveGrades(Request $request, $essayId)
    {
        $validated = $request->validate([
            'approved_grades' => 'required|array',
            'approved_grades.*.word_id' => 'required|integer',
            'approved_grades.*.grade' => 'required|string',
        ]);

        $essay = Essay::findOrFail($essayId);

        // Verify user owns this essay
        if ($essay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        // Transform to format expected by ReviewService
        $approvedGrades = [];
        foreach ($validated['approved_grades'] as $grade) {
            $approvedGrades[$grade['word_id']] = [
                'grade' => $grade['grade'],
            ];
        }

        $this->reviewService->processStudentApproval($essay, $approvedGrades);

        return response()->json([
            'message' => 'Grades approved successfully!',
        ]);
    }

    /**
     * Mark a review as helpful
     */
    public function markHelpful($reviewId)
    {
        $review = EssayReview::findOrFail($reviewId);

        // Verify user owns the essay being reviewed
        if ($review->essay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        if (!$review->reviewer_id) {
            return response()->json(['error' => 'Cannot mark anonymous reviews as helpful'], 400);
        }

        $this->credibilityService->markReviewHelpful($review->reviewer_id);

        return response()->json([
            'message' => 'Review marked as helpful!',
        ]);
    }

    /**
     * Get all reviews for an essay (for student viewing)
     */
    public function getEssayReviews($essayId)
    {
        $essay = Essay::findOrFail($essayId);

        // Verify user owns this essay
        if ($essay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $reviews = $this->reviewService->getEssayReviews($essay);

        return response()->json([
            'reviews' => $reviews,
        ]);
    }

    /**
     * Show student review approval page
     */
    public function showApprovalPage($essayId)
    {
        $essay = Essay::with(['words', 'reviews.reviewer'])->findOrFail($essayId);

        // Verify user owns this essay
        if ($essay->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $summary = $this->reviewService->getReviewSummary($essay);
        $reviews = $this->reviewService->getEssayReviews($essay);

        return Inertia::render('ReviewApprovalPage', [
            'essay' => $essay,
            'summary' => $summary,
            'reviews' => $reviews,
        ]);
    }

    /**
     * Get reviewer credibility stats
     */
    public function getReviewerStats($reviewerId)
    {
        $stats = $this->credibilityService->getStats($reviewerId);

        return response()->json($stats);
    }

    /**
     * Get top reviewers leaderboard
     */
    public function getLeaderboard()
    {
        $topReviewers = $this->credibilityService->getTopReviewers(20);

        return response()->json([
            'reviewers' => $topReviewers,
        ]);
    }
}
