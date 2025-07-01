<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPermissionOrOwner
{
    /**
     * Handle an incoming request.
     *
     * This middleware checks if the user has the required permission
     * or if they are accessing their own resources.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $permission, string $ownerParam = 'user'): Response
    {
        $user = $request->user();
        
        if (!$user) {
            return response()->json([
                'message' => 'Unauthenticated.'
            ], 401);
        }
        
        // Check if user has the required permission
        if ($user->can($permission)) {
            return $next($request);
        }
        
        // Check if user is accessing their own resource
        $resourceId = $request->route($ownerParam);
        if ($resourceId && $user->id == $resourceId) {
            return $next($request);
        }
        
        // Check if the resource belongs to the user (for models)
        if ($resourceId && is_object($resourceId) && method_exists($resourceId, 'belongsToUser')) {
            if ($resourceId->belongsToUser($user)) {
                return $next($request);
            }
        }
        
        return response()->json([
            'message' => 'Forbidden. You do not have permission to access this resource.'
        ], 403);
    }
}