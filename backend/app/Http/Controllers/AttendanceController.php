<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Yajra\DataTables\Facades\DataTables;
use App\Models\AttendanceRecord;
use App\Models\Employee;
use App\Models\Schedule;
use App\Models\AttendanceRadiusSetting;
use App\Models\EmployeeType;
use Carbon\Carbon;

/**
 * AttendanceController
 * 
 * Handles attendance management including check-in/out functionality,
 * attendance records management, DataTables integration, and business logic
 * for different employee types including honorary teachers.
 */
class AttendanceController extends Controller
{
    /**
     * Display attendance records for the authenticated user
     * 
     * @param Request $request
     * @return View
     */
    public function index(Request $request): View
    {
        $user = Auth::user();
        
        if (!$user->isEmployee()) {
            abort(403, 'Only employees can view their attendance.');
        }
        
        $employee = $user->employee;
        
        // Get current month attendance records
        $currentMonth = Carbon::now();
        $attendanceRecords = $employee->attendanceRecords()
            ->forMonth($currentMonth->year, $currentMonth->month)
            ->orderBy('date', 'desc')
            ->get();
            
        // Get monthly statistics
        $monthlyStats = $this->getMonthlyStats($employee, $currentMonth);
        
        // Get today's attendance
        $todayAttendance = $employee->getAttendanceForDate(Carbon::today());
        
        // Get today's schedule
        $todaySchedules = $employee->getSchedulesForDate(Carbon::today());
        
        return view('attendance.index', compact(
            'employee', 
            'attendanceRecords', 
            'monthlyStats', 
            'todayAttendance', 
            'todaySchedules'
        ));
    }
    
    /**
     * Display attendance calendar view
     * 
     * @param Request $request
     * @return View
     */
    public function calendar(Request $request): View
    {
        $user = Auth::user();
        
        if (!$user->isEmployee()) {
            abort(403, 'Only employees can view their attendance calendar.');
        }
        
        $employee = $user->employee;
        $month = $request->filled('month') ? Carbon::createFromFormat('Y-m', $request->month) : Carbon::now();
        
        // Get attendance records for the month
        $attendanceRecords = $employee->attendanceRecords()
            ->forMonth($month->year, $month->month)
            ->get()
            ->keyBy(function ($record) {
                return $record->date->format('Y-m-d');
            });
            
        // Get schedules for the month
        $schedules = $employee->schedules()
            ->with('period')
            ->where('is_active', true)
            ->where('effective_date', '<=', $month->endOfMonth())
            ->where(function ($query) use ($month) {
                $query->whereNull('end_date')
                    ->orWhere('end_date', '>=', $month->startOfMonth());
            })
            ->get()
            ->groupBy('day_of_week');
        
        return view('attendance.calendar', compact('employee', 'month', 'attendanceRecords', 'schedules'));
    }
    
    /**
     * Handle employee check-in
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function checkIn(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user->isEmployee()) {
            return response()->json([
                'success' => false,
                'message' => 'Only employees can check in.'
            ], 403);
        }
        
        $validated = $request->validate([
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'method' => 'in:manual,face_recognition',
            'notes' => 'nullable|string|max:500'
        ]);
        
        $employee = $user->employee;
        $today = Carbon::today();
        $now = Carbon::now();
        
        try {
            DB::beginTransaction();
            
            // Check if employee is active
            if (!$employee->is_active) {
                throw ValidationException::withMessages([
                    'employee' => 'Your employee account is inactive. Please contact HR.'
                ]);
            }
            
            // Check if already checked in today
            $existingAttendance = $employee->getAttendanceForDate($today);
            if ($existingAttendance && $existingAttendance->hasCheckedIn()) {
                throw ValidationException::withMessages([
                    'check_in' => 'You have already checked in today.'
                ]);
            }
            
            // Get today's schedules
            $todaySchedules = $employee->getSchedulesForDate($today);
            
            // Implement business logic for honorary teachers
            if ($this->isHonoraryEmployee($employee)) {
                if ($todaySchedules->isEmpty()) {
                    throw ValidationException::withMessages([
                        'schedule' => 'Honorary employees can only check in during scheduled hours. No schedule found for today.'
                    ]);
                }
                
                // Check if current time is within any scheduled period
                if (!$this->isWithinScheduledTime($todaySchedules, $now)) {
                    throw ValidationException::withMessages([
                        'schedule' => 'Honorary employees can only check in during scheduled hours.'
                    ]);
                }
            }
            
            // Validate location if coordinates provided
            if ($validated['latitude'] && $validated['longitude']) {
                if (!$this->isLocationValid($employee, $validated['latitude'], $validated['longitude'])) {
                    throw ValidationException::withMessages([
                        'location' => 'Check-in location is outside the allowed radius.'
                    ]);
                }
            }
            
            // Determine attendance status
            $status = $this->determineAttendanceStatus($employee, $todaySchedules, $now);
            
            // Create or update attendance record
            $attendanceData = [
                'employee_id' => $employee->id,
                'date' => $today,
                'check_in' => $now,
                'status' => $status,
                'latitude_in' => $validated['latitude'],
                'longitude_in' => $validated['longitude'],
                'check_in_method' => $validated['method'] ?? AttendanceRecord::METHOD_MANUAL,
                'notes' => $validated['notes'],
                'is_approved' => false, // Will be approved by supervisor
            ];
            
            if ($existingAttendance) {
                $existingAttendance->update($attendanceData);
                $attendance = $existingAttendance;
            } else {
                $attendance = AttendanceRecord::create($attendanceData);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Check-in successful.',
                'data' => [
                    'check_in_time' => $attendance->formatted_check_in,
                    'status' => $attendance->status_name,
                    'location_valid' => $validated['latitude'] ? $attendance->isCheckInWithinRadius() : true
                ]
            ]);
            
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Check-in failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during check-in. Please try again.'
            ], 500);
        }
    }
    
    /**
     * Handle employee check-out
     * 
     * @param Request $request
     * @return JsonResponse
     */
    public function checkOut(Request $request): JsonResponse
    {
        $user = Auth::user();
        
        if (!$user->isEmployee()) {
            return response()->json([
                'success' => false,
                'message' => 'Only employees can check out.'
            ], 403);
        }
        
        $validated = $request->validate([
            'latitude' => 'nullable|numeric|between:-90,90',
            'longitude' => 'nullable|numeric|between:-180,180',
            'method' => 'in:manual,face_recognition',
            'notes' => 'nullable|string|max:500'
        ]);
        
        $employee = $user->employee;
        $today = Carbon::today();
        $now = Carbon::now();
        
        try {
            DB::beginTransaction();
            
            // Get today's attendance record
            $attendance = $employee->getAttendanceForDate($today);
            
            if (!$attendance || !$attendance->hasCheckedIn()) {
                throw ValidationException::withMessages([
                    'check_out' => 'You must check in before checking out.'
                ]);
            }
            
            if ($attendance->hasCheckedOut()) {
                throw ValidationException::withMessages([
                    'check_out' => 'You have already checked out today.'
                ]);
            }
            
            // Update attendance record with check-out information
            $updateData = [
                'check_out' => $now,
                'latitude_out' => $validated['latitude'],
                'longitude_out' => $validated['longitude'],
                'check_out_method' => $validated['method'] ?? AttendanceRecord::METHOD_MANUAL,
            ];
            
            if ($validated['notes']) {
                $updateData['notes'] = $attendance->notes 
                    ? $attendance->notes . "\n" . $validated['notes'] 
                    : $validated['notes'];
            }
            
            $attendance->update($updateData);
            
            // Calculate work hours
            $attendance->calculateWorkHours();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Check-out successful.',
                'data' => [
                    'check_out_time' => $attendance->formatted_check_out,
                    'total_hours' => $attendance->total_hours_decimal,
                    'overtime_hours' => $attendance->overtime_hours_decimal
                ]
            ]);
            
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Check-out failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'An error occurred during check-out. Please try again.'
            ], 500);
        }
    }
    
    /**
     * Display attendance management interface for supervisors
     * 
     * @param Request $request
     * @return View|JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function manage(Request $request)
    {
        $this->authorize('manage', AttendanceRecord::class);
        
        if ($request->ajax()) {
            return $this->getAttendanceManagementDataTable($request);
        }
        
        // Get filter options
        $employees = Employee::active()->with('employeeType')->get();
        $employeeTypes = EmployeeType::active()->get();
        $departments = Employee::whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->sort()
            ->values();
            
        return view('attendance.manage', compact('employees', 'employeeTypes', 'departments'));
    }
    
    /**
     * Get attendance data for management DataTable
     * 
     * @param Request $request
     * @return JsonResponse
     */
    private function getAttendanceManagementDataTable(Request $request): JsonResponse
    {
        $query = AttendanceRecord::with(['employee.user', 'employee.employeeType', 'approver'])
            ->select('attendance_records.*');
            
        return DataTables::of($query)
            ->addIndexColumn()
            ->addColumn('employee_name', function ($record) {
                return $record->employee->full_name;
            })
            ->addColumn('employee_id', function ($record) {
                return $record->employee->employee_id;
            })
            ->addColumn('employee_type', function ($record) {
                return $record->employee->employeeType->name;
            })
            ->addColumn('department', function ($record) {
                return $record->employee->department ?: 'N/A';
            })
            ->addColumn('formatted_date', function ($record) {
                return $record->date->format('M d, Y');
            })
            ->addColumn('check_times', function ($record) {
                $checkIn = $record->formatted_check_in ?: '--';
                $checkOut = $record->formatted_check_out ?: '--';
                return "$checkIn / $checkOut";
            })
            ->addColumn('hours_worked', function ($record) {
                return $record->total_hours_decimal ?: 0;
            })
            ->addColumn('status_badge', function ($record) {
                $statusColors = [
                    'present' => 'success',
                    'absent' => 'danger',
                    'late' => 'warning',
                    'half_day' => 'info',
                    'holiday' => 'secondary',
                    'leave' => 'primary'
                ];
                
                $color = $statusColors[$record->status] ?? 'secondary';
                return '<span class="badge badge-' . $color . '">' . ucfirst($record->status) . '</span>';
            })
            ->addColumn('approval_status', function ($record) {
                if ($record->is_approved) {
                    $approver = $record->approver ? $record->approver->name : 'System';
                    return '<span class="badge badge-success" title="Approved by ' . $approver . '">Approved</span>';
                }
                return '<span class="badge badge-warning">Pending</span>';
            })
            ->addColumn('actions', function ($record) {
                $actions = '';
                
                if (Auth::user()->can('update', $record)) {
                    $actions .= '<button type="button" class="btn btn-sm btn-primary me-1" onclick="editAttendance(' . $record->id . ')" title="Edit"><i class="fas fa-edit"></i></button>';
                }
                
                if (Auth::user()->can('approve', $record) && !$record->is_approved) {
                    $actions .= '<button type="button" class="btn btn-sm btn-success me-1" onclick="approveAttendance(' . $record->id . ')" title="Approve"><i class="fas fa-check"></i></button>';
                }
                
                if (Auth::user()->can('delete', $record)) {
                    $actions .= '<button type="button" class="btn btn-sm btn-danger" onclick="deleteAttendance(' . $record->id . ')" title="Delete"><i class="fas fa-trash"></i></button>';
                }
                
                return $actions;
            })
            ->filter(function ($query) use ($request) {
                // Search functionality
                if ($request->has('search') && !empty($request->search['value'])) {
                    $search = $request->search['value'];
                    $query->whereHas('employee', function ($employeeQuery) use ($search) {
                        $employeeQuery->where('first_name', 'like', "%{$search}%")
                            ->orWhere('last_name', 'like', "%{$search}%")
                            ->orWhere('employee_id', 'like', "%{$search}%");
                    });
                }
                
                // Filter by date range
                if ($request->filled('date_from')) {
                    $query->where('date', '>=', $request->date_from);
                }
                
                if ($request->filled('date_to')) {
                    $query->where('date', '<=', $request->date_to);
                }
                
                // Filter by employee
                if ($request->filled('employee_id')) {
                    $query->where('employee_id', $request->employee_id);
                }
                
                // Filter by department
                if ($request->filled('department')) {
                    $query->whereHas('employee', function ($employeeQuery) use ($request) {
                        $employeeQuery->where('department', $request->department);
                    });
                }
                
                // Filter by employee type
                if ($request->filled('employee_type_id')) {
                    $query->whereHas('employee', function ($employeeQuery) use ($request) {
                        $employeeQuery->where('employee_type_id', $request->employee_type_id);
                    });
                }
                
                // Filter by status
                if ($request->filled('status')) {
                    $query->where('status', $request->status);
                }
                
                // Filter by approval status
                if ($request->filled('approval_status')) {
                    $isApproved = $request->approval_status === 'approved';
                    $query->where('is_approved', $isApproved);
                }
            })
            ->rawColumns(['status_badge', 'approval_status', 'actions'])
            ->make(true);
    }
    
    /**
     * Manual attendance entry for supervisors
     * 
     * @param Request $request
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function manualEntry(Request $request): JsonResponse
    {
        $this->authorize('create', AttendanceRecord::class);
        
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'required|date',
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
            'status' => 'required|in:present,absent,late,half_day,holiday,leave',
            'notes' => 'nullable|string|max:500'
        ]);
        
        try {
            DB::beginTransaction();
            
            $employee = Employee::findOrFail($validated['employee_id']);
            $date = Carbon::parse($validated['date']);
            
            // Check if record already exists
            $existingRecord = $employee->getAttendanceForDate($date);
            if ($existingRecord) {
                throw ValidationException::withMessages([
                    'date' => 'Attendance record for this date already exists.'
                ]);
            }
            
            // Create attendance record
            $attendanceData = [
                'employee_id' => $employee->id,
                'date' => $date,
                'status' => $validated['status'],
                'check_in_method' => AttendanceRecord::METHOD_ADMIN,
                'check_out_method' => AttendanceRecord::METHOD_ADMIN,
                'notes' => $validated['notes'],
                'is_approved' => true,
                'approved_by' => Auth::id(),
                'approved_at' => now()
            ];
            
            if ($validated['check_in']) {
                $attendanceData['check_in'] = $date->copy()->setTimeFromTimeString($validated['check_in']);
            }
            
            if ($validated['check_out']) {
                $attendanceData['check_out'] = $date->copy()->setTimeFromTimeString($validated['check_out']);
            }
            
            $attendance = AttendanceRecord::create($attendanceData);
            
            // Calculate work hours if both times provided
            if ($attendance->check_in && $attendance->check_out) {
                $attendance->calculateWorkHours();
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Manual attendance entry created successfully.'
            ]);
            
        } catch (ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed.',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create attendance record.'
            ], 500);
        }
    }
    
    /**
     * Update attendance record
     * 
     * @param Request $request
     * @param AttendanceRecord $attendance
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(Request $request, AttendanceRecord $attendance): JsonResponse
    {
        $this->authorize('update', $attendance);
        
        $validated = $request->validate([
            'check_in' => 'nullable|date_format:H:i',
            'check_out' => 'nullable|date_format:H:i|after:check_in',
            'status' => 'required|in:present,absent,late,half_day,holiday,leave',
            'notes' => 'nullable|string|max:500'
        ]);
        
        try {
            DB::beginTransaction();
            
            $updateData = [
                'status' => $validated['status'],
                'notes' => $validated['notes']
            ];
            
            if ($validated['check_in']) {
                $updateData['check_in'] = $attendance->date->copy()->setTimeFromTimeString($validated['check_in']);
            }
            
            if ($validated['check_out']) {
                $updateData['check_out'] = $attendance->date->copy()->setTimeFromTimeString($validated['check_out']);
            }
            
            $attendance->update($updateData);
            
            // Recalculate work hours
            if ($attendance->check_in && $attendance->check_out) {
                $attendance->calculateWorkHours();
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Attendance record updated successfully.'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update attendance record.'
            ], 500);
        }
    }
    
    /**
     * Delete attendance record
     * 
     * @param AttendanceRecord $attendance
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function destroy(AttendanceRecord $attendance): JsonResponse
    {
        $this->authorize('delete', $attendance);
        
        try {
            $attendance->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Attendance record deleted successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete attendance record.'
            ], 500);
        }
    }
    
    /**
     * Bulk approve attendance records
     * 
     * @param Request $request
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function bulkApprove(Request $request): JsonResponse
    {
        $this->authorize('approve', AttendanceRecord::class);
        
        $validated = $request->validate([
            'attendance_ids' => 'required|array',
            'attendance_ids.*' => 'exists:attendance_records,id',
            'notes' => 'nullable|string|max:500'
        ]);
        
        try {
            DB::beginTransaction();
            
            $records = AttendanceRecord::whereIn('id', $validated['attendance_ids'])
                ->where('is_approved', false)
                ->get();
                
            foreach ($records as $record) {
                $record->approve(Auth::user(), $validated['notes']);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => count($records) . ' attendance records approved successfully.'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to approve attendance records.'
            ], 500);
        }
    }
    
    /**
     * Check if employee is honorary type
     * 
     * @param Employee $employee
     * @return bool
     */
    private function isHonoraryEmployee(Employee $employee): bool
    {
        // You can customize this logic based on how you identify honorary employees
        // For example, by employee type name or a specific field
        return $employee->employeeType && 
               str_contains(strtolower($employee->employeeType->name), 'honorary');
    }
    
    /**
     * Check if current time is within scheduled time
     * 
     * @param \Illuminate\Database\Eloquent\Collection $schedules
     * @param Carbon $currentTime
     * @return bool
     */
    private function isWithinScheduledTime($schedules, Carbon $currentTime): bool
    {
        $currentTimeString = $currentTime->format('H:i:s');
        
        foreach ($schedules as $schedule) {
            if ($schedule->period->containsTime($currentTimeString)) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Validate check-in location
     * 
     * @param Employee $employee
     * @param float $latitude
     * @param float $longitude
     * @return bool
     */
    private function isLocationValid(Employee $employee, float $latitude, float $longitude): bool
    {
        $settings = AttendanceRadiusSetting::active()
            ->where(function ($query) use ($employee) {
                $query->whereNull('allowed_employee_types')
                    ->orWhereJsonContains('allowed_employee_types', $employee->employee_type_id);
            })
            ->get();
            
        if ($settings->isEmpty()) {
            return true; // No location restrictions
        }
        
        foreach ($settings as $setting) {
            $distance = $this->calculateDistance(
                $latitude, 
                $longitude, 
                $setting->latitude, 
                $setting->longitude
            );
            
            if ($distance <= $setting->radius_meters) {
                return true;
            }
        }
        
        return false;
    }
    
    /**
     * Calculate distance between two points
     * 
     * @param float $lat1
     * @param float $lon1
     * @param float $lat2
     * @param float $lon2
     * @return float Distance in meters
     */
    private function calculateDistance(float $lat1, float $lon1, float $lat2, float $lon2): float
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
     * Determine attendance status based on check-in time and schedule
     * 
     * @param Employee $employee
     * @param \Illuminate\Database\Eloquent\Collection $schedules
     * @param Carbon $checkInTime
     * @return string
     */
    private function determineAttendanceStatus(Employee $employee, $schedules, Carbon $checkInTime): string
    {
        if ($schedules->isEmpty()) {
            return AttendanceRecord::STATUS_PRESENT;
        }
        
        $checkInTimeString = $checkInTime->format('H:i:s');
        $earliestStartTime = $schedules->min(function ($schedule) {
            return $schedule->period->start_time->format('H:i:s');
        });
        
        // Allow 15 minutes grace period
        $graceTime = Carbon::createFromFormat('H:i:s', $earliestStartTime)->addMinutes(15)->format('H:i:s');
        
        if ($checkInTimeString <= $earliestStartTime) {
            return AttendanceRecord::STATUS_PRESENT;
        } elseif ($checkInTimeString <= $graceTime) {
            return AttendanceRecord::STATUS_PRESENT; // Within grace period
        } else {
            return AttendanceRecord::STATUS_LATE;
        }
    }
    
    /**
     * Get monthly statistics for an employee
     * 
     * @param Employee $employee
     * @param Carbon $month
     * @return array
     */
    private function getMonthlyStats(Employee $employee, Carbon $month): array
    {
        $workingDays = $this->getWorkingDaysInMonth($month);
        
        $attendanceQuery = $employee->attendanceRecords()
            ->forMonth($month->year, $month->month);
            
        return [
            'total_working_days' => $workingDays,
            'present_days' => $attendanceQuery->clone()->present()->count(),
            'absent_days' => $attendanceQuery->clone()->absent()->count(),
            'late_days' => $attendanceQuery->clone()->where('status', AttendanceRecord::STATUS_LATE)->count(),
            'total_hours' => round($attendanceQuery->clone()->sum('total_hours_worked') / 60, 1),
            'overtime_hours' => round($attendanceQuery->clone()->sum('overtime_hours') / 60, 1),
        ];
    }
    
    /**
     * Get number of working days in a month
     * 
     * @param Carbon $month
     * @return int
     */
    private function getWorkingDaysInMonth(Carbon $month): int
    {
        $startOfMonth = $month->copy()->startOfMonth();
        $endOfMonth = $month->copy()->endOfMonth();
        $workingDays = 0;
        
        while ($startOfMonth->lte($endOfMonth)) {
            if ($startOfMonth->isWeekday()) {
                $workingDays++;
            }
            $startOfMonth->addDay();
        }
        
        return $workingDays;
    }
}
