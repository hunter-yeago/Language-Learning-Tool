<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TutorController extends Controller
{
    public function index()
    {
        $essays = Essay::where('tutor_id', Auth::id())
            ->where('status', 'submitted')
            ->with('words')
            ->get();

        return Inertia::render('TutorDashboardPage', compact('essays'));
    }

    public function showEssayPage()
    {
        // If GET is unnecessary, consider removing this route
        return redirect()->route('tutor.tutor-dashboard');
    }

    public function startEssayReview(Request $request)
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
