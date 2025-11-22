<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use App\Models\Essay;
use App\Models\TutorInvitation;
use App\Notifications\StudentDisconnected;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile page with connections
     */
    public function index(Request $request): Response
    {
        $user = $request->user();
        $data = [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => session('status'),
        ];

        if ($user->hasRole('tutor')) {
            // Load students and pending invitations for tutors
            $data['students'] = $user->students()->get();
            $data['pendingInvitations'] = TutorInvitation::where('tutor_id', $user->id)
                ->where('status', 'pending')
                ->with('tutor')
                ->get();
            // Load unread notifications
            $data['notifications'] = $user->unreadNotifications;
        }

        if ($user->hasRole('student')) {
            // Load tutors and pending invitations for students
            $data['tutors'] = $user->tutors()->get();
            $data['pendingInvitations'] = TutorInvitation::where('email', $user->email)
                ->where('status', 'pending')
                ->with('tutor')
                ->get();
            // Load unread notifications
            $data['notifications'] = $user->unreadNotifications;
        }

        return Inertia::render('Profile/ProfilePage', $data);
    }

    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Disconnect from a student (tutor action)
     */
    public function disconnectStudent(Request $request, int $studentId): RedirectResponse
    {
        $tutor = $request->user();

        // Verify the tutor is connected to this student
        if (!$tutor->students()->where('student_id', $studentId)->exists()) {
            return Redirect::route('profile')->with('error', 'You are not connected to this student.');
        }

        // Return any essays that are waiting to be graded to draft status
        Essay::where('tutor_id', $tutor->id)
            ->where('user_id', $studentId)
            ->whereIn('status', ['submitted', 'under_review'])
            ->each(function ($essay) {
                $essay->returnToDraft();
            });

        // Remove the connection
        $tutor->students()->detach($studentId);

        // Notify the student
        $student = \App\Models\User::find($studentId);
        if ($student) {
            $student->notify(new StudentDisconnected($tutor));
        }

        return Redirect::route('profile')->with('success', 'Successfully disconnected from student.');
    }

    /**
     * Mark a notification as read
     */
    public function markNotificationAsRead(Request $request, string $id): RedirectResponse
    {
        $notification = $request->user()->notifications()->find($id);

        if ($notification) {
            $notification->markAsRead();
        }

        return Redirect::back();
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
