<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class HomeController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (!$user) {
            return redirect('login');
        }

        if ($user) {
            if ($user->hasRole('tutor')) {
                return app(TutorController::class)->index();
            } else if ($user->hasRole('student')) {
                return app(StudentController::class)->index();
            } else {
                abort(403, 'Unauthorized');
            }
        }


    }
}
