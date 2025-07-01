<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class FaceRecognitionController extends Controller
{
    private const FACE_API_BASE_URL = 'http://localhost:8001';

    /**
     * Show face recognition setup page
     */
    public function setup()
    {
        $this->authorize('manage employees');

        $employees = Employee::with('employeeType')
            ->where('is_active', true)
            ->get();

        // Get registered employees from face API
        $registeredEmployees = $this->getRegisteredEmployees();

        return view('face-recognition.setup', compact('employees', 'registeredEmployees'));
    }

    /**
     * Register employee face
     */
    public function registerFace(Request $request): JsonResponse
    {
        $this->authorize('manage employees');

        $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:5120', // 5MB max
        ]);

        try {
            $employee = Employee::findOrFail($request->employee_id);

            // Send photo to face detection API
            $response = Http::attach(
                'file',
                file_get_contents($request->file('photo')->getRealPath()),
                $request->file('photo')->getClientOriginalName()
            )->post(self::FACE_API_BASE_URL . '/register-face', [
                'employee_id' => $employee->id,
                'employee_name' => $employee->name,
            ]);

            if ($response->successful()) {
                // Update employee record
                $employee->update([
                    'face_registered' => true,
                    'face_registered_at' => now(),
                ]);

                // Store photo in Laravel storage as backup
                $photoPath = $request->file('photo')->store('face_photos', 'public');
                $employee->update(['face_photo_path' => $photoPath]);

                Log::info("Face registered successfully for employee {$employee->id} - {$employee->name}");

                return response()->json([
                    'success' => true,
                    'message' => 'Face registered successfully for ' . $employee->name,
                    'employee' => $employee->only(['id', 'name', 'employee_number'])
                ]);
            } else {
                $errorData = $response->json();
                Log::error("Face registration failed for employee {$employee->id}: " . ($errorData['detail'] ?? 'Unknown error'));

                return response()->json([
                    'success' => false,
                    'message' => $errorData['detail'] ?? 'Face registration failed'
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error("Face registration error: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred during face registration'
            ], 500);
        }
    }

    /**
     * Verify face for attendance
     */
    public function verifyFace(Request $request): JsonResponse
    {
        $request->validate([
            'image_data' => 'required|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'attendance_type' => 'required|in:check_in,check_out,break_start,break_end',
        ]);

        try {
            // Get GPS settings
            $gpsSettings = $this->getGPSSettings();
            
            // Validate GPS location if required
            if ($gpsSettings['enabled'] && $request->latitude && $request->longitude) {
                $isWithinRadius = $this->validateGPSLocation(
                    $request->latitude,
                    $request->longitude,
                    $gpsSettings
                );

                if (!$isWithinRadius) {
                    return response()->json([
                        'success' => false,
                        'message' => 'You are outside the allowed attendance radius. Please move closer to the designated location.',
                        'error_type' => 'location_error'
                    ], 400);
                }
            }

            // Verify face with gesture detection
            $response = Http::post(self::FACE_API_BASE_URL . '/verify-face', [
                'image_data' => $request->image_data,
                'require_gestures' => true,
            ]);

            if (!$response->successful()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Face verification service unavailable'
                ], 503);
            }

            $verificationResult = $response->json();

            if (!$verificationResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $verificationResult['message'],
                    'error_type' => 'face_error'
                ], 400);
            }

            // Get employee and validate
            $employee = Employee::find($verificationResult['employee_id']);
            if (!$employee) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee not found in system'
                ], 404);
            }

            // Validate attendance rules based on employee type
            $attendanceValidation = $this->validateAttendanceRules($employee, $request->attendance_type);
            if (!$attendanceValidation['valid']) {
                return response()->json([
                    'success' => false,
                    'message' => $attendanceValidation['message'],
                    'error_type' => 'attendance_rule_error'
                ], 400);
            }

            // Process attendance
            $attendance = $this->processAttendance($employee, $request, $verificationResult);

            Log::info("Successful face verification and attendance for employee {$employee->id}", [
                'attendance_type' => $request->attendance_type,
                'confidence' => $verificationResult['confidence'],
                'gestures' => $verificationResult['gestures'] ?? null
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Attendance recorded successfully',
                'employee' => [
                    'id' => $employee->id,
                    'name' => $employee->name,
                    'employee_number' => $employee->employee_number,
                    'employee_type' => $employee->employeeType->name ?? 'Unknown'
                ],
                'attendance' => [
                    'id' => $attendance->id,
                    'type' => $request->attendance_type,
                    'time' => $attendance->created_at->format('H:i:s'),
                    'date' => $attendance->created_at->format('Y-m-d'),
                ],
                'verification' => [
                    'confidence' => $verificationResult['confidence'],
                    'gestures_detected' => $verificationResult['gestures'] ?? null
                ]
            ]);

        } catch (\Exception $e) {
            Log::error("Face verification error: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred during face verification'
            ], 500);
        }
    }

    /**
     * Remove employee face registration
     */
    public function removeFace(Request $request): JsonResponse
    {
        $this->authorize('manage employees');

        $request->validate([
            'employee_id' => 'required|exists:employees,id',
        ]);

        try {
            $employee = Employee::findOrFail($request->employee_id);

            // Remove from face detection API
            $response = Http::delete(self::FACE_API_BASE_URL . "/remove-face/{$employee->id}");

            // Update employee record regardless of API response
            $employee->update([
                'face_registered' => false,
                'face_registered_at' => null,
            ]);

            // Remove stored photo
            if ($employee->face_photo_path) {
                Storage::disk('public')->delete($employee->face_photo_path);
                $employee->update(['face_photo_path' => null]);
            }

            Log::info("Face registration removed for employee {$employee->id} - {$employee->name}");

            return response()->json([
                'success' => true,
                'message' => 'Face registration removed successfully for ' . $employee->name
            ]);

        } catch (\Exception $e) {
            Log::error("Face removal error: " . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while removing face registration'
            ], 500);
        }
    }

    /**
     * Get face recognition status
     */
    public function status(): JsonResponse
    {
        try {
            // Check face detection API health
            $response = Http::timeout(5)->get(self::FACE_API_BASE_URL . '/health');
            $apiStatus = $response->successful() ? 'online' : 'offline';

            // Get registration statistics
            $totalEmployees = Employee::where('is_active', true)->count();
            $registeredEmployees = Employee::where('face_registered', true)->count();

            return response()->json([
                'success' => true,
                'status' => [
                    'api_status' => $apiStatus,
                    'total_employees' => $totalEmployees,
                    'registered_employees' => $registeredEmployees,
                    'registration_percentage' => $totalEmployees > 0 ? round(($registeredEmployees / $totalEmployees) * 100, 1) : 0
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'status' => [
                    'api_status' => 'error',
                    'error' => $e->getMessage()
                ]
            ]);
        }
    }

    /**
     * Get registered employees from face API
     */
    private function getRegisteredEmployees(): array
    {
        try {
            $response = Http::timeout(5)->get(self::FACE_API_BASE_URL . '/employees');
            
            if ($response->successful()) {
                return $response->json()['employees'] ?? [];
            }
        } catch (\Exception $e) {
            Log::warning("Could not fetch registered employees from face API: " . $e->getMessage());
        }

        return [];
    }

    /**
     * Get GPS settings
     */
    private function getGPSSettings(): array
    {
        return [
            'enabled' => Setting::getValue('gps_attendance_enabled', false),
            'latitude' => Setting::getValue('attendance_latitude', 0),
            'longitude' => Setting::getValue('attendance_longitude', 0),
            'radius' => Setting::getValue('attendance_radius', 100), // meters
        ];
    }

    /**
     * Validate GPS location
     */
    private function validateGPSLocation(float $userLat, float $userLon, array $gpsSettings): bool
    {
        $schoolLat = $gpsSettings['latitude'];
        $schoolLon = $gpsSettings['longitude'];
        $allowedRadius = $gpsSettings['radius'];

        // Calculate distance using Haversine formula
        $earthRadius = 6371000; // Earth's radius in meters

        $latDelta = deg2rad($userLat - $schoolLat);
        $lonDelta = deg2rad($userLon - $schoolLon);

        $a = sin($latDelta / 2) * sin($latDelta / 2) +
             cos(deg2rad($schoolLat)) * cos(deg2rad($userLat)) *
             sin($lonDelta / 2) * sin($lonDelta / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $distance = $earthRadius * $c;

        return $distance <= $allowedRadius;
    }

    /**
     * Validate attendance rules based on employee type
     */
    private function validateAttendanceRules(Employee $employee, string $attendanceType): array
    {
        $today = Carbon::today();
        $now = Carbon::now();

        // Check if employee has schedule for today (for honorary teachers)
        if ($employee->employeeType->name === 'Honorary Teacher') {
            $todaySchedules = $employee->schedules()
                ->where('day_of_week', strtolower($now->format('l')))
                ->where('is_active', true)
                ->orderBy('start_time')
                ->get();

            if ($todaySchedules->isEmpty()) {
                return [
                    'valid' => false,
                    'message' => 'You have no scheduled classes today.'
                ];
            }

            // For check-in, validate against earliest schedule
            if ($attendanceType === 'check_in') {
                $earliestSchedule = $todaySchedules->first();
                $scheduleStart = Carbon::createFromFormat('H:i:s', $earliestSchedule->start_time);
                
                // Allow check-in up to 30 minutes before schedule
                $allowedCheckIn = $scheduleStart->copy()->subMinutes(30);
                
                if ($now->lt($allowedCheckIn)) {
                    return [
                        'valid' => false,
                        'message' => "Check-in not allowed yet. You can check in from {$allowedCheckIn->format('H:i')} for your {$scheduleStart->format('H:i')} class."
                    ];
                }

                // Check if already checked in today
                $existingAttendance = Attendance::where('employee_id', $employee->id)
                    ->whereDate('created_at', $today)
                    ->where('check_in', '!=', null)
                    ->first();

                if ($existingAttendance) {
                    return [
                        'valid' => false,
                        'message' => 'You have already checked in today.'
                    ];
                }
            }

            // For check-out, validate against latest schedule
            if ($attendanceType === 'check_out') {
                $latestSchedule = $todaySchedules->last();
                $scheduleEnd = Carbon::createFromFormat('H:i:s', $latestSchedule->end_time);
                
                // Must check out after schedule ends
                if ($now->lt($scheduleEnd)) {
                    return [
                        'valid' => false,
                        'message' => "Check-out not allowed yet. Your last class ends at {$scheduleEnd->format('H:i')}."
                    ];
                }

                // Check if already checked out
                $existingAttendance = Attendance::where('employee_id', $employee->id)
                    ->whereDate('created_at', $today)
                    ->where('check_out', '!=', null)
                    ->first();

                if ($existingAttendance) {
                    return [
                        'valid' => false,
                        'message' => 'You have already checked out today.'
                    ];
                }
            }
        }

        return ['valid' => true];
    }

    /**
     * Process attendance record
     */
    private function processAttendance(Employee $employee, Request $request, array $verificationResult): Attendance
    {
        $today = Carbon::today();
        $now = Carbon::now();

        // Get or create attendance record for today
        $attendance = Attendance::firstOrCreate(
            [
                'employee_id' => $employee->id,
                'date' => $today->format('Y-m-d'),
            ],
            [
                'check_in' => null,
                'check_out' => null,
                'break_start' => null,
                'break_end' => null,
                'total_hours' => 0,
                'overtime_hours' => 0,
                'is_late' => false,
                'is_early_checkout' => false,
                'status' => 'pending',
            ]
        );

        // Update attendance based on type
        switch ($request->attendance_type) {
            case 'check_in':
                $attendance->check_in = $now;
                
                // Check if late (for honorary teachers with schedules)
                if ($employee->employeeType->name === 'Honorary Teacher') {
                    $earliestSchedule = $employee->schedules()
                        ->where('day_of_week', strtolower($now->format('l')))
                        ->where('is_active', true)
                        ->orderBy('start_time')
                        ->first();
                    
                    if ($earliestSchedule) {
                        $scheduleStart = Carbon::createFromFormat('H:i:s', $earliestSchedule->start_time);
                        $attendance->is_late = $now->gt($scheduleStart);
                    }
                }
                break;

            case 'check_out':
                $attendance->check_out = $now;
                $attendance->status = 'completed';
                
                // Calculate total hours
                if ($attendance->check_in) {
                    $this->calculateWorkingHours($attendance, $employee);
                }
                break;

            case 'break_start':
                $attendance->break_start = $now;
                break;

            case 'break_end':
                $attendance->break_end = $now;
                break;
        }

        // Store verification metadata
        $attendance->face_verification_confidence = $verificationResult['confidence'];
        $attendance->gestures_detected = json_encode($verificationResult['gestures'] ?? []);
        
        // Store GPS data if available
        if ($request->latitude && $request->longitude) {
            $attendance->latitude = $request->latitude;
            $attendance->longitude = $request->longitude;
        }

        $attendance->save();

        return $attendance;
    }

    /**
     * Calculate working hours for honorary teachers
     */
    private function calculateWorkingHours(Attendance $attendance, Employee $employee): void
    {
        if (!$attendance->check_in || !$attendance->check_out) {
            return;
        }

        $checkIn = Carbon::parse($attendance->check_in);
        $checkOut = Carbon::parse($attendance->check_out);
        $dayOfWeek = strtolower($checkIn->format('l'));

        // Get employee's schedule for today
        $schedules = $employee->schedules()
            ->where('day_of_week', $dayOfWeek)
            ->where('is_active', true)
            ->orderBy('start_time')
            ->get();

        if ($employee->employeeType->name === 'Honorary Teacher' && $schedules->isNotEmpty()) {
            // For honorary teachers, only count scheduled hours
            $totalScheduledMinutes = 0;
            $totalWorkedMinutes = 0;

            foreach ($schedules as $schedule) {
                $scheduleStart = Carbon::createFromFormat('H:i:s', $schedule->start_time);
                $scheduleEnd = Carbon::createFromFormat('H:i:s', $schedule->end_time);
                
                // Set the date to match attendance date
                $scheduleStart->setDateFrom($checkIn);
                $scheduleEnd->setDateFrom($checkIn);

                // Calculate overlap between actual work time and scheduled time
                $workStart = max($checkIn, $scheduleStart);
                $workEnd = min($checkOut, $scheduleEnd);

                if ($workStart->lt($workEnd)) {
                    $workedMinutes = $workStart->diffInMinutes($workEnd);
                    $totalWorkedMinutes += $workedMinutes;
                }

                $scheduledMinutes = $scheduleStart->diffInMinutes($scheduleEnd);
                $totalScheduledMinutes += $scheduledMinutes;
            }

            // Account for break time if recorded
            if ($attendance->break_start && $attendance->break_end) {
                $breakStart = Carbon::parse($attendance->break_start);
                $breakEnd = Carbon::parse($attendance->break_end);
                $breakMinutes = $breakStart->diffInMinutes($breakEnd);
                $totalWorkedMinutes = max(0, $totalWorkedMinutes - $breakMinutes);
            }

            $attendance->total_hours = round($totalWorkedMinutes / 60, 2);
            $attendance->scheduled_hours = round($totalScheduledMinutes / 60, 2);
            
            // Overtime for honorary teachers (work beyond scheduled hours)
            $totalActualMinutes = $checkIn->diffInMinutes($checkOut);
            if ($attendance->break_start && $attendance->break_end) {
                $breakMinutes = Carbon::parse($attendance->break_start)->diffInMinutes(Carbon::parse($attendance->break_end));
                $totalActualMinutes -= $breakMinutes;
            }
            
            $overtimeMinutes = max(0, $totalActualMinutes - $totalScheduledMinutes);
            $attendance->overtime_hours = round($overtimeMinutes / 60, 2);

        } else {
            // For permanent employees, calculate total time worked
            $totalMinutes = $checkIn->diffInMinutes($checkOut);
            
            // Account for break time
            if ($attendance->break_start && $attendance->break_end) {
                $breakStart = Carbon::parse($attendance->break_start);
                $breakEnd = Carbon::parse($attendance->break_end);
                $breakMinutes = $breakStart->diffInMinutes($breakEnd);
                $totalMinutes -= $breakMinutes;
            }

            $attendance->total_hours = round($totalMinutes / 60, 2);
            
            // Standard working hours (8 hours for permanent employees)
            $standardHours = Setting::getValue('standard_working_hours', 8);
            $attendance->overtime_hours = max(0, $attendance->total_hours - $standardHours);
        }

        $attendance->save();
    }
}