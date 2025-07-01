<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class AuthenticationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create roles
        Role::create(['name' => 'admin']);
        Role::create(['name' => 'employee']);
        Role::create(['name' => 'hr']);
    }

    /** @test */
    public function user_can_login_with_valid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('Password123!')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Password123!'
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'roles',
                            'permissions'
                        ],
                        'token'
                    ]
                ])
                ->assertJson([
                    'success' => true
                ]);

        $this->assertAuthenticatedAs($user);
    }

    /** @test */
    public function user_cannot_login_with_invalid_credentials()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('Password123!')
        ]);

        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(401)
                ->assertJson([
                    'success' => false,
                    'message' => 'Invalid credentials'
                ]);

        $this->assertGuest();
    }

    /** @test */
    public function login_requires_email_and_password()
    {
        $response = $this->postJson('/api/auth/login', []);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email', 'password']);
    }

    /** @test */
    public function login_requires_valid_email_format()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => 'invalid-email',
            'password' => 'Password123!'
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function login_is_rate_limited()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('Password123!')
        ]);

        // Make 5 failed login attempts
        for ($i = 0; $i < 5; $i++) {
            $this->postJson('/api/auth/login', [
                'email' => 'test@example.com',
                'password' => 'wrongpassword'
            ]);
        }

        // 6th attempt should be rate limited
        $response = $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword'
        ]);

        $response->assertStatus(429)
                ->assertJson([
                    'success' => false,
                    'message' => 'Too many requests. Please try again later.'
                ]);
    }

    /** @test */
    public function user_can_logout()
    {
        $user = User::factory()->create();
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->postJson('/api/auth/logout', [], [
            'Authorization' => 'Bearer ' . $token
        ]);

        $response->assertStatus(200)
                ->assertJson([
                    'success' => true,
                    'message' => 'Logged out successfully'
                ]);

        // Token should be deleted
        $this->assertDatabaseMissing('personal_access_tokens', [
            'tokenable_id' => $user->id,
            'tokenable_type' => User::class
        ]);
    }

    /** @test */
    public function user_can_get_user_data_when_authenticated()
    {
        $user = User::factory()->create();
        $user->assignRole('employee');
        
        $employee = Employee::factory()->create(['user_id' => $user->id]);
        
        $token = $user->createToken('test-token')->plainTextToken;

        $response = $this->getJson('/api/auth/user', [
            'Authorization' => 'Bearer ' . $token
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'user' => [
                            'id',
                            'name',
                            'email',
                            'employee',
                            'roles',
                            'permissions'
                        ]
                    ]
                ])
                ->assertJson([
                    'success' => true,
                    'data' => [
                        'user' => [
                            'id' => $user->id,
                            'email' => $user->email
                        ]
                    ]
                ]);
    }

    /** @test */
    public function unauthenticated_user_cannot_access_protected_routes()
    {
        $response = $this->getJson('/api/auth/user');

        $response->assertStatus(401);
    }

    /** @test */
    public function invalid_token_is_rejected()
    {
        $response = $this->getJson('/api/auth/user', [
            'Authorization' => 'Bearer invalid-token'
        ]);

        $response->assertStatus(401);
    }

    /** @test */
    public function login_input_is_sanitized_against_xss()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => '<script>alert("xss")</script>@example.com',
            'password' => '<script>alert("xss")</script>'
        ]);

        $response->assertStatus(422);
        
        // Should not contain the script tags in response
        $response->assertDontSee('<script>');
        $response->assertDontSee('alert("xss")');
    }

    /** @test */
    public function sql_injection_attempts_are_blocked()
    {
        $response = $this->postJson('/api/auth/login', [
            'email' => "'; DROP TABLE users; --",
            'password' => "' OR '1'='1"
        ]);

        $response->assertStatus(422);
        
        // Database should still exist and be intact
        $this->assertDatabaseHas('users', [
            'email' => 'test@example.com'
        ]);
    }

    /** @test */
    public function password_reset_requires_valid_email()
    {
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'nonexistent@example.com'
        ]);

        $response->assertStatus(422);
    }

    /** @test */
    public function password_reset_is_rate_limited()
    {
        $user = User::factory()->create();

        // Make 3 password reset attempts
        for ($i = 0; $i < 3; $i++) {
            $this->postJson('/api/auth/forgot-password', [
                'email' => $user->email
            ]);
        }

        // 4th attempt should be rate limited
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => $user->email
        ]);

        $response->assertStatus(429);
    }

    /** @test */
    public function authentication_events_are_logged()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('Password123!')
        ]);

        // Mock the SecurityService to verify logging
        $this->mock(\App\Services\SecurityService::class)
             ->shouldReceive('logSecurityEvent')
             ->with('authentication_successful', \Mockery::any())
             ->once();

        $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'Password123!'
        ]);
    }

    /** @test */
    public function failed_authentication_events_are_logged()
    {
        $user = User::factory()->create([
            'email' => 'test@example.com',
            'password' => Hash::make('Password123!')
        ]);

        // Mock the SecurityService to verify logging
        $this->mock(\App\Services\SecurityService::class)
             ->shouldReceive('logSecurityEvent')
             ->with('authentication_failed', \Mockery::any(), 'warning')
             ->once();

        $this->postJson('/api/auth/login', [
            'email' => 'test@example.com',
            'password' => 'wrongpassword'
        ]);
    }
}