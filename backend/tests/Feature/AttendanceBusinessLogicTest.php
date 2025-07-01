<?php

namespace Tests\Feature;

use Tests\TestCase;
use App\Models\Employee;
use App\Models\EmployeeType;
use App\Models\AttendanceRecord;
use App\Models\AttendanceRadiusSetting;
use App\Models\Schedule;
use App\Models\Period;
use App\Models\User;
use App\Services\AttendanceCalculatorService;
use App\Services\LocationValidationService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Carbon\Carbon;

class AttendanceBusinessLogicTest extends TestCase
{
    use RefreshDatabase;

    protected AttendanceCalculatorService $attendanceCalculator;
    protected LocationValidationService $locationValidator;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->attendanceCalculator = app(AttendanceCalculatorService::class);
        $this->locationValidator = app(LocationValidationService::class);
    }

    /**
     * Test honorary teacher can only check in during scheduled periods
     */
    public function test_honorary_teacher_cannot_check_in_outside_schedule()
    {
        // Create honorary teacher type
        $honoraryType = EmployeeType::create([
            'name' => 'Honorary Teacher',
            'description' => 'Part-time honorary teacher',
            'is_active' => true,
        ]);

        // Create user and employee
        $user = User::factory()->create();
        $employee = Employee::create([
            'user_id' => $user->id,
            'employee_type_id' => $honoraryType->id,
            'employee_id' => 'HON001',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'hire_date' => now()->subMonth(),
            'position' => 'Honorary Teacher',
            'is_active' => true,
        ]);

        // Create work period (9 AM - 11 AM)
        $period = Period::create([
            'name' => 'Morning Session',
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'duration_minutes' => 120,
            'type' => Period::TYPE_WORK,
            'is_paid' => true,
            'is_active' => true,
        ]);

        // Create schedule for Monday
        Schedule::create([
            'employee_id' => $employee->id,
            'period_id' => $period->id,
            'day_of_week' => 'monday',
            'effective_date' => now()->startOfMonth(),
            'is_active' => true,
        ]);

        // Test check-in at 8 AM (before schedule) on Monday
        $monday8am = Carbon::parse('next monday')->setTime(8, 0, 0);
        $status = $this->attendanceCalculator->calculateAttendanceStatus($employee, $monday8am, $monday8am);

        $this->assertFalse($status['is_valid']);
        $this->assertEquals(AttendanceRecord::STATUS_ABSENT, $status['status']);
        $this->assertStringContainsString('Honorary teachers can only check in during scheduled periods', $status['message']);

        // Test check-in at 9:30 AM (during schedule) on Monday
        $monday930am = Carbon::parse('next monday')->setTime(9, 30, 0);
        $status = $this->attendanceCalculator->calculateAttendanceStatus($employee, $monday930am, $monday930am);

        $this->assertTrue($status['is_valid']);
        $this->assertEquals(AttendanceRecord::STATUS_LATE, $status['status']);
    }

    /**
     * Test regular employee can check in without schedule
     */
    public function test_regular_employee_can_check_in_without_schedule()
    {
        // Create regular employee type
        $regularType = EmployeeType::create([
            'name' => 'Teaching Staff',
            'description' => 'Regular teaching staff',
            'is_active' => true,
        ]);

        // Create user and employee
        $user = User::factory()->create();
        $employee = Employee::create([
            'user_id' => $user->id,
            'employee_type_id' => $regularType->id,
            'employee_id' => 'EMP001',
            'first_name' => 'Jane',
            'last_name' => 'Smith',
            'hire_date' => now()->subYear(),
            'position' => 'Teacher',
            'is_active' => true,
        ]);

        // Test check-in without any schedule
        $now = now();
        $status = $this->attendanceCalculator->calculateAttendanceStatus($employee, $now, $now);

        $this->assertTrue($status['is_valid']);
        $this->assertEquals(AttendanceRecord::STATUS_PRESENT, $status['status']);
        $this->assertStringContainsString('overtime', $status['message']);
    }

    /**
     * Test location validation with Haversine formula
     */
    public function test_location_validation_with_radius()
    {
        // Create employee type
        $employeeType = EmployeeType::create([
            'name' => 'Teaching Staff',
            'description' => 'Regular teaching staff',
            'is_active' => true,
        ]);

        // Create user and employee
        $user = User::factory()->create();
        $employee = Employee::create([
            'user_id' => $user->id,
            'employee_type_id' => $employeeType->id,
            'employee_id' => 'EMP002',
            'first_name' => 'Test',
            'last_name' => 'User',
            'hire_date' => now()->subYear(),
            'position' => 'Teacher',
            'is_active' => true,
        ]);

        // Create attendance radius setting (School location)
        $schoolLocation = AttendanceRadiusSetting::create([
            'location_name' => 'Main School Building',
            'latitude' => -6.2088,  // Jakarta coordinates
            'longitude' => 106.8456,
            'radius_meters' => 100,
            'description' => 'Main campus',
            'is_active' => true,
            'allowed_employee_types' => [$employeeType->id],
        ]);

        // Test 1: Within radius (50 meters away)
        $nearbyLat = -6.2083;
        $nearbyLon = 106.8456;
        $validation = $this->locationValidator->validateLocation($employee, $nearbyLat, $nearbyLon);

        $this->assertTrue($validation['valid']);
        $this->assertStringContainsString('Within allowed radius', $validation['message']);

        // Test 2: Outside radius (200 meters away)
        $farLat = -6.2068;
        $farLon = 106.8456;
        $validation = $this->locationValidator->validateLocation($employee, $farLat, $farLon);

        $this->assertFalse($validation['valid']);
        $this->assertStringContainsString('away from', $validation['message']);
    }

    /**
     * Test honorary teacher working hours calculation
     */
    public function test_honorary_teacher_paid_only_for_scheduled_hours()
    {
        // Create honorary teacher
        $honoraryType = EmployeeType::create([
            'name' => 'Honorary Teacher',
            'description' => 'Part-time honorary teacher',
            'is_active' => true,
        ]);

        $user = User::factory()->create();
        $employee = Employee::create([
            'user_id' => $user->id,
            'employee_type_id' => $honoraryType->id,
            'employee_id' => 'HON002',
            'first_name' => 'Honorary',
            'last_name' => 'Teacher',
            'hire_date' => now()->subMonth(),
            'position' => 'Honorary Teacher',
            'is_active' => true,
        ]);

        // Create 2-hour work period
        $period = Period::create([
            'name' => 'Teaching Period',
            'start_time' => '09:00:00',
            'end_time' => '11:00:00',
            'duration_minutes' => 120,
            'type' => Period::TYPE_WORK,
            'is_paid' => true,
            'is_active' => true,
        ]);

        // Create schedule
        Schedule::create([
            'employee_id' => $employee->id,
            'period_id' => $period->id,
            'day_of_week' => strtolower(now()->format('l')),
            'effective_date' => now()->startOfMonth(),
            'is_active' => true,
        ]);

        // Check in at 8:30 AM and check out at 11:30 AM (3 hours total)
        $checkIn = now()->setTime(8, 30, 0);
        $checkOut = now()->setTime(11, 30, 0);
        
        $workingHours = $this->attendanceCalculator->calculateWorkingHours($employee, $checkIn, $checkOut, now());

        // Should only be paid for 2 hours (scheduled time)
        $this->assertEquals(180, $workingHours['total_minutes']); // 3 hours actual
        $this->assertEquals(120, $workingHours['paid_minutes']); // 2 hours paid
        $this->assertEquals(0, $workingHours['overtime_minutes']); // No overtime for honorary
    }

    /**
     * Test late detection based on grace period
     */
    public function test_late_detection_with_grace_period()
    {
        $employeeType = EmployeeType::create([
            'name' => 'Teaching Staff',
            'is_active' => true,
        ]);

        $user = User::factory()->create();
        $employee = Employee::create([
            'user_id' => $user->id,
            'employee_type_id' => $employeeType->id,
            'employee_id' => 'EMP003',
            'first_name' => 'Test',
            'last_name' => 'Late',
            'hire_date' => now()->subYear(),
            'position' => 'Teacher',
            'is_active' => true,
        ]);

        // Create morning period starting at 8 AM
        $period = Period::create([
            'name' => 'Morning',
            'start_time' => '08:00:00',
            'end_time' => '12:00:00',
            'duration_minutes' => 240,
            'type' => Period::TYPE_WORK,
            'is_paid' => true,
            'is_active' => true,
        ]);

        Schedule::create([
            'employee_id' => $employee->id,
            'period_id' => $period->id,
            'day_of_week' => strtolower(now()->format('l')),
            'effective_date' => now()->startOfMonth(),
            'is_active' => true,
        ]);

        // Test 1: Within grace period (10 minutes late)
        $checkIn10Late = now()->setTime(8, 10, 0);
        $status = $this->attendanceCalculator->calculateAttendanceStatus($employee, now(), $checkIn10Late);
        $this->assertEquals(AttendanceRecord::STATUS_PRESENT, $status['status']);

        // Test 2: Outside grace period but not half day (30 minutes late)
        $checkIn30Late = now()->setTime(8, 30, 0);
        $status = $this->attendanceCalculator->calculateAttendanceStatus($employee, now(), $checkIn30Late);
        $this->assertEquals(AttendanceRecord::STATUS_LATE, $status['status']);

        // Test 3: Very late - half day (3 hours late)
        $checkIn3HoursLate = now()->setTime(11, 0, 0);
        $status = $this->attendanceCalculator->calculateAttendanceStatus($employee, now(), $checkIn3HoursLate);
        $this->assertEquals(AttendanceRecord::STATUS_HALF_DAY, $status['status']);
    }

    /**
     * Test API endpoint for attendance check-in
     */
    public function test_api_check_in_with_location_validation()
    {
        // Create test data
        $employeeType = EmployeeType::create([
            'name' => 'Teaching Staff',
            'is_active' => true,
        ]);

        $user = User::factory()->create();
        $employee = Employee::create([
            'user_id' => $user->id,
            'employee_type_id' => $employeeType->id,
            'employee_id' => 'EMP004',
            'first_name' => 'API',
            'last_name' => 'Test',
            'hire_date' => now()->subYear(),
            'position' => 'Teacher',
            'is_active' => true,
        ]);

        // Create location setting
        AttendanceRadiusSetting::create([
            'location_name' => 'School',
            'latitude' => -6.2088,
            'longitude' => 106.8456,
            'radius_meters' => 100,
            'is_active' => true,
            'allowed_employee_types' => [$employeeType->id],
        ]);

        // Test successful check-in
        $response = $this->actingAs($user)
            ->postJson('/api/v1/attendance/check-in', [
                'latitude' => -6.2088,
                'longitude' => 106.8456,
                'method' => 'manual',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'success' => true,
                'message' => 'Successfully checked in',
            ]);

        // Test check-in outside location
        $response = $this->actingAs($user)
            ->postJson('/api/v1/attendance/check-in', [
                'latitude' => -6.2000,
                'longitude' => 106.8456,
                'method' => 'manual',
            ]);

        $response->assertStatus(422)
            ->assertJsonFragment([
                'success' => false,
            ]);
    }
}