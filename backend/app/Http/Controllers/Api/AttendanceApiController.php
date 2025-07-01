<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\Schedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

/**
 * Attendance API Controller
 * 
 * Handles all attendance-related API endpoints including check-in/out,
 * attendance history, and validation.
 */
class AttendanceApiController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    /**
     * Check in for attendance
     */
    public function clockIn(Request $request)
    {
        $request->validate([
            'location_lat' => 'nullable|numeric|between:-90,90',
            'location_lng' => 'nullable|numeric|between:-180,180',
            'clock_in_method' => 'nullable|string|in:face_recognition,manual,qr_code,biometric',
            'face_confidence' => 'nullable|numeric|between:0,100',
        ]);

        try {
            DB::beginTransaction();

            $employee = Employee::where('user_id', auth()->id())->first();
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee record not found',
                ], 404);
            }

            $today = now()->toDateString();
            $now = now();

            // Check if already clocked in today
            $existingRecord = Attendance::where('employee_id', $employee->id)
                ->where('date', $today)
                ->first();

            if ($existingRecord && $existingRecord->clock_in_time) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already clocked in today',
                    'data' => [
                        'clock_in_time' => $existingRecord->clock_in_time,
                    ]
                ], 422);
            }

            // Get employee's schedule for today to check if late
            $dayOfWeek = strtolower($now->format('l'));
            $schedule = Schedule::where('employee_id', $employee->id)
                ->where('day_of_week', $dayOfWeek)
                ->where('is_active', true)
                ->where('effective_from', '<=', $today)
                ->where(function($q) use ($today) {
                    $q->whereNull('effective_until')
                      ->orWhere('effective_until', '>=', $today);
                })
                ->orderBy('start_time')
                ->first();

            // Determine if late
            $isLate = false;
            $scheduledHours = 0;
            $status = 'present';

            if ($schedule) {
                $scheduledStart = Carbon::parse($schedule->start_time);
                $clockInTime = Carbon::parse($now->format('H:i:s'));
                $isLate = $clockInTime->greaterThan($scheduledStart->addMinutes(15)); // 15 min grace period
                
                $scheduledEnd = Carbon::parse($schedule->end_time);
                $scheduledHours = $scheduledEnd->diffInHours($scheduledStart);
                
                if ($isLate) {
                    $status = 'late';
                }
            }

            // Create or update attendance record
            $attendance = Attendance::updateOrCreate(
                [
                    'employee_id' => $employee->id,
                    'date' => $today,
                ],
                [
                    'clock_in_time' => $now->format('H:i:s'),
                    'scheduled_hours' => $scheduledHours,
                    'status' => $status,
                    'location_lat' => $request->location_lat,
                    'location_lng' => $request->location_lng,
                    'ip_address' => $request->ip(),
                    'user_agent' => $request->userAgent(),
                    'verified_by_face' => $request->clock_in_method === 'face_recognition',
                    'face_confidence' => $request->face_confidence,
                    'clock_in_method' => $request->clock_in_method ?? 'manual',
                    'is_late' => $isLate,
                    'location_verified' => true, // Simplified for now
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => $isLate ? 'Clocked in (Late)' : 'Successfully clocked in',
                'data' => [
                    'attendance_id' => $attendance->id,
                    'clock_in_time' => $attendance->clock_in_time,
                    'status' => $attendance->status,
                    'is_late' => $attendance->is_late,
                    'scheduled_hours' => $attendance->scheduled_hours,
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to clock in: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Clock out from attendance
     */
    public function clockOut(Request $request)
    {
        $request->validate([
            'location_lat' => 'nullable|numeric|between:-90,90',
            'location_lng' => 'nullable|numeric|between:-180,180',
            'clock_out_method' => 'nullable|string|in:face_recognition,manual,qr_code,biometric',
            'face_confidence' => 'nullable|numeric|between:0,100',
        ]);

        try {
            DB::beginTransaction();

            $employee = Employee::where('user_id', auth()->id())->first();
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee record not found',
                ], 404);
            }

            $today = now()->toDateString();
            $now = now();

            // Get today's attendance record
            $attendance = Attendance::where('employee_id', $employee->id)
                ->where('date', $today)
                ->first();

            if (!$attendance || !$attendance->clock_in_time) {
                return response()->json([
                    'success' => false,
                    'message' => 'No clock-in record found for today',
                ], 422);
            }

            if ($attendance->clock_out_time) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already clocked out today',
                    'data' => [
                        'clock_out_time' => $attendance->clock_out_time,
                    ]
                ], 422);
            }

            // Calculate total hours worked
            $clockInTime = Carbon::parse($attendance->date . ' ' . $attendance->clock_in_time);
            $clockOutTime = $now;
            $totalHours = $clockOutTime->diffInMinutes($clockInTime) / 60;
            
            // For honorary teachers, calculate payable hours based on schedule
            $payableHours = $totalHours;
            if (in_array($employee->type, ['honorary_teacher', 'honorary_staff'])) {
                $payableHours = min($totalHours, $attendance->scheduled_hours ?? $totalHours);
            }

            // Check for early departure
            $isEarlyDeparture = false;
            if ($attendance->scheduled_hours && $totalHours < ($attendance->scheduled_hours - 0.25)) {
                $isEarlyDeparture = true;
            }

            // Update attendance record
            $attendance->update([
                'clock_out_time' => $now->format('H:i:s'),
                'total_hours' => round($totalHours, 2),
                'payable_hours' => round($payableHours, 2),
                'overtime_hours' => max(0, round($totalHours - ($attendance->scheduled_hours ?? 8), 2)),
                'location_lat' => $request->location_lat,
                'location_lng' => $request->location_lng,
                'verified_by_face' => $attendance->verified_by_face || ($request->clock_out_method === 'face_recognition'),
                'face_confidence' => $request->face_confidence ?? $attendance->face_confidence,
                'clock_out_method' => $request->clock_out_method ?? 'manual',
                'is_early_departure' => $isEarlyDeparture,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Successfully clocked out',
                'data' => [
                    'attendance_id' => $attendance->id,
                    'clock_out_time' => $attendance->clock_out_time,
                    'total_hours' => $attendance->total_hours,
                    'payable_hours' => $attendance->payable_hours,
                    'overtime_hours' => $attendance->overtime_hours,
                    'is_early_departure' => $attendance->is_early_departure,
                ],
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to clock out: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get attendance status for today
     */
    public function status()
    {
        try {
            $employee = Employee::where('user_id', auth()->id())->first();
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee record not found',
                ], 404);
            }

            $today = now()->toDateString();
            $attendance = Attendance::where('employee_id', $employee->id)
                ->where('date', $today)
                ->first();

            if (!$attendance) {
                return response()->json([
                    'success' => true,
                    'data' => [
                        'has_clocked_in' => false,
                        'has_clocked_out' => false,
                        'status' => null,
                        'message' => 'No attendance record for today',
                    ],
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'has_clocked_in' => $attendance->clock_in_time !== null,
                    'has_clocked_out' => $attendance->clock_out_time !== null,
                    'status' => $attendance->status,
                    'clock_in_time' => $attendance->clock_in_time,
                    'clock_out_time' => $attendance->clock_out_time,
                    'total_hours' => $attendance->total_hours,
                    'payable_hours' => $attendance->payable_hours,
                    'overtime_hours' => $attendance->overtime_hours,
                    'is_late' => $attendance->is_late,
                    'is_early_departure' => $attendance->is_early_departure,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get attendance status: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get attendance history
     */
    public function history(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        try {
            $employee = Employee::where('user_id', auth()->id())->first();
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee record not found',
                ], 404);
            }

            $query = Attendance::where('employee_id', $employee->id)
                ->orderBy('date', 'desc');

            if ($request->start_date) {
                $query->where('date', '>=', $request->start_date);
            }

            if ($request->end_date) {
                $query->where('date', '<=', $request->end_date);
            }

            $perPage = $request->per_page ?? 20;
            $attendances = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $attendances,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get attendance history: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get attendance list (for admin/supervisor)
     */
    public function index(Request $request)
    {
        $request->validate([
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'employee_id' => 'nullable|exists:employees,id',
            'status' => 'nullable|string|in:present,absent,late,half_day,on_leave',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        try {
            $query = Attendance::with(['employee'])
                ->orderBy('date', 'desc');

            if ($request->start_date) {
                $query->where('date', '>=', $request->start_date);
            }

            if ($request->end_date) {
                $query->where('date', '<=', $request->end_date);
            }

            if ($request->employee_id) {
                $query->where('employee_id', $request->employee_id);
            }

            if ($request->status) {
                $query->where('status', $request->status);
            }

            $perPage = $request->per_page ?? 20;
            $attendances = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $attendances,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get attendance list: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Manual attendance entry (for admin/supervisor)
     */
    public function manualEntry(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'clock_in_time' => 'nullable|date_format:H:i:s',
            'clock_out_time' => 'nullable|date_format:H:i:s|after:clock_in_time',
            'status' => 'required|string|in:present,absent,late,half_day,on_leave',
            'notes' => 'nullable|string|max:500',
        ]);

        try {
            DB::beginTransaction();

            $employee = Employee::findOrFail($request->employee_id);
            
            // Calculate hours if both times provided
            $totalHours = 0;
            if ($request->clock_in_time && $request->clock_out_time) {
                $clockIn = Carbon::parse($request->clock_in_time);
                $clockOut = Carbon::parse($request->clock_out_time);
                $totalHours = $clockOut->diffInMinutes($clockIn) / 60;
            }

            // For honorary employees, payable hours = total hours
            $payableHours = $totalHours;
            if (in_array($employee->type, ['honorary_teacher', 'honorary_staff'])) {
                // Get scheduled hours for this day
                $dayOfWeek = strtolower(Carbon::parse($request->date)->format('l'));
                $schedule = Schedule::where('employee_id', $employee->id)
                    ->where('day_of_week', $dayOfWeek)
                    ->where('is_active', true)
                    ->first();
                
                if ($schedule) {
                    $scheduledEnd = Carbon::parse($schedule->end_time);
                    $scheduledStart = Carbon::parse($schedule->start_time);
                    $scheduledHours = $scheduledEnd->diffInHours($scheduledStart);
                    $payableHours = min($totalHours, $scheduledHours);
                }
            }

            $attendance = Attendance::updateOrCreate(
                [
                    'employee_id' => $request->employee_id,
                    'date' => $request->date,
                ],
                [
                    'clock_in_time' => $request->clock_in_time,
                    'clock_out_time' => $request->clock_out_time,
                    'total_hours' => round($totalHours, 2),
                    'payable_hours' => round($payableHours, 2),
                    'status' => $request->status,
                    'clock_in_method' => 'manual',
                    'clock_out_method' => 'manual',
                    'notes' => $request->notes,
                    'admin_notes' => 'Manual entry by: ' . auth()->user()->name,
                ]
            );

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Manual attendance entry created successfully',
                'data' => $attendance,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create manual attendance entry: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Export attendance data
     */
    public function export(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'employee_id' => 'nullable|exists:employees,id',
            'format' => 'nullable|string|in:excel,csv',
        ]);

        try {
            $query = Attendance::with(['employee'])
                ->whereBetween('date', [$request->start_date, $request->end_date]);

            if ($request->employee_id) {
                $query->where('employee_id', $request->employee_id);
            }

            $attendances = $query->get();

            // For now, return the data as JSON - can be enhanced to actual Excel/CSV export
            return response()->json([
                'success' => true,
                'message' => 'Attendance data exported successfully',
                'data' => $attendances,
                'meta' => [
                    'start_date' => $request->start_date,
                    'end_date' => $request->end_date,
                    'total_records' => $attendances->count(),
                    'format' => $request->format ?? 'json',
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export attendance data: ' . $e->getMessage(),
            ], 500);
        }
    }
}