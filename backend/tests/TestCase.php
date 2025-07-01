<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * Setup the test environment.
     */
    protected function setUp(): void
    {
        parent::setUp();

        // Clear any existing cache
        $this->artisan('cache:clear');
        $this->artisan('config:clear');
        
        // Set up permissions and roles if using RefreshDatabase
        if (in_array(RefreshDatabase::class, class_uses_recursive(static::class))) {
            $this->setupPermissionsAndRoles();
        }
    }

    /**
     * Setup permissions and roles for testing.
     */
    protected function setupPermissionsAndRoles(): void
    {
        // Clear any existing cache
        \Artisan::call('permission:cache-reset');
        
        // Create permissions
        $permissions = [
            'view-employees',
            'create-employees', 
            'edit-employees',
            'delete-employees',
            'import-employees',
            'export-employees',
            'view-attendance',
            'create-attendance',
            'edit-attendance',
            'delete-attendance',
            'manual-attendance',
            'view-payroll',
            'create-payroll',
            'edit-payroll',
            'delete-payroll',
            'calculate-payroll',
            'generate-payroll',
            'approve-payroll',
            'view-leaves',
            'create-leaves',
            'edit-leaves',
            'delete-leaves',
            'approve-leave',
            'view-schedules',
            'create-schedule',
            'edit-schedule',
            'delete-schedule',
            'view-reports',
            'generate-reports',
            'export-reports',
            'send-notifications',
            'manage-notifications',
            'manage-face-recognition',
            'manage-calendar',
            'manage-periods',
            'manage-settings',
            'manage-users',
            'manage-roles',
        ];

        foreach ($permissions as $permission) {
            if (!Permission::where('name', $permission)->where('guard_name', 'web')->exists()) {
                Permission::create(['name' => $permission, 'guard_name' => 'web']);
            }
        }

        // Create roles - check if exists first
        $adminRole = Role::where('name', 'admin')->where('guard_name', 'web')->first();
        if (!$adminRole) {
            $adminRole = Role::create(['name' => 'admin', 'guard_name' => 'web']);
        }
        
        $hrRole = Role::where('name', 'hr')->where('guard_name', 'web')->first();
        if (!$hrRole) {
            $hrRole = Role::create(['name' => 'hr', 'guard_name' => 'web']);
        }
        
        $employeeRole = Role::where('name', 'employee')->where('guard_name', 'web')->first();
        if (!$employeeRole) {
            $employeeRole = Role::create(['name' => 'employee', 'guard_name' => 'web']);
        }
        
        $managerRole = Role::where('name', 'manager')->where('guard_name', 'web')->first();
        if (!$managerRole) {
            $managerRole = Role::create(['name' => 'manager', 'guard_name' => 'web']);
        }

        // Assign permissions to roles
        $adminRole->syncPermissions(Permission::all());
        
        $hrRole->syncPermissions([
            'view-employees', 'create-employees', 'edit-employees', 'delete-employees',
            'import-employees', 'export-employees',
            'view-attendance', 'edit-attendance', 'manual-attendance',
            'view-payroll', 'create-payroll', 'edit-payroll', 'calculate-payroll',
            'generate-payroll', 'approve-payroll',
            'view-leaves', 'approve-leave',
            'view-schedules', 'create-schedule', 'edit-schedule', 'delete-schedule',
            'view-reports', 'generate-reports', 'export-reports',
            'send-notifications', 'manage-notifications',
        ]);

        $managerRole->syncPermissions([
            'view-employees', 'edit-employees',
            'view-attendance', 'edit-attendance', 'manual-attendance',
            'view-payroll', 'approve-payroll',
            'view-leaves', 'approve-leave',
            'view-schedules', 'create-schedule', 'edit-schedule',
            'view-reports', 'generate-reports',
            'send-notifications',
        ]);

        $employeeRole->syncPermissions([
            'view-employees',
            'view-attendance', 'create-attendance',
            'view-payroll',
            'create-leaves',
            'view-schedules',
        ]);
    }

    /**
     * Create a user with specific role and permissions.
     */
    protected function createUserWithRole(string $roleName, array $additionalPermissions = []): \App\Models\User
    {
        $user = \App\Models\User::factory()->create();
        $user->assignRole($roleName);
        
        if (!empty($additionalPermissions)) {
            $user->givePermissionTo($additionalPermissions);
        }
        
        return $user;
    }

    /**
     * Create an authenticated request.
     */
    protected function authenticatedRequest(\App\Models\User $user): array
    {
        $token = $user->createToken('test-token')->plainTextToken;
        
        return [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
            'Content-Type' => 'application/json',
        ];
    }

    /**
     * Assert that response has security headers.
     */
    protected function assertHasSecurityHeaders($response): void
    {
        $response->assertHeader('X-Content-Type-Options', 'nosniff')
                ->assertHeader('X-Frame-Options', 'DENY')
                ->assertHeader('X-XSS-Protection', '1; mode=block')
                ->assertHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        $this->assertTrue($response->headers->has('Content-Security-Policy'));
    }

    /**
     * Assert that response is rate limited.
     */
    protected function assertRateLimited($response): void
    {
        $response->assertStatus(429)
                ->assertJson([
                    'success' => false,
                    'message' => 'Too many requests. Please try again later.'
                ]);
    }

    /**
     * Assert that response has validation errors.
     */
    protected function assertValidationError($response, array $fields): void
    {
        $response->assertStatus(422)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'errors'
                ])
                ->assertJson(['success' => false]);
        
        foreach ($fields as $field) {
            $response->assertJsonValidationErrors($field);
        }
    }

    /**
     * Assert that response indicates permission denied.
     */
    protected function assertPermissionDenied($response): void
    {
        $response->assertStatus(403)
                ->assertJson([
                    'success' => false,
                ]);
    }

    /**
     * Assert that response indicates authentication required.
     */
    protected function assertAuthenticationRequired($response): void
    {
        $response->assertStatus(401);
    }

    /**
     * Get headers for file upload testing.
     */
    protected function getFileUploadHeaders(\App\Models\User $user): array
    {
        $token = $user->createToken('test-token')->plainTextToken;
        
        return [
            'Authorization' => 'Bearer ' . $token,
            'Accept' => 'application/json',
        ];
    }
}
