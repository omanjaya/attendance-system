<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class LogApiRequests
{
    /**
     * Handle an incoming request.
     *
     * This middleware logs API requests for monitoring and debugging.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        // Log the incoming request
        $this->logRequest($request);
        
        $response = $next($request);
        
        // Log the response
        $this->logResponse($request, $response, $startTime);
        
        return $response;
    }
    
    /**
     * Log the incoming request.
     */
    private function logRequest(Request $request): void
    {
        $user = $request->user();
        
        Log::channel('api')->info('API Request', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => $user?->id,
            'user_email' => $user?->email,
            'headers' => $this->getFilteredHeaders($request),
            'body' => $this->getFilteredBody($request),
            'timestamp' => now()->toISOString(),
        ]);
    }
    
    /**
     * Log the response.
     */
    private function logResponse(Request $request, Response $response, float $startTime): void
    {
        $duration = round((microtime(true) - $startTime) * 1000, 2);
        
        Log::channel('api')->info('API Response', [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'status_code' => $response->getStatusCode(),
            'duration_ms' => $duration,
            'response_size' => strlen($response->getContent()),
            'timestamp' => now()->toISOString(),
        ]);
        
        // Log slow requests as warnings
        if ($duration > 2000) { // 2 seconds
            Log::channel('api')->warning('Slow API Request', [
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'duration_ms' => $duration,
                'timestamp' => now()->toISOString(),
            ]);
        }
    }
    
    /**
     * Get filtered headers (remove sensitive ones).
     */
    private function getFilteredHeaders(Request $request): array
    {
        $headers = $request->headers->all();
        
        // Remove sensitive headers
        $sensitiveHeaders = ['authorization', 'cookie', 'x-api-key', 'x-auth-token'];
        
        foreach ($sensitiveHeaders as $header) {
            if (isset($headers[$header])) {
                $headers[$header] = ['[FILTERED]'];
            }
        }
        
        return $headers;
    }
    
    /**
     * Get filtered request body (remove sensitive fields).
     */
    private function getFilteredBody(Request $request): array
    {
        $body = $request->all();
        
        // Remove sensitive fields
        $sensitiveFields = ['password', 'password_confirmation', 'token', 'api_key', 'secret'];
        
        foreach ($sensitiveFields as $field) {
            if (isset($body[$field])) {
                $body[$field] = '[FILTERED]';
            }
        }
        
        return $body;
    }
}