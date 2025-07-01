<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimiting
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next, string $key = 'global'): Response
    {
        $identifier = $this->getIdentifier($request, $key);
        $maxAttempts = $this->getMaxAttempts($key);
        $decayMinutes = $this->getDecayMinutes($key);

        if (RateLimiter::tooManyAttempts($identifier, $maxAttempts)) {
            $seconds = RateLimiter::availableIn($identifier);
            
            return response()->json([
                'success' => false,
                'message' => 'Too many requests. Please try again later.',
                'retry_after' => $seconds
            ], 429);
        }

        RateLimiter::hit($identifier, $decayMinutes * 60);

        $response = $next($request);

        // Add rate limit headers
        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => max(0, $maxAttempts - RateLimiter::attempts($identifier)),
            'X-RateLimit-Reset' => now()->addMinutes($decayMinutes)->timestamp,
        ]);

        return $response;
    }

    /**
     * Get the rate limiting identifier
     */
    protected function getIdentifier(Request $request, string $key): string
    {
        $user = $request->user();
        $ip = $request->ip();
        
        if ($user) {
            return "rate_limit:{$key}:user:{$user->id}";
        }
        
        return "rate_limit:{$key}:ip:{$ip}";
    }

    /**
     * Get max attempts based on the rate limit key
     */
    protected function getMaxAttempts(string $key): int
    {
        return match($key) {
            'login' => 5,           // 5 login attempts
            'api' => 100,           // 100 API requests
            'upload' => 10,         // 10 file uploads
            'face_recognition' => 20, // 20 face recognition attempts
            'password_reset' => 3,   // 3 password reset attempts
            default => 60           // 60 general requests
        };
    }

    /**
     * Get decay minutes based on the rate limit key
     */
    protected function getDecayMinutes(string $key): int
    {
        return match($key) {
            'login' => 15,          // 15 minutes
            'api' => 1,             // 1 minute
            'upload' => 10,         // 10 minutes
            'face_recognition' => 5, // 5 minutes
            'password_reset' => 60,  // 1 hour
            default => 1            // 1 minute
        };
    }
}