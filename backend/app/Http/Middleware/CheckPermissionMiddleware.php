<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        if (!auth()->check()) {
            return redirect()->route('login')
                ->with('error', 'You must be logged in to access this page.');
        }

        $user = auth()->user();

        // Super Admin has access to everything
        if ($user->hasRole('Super Admin')) {
            return $next($request);
        }

        // Check if user has any of the required permissions
        $hasPermission = false;
        foreach ($permissions as $permission) {
            if ($user->hasPermissionTo($permission)) {
                $hasPermission = true;
                break;
            }
        }

        if (!$hasPermission) {
            // Log unauthorized access attempt
            activity()
                ->performedOn($user)
                ->causedBy($user)
                ->withProperties([
                    'url' => $request->fullUrl(),
                    'method' => $request->method(),
                    'required_permissions' => $permissions,
                    'user_permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                    'user_roles' => $user->getRoleNames()->toArray(),
                ])
                ->log('Unauthorized access attempt');

            if ($request->expectsJson()) {
                return response()->json([
                    'error' => 'Insufficient permissions',
                    'required_permissions' => $permissions,
                    'message' => 'You do not have permission to perform this action.'
                ], 403);
            }

            return redirect()->back()
                ->with('error', 'You do not have permission to access this page.');
        }

        return $next($request);
    }
}