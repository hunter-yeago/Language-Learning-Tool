<?php

namespace App\Http\Controllers;

use App\Models\Essay;
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

        // TODO bucket dashboard 

        // - clicking on a word shows you more information
        // dictionary data
        // essays its been used in
        // Comments from the essays
        // maybe I can even grab the 30 charachters before and after where it was used
            // in that essay
        // bucket dashboard - style up the essays a bit with some more data

        // TODO student-tutor relationship
        // Essay Status - Graded / Sent to Tutor / Not Sent to Tutor
        //TODO - Tutor Review / Student Essay
        // the student essay will likely look pretty similar to the current tutor review page
        // tutor review - actually send the data. confirm that word bucket data is updated.
        // build a system of - you have a new esasy that's been reviewed by your tutor!
        
        // TODO create system for an essay -
        // essay - (send to nobody)
        // essay - send to tutor immediately
        // essay - share it online
        // When the essays get their own dedicated page
        // it will be easier to think about how I can manage
        // or implement the ability to be given feedback 
        // on a single essay from multiple people.

        // same problem when adding new words
        // BUG - if you write a second essay. and some words have already been used
        // but you don't use them in the second essay... now they are unused!
        // check to see if it's already been set or is "not_attempted" or whatever
        // or maybe I need to check to see if its the same grade.
        // well there's used / unused.
        // yeah. I mean... so there's words that are used or unused
        // and then they have a grade
        // so basically I only want to go from not_attempted to 
        // attempted_but_not_used or attempted_and_used
        // or attmpted_but_not_used to attmpted_and_used
        // problem: right now 
        // it only can go up -- 
        // not_attempted => attempted_and_used
        // not_attempted => attempted_but_not_used
        // or attempted_but_not_used => attempted_and_used

        // Log::info('Raw request data:', $request->all());

        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'bucket_id' => 'required|exists:buckets,id',
                'content' => 'required|string',
                'used_words' => 'array',
                'not_used_words' => 'array',
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

        foreach ($validated['used_words'] as $word) {
                
            EssayWordJoin::updateOrInsert(
            
                // find the record
            [
                'essay_id' => $essay->id,
                'word_id' => $word["id"],
            ],
            
            // update it
            ['grade' => 'used_in_essay']);


            $word_bank_entry = BucketWordJoin::updateOrInsert(
                
                // find record
                [
                    'word_id' => $word["id"],
                    'bucket_id' => $validated["bucket_id"],
                ],
                
                // update it
                ['grade' => 'used_in_essay']
            );
            
            // so this needs to be updated update times_in_word_bank even for not used words.
            // -- this will also sending ALL words along with used words
            // I think I can send one array of words - and then tack on a "used" flag or not
            // to keep the data simple and have only one array and handle all of this
            $word_bank_entry->increment('times_used_in_essay');
            $word_bank_entry->increment('times_in_word_bank');
                
            // Log::info('EssayWordJoin entry:', $entry->toArray());
            // Log::info('EssayWordJoin word_bank_entry:', $word_bank_entry->toArray());

            // put these on the bucket_word_join -- MAKES WAY more sense. lol.
        }
        foreach ($validated['not_used_words'] as $word) {
                
        // Check if there's already an entry in the pivot table (essay_word_join)
            EssayWordJoin::updateOrInsert(
            
            // find the record
            [
                'essay_id' => $essay->id,
                'word_id' => $word["id"],
            ],
            
            // update it
            ['grade' => 'attempted_but_not_used']);


            $word_bank_entry = BucketWordJoin::updateOrInsert(
                
                // find record
                [
                    'word_id' => $word["id"],
                    'bucket_id' => $validated["bucket_id"],
                ],
                
                // update it
                ['grade' => 'attempted_but_not_used']
            );
            
            $word_bank_entry->increment('times_used_in_essay');
            $word_bank_entry->increment('times_in_word_bank');
        }

        // Optionally, redirect to a dashboard or display success message
        // return redirect()->route('/', ['bucketID' => $bucket->id])
        //     ->with('success', 'Essay created successfully!');
        return redirect()->route('/', ['bucketID' => $validated['bucket_id']])
            ->with('success', 'Essay saved');
    }

    public function index()
    {
        $essays = Essay::all();

        return Inertia::render('Essays', [
            'essays' => $essays,
        ]);
    }
}
