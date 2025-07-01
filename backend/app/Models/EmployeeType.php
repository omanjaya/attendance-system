<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;

/**
 * EmployeeType Model
 * 
 * Represents different types of employees (e.g., Teaching Staff, Administrative Staff, etc.)
 * Used for categorizing employees and applying different rules, schedules, and policies.
 * 
 * @property int $id
 * @property string $name
 * @property string|null $description
 * @property bool $is_active
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class EmployeeType extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'description',
        'is_active',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get all employees of this type.
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }

    /**
     * Get all active employees of this type.
     */
    public function activeEmployees(): HasMany
    {
        return $this->hasMany(Employee::class)->where('is_active', true);
    }

    /**
     * Scope a query to only include active employee types.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Get the total count of employees for this type.
     */
    public function getEmployeeCountAttribute(): int
    {
        return $this->employees()->count();
    }

    /**
     * Get the count of active employees for this type.
     */
    public function getActiveEmployeeCountAttribute(): int
    {
        return $this->activeEmployees()->count();
    }

    /**
     * Check if this employee type has any employees.
     */
    public function hasEmployees(): bool
    {
        return $this->employees()->exists();
    }

    /**
     * Check if this employee type can be deleted.
     * Employee types with existing employees cannot be deleted.
     */
    public function canBeDeleted(): bool
    {
        return !$this->hasEmployees();
    }

    /**
     * Deactivate the employee type instead of deleting.
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Activate the employee type.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }
}