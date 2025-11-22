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

        return redirect()->route('/', ['bucketID' => $validated['bucket_id']])
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

    /**
     * Update essay visibility settings
     */
    public function updateVisibility(Request $request, $id)
    {
        $validated = $request->validate([
            'visibility_type' => 'required|in:private,public,unlisted',
            'allow_anonymous' => 'nullable|boolean',
            'expires_in_days' => 'nullable|integer|min:1|max:365',
        ]);

        $essay = Essay::findOrFail($id);

        // Verify user owns this essay
        if ($essay->user_id !== Auth::id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $visibility = $essay->visibility;

        // Create visibility record if it doesn't exist
        if (!$visibility) {
            $visibility = \App\Models\EssayVisibility::create([
                'essay_id' => $essay->id,
                'visibility_type' => 'private',
                'public_url_token' => \Illuminate\Support\Str::random(32),
                'allow_anonymous' => false,
            ]);
        }

        // Update visibility type
        switch ($validated['visibility_type']) {
            case 'public':
                $visibility->makePublic();
                break;
            case 'unlisted':
                $visibility->makeUnlisted();
                break;
            case 'private':
                $visibility->makePrivate();
                break;
        }

        // Update allow_anonymous if provided
        if (isset($validated['allow_anonymous'])) {
            $visibility->update(['allow_anonymous' => $validated['allow_anonymous']]);
        }

        // Set expiration if provided
        if (isset($validated['expires_in_days'])) {
            $visibility->setExpiration($validated['expires_in_days']);
        }

        return response()->json([
            'message' => 'Visibility settings updated',
            'visibility' => $visibility->fresh(),
            'public_url' => $visibility->getPublicUrl(),
        ]);
    }

    /**
     * Get public essay by token
     */
    public function showPublic($token)
    {
        $visibility = \App\Models\EssayVisibility::where('public_url_token', $token)->first();

        if (!$visibility || !$visibility->isAccessible()) {
            abort(404, 'Essay not found or no longer available');
        }

        $essay = $visibility->essay()->with(['words', 'user:id,name'])->first();

        return Inertia::render('PublicEssayView', [
            'essay' => $essay,
            'visibility' => $visibility,
            'canReview' => $visibility->allow_anonymous,
        ]);
    }
}
