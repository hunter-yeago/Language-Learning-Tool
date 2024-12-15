<?php

namespace App\Http\Controllers;

use App\Models\WordBucket;
use App\Models\Word;
use Illuminate\Http\Request;

class WordBucketController extends Controller
{
    /**
     * Store a newly created WordBucket in the database.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
        ]);

        // Create the WordBucket
        $wordBucket = WordBucket::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
        ]);

        // Redirect to the 'write-essay' route with a success message
        return redirect()->route('write-essay', ['id' => $wordBucket->id])
                         ->with('success', 'Words added successfully!');
    }

    /**
     * Add words to an existing WordBucket.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function addWords(Request $request, $id)
{
    $wordBucket = WordBucket::findOrFail($id);
    
    // Validate the request data
    $validated = $request->validate([
        'words' => 'required|array|min:1',
        'words.*' => 'required|string|max:255',
    ]);
    
    // Add words to the WordBucket
    foreach ($validated['words'] as $word) {
        $wordBucket->words()->create(['word' => $word]);
    }
    
    // Return an Inertia response
    return back()->with('success', 'Words added successfully!');
}
}
