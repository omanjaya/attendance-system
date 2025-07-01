<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\SecurityService;
use Illuminate\Support\Facades\Log;

class SecurityAudit
{
    protected SecurityService $securityService;

    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
    }

    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Pre-request security checks
        $this->performPreRequestChecks($request);

        // Process the request
        $response = $next($request);

        // Post-request logging
        $this->performPostRequestLogging($request, $response);

        return $response;
    }

    /**
     * Perform security checks before processing request
     */
    private function performPreRequestChecks(Request $request): void
    {
        // Detect suspicious activity
        $suspiciousIndicators = $this->securityService->detectSuspiciousActivity($request);
        
        if (!empty($suspiciousIndicators)) {
            $this->securityService->logSecurityEvent(
                'suspicious_activity_detected',
                [
                    'indicators' => $suspiciousIndicators,
                    'url' => $request->url(),
                    'method' => $request->method(),
                    'input' => $this->sanitizeLogData($request->all())
                ],
                'warning'
            );
        }

        // Log sensitive operations
        if ($this->isSensitiveOperation($request)) {
            $this->securityService->logSecurityEvent(
                'sensitive_operation_attempt',
                [
                    'operation' => $this->getSensitiveOperationType($request),
                    'url' => $request->url(),
                    'method' => $request->method()
                ]
            );
        }

        // Log authentication attempts
        if ($this->isAuthenticationAttempt($request)) {
            $this->securityService->logSecurityEvent(
                'authentication_attempt',
                [
                    'email' => $request->input('email'),
                    'success' => false // Will be updated in post-request logging
                ]
            );
        }
    }

    /**
     * Log security events after request processing
     */
    private function performPostRequestLogging(Request $request, Response $response): void
    {
        $statusCode = $response->getStatusCode();

        // Log failed authentication attempts
        if ($this->isAuthenticationAttempt($request) && $statusCode >= 400) {
            $this->securityService->logSecurityEvent(
                'authentication_failed',
                [
                    'email' => $request->input('email'),
                    'status_code' => $statusCode,
                    'reason' => $this->getFailureReason($statusCode)
                ],
                'warning'
            );
        }

        // Log successful authentication
        if ($this->isAuthenticationAttempt($request) && $statusCode < 300) {
            $this->securityService->logSecurityEvent(
                'authentication_successful',
                [
                    'email' => $request->input('email'),
                    'user_id' => auth()->id()
                ]
            );
        }

        // Log privilege escalation attempts
        if ($statusCode === 403) {
            $this->securityService->logSecurityEvent(
                'privilege_escalation_attempt',
                [
                    'url' => $request->url(),
                    'method' => $request->method(),
                    'user_id' => auth()->id(),
                    'required_permission' => $this->extractRequiredPermission($request)
                ],
                'warning'
            );
        }

        // Log data modification operations
        if ($this->isDataModificationOperation($request) && $statusCode < 300) {
            $this->securityService->logSecurityEvent(
                'data_modification',
                [
                    'operation' => $request->method(),
                    'resource' => $this->extractResourceType($request),
                    'url' => $request->url(),
                    'user_id' => auth()->id()
                ]
            );
        }

        // Log file upload operations
        if ($request->hasFile('avatar') || $request->hasFile('document')) {
            $this->securityService->logSecurityEvent(
                'file_upload',
                [
                    'files' => $this->getFileInfo($request),
                    'url' => $request->url(),
                    'status_code' => $statusCode,
                    'user_id' => auth()->id()
                ]
            );
        }

        // Log high-risk operations
        if ($this->isHighRiskOperation($request)) {
            $this->securityService->logSecurityEvent(
                'high_risk_operation',
                [
                    'operation' => $this->getOperationType($request),
                    'url' => $request->url(),
                    'method' => $request->method(),
                    'status_code' => $statusCode,
                    'user_id' => auth()->id()
                ],
                'info'
            );
        }
    }

    /**
     * Check if this is a sensitive operation
     */
    private function isSensitiveOperation(Request $request): bool
    {
        $sensitiveRoutes = [
            'api/employees',
            'api/payroll',
            'api/users',
            'api/auth/register',
            'api/settings'
        ];

        foreach ($sensitiveRoutes as $route) {
            if (str_contains($request->path(), $route)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check if this is an authentication attempt
     */
    private function isAuthenticationAttempt(Request $request): bool
    {
        return str_contains($request->path(), 'auth/login') && $request->isMethod('POST');
    }

    /**
     * Check if this is a data modification operation
     */
    private function isDataModificationOperation(Request $request): bool
    {
        return in_array($request->method(), ['POST', 'PUT', 'PATCH', 'DELETE']);
    }

    /**
     * Check if this is a high-risk operation
     */
    private function isHighRiskOperation(Request $request): bool
    {
        $highRiskRoutes = [
            'api/employees/*/avatar',
            'api/payroll/generate',
            'api/payroll/bulk-process',
            'api/users/*/roles',
            'api/face-recognition'
        ];

        foreach ($highRiskRoutes as $route) {
            if (preg_match('#' . str_replace('*', '[^/]+', $route) . '#', $request->path())) {
                return true;
            }
        }

        return false;
    }

    /**
     * Get the type of sensitive operation
     */
    private function getSensitiveOperationType(Request $request): string
    {
        if (str_contains($request->path(), 'employees')) {
            return 'employee_management';
        }
        if (str_contains($request->path(), 'payroll')) {
            return 'payroll_management';
        }
        if (str_contains($request->path(), 'users')) {
            return 'user_management';
        }
        if (str_contains($request->path(), 'settings')) {
            return 'system_configuration';
        }
        
        return 'unknown';
    }

    /**
     * Get operation type for logging
     */
    private function getOperationType(Request $request): string
    {
        $path = $request->path();
        $method = $request->method();

        if (str_contains($path, 'face-recognition')) {
            return 'face_recognition';
        }
        if (str_contains($path, 'payroll/generate')) {
            return 'payroll_generation';
        }
        if (str_contains($path, 'bulk')) {
            return 'bulk_operation';
        }
        if (str_contains($path, 'avatar')) {
            return 'avatar_upload';
        }

        return $method . '_' . basename($path);
    }

    /**
     * Extract resource type from request
     */
    private function extractResourceType(Request $request): string
    {
        $path = $request->path();
        $segments = explode('/', $path);
        
        // Return the main resource type (employees, attendance, etc.)
        return $segments[1] ?? 'unknown';
    }

    /**
     * Extract required permission from request (simplified)
     */
    private function extractRequiredPermission(Request $request): string
    {
        // This would need to be implemented based on your permission system
        return 'unknown_permission';
    }

    /**
     * Get failure reason from status code
     */
    private function getFailureReason(int $statusCode): string
    {
        return match($statusCode) {
            401 => 'invalid_credentials',
            403 => 'insufficient_permissions',
            422 => 'validation_failed',
            429 => 'rate_limit_exceeded',
            default => 'unknown_error'
        };
    }

    /**
     * Get file information for logging
     */
    private function getFileInfo(Request $request): array
    {
        $fileInfo = [];
        
        foreach ($request->allFiles() as $key => $file) {
            if (is_array($file)) {
                foreach ($file as $subFile) {
                    $fileInfo[] = [
                        'field' => $key,
                        'name' => $subFile->getClientOriginalName(),
                        'size' => $subFile->getSize(),
                        'mime_type' => $subFile->getMimeType(),
                        'extension' => $subFile->getClientOriginalExtension()
                    ];
                }
            } else {
                $fileInfo[] = [
                    'field' => $key,
                    'name' => $file->getClientOriginalName(),
                    'size' => $file->getSize(),
                    'mime_type' => $file->getMimeType(),
                    'extension' => $file->getClientOriginalExtension()
                ];
            }
        }
        
        return $fileInfo;
    }

    /**
     * Sanitize data for logging (remove sensitive information)
     */
    private function sanitizeLogData(array $data): array
    {
        $sensitiveFields = ['password', 'password_confirmation', 'token', 'face_data'];
        
        foreach ($sensitiveFields as $field) {
            if (isset($data[$field])) {
                $data[$field] = '[REDACTED]';
            }
        }
        
        return $data;
    }
}