<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

/**
 * Schedule Model
 * 
 * Represents the work schedule for employees, linking them to specific periods
 * on specific days of the week with effective date ranges.
 * 
 * @property int $id
 * @property int $employee_id
 * @property int $period_id
 * @property string $day_of_week
 * @property \Carbon\Carbon $effective_date
 * @property \Carbon\Carbon|null $end_date
 * @property bool $is_active
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class Schedule extends Model
{
    use HasFactory;

    /**
     * Days of the week
     */
    public const DAYS = [
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'employee_id',
        'period_id',
        'day_of_week',
        'effective_date',
        'end_date',
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
            'effective_date' => 'date',
            'end_date' => 'date',
            'is_active' => 'boolean',
        ];
    }

    /**
     * Get the employee that owns the schedule.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the period associated with the schedule.
     */
    public function period(): BelongsTo
    {
        return $this->belongsTo(Period::class);
    }

    /**
     * Scope a query to only include active schedules.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by employee.
     */
    public function scopeForEmployee(Builder $query, int $employeeId): Builder
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope a query to filter by day of week.
     */
    public function scopeForDay(Builder $query, string $dayOfWeek): Builder
    {
        return $query->where('day_of_week', strtolower($dayOfWeek));
    }

    /**
     * Scope a query to filter by period type.
     */
    public function scopeForPeriodType(Builder $query, string $type): Builder
    {
        return $query->whereHas('period', function ($q) use ($type) {
            $q->where('type', $type);
        });
    }

    /**
     * Scope a query to get schedules effective on a specific date.
     */
    public function scopeEffectiveOn(Builder $query, Carbon $date): Builder
    {
        return $query->where('effective_date', '<=', $date)
            ->where(function ($q) use ($date) {
                $q->whereNull('end_date')
                    ->orWhere('end_date', '>=', $date);
            });
    }

    /**
     * Scope a query to get current schedules.
     */
    public function scopeCurrent(Builder $query): Builder
    {
        return $query->effectiveOn(now());
    }

    /**
     * Scope a query to get work schedules only.
     */
    public function scopeWorkOnly(Builder $query): Builder
    {
        return $query->forPeriodType(Period::TYPE_WORK);
    }

    /**
     * Check if this schedule is currently effective.
     */
    public function isEffective(Carbon $date = null): bool
    {
        $date = $date ?? now();
        
        return $this->effective_date <= $date && 
               ($this->end_date === null || $this->end_date >= $date);
    }

    /**
     * Check if this schedule is for today.
     */
    public function isForToday(): bool
    {
        return $this->day_of_week === strtolower(now()->format('l'));
    }

    /**
     * Check if this schedule is for a specific date.
     */
    public function isForDate(Carbon $date): bool
    {
        return $this->day_of_week === strtolower($date->format('l')) && 
               $this->isEffective($date);
    }

    /**
     * Get the formatted day of week.
     */
    public function getFormattedDayAttribute(): string
    {
        return ucfirst($this->day_of_week);
    }

    /**
     * Get the schedule description.
     */
    public function getDescriptionAttribute(): string
    {
        return $this->formatted_day . ': ' . $this->period->name . ' (' . $this->period->time_range . ')';
    }

    /**
     * Deactivate the schedule.
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Activate the schedule.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * End the schedule on a specific date.
     */
    public function endOn(Carbon $date): bool
    {
        return $this->update(['end_date' => $date]);
    }

    /**
     * Get all available days of the week.
     */
    public static function getDays(): array
    {
        return array_combine(self::DAYS, array_map('ucfirst', self::DAYS));
    }

    /**
     * Get schedules for a specific employee and date.
     */
    public static function getForEmployeeAndDate(int $employeeId, Carbon $date): \Illuminate\Database\Eloquent\Collection
    {
        $dayOfWeek = strtolower($date->format('l'));
        
        return static::active()
            ->forEmployee($employeeId)
            ->forDay($dayOfWeek)
            ->effectiveOn($date)
            ->with('period')
            ->orderBy('period.start_time')
            ->get();
    }

    /**
     * Get work schedules for a specific employee and date.
     */
    public static function getWorkScheduleForEmployeeAndDate(int $employeeId, Carbon $date): \Illuminate\Database\Eloquent\Collection
    {
        return static::getForEmployeeAndDate($employeeId, $date)
            ->filter(function ($schedule) {
                return $schedule->period->isWork();
            });
    }

    /**
     * Calculate total working hours for an employee on a specific date.
     */
    public static function calculateWorkingHoursForDate(int $employeeId, Carbon $date): int
    {
        $workSchedules = static::getWorkScheduleForEmployeeAndDate($employeeId, $date);
        
        return $workSchedules->sum(function ($schedule) {
            return $schedule->period->duration_minutes;
        });
    }

    /**
     * Check if an employee has a schedule for a specific date.
     */
    public static function employeeHasScheduleForDate(int $employeeId, Carbon $date): bool
    {
        return static::getForEmployeeAndDate($employeeId, $date)->isNotEmpty();
    }

    /**
     * Get the earliest start time for an employee on a specific date.
     */
    public static function getEarliestStartTimeForDate(int $employeeId, Carbon $date): ?string
    {
        $schedules = static::getWorkScheduleForEmployeeAndDate($employeeId, $date);
        
        if ($schedules->isEmpty()) {
            return null;
        }

        return $schedules->min(function ($schedule) {
            return $schedule->period->start_time->format('H:i:s');
        });
    }

    /**
     * Get the latest end time for an employee on a specific date.
     */
    public static function getLatestEndTimeForDate(int $employeeId, Carbon $date): ?string
    {
        $schedules = static::getWorkScheduleForEmployeeAndDate($employeeId, $date);
        
        if ($schedules->isEmpty()) {
            return null;
        }

        return $schedules->max(function ($schedule) {
            return $schedule->period->end_time->format('H:i:s');
        });
    }
}