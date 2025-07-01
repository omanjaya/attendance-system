<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SecurityService
{
    /**
     * Log security events
     */
    public function logSecurityEvent(string $event, array $data = [], string $level = 'info'): void
    {
        $logData = [
            'event' => $event,
            'timestamp' => now()->toISOString(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'user_id' => auth()->id(),
            'session_id' => session()->getId(),
            'data' => $data
        ];

        Log::channel('security')->{$level}($event, $logData);
    }

    /**
     * Detect suspicious activity patterns
     */
    public function detectSuspiciousActivity(Request $request): array
    {
        $suspiciousIndicators = [];

        // Check for SQL injection patterns
        if ($this->containsSqlInjectionPatterns($request)) {
            $suspiciousIndicators[] = 'sql_injection_attempt';
        }

        // Check for XSS patterns
        if ($this->containsXssPatterns($request)) {
            $suspiciousIndicators[] = 'xss_attempt';
        }

        // Check for unusual file upload attempts
        if ($this->hasUnusualFileUpload($request)) {
            $suspiciousIndicators[] = 'suspicious_file_upload';
        }

        // Check for unusual request patterns
        if ($this->hasUnusualRequestPattern($request)) {
            $suspiciousIndicators[] = 'unusual_request_pattern';
        }

        return $suspiciousIndicators;
    }

    /**
     * Generate secure token
     */
    public function generateSecureToken(int $length = 32): string
    {
        return Str::random($length);
    }

    /**
     * Validate file upload security
     */
    public function validateFileUpload($file): array
    {
        $errors = [];

        if (!$file) {
            return $errors;
        }

        // Check file size (max 5MB)
        if ($file->getSize() > 5 * 1024 * 1024) {
            $errors[] = 'File size exceeds maximum allowed (5MB)';
        }

        // Check file extension
        $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'doc', 'docx', 'xls', 'xlsx'];
        $extension = strtolower($file->getClientOriginalExtension());
        
        if (!in_array($extension, $allowedExtensions)) {
            $errors[] = 'File type not allowed';
        }

        // Check MIME type
        $allowedMimeTypes = [
            'image/jpeg', 'image/png', 'image/gif',
            'application/pdf',
            'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        
        if (!in_array($file->getMimeType(), $allowedMimeTypes)) {
            $errors[] = 'Invalid file format';
        }

        // Check for embedded scripts in images
        if (in_array($extension, ['jpg', 'jpeg', 'png', 'gif'])) {
            if ($this->containsEmbeddedScripts($file)) {
                $errors[] = 'File contains potentially malicious content';
            }
        }

        return $errors;
    }

    /**
     * Sanitize filename for safe storage
     */
    public function sanitizeFilename(string $filename): string
    {
        // Remove directory traversal attempts
        $filename = basename($filename);
        
        // Remove special characters except dots, hyphens, and underscores
        $filename = preg_replace('/[^a-zA-Z0-9.\-_]/', '', $filename);
        
        // Prevent double extensions
        $filename = preg_replace('/\.+/', '.', $filename);
        
        // Ensure filename is not too long
        if (strlen($filename) > 100) {
            $pathInfo = pathinfo($filename);
            $extension = isset($pathInfo['extension']) ? '.' . $pathInfo['extension'] : '';
            $basename = substr($pathInfo['filename'], 0, 100 - strlen($extension));
            $filename = $basename . $extension;
        }

        return $filename;
    }

    /**
     * Hash sensitive data
     */
    public function hashSensitiveData(string $data): string
    {
        return Hash::make($data);
    }

    /**
     * Verify hashed data
     */
    public function verifySensitiveData(string $data, string $hash): bool
    {
        return Hash::check($data, $hash);
    }

    /**
     * Check for SQL injection patterns
     */
    private function containsSqlInjectionPatterns(Request $request): bool
    {
        $sqlPatterns = [
            '/(\bselect\b|\bunion\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bcreate\b|\balter\b)/i',
            '/(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i',
            '/\'\s*(or|and)\s+\'/i',
            '/\-\-/i',
            '/\/\*/i',
            '/\*\//i',
            '/\bexec\b/i',
            '/\bsp_/i'
        ];

        $input = json_encode($request->all());
        
        foreach ($sqlPatterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check for XSS patterns
     */
    private function containsXssPatterns(Request $request): bool
    {
        $xssPatterns = [
            '/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/i',
            '/javascript:/i',
            '/vbscript:/i',
            '/onload=/i',
            '/onerror=/i',
            '/onclick=/i',
            '/onmouseover=/i',
            '/<iframe/i',
            '/<object/i',
            '/<embed/i',
            '/<link/i',
            '/<meta/i'
        ];

        $input = json_encode($request->all());
        
        foreach ($xssPatterns as $pattern) {
            if (preg_match($pattern, $input)) {
                return true;
            }
        }

        return false;
    }

    /**
     * Check for unusual file upload
     */
    private function hasUnusualFileUpload(Request $request): bool
    {
        if (!$request->hasFile('file')) {
            return false;
        }

        $file = $request->file('file');
        
        // Check for executable file extensions
        $dangerousExtensions = ['exe', 'bat', 'cmd', 'com', 'pif', 'scr', 'vbs', 'js', 'jar', 'php', 'asp', 'jsp'];
        $extension = strtolower($file->getClientOriginalExtension());
        
        return in_array($extension, $dangerousExtensions);
    }

    /**
     * Check for unusual request patterns
     */
    private function hasUnusualRequestPattern(Request $request): bool
    {
        // Check for unusual user agent patterns
        $userAgent = $request->userAgent();
        if (empty($userAgent) || strlen($userAgent) < 5) {
            return true;
        }

        // Allow curl and other legitimate tools
        if (str_contains($userAgent, 'curl') || str_contains($userAgent, 'HTTPie') || str_contains($userAgent, 'Postman')) {
            return false;
        }

        // Check for malicious bot patterns (but allow legitimate crawlers)
        $maliciousBotPatterns = [
            '/masscan/i', '/nmap/i', '/sqlmap/i', '/nikto/i', '/dirb/i'
        ];
        
        foreach ($maliciousBotPatterns as $pattern) {
            if (preg_match($pattern, $userAgent)) {
                return true;
            }
        }

        // More lenient header checks - only flag if no Accept header at all
        if (!$request->hasHeader('Accept')) {
            return true;
        }

        return false;
    }

    /**
     * Check for embedded scripts in image files
     */
    private function containsEmbeddedScripts($file): bool
    {
        try {
            $content = file_get_contents($file->getPathname());
            
            // Check for script tags or suspicious patterns
            $patterns = [
                '/<script/i',
                '/javascript/i',
                '/vbscript/i',
                '/<iframe/i',
                '/<object/i'
            ];
            
            foreach ($patterns as $pattern) {
                if (preg_match($pattern, $content)) {
                    return true;
                }
            }
            
            return false;
        } catch (\Exception $e) {
            // If we can't read the file, consider it suspicious
            return true;
        }
    }
}