<?php

namespace App\Http\Controllers;

use App\Http\Requests\GradeEssayRequest;
use App\Http\Requests\StoreEssayRequest;
use App\Models\Essay;
use App\Services\EssayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EssayController extends Controller
{
    protected EssayService $essayService;

    public function __construct(EssayService $essayService)
    {
        $this->essayService = $essayService;
    }

    public function store(StoreEssayRequest $request)
    {
        $validated = $request->validated();

        $this->essayService->storeEssay($validated, Auth::user());

        return redirect()->route('student.dashboard', ['bucketID' => $validated['bucket_id']])
            ->with('success', 'Essay saved and sent to tutor.');
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
