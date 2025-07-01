<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;
use Carbon\Carbon;

/**
 * SchoolCalendar Model
 * 
 * Represents calendar events in the school system including holidays, school days,
 * weekends, breaks, and special events. Affects attendance and payroll calculations.
 * 
 * @property int $id
 * @property string $name
 * @property \Carbon\Carbon $date
 * @property string $type
 * @property string|null $description
 * @property bool $is_working_day
 * @property array|null $affected_employee_types
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class SchoolCalendar extends Model
{
    use HasFactory;

    /**
     * Calendar event types
     */
    public const TYPE_HOLIDAY = 'holiday';
    public const TYPE_SCHOOL_DAY = 'school_day';
    public const TYPE_WEEKEND = 'weekend';
    public const TYPE_BREAK = 'break';
    public const TYPE_EVENT = 'event';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'date',
        'type',
        'description',
        'is_working_day',
        'affected_employee_types',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date' => 'date',
            'is_working_day' => 'boolean',
            'affected_employee_types' => 'array',
        ];
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeBetweenDates(Builder $query, Carbon $startDate, Carbon $endDate): Builder
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to filter by type.
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to only include working days.
     */
    public function scopeWorkingDays(Builder $query): Builder
    {
        return $query->where('is_working_day', true);
    }

    /**
     * Scope a query to only include non-working days.
     */
    public function scopeNonWorkingDays(Builder $query): Builder
    {
        return $query->where('is_working_day', false);
    }

    /**
     * Scope a query to filter by holidays.
     */
    public function scopeHolidays(Builder $query): Builder
    {
        return $query->where('type', self::TYPE_HOLIDAY);
    }

    /**
     * Scope a query to filter by events.
     */
    public function scopeEvents(Builder $query): Builder
    {
        return $query->where('type', self::TYPE_EVENT);
    }

    /**
     * Scope a query to filter events that affect specific employee type.
     */
    public function scopeAffectingEmployeeType(Builder $query, int $employeeTypeId): Builder
    {
        return $query->where(function ($q) use ($employeeTypeId) {
            $q->whereNull('affected_employee_types')
                ->orWhereJsonContains('affected_employee_types', $employeeTypeId);
        });
    }

    /**
     * Scope a query to get events for a specific month.
     */
    public function scopeForMonth(Builder $query, int $year, int $month): Builder
    {
        return $query->whereYear('date', $year)
            ->whereMonth('date', $month);
    }

    /**
     * Scope a query to get events for a specific year.
     */
    public function scopeForYear(Builder $query, int $year): Builder
    {
        return $query->whereYear('date', $year);
    }

    /**
     * Check if this event is a holiday.
     */
    public function isHoliday(): bool
    {
        return $this->type === self::TYPE_HOLIDAY;
    }

    /**
     * Check if this event is a school break.
     */
    public function isBreak(): bool
    {
        return $this->type === self::TYPE_BREAK;
    }

    /**
     * Check if this event is a weekend.
     */
    public function isWeekend(): bool
    {
        return $this->type === self::TYPE_WEEKEND;
    }

    /**
     * Check if this event is a special event.
     */
    public function isEvent(): bool
    {
        return $this->type === self::TYPE_EVENT;
    }

    /**
     * Check if this calendar entry affects a specific employee type.
     */
    public function affectsEmployeeType(int $employeeTypeId): bool
    {
        return empty($this->affected_employee_types) || 
               in_array($employeeTypeId, $this->affected_employee_types);
    }

    /**
     * Check if this calendar entry affects an employee.
     */
    public function affectsEmployee(Employee $employee): bool
    {
        return $this->affectsEmployeeType($employee->employee_type_id);
    }

    /**
     * Get the formatted date.
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->date->format('F j, Y');
    }

    /**
     * Get the day of week.
     */
    public function getDayOfWeekAttribute(): string
    {
        return $this->date->format('l');
    }

    /**
     * Get all available event types.
     */
    public static function getTypes(): array
    {
        return [
            self::TYPE_HOLIDAY => 'Holiday',
            self::TYPE_SCHOOL_DAY => 'School Day',
            self::TYPE_WEEKEND => 'Weekend',
            self::TYPE_BREAK => 'Break',
            self::TYPE_EVENT => 'Event',
        ];
    }

    /**
     * Get the human-readable type name.
     */
    public function getTypeNameAttribute(): string
    {
        return self::getTypes()[$this->type] ?? $this->type;
    }

    /**
     * Check if a specific date is a working day.
     */
    public static function isWorkingDay(Carbon $date, int $employeeTypeId = null): bool
    {
        $query = static::where('date', $date);
        
        if ($employeeTypeId) {
            $query->where(function ($q) use ($employeeTypeId) {
                $q->whereNull('affected_employee_types')
                    ->orWhereJsonContains('affected_employee_types', $employeeTypeId);
            });
        }
        
        $calendarEntry = $query->first();
        
        if ($calendarEntry) {
            return $calendarEntry->is_working_day;
        }
        
        // If no calendar entry exists, check if it's a weekend
        return !$date->isWeekend();
    }

    /**
     * Check if a specific date is a holiday.
     */
    public static function isHolidayDate(Carbon $date, int $employeeTypeId = null): bool
    {
        $query = static::where('date', $date)
            ->where('type', self::TYPE_HOLIDAY);
        
        if ($employeeTypeId) {
            $query->affectingEmployeeType($employeeTypeId);
        }
        
        return $query->exists();
    }

    /**
     * Get all holidays for a specific month.
     */
    public static function getHolidaysForMonth(int $year, int $month, int $employeeTypeId = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = static::holidays()
            ->forMonth($year, $month)
            ->orderBy('date');
        
        if ($employeeTypeId) {
            $query->affectingEmployeeType($employeeTypeId);
        }
        
        return $query->get();
    }

    /**
     * Get all events for a specific date range.
     */
    public static function getEventsForPeriod(Carbon $startDate, Carbon $endDate, int $employeeTypeId = null): \Illuminate\Database\Eloquent\Collection
    {
        $query = static::betweenDates($startDate, $endDate)
            ->orderBy('date')
            ->orderBy('name');
        
        if ($employeeTypeId) {
            $query->affectingEmployeeType($employeeTypeId);
        }
        
        return $query->get();
    }

    /**
     * Count working days in a specific month.
     */
    public static function countWorkingDaysInMonth(int $year, int $month, int $employeeTypeId = null): int
    {
        $startDate = Carbon::create($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();
        $workingDays = 0;
        
        while ($startDate <= $endDate) {
            if (static::isWorkingDay($startDate, $employeeTypeId)) {
                $workingDays++;
            }
            $startDate->addDay();
        }
        
        return $workingDays;
    }

    /**
     * Get working days in a specific month.
     */
    public static function getWorkingDaysInMonth(int $year, int $month, int $employeeTypeId = null): array
    {
        $startDate = Carbon::create($year, $month, 1);
        $endDate = $startDate->copy()->endOfMonth();
        $workingDays = [];
        
        while ($startDate <= $endDate) {
            if (static::isWorkingDay($startDate, $employeeTypeId)) {
                $workingDays[] = $startDate->copy();
            }
            $startDate->addDay();
        }
        
        return $workingDays;
    }

    /**
     * Create a holiday entry.
     */
    public static function createHoliday(string $name, Carbon $date, ?string $description = null, ?array $affectedEmployeeTypes = null): static
    {
        return static::create([
            'name' => $name,
            'date' => $date,
            'type' => self::TYPE_HOLIDAY,
            'description' => $description,
            'is_working_day' => false,
            'affected_employee_types' => $affectedEmployeeTypes,
        ]);
    }

    /**
     * Create a school event entry.
     */
    public static function createEvent(string $name, Carbon $date, bool $isWorkingDay = true, ?string $description = null, ?array $affectedEmployeeTypes = null): static
    {
        return static::create([
            'name' => $name,
            'date' => $date,
            'type' => self::TYPE_EVENT,
            'description' => $description,
            'is_working_day' => $isWorkingDay,
            'affected_employee_types' => $affectedEmployeeTypes,
        ]);
    }
}