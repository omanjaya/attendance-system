<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\Attendance;
use App\Models\Leave;
use App\Models\PayrollRecord;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use DB;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        try {
            $user = auth()->user();
            $isEmployee = $user->employee !== null;
            
            if ($isEmployee) {
                return $this->getEmployeeDashboard($user);
            } else {
                return $this->getAdminDashboard($user);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to load dashboard',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getStats(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', 'month'); // today, week, month, year
            $startDate = $this->getStartDate($period);
            $endDate = now();

            $stats = [
                'employees' => [
                    'total' => Employee::count(),
                    'active' => Employee::where('status', 'active')->count(),
                    'present_today' => $this->getPresentToday(),
                    'on_leave_today' => $this->getOnLeaveToday(),
                ],
                'attendance' => [
                    'today' => $this->getTodayAttendanceStats(),
                    'period' => $this->getPeriodAttendanceStats($startDate, $endDate),
                ],
                'leave_requests' => [
                    'pending' => Leave::where('status', 'pending')->count(),
                    'approved_today' => Leave::where('status', 'approved')
                        ->whereDate('created_at', today())
                        ->count(),
                    'total_this_month' => Leave::whereMonth('created_at', now()->month)
                        ->whereYear('created_at', now()->year)
                        ->count(),
                ],
                'payroll' => [
                    'pending_approval' => PayrollRecord::where('status', 'draft')->count(),
                    'ready_for_payment' => PayrollRecord::where('status', 'approved')->count(),
                    'paid_this_month' => PayrollRecord::where('status', 'paid')
                        ->whereMonth('period_start', now()->month)
                        ->whereYear('period_start', now()->year)
                        ->count(),
                ],
                'notifications' => [
                    'unread' => Notification::where('user_id', auth()->id())
                        ->whereNull('read_at')
                        ->count(),
                    'today' => Notification::where('user_id', auth()->id())
                        ->whereDate('created_at', today())
                        ->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => $stats,
                'period' => $period,
                'date_range' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getChartData(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', 'month');
            $chartType = $request->get('type', 'all'); // attendance, department, performance
            
            $charts = [];

            if ($chartType === 'all' || $chartType === 'attendance') {
                $charts['attendance_trends'] = $this->getAttendanceTrendsChart($period);
            }

            if ($chartType === 'all' || $chartType === 'department') {
                $charts['department_distribution'] = $this->getDepartmentDistributionChart();
                $charts['department_attendance'] = $this->getDepartmentAttendanceChart($period);
            }

            if ($chartType === 'all' || $chartType === 'performance') {
                $charts['top_performers'] = $this->getTopPerformersChart($period);
            }

            if ($chartType === 'all' || $chartType === 'leave') {
                $charts['leave_trends'] = $this->getLeaveTrendsChart($period);
            }

            return response()->json([
                'success' => true,
                'data' => $charts
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get chart data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Private methods for employee dashboard
    private function getEmployeeDashboard($user): JsonResponse
    {
        $employee = $user->employee;
        $today = today();

        $todayAttendance = Attendance::where('employee_id', $employee->id)
            ->whereDate('date', $today)
            ->first();

        $thisMonthAttendance = Attendance::where('employee_id', $employee->id)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->get();

        $recentLeaves = Leave::where('employee_id', $employee->id)
            ->latest()
            ->take(5)
            ->get();

        $latestPayroll = PayrollRecord::where('employee_id', $employee->id)
            ->latest('period_start')
            ->first();

        $notifications = Notification::where('user_id', $user->id)
            ->whereNull('read_at')
            ->latest()
            ->take(5)
            ->get();

        $data = [
            'user' => $user,
            'employee' => $employee,
            'today_attendance' => $todayAttendance,
            'attendance_summary' => [
                'this_month_total' => $thisMonthAttendance->count(),
                'present_days' => $thisMonthAttendance->where('status', 'present')->count(),
                'late_days' => $thisMonthAttendance->where('status', 'late')->count(),
                'absent_days' => $thisMonthAttendance->where('status', 'absent')->count(),
                'total_hours' => round($thisMonthAttendance->sum('total_hours'), 2),
                'average_hours' => round($thisMonthAttendance->avg('total_hours'), 2),
            ],
            'recent_leaves' => $recentLeaves,
            'latest_payroll' => $latestPayroll,
            'notifications' => $notifications,
            'quick_stats' => [
                'attendance_rate' => $this->calculateAttendanceRate($employee->id),
                'leave_balance' => $this->calculateLeaveBalance($employee->id),
                'punctuality_score' => $this->calculatePunctualityScore($employee->id),
            ]
        ];

        return response()->json([
            'success' => true,
            'type' => 'employee',
            'data' => $data
        ]);
    }

    // Private methods for admin dashboard
    private function getAdminDashboard($user): JsonResponse
    {
        $today = today();

        $data = [
            'user' => $user,
            'overview' => [
                'total_employees' => Employee::count(),
                'present_today' => $this->getPresentToday(),
                'absent_today' => $this->getAbsentToday(),
                'late_today' => $this->getLateToday(),
                'on_leave_today' => $this->getOnLeaveToday(),
            ],
            'recent_activities' => $this->getRecentActivities(),
            'department_overview' => $this->getDepartmentOverview(),
            'pending_approvals' => [
                'leave_requests' => Leave::where('status', 'pending')->count(),
                'payroll_records' => PayrollRecord::where('status', 'draft')->count(),
            ],
            'alerts' => $this->getSystemAlerts(),
            'notifications' => Notification::where('user_id', $user->id)
                ->whereNull('read_at')
                ->latest()
                ->take(5)
                ->get(),
        ];

        return response()->json([
            'success' => true,
            'type' => 'admin',
            'data' => $data
        ]);
    }

    // Helper methods
    private function getStartDate($period)
    {
        switch ($period) {
            case 'today':
                return today();
            case 'week':
                return now()->startOfWeek();
            case 'month':
                return now()->startOfMonth();
            case 'year':
                return now()->startOfYear();
            default:
                return now()->startOfMonth();
        }
    }

    private function getPresentToday()
    {
        return Attendance::whereDate('date', today())
            ->where('status', 'present')
            ->count();
    }

    private function getAbsentToday()
    {
        return Attendance::whereDate('date', today())
            ->where('status', 'absent')
            ->count();
    }

    private function getLateToday()
    {
        return Attendance::whereDate('date', today())
            ->where('status', 'late')
            ->count();
    }

    private function getOnLeaveToday()
    {
        return Leave::where('status', 'approved')
            ->whereDate('start_date', '<=', today())
            ->whereDate('end_date', '>=', today())
            ->count();
    }

    private function getTodayAttendanceStats()
    {
        $today = today();
        $stats = Attendance::whereDate('date', $today)
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent
            ')
            ->first();

        return [
            'total' => $stats->total ?? 0,
            'present' => $stats->present ?? 0,
            'late' => $stats->late ?? 0,
            'absent' => $stats->absent ?? 0,
        ];
    }

    private function getPeriodAttendanceStats($startDate, $endDate)
    {
        $stats = Attendance::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent,
                AVG(total_hours) as avg_hours
            ')
            ->first();

        return [
            'total' => $stats->total ?? 0,
            'present' => $stats->present ?? 0,
            'late' => $stats->late ?? 0,
            'absent' => $stats->absent ?? 0,
            'average_hours' => round($stats->avg_hours ?? 0, 2),
            'attendance_rate' => $stats->total > 0 ? round(($stats->present + $stats->late) / $stats->total * 100, 2) : 0,
        ];
    }

    private function getAttendanceTrendsChart($period)
    {
        $startDate = $this->getStartDate($period);
        $endDate = now();
        
        $data = [];
        $currentDate = $startDate->copy();

        while ($currentDate <= $endDate) {
            $dayStats = Attendance::whereDate('date', $currentDate)
                ->selectRaw('
                    COUNT(*) as total,
                    SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
                    SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late,
                    SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent
                ')
                ->first();

            $data[] = [
                'date' => $currentDate->format('Y-m-d'),
                'present' => $dayStats->present ?? 0,
                'late' => $dayStats->late ?? 0,
                'absent' => $dayStats->absent ?? 0,
            ];

            $currentDate->addDay();
        }

        return $data;
    }

    private function getDepartmentDistributionChart()
    {
        return Employee::selectRaw('department, COUNT(*) as count')
            ->groupBy('department')
            ->get()
            ->map(function ($item) {
                return [
                    'label' => $item->department,
                    'value' => $item->count,
                ];
            });
    }

    private function getDepartmentAttendanceChart($period)
    {
        $startDate = $this->getStartDate($period);
        $endDate = now();

        return Employee::with(['attendances' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('date', [$startDate, $endDate]);
            }])
            ->get()
            ->groupBy('department')
            ->map(function ($employees, $department) {
                $totalAttendances = $employees->sum(function ($emp) {
                    return $emp->attendances->count();
                });
                $presentAttendances = $employees->sum(function ($emp) {
                    return $emp->attendances->where('status', 'present')->count();
                });
                
                return [
                    'department' => $department,
                    'attendance_rate' => $totalAttendances > 0 ? round($presentAttendances / $totalAttendances * 100, 2) : 0,
                ];
            })
            ->values();
    }

    private function getTopPerformersChart($period)
    {
        $startDate = $this->getStartDate($period);
        $endDate = now();

        return Employee::with(['attendances' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('date', [$startDate, $endDate]);
            }])
            ->get()
            ->map(function ($employee) {
                $attendances = $employee->attendances;
                $presentDays = $attendances->where('status', 'present')->count();
                $totalDays = $attendances->count();
                $rate = $totalDays > 0 ? round($presentDays / $totalDays * 100, 2) : 0;
                
                return [
                    'name' => $employee->name,
                    'attendance_rate' => $rate,
                ];
            })
            ->sortByDesc('attendance_rate')
            ->take(10)
            ->values();
    }

    private function getLeaveTrendsChart($period)
    {
        $startDate = $this->getStartDate($period);
        $endDate = now();

        return Leave::selectRaw('
                DATE(start_date) as date,
                COUNT(*) as total,
                SUM(CASE WHEN status = "approved" THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = "rejected" THEN 1 ELSE 0 END) as rejected
            ')
            ->whereBetween('start_date', [$startDate, $endDate])
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    }

    private function getRecentActivities()
    {
        return [
            'recent_clock_ins' => Attendance::with('employee:id,name')
                ->whereDate('date', today())
                ->whereNotNull('clock_in')
                ->latest('clock_in')
                ->take(5)
                ->get(),
            'recent_leave_requests' => Leave::with('employee:id,name')
                ->latest()
                ->take(5)
                ->get(),
        ];
    }

    private function getDepartmentOverview()
    {
        return Employee::selectRaw('
                department,
                COUNT(*) as total_employees,
                SUM(CASE WHEN status = "active" THEN 1 ELSE 0 END) as active_employees
            ')
            ->groupBy('department')
            ->get();
    }

    private function getSystemAlerts()
    {
        $alerts = [];

        // Check for employees without recent attendance
        $absentEmployees = Employee::whereDoesntHave('attendances', function ($q) {
                $q->whereDate('date', today());
            })
            ->where('status', 'active')
            ->count();

        if ($absentEmployees > 0) {
            $alerts[] = [
                'type' => 'warning',
                'message' => "{$absentEmployees} employees haven't clocked in today",
                'action' => 'View Attendance',
                'link' => '/attendance'
            ];
        }

        // Check for pending leave requests
        $pendingLeaves = Leave::where('status', 'pending')->count();
        if ($pendingLeaves > 0) {
            $alerts[] = [
                'type' => 'info',
                'message' => "{$pendingLeaves} leave requests pending approval",
                'action' => 'Review Requests',
                'link' => '/leaves'
            ];
        }

        return $alerts;
    }

    private function calculateAttendanceRate($employeeId)
    {
        $thisMonth = Attendance::where('employee_id', $employeeId)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->get();

        $totalDays = $thisMonth->count();
        $presentDays = $thisMonth->whereIn('status', ['present', 'late'])->count();

        return $totalDays > 0 ? round($presentDays / $totalDays * 100, 2) : 0;
    }

    private function calculateLeaveBalance($employeeId)
    {
        // This would calculate based on company policies
        // For now, return a placeholder
        return 15; // Days remaining
    }

    private function calculatePunctualityScore($employeeId)
    {
        $thisMonth = Attendance::where('employee_id', $employeeId)
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->get();

        $totalDays = $thisMonth->count();
        $onTimeDays = $thisMonth->where('status', 'present')->count();

        return $totalDays > 0 ? round($onTimeDays / $totalDays * 100, 2) : 0;
    }
}
