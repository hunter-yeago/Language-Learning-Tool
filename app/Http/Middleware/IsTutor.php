<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class IsTutor
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Check if the user is authenticated and has the 'tutor' role
        if (auth()->check() && auth()->user()->role === 'tutor') {
            return $next($request);  // Allow the request to proceed
        }

        // If not a tutor, redirect to a different page
        return redirect('/');  // Or choose another route
    }
}
