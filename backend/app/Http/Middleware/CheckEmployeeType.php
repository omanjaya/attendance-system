<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckEmployeeType
{
    /**
     * Handle an incoming request.
     * 
     * Checks if the authenticated user's employee type matches
     * any of the allowed types for the route.
     */
    public function handle(Request $request, Closure $next, ...$allowedTypes): Response
    {
        $user = $request->user();
        
        if (!$user || !$user->employee) {
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => 'Employee profile required.'
                ], 403);
            }
            return redirect()->route('dashboard')->with('error', 'Employee profile required.');
        }

        $employeeTypeName = $user->employee->employeeType->name ?? null;
        
        if (!$employeeTypeName || !in_array($employeeTypeName, $allowedTypes)) {
            $allowedTypesStr = implode(', ', $allowedTypes);
            
            if ($request->expectsJson()) {
                return response()->json([
                    'message' => "Access restricted to: {$allowedTypesStr}. Your type: {$employeeTypeName}"
                ], 403);
            }
            
            return redirect()->route('dashboard')
                ->with('error', "Access restricted to: {$allowedTypesStr}");
        }

        return $next($request);
    }
}