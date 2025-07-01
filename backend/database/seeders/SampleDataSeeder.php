<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Employee;
use App\Models\Period;
use App\Models\Schedule;
use Illuminate\Support\Facades\Hash;

class SampleDataSeeder extends Seeder
{
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@school.edu',
            'password' => Hash::make('password123'),
        ]);
        $admin->assignRole('super_admin');

        // Create HR manager
        $hrManager = User::create([
            'name' => 'HR Manager',
            'email' => 'hr@school.edu',
            'password' => Hash::make('password123'),
        ]);
        $hrManager->assignRole('hr_manager');

        // Create teacher user
        $teacher = User::create([
            'name' => 'John Teacher',
            'email' => 'teacher@school.edu',
            'password' => Hash::make('password123'),
        ]);
        $teacher->assignRole('teacher');

        // Create sample employees
        $adminEmployee = Employee::create([
            'user_id' => $admin->id,
            'employee_id' => 'EMP001',
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@school.edu',
            'phone' => '+1234567890',
            'type' => 'permanent_staff',
            'position' => 'System Administrator',
            'department' => 'IT',
            'hire_date' => '2024-01-01',
            'salary' => 75000.00,
            'status' => 'active',
        ]);

        $hrEmployee = Employee::create([
            'user_id' => $hrManager->id,
            'employee_id' => 'EMP002',
            'first_name' => 'HR',
            'last_name' => 'Manager',
            'email' => 'hr@school.edu',
            'phone' => '+1234567891',
            'type' => 'permanent_staff',
            'position' => 'HR Manager',
            'department' => 'Human Resources',
            'hire_date' => '2024-01-01',
            'salary' => 70000.00,
            'status' => 'active',
        ]);

        $teacherEmployee = Employee::create([
            'user_id' => $teacher->id,
            'employee_id' => 'EMP003',
            'first_name' => 'John',
            'last_name' => 'Teacher',
            'email' => 'teacher@school.edu',
            'phone' => '+1234567892',
            'type' => 'permanent_teacher',
            'position' => 'Mathematics Teacher',
            'department' => 'Academic',
            'hire_date' => '2024-01-01',
            'salary' => 60000.00,
            'status' => 'active',
        ]);

        // Create honorary teacher (no user account)
        $honoraryTeacher = Employee::create([
            'employee_id' => 'EMP004',
            'first_name' => 'Alice',
            'last_name' => 'Honorary',
            'email' => 'alice.honorary@school.edu',
            'phone' => '+1234567893',
            'type' => 'honorary_teacher',
            'position' => 'English Teacher',
            'department' => 'Academic',
            'hire_date' => '2024-01-01',
            'hourly_rate' => 25.00,
            'status' => 'active',
        ]);

        // Create school periods
        $periods = [
            ['name' => '1st Period', 'start_time' => '08:00', 'end_time' => '09:00', 'type' => 'teaching', 'sort_order' => 1],
            ['name' => '2nd Period', 'start_time' => '09:00', 'end_time' => '10:00', 'type' => 'teaching', 'sort_order' => 2],
            ['name' => 'Break', 'start_time' => '10:00', 'end_time' => '10:15', 'type' => 'break', 'sort_order' => 3],
            ['name' => '3rd Period', 'start_time' => '10:15', 'end_time' => '11:15', 'type' => 'teaching', 'sort_order' => 4],
            ['name' => '4th Period', 'start_time' => '11:15', 'end_time' => '12:15', 'type' => 'teaching', 'sort_order' => 5],
            ['name' => 'Lunch', 'start_time' => '12:15', 'end_time' => '13:00', 'type' => 'lunch', 'sort_order' => 6],
            ['name' => '5th Period', 'start_time' => '13:00', 'end_time' => '14:00', 'type' => 'teaching', 'sort_order' => 7],
            ['name' => '6th Period', 'start_time' => '14:00', 'end_time' => '15:00', 'type' => 'teaching', 'sort_order' => 8],
        ];

        foreach ($periods as $period) {
            Period::create($period);
        }

        // Create sample schedules for teachers
        $mathPeriods = Period::whereIn('name', ['1st Period', '3rd Period', '5th Period'])->get();
        foreach ($mathPeriods as $period) {
            foreach (['monday', 'tuesday', 'wednesday', 'thursday', 'friday'] as $day) {
                Schedule::create([
                    'employee_id' => $teacherEmployee->id,
                    'period_id' => $period->id,
                    'day_of_week' => $day,
                    'start_time' => $period->start_time,
                    'end_time' => $period->end_time,
                    'subject' => 'Mathematics',
                    'classroom' => 'Room A101',
                    'schedule_type' => 'fixed',
                    'effective_from' => '2024-01-01',
                    'is_active' => true,
                ]);
            }
        }

        // Create flexible schedule for honorary teacher
        $englishPeriods = Period::whereIn('name', ['2nd Period', '4th Period'])->get();
        foreach ($englishPeriods as $period) {
            foreach (['monday', 'wednesday', 'friday'] as $day) {
                Schedule::create([
                    'employee_id' => $honoraryTeacher->id,
                    'period_id' => $period->id,
                    'day_of_week' => $day,
                    'start_time' => $period->start_time,
                    'end_time' => $period->end_time,
                    'subject' => 'English',
                    'classroom' => 'Room B201',
                    'schedule_type' => 'flexible',
                    'effective_from' => '2024-01-01',
                    'is_active' => true,
                ]);
            }
        }
    }
}
