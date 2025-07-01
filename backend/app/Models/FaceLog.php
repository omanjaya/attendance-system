<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

/**
 * FaceLog Model
 * 
 * Represents face recognition logs for attendance tracking including
 * successful/failed recognition attempts, confidence scores, and audit trail.
 * 
 * @property int $id
 * @property int|null $employee_id
 * @property \Carbon\Carbon $timestamp
 * @property string $action_type
 * @property float|null $confidence_score
 * @property string|null $image_path
 * @property array|null $face_encoding
 * @property float|null $latitude
 * @property float|null $longitude
 * @property bool $is_successful
 * @property string|null $failure_reason
 * @property string|null $device_info
 * @property string|null $ip_address
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class FaceLog extends Model
{
    use HasFactory;

    /**
     * Action types
     */
    public const ACTION_CHECK_IN = 'check_in';
    public const ACTION_CHECK_OUT = 'check_out';
    public const ACTION_TRAINING = 'training';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'employee_id',
        'timestamp',
        'action_type',
        'confidence_score',
        'image_path',
        'face_encoding',
        'latitude',
        'longitude',
        'is_successful',
        'failure_reason',
        'device_info',
        'ip_address',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'timestamp' => 'datetime',
            'confidence_score' => 'decimal:4',
            'face_encoding' => 'array',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_successful' => 'boolean',
        ];
    }

    /**
     * Get the employee associated with the face log.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get confidence score as percentage.
     */
    protected function confidencePercentage(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->confidence_score ? round($this->confidence_score * 100, 2) : null,
        );
    }

    /**
     * Get formatted timestamp.
     */
    protected function formattedTimestamp(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->timestamp->format('M j, Y H:i:s'),
        );
    }

    /**
     * Get formatted coordinates.
     */
    protected function coordinates(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->latitude && $this->longitude ? $this->latitude . ', ' . $this->longitude : null,
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
     * Scope a query to filter by action type.
     */
    public function scopeByAction(Builder $query, string $actionType): Builder
    {
        return $query->where('action_type', $actionType);
    }

    /**
     * Scope a query to only include successful attempts.
     */
    public function scopeSuccessful(Builder $query): Builder
    {
        return $query->where('is_successful', true);
    }

    /**
     * Scope a query to only include failed attempts.
     */
    public function scopeFailed(Builder $query): Builder
    {
        return $query->where('is_successful', false);
    }

    /**
     * Scope a query to filter by date range.
     */
    public function scopeBetweenDates(Builder $query, Carbon $startDate, Carbon $endDate): Builder
    {
        return $query->whereBetween('timestamp', [$startDate, $endDate]);
    }

    /**
     * Scope a query to filter by confidence score range.
     */
    public function scopeByConfidenceRange(Builder $query, float $minConfidence, float $maxConfidence): Builder
    {
        return $query->whereBetween('confidence_score', [$minConfidence, $maxConfidence]);
    }

    /**
     * Scope a query to filter by high confidence (>= 0.8).
     */
    public function scopeHighConfidence(Builder $query): Builder
    {
        return $query->where('confidence_score', '>=', 0.8);
    }

    /**
     * Scope a query to filter by medium confidence (0.6-0.8).
     */
    public function scopeMediumConfidence(Builder $query): Builder
    {
        return $query->whereBetween('confidence_score', [0.6, 0.8]);
    }

    /**
     * Scope a query to filter by low confidence (< 0.6).
     */
    public function scopeLowConfidence(Builder $query): Builder
    {
        return $query->where('confidence_score', '<', 0.6);
    }

    /**
     * Scope a query to filter check-in actions.
     */
    public function scopeCheckIns(Builder $query): Builder
    {
        return $query->where('action_type', self::ACTION_CHECK_IN);
    }

    /**
     * Scope a query to filter check-out actions.
     */
    public function scopeCheckOuts(Builder $query): Builder
    {
        return $query->where('action_type', self::ACTION_CHECK_OUT);
    }

    /**
     * Scope a query to filter training actions.
     */
    public function scopeTraining(Builder $query): Builder
    {
        return $query->where('action_type', self::ACTION_TRAINING);
    }

    /**
     * Scope a query to filter by today's logs.
     */
    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('timestamp', now());
    }

    /**
     * Scope a query to filter by this week's logs.
     */
    public function scopeThisWeek(Builder $query): Builder
    {
        return $query->whereBetween('timestamp', [now()->startOfWeek(), now()->endOfWeek()]);
    }

    /**
     * Scope a query to filter by this month's logs.
     */
    public function scopeThisMonth(Builder $query): Builder
    {
        return $query->whereMonth('timestamp', now()->month)
            ->whereYear('timestamp', now()->year);
    }

    /**
     * Check if this is a check-in action.
     */
    public function isCheckIn(): bool
    {
        return $this->action_type === self::ACTION_CHECK_IN;
    }

    /**
     * Check if this is a check-out action.
     */
    public function isCheckOut(): bool
    {
        return $this->action_type === self::ACTION_CHECK_OUT;
    }

    /**
     * Check if this is a training action.
     */
    public function isTraining(): bool
    {
        return $this->action_type === self::ACTION_TRAINING;
    }

    /**
     * Check if the recognition was successful.
     */
    public function wasSuccessful(): bool
    {
        return $this->is_successful;
    }

    /**
     * Check if the recognition failed.
     */
    public function wasFailed(): bool
    {
        return !$this->is_successful;
    }

    /**
     * Check if confidence score is high.
     */
    public function hasHighConfidence(): bool
    {
        return $this->confidence_score >= 0.8;
    }

    /**
     * Check if confidence score is medium.
     */
    public function hasMediumConfidence(): bool
    {
        return $this->confidence_score >= 0.6 && $this->confidence_score < 0.8;
    }

    /**
     * Check if confidence score is low.
     */
    public function hasLowConfidence(): bool
    {
        return $this->confidence_score < 0.6;
    }

    /**
     * Get the confidence level as a string.
     */
    public function getConfidenceLevelAttribute(): string
    {
        if ($this->hasHighConfidence()) {
            return 'High';
        } elseif ($this->hasMediumConfidence()) {
            return 'Medium';
        } elseif ($this->hasLowConfidence()) {
            return 'Low';
        }
        
        return 'Unknown';
    }

    /**
     * Get the confidence color for UI display.
     */
    public function getConfidenceColorAttribute(): string
    {
        if ($this->hasHighConfidence()) {
            return 'success';
        } elseif ($this->hasMediumConfidence()) {
            return 'warning';
        }
        
        return 'danger';
    }

    /**
     * Check if the log has location data.
     */
    public function hasLocation(): bool
    {
        return $this->latitude !== null && $this->longitude !== null;
    }

    /**
     * Check if the log has an image.
     */
    public function hasImage(): bool
    {
        return !empty($this->image_path);
    }

    /**
     * Get the image URL.
     */
    public function getImageUrlAttribute(): ?string
    {
        if (!$this->hasImage()) {
            return null;
        }
        
        // This would typically return a URL to access the stored image
        return asset('storage/' . $this->image_path);
    }

    /**
     * Get all available action types.
     */
    public static function getActionTypes(): array
    {
        return [
            self::ACTION_CHECK_IN => 'Check In',
            self::ACTION_CHECK_OUT => 'Check Out',
            self::ACTION_TRAINING => 'Training',
        ];
    }

    /**
     * Get the human-readable action type name.
     */
    public function getActionTypeNameAttribute(): string
    {
        return self::getActionTypes()[$this->action_type] ?? $this->action_type;
    }

    /**
     * Log a face recognition attempt.
     */
    public static function logAttempt(
        ?int $employeeId,
        string $actionType,
        bool $isSuccessful,
        ?float $confidenceScore = null,
        ?string $imagePath = null,
        ?array $faceEncoding = null,
        ?float $latitude = null,
        ?float $longitude = null,
        ?string $failureReason = null,
        ?string $deviceInfo = null,
        ?string $ipAddress = null
    ): static {
        return static::create([
            'employee_id' => $employeeId,
            'timestamp' => now(),
            'action_type' => $actionType,
            'confidence_score' => $confidenceScore,
            'image_path' => $imagePath,
            'face_encoding' => $faceEncoding,
            'latitude' => $latitude,
            'longitude' => $longitude,
            'is_successful' => $isSuccessful,
            'failure_reason' => $failureReason,
            'device_info' => $deviceInfo,
            'ip_address' => $ipAddress,
        ]);
    }

    /**
     * Log a successful face recognition.
     */
    public static function logSuccess(
        int $employeeId,
        string $actionType,
        float $confidenceScore,
        ?string $imagePath = null,
        ?array $faceEncoding = null,
        ?float $latitude = null,
        ?float $longitude = null,
        ?string $deviceInfo = null,
        ?string $ipAddress = null
    ): static {
        return static::logAttempt(
            $employeeId,
            $actionType,
            true,
            $confidenceScore,
            $imagePath,
            $faceEncoding,
            $latitude,
            $longitude,
            null,
            $deviceInfo,
            $ipAddress
        );
    }

    /**
     * Log a failed face recognition.
     */
    public static function logFailure(
        string $actionType,
        string $failureReason,
        ?int $employeeId = null,
        ?float $confidenceScore = null,
        ?string $imagePath = null,
        ?array $faceEncoding = null,
        ?float $latitude = null,
        ?float $longitude = null,
        ?string $deviceInfo = null,
        ?string $ipAddress = null
    ): static {
        return static::logAttempt(
            $employeeId,
            $actionType,
            false,
            $confidenceScore,
            $imagePath,
            $faceEncoding,
            $latitude,
            $longitude,
            $failureReason,
            $deviceInfo,
            $ipAddress
        );
    }

    /**
     * Get recognition statistics for an employee.
     */
    public static function getEmployeeStats(int $employeeId, ?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $query = static::forEmployee($employeeId);
        
        if ($startDate && $endDate) {
            $query->betweenDates($startDate, $endDate);
        }
        
        $logs = $query->get();
        
        return [
            'total_attempts' => $logs->count(),
            'successful_attempts' => $logs->where('is_successful', true)->count(),
            'failed_attempts' => $logs->where('is_successful', false)->count(),
            'success_rate' => $logs->count() > 0 ? round(($logs->where('is_successful', true)->count() / $logs->count()) * 100, 2) : 0,
            'average_confidence' => $logs->where('is_successful', true)->avg('confidence_score'),
            'check_ins' => $logs->where('action_type', self::ACTION_CHECK_IN)->count(),
            'check_outs' => $logs->where('action_type', self::ACTION_CHECK_OUT)->count(),
            'high_confidence_rate' => $logs->count() > 0 ? round(($logs->where('confidence_score', '>=', 0.8)->count() / $logs->count()) * 100, 2) : 0,
        ];
    }

    /**
     * Get system-wide recognition statistics.
     */
    public static function getSystemStats(?Carbon $startDate = null, ?Carbon $endDate = null): array
    {
        $query = static::query();
        
        if ($startDate && $endDate) {
            $query->betweenDates($startDate, $endDate);
        }
        
        $logs = $query->get();
        
        return [
            'total_attempts' => $logs->count(),
            'successful_attempts' => $logs->where('is_successful', true)->count(),
            'failed_attempts' => $logs->where('is_successful', false)->count(),
            'success_rate' => $logs->count() > 0 ? round(($logs->where('is_successful', true)->count() / $logs->count()) * 100, 2) : 0,
            'average_confidence' => $logs->where('is_successful', true)->avg('confidence_score'),
            'unique_employees' => $logs->where('employee_id', '!=', null)->pluck('employee_id')->unique()->count(),
            'check_ins' => $logs->where('action_type', self::ACTION_CHECK_IN)->count(),
            'check_outs' => $logs->where('action_type', self::ACTION_CHECK_OUT)->count(),
            'training_sessions' => $logs->where('action_type', self::ACTION_TRAINING)->count(),
        ];
    }

    /**
     * Clean up old logs (older than specified days).
     */
    public static function cleanup(int $daysToKeep = 365): int
    {
        $cutoffDate = now()->subDays($daysToKeep);
        
        return static::where('timestamp', '<', $cutoffDate)->delete();
    }
}