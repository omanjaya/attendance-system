<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Employee;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class EmployeeManagementTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $adminUser;
    protected User $employeeUser;
    protected string $adminToken;
    protected string $employeeToken;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create permissions
        Permission::create(['name' => 'create-employees']);
        Permission::create(['name' => 'edit-employees']);
        Permission::create(['name' => 'delete-employees']);
        Permission::create(['name' => 'view-employees']);

        // Create roles
        $adminRole = Role::create(['name' => 'admin']);
        $employeeRole = Role::create(['name' => 'employee']);

        // Assign permissions to admin role
        $adminRole->givePermissionTo(['create-employees', 'edit-employees', 'delete-employees', 'view-employees']);
        $employeeRole->givePermissionTo(['view-employees']);

        // Create admin user
        $this->adminUser = User::factory()->create();
        $this->adminUser->assignRole('admin');
        $this->adminToken = $this->adminUser->createToken('test')->plainTextToken;

        // Create employee user
        $this->employeeUser = User::factory()->create();
        $this->employeeUser->assignRole('employee');
        $this->employeeToken = $this->employeeUser->createToken('test')->plainTextToken;
    }

    /** @test */
    public function admin_can_create_employee()
    {
        $employeeData = [
            'name' => 'John Doe',
            'employee_number' => 'EMP001',
            'email' => 'john@example.com',
            'phone' => '+6281234567890',
            'department' => 'IT',
            'position' => 'Developer',
            'employee_type' => 'permanent',
            'status' => 'active',
            'join_date' => '2024-01-15',
            'salary' => 5000000,
        ];

        $response = $this->postJson('/api/employees', $employeeData, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(201)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'employee' => [
                            'id',
                            'name',
                            'employee_number',
                            'email',
                            'department',
                            'position'
                        ]
                    ]
                ]);

        $this->assertDatabaseHas('employees', [
            'name' => 'John Doe',
            'employee_number' => 'EMP001',
            'email' => 'john@example.com'
        ]);
    }

    /** @test */
    public function employee_cannot_create_employee_without_permission()
    {
        $employeeData = [
            'name' => 'John Doe',
            'employee_number' => 'EMP001',
            'email' => 'john@example.com',
            'department' => 'IT',
            'position' => 'Developer',
            'employee_type' => 'permanent',
            'status' => 'active',
            'join_date' => '2024-01-15',
        ];

        $response = $this->postJson('/api/employees', $employeeData, [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function employee_creation_validates_required_fields()
    {
        $response = $this->postJson('/api/employees', [], [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors([
                    'name',
                    'employee_number',
                    'email',
                    'department',
                    'position',
                    'employee_type',
                    'status',
                    'join_date'
                ]);
    }

    /** @test */
    public function employee_number_must_be_unique()
    {
        Employee::factory()->create(['employee_number' => 'EMP001']);

        $employeeData = [
            'name' => 'John Doe',
            'employee_number' => 'EMP001', // Duplicate
            'email' => 'john@example.com',
            'department' => 'IT',
            'position' => 'Developer',
            'employee_type' => 'permanent',
            'status' => 'active',
            'join_date' => '2024-01-15',
        ];

        $response = $this->postJson('/api/employees', $employeeData, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['employee_number']);
    }

    /** @test */
    public function email_must_be_unique()
    {
        Employee::factory()->create(['email' => 'john@example.com']);

        $employeeData = [
            'name' => 'John Doe',
            'employee_number' => 'EMP002',
            'email' => 'john@example.com', // Duplicate
            'department' => 'IT',
            'position' => 'Developer',
            'employee_type' => 'permanent',
            'status' => 'active',
            'join_date' => '2024-01-15',
        ];

        $response = $this->postJson('/api/employees', $employeeData, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['email']);
    }

    /** @test */
    public function admin_can_view_employees_list()
    {
        Employee::factory()->count(5)->create();

        $response = $this->getJson('/api/employees', [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'employees' => [
                            '*' => [
                                'id',
                                'name',
                                'employee_number',
                                'department',
                                'position',
                                'status'
                            ]
                        ],
                        'pagination'
                    ]
                ]);
    }

    /** @test */
    public function admin_can_view_single_employee()
    {
        $employee = Employee::factory()->create();

        $response = $this->getJson("/api/employees/{$employee->id}", [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'employee' => [
                            'id',
                            'name',
                            'employee_number',
                            'email',
                            'department',
                            'position'
                        ]
                    ]
                ])
                ->assertJson([
                    'data' => [
                        'employee' => [
                            'id' => $employee->id,
                            'name' => $employee->name
                        ]
                    ]
                ]);
    }

    /** @test */
    public function admin_can_update_employee()
    {
        $employee = Employee::factory()->create();

        $updateData = [
            'name' => 'Updated Name',
            'department' => 'HR',
            'position' => 'Manager'
        ];

        $response = $this->putJson("/api/employees/{$employee->id}", $updateData, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('employees', [
            'id' => $employee->id,
            'name' => 'Updated Name',
            'department' => 'HR',
            'position' => 'Manager'
        ]);
    }

    /** @test */
    public function admin_can_delete_employee()
    {
        $employee = Employee::factory()->create();

        $response = $this->deleteJson("/api/employees/{$employee->id}", [], [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200);

        $this->assertSoftDeleted('employees', [
            'id' => $employee->id
        ]);
    }

    /** @test */
    public function admin_can_upload_employee_avatar()
    {
        Storage::fake('public');
        $employee = Employee::factory()->create();

        $file = UploadedFile::fake()->image('avatar.jpg', 200, 200);

        $response = $this->postJson("/api/employees/{$employee->id}/avatar", [
            'avatar' => $file
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200);

        Storage::disk('public')->assertExists('avatars/' . $file->hashName());
    }

    /** @test */
    public function avatar_upload_validates_file_type()
    {
        Storage::fake('public');
        $employee = Employee::factory()->create();

        $file = UploadedFile::fake()->create('document.pdf', 100);

        $response = $this->postJson("/api/employees/{$employee->id}/avatar", [
            'avatar' => $file
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['avatar']);
    }

    /** @test */
    public function avatar_upload_validates_file_size()
    {
        Storage::fake('public');
        $employee = Employee::factory()->create();

        // Create file larger than 1MB
        $file = UploadedFile::fake()->image('avatar.jpg')->size(2000);

        $response = $this->postJson("/api/employees/{$employee->id}/avatar", [
            'avatar' => $file
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['avatar']);
    }

    /** @test */
    public function avatar_upload_is_rate_limited()
    {
        Storage::fake('public');
        $employee = Employee::factory()->create();

        // Make 10 avatar upload attempts (rate limit is 10 per 10 minutes)
        for ($i = 0; $i < 10; $i++) {
            $file = UploadedFile::fake()->image("avatar{$i}.jpg");
            $this->postJson("/api/employees/{$employee->id}/avatar", [
                'avatar' => $file
            ], [
                'Authorization' => 'Bearer ' . $this->adminToken
            ]);
        }

        // 11th attempt should be rate limited
        $file = UploadedFile::fake()->image('avatar11.jpg');
        $response = $this->postJson("/api/employees/{$employee->id}/avatar", [
            'avatar' => $file
        ], [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(429);
    }

    /** @test */
    public function employee_search_works_correctly()
    {
        Employee::factory()->create(['name' => 'John Doe', 'employee_number' => 'EMP001']);
        Employee::factory()->create(['name' => 'Jane Smith', 'employee_number' => 'EMP002']);

        $response = $this->getJson('/api/employees/search?q=John', [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200)
                ->assertJsonFragment(['name' => 'John Doe'])
                ->assertJsonMissing(['name' => 'Jane Smith']);
    }

    /** @test */
    public function employee_filtering_by_department_works()
    {
        Employee::factory()->create(['department' => 'IT']);
        Employee::factory()->create(['department' => 'HR']);

        $response = $this->getJson('/api/employees/by-department/IT', [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200);
        
        $employees = $response->json('data.employees');
        foreach ($employees as $employee) {
            $this->assertEquals('IT', $employee['department']);
        }
    }

    /** @test */
    public function input_is_sanitized_against_xss()
    {
        $employeeData = [
            'name' => '<script>alert("xss")</script>John Doe',
            'employee_number' => 'EMP001',
            'email' => 'john@example.com',
            'department' => 'IT',
            'position' => '<img src="x" onerror="alert(1)">Developer',
            'employee_type' => 'permanent',
            'status' => 'active',
            'join_date' => '2024-01-15',
        ];

        $response = $this->postJson('/api/employees', $employeeData, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        // Should either reject the input or sanitize it
        if ($response->status() === 201) {
            $this->assertDatabaseMissing('employees', [
                'name' => '<script>alert("xss")</script>John Doe'
            ]);
        } else {
            $response->assertStatus(422);
        }
    }

    /** @test */
    public function sql_injection_is_prevented()
    {
        $employeeData = [
            'name' => "'; DROP TABLE employees; --",
            'employee_number' => 'EMP001',
            'email' => 'john@example.com',
            'department' => 'IT',
            'position' => 'Developer',
            'employee_type' => 'permanent',
            'status' => 'active',
            'join_date' => '2024-01-15',
        ];

        $response = $this->postJson('/api/employees', $employeeData, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        // Database should still exist
        $this->assertDatabaseHas('employees', []);
    }
}