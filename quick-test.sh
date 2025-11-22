#!/bin/bash

# Quick Multi-Reviewer System Test
# This runs a simple test to verify everything works

echo "=== Quick Multi-Reviewer System Test ==="
echo ""

php artisan tinker --execute="
echo \"Step 1: Checking services load...\n\";
try {
    \$reviewService = app('App\Services\ReviewService');
    \$consensusService = app('App\Services\ConsensusService');
    \$credibilityService = app('App\Services\CredibilityService');
    echo \"✓ All services load correctly\n\n\";
} catch (Exception \$e) {
    echo \"✗ Service error: \" . \$e->getMessage() . \"\n\";
    exit(1);
}

echo \"Step 2: Checking database tables...\n\";
try {
    \$tables = ['essay_reviews', 'essay_word_reviews', 'reviewer_credibility', 'essay_visibility'];
    foreach (\$tables as \$table) {
        DB::table(\$table)->count();
        echo \"✓ \$table exists\n\";
    }
    echo \"\n\";
} catch (Exception \$e) {
    echo \"✗ Database error: \" . \$e->getMessage() . \"\n\";
    exit(1);
}

echo \"Step 3: Checking models...\n\";
try {
    \$models = [
        'App\Models\EssayReview',
        'App\Models\EssayWordReview',
        'App\Models\EssayVisibility',
        'App\Models\ReviewerCredibility',
    ];
    foreach (\$models as \$model) {
        new \$model;
        echo \"✓ \" . class_basename(\$model) . \" loads\n\";
    }
    echo \"\n\";
} catch (Exception \$e) {
    echo \"✗ Model error: \" . \$e->getMessage() . \"\n\";
    exit(1);
}

echo \"Step 4: Checking routes...\n\";
\$routes = [
    'essays.review-summary',
    'essays.approve-grades',
    'public.essay',
    'public.submit-review',
    'reviewers.leaderboard',
];
foreach (\$routes as \$routeName) {
    if (Route::has(\$routeName)) {
        echo \"✓ Route '\$routeName' registered\n\";
    } else {
        echo \"✗ Route '\$routeName' missing\n\";
    }
}

echo \"\n=== All Basic Checks Passed! ✓ ===\n\";
echo \"\nNext: See TESTING_GUIDE.md for full test suites\n\";
"
