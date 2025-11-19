<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use App\Models\Bucket;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StudentController extends Controller
{

    // temporarily taking out request
    public function index()
    {
        $essays = Essay::where('user_id', Auth::id())->with('words')->get();
        $buckets = Bucket::where('user_id', Auth::id())->with('words')->get();
        // $bucketID = $request->query('bucketID');

        return Inertia::render('Dashboard', [
            'essays' => $essays,
            'buckets' => $buckets,
            // 'bucketID' => $bucketID,
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

        if (!$essay_id) {
            return redirect()->route('/');
        }

        $essay = Essay::with('words')->find($essay_id);

        if (!$essay || $essay->user_id !== Auth::id()) {
            return redirect()->route('/')->with('error', 'Essay not found');
        }

        return Inertia::render('StudentEssayReviewPage', [
            'essay' => $essay,
        ]);
    }
}
