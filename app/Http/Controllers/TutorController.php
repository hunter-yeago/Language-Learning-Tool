<?php

namespace App\Http\Controllers;

use App\Http\Requests\GradeEssayRequest;
use App\Models\Essay;
use App\Models\User;
use App\Models\Bucket;
use App\Services\EssayService;
use App\Services\ReviewService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TutorController extends Controller
{

    protected EssayService $essayService;
    protected ReviewService $reviewService;

    public function __construct(EssayService $essayService, ReviewService $reviewService)
    {
        $this->essayService = $essayService;
        $this->reviewService = $reviewService;
    }
    
    public function index()
    {
        $essays = Essay::where('tutor_id', Auth::id())
            ->where('status', 'submitted')
            ->with('words')
            ->get();

        return Inertia::render('TutorDashboardPage', compact('essays'));
    }

    public function update_essay(GradeEssayRequest $request)
    {
        $validated = $request->validated();
        $essay = Essay::findOrFail($validated['essay_id']);

        // Find or create review session for this tutor
        $review = $essay->reviews()
            ->where('reviewer_id', Auth::id())
            ->where('reviewer_type', 'tutor')
            ->first();

        if (!$review) {
            $review = $this->reviewService->createReview(
                $essay,
                Auth::id(),
                'tutor'
            );
        }

        // Transform words data to match ReviewService format
        $wordGrades = [];
        foreach ($validated['words'] as $word) {
            $wordGrades[] = [
                'word_id' => $word['id'],
                'grade' => $word['pivot']['grade'],
                'comment' => $word['pivot']['comment'] ?? null,
            ];
        }

        // Submit the review (triggers consensus calculation)
        $this->reviewService->submitReview(
            $review,
            $wordGrades,
            $validated['feedback']
        );

        // Try to auto-approve if consensus is strong enough
        $autoApproved = $this->reviewService->autoApproveIfPossible($essay);

        $message = $autoApproved
            ? 'Essay graded and approved!'
            : 'Essay graded! Student will review the feedback.';

        return redirect()->route('/')->with('success', $message);
    }

    public function grade_essay(Request $request)
    {
        $essay_id = $request->input('essay_id');

        if (!$essay_id || !isset($essay_id)) {
            return redirect()->route('/');
        }

        $essay = Essay::with(['words', 'bucket.words'])->find($essay_id);

        if (!$essay) {
            return redirect()->route('/')->with('error', 'Essay not found');
        }

        // Add previous grades from bucket to essay words
        if ($essay->bucket) {
            $bucketWordGrades = $essay->bucket->words->pluck('pivot.grade', 'id');

            $essay->words->each(function ($word) use ($bucketWordGrades) {
                $word->previous_grade = $bucketWordGrades->get($word->id);
            });
        }

        return Inertia::render('TutorEssayPage', [
            'essay' => $essay,
        ]);
    }

    public function students(Request $request)
    {
        $tutor = Auth::user();

        // Get connected students from the student_tutor pivot table
        $students = $tutor->students()
            ->get()
            ->map(function ($student) use ($tutor) {
                // Get all buckets for this student
                $buckets = Bucket::where('user_id', $student->id)
                    ->with('words')
                    ->get();

                // Get essays for this student assigned to this tutor
                $essays = Essay::where('user_id', $student->id)
                    ->where('tutor_id', $tutor->id)
                    ->get();

                return [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'buckets' => $buckets,
                    'essays' => $essays,
                    'total_essays' => $essays->count(),
                    'graded_essays' => $essays->where('status', 'graded')->count(),
                ];
            });

        return Inertia::render('TutorStudentsPage', [
            'students' => $students,
            'student_id' => $request->input('student_id'),
        ]);
    }

    public function viewEssay(Request $request)
    {
        $essay_id = $request->input('essay_id');
        $student_id = $request->input('student_id');

        if (!$essay_id) {
            return redirect()->route('tutor.students');
        }

        $essay = Essay::with('words')->find($essay_id);

        if (!$essay) {
            return redirect()->route('tutor.students')->with('error', 'Essay not found');
        }

        // Verify the essay belongs to this tutor
        if ($essay->tutor_id !== Auth::id()) {
            return redirect()->route('tutor.students')->with('error', 'Unauthorized');
        }

        return Inertia::render('TutorEssayViewPage', [
            'essay' => $essay,
            'student_id' => $student_id,
        ]);
    }

}
