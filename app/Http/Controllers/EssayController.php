<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use App\Models\BucketWordJoin;
use App\Models\EssayWordJoin;
use App\Notifications\EssayAssignedToTutor;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;

class EssayController extends Controller
{
    public function store(Request $request)
    {
        
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'bucket_id' => 'required|exists:buckets,id',
                'content' => 'required|string',
                'used_words' => 'array',
                'not_used_words' => 'array',
                'tutor_id' => 'required|exists:users,id', // Validate tutor assignment
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'data' => $request->all()
            ]);
            throw $e;
        }

        // Create the essay
        $essay = Essay::create([
            'title' => $validated['title'],
            'bucket_id' => $validated['bucket_id'],
            'content' => $validated['content'],
            'user_id' => Auth::id(),
            'tutor_id' => $validated['tutor_id'],  // Assign tutor to essay
            'status' => 'submitted',  // Set the initial status to 'submitted'
        ]);

        

        // Attach used words to the essay
        foreach ($validated['used_words'] as $word) {
            // EssayWordJoin
            $essayWordJoin = EssayWordJoin::firstOrNew([
                'essay_id' => $essay->id,
                'word_id' => $word["id"],
            ]);
            if ($this->shouldUpdateGrade($essayWordJoin->grade, 'used_in_essay')) {
                $essayWordJoin->grade = 'used_in_essay';
            }
            // Ensure only update if the grade has changed
            if ($essayWordJoin->isDirty('grade')) {
                $essayWordJoin->save();
            }

            // BucketWordJoin
            $bucketWordJoin = BucketWordJoin::firstOrCreate([
                'word_id' => $word["id"],
                'bucket_id' => $validated["bucket_id"],
            ]);
            if ($this->shouldUpdateGrade($bucketWordJoin->grade, 'used_in_essay')) {
                $bucketWordJoin->grade = 'used_in_essay';
            }
            // Ensure only update if the grade has changed
            if ($bucketWordJoin->isDirty('grade')) {
                $bucketWordJoin->increment('times_used_in_essay');
                $bucketWordJoin->increment('times_in_word_bank');
                $bucketWordJoin->save();
            }
        }

        // Attach not used words to the essay
        foreach ($validated['not_used_words'] as $word) {
            // EssayWordJoin
            $essayWordJoin = EssayWordJoin::firstOrNew([
                'essay_id' => $essay->id,
                'word_id' => $word["id"],
            ]);
            if ($this->shouldUpdateGrade($essayWordJoin->grade, 'attempted_but_not_used')) {
                $essayWordJoin->grade = 'attempted_but_not_used';
            }
            // Ensure only update if the grade has changed
            if ($essayWordJoin->isDirty('grade')) {
                $essayWordJoin->save();
            }

            // BucketWordJoin
            $bucketWordJoin = BucketWordJoin::firstOrCreate([
                'word_id' => $word["id"],
                'bucket_id' => $validated["bucket_id"],
            ]);
            if ($this->shouldUpdateGrade($bucketWordJoin->grade, 'attempted_but_not_used')) {
                $bucketWordJoin->grade = 'attempted_but_not_used';
            }
            // Ensure only update if the grade has changed
            if ($bucketWordJoin->isDirty('grade')) {
                $bucketWordJoin->increment('times_used_in_essay');
                $bucketWordJoin->increment('times_in_word_bank');
                $bucketWordJoin->save();
            }
        }

        // Send notification to the tutor (send after essay is created)
        $tutor = $essay->tutor; // Get the tutor assigned to the essay

        if ($tutor) {
            $tutor->notify(new EssayAssignedToTutor($essay)); // Send the notification
        } else {
            Log::warning('Tutor not found for essay: ' . $essay->id);
        }



        return redirect()->route('/', ['bucketID' => $validated['bucket_id']])
                ->with('success', 'Essay saved and sent to tutor.');
    }



    private function shouldUpdateGrade(?string $existing, string $new): bool
    {
        $transitions = [
            'not_attempted' => ['attempted_but_not_used', 'used_in_essay'],
            'attempted_but_not_used' => ['used_in_essay'],
            null => ['attempted_but_not_used', 'used_in_essay'], // no grade yet
        ];

        return in_array($new, $transitions[$existing] ?? []);
    }

    public function index()
    {
        $essays = Essay::all();

        return Inertia::render('Essays', [
            'essays' => $essays,
        ]);
    }

    public function tutorIndex()
    {
        $tutorId = Auth::id(); // Assuming the tutor is logged in

        $essays = Essay::where('tutor_id', $tutorId)
            ->whereIn('status', ['submitted', 'under_review']) // Show only essays that need reviewing
            ->get();

        return Inertia::render('TutorEssays', [
            'essays' => $essays,
        ]);
    }

    public function gradeEssay(Request $request) {

        // dd($request->words);

        try {
            $validated = $request->validate([
            'essay_id' => 'required',
            'words' => 'required',
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'data' => $request->all()
            ]);
            throw $e;
        }

        // dd($validated['words']);
        
        // update word grades
        foreach($validated['words'] as $word) {

            $essayWordJoin = EssayWordJoin::
                where('essay_id', $validated['essay_id'])
                ->where('word_id', $word['id'])
                ->first();

                // it seeems like its creating a new entry in the essay word join rather than
                // updating the current one

            // is this firing?
            // if ($this->shouldUpdateGrade($essayWordJoin->grade, 'used_in_essay')) {
                $essayWordJoin->grade = $word['pivot']['grade'];
            // }

            // update only if comment is not null
            if ($word['pivot']['comment']) {
                $essayWordJoin->comment = $word['pivot']['comment'];
            }

            // Ensure only update if the grade has changed
            if ($essayWordJoin->isDirty('grade') || $essayWordJoin->isDirty('comment')) {
                $essayWordJoin->save();
            }
        }

        $essay = Essay::findOrFail($request->essay_id);
        $essay->status = "graded";
        $essay->save();

        return redirect()->route('tutor-dashboard')->with('success', 'Essay graded!');
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:under_review,graded,returned',
        ]);

        $essay = Essay::findOrFail($id);

        // Ensure the tutor can only update essays assigned to them
        if ($essay->tutor_id !== Auth::id()) {
            return redirect()->route('tutor.essays.index')->with('error', 'You are not authorized to edit this essay.');
        }

        $essay->status = $validated['status'];
        $essay->save();

        return redirect()->route('tutor.essays.index')->with('success', 'Essay status updated.');
    }
}
