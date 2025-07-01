<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => Hash::make('Password123!'), // Default password
            'remember_token' => Str::random(10),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }

    /**
     * Create an admin user.
     */
    public function admin(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Admin User',
            'email' => 'admin@example.com',
        ])->afterCreating(function (User $user) {
            $user->assignRole('admin');
        });
    }

    /**
     * Create an employee user.
     */
    public function employee(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'Employee User',
        ])->afterCreating(function (User $user) {
            $user->assignRole('employee');
        });
    }

    /**
     * Create an HR user.
     */
    public function hr(): static
    {
        return $this->state(fn (array $attributes) => [
            'name' => 'HR User',
            'email' => 'hr@example.com',
        ])->afterCreating(function (User $user) {
            $user->assignRole('hr');
        });
    }

    /**
     * Create a user with custom password.
     */
    public function withPassword(string $password): static
    {
        return $this->state(fn (array $attributes) => [
            'password' => Hash::make($password),
        ]);
    }

    /**
     * Create a user with specific email.
     */
    public function withEmail(string $email): static
    {
        return $this->state(fn (array $attributes) => [
            'email' => $email,
        ]);
    }
}