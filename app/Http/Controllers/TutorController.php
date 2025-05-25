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
        // dd($validated);

        $this->essayService->update_essay(
            Essay::findOrFail($validated['essay_id']),
            $validated['words'],
            $validated['feedback']
        );

        return redirect()->route('tutor.tutor-dashboard')->with('success', 'Essay graded!');
    }

    public function grade_essay(Request $request)
    {
        $essay_id = $request->input('essay_id');

        if (!$essay_id || !isset($essay_id)) {
            return redirect()->route('tutor.tutor-dashboard');
        }

        $essay = Essay::with('words')->find($essay_id);

        if (!$essay) {
            return redirect()->route('tutor.tutor-dashboard')->with('error', 'Essay not found');
        }

        return Inertia::render('TutorEssayPage', [
            'essay' => $essay,
            'words' => $essay->words,
        ]);
    }

}
