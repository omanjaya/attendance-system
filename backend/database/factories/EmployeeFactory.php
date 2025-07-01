<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Employee;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Employee>
 */
class EmployeeFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Employee::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'user_id' => User::factory(),
            'name' => fake()->name(),
            'employee_number' => 'EMP' . fake()->unique()->numberBetween(1000, 9999),
            'email' => fake()->unique()->safeEmail(),
            'phone' => '+62' . fake()->numerify('##########'),
            'department' => fake()->randomElement(['IT', 'HR', 'Finance', 'Academic', 'Administration']),
            'position' => fake()->jobTitle(),
            'employee_type' => fake()->randomElement(['permanent', 'honorary', 'contract']),
            'status' => fake()->randomElement(['active', 'inactive']),
            'join_date' => fake()->dateTimeBetween('-2 years', 'now'),
            'salary' => fake()->numberBetween(3000000, 15000000),
            'hourly_rate' => fake()->numberBetween(50000, 200000),
            'address' => fake()->address(),
            'date_of_birth' => fake()->dateTimeBetween('-60 years', '-18 years'),
            'national_id' => fake()->numerify('################'),
            'bank_account' => fake()->numerify('############'),
            'emergency_contact_name' => fake()->name(),
            'emergency_contact_phone' => '+62' . fake()->numerify('##########'),
            'notes' => fake()->optional()->paragraph(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Create a permanent teacher.
     */
    public function permanentTeacher(): static
    {
        return $this->state(fn (array $attributes) => [
            'employee_type' => 'permanent',
            'department' => 'Academic',
            'position' => 'Teacher',
            'salary' => fake()->numberBetween(5000000, 12000000),
        ]);
    }

    /**
     * Create an honorary teacher.
     */
    public function honoraryTeacher(): static
    {
        return $this->state(fn (array $attributes) => [
            'employee_type' => 'honorary',
            'department' => 'Academic',
            'position' => 'Honorary Teacher',
            'salary' => null,
            'hourly_rate' => fake()->numberBetween(75000, 150000),
        ]);
    }

    /**
     * Create a staff member.
     */
    public function staff(): static
    {
        return $this->state(fn (array $attributes) => [
            'employee_type' => 'permanent',
            'department' => fake()->randomElement(['IT', 'HR', 'Finance', 'Administration']),
            'position' => fake()->randomElement(['Manager', 'Officer', 'Analyst', 'Coordinator']),
            'salary' => fake()->numberBetween(4000000, 10000000),
        ]);
    }

    /**
     * Create an active employee.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }

    /**
     * Create an inactive employee.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'inactive',
        ]);
    }

    /**
     * Create an employee in specific department.
     */
    public function inDepartment(string $department): static
    {
        return $this->state(fn (array $attributes) => [
            'department' => $department,
        ]);
    }

    /**
     * Create an employee with specific employee number.
     */
    public function withEmployeeNumber(string $employeeNumber): static
    {
        return $this->state(fn (array $attributes) => [
            'employee_number' => $employeeNumber,
        ]);
    }

    /**
     * Create an employee with specific email.
     */
    public function withEmail(string $email): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => $email,
        ]);
    }

    /**
     * Create an employee without a user account.
     */
    public function withoutUser(): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => null,
        ]);
    }

    /**
     * Create an employee with a specific user.
     */
    public function forUser(User $user): static
    {
        return $this->state(fn (array $attributes) => [
            'user_id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
        ]);
    }
}