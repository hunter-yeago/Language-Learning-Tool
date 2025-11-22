<?php

namespace App\Http\Controllers;

use App\Models\bucket;
use App\Models\Word;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\JsonResponse;

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
        foreach ($validated['words'] as $wordText) {
            // Normalize word to lowercase
            $normalizedWord = trim(strtolower($wordText));

            // Find or create the word (prevents duplicates)
            $word = Word::firstOrCreate(['word' => $normalizedWord]);

            // Attach to bucket if not already attached
            if (!$bucket->words()->where('word_id', $word->id)->exists()) {
                $bucket->words()->attach($word->id);
            }
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

    /**
     * Check if a word exists in any of the user's buckets.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkWordExists(Request $request): JsonResponse
    {
        $wordText = $request->input('word');

        if (!$wordText) {
            return response()->json(['exists' => false]);
        }

        // Find the word in the words table (case-insensitive)
        $word = Word::whereRaw('LOWER(word) = ?', [strtolower($wordText)])->first();

        if (!$word) {
            return response()->json(['exists' => false]);
        }

        // Get all buckets that contain this word for the current user
        $buckets = $word->buckets()
            ->where('buckets.user_id', Auth::id())
            ->get(['buckets.id', 'buckets.title']);

        if ($buckets->isEmpty()) {
            return response()->json(['exists' => false]);
        }

        return response()->json([
            'exists' => true,
            'buckets' => $buckets
        ]);
    }

    /**
     * Add a single word to a bucket (used from dictionary page).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function addSingleWord(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'word' => 'required|string|max:255',
            'bucket_id' => 'required|integer|exists:buckets,id',
        ]);

        $bucket = Bucket::findOrFail($validated['bucket_id']);

        // Ensure the user owns this bucket
        if ($bucket->user_id !== Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'You do not have permission to add words to this bucket.'
            ], 403);
        }

        $wordText = $validated['word'];

        // Normalize word to lowercase
        $normalizedWord = trim(strtolower($wordText));

        // Find or create the word (prevents duplicates in words table)
        $word = Word::firstOrCreate(['word' => $normalizedWord]);

        // Check if word already exists in this bucket
        $existsInBucket = $bucket->words()->where('word_id', $word->id)->exists();

        if ($existsInBucket) {
            return response()->json([
                'success' => false,
                'message' => 'This word already exists in the selected bucket.'
            ], 409);
        }

        // Attach the word to the bucket
        $bucket->words()->attach($word->id);

        return response()->json([
            'success' => true,
            'message' => "Word '{$wordText}' added to bucket '{$bucket->title}' successfully!"
        ]);
    }
}
