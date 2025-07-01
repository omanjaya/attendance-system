<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

/**
 * AttendanceRecord Model
 * 
 * Represents daily attendance records for employees including check-in/out times,
 * location data, work hours calculations, and approval workflow.
 * 
 * @property int $id
 * @property int $employee_id
 * @property \Carbon\Carbon $date
 * @property \Carbon\Carbon|null $check_in
 * @property \Carbon\Carbon|null $check_out
 * @property int|null $total_hours_worked
 * @property int|null $break_duration
 * @property int|null $overtime_hours
 * @property string $status
 * @property float|null $latitude_in
 * @property float|null $longitude_in
 * @property float|null $latitude_out
 * @property float|null $longitude_out
 * @property string|null $check_in_method
 * @property string|null $check_out_method
 * @property string|null $notes
 * @property bool $is_approved
 * @property int|null $approved_by
 * @property \Carbon\Carbon|null $approved_at
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class AttendanceRecord extends Model
{
    use HasFactory;

    /**
     * Attendance statuses
     */
    public const STATUS_PRESENT = 'present';
    public const STATUS_ABSENT = 'absent';
    public const STATUS_LATE = 'late';
    public const STATUS_HALF_DAY = 'half_day';
    public const STATUS_HOLIDAY = 'holiday';
    public const STATUS_LEAVE = 'leave';

    /**
     * Check-in/out methods
     */
    public const METHOD_FACE_RECOGNITION = 'face_recognition';
    public const METHOD_MANUAL = 'manual';
    public const METHOD_ADMIN = 'admin';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'employee_id',
        'date',
        'check_in',
        'check_out',
        'break_start',
        'break_end',
        'total_hours',
        'overtime_hours',
        'scheduled_hours',
        'status',
        'latitude',
        'longitude',
        'face_verification_confidence',
        'gestures_detected',
        'check_in_method',
        'check_out_method',
        'notes',
        'is_late',
        'is_early_checkout',
        'verified_by',
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
            'check_in' => 'datetime',
            'check_out' => 'datetime',
            'break_start' => 'datetime',
            'break_end' => 'datetime',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'face_verification_confidence' => 'decimal:2',
            'gestures_detected' => 'json',
            'is_late' => 'boolean',
            'is_early_checkout' => 'boolean',
            'total_hours' => 'decimal:2',
            'overtime_hours' => 'decimal:2',
            'scheduled_hours' => 'decimal:2',
        ];
    }

    /**
     * Get the employee that owns the attendance record.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the user who approved this record.
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
            get: fn () => $this->total_hours_worked ? round($this->total_hours_worked / 60, 2) : null,
        );
    }

    /**
     * Get break duration in decimal format.
     */
    protected function breakDurationDecimal(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->break_duration ? round($this->break_duration / 60, 2) : null,
        );
    }

    /**
     * Get overtime hours in decimal format.
     */
    protected function overtimeHoursDecimal(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->overtime_hours ? round($this->overtime_hours / 60, 2) : null,
        );
    }

    /**
     * Get formatted check-in time.
     */
    protected function formattedCheckIn(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->check_in ? $this->check_in->format('H:i') : null,
        );
    }

    /**
     * Get formatted check-out time.
     */
    protected function formattedCheckOut(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->check_out ? $this->check_out->format('H:i') : null,
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
     * Scope a query to filter by date range.
     */
    public function scopeBetweenDates(Builder $query, Carbon $startDate, Carbon $endDate): Builder
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to filter by status.
     */
    public function scopeByStatus(Builder $query, string $status): Builder
    {
        return $query->where('status', $status);
    }

    /**
     * Scope a query to only include approved records.
     */
    public function scopeApproved(Builder $query): Builder
    {
        return $query->where('is_approved', true);
    }

    /**
     * Scope a query to only include pending approval records.
     */
    public function scopePendingApproval(Builder $query): Builder
    {
        return $query->where('is_approved', false);
    }

    /**
     * Scope a query to filter by month.
     */
    public function scopeForMonth(Builder $query, int $year, int $month): Builder
    {
        return $query->whereYear('date', $year)
            ->whereMonth('date', $month);
    }

    /**
     * Scope a query to filter present records.
     */
    public function scopePresent(Builder $query): Builder
    {
        return $query->whereIn('status', [self::STATUS_PRESENT, self::STATUS_LATE, self::STATUS_HALF_DAY]);
    }

    /**
     * Scope a query to filter absent records.
     */
    public function scopeAbsent(Builder $query): Builder
    {
        return $query->where('status', self::STATUS_ABSENT);
    }

    /**
     * Check if the employee was present.
     */
    public function isPresent(): bool
    {
        return in_array($this->status, [self::STATUS_PRESENT, self::STATUS_LATE, self::STATUS_HALF_DAY]);
    }

    /**
     * Check if the employee was late.
     */
    public function isLate(): bool
    {
        return $this->status === self::STATUS_LATE;
    }

    /**
     * Check if the employee was absent.
     */
    public function isAbsent(): bool
    {
        return $this->status === self::STATUS_ABSENT;
    }

    /**
     * Check if this was a half day.
     */
    public function isHalfDay(): bool
    {
        return $this->status === self::STATUS_HALF_DAY;
    }

    /**
     * Check if this was a holiday.
     */
    public function isHoliday(): bool
    {
        return $this->status === self::STATUS_HOLIDAY;
    }

    /**
     * Check if this was a leave day.
     */
    public function isLeave(): bool
    {
        return $this->status === self::STATUS_LEAVE;
    }

    /**
     * Check if the record has been checked in.
     */
    public function hasCheckedIn(): bool
    {
        return $this->check_in !== null;
    }

    /**
     * Check if the record has been checked out.
     */
    public function hasCheckedOut(): bool
    {
        return $this->check_out !== null;
    }

    /**
     * Check if the record is complete (has both check-in and check-out).
     */
    public function isComplete(): bool
    {
        return $this->hasCheckedIn() && $this->hasCheckedOut();
    }

    /**
     * Calculate and update work hours.
     */
    public function calculateWorkHours(): bool
    {
        if (!$this->isComplete()) {
            return false;
        }

        $totalMinutes = $this->check_in->diffInMinutes($this->check_out);
        $breakMinutes = $this->break_duration ?? 0;
        $workedMinutes = $totalMinutes - $breakMinutes;

        // Get scheduled work hours for the day
        $scheduledMinutes = Schedule::calculateWorkingHoursForDate($this->employee_id, $this->date);
        
        // Calculate overtime
        $overtimeMinutes = max(0, $workedMinutes - $scheduledMinutes);
        $regularMinutes = $workedMinutes - $overtimeMinutes;

        return $this->update([
            'total_hours_worked' => $regularMinutes,
            'overtime_hours' => $overtimeMinutes,
        ]);
    }

    /**
     * Approve the attendance record.
     */
    public function approve(User $approver, ?string $notes = null): bool
    {
        $data = [
            'is_approved' => true,
            'approved_by' => $approver->id,
            'approved_at' => now(),
        ];

        if ($notes) {
            $data['notes'] = $this->notes ? $this->notes . "\n" . $notes : $notes;
        }

        return $this->update($data);
    }

    /**
     * Check if the record needs approval.
     */
    public function needsApproval(): bool
    {
        return !$this->is_approved && $this->isPresent();
    }

    /**
     * Get the distance between check-in and check-out locations.
     */
    public function getLocationDistance(): ?float
    {
        if (!$this->latitude_in || !$this->longitude_in || !$this->latitude_out || !$this->longitude_out) {
            return null;
        }

        // Haversine formula to calculate distance
        $earthRadius = 6371000; // meters

        $lat1 = deg2rad($this->latitude_in);
        $lon1 = deg2rad($this->longitude_in);
        $lat2 = deg2rad($this->latitude_out);
        $lon2 = deg2rad($this->longitude_out);

        $deltaLat = $lat2 - $lat1;
        $deltaLon = $lon2 - $lon1;

        $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
             cos($lat1) * cos($lat2) *
             sin($deltaLon / 2) * sin($deltaLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Check if employee checked in within allowed radius.
     */
    public function isCheckInWithinRadius(): bool
    {
        if (!$this->latitude_in || !$this->longitude_in) {
            return false;
        }

        $settings = AttendanceRadiusSetting::active()
            ->where('allowed_employee_types', null)
            ->orWhereJsonContains('allowed_employee_types', $this->employee->employee_type_id)
            ->get();

        foreach ($settings as $setting) {
            $distance = $this->calculateDistanceFromPoint($this->latitude_in, $this->longitude_in, $setting->latitude, $setting->longitude);
            if ($distance <= $setting->radius_meters) {
                return true;
            }
        }

        return false;
    }

    /**
     * Calculate distance from a point.
     */
    private function calculateDistanceFromPoint(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $earthRadius = 6371000; // meters

        $lat1 = deg2rad($lat1);
        $lon1 = deg2rad($lon1);
        $lat2 = deg2rad($lat2);
        $lon2 = deg2rad($lon2);

        $deltaLat = $lat2 - $lat1;
        $deltaLon = $lon2 - $lon1;

        $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
             cos($lat1) * cos($lat2) *
             sin($deltaLon / 2) * sin($deltaLon / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $earthRadius * $c;
    }

    /**
     * Get all available statuses.
     */
    public static function getStatuses(): array
    {
        return [
            self::STATUS_PRESENT => 'Present',
            self::STATUS_ABSENT => 'Absent',
            self::STATUS_LATE => 'Late',
            self::STATUS_HALF_DAY => 'Half Day',
            self::STATUS_HOLIDAY => 'Holiday',
            self::STATUS_LEAVE => 'Leave',
        ];
    }

    /**
     * Get all available check-in/out methods.
     */
    public static function getMethods(): array
    {
        return [
            self::METHOD_FACE_RECOGNITION => 'Face Recognition',
            self::METHOD_MANUAL => 'Manual',
            self::METHOD_ADMIN => 'Admin',
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
     * Get the human-readable check-in method name.
     */
    public function getCheckInMethodNameAttribute(): string
    {
        return self::getMethods()[$this->check_in_method] ?? $this->check_in_method;
    }

    /**
     * Get the human-readable check-out method name.
     */
    public function getCheckOutMethodNameAttribute(): string
    {
        return self::getMethods()[$this->check_out_method] ?? $this->check_out_method;
    }
}