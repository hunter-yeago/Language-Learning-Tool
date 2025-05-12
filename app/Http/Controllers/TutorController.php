<?php

namespace App\Http\Controllers;

use App\Models\Essay;
use Illuminate\Http\Request;
use Inertia\Inertia;
use WpOrg\Requests\Auth;

class TutorController extends Controller
{
    public function tutorIndex()
    {
        $tutor = Auth::user(); // Assuming you're already authenticating the tutor
        $notifications = $tutor->notifications()->latest()->get(); // Get the latest notifications

        $essays = Essay::where('tutor_id', $tutor->id)->get(); // Get essays assigned to the tutor

        return Inertia::render('TutorDashboard', [
            'essays' => $essays,
            'notifications' => $notifications,
        ]);
    }


}
