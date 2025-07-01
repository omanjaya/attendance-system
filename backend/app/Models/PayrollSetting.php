<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

/**
 * PayrollSetting Model
 * 
 * Represents payroll configuration for employees including salary structure,
 * allowances, deductions, and pay frequency settings.
 * 
 * @property int $id
 * @property int $employee_id
 * @property float $base_salary
 * @property float|null $hourly_rate
 * @property float $overtime_rate_multiplier
 * @property float $allowances
 * @property float $deductions
 * @property array|null $custom_allowances
 * @property array|null $custom_deductions
 * @property string $pay_frequency
 * @property int $working_days_per_month
 * @property int $working_hours_per_day
 * @property bool $include_overtime
 * @property bool $is_active
 * @property \Carbon\Carbon $effective_date
 * @property \Carbon\Carbon|null $end_date
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class PayrollSetting extends Model
{
    use HasFactory;

    /**
     * Pay frequencies
     */
    public const FREQUENCY_MONTHLY = 'monthly';
    public const FREQUENCY_BI_WEEKLY = 'bi_weekly';
    public const FREQUENCY_WEEKLY = 'weekly';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'employee_id',
        'base_salary',
        'hourly_rate',
        'overtime_rate_multiplier',
        'allowances',
        'deductions',
        'custom_allowances',
        'custom_deductions',
        'pay_frequency',
        'working_days_per_month',
        'working_hours_per_day',
        'include_overtime',
        'is_active',
        'effective_date',
        'end_date',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'base_salary' => 'decimal:2',
            'hourly_rate' => 'decimal:2',
            'overtime_rate_multiplier' => 'decimal:2',
            'allowances' => 'decimal:2',
            'deductions' => 'decimal:2',
            'custom_allowances' => 'array',
            'custom_deductions' => 'array',
            'include_overtime' => 'boolean',
            'is_active' => 'boolean',
            'effective_date' => 'date',
            'end_date' => 'date',
        ];
    }

    /**
     * Get the employee that owns the payroll setting.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the calculated hourly rate from base salary.
     */
    protected function calculatedHourlyRate(): Attribute
    {
        return Attribute::make(
            get: function () {
                if ($this->hourly_rate) {
                    return $this->hourly_rate;
                }
                
                $totalHoursPerMonth = $this->working_days_per_month * $this->working_hours_per_day;
                return $totalHoursPerMonth > 0 ? $this->base_salary / $totalHoursPerMonth : 0;
            }
        );
    }

    /**
     * Get the daily rate.
     */
    protected function dailyRate(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->working_days_per_month > 0 ? $this->base_salary / $this->working_days_per_month : 0,
        );
    }

    /**
     * Get the overtime hourly rate.
     */
    protected function overtimeHourlyRate(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->calculated_hourly_rate * $this->overtime_rate_multiplier,
        );
    }

    /**
     * Get total custom allowances amount.
     */
    protected function totalCustomAllowances(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (empty($this->custom_allowances)) {
                    return 0;
                }
                
                return collect($this->custom_allowances)->sum('amount');
            }
        );
    }

    /**
     * Get total custom deductions amount.
     */
    protected function totalCustomDeductions(): Attribute
    {
        return Attribute::make(
            get: function () {
                if (empty($this->custom_deductions)) {
                    return 0;
                }
                
                return collect($this->custom_deductions)->sum('amount');
            }
        );
    }

    /**
     * Get total allowances (basic + custom).
     */
    protected function totalAllowances(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->allowances + $this->total_custom_allowances,
        );
    }

    /**
     * Get total deductions (basic + custom).
     */
    protected function totalDeductions(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->deductions + $this->total_custom_deductions,
        );
    }

    /**
     * Scope a query to only include active settings.
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
     * Scope a query to get settings effective on a specific date.
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
     * Scope a query to get current settings.
     */
    public function scopeCurrent(Builder $query): Builder
    {
        return $query->effectiveOn(now());
    }

    /**
     * Check if the setting is currently effective.
     */
    public function isEffective(Carbon $date = null): bool
    {
        $date = $date ?? now();
        
        return $this->effective_date <= $date && 
               ($this->end_date === null || $this->end_date >= $date);
    }

    /**
     * Calculate gross pay for a given number of regular and overtime hours.
     */
    public function calculateGrossPay(int $regularMinutes = 0, int $overtimeMinutes = 0): float
    {
        $regularHours = $regularMinutes / 60;
        $overtimeHours = $overtimeMinutes / 60;
        
        $regularPay = $regularHours * $this->calculated_hourly_rate;
        $overtimePay = $this->include_overtime ? ($overtimeHours * $this->overtime_hourly_rate) : 0;
        
        return $regularPay + $overtimePay + $this->total_allowances;
    }

    /**
     * Calculate net pay after deductions.
     */
    public function calculateNetPay(int $regularMinutes = 0, int $overtimeMinutes = 0, float $taxDeduction = 0): float
    {
        $grossPay = $this->calculateGrossPay($regularMinutes, $overtimeMinutes);
        return $grossPay - $this->total_deductions - $taxDeduction;
    }

    /**
     * Add a custom allowance.
     */
    public function addCustomAllowance(string $name, float $amount, ?string $description = null): bool
    {
        $allowances = $this->custom_allowances ?? [];
        $allowances[] = [
            'name' => $name,
            'amount' => $amount,
            'description' => $description,
        ];
        
        return $this->update(['custom_allowances' => $allowances]);
    }

    /**
     * Remove a custom allowance.
     */
    public function removeCustomAllowance(string $name): bool
    {
        $allowances = collect($this->custom_allowances ?? [])
            ->reject(fn ($allowance) => $allowance['name'] === $name)
            ->values()
            ->toArray();
        
        return $this->update(['custom_allowances' => $allowances]);
    }

    /**
     * Add a custom deduction.
     */
    public function addCustomDeduction(string $name, float $amount, ?string $description = null): bool
    {
        $deductions = $this->custom_deductions ?? [];
        $deductions[] = [
            'name' => $name,
            'amount' => $amount,
            'description' => $description,
        ];
        
        return $this->update(['custom_deductions' => $deductions]);
    }

    /**
     * Remove a custom deduction.
     */
    public function removeCustomDeduction(string $name): bool
    {
        $deductions = collect($this->custom_deductions ?? [])
            ->reject(fn ($deduction) => $deduction['name'] === $name)
            ->values()
            ->toArray();
        
        return $this->update(['custom_deductions' => $deductions]);
    }

    /**
     * End the payroll setting on a specific date.
     */
    public function endOn(Carbon $date): bool
    {
        return $this->update(['end_date' => $date, 'is_active' => false]);
    }

    /**
     * Activate the payroll setting.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Deactivate the payroll setting.
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Get all available pay frequencies.
     */
    public static function getPayFrequencies(): array
    {
        return [
            self::FREQUENCY_MONTHLY => 'Monthly',
            self::FREQUENCY_BI_WEEKLY => 'Bi-weekly',
            self::FREQUENCY_WEEKLY => 'Weekly',
        ];
    }

    /**
     * Get the human-readable pay frequency name.
     */
    public function getPayFrequencyNameAttribute(): string
    {
        return self::getPayFrequencies()[$this->pay_frequency] ?? $this->pay_frequency;
    }

    /**
     * Get the current payroll setting for an employee.
     */
    public static function getCurrentForEmployee(int $employeeId): ?static
    {
        return static::forEmployee($employeeId)
            ->active()
            ->current()
            ->latest('effective_date')
            ->first();
    }

    /**
     * Get payroll setting effective on a specific date for an employee.
     */
    public static function getForEmployeeOnDate(int $employeeId, Carbon $date): ?static
    {
        return static::forEmployee($employeeId)
            ->effectiveOn($date)
            ->latest('effective_date')
            ->first();
    }

    /**
     * Calculate expected working hours per pay period.
     */
    public function getExpectedHoursPerPayPeriod(): int
    {
        return match ($this->pay_frequency) {
            self::FREQUENCY_WEEKLY => $this->working_hours_per_day * 5, // Assuming 5-day work week
            self::FREQUENCY_BI_WEEKLY => $this->working_hours_per_day * 10,
            self::FREQUENCY_MONTHLY => $this->working_hours_per_day * $this->working_days_per_month,
            default => $this->working_hours_per_day * $this->working_days_per_month,
        };
    }

    /**
     * Get the number of pay periods per year.
     */
    public function getPayPeriodsPerYear(): int
    {
        return match ($this->pay_frequency) {
            self::FREQUENCY_WEEKLY => 52,
            self::FREQUENCY_BI_WEEKLY => 26,
            self::FREQUENCY_MONTHLY => 12,
            default => 12,
        };
    }

    /**
     * Calculate annual gross salary.
     */
    public function getAnnualGrossSalaryAttribute(): float
    {
        return $this->base_salary * $this->getPayPeriodsPerYear() + 
               ($this->total_allowances * $this->getPayPeriodsPerYear());
    }

    /**
     * Boot method to handle overlapping effective dates.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($payrollSetting) {
            // Deactivate other active settings for the same employee
            static::forEmployee($payrollSetting->employee_id)
                ->active()
                ->where('effective_date', '<=', $payrollSetting->effective_date)
                ->update(['is_active' => false, 'end_date' => $payrollSetting->effective_date->subDay()]);
        });
    }
}