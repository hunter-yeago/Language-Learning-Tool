<?php

namespace App\Http\Controllers;

use App\Models\Bucket;
use App\Models\Essay;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        if (!$user) {
            return redirect('login');
        }


        // Tutor
        if ($user->hasRole('tutor')) {
            $essays = Essay::where('tutor_id', Auth::id())
            ->where('status', 'submitted')
            ->with('words')
            ->get();

        return Inertia::render('TutorDashboardPage', compact('essays'));

        // Student
        } else if ($user->hasRole('student')) {
            $essays = Essay::where('user_id', Auth::id())->with('words')->get();
            $buckets = Bucket::where('user_id', Auth::id())->with('words')->get();
            $bucketID = $request->query('bucketID');

            return Inertia::render('Dashboard', [
                'essays' => $essays,
                'buckets' => $buckets,
                'bucketID' => $bucketID,
            ]);
        } else {
            abort(403, 'Unauthorized');
        }


    }
}
