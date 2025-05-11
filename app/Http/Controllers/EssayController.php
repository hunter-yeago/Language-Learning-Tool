<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use App\Models\BucketWordJoin;
use App\Models\EssayWordJoin;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class EssayController extends Controller
{
    public function store(Request $request)
{
    try {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'bucket_id' => 'required|exists:buckets,id',
            'content' => 'required|string',
            'used_words' => 'array',
            'not_used_words' => 'array',
        ]);
    } catch (\Illuminate\Validation\ValidationException $e) {
        Log::error('Validation failed:', [
            'errors' => $e->errors(),
            'data' => $request->all()
        ]);
        throw $e;
    }
    
    // Log::info('Raw request data:', $request->all());
    $essay = Essay::create([
        'title' => $validated['title'],
        'bucket_id' => $validated['bucket_id'],
        'content' => $validated['content'],
        'user_id' => Auth::id(),
    ]);

    foreach ($validated['used_words'] as $word) {
        // EssayWordJoin
        $essayWordJoin = EssayWordJoin::firstOrNew([
            'essay_id' => $essay->id,
            'word_id' => $word["id"],
        ]);
        if ($this->shouldUpdateGrade($essayWordJoin->grade, 'used_in_essay')) {
            $essayWordJoin->grade = 'used_in_essay';
        }
        $essayWordJoin->save();

        // BucketWordJoin
        $bucketWordJoin = BucketWordJoin::firstOrCreate([
            'word_id' => $word["id"],
            'bucket_id' => $validated["bucket_id"],
        ]);
        if ($this->shouldUpdateGrade($bucketWordJoin->grade, 'used_in_essay')) {
            $bucketWordJoin->grade = 'used_in_essay';
        }
        $bucketWordJoin->increment('times_used_in_essay');
        $bucketWordJoin->increment('times_in_word_bank');
        $bucketWordJoin->save();
    }

    foreach ($validated['not_used_words'] as $word) {
        // EssayWordJoin
        $essayWordJoin = EssayWordJoin::firstOrNew([
            'essay_id' => $essay->id,
            'word_id' => $word["id"],
        ]);
        if ($this->shouldUpdateGrade($essayWordJoin->grade, 'attempted_but_not_used')) {
            $essayWordJoin->grade = 'attempted_but_not_used';
        }
        $essayWordJoin->save();

        // BucketWordJoin
        $bucketWordJoin = BucketWordJoin::firstOrCreate([
            'word_id' => $word["id"],
            'bucket_id' => $validated["bucket_id"],
        ]);
        if ($this->shouldUpdateGrade($bucketWordJoin->grade, 'attempted_but_not_used')) {
            $bucketWordJoin->grade = 'attempted_but_not_used';
        }
        $bucketWordJoin->increment('times_used_in_essay');
        $bucketWordJoin->increment('times_in_word_bank');
        $bucketWordJoin->save();
    }

    return redirect()->route('/', ['bucketID' => $validated['bucket_id']])
        ->with('success', 'Essay saved');
}

private function shouldUpdateGrade(?string $existing, string $new): bool
{
    $transitions = [
        'not_attempted' => ['attempted_but_not_used', 'used_in_essay'],
        'attempted_but_not_used' => ['used_in_essay'],
        null => ['attempted_but_not_used', 'used_in_essay'], // no grade yet
    ];

    return in_array($new, $transitions[$existing] ?? []);
}


    public function index()
    {
        $essays = Essay::all();

        return Inertia::render('Essays', [
            'essays' => $essays,
        ]);
    }
}
