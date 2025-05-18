<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TutorController extends Controller
{
    public function dashboard()
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
        return redirect()->route('tutor.dashboard');
    }

    public function storeEssayPage(Request $request)
    {
        $essay = $request->input('essay');
        $words = $essay['words'] ?? [];

        session(['tutor_essay' => $essay]);

        return Inertia::render('TutorEssayPage', compact('essay', 'words'));
    }
}
