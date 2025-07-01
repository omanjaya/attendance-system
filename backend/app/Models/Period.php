<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Carbon\Carbon;

/**
 * Period Model
 * 
 * Represents different time periods in the school day such as work periods,
 * breaks, lunch, and overtime. Used for scheduling and attendance tracking.
 * 
 * @property int $id
 * @property string $name
 * @property \Carbon\Carbon $start_time
 * @property \Carbon\Carbon $end_time
 * @property int $duration_minutes
 * @property string $type
 * @property bool $is_paid
 * @property bool $is_active
 * @property \Carbon\Carbon|null $created_at
 * @property \Carbon\Carbon|null $updated_at
 */
class Period extends Model
{
    use HasFactory;

    /**
     * Period types
     */
    public const TYPE_CLASS = 'class';
    public const TYPE_BREAK = 'break';
    public const TYPE_LUNCH = 'lunch';
    public const TYPE_ASSEMBLY = 'assembly';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<string>
     */
    protected $fillable = [
        'name',
        'start_time',
        'end_time',
        'duration_minutes',
        'type',
        'sort_order',
        'is_active',
        'description',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'start_time' => 'datetime:H:i:s',
            'end_time' => 'datetime:H:i:s',
            'is_active' => 'boolean',
            'sort_order' => 'integer',
        ];
    }

    /**
     * Get all schedules that use this period.
     */
    public function schedules(): HasMany
    {
        return $this->hasMany(Schedule::class);
    }

    /**
     * Get the formatted start time.
     */
    protected function formattedStartTime(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->start_time->format('H:i'),
        );
    }

    /**
     * Get the formatted end time.
     */
    protected function formattedEndTime(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->end_time->format('H:i'),
        );
    }

    /**
     * Get the formatted time range.
     */
    protected function timeRange(): Attribute
    {
        return Attribute::make(
            get: fn () => $this->formatted_start_time . ' - ' . $this->formatted_end_time,
        );
    }

    /**
     * Get duration in hours.
     */
    protected function durationHours(): Attribute
    {
        return Attribute::make(
            get: fn () => round($this->duration_minutes / 60, 2),
        );
    }

    /**
     * Scope a query to only include active periods.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by period type.
     */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /**
     * Scope a query to only include paid periods.
     */
    public function scopePaid(Builder $query): Builder
    {
        return $query->where('is_paid', true);
    }

    /**
     * Scope a query to only include work periods.
     */
    public function scopeWork(Builder $query): Builder
    {
        return $query->where('type', self::TYPE_WORK);
    }

    /**
     * Scope a query to only include break periods.
     */
    public function scopeBreaks(Builder $query): Builder
    {
        return $query->whereIn('type', [self::TYPE_BREAK, self::TYPE_LUNCH]);
    }

    /**
     * Scope a query to only include overtime periods.
     */
    public function scopeOvertime(Builder $query): Builder
    {
        return $query->where('type', self::TYPE_OVERTIME);
    }

    /**
     * Check if this is a work period.
     */
    public function isWork(): bool
    {
        return $this->type === self::TYPE_WORK;
    }

    /**
     * Check if this is a break period.
     */
    public function isBreak(): bool
    {
        return in_array($this->type, [self::TYPE_BREAK, self::TYPE_LUNCH]);
    }

    /**
     * Check if this is overtime.
     */
    public function isOvertime(): bool
    {
        return $this->type === self::TYPE_OVERTIME;
    }

    /**
     * Check if this period is currently active (time-wise).
     */
    public function isCurrentlyActive(): bool
    {
        $now = Carbon::now();
        $currentTime = $now->format('H:i:s');
        
        return $currentTime >= $this->start_time->format('H:i:s') && 
               $currentTime <= $this->end_time->format('H:i:s');
    }

    /**
     * Check if a given time falls within this period.
     */
    public function containsTime(string $time): bool
    {
        return $time >= $this->start_time->format('H:i:s') && 
               $time <= $this->end_time->format('H:i:s');
    }

    /**
     * Calculate overlap with another period in minutes.
     */
    public function calculateOverlapMinutes(Period $other): int
    {
        $start1 = $this->start_time->format('H:i');
        $end1 = $this->end_time->format('H:i');
        $start2 = $other->start_time->format('H:i');
        $end2 = $other->end_time->format('H:i');

        $overlapStart = max($start1, $start2);
        $overlapEnd = min($end1, $end2);

        if ($overlapStart >= $overlapEnd) {
            return 0;
        }

        $startTime = Carbon::createFromFormat('H:i', $overlapStart);
        $endTime = Carbon::createFromFormat('H:i', $overlapEnd);

        return $startTime->diffInMinutes($endTime);
    }

    /**
     * Check if this period overlaps with another period.
     */
    public function overlapsWith(Period $other): bool
    {
        return $this->calculateOverlapMinutes($other) > 0;
    }

    /**
     * Get the count of active schedules using this period.
     */
    public function getActiveScheduleCount(): int
    {
        return $this->schedules()->where('is_active', true)->count();
    }

    /**
     * Check if this period can be deleted.
     */
    public function canBeDeleted(): bool
    {
        return $this->getActiveScheduleCount() === 0;
    }

    /**
     * Deactivate the period instead of deleting.
     */
    public function deactivate(): bool
    {
        return $this->update(['is_active' => false]);
    }

    /**
     * Activate the period.
     */
    public function activate(): bool
    {
        return $this->update(['is_active' => true]);
    }

    /**
     * Get all available period types.
     */
    public static function getTypes(): array
    {
        return [
            self::TYPE_CLASS => 'Class',
            self::TYPE_BREAK => 'Break',
            self::TYPE_LUNCH => 'Lunch',
            self::TYPE_ASSEMBLY => 'Assembly',
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
     * Get the color for this period type.
     */
    public function getTypeColorAttribute(): string
    {
        return match ($this->type) {
            self::TYPE_CLASS => '#0d6efd',
            self::TYPE_BREAK => '#198754',
            self::TYPE_LUNCH => '#fd7e14',
            self::TYPE_ASSEMBLY => '#6f42c1',
            default => '#6c757d',
        };
    }
}