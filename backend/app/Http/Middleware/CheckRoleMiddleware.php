<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login')
                ->with('error', 'You must be logged in to access this page.');
        }

        $user = auth()->user();

        // Check if user has any of the required roles
        $hasRole = false;
        foreach ($roles as $role) {
            if ($user->hasRole($role)) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            // Log unauthorized access attempt
            activity()
                ->performedOn($user)
                ->causedBy($user)
                ->withProperties([
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'required_roles' => $roles,
                    'user_roles' => $user->getRoleNames()->toArray(),
                ])
                ->log('Unauthorized role access attempt');

            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Insufficient role permissions',
                    'required_roles' => $roles,
                    'message' => 'You do not have the required role to perform this action.'
                ], 403);
            }

            return redirect()->back()
                ->with('error', 'You do not have the required role to access this page.');
        }

        return $next($request);
    }
}