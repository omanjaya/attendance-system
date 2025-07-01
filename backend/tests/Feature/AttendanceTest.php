<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Employee;
use App\Models\Attendance;
use Carbon\Carbon;

class AttendanceTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    protected User $adminUser;
    protected User $employeeUser;
    protected Employee $employee;
    protected string $adminToken;
    protected string $employeeToken;

    protected function setUp(): void
    {
        parent::setUp();
        
        // Create users and employees
        $this->adminUser = $this->createUserWithRole('admin');
        $this->adminToken = $this->adminUser->createToken('test')->plainTextToken;

        $this->employeeUser = $this->createUserWithRole('employee');
        $this->employee = Employee::factory()->forUser($this->employeeUser)->create();
        $this->employeeToken = $this->employeeUser->createToken('test')->plainTextToken;
    }

    /** @test */
    public function employee_can_clock_in()
    {
        $response = $this->postJson('/api/attendance/clock-in', [
            'employee_id' => $this->employee->id,
            'location' => [
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'accuracy' => 10
            ]
        ], [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'message',
                    'data' => [
                        'attendance' => [
                            'id',
                            'employee_id',
                            'date',
                            'clock_in',
                            'status'
                        ]
                    ]
                ]);

        $this->assertDatabaseHas('attendances', [
            'employee_id' => $this->employee->id,
            'date' => now()->toDateString(),
        ]);
    }

    /** @test */
    public function employee_can_clock_out()
    {
        // First create an attendance record
        $attendance = Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'date' => now()->toDateString(),
            'clock_in' => now()->subHours(8),
            'clock_out' => null,
            'status' => 'present'
        ]);

        $response = $this->postJson('/api/attendance/clock-out', [
            'employee_id' => $this->employee->id,
        ], [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(200);

        $attendance->refresh();
        $this->assertNotNull($attendance->clock_out);
    }

    /** @test */
    public function employee_cannot_clock_in_twice_same_day()
    {
        // Create existing attendance
        Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'date' => now()->toDateString(),
            'clock_in' => now()->subHours(2),
        ]);

        $response = $this->postJson('/api/attendance/clock-in', [
            'employee_id' => $this->employee->id,
        ], [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(422)
                ->assertJsonFragment([
                    'message' => 'Already clocked in today'
                ]);
    }

    /** @test */
    public function admin_can_view_all_attendance_records()
    {
        Attendance::factory()->count(5)->create();

        $response = $this->getJson('/api/attendance', [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'attendances' => [
                            '*' => [
                                'id',
                                'employee_id',
                                'date',
                                'clock_in',
                                'clock_out',
                                'status'
                            ]
                        ]
                    ]
                ]);
    }

    /** @test */
    public function admin_can_create_manual_attendance_entry()
    {
        $attendanceData = [
            'employee_id' => $this->employee->id,
            'date' => now()->toDateString(),
            'clock_in' => '08:00:00',
            'clock_out' => '17:00:00',
            'status' => 'present',
            'notes' => 'Manual entry'
        ];

        $response = $this->postJson('/api/attendance/manual', $attendanceData, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('attendances', [
            'employee_id' => $this->employee->id,
            'date' => now()->toDateString(),
            'notes' => 'Manual entry'
        ]);
    }

    /** @test */
    public function employee_cannot_create_manual_attendance_entry()
    {
        $attendanceData = [
            'employee_id' => $this->employee->id,
            'date' => now()->toDateString(),
            'clock_in' => '08:00:00',
            'clock_out' => '17:00:00',
            'status' => 'present'
        ];

        $response = $this->postJson('/api/attendance/manual', $attendanceData, [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(403);
    }

    /** @test */
    public function attendance_status_is_calculated_correctly()
    {
        // Late arrival (after 8:30 AM)
        $lateAttendance = [
            'employee_id' => $this->employee->id,
            'date' => now()->toDateString(),
            'clock_in' => '09:00:00',
            'clock_out' => '17:00:00',
        ];

        $response = $this->postJson('/api/attendance/manual', $lateAttendance, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(201);

        $this->assertDatabaseHas('attendances', [
            'employee_id' => $this->employee->id,
            'status' => 'late'
        ]);
    }

    /** @test */
    public function attendance_requires_valid_employee_id()
    {
        $response = $this->postJson('/api/attendance/clock-in', [
            'employee_id' => 99999, // Non-existent employee
        ], [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['employee_id']);
    }

    /** @test */
    public function attendance_validates_location_data()
    {
        $response = $this->postJson('/api/attendance/clock-in', [
            'employee_id' => $this->employee->id,
            'location' => [
                'latitude' => 200, // Invalid latitude
                'longitude' => 300, // Invalid longitude
            ]
        ], [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['location.latitude', 'location.longitude']);
    }

    /** @test */
    public function attendance_history_can_be_filtered()
    {
        // Create attendance records for different dates
        Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'date' => now()->subDays(1),
        ]);
        
        Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'date' => now()->subDays(7),
        ]);

        $response = $this->getJson('/api/attendance/history?start_date=' . now()->subDays(3)->toDateString(), [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(200);
        
        // Should only return records from the last 3 days
        $attendances = $response->json('data.attendances');
        $this->assertCount(1, $attendances);
    }

    /** @test */
    public function attendance_summary_is_calculated_correctly()
    {
        // Create test data
        Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'status' => 'present',
            'total_hours' => 8,
            'date' => now()->startOfMonth(),
        ]);
        
        Attendance::factory()->create([
            'employee_id' => $this->employee->id,
            'status' => 'late',
            'total_hours' => 7.5,
            'date' => now()->startOfMonth()->addDay(),
        ]);

        $response = $this->getJson('/api/attendance/summary', [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'summary' => [
                            'total_days',
                            'present_days',
                            'late_days',
                            'absent_days',
                            'total_hours',
                            'average_hours'
                        ]
                    ]
                ]);
    }

    /** @test */
    public function attendance_export_works()
    {
        Attendance::factory()->count(3)->create();

        $response = $this->getJson('/api/attendance/export/excel', [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200);
        $this->assertEquals('application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 
                           $response->headers->get('content-type'));
    }

    /** @test */
    public function attendance_calendar_view_works()
    {
        Attendance::factory()->count(5)->create([
            'date' => now()->startOfMonth(),
        ]);

        $response = $this->getJson('/api/attendance/calendar?month=' . now()->month . '&year=' . now()->year, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(200)
                ->assertJsonStructure([
                    'success',
                    'data' => [
                        'calendar_data' => [
                            '*' => [
                                'date',
                                'attendances'
                            ]
                        ]
                    ]
                ]);
    }

    /** @test */
    public function face_recognition_data_is_validated()
    {
        $response = $this->postJson('/api/attendance/clock-in', [
            'employee_id' => $this->employee->id,
            'face_data' => str_repeat('a', 15000), // Too long
        ], [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(422)
                ->assertJsonValidationErrors(['face_data']);
    }

    /** @test */
    public function device_info_is_captured_and_sanitized()
    {
        $response = $this->postJson('/api/attendance/clock-in', [
            'employee_id' => $this->employee->id,
            'device_info' => [
                'user_agent' => '<script>alert("xss")</script>Mozilla/5.0',
                'ip_address' => '192.168.1.1'
            ]
        ], [
            'Authorization' => 'Bearer ' . $this->employeeToken
        ]);

        $response->assertStatus(200);

        // Check that malicious content was sanitized
        $attendance = Attendance::latest()->first();
        $this->assertStringNotContainsString('<script>', $attendance->device_info['user_agent'] ?? '');
    }

    /** @test */
    public function bulk_import_validates_data()
    {
        $invalidData = [
            'attendances' => [
                [
                    'employee_id' => 'invalid',
                    'date' => 'invalid-date',
                    'clock_in' => 'invalid-time',
                ]
            ]
        ];

        $response = $this->postJson('/api/attendance/bulk-import', $invalidData, [
            'Authorization' => 'Bearer ' . $this->adminToken
        ]);

        $response->assertStatus(422);
    }
}