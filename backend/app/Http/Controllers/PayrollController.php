<?php

namespace App\Http\Controllers;

use App\Models\PayrollRecord;
use App\Models\PayrollSetting;
use App\Models\Employee;
use App\Services\PayrollExportService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use DB;

class PayrollController extends Controller
{
    protected PayrollExportService $exportService;

    public function __construct(PayrollExportService $exportService)
    {
        $this->exportService = $exportService;
    }
    public function index(Request $request)
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

        return view('payroll.index', compact('payrollRecords'));
    }

    public function create(Request $request)
    {
        $employees = Employee::active()->get(['id', 'name', 'employee_number']);
        $selectedEmployeeId = $request->get('employee_id');
        $selectedPeriod = $request->get('period', now()->format('Y-m'));

        return view('payroll.create', compact('employees', 'selectedEmployeeId', 'selectedPeriod'));
    }

    public function store(Request $request)
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
                throw ValidationException::withMessages([
                    'employee_id' => 'Unable to generate payroll record for this employee.'
                ]);
            }

            DB::commit();

            return redirect()->route('payroll.show', $payrollRecord)
                ->with('success', 'Payroll record generated successfully.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to generate payroll record: ' . $e->getMessage()]);
        }
    }

    public function show(PayrollRecord $payrollRecord)
    {
        $payrollRecord->load(['employee', 'generator', 'approver']);
        return view('payroll.show', compact('payrollRecord'));
    }

    public function edit(PayrollRecord $payrollRecord)
    {
        if (!$payrollRecord->canBeEdited()) {
            return redirect()->route('payroll.show', $payrollRecord)
                ->with('error', 'This payroll record cannot be edited.');
        }

        return view('payroll.edit', compact('payrollRecord'));
    }

    public function update(Request $request, PayrollRecord $payrollRecord)
    {
        if (!$payrollRecord->canBeEdited()) {
            return redirect()->route('payroll.show', $payrollRecord)
                ->with('error', 'This payroll record cannot be edited.');
        }

        $validated = $request->validate([
            'allowances' => 'nullable|numeric|min:0',
            'deductions' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $payrollRecord->update($validated);
            $payrollRecord->recalculate();

            DB::commit();

            return redirect()->route('payroll.show', $payrollRecord)
                ->with('success', 'Payroll record updated successfully.');

        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['error' => 'Failed to update payroll record: ' . $e->getMessage()]);
        }
    }

    public function destroy(PayrollRecord $payrollRecord)
    {
        if (!$payrollRecord->canBeEdited()) {
            return redirect()->route('payroll.index')
                ->with('error', 'This payroll record cannot be deleted.');
        }

        try {
            $payrollRecord->delete();
            return redirect()->route('payroll.index')
                ->with('success', 'Payroll record deleted successfully.');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Failed to delete payroll record: ' . $e->getMessage()]);
        }
    }

    public function recalculate(PayrollRecord $payrollRecord)
    {
        if (!$payrollRecord->canBeEdited()) {
            return response()->json(['error' => 'This payroll record cannot be recalculated.'], 422);
        }

        try {
            $success = $payrollRecord->recalculate();
            
            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payroll record recalculated successfully.',
                    'payroll' => $payrollRecord->fresh()
                ]);
            } else {
                return response()->json(['error' => 'Failed to recalculate payroll record.'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error recalculating payroll: ' . $e->getMessage()], 500);
        }
    }

    public function approve(Request $request, PayrollRecord $payrollRecord)
    {
        if (!$payrollRecord->canBeApproved()) {
            return response()->json(['error' => 'This payroll record cannot be approved.'], 422);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $success = $payrollRecord->approve(auth()->user(), $validated['notes'] ?? null);
            
            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payroll record approved successfully.',
                    'payroll' => $payrollRecord->fresh(['approver'])
                ]);
            } else {
                return response()->json(['error' => 'Failed to approve payroll record.'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error approving payroll: ' . $e->getMessage()], 500);
        }
    }

    public function markAsPaid(Request $request, PayrollRecord $payrollRecord)
    {
        if (!$payrollRecord->canBeMarkedAsPaid()) {
            return response()->json(['error' => 'This payroll record cannot be marked as paid.'], 422);
        }

        $validated = $request->validate([
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $success = $payrollRecord->markAsPaid($validated['notes'] ?? null);
            
            if ($success) {
                return response()->json([
                    'success' => true,
                    'message' => 'Payroll record marked as paid successfully.',
                    'payroll' => $payrollRecord->fresh()
                ]);
            } else {
                return response()->json(['error' => 'Failed to mark payroll record as paid.'], 422);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Error marking payroll as paid: ' . $e->getMessage()], 500);
        }
    }

    public function generateBatch(Request $request)
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
                'records_count' => $payrollRecords->count()
            ]);

        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['error' => 'Failed to generate batch payroll: ' . $e->getMessage()], 500);
        }
    }

    public function summary(Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month');

        $query = PayrollRecord::query();
        
        if ($month) {
            $query->forMonth($year, $month);
        } else {
            $query->forYear($year);
        }

        $summary = [
            'total_records' => $query->count(),
            'draft_records' => $query->clone()->draft()->count(),
            'approved_records' => $query->clone()->approved()->count(),
            'paid_records' => $query->clone()->paid()->count(),
            'total_gross_pay' => $query->sum('gross_pay'),
            'total_net_pay' => $query->sum('net_pay'),
            'total_deductions' => $query->sum('deductions'),
            'total_tax_deductions' => $query->sum('tax_deduction'),
        ];

        return response()->json($summary);
    }

    public function export(Request $request)
    {
        $validated = $request->validate([
            'period' => 'nullable|string',
            'status' => 'nullable|string|in:draft,approved,paid',
            'employee_id' => 'nullable|exists:employees,id',
            'format' => 'required|string|in:csv,xlsx,pdf',
        ]);

        $query = PayrollRecord::with(['employee:id,name,employee_number']);

        if (!empty($validated['period'])) {
            $query->forPeriod($validated['period']);
        }

        if (!empty($validated['status'])) {
            $query->byStatus($validated['status']);
        }

        if (!empty($validated['employee_id'])) {
            $query->forEmployee($validated['employee_id']);
        }

        $payrollRecords = $query->get();

        try {
            switch ($validated['format']) {
                case 'csv':
                    return $this->exportToCsv($payrollRecords);
                case 'xlsx':
                    return $this->exportToExcel($payrollRecords);
                case 'pdf':
                    return $this->exportToPdf($payrollRecords);
                default:
                    return response()->json(['error' => 'Invalid export format'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Export failed: ' . $e->getMessage()], 500);
        }
    }

    private function exportToCsv($payrollRecords)
    {
        $filename = 'payroll_export_' . now()->format('Y_m_d_H_i_s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($payrollRecords) {
            $file = fopen('php://output', 'w');
            
            fputcsv($file, [
                'Employee Number', 'Employee Name', 'Period', 'Status',
                'Days Worked', 'Total Hours', 'Base Salary', 'Regular Pay',
                'Overtime Pay', 'Allowances', 'Gross Pay', 'Deductions',
                'Tax Deduction', 'Net Pay'
            ]);

            foreach ($payrollRecords as $record) {
                fputcsv($file, [
                    $record->employee->employee_number,
                    $record->employee->name,
                    $record->formatted_period,
                    $record->status_name,
                    $record->days_worked,
                    $record->total_hours_decimal,
                    $record->base_salary,
                    $record->regular_pay,
                    $record->overtime_pay,
                    $record->allowances,
                    $record->gross_pay,
                    $record->deductions,
                    $record->tax_deduction,
                    $record->net_pay,
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function exportToExcel($payrollRecords)
    {
        $period = $payrollRecords->first()->payroll_period ?? now()->format('Y-m');
        return $this->exportService->exportMultiplePayrollToExcel($payrollRecords, $period);
    }

    private function exportToPdf($payrollRecords)
    {
        $period = $payrollRecords->first()->payroll_period ?? now()->format('Y-m');
        return $this->exportService->exportDepartmentPayrollToPdf($payrollRecords, $period);
    }

    /**
     * Export single employee payroll slip
     */
    public function exportSlip(Request $request, PayrollRecord $payrollRecord)
    {
        $format = $request->get('format', 'pdf');

        try {
            switch ($format) {
                case 'pdf':
                    return $this->exportService->exportEmployeePayrollToPdf($payrollRecord);
                case 'excel':
                    return $this->exportService->exportEmployeePayrollToExcel($payrollRecord);
                default:
                    return response()->json(['error' => 'Invalid export format'], 400);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Export failed: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Get payroll summary with statistics
     */
    public function getSummaryData(Request $request)
    {
        $period = $request->get('period', now()->format('Y-m'));
        $departmentId = $request->get('department_id');

        try {
            $summary = $this->exportService->generatePayrollSummary($period, $departmentId);
            return response()->json([
                'success' => true,
                'data' => $summary
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to generate summary: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Bulk approve payroll records
     */
    public function bulkApprove(Request $request)
    {
        $validated = $request->validate([
            'payroll_ids' => 'required|array',
            'payroll_ids.*' => 'exists:payroll_records,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $payrollRecords = PayrollRecord::whereIn('id', $validated['payroll_ids'])->draft()->get();
            $successCount = 0;
            $errors = [];

            foreach ($payrollRecords as $payroll) {
                $success = $payroll->approve(auth()->user(), $validated['notes'] ?? null);
                if ($success) {
                    $successCount++;
                } else {
                    $errors[] = "Failed to approve payroll for {$payroll->employee->name}";
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Approved {$successCount} payroll records successfully.",
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
                'message' => 'Failed to approve payroll records: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk mark payroll records as paid
     */
    public function bulkMarkAsPaid(Request $request)
    {
        $validated = $request->validate([
            'payroll_ids' => 'required|array',
            'payroll_ids.*' => 'exists:payroll_records,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $payrollRecords = PayrollRecord::whereIn('id', $validated['payroll_ids'])->approved()->get();
            $successCount = 0;
            $errors = [];

            foreach ($payrollRecords as $payroll) {
                $success = $payroll->markAsPaid($validated['notes'] ?? null);
                if ($success) {
                    $successCount++;
                } else {
                    $errors[] = "Failed to mark payroll as paid for {$payroll->employee->name}";
                }
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => "Marked {$successCount} payroll records as paid successfully.",
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
                'message' => 'Failed to mark payroll records as paid: ' . $e->getMessage()
            ], 500);
        }
    }
}
