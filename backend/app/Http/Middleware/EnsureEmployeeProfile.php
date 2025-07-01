<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureEmployeeProfile
{
    /**
     * Handle an incoming request.
     * 
     * Ensures that the authenticated user has an associated employee profile.
     * This is required for most attendance-related operations.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        
        if (!$user) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Unauthenticated.'
                ], 401);
            }
            return redirect()->route('login');
        }

        if (!$user->employee) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Employee profile not found. Please contact administrator.'
                ], 403);
            }
            
            return redirect()->route('dashboard')
                ->with('error', 'Employee profile not found. Please contact administrator.');
        }

        if (!$user->employee->is_active) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Employee account is deactivated.'
                ], 403);
            }
            
            return redirect()->route('dashboard')
                ->with('error', 'Your employee account is deactivated. Please contact administrator.');
        }

        return $next($request);
    }
}