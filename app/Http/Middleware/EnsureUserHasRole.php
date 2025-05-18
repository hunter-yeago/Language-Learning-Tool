<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserHasRole
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        $user = $request->user();

        if (! $user || ! $user->hasRole($role)) {
            // Redirect based on user's actual role
            if ($user->hasRole('tutor')) {
                return redirect()->route('tutor.dashboard');
            } elseif ($user->hasRole('student')) {
                return redirect()->route('student.dashboard');
            }

            // If user has no recognized role, send them to login or home
            return redirect()->route('/');
        }

        return $next($request);
    }
}
