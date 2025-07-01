<?php

namespace App\Services;

use App\Models\Employee;
use App\Models\AttendanceRecord;
use App\Models\Schedule;
use App\Models\Period;
use App\Models\SchoolCalendar;
use Carbon\Carbon;
use Illuminate\Support\Collection;

/**
 * Attendance Calculator Service
 * 
 * Handles attendance calculations including late detection, overtime calculation,
 * working hours validation, and schedule enforcement. Implements special logic
 * for honorary teachers who are only paid for scheduled hours.
 */
class AttendanceCalculatorService
{
    /**
     * Late grace period in minutes after scheduled start time
     */
    protected const LATE_GRACE_PERIOD = 15;

    /**
     * Maximum allowed late minutes before marking as half day
     */
    protected const HALF_DAY_THRESHOLD = 120; // 2 hours

    /**
     * Minimum work hours required for a valid full day
     */
    protected const MINIMUM_WORK_HOURS = 4;

    /**
     * Honorary teacher employee type names
     */
    protected const HONORARY_TEACHER_TYPES = ['Honorary Teacher', 'Honorary Staff', 'Part-time Teacher'];

    /**
     * Calculate attendance status based on check-in time and employee schedules
     *
     * @param Employee $employee
     * @param Carbon $date
     * @param Carbon $checkInTime
     * @return array
     */
    public function calculateAttendanceStatus(Employee $employee, Carbon $date, Carbon $checkInTime): array
    {
        // Check if it's a holiday
        if ($this->isHoliday($date)) {
            return [
                'status' => AttendanceRecord::STATUS_HOLIDAY,
                'message' => 'Today is a holiday',
                'scheduled_start' => null,
                'late_minutes' => 0,
                'is_valid' => false,
            ];
        }

        // Get employee's schedules for the day
        $schedules = $this->getEmployeeSchedulesForDate($employee, $date);

        if ($schedules->isEmpty()) {
            // For honorary teachers, no schedule means they cannot check in
            if ($this->isHonoraryTeacher($employee)) {
                return [
                    'status' => AttendanceRecord::STATUS_ABSENT,
                    'message' => 'No schedule for today. Honorary teachers can only check in during scheduled periods.',
                    'scheduled_start' => null,
                    'late_minutes' => 0,
                    'is_valid' => false,
                ];
            }

            // Regular employees can check in without schedule (will count as overtime)
            return [
                'status' => AttendanceRecord::STATUS_PRESENT,
                'message' => 'No schedule for today, attendance will be recorded as overtime',
                'scheduled_start' => null,
                'late_minutes' => 0,
                'is_valid' => true,
            ];
        }

        // Find the earliest work period
        $earliestSchedule = $this->getEarliestWorkSchedule($schedules);
        $scheduledStartTime = $this->combineDateAndTime($date, $earliestSchedule->period->start_time);

        // Calculate late minutes
        $lateMinutes = max(0, $scheduledStartTime->diffInMinutes($checkInTime, false));

        // Determine status based on late minutes
        $status = $this->determineStatusFromLateMinutes($lateMinutes);

        // For honorary teachers, check if they're checking in during a valid period
        if ($this->isHonoraryTeacher($employee) && !$this->isWithinScheduledPeriod($checkInTime, $schedules)) {
            return [
                'status' => AttendanceRecord::STATUS_ABSENT,
                'message' => 'Check-in time is outside scheduled periods. Honorary teachers can only check in during scheduled hours.',
                'scheduled_start' => $scheduledStartTime,
                'late_minutes' => $lateMinutes,
                'is_valid' => false,
            ];
        }

        return [
            'status' => $status,
            'message' => $this->getStatusMessage($status, $lateMinutes),
            'scheduled_start' => $scheduledStartTime,
            'late_minutes' => $lateMinutes,
            'is_valid' => true,
        ];
    }

    /**
     * Calculate working hours for an employee
     *
     * @param Employee $employee
     * @param Carbon $checkIn
     * @param Carbon $checkOut
     * @param Carbon $date
     * @return array
     */
    public function calculateWorkingHours(Employee $employee, Carbon $checkIn, Carbon $checkOut, Carbon $date): array
    {
        $schedules = $this->getEmployeeSchedulesForDate($employee, $date);
        $totalMinutesWorked = $checkIn->diffInMinutes($checkOut);

        // For honorary teachers, cap working hours to scheduled hours
        if ($this->isHonoraryTeacher($employee)) {
            return $this->calculateHonoraryTeacherHours($employee, $checkIn, $checkOut, $schedules);
        }

        // For regular employees
        $scheduledMinutes = $this->getTotalScheduledMinutes($schedules);
        $breakMinutes = $this->calculateBreakMinutes($schedules);
        $effectiveMinutesWorked = $totalMinutesWorked - $breakMinutes;

        // Calculate regular and overtime hours
        $regularMinutes = min($effectiveMinutesWorked, $scheduledMinutes);
        $overtimeMinutes = max(0, $effectiveMinutesWorked - $scheduledMinutes);

        return [
            'total_minutes' => $totalMinutesWorked,
            'break_minutes' => $breakMinutes,
            'regular_minutes' => $regularMinutes,
            'overtime_minutes' => $overtimeMinutes,
            'scheduled_minutes' => $scheduledMinutes,
            'effective_minutes' => $effectiveMinutesWorked,
        ];
    }

    /**
     * Calculate working hours specifically for honorary teachers
     *
     * @param Employee $employee
     * @param Carbon $checkIn
     * @param Carbon $checkOut
     * @param Collection $schedules
     * @return array
     */
    protected function calculateHonoraryTeacherHours(Employee $employee, Carbon $checkIn, Carbon $checkOut, Collection $schedules): array
    {
        $totalScheduledMinutes = 0;
        $totalWorkedMinutes = 0;
        $breakMinutes = 0;

        foreach ($schedules as $schedule) {
            if ($schedule->period->type !== Period::TYPE_WORK) {
                if ($schedule->period->isBreak()) {
                    $breakMinutes += $schedule->period->duration_minutes;
                }
                continue;
            }

            $periodStart = $this->combineDateAndTime($checkIn->toDateString(), $schedule->period->start_time);
            $periodEnd = $this->combineDateAndTime($checkIn->toDateString(), $schedule->period->end_time);

            // Check if the employee worked during this scheduled period
            if ($checkOut > $periodStart && $checkIn < $periodEnd) {
                $effectiveStart = max($checkIn, $periodStart);
                $effectiveEnd = min($checkOut, $periodEnd);
                $workedMinutes = $effectiveStart->diffInMinutes($effectiveEnd);
                $totalWorkedMinutes += $workedMinutes;
            }

            $totalScheduledMinutes += $schedule->period->duration_minutes;
        }

        // Honorary teachers get paid only for scheduled hours, regardless of actual hours worked
        return [
            'total_minutes' => $checkIn->diffInMinutes($checkOut),
            'break_minutes' => $breakMinutes,
            'regular_minutes' => min($totalWorkedMinutes, $totalScheduledMinutes),
            'overtime_minutes' => 0, // Honorary teachers don't get overtime
            'scheduled_minutes' => $totalScheduledMinutes,
            'effective_minutes' => $totalWorkedMinutes,
            'paid_minutes' => $totalScheduledMinutes, // Special field for honorary teachers
        ];
    }

    /**
     * Validate if employee can check in/out at current time
     *
     * @param Employee $employee
     * @param string $action 'check_in' or 'check_out'
     * @param Carbon|null $time
     * @return array
     */
    public function validateCheckTime(Employee $employee, string $action, ?Carbon $time = null): array
    {
        $time = $time ?? now();
        $date = $time->toDateString();

        // Check if employee has already checked in/out today
        $existingRecord = AttendanceRecord::where('employee_id', $employee->id)
            ->where('date', $date)
            ->first();

        if ($action === 'check_in') {
            if ($existingRecord && $existingRecord->check_in) {
                return [
                    'valid' => false,
                    'message' => 'You have already checked in today at ' . $existingRecord->check_in->format('H:i'),
                ];
            }

            // For honorary teachers, validate they're checking in during scheduled period
            if ($this->isHonoraryTeacher($employee)) {
                $schedules = $this->getEmployeeSchedulesForDate($employee, $time->toDate());
                if (!$this->isWithinScheduledPeriod($time, $schedules)) {
                    return [
                        'valid' => false,
                        'message' => 'Honorary teachers can only check in during scheduled periods',
                    ];
                }
            }
        } else { // check_out
            if (!$existingRecord || !$existingRecord->check_in) {
                return [
                    'valid' => false,
                    'message' => 'You haven\'t checked in yet today',
                ];
            }

            if ($existingRecord->check_out) {
                return [
                    'valid' => false,
                    'message' => 'You have already checked out today at ' . $existingRecord->check_out->format('H:i'),
                ];
            }

            // Validate minimum work duration
            $workedMinutes = $existingRecord->check_in->diffInMinutes($time);
            if ($workedMinutes < 30) {
                return [
                    'valid' => false,
                    'message' => 'You must work at least 30 minutes before checking out',
                ];
            }
        }

        return [
            'valid' => true,
            'message' => 'Check ' . str_replace('_', '-', $action) . ' allowed',
        ];
    }

    /**
     * Get overtime eligibility for an employee
     *
     * @param Employee $employee
     * @return bool
     */
    public function isEligibleForOvertime(Employee $employee): bool
    {
        // Honorary teachers are not eligible for overtime
        if ($this->isHonoraryTeacher($employee)) {
            return false;
        }

        // Check if employee type allows overtime (this could be configured in employee type settings)
        // For now, all non-honorary employees are eligible
        return true;
    }

    /**
     * Calculate monthly attendance summary
     *
     * @param Employee $employee
     * @param int $year
     * @param int $month
     * @return array
     */
    public function calculateMonthlySummary(Employee $employee, int $year, int $month): array
    {
        $startDate = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endDate = $startDate->copy()->endOfMonth();

        $attendanceRecords = AttendanceRecord::where('employee_id', $employee->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $summary = [
            'total_days' => 0,
            'present_days' => 0,
            'absent_days' => 0,
            'late_days' => 0,
            'half_days' => 0,
            'holidays' => 0,
            'leaves' => 0,
            'total_regular_hours' => 0,
            'total_overtime_hours' => 0,
            'total_late_minutes' => 0,
        ];

        // Count working days in the month
        $currentDate = $startDate->copy();
        while ($currentDate <= $endDate) {
            if (!$this->isWeekend($currentDate) && !$this->isHoliday($currentDate)) {
                $summary['total_days']++;
            }
            $currentDate->addDay();
        }

        // Process attendance records
        foreach ($attendanceRecords as $record) {
            switch ($record->status) {
                case AttendanceRecord::STATUS_PRESENT:
                    $summary['present_days']++;
                    break;
                case AttendanceRecord::STATUS_LATE:
                    $summary['late_days']++;
                    $summary['present_days']++; // Late is still present
                    break;
                case AttendanceRecord::STATUS_HALF_DAY:
                    $summary['half_days']++;
                    $summary['present_days']++; // Half day is still present
                    break;
                case AttendanceRecord::STATUS_ABSENT:
                    $summary['absent_days']++;
                    break;
                case AttendanceRecord::STATUS_HOLIDAY:
                    $summary['holidays']++;
                    break;
                case AttendanceRecord::STATUS_LEAVE:
                    $summary['leaves']++;
                    break;
            }

            $summary['total_regular_hours'] += $record->total_hours_worked / 60;
            $summary['total_overtime_hours'] += $record->overtime_hours / 60;
        }

        // Calculate late minutes from attendance records
        $summary['total_late_minutes'] = $attendanceRecords
            ->where('status', AttendanceRecord::STATUS_LATE)
            ->sum(function ($record) {
                return $this->calculateLateMinutesFromRecord($record);
            });

        $summary['attendance_percentage'] = $summary['total_days'] > 0
            ? round(($summary['present_days'] / $summary['total_days']) * 100, 2)
            : 0;

        return $summary;
    }

    /**
     * Check if employee is an honorary teacher
     *
     * @param Employee $employee
     * @return bool
     */
    protected function isHonoraryTeacher(Employee $employee): bool
    {
        return in_array($employee->employeeType->name, self::HONORARY_TEACHER_TYPES);
    }

    /**
     * Check if date is a holiday
     *
     * @param Carbon $date
     * @return bool
     */
    protected function isHoliday(Carbon $date): bool
    {
        return SchoolCalendar::where('date', $date->toDateString())
            ->where('is_holiday', true)
            ->exists();
    }

    /**
     * Check if date is weekend
     *
     * @param Carbon $date
     * @return bool
     */
    protected function isWeekend(Carbon $date): bool
    {
        // In Indonesia, weekend is typically Saturday and Sunday
        return in_array($date->dayOfWeek, [Carbon::SATURDAY, Carbon::SUNDAY]);
    }

    /**
     * Get employee schedules for a specific date
     *
     * @param Employee $employee
     * @param Carbon $date
     * @return Collection
     */
    protected function getEmployeeSchedulesForDate(Employee $employee, Carbon $date): Collection
    {
        return $employee->getSchedulesForDate($date);
    }

    /**
     * Get earliest work schedule from collection
     *
     * @param Collection $schedules
     * @return Schedule|null
     */
    protected function getEarliestWorkSchedule(Collection $schedules): ?Schedule
    {
        return $schedules
            ->filter(fn($schedule) => $schedule->period->type === Period::TYPE_WORK)
            ->sortBy(fn($schedule) => $schedule->period->start_time)
            ->first();
    }

    /**
     * Combine date and time into Carbon instance
     *
     * @param mixed $date
     * @param mixed $time
     * @return Carbon
     */
    protected function combineDateAndTime($date, $time): Carbon
    {
        $dateString = $date instanceof Carbon ? $date->toDateString() : $date;
        $timeString = $time instanceof Carbon ? $time->format('H:i:s') : $time;
        
        return Carbon::parse($dateString . ' ' . $timeString);
    }

    /**
     * Determine attendance status from late minutes
     *
     * @param int $lateMinutes
     * @return string
     */
    protected function determineStatusFromLateMinutes(int $lateMinutes): string
    {
        if ($lateMinutes <= self::LATE_GRACE_PERIOD) {
            return AttendanceRecord::STATUS_PRESENT;
        } elseif ($lateMinutes <= self::HALF_DAY_THRESHOLD) {
            return AttendanceRecord::STATUS_LATE;
        } else {
            return AttendanceRecord::STATUS_HALF_DAY;
        }
    }

    /**
     * Get status message based on status and late minutes
     *
     * @param string $status
     * @param int $lateMinutes
     * @return string
     */
    protected function getStatusMessage(string $status, int $lateMinutes): string
    {
        switch ($status) {
            case AttendanceRecord::STATUS_PRESENT:
                return 'On time';
            case AttendanceRecord::STATUS_LATE:
                return "Late by {$lateMinutes} minutes";
            case AttendanceRecord::STATUS_HALF_DAY:
                return "Very late ({$lateMinutes} minutes), marked as half day";
            default:
                return 'Unknown status';
        }
    }

    /**
     * Check if time is within any scheduled period
     *
     * @param Carbon $time
     * @param Collection $schedules
     * @return bool
     */
    protected function isWithinScheduledPeriod(Carbon $time, Collection $schedules): bool
    {
        $timeOnly = $time->format('H:i:s');

        return $schedules->contains(function ($schedule) use ($timeOnly) {
            return $schedule->period->containsTime($timeOnly);
        });
    }

    /**
     * Get total scheduled minutes from schedules
     *
     * @param Collection $schedules
     * @return int
     */
    protected function getTotalScheduledMinutes(Collection $schedules): int
    {
        return $schedules
            ->where('period.type', Period::TYPE_WORK)
            ->sum('period.duration_minutes');
    }

    /**
     * Calculate break minutes from schedules
     *
     * @param Collection $schedules
     * @return int
     */
    protected function calculateBreakMinutes(Collection $schedules): int
    {
        return $schedules
            ->whereIn('period.type', [Period::TYPE_BREAK, Period::TYPE_LUNCH])
            ->sum('period.duration_minutes');
    }

    /**
     * Calculate late minutes from attendance record
     *
     * @param AttendanceRecord $record
     * @return int
     */
    protected function calculateLateMinutesFromRecord(AttendanceRecord $record): int
    {
        if (!$record->check_in) {
            return 0;
        }

        $schedules = $this->getEmployeeSchedulesForDate($record->employee, $record->date);
        $earliestSchedule = $this->getEarliestWorkSchedule($schedules);

        if (!$earliestSchedule) {
            return 0;
        }

        $scheduledStart = $this->combineDateAndTime($record->date, $earliestSchedule->period->start_time);
        return max(0, $scheduledStart->diffInMinutes($record->check_in, false));
    }

    /**
     * Validate overtime hours
     *
     * @param Employee $employee
     * @param int $overtimeMinutes
     * @param Carbon $date
     * @return array
     */
    public function validateOvertimeHours(Employee $employee, int $overtimeMinutes, Carbon $date): array
    {
        // Maximum overtime hours per day (e.g., 4 hours)
        $maxOvertimePerDay = 240; // 4 hours in minutes

        // Maximum overtime hours per month (e.g., 40 hours)
        $maxOvertimePerMonth = 2400; // 40 hours in minutes

        if (!$this->isEligibleForOvertime($employee)) {
            return [
                'valid' => false,
                'message' => 'Employee is not eligible for overtime',
                'allowed_minutes' => 0,
            ];
        }

        if ($overtimeMinutes > $maxOvertimePerDay) {
            return [
                'valid' => false,
                'message' => 'Overtime exceeds daily limit of 4 hours',
                'allowed_minutes' => $maxOvertimePerDay,
            ];
        }

        // Check monthly overtime limit
        $monthlyOvertime = AttendanceRecord::where('employee_id', $employee->id)
            ->whereYear('date', $date->year)
            ->whereMonth('date', $date->month)
            ->sum('overtime_hours');

        if ($monthlyOvertime + $overtimeMinutes > $maxOvertimePerMonth) {
            $remainingAllowed = max(0, $maxOvertimePerMonth - $monthlyOvertime);
            return [
                'valid' => false,
                'message' => 'Overtime would exceed monthly limit of 40 hours',
                'allowed_minutes' => $remainingAllowed,
            ];
        }

        return [
            'valid' => true,
            'message' => 'Overtime hours are valid',
            'allowed_minutes' => $overtimeMinutes,
        ];
    }
}