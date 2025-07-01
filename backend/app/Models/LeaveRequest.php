<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

/**
 * LeaveRequest Model
 * 
 * Represents employee leave requests with approval workflow, different leave types,
 * and attachment support for documentation like medical certificates.
 * 
 * @property int $id
 * @property int $employee_id
 * @property string $leave_type
 * @property \Carbon\Carbon $start_date
 * @property \Carbon\Carbon $end_date
 * @property int $total_days
 * @property string $reason
 * @property string $status
 * @property int $requested_by
 * @property int|null $approved_by
 * @property string|null $approval_notes
 * @property \Carbon\Carbon|null $approved_at
 * @property string|null $attachment
 * @property bool $is_paid
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class LeaveRequest extends Model
{
    use HasFactory;

    /**
     * Leave types
     */
    public const TYPE_SICK = 'sick';
    public const TYPE_VACATION = 'vacation';
    public const TYPE_PERSONAL = 'personal';
    public const TYPE_EMERGENCY = 'emergency';
    public const TYPE_MATERNITY = 'maternity';
    public const TYPE_PATERNITY = 'paternity';
    public const TYPE_BEREAVEMENT = 'bereavement';
    public const TYPE_OTHER = 'other';

    /**
     * Leave statuses
     */
    public const STATUS_PENDING = 'pending';
    public const STATUS_APPROVED = 'approved';
    public const STATUS_REJECTED = 'rejected';
    public const STATUS_CANCELLED = 'cancelled';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'employee_id',
        'leave_type',
        'start_date',
        'end_date',
        'total_days',
        'reason',
        'status',
        'requested_by',
        'approved_by',
        'approval_notes',
        'approved_at',
        'attachment',
        'is_paid',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_paid' => 'boolean',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * Get the employee that owns the leave request.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who requested the leave.
     */
    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requested_by');
    }

    /**
     * Get the user who approved/rejected the leave.
     */
    public function approver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    /**
     * Get the formatted date range.
     */
    protected function dateRange(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->start_date->format('M j, Y') . ' - ' . $this->end_date->format('M j, Y'),
        );
    }

    /**
     * Get the duration in days.
     */
    protected function duration(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->start_date->diffInDays($this->end_date) + 1,
        );
    }

    /**
     * Check if the leave request overlaps with a given date range.
     */
    public function overlapsWith(Carbon $startDate, Carbon $endDate): bool
    {
        return $this->start_date <= $endDate && $this->end_date >= $startDate;
    }

    /**
     * Check if the leave request covers a specific date.
     */
    public function coversDate(Carbon $date): bool
    {
        return $date >= $this->start_date && $date <= $this->end_date;
    }

    /**
     * Scope a query to filter by employee.
     */
    public function scopeForEmployee(Builder $query, int $employeeId): Builder
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope a query to filter by leave type.
     */
    public function scopeOfType(Builder $query, string $leaveType): Builder
    {
        return $query->where('leave_type', $leaveType);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include pending requests.
     */
    public function scopePending(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_PENDING);
    }

    /**
     * Scope a query to only include approved requests.
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_APPROVED);
    }

    /**
     * Scope a query to only include rejected requests.
     */
    public function scopeRejected(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_REJECTED);
    }

    /**
     * Scope a query to only include cancelled requests.
     */
    public function scopeCancelled(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_CANCELLED);
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeBetweenDates(Builder $query, Carbon $startDate, Carbon $endDate): Builder
    {
        return $query->where(function ($q) use ($startDate, $endDate) {
            $q->whereBetween('start_date', [$startDate, $endDate])
              ->orWhereBetween('end_date', [$startDate, $endDate])
              ->orWhere(function ($subQ) use ($startDate, $endDate) {
                  $subQ->where('start_date', '<=', $startDate)
                       ->where('end_date', '>=', $endDate);
              });
        });
    }

    /**
     * Scope a query to filter by year.
     */
    public function scopeForYear(Builder $query, int $year): Builder
    {
        return $query->whereYear('start_date', $year)
            ->orWhereYear('end_date', $year);
    }

    /**
     * Scope a query to filter by month.
     */
    public function scopeForMonth(Builder $query, int $year, int $month): Builder
    {
        $startOfMonth = Carbon::create($year, $month, 1);
        $endOfMonth = $startOfMonth->copy()->endOfMonth();
        
        return $query->betweenDates($startOfMonth, $endOfMonth);
    }

    /**
     * Scope a query to only include paid leave.
     */
    public function scopePaid(Builder $query): Builder
    {
        return $query->where('is_paid', true);
    }

    /**
     * Scope a query to only include unpaid leave.
     */
    public function scopeUnpaid(Builder $query): Builder
    {
        return $query->where('is_paid', false);
    }

    /**
     * Check if the leave request is pending.
     */
    public function isPending(): bool
    {
        return $this->status === self::STATUS_PENDING;
    }

    /**
     * Check if the leave request is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === self::STATUS_APPROVED;
    }

    /**
     * Check if the leave request is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === self::STATUS_REJECTED;
    }

    /**
     * Check if the leave request is cancelled.
     */
    public function isCancelled(): bool
    {
        return $this->status === self::STATUS_CANCELLED;
    }

    /**
     * Check if the leave request can be cancelled.
     */
    public function canBeCancelled(): bool
    {
        return $this->isPending() || ($this->isApproved() && $this->start_date > now());
    }

    /**
     * Check if the leave request can be edited.
     */
    public function canBeEdited(): bool
    {
        return $this->isPending();
    }

    /**
     * Check if the leave request has an attachment.
     */
    public function hasAttachment(): bool
    {
        return !empty($this->attachment);
    }

    /**
     * Approve the leave request.
     */
    public function approve(User $approver, ?string $notes = null): bool
    {
        return $this->update([
            'status' => self::STATUS_APPROVED,
            'approved_by' => $approver->id,
            'approved_at' => now(),
            'approval_notes' => $notes,
        ]);
    }

    /**
     * Reject the leave request.
     */
    public function reject(User $approver, string $reason): bool
    {
        return $this->update([
            'status' => self::STATUS_REJECTED,
            'approved_by' => $approver->id,
            'approved_at' => now(),
            'approval_notes' => $reason,
        ]);
    }

    /**
     * Cancel the leave request.
     */
    public function cancel(): bool
    {
        if (!$this->canBeCancelled()) {
            return false;
        }

        return $this->update(['status' => self::STATUS_CANCELLED]);
    }

    /**
     * Calculate the number of working days in the leave period.
     */
    public function calculateWorkingDays(): int
    {
        $workingDays = 0;
        $currentDate = $this->start_date->copy();

        while ($currentDate <= $this->end_date) {
            if (SchoolCalendar::isWorkingDay($currentDate, $this->employee->employee_type_id)) {
                $workingDays++;
            }
            $currentDate->addDay();
        }

        return $workingDays;
    }

    /**
     * Check if the leave request conflicts with existing approved leave.
     */
    public function hasConflicts(): \Illuminate\Database\Eloquent\Collection
    {
        return static::forEmployee($this->employee_id)
            ->approved()
            ->where('id', '!=', $this->id)
            ->where(function ($query) {
                $query->where(function ($q) {
                    $q->where('start_date', '<=', $this->end_date)
                      ->where('end_date', '>=', $this->start_date);
                });
            })
            ->get();
    }

    /**
     * Get the remaining leave balance for the employee for this leave type.
     */
    public function getRemainingBalance(): ?int
    {
        // This would typically integrate with a leave balance system
        // For now, return null to indicate this needs to be implemented
        return null;
    }

    /**
     * Get all available leave types.
     */
    public static function getLeaveTypes(): array
    {
        return [
            self::TYPE_SICK => 'Sick Leave',
            self::TYPE_VACATION => 'Vacation',
            self::TYPE_PERSONAL => 'Personal Leave',
            self::TYPE_EMERGENCY => 'Emergency Leave',
            self::TYPE_MATERNITY => 'Maternity Leave',
            self::TYPE_PATERNITY => 'Paternity Leave',
            self::TYPE_BEREAVEMENT => 'Bereavement Leave',
            self::TYPE_OTHER => 'Other',
        ];
    }

    /**
     * Get all available statuses.
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_PENDING => 'Pending',
            self::STATUS_APPROVED => 'Approved',
            self::STATUS_REJECTED => 'Rejected',
            self::STATUS_CANCELLED => 'Cancelled',
        ];
    }

    /**
     * Get the human-readable leave type name.
     */
    public function getLeaveTypeNameAttribute(): string
    {
        return self::getLeaveTypes()[$this->leave_type] ?? $this->leave_type;
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
            self::STATUS_PENDING => 'warning',
            self::STATUS_APPROVED => 'success',
            self::STATUS_REJECTED => 'danger',
            self::STATUS_CANCELLED => 'secondary',
            default => 'primary',
        };
    }

    /**
     * Boot method to automatically calculate total days.
     */
    protected static function boot()
    {
        parent::boot();

        static::saving(function ($leaveRequest) {
            if ($leaveRequest->start_date && $leaveRequest->end_date) {
                $leaveRequest->total_days = $leaveRequest->calculateWorkingDays();
            }
        });
    }
}