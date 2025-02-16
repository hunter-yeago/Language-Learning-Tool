<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use App\Models\Bucket;
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

        Log::info('Raw request data:', $request->all());

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'bucket_id' => 'required|exists:buckets,id',
                'content' => 'required|string',
                'used_words' => 'array',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'data' => $request->all()
            ]);
            throw $e;
        }

        $essay = Essay::create([
            'title' => $validated['title'],
            'bucket_id' => $validated['bucket_id'],
            'content' => $validated['content'],
            'user_id' => Auth::id(),
        ]);

        // $bucket = Bucket::find($validated['bucket_id']);

        foreach ($validated['used_words'] as $usedWord) {
                
        // Check if there's already an entry in the pivot table (essay_word_join)
            $entry = EssayWordJoin::firstOrCreate([
                'essay_id' => $essay->id,
                'word_id' => $usedWord["id"],
                'status' => "awaiting_approval",
                'used' => true,
            ]);

            $word_bank_entry = BucketWordJoin::firstOrCreate([
                'word_id' => $usedWord["id"],
                'bucket_id' => $validated["bucket_id"],
            ]);
            
            // so this needs to be updated update times_in_word_bank even for not used words.
            // -- this will also sending ALL words along with used words
            // I think I can send one array of words - and then tack on a "used" flag or not
            // to keep the data simple and have only one array and handle all of this
            $word_bank_entry->increment('times_used_in_essay');
            $word_bank_entry->increment('times_in_word_bank');
                
            Log::info('EssayWordJoin entry:', $entry->toArray());
            Log::info('EssayWordJoin word_bank_entry:', $word_bank_entry->toArray());

            // put these on the bucket_word_join -- MAKES WAY more sense. lol.
        }

        // Optionally, redirect to a dashboard or display success message
        // return redirect()->route('bucket-dashboard', ['bucketID' => $bucket->id])
        //     ->with('success', 'Essay created successfully!');
    }

    public function index()
    {
        $essays = Essay::all();

        return Inertia::render('Essays', [
            'essays' => $essays,
        ]);
    }
}
