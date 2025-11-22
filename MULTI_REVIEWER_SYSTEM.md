# Multi-Reviewer Essay System

## Overview

The Multi-Reviewer Essay System allows students to receive feedback on their essays from multiple sources: tutors, public reviewers, and potentially AI. The system uses a **weighted consensus algorithm** to aggregate conflicting reviews and gives students final control over which grades to accept.

## Key Features

### 1. Multiple Review Sources
- **Tutors** - Paid/connected tutors with high credibility (0.9)
- **Public Reviewers** - Authenticated community members (0.5)
- **Anonymous** - Public reviewers without accounts (0.3)
- **AI** - Future support for automated review (0.7)

### 2. Weighted Consensus Algorithm
When multiple reviewers grade the same word differently, the system calculates a weighted consensus:

```
For each word:
  votes = {}
  total_weight = 0

  For each reviewer:
    weight = reviewer_credibility
    votes[grade] += weight
    total_weight += weight

  winning_grade = grade with highest weighted votes
  confidence = (winning_votes / total_weight) * 100
```

**Example:**
```
Word: "casa"
- Tutor A (credibility: 0.9): correct → weight: 0.9
- Tutor B (credibility: 0.8): correct → weight: 0.8
- Public C (credibility: 0.3): partially_correct → weight: 0.3
- Public D (credibility: 0.4): correct → weight: 0.4
- Anonymous E (credibility: 0.3): incorrect → weight: 0.3

Total weight: 2.7
Votes:
  correct: 0.9 + 0.8 + 0.4 = 2.1 (77.8%)
  partially_correct: 0.3 (11.1%)
  incorrect: 0.3 (11.1%)

Result: consensus_grade = "correct", confidence = 78%
```

### 3. Student Approval Workflow

#### High Confidence (≥80%)
- System auto-approves consensus grades
- Directly updates bucket grades
- No student review required

#### Medium Confidence (60-79%)
- Essay marked `requires_student_review = true`
- Student sees side-by-side comparison of all reviews
- Student approves word-by-word
- Approved grades update bucket

#### Low Confidence (<60%)
- Essay marked for student review
- System highlights conflicting words
- Student must manually choose which reviewer to trust

### 4. Credibility System

Reviewers build reputation over time based on:
- **Approval Rate (70%)** - How often students accept their grades
- **Helpful Votes (30%)** - How often students mark reviews as helpful

**Formula:**
```
credibility_score = (approved_reviews / total_reviews) * 0.7
                  + (helpful_votes / total_reviews) * 0.3

Clamped between 0.10 and 1.00
```

**Tiers:**
- **Expert** (≥0.90) - Highly trusted, votes count heavily
- **Highly Trusted** (0.75-0.89) - Experienced reviewers
- **Trusted** (0.60-0.74) - Reliable reviewers
- **Developing** (0.40-0.59) - Building reputation
- **New** (<0.40) - Just starting out

**Initial Scores:**
- Tutors: 0.90 (start high due to qualification)
- Public (authenticated): 0.50 (neutral start)
- Anonymous: 0.30 (low trust until proven)

### 5. Public Essay Sharing

Students can make essays publicly accessible:

**Visibility Types:**
- **Private** - Only student and assigned tutors can see
- **Public** - Discoverable in public essay gallery, anyone can review
- **Unlisted** - Accessible via shareable link but not discoverable

**Use Case - Reddit Comments:**
1. Student writes comment in Spanish on language-learning app
2. Creates public essay with same content
3. Posts comment on Reddit with link at bottom:
   > "Si noté algunos errores en mi español, [haz clic aquí para dejarme comentarios](https://app.com/public/essay/abc123)"
4. Native speakers review and provide feedback
5. Student sees consensus of all reviews
6. Student approves helpful feedback to improve their progress tracking

**Expiration:**
- Optional expiration date for public essays
- After expiration, essay becomes private again
- Prevents old essays from cluttering discovery

## Database Schema

### Core Tables

#### `essay_reviews`
Tracks individual review sessions:
```sql
id, essay_id, reviewer_id (nullable), reviewer_name (nullable),
reviewer_type (tutor/public/ai), status (pending/in_progress/completed),
feedback, submitted_at, completed_at
```

#### `essay_word_reviews`
Stores each reviewer's grades for each word:
```sql
id, essay_review_id, word_id, grade, comment
```

#### `reviewer_credibility`
Tracks reviewer reputation:
```sql
id, reviewer_id, credibility_score (0-1), total_reviews,
approved_reviews, helpful_votes
```

#### `essay_visibility`
Controls public sharing:
```sql
id, essay_id, visibility_type (private/public/unlisted),
public_url_token, allow_anonymous, expires_at
```

### Enhanced Tables

#### `essays`
Added fields:
- `primary_reviewer_id` - Main assigned reviewer
- `requires_student_review` - Flag for student approval needed
- `student_reviewed_at` - When student approved grades

#### `essay_word_join`
Added fields:
- `consensus_grade` - Calculated from all reviews
- `consensus_confidence` - Agreement level (0-100%)
- `student_approved_grade` - What student actually accepted
- `review_count` - Number of reviewers
- `student_approved_at` - Approval timestamp

## Services

### `ConsensusService`
Handles grade aggregation:
- `calculateConsensusForEssay()` - Process all words
- `getConsensusSummary()` - Prepare data for student UI
- `getConflictWords()` - Find low-confidence words
- `canAutoApprove()` - Check if consensus is strong enough

### `CredibilityService`
Manages reviewer reputation:
- `getOrCreateCredibility()` - Initialize reviewer
- `updateFromStudentApproval()` - Adjust after student review
- `markReviewHelpful()` - Increment helpful votes
- `getTopReviewers()` - Leaderboard data

### `ReviewService`
Main orchestration:
- `createReview()` - Start new review session
- `submitReview()` - Save grades, trigger consensus
- `processStudentApproval()` - Apply choices to bucket
- `autoApproveIfPossible()` - Skip student review if high confidence
- `getReviewSummary()` - Prepare approval UI data

## Workflow Examples

### Example 1: Single Tutor (Backward Compatible)
```
1. Student submits essay to tutor
2. Tutor grades essay (creates EssayReview)
3. ConsensusService calculates: 1 review = 100% confidence
4. System auto-approves
5. Grades update bucket immediately
6. Student sees graded essay (no approval needed)
```

### Example 2: Multiple Tutors
```
1. Student submits essay to 2 tutors
2. Tutor A grades: casa = correct
3. Tutor B grades: casa = partially_correct
4. Consensus:
   - Tutor A (0.9) vs Tutor B (0.8)
   - Correct wins with 53% confidence
   - Essay marked requires_student_review = true
5. Student sees both reviews side-by-side
6. Student chooses Tutor A's grade
7. Bucket updated with "correct"
8. Tutor A credibility increased, Tutor B decreased slightly
```

### Example 3: Public Reviews (Reddit Use Case)
```
1. Student writes Reddit comment, makes essay public
2. 10 native speakers review via shareable link
3. Consensus calculated:
   - Word "por": 7 correct, 2 incorrect, 1 partially_correct
   - High confidence (70%), consensus = correct
4. Student gets notification "10 reviews received"
5. Student opens approval interface
6. Most words have high confidence, 2 are flagged as conflicting
7. Student accepts consensus for most, manually reviews conflicts
8. Grades update bucket
9. Helpful reviewers' credibility increases
```

### Example 4: AI + Human Mix (Future)
```
1. Student submits essay
2. AI reviews immediately (instant feedback)
3. Tutor reviews next day (human insight)
4. Public reviewer adds comment
5. Consensus weighted:
   - AI (0.7) suggests "correct"
   - Tutor (0.9) suggests "partially_correct" with comment
   - Public (0.5) agrees with tutor
   - Tutor's grade wins due to higher weight + agreement
6. Student sees AI gave instant feedback but tutor's human judgment prevailed
```

## API Endpoints (To Be Implemented)

### Review Management
```
POST /api/essays/{id}/reviews - Create review session
POST /api/reviews/{id}/submit - Submit completed review
GET /api/essays/{id}/reviews/summary - Get consensus summary
POST /api/essays/{id}/approve-grades - Student approval
```

### Public Essays
```
POST /api/essays/{id}/visibility - Update visibility settings
GET /api/public/essays/{token} - View public essay
POST /api/public/essays/{token}/review - Submit public review
GET /api/public/essays - Browse public essays (discovery)
```

### Credibility
```
GET /api/reviewers/{id}/stats - Get credibility stats
GET /api/reviewers/leaderboard - Top reviewers
POST /api/reviews/{id}/helpful - Mark review as helpful
```

## Frontend Components (To Be Built)

### Phase 3: Student Review Approval UI
- `ReviewApprovalPage.tsx` - Main approval interface
- `ReviewComparisonTable.tsx` - Side-by-side word grades
- `ConsensusIndicator.tsx` - Visual confidence meter
- `ConflictWordHighlight.tsx` - Highlight low-confidence words
- `ReviewerCard.tsx` - Display reviewer info and feedback

### Phase 4: Public Essay Sharing
- `EssayVisibilitySettings.tsx` - Control public/private
- `PublicEssayView.tsx` - Read-only public view
- `AnonymousReviewForm.tsx` - Submit review without account
- `ShareableLinkGenerator.tsx` - Generate link for Reddit/social

### Phase 5: Credibility System UI
- `ReviewerProfile.tsx` - Show stats, tier, badges
- `ReviewerLeaderboard.tsx` - Top reviewers by language
- `CredibilityBadge.tsx` - Visual tier indicator
- `HelpfulButton.tsx` - Let students mark reviews helpful

## Configuration

### Thresholds (Configurable)
```php
// config/reviews.php (to be created)
return [
    'consensus' => [
        'auto_approve_threshold' => 80, // Auto-approve if ≥80% confidence
        'review_required_threshold' => 60, // Student review if <60%
    ],
    'credibility' => [
        'initial' => [
            'tutor' => 0.90,
            'public' => 0.50,
            'anonymous' => 0.30,
            'ai' => 0.70,
        ],
        'min_score' => 0.10,
        'max_score' => 1.00,
    ],
    'visibility' => [
        'default_expiration_days' => 30,
        'max_public_reviews' => 100,
    ],
];
```

## Migration Path

### Backward Compatibility
- Existing single-tutor essays work unchanged
- `essays.tutor_id` still used for primary reviewer
- If only 1 review, auto-approve (no student review needed)
- Historical essays: `student_approved_grade = grade`

### Data Migration
When enabling multi-reviewer for existing installation:
1. Run migrations to add new tables/columns
2. Create `essay_reviews` entries for all existing graded essays
3. Set `student_approved_grade = grade` for historical data
4. All existing essays default to `visibility_type = private`

## Future Enhancements

### Phase 6: Advanced Features
- **Review Templates** - Common feedback patterns for efficiency
- **Reviewer Specialization** - Track expertise by grammar topic
- **Review Requests** - Students can request specific reviewers
- **Review Marketplace** - Paid public reviews from native speakers
- **Bulk Operations** - Accept all high-confidence grades at once
- **Review History** - See how reviewer feedback has evolved
- **Language-Specific Credibility** - Separate scores per language

### Phase 7: Gamification
- **Badges** - "100 Reviews", "Native Speaker", "Grammar Expert"
- **Achievements** - Unlock for helpful reviews
- **Levels** - Level up as credibility increases
- **Competitions** - Monthly top reviewer contests

## Testing Strategy

### Unit Tests
- ConsensusService: Test weighted voting algorithm
- CredibilityService: Test score calculation
- ReviewService: Test approval workflow

### Integration Tests
- Multi-reviewer workflow end-to-end
- Public essay submission and review
- Credibility updates after student approval

### Manual Testing Scenarios
1. Single tutor essay (backward compatibility)
2. Two tutors with conflicting grades
3. 10 public reviews with majority consensus
4. Mixed tutor + public reviews
5. Anonymous review submission
6. Public essay expiration
7. Credibility score progression

## Performance Considerations

### Optimization Strategies
- **Eager Loading** - Load reviews with word grades to avoid N+1
- **Caching** - Cache credibility scores (update on approval only)
- **Indexing** - Index essay_id, reviewer_id, status fields
- **Batch Processing** - Calculate consensus in background for large review counts
- **Rate Limiting** - Limit anonymous reviews to prevent spam

### Scalability
- Consensus calculation is O(n) where n = number of reviews
- Should handle 100+ reviews per essay without issues
- Consider async processing for essays with >20 reviews

## Security Considerations

### Public Essays
- Rate limit anonymous reviews (1 per IP per essay per day)
- Sanitize all user input (XSS prevention)
- Validate reviewer can't review their own essay
- Prevent spam/abuse reports

### Credibility Gaming
- Prevent self-voting or alt accounts
- Detect suspicious approval patterns
- Manual review flagging system for administrators
- Minimum reviews required before credibility is shown publicly

## Support & Documentation

For implementation questions or issues:
1. Check this documentation
2. Review service class comments
3. Check database migrations for schema details
4. See FEATURE_ROADMAP.md for implementation status

---

**Last Updated:** 2025-11-22
**Status:** Phase 2/5 Complete (Backend models and services ready)
**Next Steps:** Phase 3 (Build student review approval UI)
