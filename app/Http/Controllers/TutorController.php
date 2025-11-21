<?php

namespace App\Http\Controllers;

use App\Http\Requests\GradeEssayRequest;
use App\Models\Essay;
use App\Models\User;
use App\Models\Bucket;
use App\Services\EssayService;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TutorController extends Controller
{
    
    protected EssayService $essayService;

    public function __construct(EssayService $essayService)
    {
        $this->essayService = $essayService;
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

        // Debug: Log all incoming data
        \Log::info('=== Update Essay Debug ===');
        \Log::info('Essay ID: ' . $validated['essay_id']);
        \Log::info('Feedback: ' . $validated['feedback']);
        \Log::info('Words count: ' . count($validated['words']));
        \Log::info('Words data: ', $validated['words']);
        \Log::info('Raw request data: ', $request->all());

        $this->essayService->update_essay(
            Essay::findOrFail($validated['essay_id']),
            $validated['words'],
            $validated['feedback']
        );

        return redirect()->route('/')->with('success', 'Essay graded!');
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
        $tutorId = Auth::id();

        // Get all unique students who have submitted essays to this tutor
        $studentIds = Essay::where('tutor_id', $tutorId)
            ->pluck('user_id')
            ->unique();

        $students = User::whereIn('id', $studentIds)
            ->with(['essays' => function ($query) use ($tutorId) {
                $query->where('tutor_id', $tutorId);
            }])
            ->get()
            ->map(function ($student) use ($tutorId) {
                // Get all buckets for this student
                $buckets = Bucket::where('user_id', $student->id)
                    ->with('words')
                    ->get();

                // Get essays for this student assigned to this tutor
                $essays = Essay::where('user_id', $student->id)
                    ->where('tutor_id', $tutorId)
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
