<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationPreference extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'browser_notifications',
        'attendance_notifications',
        'leave_notifications',
        'payroll_notifications',
        'system_notifications',
        'email_notifications',
        'sms_notifications',
        'quiet_hours_start',
        'quiet_hours_end',
        'notification_sound',
    ];

    protected $casts = [
        'browser_notifications' => 'boolean',
        'attendance_notifications' => 'boolean',
        'leave_notifications' => 'boolean',
        'payroll_notifications' => 'boolean',
        'system_notifications' => 'boolean',
        'email_notifications' => 'boolean',
        'sms_notifications' => 'boolean',
        'quiet_hours_start' => 'datetime:H:i:s',
        'quiet_hours_end' => 'datetime:H:i:s',
    ];

    // Relationships
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Methods
    public function isNotificationAllowed($type)
    {
        $field = "{$type}_notifications";
        
        if (!property_exists($this, $field)) {
            return true; // Default to allowing if type not recognized
        }
        
        return $this->{$field};
    }

    public function isInQuietHours()
    {
        if (!$this->quiet_hours_start || !$this->quiet_hours_end) {
            return false;
        }

        $now = now();
        $start = $this->quiet_hours_start;
        $end = $this->quiet_hours_end;

        // Handle overnight quiet hours (e.g., 22:00 to 06:00)
        if ($start->gt($end)) {
            return $now->gte($start) || $now->lte($end);
        }

        // Handle same-day quiet hours (e.g., 12:00 to 14:00)
        return $now->between($start, $end);
    }

    public static function getDefaultPreferences()
    {
        return [
            'browser_notifications' => true,
            'attendance_notifications' => true,
            'leave_notifications' => true,
            'payroll_notifications' => true,
            'system_notifications' => true,
            'email_notifications' => false,
            'sms_notifications' => false,
            'notification_sound' => 'default',
        ];
    }
}