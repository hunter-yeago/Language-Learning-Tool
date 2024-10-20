<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WordBucket;
use Illuminate\Container\Attributes\Log;

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

            // Log the validated data for debugging
            // Log::info('Validated data:', $validated);

        // dd($validated['words']);
        
        // Save the Word Bucket
        WordBucket::create([
            'title' => $validated['title'],
            'words' => json_encode($validated['words']), // Convert the array to JSON
        ]);


        // return redirect()->route('wordbuckets')->with('success', 'Word Bucket created!');
    }
}
