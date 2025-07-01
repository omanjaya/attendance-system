<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;
use App\Services\SecurityService;
use Illuminate\Http\Request;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SecurityServiceTest extends TestCase
{
    private SecurityService $securityService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->securityService = new SecurityService();
    }

    /** @test */
    public function detect_sql_injection_patterns_works()
    {
        $request = new Request();
        
        // Test SQL injection patterns
        $sqlInjectionInputs = [
            "'; DROP TABLE users; --",
            "' OR '1'='1",
            "1' UNION SELECT * FROM users--",
            "'; INSERT INTO users VALUES('hacker'); --",
            "1' AND '1'='1",
        ];

        foreach ($sqlInjectionInputs as $input) {
            $request->merge(['search' => $input]);
            $indicators = $this->securityService->detectSuspiciousActivity($request);
            
            $this->assertContains('sql_injection_attempt', $indicators, 
                "Failed to detect SQL injection in: {$input}");
        }
    }

    /** @test */
    public function detect_xss_patterns_works()
    {
        $request = new Request();
        
        // Test XSS patterns
        $xssInputs = [
            '<script>alert("xss")</script>',
            '<img src="x" onerror="alert(1)">',
            'javascript:alert(1)',
            '<iframe src="javascript:alert(1)"></iframe>',
            '<object data="data:text/html,<script>alert(1)</script>"></object>',
            '<svg onload="alert(1)">',
        ];

        foreach ($xssInputs as $input) {
            $request->merge(['content' => $input]);
            $indicators = $this->securityService->detectSuspiciousActivity($request);
            
            $this->assertContains('xss_attempt', $indicators, 
                "Failed to detect XSS in: {$input}");
        }
    }

    /** @test */
    public function validate_file_upload_checks_size()
    {
        Storage::fake('local');
        
        // Test oversized file
        $oversizedFile = UploadedFile::fake()->image('large.jpg')->size(6000); // 6MB
        $errors = $this->securityService->validateFileUpload($oversizedFile);
        
        $this->assertContains('File size exceeds maximum allowed (5MB)', $errors);
    }

    /** @test */
    public function validate_file_upload_checks_extension()
    {
        Storage::fake('local');
        
        // Test invalid extension
        $dangerousFile = UploadedFile::fake()->create('malware.exe', 100);
        $errors = $this->securityService->validateFileUpload($dangerousFile);
        
        $this->assertContains('File type not allowed', $errors);
    }

    /** @test */
    public function validate_file_upload_checks_mime_type()
    {
        Storage::fake('local');
        
        // Test invalid MIME type (simulated)
        $fakeImageFile = UploadedFile::fake()->create('fake.jpg', 100, 'application/x-executable');
        $errors = $this->securityService->validateFileUpload($fakeImageFile);
        
        $this->assertContains('Invalid file format', $errors);
    }

    /** @test */
    public function sanitize_filename_removes_dangerous_characters()
    {
        $testCases = [
            '../../../etc/passwd' => 'passwd',
            'test<script>.jpg' => 'testscript.jpg',
            'file"with"quotes.png' => 'filewithquotes.png',
            'file|with|pipes.gif' => 'filewithpipes.gif',
            'file with spaces.jpg' => 'file with spaces.jpg', // Spaces should be preserved
            str_repeat('a', 150) . '.jpg' => str_repeat('a', 96) . '.jpg', // Should truncate
        ];

        foreach ($testCases as $input => $expected) {
            $result = $this->securityService->sanitizeFilename($input);
            $this->assertEquals($expected, $result, "Failed for input: {$input}");
        }
    }

    /** @test */
    public function generate_secure_token_creates_unique_tokens()
    {
        $tokens = [];
        
        // Generate 100 tokens
        for ($i = 0; $i < 100; $i++) {
            $token = $this->securityService->generateSecureToken();
            $this->assertEquals(32, strlen($token), 'Token should be 32 characters long');
            $this->assertNotContains($token, $tokens, 'Token should be unique');
            $tokens[] = $token;
        }
    }

    /** @test */
    public function generate_secure_token_respects_custom_length()
    {
        $lengths = [16, 32, 64, 128];
        
        foreach ($lengths as $length) {
            $token = $this->securityService->generateSecureToken($length);
            $this->assertEquals($length, strlen($token), "Token should be {$length} characters long");
        }
    }

    /** @test */
    public function hash_and_verify_sensitive_data_works()
    {
        $sensitiveData = 'very-sensitive-information';
        
        $hash = $this->securityService->hashSensitiveData($sensitiveData);
        
        // Hash should not equal original data
        $this->assertNotEquals($sensitiveData, $hash);
        
        // Should be able to verify correct data
        $this->assertTrue($this->securityService->verifySensitiveData($sensitiveData, $hash));
        
        // Should reject incorrect data
        $this->assertFalse($this->securityService->verifySensitiveData('wrong-data', $hash));
    }

    /** @test */
    public function detect_suspicious_request_patterns()
    {
        $request = new Request();
        
        // Test empty user agent
        $request->headers->set('User-Agent', '');
        $indicators = $this->securityService->detectSuspiciousActivity($request);
        $this->assertContains('unusual_request_pattern', $indicators);
        
        // Test bot patterns
        $botUserAgents = [
            'Googlebot/2.1',
            'Mozilla/5.0 (compatible; Bingbot/2.0)',
            'facebookexternalhit/1.1',
            'Twitterbot/1.0',
        ];
        
        foreach ($botUserAgents as $userAgent) {
            $request->headers->set('User-Agent', $userAgent);
            $indicators = $this->securityService->detectSuspiciousActivity($request);
            $this->assertContains('unusual_request_pattern', $indicators, 
                "Failed to detect bot pattern in: {$userAgent}");
        }
    }

    /** @test */
    public function detect_unusual_file_upload_patterns()
    {
        Storage::fake('local');
        
        $request = new Request();
        
        // Test dangerous file extensions
        $dangerousExtensions = ['exe', 'bat', 'cmd', 'scr', 'vbs', 'js', 'php'];
        
        foreach ($dangerousExtensions as $ext) {
            $file = UploadedFile::fake()->create("malicious.{$ext}", 100);
            $request->files->set('file', $file);
            
            $indicators = $this->securityService->detectSuspiciousActivity($request);
            $this->assertContains('suspicious_file_upload', $indicators, 
                "Failed to detect suspicious file with extension: {$ext}");
        }
    }

    /** @test */
    public function combined_attack_patterns_are_detected()
    {
        $request = new Request();
        
        // Test request with multiple attack vectors
        $request->merge([
            'search' => "'; DROP TABLE users; --",
            'content' => '<script>alert("xss")</script>',
            'name' => '<img src="x" onerror="alert(1)">'
        ]);
        $request->headers->set('User-Agent', '');
        
        $indicators = $this->securityService->detectSuspiciousActivity($request);
        
        $this->assertContains('sql_injection_attempt', $indicators);
        $this->assertContains('xss_attempt', $indicators);
        $this->assertContains('unusual_request_pattern', $indicators);
    }

    /** @test */
    public function clean_requests_pass_security_checks()
    {
        $request = new Request();
        
        // Test clean, normal request
        $request->merge([
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'search' => 'developer position',
            'description' => 'Looking for a skilled developer'
        ]);
        $request->headers->set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
        $request->headers->set('Accept', 'application/json');
        $request->headers->set('Accept-Language', 'en-US,en;q=0.9');
        
        $indicators = $this->securityService->detectSuspiciousActivity($request);
        
        $this->assertEmpty($indicators, 'Clean request should not trigger security indicators');
    }

    /** @test */
    public function edge_case_inputs_are_handled_safely()
    {
        $request = new Request();
        
        // Test edge cases
        $edgeCases = [
            '', // Empty string
            null, // Null value
            str_repeat('a', 10000), // Very long string
            '中文字符', // Unicode characters
            '🚀💻🔒', // Emojis
            "\r\n\t", // Control characters
        ];
        
        foreach ($edgeCases as $input) {
            $request->merge(['test' => $input]);
            
            // Should not throw exceptions
            $indicators = $this->securityService->detectSuspiciousActivity($request);
            $this->assertIsArray($indicators);
        }
    }
}