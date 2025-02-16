<?php

namespace App\Http\Controllers;

use App\Models\bucket;
use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class BucketController extends Controller
{
    /**
     * Store a newly created bucket in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        // $userId = Auth::id();

        // Create the bucket
        $bucket = Bucket::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'user_id' => Auth::id(),
        ]);

        // Redirect to the 'write-essay' route with a success message
        return redirect()->route('bucket-dashboard', ['bucketID' => $bucket->id])
            ->with('success', 'Words added successfully!');
    }

    /**
     * Add words to an existing bucket.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param int $bucketID
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addWords(Request $request, int $bucketID): \Illuminate\Http\RedirectResponse
    {
        $bucket = Bucket::findOrFail($bucketID);

        // Validate the request data
        $validated = $request->validate([
            'words' => 'required|array|min:1',
            'words.*' => 'required|string|max:255',
        ]);

        // Add words to the bucket
        foreach ($validated['words'] as $word) {
            $bucket->words()->create(['word' => $word]);
        }

        return redirect()->route('bucket-dashboard', ['bucketID' => $bucketID])
            ->with('success', 'Words added successfully!');
    }
}
