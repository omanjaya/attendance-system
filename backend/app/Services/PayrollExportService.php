<?php

namespace App\Services;

use App\Models\PayrollRecord;
use App\Models\Employee;
use Barryvdh\DomPDF\Facade\Pdf;
use Maatwebsite\Excel\Facades\Excel;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class PayrollExportService
{
    /**
     * Export single employee payroll to PDF
     */
    public function exportEmployeePayrollToPdf(PayrollRecord $payrollRecord): string
    {
        $data = [
            'payroll' => $payrollRecord->load(['employee.employeeType', 'generator', 'approver']),
            'company' => config('app.name', 'School Name'),
            'exportDate' => now()->format('F j, Y'),
        ];

        $pdf = Pdf::loadView('payroll.slip-pdf', $data);
        $pdf->setPaper('a4', 'portrait');
        
        $filename = "payroll_slip_{$payrollRecord->employee->employee_number}_{$payrollRecord->payroll_period}.pdf";
        
        return $pdf->download($filename);
    }

    /**
     * Export single employee payroll to Excel
     */
    public function exportEmployeePayrollToExcel(PayrollRecord $payrollRecord): string
    {
        $filename = "payroll_slip_{$payrollRecord->employee->employee_number}_{$payrollRecord->payroll_period}.xlsx";
        
        return Excel::download(
            new SinglePayrollExport($payrollRecord),
            $filename
        );
    }

    /**
     * Export multiple payroll records to Excel
     */
    public function exportMultiplePayrollToExcel(Collection $payrollRecords, string $period): string
    {
        $filename = "payroll_summary_{$period}.xlsx";
        
        return Excel::download(
            new MultiplePayrollExport($payrollRecords),
            $filename
        );
    }

    /**
     * Export department payroll summary to PDF
     */
    public function exportDepartmentPayrollToPdf(Collection $payrollRecords, string $period, ?string $department = null): string
    {
        $data = [
            'payrollRecords' => $payrollRecords->load(['employee.employeeType', 'employee.department']),
            'period' => $period,
            'department' => $department,
            'company' => config('app.name', 'School Name'),
            'exportDate' => now()->format('F j, Y'),
            'totalGrossPay' => $payrollRecords->sum('gross_pay'),
            'totalNetPay' => $payrollRecords->sum('net_pay'),
            'totalDeductions' => $payrollRecords->sum('deductions'),
            'totalAllowances' => $payrollRecords->sum('allowances'),
        ];

        $pdf = Pdf::loadView('payroll.summary-pdf', $data);
        $pdf->setPaper('a4', 'landscape');
        
        $filename = $department 
            ? "payroll_summary_{$department}_{$period}.pdf"
            : "payroll_summary_all_{$period}.pdf";
        
        return $pdf->download($filename);
    }

    /**
     * Generate payroll summary report data
     */
    public function generatePayrollSummary(string $period, ?int $departmentId = null): array
    {
        $query = PayrollRecord::with(['employee.employeeType', 'employee.department'])
            ->forPeriod($period);

        if ($departmentId) {
            $query->whereHas('employee', function ($q) use ($departmentId) {
                $q->where('department_id', $departmentId);
            });
        }

        $payrollRecords = $query->get();

        $summary = [
            'period' => $period,
            'total_employees' => $payrollRecords->count(),
            'total_gross_pay' => $payrollRecords->sum('gross_pay'),
            'total_net_pay' => $payrollRecords->sum('net_pay'),
            'total_deductions' => $payrollRecords->sum('deductions'),
            'total_allowances' => $payrollRecords->sum('allowances'),
            'total_overtime_pay' => $payrollRecords->sum('overtime_pay'),
            'total_regular_pay' => $payrollRecords->sum('regular_pay'),
            'by_status' => [
                'draft' => $payrollRecords->where('status', PayrollRecord::STATUS_DRAFT)->count(),
                'approved' => $payrollRecords->where('status', PayrollRecord::STATUS_APPROVED)->count(),
                'paid' => $payrollRecords->where('status', PayrollRecord::STATUS_PAID)->count(),
            ],
            'by_employee_type' => $payrollRecords->groupBy('employee.employee_type.name')->map(function ($group, $type) {
                return [
                    'count' => $group->count(),
                    'total_gross_pay' => $group->sum('gross_pay'),
                    'total_net_pay' => $group->sum('net_pay'),
                ];
            }),
            'attendance_stats' => [
                'average_attendance_percentage' => $payrollRecords->avg('attendance_percentage'),
                'total_days_worked' => $payrollRecords->sum('days_worked'),
                'total_days_absent' => $payrollRecords->sum('days_absent'),
                'total_late_days' => $payrollRecords->sum('days_late'),
            ],
        ];

        return $summary;
    }
}

/**
 * Excel export class for single payroll record
 */
class SinglePayrollExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    private PayrollRecord $payrollRecord;

    public function __construct(PayrollRecord $payrollRecord)
    {
        $this->payrollRecord = $payrollRecord->load(['employee.employeeType']);
    }

    public function collection()
    {
        return collect([$this->payrollRecord]);
    }

    public function headings(): array
    {
        return [
            'Employee Number',
            'Employee Name',
            'Employee Type',
            'Period',
            'Total Working Days',
            'Days Worked',
            'Days Absent',
            'Days Late',
            'Regular Hours',
            'Overtime Hours',
            'Total Hours',
            'Base Salary',
            'Regular Pay',
            'Overtime Pay',
            'Allowances',
            'Gross Pay',
            'Deductions',
            'Tax Deduction',
            'Net Pay',
            'Status',
            'Attendance %',
        ];
    }

    public function map($payroll): array
    {
        return [
            $payroll->employee->employee_number,
            $payroll->employee->name,
            $payroll->employee->employeeType->name,
            $payroll->formatted_period,
            $payroll->total_working_days,
            $payroll->days_worked,
            $payroll->days_absent,
            $payroll->days_late,
            $payroll->regular_hours_decimal,
            $payroll->overtime_hours_decimal,
            $payroll->total_hours_decimal,
            number_format($payroll->base_salary, 2),
            number_format($payroll->regular_pay, 2),
            number_format($payroll->overtime_pay, 2),
            number_format($payroll->allowances, 2),
            number_format($payroll->gross_pay, 2),
            number_format($payroll->deductions, 2),
            number_format($payroll->tax_deduction, 2),
            number_format($payroll->net_pay, 2),
            $payroll->status_name,
            number_format($payroll->attendance_percentage, 2) . '%',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E3F2FD']
                ]
            ],
        ];
    }
}

/**
 * Excel export class for multiple payroll records
 */
class MultiplePayrollExport implements FromCollection, WithHeadings, WithMapping, WithStyles, ShouldAutoSize
{
    private Collection $payrollRecords;

    public function __construct(Collection $payrollRecords)
    {
        $this->payrollRecords = $payrollRecords->load(['employee.employeeType']);
    }

    public function collection()
    {
        return $this->payrollRecords;
    }

    public function headings(): array
    {
        return [
            'Employee Number',
            'Employee Name',
            'Employee Type',
            'Period',
            'Days Worked',
            'Days Absent',
            'Regular Hours',
            'Overtime Hours',
            'Regular Pay',
            'Overtime Pay',
            'Allowances',
            'Gross Pay',
            'Deductions',
            'Net Pay',
            'Status',
            'Attendance %',
        ];
    }

    public function map($payroll): array
    {
        return [
            $payroll->employee->employee_number,
            $payroll->employee->name,
            $payroll->employee->employeeType->name,
            $payroll->formatted_period,
            $payroll->days_worked,
            $payroll->days_absent,
            $payroll->regular_hours_decimal,
            $payroll->overtime_hours_decimal,
            number_format($payroll->regular_pay, 2),
            number_format($payroll->overtime_pay, 2),
            number_format($payroll->allowances, 2),
            number_format($payroll->gross_pay, 2),
            number_format($payroll->deductions, 2),
            number_format($payroll->net_pay, 2),
            $payroll->status_name,
            number_format($payroll->attendance_percentage, 2) . '%',
        ];
    }

    public function styles(Worksheet $sheet)
    {
        $lastRow = $this->payrollRecords->count() + 1;
        
        return [
            1 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E3F2FD']
                ]
            ],
            $lastRow + 2 => [
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'F3E5F5']
                ]
            ]
        ];
    }
}