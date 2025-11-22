# How to Test Multi-Reviewer System (As a User)

## ✅ What's Been Added

I've added buttons to your existing essay review page so you can actually **use** the multi-reviewer features now!

---

## 🎯 Test Scenario 1: Share Essay Publicly (Reddit Use Case)

### Step 1: Create and Submit an Essay
1. Log in as a **student**
2. Go to your dashboard
3. Create a new essay (or use an existing one)
4. Assign it to a tutor and submit

### Step 2: View Your Graded Essay
1. After your tutor grades it, click "View Essay" from your dashboard
2. You'll now see **new buttons** at the top of the page:
   - 🌐 **Share Publicly** button
   - 👁️ **View All Reviews** button (if essay has multiple reviews)

### Step 3: Make Essay Public
1. Click **"🌐 Share Publicly"**
2. Confirm the dialog
3. You'll see:
   - A blue box with your public URL
   - The link is automatically copied to your clipboard
   - Buttons change to "📋 Copy Public Link" and "🔒 Make Private"

### Step 4: Share on Reddit (or anywhere)
1. Go to Reddit (like r/Spanish or r/languagelearning)
2. Post a comment in Spanish/your target language
3. At the end, add:
   ```
   If you notice any errors, please review my essay here: [paste the link]
   ```

### Step 5: People Review Your Essay
1. When someone clicks your link (they don't need an account):
   - They see your essay content
   - They can grade each word (correct/partially correct/incorrect)
   - They can leave comments on specific words
   - They provide overall feedback
   - They can optionally add their name (or stay anonymous)

### Step 6: View All Reviews
1. Back on your essay page, click **"👁️ View All Reviews"**
2. You'll see:
   - All reviews from all reviewers
   - Consensus grades for each word
   - Confidence percentage (how much reviewers agreed)
   - Side-by-side comparison of all grades

### Step 7: Approve Grades
1. On the review approval page:
   - Each word shows all grades from different reviewers
   - The consensus grade is pre-selected
   - You can click on any reviewer's grade to choose it instead
   - Click **"Approve X Grades"** at the bottom
2. Your bucket grades will update with your approved choices!

---

## 🎯 Test Scenario 2: Multiple Tutors

### Step 1: Get Multiple Reviews
1. Create an essay
2. Submit to Tutor A
3. After Tutor A grades it, you can manually create another review via Tinker:

```bash
php artisan tinker
```

```php
$essay = Essay::find(1); // Your essay ID
$tutorB = User::role('tutor')->skip(1)->first(); // Different tutor

$reviewService = app('App\Services\ReviewService');
$review = $reviewService->createReview($essay, $tutorB->id, 'tutor');

// Tutor B grades differently
$reviewService->submitReview($review, [
    ['word_id' => 1, 'grade' => 'correct', 'comment' => 'Good!'],
    ['word_id' => 2, 'grade' => 'incorrect', 'comment' => 'Should be "grande"'],
], "Review from Tutor B");
```

### Step 2: See Conflicting Reviews
1. Refresh your essay page
2. Click **"👁️ View All Reviews"**
3. You'll see both tutors' reviews
4. Words with different grades will show lower confidence %
5. Choose which tutor's grade you trust more

---

## 🎯 What You Can Test Right Now

### ✅ Working Features:

**On Essay Review Page (`/view-essay`):**
- ✅ "Share Publicly" button
- ✅ "Make Private" button
- ✅ Copy public link button
- ✅ Public URL display
- ✅ "View All Reviews" button

**On Review Approval Page (`/essays/{id}/approve`):**
- ✅ See all reviews from all reviewers
- ✅ View consensus grades with confidence %
- ✅ Click to select which grade to use
- ✅ Approve grades button
- ✅ Updates bucket grades

**On Public Essay Page (`/public/essay/{token}`):**
- ✅ Anyone can view (no login needed)
- ✅ Anonymous review submission
- ✅ Grade each word
- ✅ Leave comments
- ✅ Overall feedback

### ❌ Not Yet Built:
- Leaderboard UI
- Credibility badges in UI
- Reviewer profile pages
- Advanced filtering/sorting

---

## 🚀 Quick Test (5 minutes)

1. **Login** as student
2. **Go to** an existing graded essay
3. **Click** "🌐 Share Publicly"
4. **Copy** the public URL
5. **Open** the URL in an **incognito window** (to test as anonymous user)
6. **Submit** a review as "Reddit Helper"
7. **Back** in your logged-in window, click **"👁️ View All Reviews"**
8. **See** your tutor's review + anonymous review
9. **Choose** which grades to accept
10. **Click** "Approve Grades"
11. **Done!** Your bucket is updated

---

## 📍 Where Are The New Features?

### Student Essay Review Page
**File:** `resources/js/Pages/StudentEssayReviewPage.tsx`
**URL:** `/view-essay?essay_id=X`

**New UI Elements:**
- Top right corner: "🌐 Share Publicly" button
- After making public: Blue info box with shareable link
- After making public: "📋 Copy Public Link" and "🔒 Make Private" buttons
- If multiple reviews: "👁️ View All Reviews" button

### Review Approval Page (NEW!)
**File:** `resources/js/Pages/ReviewApprovalPage.tsx`
**URL:** `/essays/{id}/approve`

**Features:**
- Shows total number of reviewers
- Consensus grade with confidence % per word
- All individual grades from each reviewer
- Click to select which grade to use
- Approve button to finalize

### Public Essay View (NEW!)
**File:** `resources/js/Pages/PublicEssayView.tsx`
**URL:** `/public/essay/{token}` (no login required)

**Features:**
- Read-only essay view
- Review form (if anonymous reviews allowed)
- Grade each word
- Add comments
- Submit feedback

---

## 🔧 Troubleshooting

### "Share Publicly" button doesn't work
**Fix:** Make sure you've run the migrations:
```bash
php artisan migrate
```

### Public URL doesn't load
**Fix:** Clear route cache:
```bash
php artisan route:clear
php artisan config:clear
```

### "View All Reviews" button missing
**Reason:** Only shows if essay has status = 'graded'

### Can't submit review on public page
**Check:**
1. Is the essay actually public? (Click "Share Publicly" first)
2. Are anonymous reviews enabled? (default: yes)
3. Did you grade at least one word?
4. Did you fill out the feedback field?

---

## 💡 Use Cases You Can Test

### 1. Reddit Post for Corrections
Create essay → Share publicly → Post link on Reddit → Strangers review → You approve grades

### 2. Multiple Tutor Opinions
Create essay → Send to 2 tutors → They disagree → You choose which grade to trust

### 3. Practice Partner Exchange
You and a friend share essays publicly → Review each other's → Build credibility

### 4. Discord/Language Server
Share link in Discord → Native speakers provide feedback → Aggregate consensus

---

## 📊 What Happens Behind the Scenes

1. **When you share publicly:**
   - Creates unique token for the essay
   - Sets visibility_type = 'public'
   - Sets expiration (30 days default)
   - Anyone with link can view

2. **When someone submits a review:**
   - Creates essay_review record
   - Saves word grades in essay_word_reviews
   - Triggers consensus calculation
   - Updates essay_word_join with consensus

3. **When you approve grades:**
   - Updates bucket_word_join with your choices
   - Sets essay status to 'graded'
   - Updates reviewer credibility scores
   - Marks essay as reviewed

---

## 🎉 Try It Now!

1. **Go to your app:** `http://localhost:8000`
2. **Login as student**
3. **Navigate to a graded essay**
4. **Look for the new buttons!**

The multi-reviewer system is **live and working** - just needs you to try it! 🚀
