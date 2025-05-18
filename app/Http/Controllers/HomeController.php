<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $user = Auth::user();

        if ($user->hasRole('tutor')) {
            return redirect()->route('tutor.tutor-dashboard');
        }

        if ($user->hasRole('student')) {
            return redirect()->route('student.student-dashboard');
        }

    }
}
