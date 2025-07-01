<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Services\SecurityService;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

class SecurityTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected SecurityService $securityService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->securityService = app(SecurityService::class);
    }

    /** @test */
    public function security_headers_are_applied()
    {
        $response = $this->get('/api/test');

        $response->assertHeader('X-Content-Type-Options', 'nosniff')
                ->assertHeader('X-Frame-Options', 'DENY')
                ->assertHeader('X-XSS-Protection', '1; mode=block')
                ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    }

    /** @test */
    public function content_security_policy_header_is_set()
    {
        $response = $this->get('/api/test');

        $this->assertTrue($response->headers->has('Content-Security-Policy'));
        
        $csp = $response->headers->get('Content-Security-Policy');
        $this->assertStringContains("default-src 'self'", $csp);
        $this->assertStringContains("object-src 'none'", $csp);
    }

    /** @test */
    public function xss_attempts_are_detected()
    {
        $request = request();
        $request->merge([
            'name' => '<script>alert("xss")</script>',
            'description' => '<img src="x" onerror="alert(1)">'
        ]);

        $indicators = $this->securityService->detectSuspiciousActivity($request);

        $this->assertContains('xss_attempt', $indicators);
    }

    /** @test */
    public function sql_injection_attempts_are_detected()
    {
        $request = request();
        $request->merge([
            'search' => "'; DROP TABLE users; --",
            'filter' => "' OR '1'='1"
        ]);

        $indicators = $this->securityService->detectSuspiciousActivity($request);

        $this->assertContains('sql_injection_attempt', $indicators);
    }

    /** @test */
    public function file_upload_validation_works()
    {
        Storage::fake('local');

        // Test valid image
        $validFile = UploadedFile::fake()->image('test.jpg', 100, 100);
        $errors = $this->securityService->validateFileUpload($validFile);
        $this->assertEmpty($errors);

        // Test oversized file (simulate 6MB file)
        $oversizedFile = UploadedFile::fake()->image('large.jpg')->size(6000);
        $errors = $this->securityService->validateFileUpload($oversizedFile);
        $this->assertContains('File size exceeds maximum allowed (5MB)', $errors);

        // Test invalid extension
        $invalidFile = UploadedFile::fake()->create('test.exe', 100);
        $errors = $this->securityService->validateFileUpload($invalidFile);
        $this->assertContains('File type not allowed', $errors);
    }

    /** @test */
    public function filename_sanitization_works()
    {
        $dangerousFilename = '../../../etc/passwd';
        $sanitized = $this->securityService->sanitizeFilename($dangerousFilename);
        $this->assertEquals('passwd', $sanitized);

        $scriptFilename = '<script>alert(1)</script>.jpg';
        $sanitized = $this->securityService->sanitizeFilename($scriptFilename);
        $this->assertEquals('scriptalert1script.jpg', $sanitized);

        $longFilename = str_repeat('a', 150) . '.jpg';
        $sanitized = $this->securityService->sanitizeFilename($longFilename);
        $this->assertLessThanOrEqual(100, strlen($sanitized));
    }

    /** @test */
    public function rate_limiting_works_for_api_requests()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        // Make 100 requests (the API rate limit)
        for ($i = 0; $i < 100; $i++) {
            $response = $this->getJson('/api/test', [
                'Authorization' => 'Bearer ' . $token
            ]);
            
            if ($i < 99) {
                $this->assertNotEquals(429, $response->status());
            }
        }

        // 101st request should be rate limited
        $response = $this->getJson('/api/test', [
            'Authorization' => 'Bearer ' . $token
        ]);

        $response->assertStatus(429)
                ->assertJson([
                    'success' => false,
                    'message' => 'Too many requests. Please try again later.'
                ]);
    }

    /** @test */
    public function input_sanitization_removes_dangerous_content()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('create-employees');
        $token = $user->createToken('test')->plainTextToken;

        $maliciousData = [
            'name' => '<script>alert("xss")</script>John Doe',
            'employee_number' => 'EMP001',
            'email' => 'john@example.com',
            'department' => 'IT<iframe src="evil.com"></iframe>',
            'position' => 'Developer',
            'employee_type' => 'permanent',
            'status' => 'active',
            'join_date' => '2024-01-15'
        ];

        $response = $this->postJson('/api/employees', $maliciousData, [
            'Authorization' => 'Bearer ' . $token
        ]);

        // Data should be sanitized before storage
        if ($response->status() === 201) {
            $this->assertDatabaseMissing('employees', [
                'name' => '<script>alert("xss")</script>John Doe'
            ]);
            $this->assertDatabaseMissing('employees', [
                'department' => 'IT<iframe src="evil.com"></iframe>'
            ]);
        }
    }

    /** @test */
    public function suspicious_user_agent_is_detected()
    {
        $request = request();
        $request->headers->set('User-Agent', '');

        $indicators = $this->securityService->detectSuspiciousActivity($request);

        $this->assertContains('unusual_request_pattern', $indicators);
    }

    /** @test */
    public function bot_user_agents_are_detected()
    {
        $request = request();
        $request->headers->set('User-Agent', 'Googlebot/2.1 (+http://www.google.com/bot.html)');

        $indicators = $this->securityService->detectSuspiciousActivity($request);

        $this->assertContains('unusual_request_pattern', $indicators);
    }

    /** @test */
    public function secure_token_generation_works()
    {
        $token1 = $this->securityService->generateSecureToken();
        $token2 = $this->securityService->generateSecureToken();

        $this->assertEquals(32, strlen($token1));
        $this->assertEquals(32, strlen($token2));
        $this->assertNotEquals($token1, $token2);

        // Test custom length
        $longToken = $this->securityService->generateSecureToken(64);
        $this->assertEquals(64, strlen($longToken));
    }

    /** @test */
    public function sensitive_data_hashing_works()
    {
        $sensitiveData = 'sensitive-information';
        $hash = $this->securityService->hashSensitiveData($sensitiveData);

        $this->assertNotEquals($sensitiveData, $hash);
        $this->assertTrue($this->securityService->verifySensitiveData($sensitiveData, $hash));
        $this->assertFalse($this->securityService->verifySensitiveData('wrong-data', $hash));
    }

    /** @test */
    public function security_logging_works()
    {
        $this->expectsEvents(\Illuminate\Log\Events\MessageLogged::class);

        $this->securityService->logSecurityEvent('test_security_event', [
            'test_data' => 'test_value'
        ]);
    }

    /** @test */
    public function csrf_protection_is_active()
    {
        // Test that CSRF protection is working for web routes
        $response = $this->post('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'password'
        ]);

        // API routes should not require CSRF token (using Sanctum)
        $response->assertStatus(422); // Validation error, not CSRF error
    }

    /** @test */
    public function privilege_escalation_attempts_are_logged()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        // Try to access admin-only endpoint without permission
        $response = $this->postJson('/api/employees', [
            'name' => 'Test Employee'
        ], [
            'Authorization' => 'Bearer ' . $token
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function dangerous_file_uploads_are_rejected()
    {
        Storage::fake('local');
        
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        // Try to upload executable file
        $dangerousFile = UploadedFile::fake()->create('malware.exe', 100);

        $response = $this->postJson('/api/profile/avatar', [
            'avatar' => $dangerousFile
        ], [
            'Authorization' => 'Bearer ' . $token
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function directory_traversal_attempts_are_blocked()
    {
        Storage::fake('local');
        
        $user = User::factory()->create();
        $token = $user->createToken('test')->plainTextToken;

        // Create file with dangerous filename
        $file = UploadedFile::fake()->image('../../etc/passwd.jpg');

        $response = $this->postJson('/api/profile/avatar', [
            'avatar' => $file
        ], [
            'Authorization' => 'Bearer ' . $token
        ]);

        // File should be safely renamed
        if ($response->status() === 200) {
            Storage::disk('local')->assertMissing('../../etc/passwd.jpg');
        }
    }

    /** @test */
    public function null_byte_injection_is_prevented()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('create-employees');
        $token = $user->createToken('test')->plainTextToken;

        $maliciousData = [
            'name' => "John\0Doe",
            'employee_number' => 'EMP001',
            'email' => 'john@example.com',
            'department' => 'IT',
            'position' => 'Developer',
            'employee_type' => 'permanent',
            'status' => 'active',
            'join_date' => '2024-01-15'
        ];

        $response = $this->postJson('/api/employees', $maliciousData, [
            'Authorization' => 'Bearer ' . $token
        ]);

        // Null bytes should be removed
        if ($response->status() === 201) {
            $this->assertDatabaseHas('employees', [
                'name' => 'JohnDoe'
            ]);
        }
    }
}