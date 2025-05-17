<?php

namespace App\Http\Controllers;

use App\Models\Bucket;
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
            'feedback' => '',
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
                if ($this->shouldUpdateGradeDuringWriteEssay($essayWordJoin->grade)) {
                    $essayWordJoin->grade = 'used_in_essay'; // or 'attempted_but_not_used' in second loop
                }
            // Ensure only update if the grade has changed
            // if ($essayWordJoin->isDirty('grade')) {
                $essayWordJoin->save();
            // }

            // BucketWordJoin
            $bucketWordJoin = BucketWordJoin::firstOrCreate([
                'word_id' => $word["id"],
                'bucket_id' => $validated["bucket_id"],
            ]);
            // if ($this->shouldUpdateGradeDuringWriteEssay($bucketWordJoin->grade, 'used_in_essay')) {
                if ($this->shouldUpdateGradeDuringWriteEssay($bucketWordJoin->grade)) {
                    $bucketWordJoin->grade = 'used_in_essay'; // or 'attempted_but_not_used'
                }
            // }
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
            
            if ($this->shouldUpdateGradeDuringWriteEssay($essayWordJoin->grade)) {
                $essayWordJoin->grade = 'attempted_but_not_used'; // or 'attempted_but_not_used' in second loop
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

            if ($this->shouldUpdateGradeDuringWriteEssay($bucketWordJoin->grade)) {
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

    private function shouldUpdateGradeDuringWriteEssay($previous_grade): bool {

        if ($previous_grade === "correct" || $previous_grade === "partially_correct" || $previous_grade === "incorrect" || $previous_grade === "used_in_essay") {
            return false;
        } else {
            return true;
        }

    }

    private function shouldUpdateGrade(?string $previous_grade): bool
    {
        // temporarily not updating grade here so that they don't get overriden
        if ($previous_grade === "used_in_essay") { 
            return true; 
        }

        return false;

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

    // dd('GRADE ESSAY REQUEST:', $request->all());

        try {
            $validated = $request->validate([
            'essay_id' => 'required',
            'words' => 'required',
            'feedback' => 'required',
        ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Validation failed:', [
                'errors' => $e->errors(),
                'data' => $request->all()
            ]);
            throw $e;
        }
        
        // Update Essay
        $essay = Essay::findOrFail($request->essay_id);
        $essay->feedback = $validated['feedback'];
        $essay->status = "graded";
        $essay->save();

        // update bucket
        $bucket = Bucket::findOrFail($essay->bucket_id);
        
        // update word grades
        foreach($validated['words'] as $word) {

            // Bucket

            $bucketWordJoin = BucketWordJoin::
                where('bucket_id', (int) ($essay->bucket_id))
                ->where('word_id', (int) $word['id'])
                ->first();

          if (isset($word['pivot']['grade']) && $this->shouldUpdateGrade($bucketWordJoin->grade)) {
                $bucketWordJoin->grade = $word['pivot']['grade'];
            }


            // update only if comment is not null
            if ($word['pivot']['comment']) {
                $bucketWordJoin->comment = $word['pivot']['comment'];
            }

            // Ensure only update if the grade has changed
            if ($bucketWordJoin->isDirty('grade') || $bucketWordJoin->isDirty('comment')) {
                $bucketWordJoin->save();
            }

            
            // Essay

            $essayWordJoin = EssayWordJoin::
                where('essay_id', (int) $validated['essay_id'])
                ->where('word_id', (int) $word['id'])
                ->first();

            if (
    isset($word['pivot']['grade']) &&
    $this->shouldUpdateGrade($essayWordJoin->grade)
) {
    $essayWordJoin->grade = $word['pivot']['grade'];
}


            // update only if comment is not null
            if ($word['pivot']['comment']) {
                $essayWordJoin->comment = $word['pivot']['comment'];
            }

            // Ensure only update if the grade has changed
            if ($essayWordJoin->isDirty('grade') || $essayWordJoin->isDirty('comment')) {
                $essayWordJoin->save();
            }
        }

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
