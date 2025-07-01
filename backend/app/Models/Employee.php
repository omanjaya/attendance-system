<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

/**
 * Employee Model
 * 
 * Represents an employee in the school system with personal information,
 * employment details, and relationships to users and other system entities.
 * 
 * @property int $id
 * @property int $user_id
 * @property int $employee_type_id
 * @property string $employee_id
 * @property string $first_name
 * @property string $last_name
 * @property string|null $phone
 * @property string|null $address
 * @property \Carbon\Carbon|null $date_of_birth
 * @property string|null $gender
 * @property \Carbon\Carbon $hire_date
 * @property string $position
 * @property string|null $department
 * @property float|null $salary
 * @property bool $is_active
 * @property array|null $face_encodings
 * @property string|null $profile_photo
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'user_id',
        'employee_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'type',
        'position',
        'department',
        'hire_date',
        'salary',
        'hourly_rate',
        'status',
        'face_encodings',
        'profile_photo',
        'address',
        'emergency_contact_name',
        'emergency_contact_phone',
        'notes',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'hire_date' => 'date',
            'salary' => 'decimal:2',
            'hourly_rate' => 'decimal:2',
        ];
    }

    /**
     * Get the user account associated with the employee.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get all schedules for this employee.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get all attendance records for this employee.
     */
    public function attendances(): HasMany
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get all face recognition records for this employee.
     */
    public function faceRecognitions(): HasMany
    {
        return $this->hasMany(FaceRecognition::class);
    }

    /**
     * Get all leave requests for this employee.
     */
    public function leaves(): HasMany
    {
        return $this->hasMany(Leave::class);
    }

    /**
     * Get all payroll records for this employee.
     */
    public function payrolls(): HasMany
    {
        return $this->hasMany(Payroll::class);
    }

    /**
     * Get all face recognition logs for this employee.
     */
    public function faceLogs(): HasMany
    {
        return $this->hasMany(FaceLog::class);
    }

    /**
     * Get the full name attribute.
     */
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->first_name . ' ' . $this->last_name,
        );
    }

    /**
     * Get the age attribute.
     */
    protected function age(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->date_of_birth ? $this->date_of_birth->age : null,
        );
    }

    /**
     * Get the years of service attribute.
     */
    protected function yearsOfService(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->hire_date->diffInYears(now()),
        );
    }

    /**
     * Scope a query to only include active employees.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by employee type.
     */
    public function scopeOfType(Builder $query, int $employeeTypeId): Builder
    {
        return $query->where('employee_type_id', $employeeTypeId);
    }

    /**
     * Scope a query to filter by department.
     */
    public function scopeInDepartment(Builder $query, string $department): Builder
    {
        return $query->where('department', $department);
    }

    /**
     * Scope a query to filter by hire date range.
     */
    public function scopeHiredBetween(Builder $query, Carbon $startDate, Carbon $endDate): Builder
    {
        return $query->whereBetween('hire_date', [$startDate, $endDate]);
    }

    /**
     * Get active schedules for a specific date.
     */
    public function getSchedulesForDate(Carbon $date): \Illuminate\Database\Eloquent\Collection
    {
        $dayOfWeek = strtolower($date->format('l'));
        
        return $this->schedules()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->where('effective_date', '<=', $date)
            ->where(function ($query) use ($date) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            })
            ->with('period')
            ->get();
    }

    /**
     * Get attendance record for a specific date.
     */
    public function getAttendanceForDate(Carbon $date): ?AttendanceRecord
    {
        return $this->attendanceRecords()
            ->where('date', $date->format('Y-m-d'))
            ->first();
    }

    /**
     * Check if employee has face recognition configured.
     */
    public function hasFaceRecognition(): bool
    {
        return $this->face_registered;
    }

    /**
     * Check if employee is on leave for a specific date.
     */
    public function isOnLeave(Carbon $date): bool
    {
        return $this->leaveRequests()
            ->where('status', 'approved')
            ->where('start_date', '<=', $date)
            ->where('end_date', '>=', $date)
            ->exists();
    }

    /**
     * Get the employee's current salary or hourly rate.
     */
    public function getCurrentSalary(): ?float
    {
        $payrollSetting = $this->currentPayrollSetting;
        return $payrollSetting ? $payrollSetting->base_salary : $this->salary;
    }

    /**
     * Check if employee can use face recognition for attendance.
     */
    public function canUseFaceRecognition(): bool
    {
        return $this->is_active && $this->hasFaceRecognition();
    }

    /**
     * Deactivate the employee (soft delete alternative).
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Activate the employee.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Get employee's working hours for a specific month.
     */
    public function getWorkingHoursForMonth(int $year, int $month): int
    {
        return $this->attendanceRecords()
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->sum('total_hours_worked') ?? 0;
    }

    /**
     * Get employee's overtime hours for a specific month.
     */
    public function getOvertimeHoursForMonth(int $year, int $month): int
    {
        return $this->attendanceRecords()
            ->whereYear('date', $year)
            ->whereMonth('date', $month)
            ->sum('overtime_hours') ?? 0;
    }
}