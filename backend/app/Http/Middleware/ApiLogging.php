<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class ApiLogging
{
    /**
     * Handle an incoming request and log API activity
     */
    public function handle(Request $request, Closure $next): Response
    {
        $startTime = microtime(true);
        
        // Generate unique request ID
        $requestId = uniqid('req_');
        $request->attributes->set('request_id', $requestId);
        
        // Log request
        $this->logRequest($request, $requestId);
        
        $response = $next($request);
        
        // Calculate duration
        $duration = (microtime(true) - $startTime) * 1000; // in milliseconds
        
        // Log response
        $this->logResponse($request, $response, $requestId, $duration);
        
        return $response;
    }

    /**
     * Log incoming request
     */
    private function logRequest(Request $request, string $requestId): void
    {
        $context = [
            'request_id' => $requestId,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'path' => $request->path(),
            'user_agent' => $request->userAgent(),
            'ip' => $request->ip(),
            'user_id' => $request->user()?->id,
            'headers' => $this->sanitizeHeaders($request->headers->all()),
            'query' => $request->query(),
            'body' => $this->sanitizeBody($request->all()),
            'timestamp' => now()->toISOString(),
        ];

        Log::channel('api')->info('API Request', $context);
    }

    /**
     * Log outgoing response
     */
    private function logResponse(Request $request, Response $response, string $requestId, float $duration): void
    {
        $context = [
            'request_id' => $requestId,
            'status' => $response->getStatusCode(),
            'status_text' => Response::$statusTexts[$response->getStatusCode()] ?? 'Unknown',
            'duration_ms' => round($duration, 2),
            'content_length' => $response->headers->get('Content-Length'),
            'content_type' => $response->headers->get('Content-Type'),
            'headers' => $this->sanitizeHeaders($response->headers->all()),
            'memory_usage' => $this->formatBytes(memory_get_peak_usage(true)),
            'timestamp' => now()->toISOString(),
        ];

        // Add response body for debug level
        if (config('logging.channels.api.level') === 'debug') {
            $context['response_body'] = $this->sanitizeResponseBody($response);
        }

        // Log level based on status code
        if ($response->getStatusCode() >= 500) {
            Log::channel('api')->error('API Response - Server Error', $context);
        } elseif ($response->getStatusCode() >= 400) {
            Log::channel('api')->warning('API Response - Client Error', $context);
        } else {
            Log::channel('api')->info('API Response - Success', $context);
        }

        // Log slow requests
        if ($duration > 1000) { // Slower than 1 second
            Log::channel('performance')->warning('Slow API Request', [
                'request_id' => $requestId,
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'duration_ms' => round($duration, 2),
                'user_id' => $request->user()?->id,
                'memory_usage' => $this->formatBytes(memory_get_peak_usage(true)),
            ]);
        }
    }

    /**
     * Sanitize headers (remove sensitive data)
     */
    private function sanitizeHeaders(array $headers): array
    {
        $sensitive = [
            'authorization',
            'x-api-key',
            'x-auth-token',
            'cookie',
            'set-cookie',
        ];

        $sanitized = [];
        foreach ($headers as $key => $value) {
            if (in_array(strtolower($key), $sensitive)) {
                $sanitized[$key] = '[REDACTED]';
            } else {
                $sanitized[$key] = is_array($value) ? implode(', ', $value) : $value;
            }
        }

        return $sanitized;
    }

    /**
     * Sanitize request body (remove sensitive data)
     */
    private function sanitizeBody(array $body): array
    {
        $sensitive = [
            'password',
            'password_confirmation',
            'current_password',
            'new_password',
            'token',
            'api_key',
            'secret',
            'credit_card',
            'ssn',
            'social_security',
        ];

        $sanitized = [];
        foreach ($body as $key => $value) {
            if (in_array(strtolower($key), $sensitive)) {
                $sanitized[$key] = '[REDACTED]';
            } elseif (is_array($value)) {
                $sanitized[$key] = $this->sanitizeBody($value);
            } else {
                $sanitized[$key] = $value;
            }
        }

        return $sanitized;
    }

    /**
     * Sanitize response body
     */
    private function sanitizeResponseBody(Response $response): mixed
    {
        $content = $response->getContent();
        
        // Only log JSON responses
        if (!$this->isJson($content)) {
            return '[NON-JSON RESPONSE]';
        }

        try {
            $decoded = json_decode($content, true);
            return $this->sanitizeBody($decoded ?? []);
        } catch (\Exception $e) {
            return '[INVALID JSON]';
        }
    }

    /**
     * Check if content is JSON
     */
    private function isJson(string $content): bool
    {
        json_decode($content);
        return json_last_error() === JSON_ERROR_NONE;
    }

    /**
     * Format bytes to human readable
     */
    private function formatBytes(int $bytes): string
    {
        $units = ['B', 'KB', 'MB', 'GB'];
        $bytes = max($bytes, 0);
        $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
        $pow = min($pow, count($units) - 1);
        
        $bytes /= pow(1024, $pow);
        
        return round($bytes, 2) . ' ' . $units[$pow];
    }
}