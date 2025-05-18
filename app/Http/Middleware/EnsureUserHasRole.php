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
        
        // If user is not logged in or does not have the required role
        if (!$user || !$user->hasRole($role)) {
            abort(403, 'Unauthorized.');
        }

        // User has the required role — proceed with request
        return $next($request);
    }
}
