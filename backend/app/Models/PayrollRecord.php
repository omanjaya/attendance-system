<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

/**
 * PayrollRecord Model
 * 
 * Represents processed payroll records for employees including calculated pay,
 * deductions, attendance summary, and approval workflow.
 * 
 * @property int $id
 * @property int $employee_id
 * @property string $payroll_period
 * @property \Carbon\Carbon $period_start
 * @property \Carbon\Carbon $period_end
 * @property int $total_working_days
 * @property int $days_worked
 * @property int $days_absent
 * @property int $days_late
 * @property int $total_hours_worked
 * @property int $regular_hours
 * @property int $overtime_hours
 * @property float $base_salary
 * @property float $regular_pay
 * @property float $overtime_pay
 * @property float $allowances
 * @property float $deductions
 * @property float $gross_pay
 * @property float $tax_deduction
 * @property float $net_pay
 * @property array|null $allowance_breakdown
 * @property array|null $deduction_breakdown
 * @property string $status
 * @property int $generated_by
 * @property int|null $approved_by
 * @property \Carbon\Carbon|null $approved_at
 * @property \Carbon\Carbon|null $paid_at
 * @property string|null $notes
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class PayrollRecord extends Model
{
    use HasFactory;

    /**
     * Payroll statuses
     */
    public const STATUS_DRAFT = 'draft';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_PAID = 'paid';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'employee_id',
        'payroll_period',
        'period_start',
        'period_end',
        'total_working_days',
        'days_worked',
        'days_absent',
        'days_late',
        'total_hours_worked',
        'regular_hours',
        'overtime_hours',
        'base_salary',
        'regular_pay',
        'overtime_pay',
        'allowances',
        'deductions',
        'gross_pay',
        'tax_deduction',
        'net_pay',
        'allowance_breakdown',
        'deduction_breakdown',
        'status',
        'generated_by',
        'approved_by',
        'approved_at',
        'paid_at',
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
            'period_start' => 'date',
            'period_end' => 'date',
            'base_salary' => 'decimal:2',
            'regular_pay' => 'decimal:2',
            'overtime_pay' => 'decimal:2',
            'allowances' => 'decimal:2',
            'deductions' => 'decimal:2',
            'gross_pay' => 'decimal:2',
            'tax_deduction' => 'decimal:2',
            'net_pay' => 'decimal:2',
            'allowance_breakdown' => 'array',
            'deduction_breakdown' => 'array',
            'approved_at' => 'datetime',
            'paid_at' => 'datetime',
        ];
    }

    /**
     * Get the employee that owns the payroll record.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who generated this payroll record.
     */
    public function generator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'generated_by');
    }

    /**
     * Get the user who approved this payroll record.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get total hours worked in decimal format.
     */
    protected function totalHoursDecimal(): Attribute
    {
        return Attribute::make(
            get: fn () => round($this->total_hours_worked / 60, 2),
        );
    }

    /**
     * Get regular hours in decimal format.
     */
    protected function regularHoursDecimal(): Attribute
    {
        return Attribute::make(
            get: fn () => round($this->regular_hours / 60, 2),
        );
    }

    /**
     * Get overtime hours in decimal format.
     */
    protected function overtimeHoursDecimal(): Attribute
    {
        return Attribute::make(
            get: fn () => round($this->overtime_hours / 60, 2),
        );
    }

    /**
     * Get attendance percentage.
     */
    protected function attendancePercentage(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->total_working_days > 0 ? round(($this->days_worked / $this->total_working_days) * 100, 2) : 0,
        );
    }

    /**
     * Get formatted period.
     */
    protected function formattedPeriod(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->period_start->format('M j') . ' - ' . $this->period_end->format('M j, Y'),
        );
    }

    /**
     * Scope a query to filter by employee.
     */
    public function scopeForEmployee(Builder $query, int $employeeId): Builder
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope a query to filter by payroll period.
     */
    public function scopeForPeriod(Builder $query, string $period): Builder
    {
        return $query->where('payroll_period', $period);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include draft records.
     */
    public function scopeDraft(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_DRAFT);
    }

    /**
     * Scope a query to only include approved records.
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope a query to only include paid records.
     */
    public function scopePaid(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PAID);
    }

    /**
     * Scope a query to filter by year.
     */
    public function scopeForYear(Builder $query, int $year): Builder
    {
        return $query->whereYear('period_start', $year);
    }

    /**
     * Scope a query to filter by month.
     */
    public function scopeForMonth(Builder $query, int $year, int $month): Builder
    {
        return $query->whereYear('period_start', $year)
            ->whereMonth('period_start', $month);
    }

    /**
     * Check if the payroll record is draft.
     */
    public function isDraft(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    /**
     * Check if the payroll record is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Check if the payroll record is paid.
     */
    public function isPaid(): bool
    {
        return $this->status === self::STATUS_PAID;
    }

    /**
     * Check if the payroll record can be edited.
     */
    public function canBeEdited(): bool
    {
        return $this->isDraft();
    }

    /**
     * Check if the payroll record can be approved.
     */
    public function canBeApproved(): bool
    {
        return $this->isDraft();
    }

    /**
     * Check if the payroll record can be marked as paid.
     */
    public function canBeMarkedAsPaid(): bool
    {
        return $this->isApproved();
    }

    /**
     * Approve the payroll record.
     */
    public function approve(User $approver, ?string $notes = null): bool
    {
        if (!$this->canBeApproved()) {
            return false;
        }

        $data = [
            'status' => self::STATUS_APPROVED,
            'approved_by' => $approver->id,
            'approved_at' => now(),
        ];

        if ($notes) {
            $data['notes'] = $this->notes ? $this->notes . "\n" . $notes : $notes;
        }

        return $this->update($data);
    }

    /**
     * Mark the payroll record as paid.
     */
    public function markAsPaid(?string $notes = null): bool
    {
        if (!$this->canBeMarkedAsPaid()) {
            return false;
        }

        $data = [
            'status' => self::STATUS_PAID,
            'paid_at' => now(),
        ];

        if ($notes) {
            $data['notes'] = $this->notes ? $this->notes . "\n" . $notes : $notes;
        }

        return $this->update($data);
    }

    /**
     * Recalculate payroll based on attendance records.
     */
    public function recalculate(): bool
    {
        if (!$this->canBeEdited()) {
            return false;
        }

        $attendanceRecords = $this->employee->attendanceRecords()
            ->betweenDates($this->period_start, $this->period_end)
            ->approved()
            ->get();

        $payrollSetting = PayrollSetting::getForEmployeeOnDate($this->employee_id, $this->period_start);
        
        if (!$payrollSetting) {
            return false;
        }

        // Calculate attendance statistics
        $totalWorkingDays = SchoolCalendar::countWorkingDaysInMonth(
            $this->period_start->year,
            $this->period_start->month,
            $this->employee->employee_type_id
        );

        $daysWorked = $attendanceRecords->where('status', '!=', AttendanceRecord::STATUS_ABSENT)->count();
        $daysAbsent = $attendanceRecords->where('status', AttendanceRecord::STATUS_ABSENT)->count();
        $daysLate = $attendanceRecords->where('status', AttendanceRecord::STATUS_LATE)->count();

        // Calculate hours
        $totalHoursWorked = $attendanceRecords->sum('total_hours_worked') ?? 0;
        $overtimeHours = $attendanceRecords->sum('overtime_hours') ?? 0;
        $regularHours = $totalHoursWorked - $overtimeHours;

        // Calculate pay
        $regularPay = ($regularHours / 60) * $payrollSetting->calculated_hourly_rate;
        $overtimePay = $payrollSetting->include_overtime ? 
            (($overtimeHours / 60) * $payrollSetting->overtime_hourly_rate) : 0;

        $allowances = $payrollSetting->total_allowances;
        $deductions = $payrollSetting->total_deductions;
        $grossPay = $regularPay + $overtimePay + $allowances;
        
        // For now, tax deduction is 0 - this would typically be calculated based on tax rules
        $taxDeduction = 0;
        $netPay = $grossPay - $deductions - $taxDeduction;

        return $this->update([
            'total_working_days' => $totalWorkingDays,
            'days_worked' => $daysWorked,
            'days_absent' => $daysAbsent,
            'days_late' => $daysLate,
            'total_hours_worked' => $totalHoursWorked,
            'regular_hours' => $regularHours,
            'overtime_hours' => $overtimeHours,
            'base_salary' => $payrollSetting->base_salary,
            'regular_pay' => $regularPay,
            'overtime_pay' => $overtimePay,
            'allowances' => $allowances,
            'deductions' => $deductions,
            'gross_pay' => $grossPay,
            'tax_deduction' => $taxDeduction,
            'net_pay' => $netPay,
            'allowance_breakdown' => $payrollSetting->custom_allowances,
            'deduction_breakdown' => $payrollSetting->custom_deductions,
        ]);
    }

    /**
     * Get all available statuses.
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_DRAFT => 'Draft',
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_PAID => 'Paid',
        ];
    }

    /**
     * Get the human-readable status name.
     */
    public function getStatusNameAttribute(): string
    {
        return self::getStatuses()[$this->status] ?? $this->status;
    }

    /**
     * Get the status color for UI display.
     */
    public function getStatusColorAttribute(): string
    {
        return match ($this->status) {
            self::STATUS_DRAFT => 'warning',
            self::STATUS_APPROVED => 'info',
            self::STATUS_PAID => 'success',
            default => 'secondary',
        };
    }

    /**
     * Generate payroll record for an employee and period.
     */
    public static function generateForEmployee(
        int $employeeId,
        Carbon $periodStart,
        Carbon $periodEnd,
        User $generatedBy
    ): ?static {
        $employee = Employee::find($employeeId);
        if (!$employee) {
            return null;
        }

        $payrollPeriod = $periodStart->format('Y-m');
        
        // Check if record already exists
        $existing = static::forEmployee($employeeId)
            ->forPeriod($payrollPeriod)
            ->first();

        if ($existing) {
            return $existing;
        }

        $payrollRecord = static::create([
            'employee_id' => $employeeId,
            'payroll_period' => $payrollPeriod,
            'period_start' => $periodStart,
            'period_end' => $periodEnd,
            'total_working_days' => 0,
            'days_worked' => 0,
            'days_absent' => 0,
            'days_late' => 0,
            'total_hours_worked' => 0,
            'regular_hours' => 0,
            'overtime_hours' => 0,
            'base_salary' => 0,
            'regular_pay' => 0,
            'overtime_pay' => 0,
            'allowances' => 0,
            'deductions' => 0,
            'gross_pay' => 0,
            'tax_deduction' => 0,
            'net_pay' => 0,
            'status' => self::STATUS_DRAFT,
            'generated_by' => $generatedBy->id,
        ]);

        $payrollRecord->recalculate();
        
        return $payrollRecord;
    }

    /**
     * Generate payroll records for all employees for a period.
     */
    public static function generateForAllEmployees(
        Carbon $periodStart,
        Carbon $periodEnd,
        User $generatedBy
    ): \Illuminate\Database\Eloquent\Collection {
        $employees = Employee::active()->get();
        $payrollRecords = collect();

        foreach ($employees as $employee) {
            $record = static::generateForEmployee(
                $employee->id,
                $periodStart,
                $periodEnd,
                $generatedBy
            );
            
            if ($record) {
                $payrollRecords->push($record);
            }
        }

        return $payrollRecords;
    }
}