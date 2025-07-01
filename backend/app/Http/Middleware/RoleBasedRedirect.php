<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleBasedRedirect
{
    /**
     * Handle an incoming request.
     * 
     * Redirects users to appropriate dashboard based on their role
     * when they access generic routes like /dashboard
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return $next($request);
        }

        // Only apply this middleware on dashboard route
        if (!$request->routeIs('dashboard')) {
            return $next($request);
        }

        // Redirect based on primary role
        if ($user->hasRole('super_admin')) {
            return redirect()->route('admin.dashboard');
        }
        
        if ($user->hasRole('hr_manager')) {
            return redirect()->route('hr.dashboard');
        }
        
        if ($user->hasRole('principal')) {
            return redirect()->route('principal.dashboard');
        }
        
        if ($user->hasRole('teacher') || $user->hasRole('staff')) {
            return redirect()->route('employee.dashboard');
        }

        // Default to regular dashboard
        return $next($request);
    }
}