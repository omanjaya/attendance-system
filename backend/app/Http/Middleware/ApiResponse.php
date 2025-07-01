<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Http\JsonResponse;

class ApiResponse
{
    /**
     * Handle an incoming request.
     *
     * This middleware ensures consistent API response format.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);
        
        // Only modify JSON responses for API routes
        if ($request->is('api/*') && $response instanceof JsonResponse) {
            $data = $response->getData(true);
            
            // If the response doesn't have our standard format, wrap it
            if (!isset($data['success']) && !isset($data['message']) && !isset($data['data'])) {
                $statusCode = $response->getStatusCode();
                $success = $statusCode >= 200 && $statusCode < 300;
                
                $formattedData = [
                    'success' => $success,
                    'message' => $this->getDefaultMessage($statusCode),
                    'data' => $data,
                    'timestamp' => now()->toISOString(),
                ];
                
                $response->setData($formattedData);
            }
        }
        
        return $response;
    }
    
    /**
     * Get default message based on status code.
     */
    private function getDefaultMessage(int $statusCode): string
    {
        return match ($statusCode) {
            200 => 'Success',
            201 => 'Created successfully',
            202 => 'Accepted',
            204 => 'No content',
            400 => 'Bad request',
            401 => 'Unauthorized',
            403 => 'Forbidden',
            404 => 'Not found',
            422 => 'Validation failed',
            429 => 'Too many requests',
            500 => 'Internal server error',
            default => 'Request processed',
        };
    }
}