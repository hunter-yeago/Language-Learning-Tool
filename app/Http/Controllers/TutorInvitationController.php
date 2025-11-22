<?php

namespace App\Http\Controllers;

use App\Models\TutorInvitation;
use App\Models\User;
use App\Notifications\InvitationRejected;
use App\Notifications\TutorInvitationSent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class TutorInvitationController extends Controller
{
    /**
     * Send an invitation to a student
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email',
        ]);

        $tutor = Auth::user();
        $email = $validated['email'];

        // Check if user with this email exists
        $student = User::where('email', $email)->first();

        if (!$student) {
            throw ValidationException::withMessages([
                'email' => ['No user found with this email address.'],
            ]);
        }

        // Check if student has student role
        if (!$student->hasRole('student')) {
            throw ValidationException::withMessages([
                'email' => ['This user is not a student.'],
            ]);
        }

        // Check if already connected
        if ($tutor->students()->where('student_id', $student->id)->exists()) {
            throw ValidationException::withMessages([
                'email' => ['You are already connected with this student.'],
            ]);
        }

        // Check if there's already a pending invitation
        $existingInvitation = TutorInvitation::where('tutor_id', $tutor->id)
            ->where('email', $email)
            ->where('status', 'pending')
            ->first();

        if ($existingInvitation && $existingInvitation->isPending()) {
            throw ValidationException::withMessages([
                'email' => ['You already have a pending invitation to this student.'],
            ]);
        }

        // If there's an old accepted/rejected invitation, update it to pending with new token
        $oldInvitation = TutorInvitation::where('tutor_id', $tutor->id)
            ->where('email', $email)
            ->whereIn('status', ['accepted', 'rejected', 'cancelled'])
            ->first();

        if ($oldInvitation) {
            // Reuse the old invitation by resetting it
            $oldInvitation->update([
                'token' => Str::random(32),
                'status' => 'pending',
                'expires_at' => now()->addDays(14),
            ]);
            $invitation = $oldInvitation;
        } else {
            // Create new invitation
            $invitation = TutorInvitation::create([
                'tutor_id' => $tutor->id,
                'email' => $email,
                'token' => Str::random(32),
                'status' => 'pending',
                'expires_at' => now()->addDays(14),
            ]);
        }

        // Send notification to student
        $student->notify(new TutorInvitationSent($invitation));

        return redirect()->back()->with('success', 'Invitation sent successfully!');
    }

    /**
     * Accept an invitation
     */
    public function accept(Request $request, string $token)
    {
        $invitation = TutorInvitation::where('token', $token)->firstOrFail();

        // Validate invitation
        if (!$invitation->isPending()) {
            return redirect()->route('profile')->with('error', 'This invitation is no longer valid.');
        }

        $student = Auth::user();

        // Verify email matches
        if ($student->email !== $invitation->email) {
            return redirect()->route('profile')->with('error', 'This invitation was not sent to your email address.');
        }

        // Create the connection
        $invitation->tutor->students()->attach($student->id);

        // Mark invitation as accepted
        $invitation->markAsAccepted();

        return redirect()->route('profile')->with('success', 'You are now connected with ' . $invitation->tutor->name . '!');
    }

    /**
     * Reject an invitation
     */
    public function reject(Request $request, string $token)
    {
        $invitation = TutorInvitation::where('token', $token)->firstOrFail();

        // Validate invitation
        if (!$invitation->isPending()) {
            return redirect()->route('profile')->with('error', 'This invitation is no longer valid.');
        }

        $student = Auth::user();

        // Verify email matches
        if ($student->email !== $invitation->email) {
            return redirect()->route('profile')->with('error', 'This invitation was not sent to your email address.');
        }

        // Mark invitation as rejected
        $invitation->markAsRejected();

        // Notify the tutor
        $invitation->tutor->notify(new InvitationRejected($student));

        return redirect()->route('profile')->with('success', 'Invitation rejected.');
    }

    /**
     * Cancel a pending invitation (tutor action)
     */
    public function cancel(Request $request, int $id)
    {
        $invitation = TutorInvitation::findOrFail($id);

        // Ensure the authenticated tutor owns this invitation
        if ($invitation->tutor_id !== Auth::id()) {
            abort(403, 'Unauthorized action.');
        }

        // Mark invitation as cancelled
        $invitation->markAsCancelled();

        return redirect()->route('profile')->with('success', 'Invitation cancelled.');
    }
}
