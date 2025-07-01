<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PayrollRecord;
use App\Models\PayrollSetting;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use DB;

class PayrollController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = PayrollRecord::with(['employee:id,name,employee_number', 'generator:id,name', 'approver:id,name']);

        if ($request->filled('employee_id')) {
            $query->forEmployee($request->employee_id);
        }

        if ($request->filled('period')) {
            $query->forPeriod($request->period);
        }

        if ($request->filled('status')) {
            $query->byStatus($request->status);
        }

        if ($request->filled('year')) {
            $query->forYear($request->year);
        }

        if ($request->filled('month') && $request->filled('year')) {
            $query->forMonth($request->year, $request->month);
        }

        $payrollRecords = $query->latest()->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $payrollRecords
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
        ]);

        try {
            DB::beginTransaction();

            $periodStart = Carbon::parse($validated['period_start']);
            $periodEnd = Carbon::parse($validated['period_end']);

            $payrollRecord = PayrollRecord::generateForEmployee(
                $validated['employee_id'],
                $periodStart,
                $periodEnd,
                auth()->user()
            );

            if (!$payrollRecord) {
                return response()->json([
                    'success' => false,
                    'message' => 'Unable to generate payroll record for this employee.'
                ], 422);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payroll record generated successfully.',
                'data' => $payrollRecord->load(['employee', 'generator'])
            ], 201);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate payroll record: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show(PayrollRecord $payroll): JsonResponse
    {
        $payroll->load(['employee', 'generator', 'approver']);
        
        return response()->json([
            'success' => true,
            'data' => $payroll
        ]);
    }

    public function update(Request $request, PayrollRecord $payroll): JsonResponse
    {
        if (!$payroll->canBeEdited()) {
            return response()->json([
                'success' => false,
                'message' => 'This payroll record cannot be edited.'
            ], 422);
        }

        $validated = $request->validate([
            'allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $payroll->update($validated);
            $payroll->recalculate();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Payroll record updated successfully.',
                'data' => $payroll->fresh()
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update payroll record: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy(PayrollRecord $payroll): JsonResponse
    {
        if (!$payroll->canBeEdited()) {
            return response()->json([
                'success' => false,
                'message' => 'This payroll record cannot be deleted.'
            ], 422);
        }

        try {
            $payroll->delete();
            
            return response()->json([
                'success' => true,
                'message' => 'Payroll record deleted successfully.'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete payroll record: ' . $e->getMessage()
            ], 500);
        }
    }

    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'period_start' => 'required|date',
            'period_end' => 'required|date|after_or_equal:period_start',
            'employee_ids' => 'nullable|array',
            'employee_ids.*' => 'exists:employees,id',
        ]);

        try {
            DB::beginTransaction();

            $periodStart = Carbon::parse($validated['period_start']);
            $periodEnd = Carbon::parse($validated['period_end']);

            if (!empty($validated['employee_ids'])) {
                $payrollRecords = collect();
                foreach ($validated['employee_ids'] as $employeeId) {
                    $record = PayrollRecord::generateForEmployee(
                        $employeeId,
                        $periodStart,
                        $periodEnd,
                        auth()->user()
                    );
                    if ($record) {
                        $payrollRecords->push($record);
                    }
                }
            } else {
                $payrollRecords = PayrollRecord::generateForAllEmployees(
                    $periodStart,
                    $periodEnd,
                    auth()->user()
                );
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Generated {$payrollRecords->count()} payroll records successfully.",
                'data' => [
                    'records_count' => $payrollRecords->count(),
                    'records' => $payrollRecords
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to generate payroll records: ' . $e->getMessage()
            ], 500);
        }
    }

    public function bulkProcess(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payroll_ids' => 'required|array',
            'payroll_ids.*' => 'exists:payroll_records,id',
            'action' => 'required|in:approve,mark_as_paid,recalculate',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $payrollRecords = PayrollRecord::whereIn('id', $validated['payroll_ids'])->get();
            $successCount = 0;
            $errors = [];

            foreach ($payrollRecords as $payroll) {
                switch ($validated['action']) {
                    case 'approve':
                        if ($payroll->canBeApproved()) {
                            $success = $payroll->approve(auth()->user(), $validated['notes'] ?? null);
                            if ($success) $successCount++;
                            else $errors[] = "Failed to approve payroll for {$payroll->employee->name}";
                        } else {
                            $errors[] = "Cannot approve payroll for {$payroll->employee->name}";
                        }
                        break;
                    
                    case 'mark_as_paid':
                        if ($payroll->canBeMarkedAsPaid()) {
                            $success = $payroll->markAsPaid($validated['notes'] ?? null);
                            if ($success) $successCount++;
                            else $errors[] = "Failed to mark as paid payroll for {$payroll->employee->name}";
                        } else {
                            $errors[] = "Cannot mark as paid payroll for {$payroll->employee->name}";
                        }
                        break;
                    
                    case 'recalculate':
                        if ($payroll->canBeEdited()) {
                            $success = $payroll->recalculate();
                            if ($success) $successCount++;
                            else $errors[] = "Failed to recalculate payroll for {$payroll->employee->name}";
                        } else {
                            $errors[] = "Cannot recalculate payroll for {$payroll->employee->name}";
                        }
                        break;
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Processed {$successCount} payroll records successfully.",
                'data' => [
                    'success_count' => $successCount,
                    'total_count' => $payrollRecords->count(),
                    'errors' => $errors
                ]
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json([
                'success' => false,
                'message' => 'Failed to process payroll records: ' . $e->getMessage()
            ], 500);
        }
    }

    public function employeePayroll(Request $request, Employee $employee): JsonResponse
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $query = $employee->payrollRecords();
        
        if ($month) {
            $query->forMonth($year, $month);
        } else {
            $query->forYear($year);
        }

        $payrollRecords = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => [
                'employee' => $employee,
                'payroll_records' => $payrollRecords
            ]
        ]);
    }

    public function summary(Request $request, string $period = null): JsonResponse
    {
        $period = $period ?? $request->get('period');
        
        if (!$period) {
            return response()->json([
                'success' => false,
                'message' => 'Period is required'
            ], 422);
        }

        $query = PayrollRecord::forPeriod($period);

        $summary = [
            'period' => $period,
            'total_records' => $query->count(),
            'draft_records' => $query->clone()->draft()->count(),
            'approved_records' => $query->clone()->approved()->count(),
            'paid_records' => $query->clone()->paid()->count(),
            'total_gross_pay' => $query->sum('gross_pay'),
            'total_net_pay' => $query->sum('net_pay'),
            'total_deductions' => $query->sum('deductions'),
            'total_tax_deductions' => $query->sum('tax_deduction'),
        ];

        return response()->json([
            'success' => true,
            'data' => $summary
        ]);
    }

    public function myPayroll(Request $request): JsonResponse
    {
        $employee = auth()->user()->employee;
        
        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee profile not found'
            ], 404);
        }

        $year = $request->get('year', now()->year);
        $query = $employee->payrollRecords()->forYear($year);

        $payrollRecords = $query->latest()->get();

        return response()->json([
            'success' => true,
            'data' => $payrollRecords
        ]);
    }

    public function myPayrollDetails(PayrollRecord $payroll): JsonResponse
    {
        $employee = auth()->user()->employee;
        
        if (!$employee || $payroll->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        $payroll->load(['employee', 'generator', 'approver']);

        return response()->json([
            'success' => true,
            'data' => $payroll
        ]);
    }

    public function downloadSlip(PayrollRecord $payroll): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Payslip download not implemented yet'
        ], 501);
    }

    public function downloadMySlip(PayrollRecord $payroll): JsonResponse
    {
        $employee = auth()->user()->employee;
        
        if (!$employee || $payroll->employee_id !== $employee->id) {
            return response()->json([
                'success' => false,
                'message' => 'Access denied'
            ], 403);
        }

        return response()->json([
            'success' => false,
            'message' => 'Payslip download not implemented yet'
        ], 501);
    }

    public function sendEmail(Request $request, PayrollRecord $payroll): JsonResponse
    {
        $validated = $request->validate([
            'email' => 'nullable|email',
            'message' => 'nullable|string|max:1000',
        ]);

        return response()->json([
            'success' => false,
            'message' => 'Email sending not implemented yet'
        ], 501);
    }

    public function webhook(Request $request): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => 'Payroll webhook not implemented yet'
        ], 501);
    }
}