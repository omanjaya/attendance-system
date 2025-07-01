<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;

class AuditLogMiddleware
{
    /**
     * Handle an incoming request.
     * 
     * Logs important operations for audit trail and security monitoring.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        $startTime = microtime(true);
        
        $response = $next($request);
        
        $endTime = microtime(true);
        $duration = round(($endTime - $startTime) * 1000, 2); // milliseconds

        // Log important operations
        if ($this->shouldLog($request)) {
            $logData = [
                'user_id' => $user->id ?? null,
                'employee_id' => $user->employee->id ?? null,
                'user_name' => $user->name ?? 'Guest',
                'method' => $request->method(),
                'url' => $request->fullUrl(),
                'route_name' => $request->route()?->getName(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'status_code' => $response->getStatusCode(),
                'duration_ms' => $duration,
                'timestamp' => now()->toISOString(),
            ];

            // Add location data for attendance operations
            if ($this->isAttendanceOperation($request)) {
                $logData['latitude'] = $request->input('latitude');
                $logData['longitude'] = $request->input('longitude');
                $logData['location_name'] = $request->input('validated_location.location_name');
            }

            // Add request data for sensitive operations
            if ($this->isSensitiveOperation($request)) {
                $logData['request_data'] = $this->sanitizeRequestData($request->all());
            }

            Log::channel('audit')->info('User Operation', $logData);
        }

        return $response;
    }

    /**
     * Determine if the request should be logged
     */
    protected function shouldLog(Request $request): bool
    {
        $logRoutes = [
            'attendance.*',
            'payroll.*',
            'leaves.*',
            'employees.*',
            'schedules.*',
            'settings.*',
        ];

        $routeName = $request->route()?->getName();
        
        if (!$routeName) {
            return false;
        }

        foreach ($logRoutes as $pattern) {
            if (fnmatch($pattern, $routeName)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if this is an attendance operation
     */
    protected function isAttendanceOperation(Request $request): bool
    {
        $routeName = $request->route()?->getName();
        return $routeName && str_starts_with($routeName, 'attendance.');
    }

    /**
     * Check if this is a sensitive operation
     */
    protected function isSensitiveOperation(Request $request): bool
    {
        $sensitiveRoutes = [
            'employees.store',
            'employees.update',
            'employees.destroy',
            'payroll.*',
            'settings.*',
        ];

        $routeName = $request->route()?->getName();
        
        if (!$routeName) {
            return false;
        }

        foreach ($sensitiveRoutes as $pattern) {
            if (fnmatch($pattern, $routeName)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Sanitize request data for logging
     */
    protected function sanitizeRequestData(array $data): array
    {
        $sensitiveFields = [
            'password',
            'password_confirmation',
            'current_password',
            'token',
            'api_key',
            'secret',
        ];

        foreach ($sensitiveFields as $field) {
            if (isset($data[$field])) {
                $data[$field] = '[REDACTED]';
            }
        }

        // Remove file uploads from logs
        foreach ($data as $key => $value) {
            if ($value instanceof \Illuminate\Http\UploadedFile) {
                $data[$key] = '[FILE: ' . $value->getClientOriginalName() . ']';
            }
        }

        return $data;
    }
}