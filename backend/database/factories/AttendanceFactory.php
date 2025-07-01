<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Attendance;
use App\Models\Employee;
use Carbon\Carbon;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Attendance>
 */
class AttendanceFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Attendance::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $clockIn = fake()->dateTimeBetween('08:00:00', '09:00:00');
        $clockOut = (clone $clockIn)->modify('+8 hours');
        
        return [
            'employee_id' => Employee::factory(),
            'date' => fake()->dateTimeBetween('-30 days', 'now')->format('Y-m-d'),
            'clock_in' => $clockIn->format('H:i:s'),
            'clock_out' => $clockOut->format('H:i:s'),
            'total_hours' => 8.0,
            'status' => fake()->randomElement(['present', 'late', 'absent']),
            'notes' => fake()->optional()->sentence(),
            'location_in' => [
                'latitude' => fake()->latitude(-90, 90),
                'longitude' => fake()->longitude(-180, 180),
                'accuracy' => fake()->numberBetween(5, 50)
            ],
            'location_out' => [
                'latitude' => fake()->latitude(-90, 90),
                'longitude' => fake()->longitude(-180, 180),
                'accuracy' => fake()->numberBetween(5, 50)
            ],
            'device_info' => [
                'user_agent' => fake()->userAgent(),
                'ip_address' => fake()->ipv4()
            ],
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Create attendance with present status.
     */
    public function present(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'present',
            'clock_in' => '08:00:00',
            'clock_out' => '17:00:00',
            'total_hours' => 8.0,
        ]);
    }

    /**
     * Create attendance with late status.
     */
    public function late(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'late',
            'clock_in' => '08:45:00',
            'clock_out' => '17:00:00',
            'total_hours' => 7.75,
        ]);
    }

    /**
     * Create attendance with absent status.
     */
    public function absent(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'absent',
            'clock_in' => null,
            'clock_out' => null,
            'total_hours' => 0,
        ]);
    }

    /**
     * Create attendance for specific date.
     */
    public function forDate(string $date): static
    {
        return $this->state(fn (array $attributes) => [
            'date' => $date,
        ]);
    }

    /**
     * Create attendance for specific employee.
     */
    public function forEmployee(Employee $employee): static
    {
        return $this->state(fn (array $attributes) => [
            'employee_id' => $employee->id,
        ]);
    }

    /**
     * Create attendance without clock out.
     */
    public function withoutClockOut(): static
    {
        return $this->state(fn (array $attributes) => [
            'clock_out' => null,
            'total_hours' => null,
        ]);
    }
}