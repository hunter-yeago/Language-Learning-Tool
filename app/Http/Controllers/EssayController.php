<?php
// app/Http/Controllers/EssayController.php

namespace App\Http\Controllers;

use App\Models\Essay;
use App\Models\Bucket;
use App\Models\Word; // Assuming Word is a separate model for your words
use App\Models\EssayWordJoin; // This is the pivot table model
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class EssayController extends Controller
{
    public function store(Request $request)
    {
        // Validate the incoming data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'bucket_id' => 'required|exists:buckets,id',  // Ensure the bucket exists
            'content' => 'required|string',  // Ensure essay content is provided
            'used_words' => 'required|array',  // Array of used words
        ]);

        // Create the essay record in the database
        $essay = Essay::create([
            'title' => $validated['title'],
            'content' => $validated['content'],
            'user_id' => Auth::id(),  // Assuming the user is authenticated
            'bucket_id' => $validated['bucket_id'],  // Associate with the correct bucket
        ]);

        // dd($essay);
        // echo 'the essay: ';
        print_r($essay);

        // Get the bucket and its words
        $bucket = Bucket::find($validated['bucket_id']);
        $usedWords = $validated['used_words'];  // Array of words used in the essay

        // Loop through the used words to update the `essay_word_join` table
        foreach ($usedWords as $usedWord) {
            $word = Word::find($usedWord);  // Find the word by its ID
            
            // Ensure the word exists before proceeding
            if ($word) {
                // Check if there's already an entry in the pivot table (essay_word_join)
                $entry = EssayWordJoin::firstOrCreate([
                    'essay_id' => $essay->id,
                    'word_id' => $word->id,
                ]);
                
                // Increment the 'times_used' and 'attempts'
                $entry->increment('times_used');
                $entry->increment('attempts');
            }
        }

        // Optionally, redirect to a dashboard or display success message
        return redirect()->route('bucket-dashboard', ['bucketID' => $bucket->id])
            ->with('success', 'Essay created successfully!');
    }

    public function index()
    {
        // Fetch all essays from the database
        $essays = Essay::all();

        // Return the data using Inertia
        return Inertia::render('Essays', [
            'essays' => $essays,
        ]);
    }
}
