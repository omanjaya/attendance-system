<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Security Configuration
    |--------------------------------------------------------------------------
    |
    | This file contains security-related configuration options for the
    | School Attendance System. These settings help protect against
    | common security vulnerabilities.
    |
    */

    /*
    |--------------------------------------------------------------------------
    | Input Sanitization
    |--------------------------------------------------------------------------
    */
    
    'input_sanitization' => [
        'enabled' => env('SECURITY_INPUT_SANITIZATION', true),
        
        // Fields exempt from HTML encoding (rich text fields)
        'exempt_fields' => [
            'description',
            'notes',
            'message',
            'content',
            'bio',
            'comments'
        ],
        
        // Maximum input length (characters)
        'max_input_length' => 10000,
        
        // Remove dangerous patterns
        'remove_patterns' => [
            'javascript:',
            'vbscript:',
            'data:',
            'onclick=',
            'onload=',
            'onerror=',
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting
    |--------------------------------------------------------------------------
    */
    
    'rate_limiting' => [
        'enabled' => env('SECURITY_RATE_LIMITING', true),
        
        'limits' => [
            'login' => [
                'max_attempts' => 5,
                'decay_minutes' => 15,
            ],
            'api' => [
                'max_attempts' => 100,
                'decay_minutes' => 1,
            ],
            'upload' => [
                'max_attempts' => 10,
                'decay_minutes' => 10,
            ],
            'face_recognition' => [
                'max_attempts' => 20,
                'decay_minutes' => 5,
            ],
            'password_reset' => [
                'max_attempts' => 3,
                'decay_minutes' => 60,
            ],
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | File Upload Security
    |--------------------------------------------------------------------------
    */
    
    'file_upload' => [
        'enabled' => env('SECURITY_FILE_UPLOAD', true),
        
        // Maximum file size in bytes (5MB)
        'max_file_size' => 5 * 1024 * 1024,
        
        // Allowed file extensions
        'allowed_extensions' => [
            'image' => ['jpg', 'jpeg', 'png', 'gif'],
            'document' => ['pdf', 'doc', 'docx', 'xls', 'xlsx'],
            'avatar' => ['jpg', 'jpeg', 'png'],
        ],
        
        // Allowed MIME types
        'allowed_mime_types' => [
            'image/jpeg',
            'image/png', 
            'image/gif',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ],
        
        // Scan for embedded scripts in images
        'scan_images' => true,
        
        // Quarantine suspicious files
        'quarantine_enabled' => true,
        'quarantine_path' => 'quarantine',
    ],

    /*
    |--------------------------------------------------------------------------
    | Security Headers
    |--------------------------------------------------------------------------
    */
    
    'headers' => [
        'enabled' => env('SECURITY_HEADERS', true),
        
        'content_security_policy' => [
            'enabled' => true,
            'policy' => [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
                "style-src 'self' 'unsafe-inline'",
                "img-src 'self' data: blob:",
                "font-src 'self'",
                "connect-src 'self'",
                "media-src 'self'",
                "object-src 'none'",
                "child-src 'none'",
                "worker-src 'self'",
                "frame-ancestors 'none'",
                "form-action 'self'",
                "upgrade-insecure-requests"
            ]
        ],
        
        'strict_transport_security' => [
            'enabled' => true,
            'max_age' => 31536000, // 1 year
            'include_subdomains' => true,
        ],
        
        'x_frame_options' => 'DENY',
        'x_content_type_options' => 'nosniff',
        'x_xss_protection' => '1; mode=block',
        'referrer_policy' => 'strict-origin-when-cross-origin',
    ],

    /*
    |--------------------------------------------------------------------------
    | Audit Logging
    |--------------------------------------------------------------------------
    */
    
    'audit_logging' => [
        'enabled' => env('SECURITY_AUDIT_LOGGING', true),
        
        // Events to log
        'log_events' => [
            'login_attempts',
            'authentication_success',
            'authentication_failure',
            'privilege_escalation_attempts',
            'data_modifications',
            'file_uploads',
            'password_changes',
            'role_changes',
            'permission_changes',
            'sensitive_data_access',
        ],
        
        // Sensitive fields to redact in logs
        'redacted_fields' => [
            'password',
            'password_confirmation',
            'token',
            'secret',
            'key',
            'face_data',
            'biometric_data',
        ],
        
        // Log retention (days)
        'retention_days' => [
            'security' => 90,
            'audit' => 365,
            'performance' => 30,
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Suspicious Activity Detection
    |--------------------------------------------------------------------------
    */
    
    'suspicious_activity' => [
        'enabled' => env('SECURITY_SUSPICIOUS_ACTIVITY_DETECTION', true),
        
        // SQL injection patterns
        'sql_injection_patterns' => [
            '/(\bselect\b|\bunion\b|\binsert\b|\bupdate\b|\bdelete\b|\bdrop\b|\bcreate\b|\balter\b)/i',
            '/(\bor\b|\band\b)\s+\d+\s*=\s*\d+/i',
            '/\'\s*(or|and)\s+\'/i',
            '/\-\-/i',
            '/\/\*/i',
            '/\*\//i',
            '/\bexec\b/i',
            '/\bsp_/i'
        ],
        
        // XSS patterns
        'xss_patterns' => [
            '/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi',
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
        ],
        
        // Bot detection patterns
        'bot_patterns' => [
            '/bot/i',
            '/crawler/i', 
            '/spider/i',
            '/scraper/i'
        ],
        
        // Minimum user agent length
        'min_user_agent_length' => 10,
    ],

    /*
    |--------------------------------------------------------------------------
    | Password Security
    |--------------------------------------------------------------------------
    */
    
    'passwords' => [
        'min_length' => 8,
        'require_uppercase' => true,
        'require_lowercase' => true,
        'require_numbers' => true,
        'require_symbols' => true,
        'forbidden_patterns' => [
            'password',
            '123456',
            'qwerty',
            'admin',
            'user',
        ],
        
        // Password history (prevent reuse)
        'history_length' => 5,
        
        // Password expiry (days, 0 = never)
        'expires_after_days' => 0,
    ],

    /*
    |--------------------------------------------------------------------------
    | Session Security
    |--------------------------------------------------------------------------
    */
    
    'session' => [
        'secure_cookies' => env('SESSION_SECURE_COOKIES', true),
        'http_only_cookies' => true,
        'same_site_cookies' => 'strict',
        
        // Session timeout (minutes)
        'timeout' => 120,
        
        // Regenerate session ID on login
        'regenerate_on_login' => true,
    ],

    /*
    |--------------------------------------------------------------------------
    | Database Security
    |--------------------------------------------------------------------------
    */
    
    'database' => [
        // Use prepared statements (Laravel default)
        'use_prepared_statements' => true,
        
        // Encrypt sensitive database fields
        'encrypt_sensitive_fields' => [
            'national_id',
            'bank_account',
            'phone',
            'address',
        ],
        
        // Database connection encryption
        'encrypt_connection' => env('DB_ENCRYPT', false),
    ],

    /*
    |--------------------------------------------------------------------------
    | API Security
    |--------------------------------------------------------------------------
    */
    
    'api' => [
        // Require HTTPS for API calls
        'require_https' => env('API_REQUIRE_HTTPS', true),
        
        // API versioning
        'versioning_enabled' => true,
        'current_version' => 'v1',
        
        // Request signing (HMAC)
        'request_signing' => [
            'enabled' => false,
            'algorithm' => 'sha256',
            'header' => 'X-Signature',
        ],
        
        // CORS configuration
        'cors' => [
            'strict_origin' => true,
            'allowed_origins' => explode(',', env('CORS_ALLOWED_ORIGINS', 'http://localhost:3000')),
        ]
    ],

    /*
    |--------------------------------------------------------------------------
    | Monitoring & Alerting
    |--------------------------------------------------------------------------
    */
    
    'monitoring' => [
        'enabled' => env('SECURITY_MONITORING', true),
        
        // Alert thresholds
        'alert_thresholds' => [
            'failed_logins_per_minute' => 10,
            'suspicious_requests_per_minute' => 20,
            'file_upload_failures_per_hour' => 50,
        ],
        
        // Alert channels
        'alert_channels' => [
            'log' => true,
            'email' => env('SECURITY_ALERTS_EMAIL', false),
            'slack' => env('SECURITY_ALERTS_SLACK', false),
        ],
        
        // Email settings for alerts
        'alert_email' => env('SECURITY_ALERT_EMAIL', 'admin@school.edu'),
    ],
];