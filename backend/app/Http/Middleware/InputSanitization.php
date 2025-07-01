<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class InputSanitization
{
    /**
     * Handle an incoming request.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only sanitize for non-file uploads
        if (!$request->hasFile('avatar') && !$request->hasFile('document')) {
            $this->sanitizeInput($request);
        }

        return $next($request);
    }

    /**
     * Sanitize request input to prevent XSS attacks
     */
    protected function sanitizeInput(Request $request): void
    {
        $input = $request->all();
        
        if (!empty($input)) {
            $sanitized = $this->sanitizeArray($input);
            $request->replace($sanitized);
        }
    }

    /**
     * Recursively sanitize array input
     */
    protected function sanitizeArray(array $data): array
    {
        $sanitized = [];

        foreach ($data as $key => $value) {
            $cleanKey = $this->sanitizeString($key);
            
            if (is_array($value)) {
                $sanitized[$cleanKey] = $this->sanitizeArray($value);
            } elseif (is_string($value)) {
                $sanitized[$cleanKey] = $this->sanitizeString($value);
            } else {
                $sanitized[$cleanKey] = $value;
            }
        }

        return $sanitized;
    }

    /**
     * Sanitize individual string values
     */
    protected function sanitizeString(string $value): string
    {
        // Remove null bytes
        $value = str_replace("\0", '', $value);
        
        // Remove or encode potentially dangerous characters
        $value = strip_tags($value);
        
        // HTML encode special characters
        $value = htmlspecialchars($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        
        // Remove potential script injections
        $value = preg_replace('/javascript:/i', '', $value);
        $value = preg_replace('/vbscript:/i', '', $value);
        $value = preg_replace('/data:/i', '', $value);
        
        return trim($value);
    }

    /**
     * Fields that should be exempt from HTML encoding (like rich text fields)
     */
    protected function isExemptField(string $field): bool
    {
        $exemptFields = [
            'description',
            'notes',
            'message',
            'content'
        ];

        return in_array($field, $exemptFields);
    }
}