# Frontend Testing Guide - Multi-Reviewer System

Since the React components aren't built yet, here's how to test the backend APIs from the frontend/browser perspective.

---

## Option 1: Browser DevTools (Easiest)

### Step 1: Log into your app
1. Open your app in the browser
2. Log in as a student
3. Open Browser DevTools (F12)
4. Go to the Console tab

### Step 2: Test API endpoints using fetch

**Test: Get review summary for an essay**
```javascript
// Replace 1 with your essay ID
fetch('/essays/1/review-summary', {
    method: 'GET',
    headers: {
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    credentials: 'same-origin'
})
.then(res => res.json())
.then(data => console.log('Review Summary:', data))
.catch(err => console.error('Error:', err));
```

**Test: Update essay visibility**
```javascript
// Make essay public
fetch('/essays/1/visibility', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    credentials: 'same-origin',
    body: JSON.stringify({
        visibility_type: 'public',
        allow_anonymous: true,
        expires_in_days: 30
    })
})
.then(res => res.json())
.then(data => {
    console.log('Visibility updated!', data);
    console.log('Public URL:', data.public_url);
    // Copy this URL to test public access
})
.catch(err => console.error('Error:', err));
```

**Test: Approve grades**
```javascript
// Approve grades for an essay
fetch('/essays/1/approve-grades', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    credentials: 'same-origin',
    body: JSON.stringify({
        approved_grades: [
            { word_id: 1, grade: 'correct' },
            { word_id: 2, grade: 'partially_correct' }
        ]
    })
})
.then(res => res.json())
.then(data => console.log('Grades approved!', data))
.catch(err => console.error('Error:', err));
```

**Test: Public essay view (no auth needed)**
```javascript
// Open in new tab or fetch
// Replace TOKEN with the token from visibility update response
window.open('/public/essay/TOKEN_HERE', '_blank');
```

**Test: Submit public review (no auth needed)**
```javascript
// From a public essay page or incognito window
fetch('/public/essay/TOKEN_HERE/review', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({
        reviewer_name: 'Anonymous Helper',
        feedback: 'Great job!',
        word_grades: [
            { word_id: 1, grade: 'correct', comment: 'Perfect!' },
            { word_id: 2, grade: 'partially_correct', comment: 'Almost there' }
        ]
    })
})
.then(res => res.json())
.then(data => console.log('Review submitted!', data))
.catch(err => console.error('Error:', err));
```

**Test: Get leaderboard (no auth needed)**
```javascript
fetch('/reviewers/leaderboard', {
    method: 'GET',
    headers: { 'Accept': 'application/json' }
})
.then(res => res.json())
.then(data => console.log('Top Reviewers:', data))
.catch(err => console.error('Error:', err));
```

---

## Option 2: React Dev Component (Quick Prototype)

Create a temporary test component to interact with the APIs.

### Create test page component

**File:** `resources/js/Pages/TestMultiReviewer.tsx`

```tsx
import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import axios from 'axios';

export default function TestMultiReviewer() {
    const [essayId, setEssayId] = useState(1);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    const testGetReviewSummary = async () => {
        try {
            const response = await axios.get(`/essays/${essayId}/review-summary`);
            setResults(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const testMakePublic = async () => {
        try {
            const response = await axios.post(`/essays/${essayId}/visibility`, {
                visibility_type: 'public',
                allow_anonymous: true,
                expires_in_days: 30
            });
            setResults(response.data);
            setError(null);
            alert('Public URL: ' + response.data.public_url);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const testApproveGrades = async () => {
        try {
            // You'll need to customize this with real word IDs
            const response = await axios.post(`/essays/${essayId}/approve-grades`, {
                approved_grades: [
                    { word_id: 1, grade: 'correct' },
                    { word_id: 2, grade: 'partially_correct' }
                ]
            });
            setResults(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const testGetLeaderboard = async () => {
        try {
            const response = await axios.get('/reviewers/leaderboard');
            setResults(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Multi-Reviewer System Tester</h1>

            <div style={{ marginBottom: '1rem' }}>
                <label>
                    Essay ID:
                    <input
                        type="number"
                        value={essayId}
                        onChange={(e) => setEssayId(parseInt(e.target.value))}
                        style={{ marginLeft: '0.5rem', padding: '0.25rem' }}
                    />
                </label>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <button onClick={testGetReviewSummary}>Get Review Summary</button>
                <button onClick={testMakePublic}>Make Public</button>
                <button onClick={testApproveGrades}>Approve Grades</button>
                <button onClick={testGetLeaderboard}>Get Leaderboard</button>
            </div>

            {error && (
                <div style={{ padding: '1rem', background: '#fee', border: '1px solid #fcc', borderRadius: '4px', marginBottom: '1rem' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {results && (
                <div style={{ padding: '1rem', background: '#efe', border: '1px solid #cfc', borderRadius: '4px' }}>
                    <strong>Results:</strong>
                    <pre style={{ overflow: 'auto', maxHeight: '400px' }}>
                        {JSON.stringify(results, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
}
```

### Add route for test page

**File:** `routes/web.php`

Add this inside the student middleware group:

```php
// Temporary test page (remove in production)
Route::get('/test-multi-reviewer', function () {
    return Inertia::render('TestMultiReviewer');
})->name('test-multi-reviewer');
```

### Access the test page

Visit: `http://localhost:8000/test-multi-reviewer`

You'll see buttons to test each API endpoint!

---

## Option 3: Postman/Insomnia Collection

Import this collection into Postman or Insomnia.

**Save as:** `multi-reviewer-api.postman.json`

```json
{
    "info": {
        "name": "Multi-Reviewer API",
        "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    "item": [
        {
            "name": "Get Review Summary",
            "request": {
                "method": "GET",
                "header": [
                    {
                        "key": "Accept",
                        "value": "application/json"
                    }
                ],
                "url": {
                    "raw": "{{baseUrl}}/essays/{{essayId}}/review-summary",
                    "host": ["{{baseUrl}}"],
                    "path": ["essays", "{{essayId}}", "review-summary"]
                }
            }
        },
        {
            "name": "Update Visibility",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    },
                    {
                        "key": "Accept",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"visibility_type\": \"public\",\n    \"allow_anonymous\": true,\n    \"expires_in_days\": 30\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/essays/{{essayId}}/visibility",
                    "host": ["{{baseUrl}}"],
                    "path": ["essays", "{{essayId}}", "visibility"]
                }
            }
        },
        {
            "name": "Approve Grades",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"approved_grades\": [\n        {\"word_id\": 1, \"grade\": \"correct\"},\n        {\"word_id\": 2, \"grade\": \"partially_correct\"}\n    ]\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/essays/{{essayId}}/approve-grades",
                    "host": ["{{baseUrl}}"],
                    "path": ["essays", "{{essayId}}", "approve-grades"]
                }
            }
        },
        {
            "name": "View Public Essay",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "{{baseUrl}}/public/essay/{{token}}",
                    "host": ["{{baseUrl}}"],
                    "path": ["public", "essay", "{{token}}"]
                }
            }
        },
        {
            "name": "Submit Public Review",
            "request": {
                "method": "POST",
                "header": [
                    {
                        "key": "Content-Type",
                        "value": "application/json"
                    }
                ],
                "body": {
                    "mode": "raw",
                    "raw": "{\n    \"reviewer_name\": \"Anonymous Helper\",\n    \"feedback\": \"Great job!\",\n    \"word_grades\": [\n        {\n            \"word_id\": 1,\n            \"grade\": \"correct\",\n            \"comment\": \"Perfect!\"\n        },\n        {\n            \"word_id\": 2,\n            \"grade\": \"partially_correct\",\n            \"comment\": \"Almost there\"\n        }\n    ]\n}"
                },
                "url": {
                    "raw": "{{baseUrl}}/public/essay/{{token}}/review",
                    "host": ["{{baseUrl}}"],
                    "path": ["public", "essay", "{{token}}", "review"]
                }
            }
        },
        {
            "name": "Get Leaderboard",
            "request": {
                "method": "GET",
                "url": {
                    "raw": "{{baseUrl}}/reviewers/leaderboard",
                    "host": ["{{baseUrl}}"],
                    "path": ["reviewers", "leaderboard"]
                }
            }
        }
    ],
    "variable": [
        {
            "key": "baseUrl",
            "value": "http://localhost:8000"
        },
        {
            "key": "essayId",
            "value": "1"
        },
        {
            "key": "token",
            "value": "YOUR_TOKEN_HERE"
        }
    ]
}
```

---

## Option 4: Simple HTML Test Page

Create a standalone HTML page to test the APIs.

**File:** `public/test-api.html`

```html
<!DOCTYPE html>
<html>
<head>
    <title>Multi-Reviewer API Tester</title>
    <meta name="csrf-token" content="">
    <style>
        body { font-family: Arial, sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        button { padding: 10px 15px; margin: 5px; cursor: pointer; }
        .result { margin-top: 20px; padding: 15px; background: #f0f0f0; border-radius: 5px; }
        pre { overflow: auto; max-height: 400px; }
        input { padding: 5px; margin: 5px; }
    </style>
</head>
<body>
    <h1>Multi-Reviewer API Tester</h1>

    <div>
        <label>Essay ID: <input type="number" id="essayId" value="1"></label>
        <label>Token: <input type="text" id="token" placeholder="For public essay tests"></label>
    </div>

    <div>
        <button onclick="getReviewSummary()">Get Review Summary</button>
        <button onclick="makePublic()">Make Public</button>
        <button onclick="getLeaderboard()">Get Leaderboard</button>
        <button onclick="viewPublic()">View Public Essay</button>
    </div>

    <div id="result" class="result" style="display: none;">
        <h3>Result:</h3>
        <pre id="resultContent"></pre>
    </div>

    <script>
        // Get CSRF token from Laravel
        fetch('/sanctum/csrf-cookie').then(() => {
            const token = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];
            if (token) {
                document.querySelector('meta[name="csrf-token"]').content = decodeURIComponent(token);
            }
        });

        function showResult(data) {
            document.getElementById('result').style.display = 'block';
            document.getElementById('resultContent').textContent = JSON.stringify(data, null, 2);
        }

        function showError(error) {
            showResult({ error: error.message || error });
        }

        async function getReviewSummary() {
            const essayId = document.getElementById('essayId').value;
            try {
                const response = await fetch(`/essays/${essayId}/review-summary`, {
                    headers: {
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    credentials: 'same-origin'
                });
                const data = await response.json();
                showResult(data);
            } catch (error) {
                showError(error);
            }
        }

        async function makePublic() {
            const essayId = document.getElementById('essayId').value;
            try {
                const response = await fetch(`/essays/${essayId}/visibility`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    },
                    credentials: 'same-origin',
                    body: JSON.stringify({
                        visibility_type: 'public',
                        allow_anonymous: true,
                        expires_in_days: 30
                    })
                });
                const data = await response.json();
                showResult(data);
                if (data.public_url) {
                    alert('Public URL: ' + data.public_url);
                    document.getElementById('token').value = data.visibility.public_url_token;
                }
            } catch (error) {
                showError(error);
            }
        }

        async function getLeaderboard() {
            try {
                const response = await fetch('/reviewers/leaderboard', {
                    headers: { 'Accept': 'application/json' }
                });
                const data = await response.json();
                showResult(data);
            } catch (error) {
                showError(error);
            }
        }

        function viewPublic() {
            const token = document.getElementById('token').value;
            if (!token) {
                alert('Please enter a token first (or make an essay public)');
                return;
            }
            window.open(`/public/essay/${token}`, '_blank');
        }
    </script>
</body>
</html>
```

**Access it:** `http://localhost:8000/test-api.html`

---

## Quick Test Workflow

1. **Setup data via Tinker:**
```bash
php artisan tinker
```

```php
// Create test essay with tutor
$student = User::role('student')->first();
$tutor = User::role('tutor')->first();
$bucket = $student->buckets()->with('words')->first();

$essayService = app('App\Services\EssayService');
$essay = $essayService->storeEssay([
    'title' => 'Frontend Test Essay',
    'content' => 'Test content',
    'bucket_id' => $bucket->id,
    'tutor_id' => $tutor->id,
    'status' => 'submitted',
    'words' => $bucket->words->take(2)->map(fn($w) => ['id' => $w->id, 'used' => true])->toArray(),
], $student);

// Grade it
$review = $essay->reviews()->first();
$reviewService = app('App\Services\ReviewService');
$reviewService->submitReview($review, [
    ['word_id' => $bucket->words[0]->id, 'grade' => 'correct', 'comment' => 'Good!'],
    ['word_id' => $bucket->words[1]->id, 'grade' => 'correct', 'comment' => 'Great!'],
], "Nice work!");

echo "Essay ID: {$essay->id}\n";
```

2. **Test from browser console:**
```javascript
// Open your app, login, then in console:
fetch('/essays/1/review-summary')
    .then(r => r.json())
    .then(d => console.table(d));
```

3. **Make it public:**
```javascript
fetch('/essays/1/visibility', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
    },
    body: JSON.stringify({
        visibility_type: 'public',
        allow_anonymous: true
    })
}).then(r => r.json()).then(d => console.log('Public URL:', d.public_url));
```

4. **Visit public URL in incognito window** (test anonymous access)

5. **Submit anonymous review** (from incognito console):
```javascript
fetch('/public/essay/TOKEN/review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        reviewer_name: 'Reddit Helper',
        feedback: 'Looks good!',
        word_grades: [
            { word_id: 1, grade: 'correct', comment: 'Perfect!' }
        ]
    })
}).then(r => r.json()).then(d => console.log(d));
```

---

## Expected Results

### Get Review Summary Response:
```json
{
    "summary": {
        "essay_id": 1,
        "total_reviews": 1,
        "requires_review": false,
        "words": [
            {
                "word_id": 1,
                "word_text": "casa",
                "consensus_grade": "correct",
                "consensus_confidence": 100,
                "all_grades": [
                    {
                        "reviewer_name": "Tutor Name",
                        "reviewer_type": "tutor",
                        "grade": "correct",
                        "comment": "Good!"
                    }
                ]
            }
        ]
    },
    "reviews": [...]
}
```

### Make Public Response:
```json
{
    "message": "Visibility settings updated",
    "visibility": {
        "id": 1,
        "essay_id": 1,
        "visibility_type": "public",
        "public_url_token": "abc123...",
        "allow_anonymous": true,
        "expires_at": "2025-12-22..."
    },
    "public_url": "http://localhost:8000/public/essay/abc123..."
}
```

---

## What You Can Test Right Now

✅ **Working (Backend APIs):**
- Get review summary via fetch/axios
- Update essay visibility
- View public essays by token
- Submit anonymous reviews
- Get leaderboard
- Get reviewer stats

❌ **Not Yet (Needs Frontend):**
- Pretty UI for review approval
- Side-by-side review comparison
- Visual confidence indicators
- Drag-and-drop review submission
- Credibility badges in UI

---

## Next Steps

Once you've tested the APIs work:
1. Build React components that call these endpoints
2. Create Inertia pages for review approval
3. Add UI for public essay sharing
4. Implement credibility badges

The backend is ready - just needs a frontend! 🚀
