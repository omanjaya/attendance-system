<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id',
        'schedule_id',
        'date',
        'clock_in_time',
        'clock_out_time',
        'break_start_time',
        'break_end_time',
        'total_hours',
        'overtime_hours',
        'scheduled_hours',
        'payable_hours',
        'status',
        'location_lat',
        'location_lng',
        'ip_address',
        'user_agent',
        'verified_by_face',
        'face_confidence',
        'clock_in_method',
        'clock_out_method',
        'is_late',
        'is_early_departure',
        'location_verified',
        'notes',
        'admin_notes',
    ];

    protected function casts(): array
    {
        return [
            'date' => 'date',
            'total_hours' => 'decimal:2',
            'overtime_hours' => 'decimal:2',
            'scheduled_hours' => 'decimal:2',
            'payable_hours' => 'decimal:2',
            'location_lat' => 'decimal:8',
            'location_lng' => 'decimal:8',
            'verified_by_face' => 'boolean',
            'face_confidence' => 'decimal:2',
            'is_late' => 'boolean',
            'is_early_departure' => 'boolean',
            'location_verified' => 'boolean',
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
     * Get the schedule associated with this attendance.
     */
    public function schedule(): BelongsTo
    {
        return $this->belongsTo(Schedule::class);
    }
}
