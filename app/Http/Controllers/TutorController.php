<?php

namespace App\Http\Controllers;

use App\Http\Requests\GradeEssayRequest;
use App\Models\Essay;
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

        $essay = Essay::with('words')->find($essay_id);

        if (!$essay) {
            return redirect()->route('/')->with('error', 'Essay not found');
        }

        return Inertia::render('TutorEssayPage', [
            'essay' => $essay,
        ]);
    }

}
