<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\Employee;
use App\Models\AttendanceRecord;
use App\Models\LeaveRequest;
use App\Models\Schedule;
use App\Models\EmployeeType;
use Carbon\Carbon;

/**
 * DashboardController
 * 
 * Handles dashboard functionality including statistics, recent activity,
 * quick actions, and data visualization for the attendance system.
 */
class DashboardController extends Controller
{
    /**
     * Display the main dashboard
     * 
     * @return View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(): View
    {
        $user = Auth::user();
        
        // Get basic stats for the dashboard
        $stats = $this->getDashboardStats();
        
        // Get recent activity
        $recentActivity = $this->getRecentActivity();
        
        // Get quick actions based on user permissions
        $quickActions = $this->getQuickActions();
        
        // Get user's attendance status for today
        $todayAttendance = null;
        if ($user->isEmployee()) {
            $todayAttendance = $this->getTodayAttendanceStatus($user->employee);
        }
        
        return view('dashboard.index', compact(
            'stats',
            'recentActivity',
            'quickActions',
            'todayAttendance'
        ));
    }
    
    /**
     * Get welcome page for unauthenticated users
     * 
     * @return View
     */
    public function welcome(): View
    {
        return view('welcome');
    }
    
    /**
     * Get dashboard statistics
     * 
     * @return JsonResponse
     */
    public function stats(): JsonResponse
    {
        try {
            $stats = $this->getDashboardStats();
            
            return response()->json([
                'success' => true,
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
    
    /**
     * Get dashboard statistics data
     * 
     * @return array
     */
    private function getDashboardStats(): array
    {
        $user = Auth::user();
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();
        
        $stats = [
            'overview' => [
                'total_employees' => 0,
                'active_employees' => 0,
                'present_today' => 0,
                'absent_today' => 0,
                'on_leave_today' => 0,
                'late_today' => 0
            ],
            'attendance' => [
                'attendance_rate_today' => 0,
                'attendance_rate_month' => 0,
                'average_work_hours' => 0,
                'overtime_hours_month' => 0
            ],
            'leaves' => [
                'pending_requests' => 0,
                'approved_this_month' => 0,
                'rejected_this_month' => 0
            ],
            'charts' => [
                'attendance_trend' => [],
                'department_breakdown' => [],
                'employee_types' => []
            ]
        ];
        
        // Get employee statistics
        if ($user->can('view employees') || $user->can('manage employees')) {
            $stats['overview']['total_employees'] = Employee::count();
            $stats['overview']['active_employees'] = Employee::active()->count();
            
            // Today's attendance
            $todayAttendance = AttendanceRecord::where('date', $today)
                ->with('employee')
                ->get();
                
            $stats['overview']['present_today'] = $todayAttendance->where('status', AttendanceRecord::STATUS_PRESENT)->count();
            $stats['overview']['absent_today'] = $todayAttendance->where('status', AttendanceRecord::STATUS_ABSENT)->count();
            $stats['overview']['late_today'] = $todayAttendance->where('status', AttendanceRecord::STATUS_LATE)->count();
            $stats['overview']['on_leave_today'] = $todayAttendance->where('status', AttendanceRecord::STATUS_LEAVE)->count();
            
            // Calculate attendance rate
            $totalActiveEmployees = $stats['overview']['active_employees'];
            $presentCount = $stats['overview']['present_today'] + $stats['overview']['late_today'];
            $stats['attendance']['attendance_rate_today'] = $totalActiveEmployees > 0 
                ? round(($presentCount / $totalActiveEmployees) * 100, 1) 
                : 0;
                
            // Monthly attendance rate
            $monthlyAttendance = AttendanceRecord::whereMonth('date', $thisMonth->month)
                ->whereYear('date', $thisMonth->year)
                ->present()
                ->count();
                
            $workingDaysThisMonth = $this->getWorkingDaysInMonth($thisMonth);
            $expectedAttendance = $totalActiveEmployees * $workingDaysThisMonth;
            
            $stats['attendance']['attendance_rate_month'] = $expectedAttendance > 0 
                ? round(($monthlyAttendance / $expectedAttendance) * 100, 1) 
                : 0;
                
            // Average work hours and overtime
            $monthlyStats = AttendanceRecord::whereMonth('date', $thisMonth->month)
                ->whereYear('date', $thisMonth->year)
                ->selectRaw('AVG(total_hours_worked) as avg_hours, SUM(overtime_hours) as total_overtime')
                ->first();
                
            $stats['attendance']['average_work_hours'] = $monthlyStats ? round($monthlyStats->avg_hours / 60, 1) : 0;
            $stats['attendance']['overtime_hours_month'] = $monthlyStats ? round($monthlyStats->total_overtime / 60, 1) : 0;
        }
        
        // Get leave statistics
        if ($user->can('view leaves') || $user->can('manage leaves')) {
            $stats['leaves']['pending_requests'] = LeaveRequest::where('status', 'pending')->count();
            $stats['leaves']['approved_this_month'] = LeaveRequest::where('status', 'approved')
                ->whereMonth('created_at', $thisMonth->month)
                ->whereYear('created_at', $thisMonth->year)
                ->count();
            $stats['leaves']['rejected_this_month'] = LeaveRequest::where('status', 'rejected')
                ->whereMonth('created_at', $thisMonth->month)
                ->whereYear('created_at', $thisMonth->year)
                ->count();
        }
        
        // Get chart data
        if ($user->can('view reports')) {
            $stats['charts'] = $this->getChartData();
        }
        
        return $stats;
    }
    
    /**
     * Get recent activity data
     * 
     * @return array
     */
    private function getRecentActivity(): array
    {
        $user = Auth::user();
        $activities = [];
        
        // Recent attendance records
        if ($user->can('view attendance') || $user->can('manage attendance')) {
            $recentAttendance = AttendanceRecord::with(['employee.user'])
                ->latest()
                ->take(5)
                ->get();
                
            foreach ($recentAttendance as $record) {
                $activities[] = [
                    'type' => 'attendance',
                    'title' => $record->employee->full_name . ' ' . ($record->hasCheckedIn() ? 'checked in' : 'checked out'),
                    'time' => $record->updated_at,
                    'icon' => 'clock',
                    'color' => $record->isPresent() ? 'success' : 'warning'
                ];
            }
        }
        
        // Recent leave requests
        if ($user->can('view leaves') || $user->can('manage leaves')) {
            $recentLeaves = LeaveRequest::with(['employee.user'])
                ->latest()
                ->take(5)
                ->get();
                
            foreach ($recentLeaves as $leave) {
                $activities[] = [
                    'type' => 'leave',
                    'title' => $leave->employee->full_name . ' requested ' . $leave->leave_type,
                    'time' => $leave->created_at,
                    'icon' => 'calendar',
                    'color' => $leave->status === 'pending' ? 'warning' : ($leave->status === 'approved' ? 'success' : 'danger')
                ];
            }
        }
        
        // Sort activities by time
        usort($activities, function($a, $b) {
            return $b['time'] <=> $a['time'];
        });
        
        return array_slice($activities, 0, 10);
    }
    
    /**
     * Get quick actions based on user permissions
     * 
     * @return array
     */
    private function getQuickActions(): array
    {
        $user = Auth::user();
        $actions = [];
        
        // Employee actions
        if ($user->isEmployee()) {
            $todayAttendance = $user->employee->getAttendanceForDate(Carbon::today());
            
            if (!$todayAttendance || !$todayAttendance->hasCheckedIn()) {
                $actions[] = [
                    'title' => 'Check In',
                    'icon' => 'login',
                    'url' => route('attendance.check-in'),
                    'method' => 'POST',
                    'class' => 'btn-success'
                ];
            } elseif (!$todayAttendance->hasCheckedOut()) {
                $actions[] = [
                    'title' => 'Check Out',
                    'icon' => 'logout',
                    'url' => route('attendance.check-out'),
                    'method' => 'POST',
                    'class' => 'btn-danger'
                ];
            }
            
            $actions[] = [
                'title' => 'Request Leave',
                'icon' => 'calendar-plus',
                'url' => route('leaves.create'),
                'method' => 'GET',
                'class' => 'btn-primary'
            ];
        }
        
        // Management actions
        if ($user->can('manage employees')) {
            $actions[] = [
                'title' => 'Add Employee',
                'icon' => 'user-plus',
                'url' => route('employees.create'),
                'method' => 'GET',
                'class' => 'btn-primary'
            ];
        }
        
        if ($user->can('manage attendance')) {
            $pendingAttendance = AttendanceRecord::pendingApproval()->count();
            if ($pendingAttendance > 0) {
                $actions[] = [
                    'title' => "Approve Attendance ($pendingAttendance)",
                    'icon' => 'check-circle',
                    'url' => route('attendance.manage'),
                    'method' => 'GET',
                    'class' => 'btn-warning'
                ];
            }
        }
        
        if ($user->can('manage leaves')) {
            $pendingLeaves = LeaveRequest::where('status', 'pending')->count();
            if ($pendingLeaves > 0) {
                $actions[] = [
                    'title' => "Approve Leaves ($pendingLeaves)",
                    'icon' => 'calendar-check',
                    'url' => route('leaves.manage.pending'),
                    'method' => 'GET',
                    'class' => 'btn-info'
                ];
            }
        }
        
        return $actions;
    }
    
    /**
     * Get today's attendance status for an employee
     * 
     * @param Employee $employee
     * @return array|null
     */
    private function getTodayAttendanceStatus(Employee $employee): ?array
    {
        $today = Carbon::today();
        $attendance = $employee->getAttendanceForDate($today);
        $schedules = $employee->getSchedulesForDate($today);
        
        if (!$attendance && $schedules->isEmpty()) {
            return null; // No schedule for today
        }
        
        $status = [
            'has_schedule' => !$schedules->isEmpty(),
            'checked_in' => $attendance ? $attendance->hasCheckedIn() : false,
            'checked_out' => $attendance ? $attendance->hasCheckedOut() : false,
            'check_in_time' => $attendance ? $attendance->formatted_check_in : null,
            'check_out_time' => $attendance ? $attendance->formatted_check_out : null,
            'status' => $attendance ? $attendance->status : 'absent',
            'total_hours' => $attendance ? $attendance->total_hours_decimal : 0,
            'scheduled_hours' => $schedules->sum(function($schedule) {
                return $schedule->period->duration_hours;
            })
        ];
        
        return $status;
    }
    
    /**
     * Get chart data for dashboard
     * 
     * @return array
     */
    private function getChartData(): array
    {
        $charts = [];
        
        // Attendance trend for last 7 days
        $attendanceTrend = [];
        for ($i = 6; $i >= 0; $i--) {
            $date = Carbon::today()->subDays($i);
            $present = AttendanceRecord::where('date', $date)
                ->present()
                ->count();
            $absent = AttendanceRecord::where('date', $date)
                ->absent()
                ->count();
                
            $attendanceTrend[] = [
                'date' => $date->format('M d'),
                'present' => $present,
                'absent' => $absent,
                'total' => $present + $absent
            ];
        }
        $charts['attendance_trend'] = $attendanceTrend;
        
        // Department breakdown
        $departmentBreakdown = Employee::active()
            ->selectRaw('department, COUNT(*) as count')
            ->whereNotNull('department')
            ->groupBy('department')
            ->get()
            ->map(function($item) {
                return [
                    'department' => $item->department ?: 'Unassigned',
                    'count' => $item->count
                ];
            })
            ->toArray();
        $charts['department_breakdown'] = $departmentBreakdown;
        
        // Employee types
        $employeeTypes = EmployeeType::withCount('activeEmployees')
            ->having('active_employees_count', '>', 0)
            ->get()
            ->map(function($type) {
                return [
                    'type' => $type->name,
                    'count' => $type->active_employees_count
                ];
            })
            ->toArray();
        $charts['employee_types'] = $employeeTypes;
        
        return $charts;
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
            // Assuming Monday to Friday are working days
            if ($startOfMonth->isWeekday()) {
                $workingDays++;
            }
            $startOfMonth->addDay();
        }
        
        return $workingDays;
    }
}
