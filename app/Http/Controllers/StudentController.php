<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use App\Models\Bucket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{

    public function index(Request $request)
    {
        $essays = Essay::where('user_id', Auth::id())->with('words')->get();
        $buckets = Bucket::where('user_id', Auth::id())->with('words')->get();
        $bucketID = $request->query('bucketID');

        return Inertia::render('Dashboard', [
            'essays' => $essays,
            'buckets' => $buckets,
            'bucketID' => $bucketID,
        ]);
    }

    public function addWordsPage(Request $request)
    {
        $bucket = $request->input('bucket');
        $words = $request->input('words', []);

        return Inertia::render('AddWordsPage', [
            'bucket' => $bucket,
            'words' => $words,
        ]);
    }

    public function getAddWordsPage(Request $request)
    {
        $bucketId = $request->query('bucketId');

        // If no bucket ID is provided, redirect to dashboard
        if (!$bucketId) {
            return redirect()->route('/');
        }

        // Fetch the bucket with its words
        $bucket = Bucket::with('words')->find($bucketId);

        // If bucket doesn't exist or doesn't belong to the user, redirect
        if (!$bucket || $bucket->user_id !== Auth::id()) {
            return redirect()->route('/')->with('error', 'Bucket not found');
        }

        // Get all words from all of the user's buckets
        $allUserWords = Bucket::where('user_id', Auth::id())
            ->with('words')
            ->get()
            ->pluck('words')
            ->flatten()
            ->pluck('word')
            ->unique()
            ->values();

        return Inertia::render('AddWordsPage', [
            'bucket' => $bucket,
            'words' => $bucket->words ?? [],
            'existingWords' => $allUserWords,
        ]);
    }

    public function writeEssayPage(Request $request)
    {
        $bucket = $request->input('bucket');
        $bucketID = $request->input('bucketID');

        return Inertia::render('WriteEssayPage', [
            'bucket' => $bucket,
            'words' => $bucket['words'],
            'bucketID' => $bucketID
        ]);
    }

    public function viewEssay(Request $request)
    {
        $essay_id = $request->input('essay_id');
        $bucket_id = $request->input('bucket_id');

        if (!$essay_id) {
            return redirect()->route('/');
        }

        $essay = Essay::with('words')->find($essay_id);

        if (!$essay || $essay->user_id !== Auth::id()) {
            return redirect()->route('/')->with('error', 'Essay not found');
        }

        // Mark essay as viewed when student opens it
        if (!$essay->viewed) {
            $essay->update(['viewed' => true]);
        }

        return Inertia::render('StudentEssayReviewPage', [
            'essay' => $essay,
            'bucket_id' => $bucket_id,
        ]);
    }

    public function progress()
    {
        $essays = Essay::where('user_id', Auth::id())->with('words')->get();
        $buckets = Bucket::where('user_id', Auth::id())->with('words')->get();

        return Inertia::render('ProgressPage', [
            'essays' => $essays,
            'buckets' => $buckets,
        ]);
    }
}
