<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Employee;
use App\Models\PayrollRecord;
use App\Models\Leave;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;
use DB;

class ReportController extends Controller
{
    public function dashboard(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', 'month'); // week, month, quarter, year
            $startDate = $this->getStartDate($period);
            $endDate = now();

            $data = [
                'attendance_overview' => $this->getAttendanceOverview($startDate, $endDate),
                'employee_performance' => $this->getTopPerformers($startDate, $endDate),
                'department_stats' => $this->getDepartmentStats($startDate, $endDate),
                'leave_summary' => $this->getLeaveSummary($startDate, $endDate),
                'payroll_summary' => $this->getPayrollSummary($startDate, $endDate),
                'trends' => $this->getTrends($startDate, $endDate),
            ];

            return response()->json([
                'success' => true,
                'data' => $data,
                'period' => $period,
                'date_range' => [
                    'start' => $startDate->toDateString(),
                    'end' => $endDate->toDateString()
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate dashboard report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function attendance(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'employee_id' => 'nullable|exists:employees,id',
                'department' => 'nullable|string',
                'export_format' => 'nullable|in:json,excel,pdf'
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date']) : now()->startOfMonth();
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date']) : now()->endOfMonth();

            $query = Attendance::with(['employee:id,name,employee_number,department'])
                ->whereBetween('date', [$startDate, $endDate]);

            if (!empty($validated['employee_id'])) {
                $query->where('employee_id', $validated['employee_id']);
            }

            if (!empty($validated['department'])) {
                $query->whereHas('employee', function ($q) use ($validated) {
                    $q->where('department', $validated['department']);
                });
            }

            $attendanceRecords = $query->orderBy('date', 'desc')->get();

            $summary = [
                'total_records' => $attendanceRecords->count(),
                'present_days' => $attendanceRecords->where('status', 'present')->count(),
                'late_days' => $attendanceRecords->where('status', 'late')->count(),
                'absent_days' => $attendanceRecords->where('status', 'absent')->count(),
                'average_hours' => round($attendanceRecords->avg('total_hours'), 2),
                'total_overtime' => round($attendanceRecords->sum('overtime_hours'), 2),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'records' => $attendanceRecords,
                    'summary' => $summary,
                    'filters' => $validated,
                    'date_range' => [
                        'start' => $startDate->toDateString(),
                        'end' => $endDate->toDateString()
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate attendance report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function payroll(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'period' => 'nullable|string',
                'year' => 'nullable|integer|min:2020|max:2030',
                'month' => 'nullable|integer|min:1|max:12',
                'employee_id' => 'nullable|exists:employees,id',
                'department' => 'nullable|string',
                'status' => 'nullable|in:draft,approved,paid'
            ]);

            $query = PayrollRecord::with(['employee:id,name,employee_number,department']);

            if (!empty($validated['period'])) {
                $query->forPeriod($validated['period']);
            } elseif (!empty($validated['year'])) {
                $query->forYear($validated['year']);
                if (!empty($validated['month'])) {
                    $query->forMonth($validated['year'], $validated['month']);
                }
            }

            if (!empty($validated['employee_id'])) {
                $query->where('employee_id', $validated['employee_id']);
            }

            if (!empty($validated['department'])) {
                $query->whereHas('employee', function ($q) use ($validated) {
                    $q->where('department', $validated['department']);
                });
            }

            if (!empty($validated['status'])) {
                $query->where('status', $validated['status']);
            }

            $payrollRecords = $query->orderBy('period_start', 'desc')->get();

            $summary = [
                'total_records' => $payrollRecords->count(),
                'total_gross_pay' => $payrollRecords->sum('gross_pay'),
                'total_net_pay' => $payrollRecords->sum('net_pay'),
                'total_deductions' => $payrollRecords->sum('deductions'),
                'total_tax' => $payrollRecords->sum('tax_deduction'),
                'average_gross_pay' => round($payrollRecords->avg('gross_pay'), 2),
                'average_net_pay' => round($payrollRecords->avg('net_pay'), 2),
                'status_breakdown' => [
                    'draft' => $payrollRecords->where('status', 'draft')->count(),
                    'approved' => $payrollRecords->where('status', 'approved')->count(),
                    'paid' => $payrollRecords->where('status', 'paid')->count(),
                ]
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'records' => $payrollRecords,
                    'summary' => $summary,
                    'filters' => $validated
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate payroll report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function leave(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'employee_id' => 'nullable|exists:employees,id',
                'department' => 'nullable|string',
                'type' => 'nullable|string',
                'status' => 'nullable|in:pending,approved,rejected'
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date']) : now()->startOfYear();
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date']) : now()->endOfYear();

            $query = Leave::with(['employee:id,name,employee_number,department'])
                ->where(function ($q) use ($startDate, $endDate) {
                    $q->whereBetween('start_date', [$startDate, $endDate])
                      ->orWhereBetween('end_date', [$startDate, $endDate])
                      ->orWhere(function ($subQ) use ($startDate, $endDate) {
                          $subQ->where('start_date', '<=', $startDate)
                               ->where('end_date', '>=', $endDate);
                      });
                });

            if (!empty($validated['employee_id'])) {
                $query->where('employee_id', $validated['employee_id']);
            }

            if (!empty($validated['department'])) {
                $query->whereHas('employee', function ($q) use ($validated) {
                    $q->where('department', $validated['department']);
                });
            }

            if (!empty($validated['type'])) {
                $query->where('type', $validated['type']);
            }

            if (!empty($validated['status'])) {
                $query->where('status', $validated['status']);
            }

            $leaveRecords = $query->orderBy('start_date', 'desc')->get();

            $summary = [
                'total_requests' => $leaveRecords->count(),
                'total_days' => $leaveRecords->sum('days'),
                'pending_requests' => $leaveRecords->where('status', 'pending')->count(),
                'approved_requests' => $leaveRecords->where('status', 'approved')->count(),
                'rejected_requests' => $leaveRecords->where('status', 'rejected')->count(),
                'type_breakdown' => $leaveRecords->groupBy('type')->map->count(),
                'average_days_per_request' => round($leaveRecords->avg('days'), 1),
            ];

            return response()->json([
                'success' => true,
                'data' => [
                    'records' => $leaveRecords,
                    'summary' => $summary,
                    'filters' => $validated,
                    'date_range' => [
                        'start' => $startDate->toDateString(),
                        'end' => $endDate->toDateString()
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate leave report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function employeePerformance(Request $request): JsonResponse
    {
        try {
            $validated = $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
                'employee_id' => 'nullable|exists:employees,id',
                'department' => 'nullable|string',
                'limit' => 'nullable|integer|min:1|max:100'
            ]);

            $startDate = $validated['start_date'] ? Carbon::parse($validated['start_date']) : now()->startOfMonth();
            $endDate = $validated['end_date'] ? Carbon::parse($validated['end_date']) : now()->endOfMonth();
            $limit = $validated['limit'] ?? 20;

            $query = Employee::with(['attendances' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('date', [$startDate, $endDate]);
            }]);

            if (!empty($validated['employee_id'])) {
                $query->where('id', $validated['employee_id']);
            }

            if (!empty($validated['department'])) {
                $query->where('department', $validated['department']);
            }

            $employees = $query->get();

            $performanceData = $employees->map(function ($employee) use ($startDate, $endDate) {
                $attendances = $employee->attendances;
                $totalDays = $startDate->diffInDays($endDate) + 1;
                $workingDays = $this->getWorkingDays($startDate, $endDate);

                $presentDays = $attendances->where('status', 'present')->count();
                $lateDays = $attendances->where('status', 'late')->count();
                $absentDays = $attendances->where('status', 'absent')->count();
                $totalHours = $attendances->sum('total_hours');
                $overtimeHours = $attendances->sum('overtime_hours');

                $attendanceRate = $workingDays > 0 ? round(($presentDays + $lateDays) / $workingDays * 100, 2) : 0;
                $punctualityRate = ($presentDays + $lateDays) > 0 ? round($presentDays / ($presentDays + $lateDays) * 100, 2) : 0;
                $avgHoursPerDay = $attendances->count() > 0 ? round($totalHours / $attendances->count(), 2) : 0;

                return [
                    'employee' => $employee->only(['id', 'name', 'employee_number', 'department', 'position']),
                    'metrics' => [
                        'attendance_rate' => $attendanceRate,
                        'punctuality_rate' => $punctualityRate,
                        'present_days' => $presentDays,
                        'late_days' => $lateDays,
                        'absent_days' => $absentDays,
                        'total_hours' => round($totalHours, 2),
                        'overtime_hours' => round($overtimeHours, 2),
                        'average_hours_per_day' => $avgHoursPerDay,
                    ],
                    'performance_score' => round(($attendanceRate * 0.6) + ($punctualityRate * 0.4), 2)
                ];
            });

            $performanceData = $performanceData->sortByDesc('performance_score')->take($limit)->values();

            return response()->json([
                'success' => true,
                'data' => [
                    'employees' => $performanceData,
                    'summary' => [
                        'total_employees' => $employees->count(),
                        'average_attendance_rate' => round($performanceData->avg('metrics.attendance_rate'), 2),
                        'average_punctuality_rate' => round($performanceData->avg('metrics.punctuality_rate'), 2),
                        'top_performer' => $performanceData->first(),
                    ],
                    'filters' => $validated,
                    'date_range' => [
                        'start' => $startDate->toDateString(),
                        'end' => $endDate->toDateString()
                    ]
                ]
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate employee performance report',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function attendanceTrends(Request $request): JsonResponse
    {
        try {
            $period = $request->get('period', 'month');
            $startDate = $this->getStartDate($period);
            $endDate = now();

            $trendData = [];
            $currentDate = $startDate->copy();

            while ($currentDate <= $endDate) {
                $nextDate = $currentDate->copy()->addDay();
                
                $dayData = Attendance::whereDate('date', $currentDate)
                    ->selectRaw('
                        COUNT(*) as total,
                        SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
                        SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late,
                        SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent
                    ')
                    ->first();

                $trendData[] = [
                    'date' => $currentDate->toDateString(),
                    'total' => $dayData->total ?? 0,
                    'present' => $dayData->present ?? 0,
                    'late' => $dayData->late ?? 0,
                    'absent' => $dayData->absent ?? 0,
                ];

                $currentDate = $nextDate;
            }

            return response()->json([
                'success' => true,
                'data' => $trendData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate attendance trends',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function employeeDistribution(Request $request): JsonResponse
    {
        try {
            $distributionData = [
                'by_department' => Employee::selectRaw('department, COUNT(*) as count')
                    ->groupBy('department')
                    ->get(),
                'by_position' => Employee::selectRaw('position, COUNT(*) as count')
                    ->groupBy('position')
                    ->get(),
                'by_employee_type' => Employee::selectRaw('employee_type, COUNT(*) as count')
                    ->groupBy('employee_type')
                    ->get(),
                'by_status' => Employee::selectRaw('status, COUNT(*) as count')
                    ->groupBy('status')
                    ->get(),
            ];

            return response()->json([
                'success' => true,
                'data' => $distributionData
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate employee distribution',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // Export methods
    public function exportAttendance(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Export functionality not implemented yet'
        ], 501);
    }

    public function exportPayroll(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Export functionality not implemented yet'
        ], 501);
    }

    public function exportPerformance(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Export functionality not implemented yet'
        ], 501);
    }

    // Private helper methods
    private function getStartDate($period)
    {
        switch ($period) {
            case 'week':
                return now()->startOfWeek();
            case 'month':
                return now()->startOfMonth();
            case 'quarter':
                return now()->startOfQuarter();
            case 'year':
                return now()->startOfYear();
            default:
                return now()->startOfMonth();
        }
    }

    private function getAttendanceOverview($startDate, $endDate)
    {
        return Attendance::whereBetween('date', [$startDate, $endDate])
            ->selectRaw('
                COUNT(*) as total_records,
                SUM(CASE WHEN status = "present" THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = "late" THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = "absent" THEN 1 ELSE 0 END) as absent,
                AVG(total_hours) as avg_hours,
                SUM(overtime_hours) as total_overtime
            ')
            ->first();
    }

    private function getTopPerformers($startDate, $endDate, $limit = 5)
    {
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
                    'employee' => $employee->only(['id', 'name', 'department']),
                    'attendance_rate' => $rate,
                    'present_days' => $presentDays,
                    'total_days' => $totalDays
                ];
            })
            ->sortByDesc('attendance_rate')
            ->take($limit)
            ->values();
    }

    private function getDepartmentStats($startDate, $endDate)
    {
        return Employee::with(['attendances' => function ($q) use ($startDate, $endDate) {
                $q->whereBetween('date', [$startDate, $endDate]);
            }])
            ->get()
            ->groupBy('department')
            ->map(function ($employees, $department) {
                $totalEmployees = $employees->count();
                $totalAttendances = $employees->sum(function ($emp) {
                    return $emp->attendances->count();
                });
                $presentAttendances = $employees->sum(function ($emp) {
                    return $emp->attendances->where('status', 'present')->count();
                });
                
                return [
                    'department' => $department,
                    'employee_count' => $totalEmployees,
                    'attendance_rate' => $totalAttendances > 0 ? round($presentAttendances / $totalAttendances * 100, 2) : 0,
                    'total_attendances' => $totalAttendances,
                    'present_attendances' => $presentAttendances
                ];
            })
            ->values();
    }

    private function getLeaveSummary($startDate, $endDate)
    {
        return Leave::whereBetween('start_date', [$startDate, $endDate])
            ->selectRaw('
                COUNT(*) as total_requests,
                SUM(days) as total_days,
                SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = "approved" THEN 1 ELSE 0 END) as approved,
                SUM(CASE WHEN status = "rejected" THEN 1 ELSE 0 END) as rejected
            ')
            ->first();
    }

    private function getPayrollSummary($startDate, $endDate)
    {
        return PayrollRecord::whereBetween('period_start', [$startDate, $endDate])
            ->selectRaw('
                COUNT(*) as total_records,
                SUM(gross_pay) as total_gross,
                SUM(net_pay) as total_net,
                AVG(gross_pay) as avg_gross,
                AVG(net_pay) as avg_net
            ')
            ->first();
    }

    private function getTrends($startDate, $endDate)
    {
        $trends = [];
        $interval = $startDate->diffInDays($endDate) > 31 ? 'week' : 'day';
        
        // This would generate trend data based on the interval
        // Implementation would depend on specific requirements
        
        return $trends;
    }

    private function getWorkingDays($startDate, $endDate)
    {
        $workingDays = 0;
        $currentDate = $startDate->copy();
        
        while ($currentDate <= $endDate) {
            if (!$currentDate->isWeekend()) {
                $workingDays++;
            }
            $currentDate->addDay();
        }
        
        return $workingDays;
    }
}