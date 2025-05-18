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

class EssayController extends Controller
{
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'bucket_id' => 'required|exists:buckets,id',
                'content' => 'required|string',
                'words' => 'array',
                'tutor_id' => 'required|exists:users,id',
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
            'feedback' => '',
            'user_id' => Auth::id(),
            'tutor_id' => $validated['tutor_id'],
            'status' => 'submitted',
        ]);

        foreach ($validated['words'] as $word) {
            $this->attachWordToEssay($essay, $word);
        }

        $essay->tutor?->notify(new EssayAssignedToTutor($essay));

        return redirect()->route('/', ['bucketID' => $validated['bucket_id']])
            ->with('success', 'Essay saved and sent to tutor.');
    }

    private function attachWordToEssay(Essay $essay, array $word)
    {
        $essayWordJoin = EssayWordJoin::firstOrNew([
            'essay_id' => $essay->id,
            'word_id' => $word['id'],
        ]);

        $bucketWordJoinWord = BucketWordJoin::where('bucket_id', $essay->bucket_id)
            ->where('word_id', $word['id'])
            ->first();

        if ($this->shouldUpdateGradeDuringWriteEssay($essayWordJoin->grade)) {
            $essayWordJoin->grade = $bucketWordJoinWord->grade ?? ($word['used'] ? 'used_in_essay' : 'attempted_but_not_used');
        }

        if ($essayWordJoin->isDirty('grade')) {
            $essayWordJoin->save();
        }

        $bucketWordJoin = BucketWordJoin::firstOrCreate([
            'word_id' => $word['id'],
            'bucket_id' => $essay->bucket_id,
        ]);

        if ($this->shouldUpdateGradeDuringWriteEssay($bucketWordJoin->grade)) {
            $bucketWordJoin->grade = $word['used'] ? 'used_in_essay' : 'attempted_but_not_used';
        }

        if ($bucketWordJoin->isDirty('grade')) {
            $bucketWordJoin->increment('times_used_in_essay');
            $bucketWordJoin->increment('times_in_word_bank');
            $bucketWordJoin->save();
        }
    }

    private function shouldUpdateGradeDuringWriteEssay($previousGrade): bool
    {
        return !in_array($previousGrade, ['correct', 'partially_correct', 'incorrect', 'used_in_essay']);
    }

    private function shouldUpdateGrade(?string $previousGrade, ?string $newGrade): bool
    {
        return (
            in_array($previousGrade, ['used_in_essay', 'correct', 'incorrect', 'partially_correct']) &&
            !in_array($newGrade, ['used_in_essay', 'attempted_but_not_used'])
        );
    }

    public function index()
    {
        return Inertia::render('Essays', [
            'essays' => Essay::all(),
        ]);
    }

    public function tutorIndex()
    {
        $tutorId = Auth::id();
        $essays = Essay::where('tutor_id', $tutorId)
            ->whereIn('status', ['submitted', 'under_review'])
            ->get();

        return Inertia::render('TutorEssays', [
            'essays' => $essays,
        ]);
    }

    public function gradeEssay(Request $request)
    {

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

        $essay = Essay::findOrFail($validated['essay_id']);
        $essay->feedback = $validated['feedback'];
        $essay->status = 'graded';
        $essay->save();

        foreach ($validated['words'] as $word) {
            $this->updateWordGrades($essay, $word);
        }

        return redirect()->route('tutor.dashboard')->with('success', 'Essay graded!');
    }

    private function updateWordGrades(Essay $essay, array $word)
    {
        $bucketWordJoin = BucketWordJoin::where('bucket_id', $essay->bucket_id)
            ->where('word_id', $word['id'])
            ->first();

        if ($this->shouldUpdateGrade($bucketWordJoin->grade, $word['pivot']['grade'])) {
            $bucketWordJoin->grade = $word['pivot']['grade'];
        }

        if ($word['pivot']['comment']) {
            $bucketWordJoin->comment = $word['pivot']['comment'];
        }

        if ($bucketWordJoin->isDirty('grade') || $bucketWordJoin->isDirty('comment')) {
            $bucketWordJoin->save();
        }

        $essayWordJoin = EssayWordJoin::where('essay_id', $essay->id)
            ->where('word_id', $word['id'])
            ->first();

        if ($this->shouldUpdateGrade($essayWordJoin->grade, $word['pivot']['grade'])) {
            $essayWordJoin->grade = $word['pivot']['grade'];
        }

        if ($word['pivot']['comment']) {
            $essayWordJoin->comment = $word['pivot']['comment'];
        }

        if ($essayWordJoin->isDirty('grade') || $essayWordJoin->isDirty('comment')) {
            $essayWordJoin->save();
        }
    }

    public function updateStatus(Request $request, $id)
    {
        $validated = $request->validate([
            'status' => 'required|in:under_review,graded,returned',
        ]);

        $essay = Essay::findOrFail($id);

        if ($essay->tutor_id !== Auth::id()) {
            return redirect()->route('tutor.essays.index')->with('error', 'You are not authorized to edit this essay.');
        }

        $essay->status = $validated['status'];
        $essay->save();

        return redirect()->route('tutor.essays.index')->with('success', 'Essay status updated.');
    }
}