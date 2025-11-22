# Multi-Reviewer System - Testing Guide

This guide walks you through testing the multi-reviewer essay system manually and programmatically.

---

## Quick Start: Testing via Tinker

The fastest way to test is using Laravel Tinker (PHP REPL). All examples below use Tinker.

### Prerequisites

You need at least:
- 1 student user
- 1 tutor user
- 1 bucket with some words
- 1 essay (we'll create this in the tests)

---

## Test Suite 1: Single-Tutor Workflow (Backward Compatibility)

This tests that the existing workflow still works perfectly.

### Step 1: Create a Test Essay

```bash
php artisan tinker
```

```php
// Get a student and tutor
$student = User::role('student')->first();
$tutor = User::role('tutor')->first();

// Get a bucket with words
$bucket = Bucket::where('user_id', $student->id)->with('words')->first();

// If no bucket exists, create one
if (!$bucket) {
    $bucket = Bucket::create([
        'user_id' => $student->id,
        'name' => 'Test Bucket',
        'language' => 'Spanish',
    ]);

    // Add some test words
    $word1 = Word::firstOrCreate(['word' => 'casa']);
    $word2 = Word::firstOrCreate(['word' => 'perro']);

    $bucket->words()->attach($word1->id, ['grade' => null]);
    $bucket->words()->attach($word2->id, ['grade' => null]);

    $bucket->load('words');
}

// Create essay data
$essayData = [
    'title' => 'Test Essay - Single Tutor',
    'content' => 'Mi casa es grande. Mi perro es pequeño.',
    'bucket_id' => $bucket->id,
    'tutor_id' => $tutor->id,
    'status' => 'submitted',
    'words' => $bucket->words->map(fn($w) => [
        'id' => $w->id,
        'used' => true
    ])->toArray(),
];

// Create the essay using EssayService
$essayService = app('App\Services\EssayService');
$essay = $essayService->storeEssay($essayData, $student);

echo "✓ Essay created: {$essay->id}\n";
echo "✓ Status: {$essay->status}\n";
```

### Step 2: Verify Review Session Created

```php
// Check if review session was created automatically
$review = $essay->reviews()->first();

if ($review) {
    echo "✓ Review session created automatically\n";
    echo "  - Reviewer: {$review->reviewer->name}\n";
    echo "  - Type: {$review->reviewer_type}\n";
    echo "  - Status: {$review->status}\n";
} else {
    echo "✗ No review session found!\n";
}
```

### Step 3: Simulate Tutor Grading

```php
// Prepare word grades (tutor grades the words)
$wordGrades = [
    [
        'word_id' => $bucket->words[0]->id,
        'grade' => 'correct',
        'comment' => 'Good use of casa!',
    ],
    [
        'word_id' => $bucket->words[1]->id,
        'grade' => 'partially_correct',
        'comment' => 'Try using "pequeño" with more context',
    ],
];

$feedback = "Great essay! Keep practicing your descriptive words.";

// Submit the review
$reviewService = app('App\Services\ReviewService');
$reviewService->submitReview($review, $wordGrades, $feedback);

echo "✓ Review submitted\n";
```

### Step 4: Verify Consensus Calculation

```php
// Reload essay
$essay->refresh();

echo "\n=== Consensus Results ===\n";
foreach ($essay->words as $word) {
    $pivot = DB::table('essay_word_join')
        ->where('essay_id', $essay->id)
        ->where('word_id', $word->id)
        ->first();

    echo "\nWord: {$word->word}\n";
    echo "  Consensus Grade: {$pivot->consensus_grade}\n";
    echo "  Confidence: {$pivot->consensus_confidence}%\n";
    echo "  Review Count: {$pivot->review_count}\n";
}
```

### Step 5: Verify Auto-Approval

```php
// Check if auto-approved (should be 100% confidence with 1 review)
$essay->refresh();

echo "\n=== Auto-Approval Check ===\n";
echo "Essay Status: {$essay->status}\n";
echo "Requires Student Review: " . ($essay->requires_student_review ? 'Yes' : 'No') . "\n";
echo "Student Reviewed At: " . ($essay->student_reviewed_at ?? 'Not yet') . "\n";

// Check if bucket grades were updated
foreach ($bucket->words as $word) {
    $bucketGrade = DB::table('bucket_word_join')
        ->where('bucket_id', $bucket->id)
        ->where('word_id', $word->id)
        ->value('grade');

    echo "\n{$word->word} - Bucket Grade: {$bucketGrade}\n";
}
```

**Expected Results:**
- ✓ Review session created automatically
- ✓ Consensus calculated (100% confidence, 1 review)
- ✓ Essay auto-approved (status = 'graded')
- ✓ Bucket grades updated with tutor's grades
- ✓ `requires_student_review` = false

---

## Test Suite 2: Public Essay & Anonymous Review

### Step 1: Make Essay Public

```php
// Get an essay or use the one from Test Suite 1
$essay = Essay::with('visibility')->first();

// Make it public
$visibility = $essay->visibility;
$visibility->makePublic();
$visibility->setExpiration(30); // Expires in 30 days

echo "✓ Essay is now public\n";
echo "✓ Token: {$visibility->public_url_token}\n";
echo "✓ URL: {$visibility->getPublicUrl()}\n";
echo "✓ Expires: {$visibility->expires_at}\n";
```

### Step 2: Simulate Anonymous Review Submission

```php
// Create an anonymous review (no reviewer_id)
$anonymousReview = $reviewService->createReview(
    $essay,
    null, // No reviewer ID (anonymous)
    'public',
    'Native Speaker from Reddit' // Optional name
);

// Submit anonymous grades
$anonymousGrades = [
    [
        'word_id' => $essay->words[0]->id,
        'grade' => 'correct',
        'comment' => 'Perfect!',
    ],
    [
        'word_id' => $essay->words[1]->id,
        'grade' => 'incorrect',
        'comment' => 'Should be "grande" not this',
    ],
];

$reviewService->submitReview(
    $anonymousReview,
    $anonymousGrades,
    "Good attempt! Keep studying."
);

echo "✓ Anonymous review submitted\n";
```

### Step 3: Check Consensus Recalculation

```php
// Now we have 2 reviews: tutor + anonymous
$essay->refresh();

echo "\n=== Updated Consensus (2 Reviews) ===\n";
echo "Total Reviews: " . $essay->completedReviews()->count() . "\n";
echo "Requires Student Review: " . ($essay->requires_student_review ? 'Yes' : 'No') . "\n\n";

foreach ($essay->words as $word) {
    $pivot = DB::table('essay_word_join')
        ->where('essay_id', $essay->id)
        ->where('word_id', $word->id)
        ->first();

    echo "Word: {$word->word}\n";
    echo "  Consensus: {$pivot->consensus_grade} ({$pivot->consensus_confidence}%)\n";
    echo "  Reviews: {$pivot->review_count}\n";

    // Show all reviewer grades
    $reviews = DB::table('essay_word_reviews')
        ->join('essay_reviews', 'essay_word_reviews.essay_review_id', '=', 'essay_reviews.id')
        ->where('essay_reviews.essay_id', $essay->id)
        ->where('essay_word_reviews.word_id', $word->id)
        ->select('essay_reviews.reviewer_type', 'essay_word_reviews.grade', 'essay_word_reviews.comment')
        ->get();

    echo "  Individual Grades:\n";
    foreach ($reviews as $r) {
        echo "    - {$r->reviewer_type}: {$r->grade}\n";
    }
    echo "\n";
}
```

**Expected Results:**
- ✓ Consensus recalculated with weighted votes
- ✓ Tutor vote (0.9 weight) vs Anonymous vote (0.3 weight)
- ✓ `requires_student_review` likely set to true (lower confidence)

---

## Test Suite 3: Student Approval Workflow

### Step 1: Get Review Summary

```php
// This is what the frontend would call
$summary = $reviewService->getReviewSummary($essay);

echo "=== Review Summary ===\n";
echo "Total Reviews: " . count($summary['reviews']) . "\n";
echo "Requires Approval: " . ($summary['requires_review'] ? 'Yes' : 'No') . "\n\n";

echo "Word Summaries:\n";
foreach ($summary['words'] as $wordSummary) {
    echo "\n{$wordSummary['word_text']}:\n";
    echo "  Consensus: {$wordSummary['consensus_grade']} ({$wordSummary['consensus_confidence']}%)\n";
    echo "  All Grades:\n";
    foreach ($wordSummary['all_grades'] as $grade) {
        echo "    - {$grade['reviewer_name']} ({$grade['reviewer_type']}): {$grade['grade']}\n";
    }
}
```

### Step 2: Student Approves Grades

```php
// Student chooses which grades to accept
$approvedGrades = [];

foreach ($essay->words as $word) {
    $wordId = $word->id;

    // Get consensus for this word
    $consensus = DB::table('essay_word_join')
        ->where('essay_id', $essay->id)
        ->where('word_id', $wordId)
        ->first();

    // Student can choose consensus or override
    // For this test, we'll accept consensus
    $approvedGrades[$wordId] = [
        'grade' => $consensus->consensus_grade,
    ];
}

// Process student approval
$reviewService->processStudentApproval($essay, $approvedGrades);

echo "✓ Student approval processed\n";
```

### Step 3: Verify Final State

```php
$essay->refresh();

echo "\n=== Final Essay State ===\n";
echo "Status: {$essay->status}\n";
echo "Requires Student Review: " . ($essay->requires_student_review ? 'Yes' : 'No') . "\n";
echo "Student Reviewed At: {$essay->student_reviewed_at}\n\n";

echo "Approved Grades:\n";
foreach ($essay->words as $word) {
    $pivot = DB::table('essay_word_join')
        ->where('essay_id', $essay->id)
        ->where('word_id', $word->id)
        ->first();

    $bucketGrade = DB::table('bucket_word_join')
        ->where('bucket_id', $essay->bucket_id)
        ->where('word_id', $word->id)
        ->value('grade');

    echo "{$word->word}:\n";
    echo "  Student Approved: {$pivot->student_approved_grade}\n";
    echo "  Bucket Grade: {$bucketGrade}\n";
}
```

**Expected Results:**
- ✓ Essay status = 'graded'
- ✓ `requires_student_review` = false
- ✓ `student_reviewed_at` timestamp set
- ✓ Bucket grades updated with approved choices

---

## Test Suite 4: Credibility System

### Step 1: Check Initial Credibility

```php
$credibilityService = app('App\Services\CredibilityService');

// Get tutor's credibility
$tutorStats = $credibilityService->getStats($tutor->id);

echo "=== Tutor Credibility ===\n";
echo "Score: {$tutorStats['credibility_score']}\n";
echo "Total Reviews: {$tutorStats['total_reviews']}\n";
echo "Approved Reviews: {$tutorStats['approved_reviews']}\n";
echo "Approval Rate: {$tutorStats['approval_rate']}%\n";
echo "Tier: {$tutorStats['tier']}\n";
```

### Step 2: Submit Multiple Reviews & Test Credibility Updates

```php
// The credibility was already updated when student approved grades
// Let's check how it changed

// Create another essay and see credibility evolution
$essay2Data = [
    'title' => 'Second Test Essay',
    'content' => 'Test content',
    'bucket_id' => $bucket->id,
    'tutor_id' => $tutor->id,
    'status' => 'submitted',
    'words' => $bucket->words->take(2)->map(fn($w) => [
        'id' => $w->id,
        'used' => true
    ])->toArray(),
];

$essay2 = $essayService->storeEssay($essay2Data, $student);
$review2 = $essay2->reviews()->first();

// Tutor grades it
$wordGrades2 = [
    ['word_id' => $bucket->words[0]->id, 'grade' => 'correct', 'comment' => 'Good'],
    ['word_id' => $bucket->words[1]->id, 'grade' => 'correct', 'comment' => 'Great'],
];

$reviewService->submitReview($review2, $wordGrades2, "Excellent work!");

// Auto-approve (100% confidence)
$reviewService->autoApproveIfPossible($essay2);

// Check updated credibility
$tutorStats = $credibilityService->getStats($tutor->id);

echo "\n=== Updated Tutor Credibility ===\n";
echo "Score: {$tutorStats['credibility_score']}\n";
echo "Total Reviews: {$tutorStats['total_reviews']}\n";
echo "Approved Reviews: {$tutorStats['approved_reviews']}\n";
echo "Approval Rate: {$tutorStats['approval_rate']}%\n";
echo "Tier: {$tutorStats['tier']}\n";
```

### Step 3: Test Leaderboard

```php
$topReviewers = $credibilityService->getTopReviewers(10);

echo "\n=== Top Reviewers Leaderboard ===\n";
foreach ($topReviewers as $reviewer) {
    echo "{$reviewer->reviewer->name}: {$reviewer->credibility_score} ({$reviewer->getTier()})\n";
    echo "  Reviews: {$reviewer->total_reviews}, Approved: {$reviewer->approved_reviews}\n";
}
```

---

## Test Suite 5: API Endpoint Testing

You can test API endpoints using curl or a tool like Postman.

### Test 1: Update Essay Visibility

```bash
# Get auth token first (you'll need to log in via the app)
# Then test the visibility endpoint

curl -X POST http://localhost:8000/essays/1/visibility \
  -H "Content-Type: application/json" \
  -H "Cookie: laravel_session=YOUR_SESSION_COOKIE" \
  -d '{
    "visibility_type": "public",
    "allow_anonymous": true,
    "expires_in_days": 30
  }'
```

### Test 2: Get Review Summary

```bash
curl -X GET http://localhost:8000/essays/1/review-summary \
  -H "Cookie: laravel_session=YOUR_SESSION_COOKIE"
```

### Test 3: Public Essay View

```bash
# No auth required
curl -X GET http://localhost:8000/public/essay/TOKEN_HERE
```

### Test 4: Submit Public Review

```bash
curl -X POST http://localhost:8000/public/essay/TOKEN_HERE/review \
  -H "Content-Type: application/json" \
  -d '{
    "reviewer_name": "Anonymous Helper",
    "feedback": "Great job!",
    "word_grades": [
      {"word_id": 1, "grade": "correct", "comment": "Perfect!"},
      {"word_id": 2, "grade": "partially_correct", "comment": "Close"}
    ]
  }'
```

### Test 5: Get Leaderboard

```bash
# No auth required
curl -X GET http://localhost:8000/reviewers/leaderboard
```

---

## Automated Testing Script

Save this as `test-multi-reviewer.php` and run with `php test-multi-reviewer.php`:

```php
<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use App\Models\Essay;
use App\Models\Bucket;
use App\Models\Word;
use App\Services\EssayService;
use App\Services\ReviewService;
use App\Services\CredibilityService;

echo "=== Multi-Reviewer System Test Suite ===\n\n";

// Setup
$student = User::role('student')->first();
$tutor = User::role('tutor')->first();
$bucket = Bucket::where('user_id', $student->id)->with('words')->first();

if (!$student || !$tutor || !$bucket) {
    echo "❌ Missing test data (need student, tutor, and bucket)\n";
    exit(1);
}

// Test 1: Create Essay
echo "Test 1: Creating essay with tutor...\n";
$essayService = app(EssayService::class);
$essay = $essayService->storeEssay([
    'title' => 'Automated Test Essay',
    'content' => 'Test content',
    'bucket_id' => $bucket->id,
    'tutor_id' => $tutor->id,
    'status' => 'submitted',
    'words' => $bucket->words->take(2)->map(fn($w) => [
        'id' => $w->id,
        'used' => true
    ])->toArray(),
], $student);

assert($essay->exists, "Essay created");
assert($essay->visibility !== null, "Visibility record created");
assert($essay->reviews()->count() === 1, "Review session created");
echo "✓ Pass\n\n";

// Test 2: Submit Review
echo "Test 2: Submitting tutor review...\n";
$reviewService = app(ReviewService::class);
$review = $essay->reviews()->first();
$reviewService->submitReview($review, [
    ['word_id' => $bucket->words[0]->id, 'grade' => 'correct', 'comment' => 'Good'],
    ['word_id' => $bucket->words[1]->id, 'grade' => 'correct', 'comment' => 'Great'],
], "Test feedback");

$essay->refresh();
assert($review->status === 'completed', "Review completed");
echo "✓ Pass\n\n";

// Test 3: Consensus Calculation
echo "Test 3: Checking consensus...\n";
$essayWord = DB::table('essay_word_join')
    ->where('essay_id', $essay->id)
    ->first();

assert($essayWord->consensus_grade !== null, "Consensus grade set");
assert($essayWord->consensus_confidence === 100, "100% confidence with 1 review");
assert($essayWord->review_count === 1, "Review count is 1");
echo "✓ Pass\n\n";

// Test 4: Auto-Approval
echo "Test 4: Testing auto-approval...\n";
$approved = $reviewService->autoApproveIfPossible($essay);
$essay->refresh();

assert($approved === true, "Essay auto-approved");
assert($essay->status === 'graded', "Status is graded");
assert($essay->requires_student_review === false, "No student review needed");
echo "✓ Pass\n\n";

// Test 5: Bucket Grades Updated
echo "Test 5: Verifying bucket grade updates...\n";
$bucketGrade = DB::table('bucket_word_join')
    ->where('bucket_id', $bucket->id)
    ->where('word_id', $bucket->words[0]->id)
    ->value('grade');

assert($bucketGrade === 'correct', "Bucket grade updated");
echo "✓ Pass\n\n";

// Test 6: Public Essay
echo "Test 6: Making essay public...\n";
$visibility = $essay->visibility;
$visibility->makePublic();

assert($visibility->isPublic() === true, "Essay is public");
assert($visibility->public_url_token !== null, "Token generated");
echo "✓ Pass\n\n";

// Test 7: Credibility
echo "Test 7: Checking credibility system...\n";
$credibilityService = app(CredibilityService::class);
$stats = $credibilityService->getStats($tutor->id);

assert($stats['total_reviews'] > 0, "Tutor has reviews");
assert($stats['credibility_score'] >= 0.1, "Valid credibility score");
assert($stats['tier'] !== null, "Tier assigned");
echo "✓ Pass\n\n";

echo "=== All Tests Passed! ✓ ===\n";
```

Run it:
```bash
php test-multi-reviewer.php
```

---

## Common Issues & Debugging

### Issue 1: "Visibility settings not found"

**Cause:** Essay created before migration
**Fix:**
```php
$essay = Essay::find(1);
EssayVisibility::create([
    'essay_id' => $essay->id,
    'visibility_type' => 'private',
    'allow_anonymous' => true,
]);
```

### Issue 2: "Review not found"

**Cause:** Review session not created on essay submission
**Fix:**
```php
$reviewService = app('App\Services\ReviewService');
$review = $reviewService->createReview($essay, $tutor->id, 'tutor');
```

### Issue 3: Consensus not calculating

**Cause:** Review not marked as completed
**Fix:**
```php
$review->update(['status' => 'completed', 'completed_at' => now()]);
$consensusService = app('App\Services\ConsensusService');
$consensusService->calculateConsensusForEssay($essay);
```

---

## Performance Testing

Test with multiple reviews:

```php
// Create 10 public reviews
for ($i = 1; $i <= 10; $i++) {
    $review = $reviewService->createReview($essay, null, 'public', "Reviewer $i");
    $grades = $essay->words->map(fn($w) => [
        'word_id' => $w->id,
        'grade' => ['correct', 'partially_correct', 'incorrect'][rand(0, 2)],
        'comment' => "Comment from reviewer $i",
    ])->toArray();

    $reviewService->submitReview($review, $grades, "Feedback $i");
}

// Check consensus with many reviews
$essay->refresh();
echo "Reviews: " . $essay->completedReviews()->count() . "\n";
// Should still work efficiently
```

---

## Next Steps

Once backend testing is complete:
1. Start building frontend components
2. Test via actual UI
3. Add automated PHPUnit tests
4. Performance test with 100+ reviews

**Current Status:** Backend fully testable via Tinker and API ✅
