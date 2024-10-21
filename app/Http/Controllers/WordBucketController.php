<?php

namespace App\Http\Controllers;

use App\Models\WordBucket;
use App\Models\Word;
use Illuminate\Http\Request;

class WordBucketController extends Controller
{
    public function store(Request $request)
    {
        // Validate the request data
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'words' => 'required|array|min:1',
            'words.*' => 'required|string|max:255',
        ]);

        // Create the WordBucket
        $wordBucket = WordBucket::create(['title' => $validated['title']]);

        // Create associated words and link them to the WordBucket
        foreach ($validated['words'] as $word) {
            $wordBucket->words()->create(['word' => $word]);
        }

        return redirect()->route('write-essay')->with('success', 'Word Bucket created!');
    }
}
