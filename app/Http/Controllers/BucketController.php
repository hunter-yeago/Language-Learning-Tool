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
            'bucket.title' => 'required|string|max:255',
            'bucket.description' => 'nullable|string|max:500',
        ]);

        $bucket = Bucket::create([
            'title' => $validated['bucket']['title'],
            'description' => $validated['bucket']['description'] ?? "",
            'user_id' => Auth::id(),
        ]);

        return redirect()->route('/', ['bucketID' => $bucket->id])
            ->with('success', 'Bucket created successfully!');
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

        return redirect()->route('/', ['bucketID' => $bucketID])
            ->with('success', 'Words added successfully!');
    }

    /**
     * Delete a bucket and all associated data.
     *
     * @param int $bucket_id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(int $bucket_id): \Illuminate\Http\RedirectResponse
    {
        $bucket = Bucket::findOrFail($bucket_id);

        // Ensure the user owns this bucket
        if ($bucket->user_id !== Auth::id()) {
            return redirect()->route('/')
                ->with('error', 'You do not have permission to delete this bucket.');
        }

        $bucketTitle = $bucket->title;

        // Delete the bucket (cascade will handle related records)
        $bucket->delete();

        return redirect()->route('/')
            ->with('success', "Bucket '{$bucketTitle}' has been deleted successfully.");
    }
}
