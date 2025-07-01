<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Yajra\DataTables\Facades\DataTables;
use App\Models\Employee;
use App\Models\EmployeeType;
use App\Models\User;
use App\Models\AttendanceRecord;
use Carbon\Carbon;

/**
 * EmployeeController
 * 
 * Handles employee management including CRUD operations, DataTables integration,
 * permissions checking, and employee-specific functionality like attendance history.
 */
class EmployeeController extends Controller
{
    /**
     * Display a listing of employees with DataTables integration
     * 
     * @param Request $request
     * @return View|JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Employee::class);
        
        if ($request->ajax()) {
            return $this->getEmployeesDataTable($request);
        }
        
        // Get employee types for filter dropdown
        $employeeTypes = EmployeeType::active()->get();
        
        // Get unique departments for filter dropdown
        $departments = Employee::whereNotNull('department')
            ->distinct()
            ->pluck('department')
            ->sort()
            ->values();
            
        return view('employees.index', compact('employeeTypes', 'departments'));
    }
    
    /**
     * Get employees data for DataTables
     * 
     * @param Request $request
     * @return JsonResponse
     */
    private function getEmployeesDataTable(Request $request): JsonResponse
    {
        $query = Employee::with(['user', 'employeeType'])
            ->select('employees.*');
            
        return DataTables::of($query)
            ->addIndexColumn()
            ->addColumn('full_name', function ($employee) {
                return $employee->full_name;
            })
            ->addColumn('employee_type', function ($employee) {
                return $employee->employeeType ? $employee->employeeType->name : 'N/A';
            })
            ->addColumn('status', function ($employee) {
                return $employee->is_active 
                    ? '<span class="badge badge-success">Active</span>' 
                    : '<span class="badge badge-danger">Inactive</span>';
            })
            ->addColumn('years_of_service', function ($employee) {
                return $employee->years_of_service . ' years';
            })
            ->addColumn('last_attendance', function ($employee) {
                $lastAttendance = $employee->attendanceRecords()
                    ->latest('date')
                    ->first();
                return $lastAttendance ? $lastAttendance->date->format('M d, Y') : 'Never';
            })
            ->addColumn('actions', function ($employee) {
                $actions = '';
                
                if (Auth::user()->can('view', $employee)) {
                    $actions .= '<a href="' . route('employees.show', $employee) . '" class="btn btn-sm btn-info me-1" title="View"><i class="fas fa-eye"></i></a>';
                }
                
                if (Auth::user()->can('update', $employee)) {
                    $actions .= '<a href="' . route('employees.edit', $employee) . '" class="btn btn-sm btn-primary me-1" title="Edit"><i class="fas fa-edit"></i></a>';
                }
                
                if (Auth::user()->can('update', $employee)) {
                    if ($employee->is_active) {
                        $actions .= '<button type="button" class="btn btn-sm btn-warning me-1" onclick="toggleEmployeeStatus(' . $employee->id . ', false)" title="Deactivate"><i class="fas fa-ban"></i></button>';
                    } else {
                        $actions .= '<button type="button" class="btn btn-sm btn-success me-1" onclick="toggleEmployeeStatus(' . $employee->id . ', true)" title="Activate"><i class="fas fa-check"></i></button>';
                    }
                }
                
                if (Auth::user()->can('delete', $employee) && !$employee->attendanceRecords()->exists()) {
                    $actions .= '<button type="button" class="btn btn-sm btn-danger" onclick="deleteEmployee(' . $employee->id . ')" title="Delete"><i class="fas fa-trash"></i></button>';
                }
                
                return $actions;
            })
            ->filter(function ($query) use ($request) {
                // Search functionality
                if ($request->has('search') && !empty($request->search['value'])) {
                    $search = $request->search['value'];
                    $query->where(function ($q) use ($search) {
                        $q->where('first_name', 'like', "%{$search}%")
                          ->orWhere('last_name', 'like', "%{$search}%")
                          ->orWhere('employee_id', 'like', "%{$search}%")
                          ->orWhere('phone', 'like', "%{$search}%")
                          ->orWhere('position', 'like', "%{$search}%")
                          ->orWhere('department', 'like', "%{$search}%")
                          ->orWhereHas('user', function ($userQuery) use ($search) {
                              $userQuery->where('email', 'like', "%{$search}%");
                          });
                    });
                }
                
                // Filter by employee type
                if ($request->filled('employee_type_id')) {
                    $query->where('employee_type_id', $request->employee_type_id);
                }
                
                // Filter by department
                if ($request->filled('department')) {
                    $query->where('department', $request->department);
                }
                
                // Filter by status
                if ($request->filled('status')) {
                    $isActive = $request->status === 'active';
                    $query->where('is_active', $isActive);
                }
                
                // Filter by hire date range
                if ($request->filled('hire_date_from')) {
                    $query->where('hire_date', '>=', $request->hire_date_from);
                }
                
                if ($request->filled('hire_date_to')) {
                    $query->where('hire_date', '<=', $request->hire_date_to);
                }
            })
            ->rawColumns(['status', 'actions'])
            ->make(true);
    }

    /**
     * Show the form for creating a new employee
     * 
     * @return View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function create(): View
    {
        $this->authorize('create', Employee::class);
        
        $employeeTypes = EmployeeType::active()->get();
        
        return view('employees.create', compact('employeeTypes'));
    }

    /**
     * Store a newly created employee
     * 
     * @param Request $request
     * @return RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', Employee::class);
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'employee_id' => 'required|string|unique:employees,employee_id|max:50',
            'employee_type_id' => 'required|exists:employee_types,id',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'hire_date' => 'required|date',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'salary' => 'nullable|numeric|min:0',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password' => 'required|string|min:8|confirmed',
        ]);
        
        try {
            DB::beginTransaction();
            
            // Create user account
            $user = User::create([
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
            
            // Assign basic employee role
            $user->assignRole('employee');
            
            // Handle profile photo upload
            $profilePhotoPath = null;
            if ($request->hasFile('profile_photo')) {
                $profilePhotoPath = $request->file('profile_photo')->store('profile_photos', 'public');
            }
            
            // Create employee record
            $employeeData = array_merge($validated, [
                'user_id' => $user->id,
                'profile_photo' => $profilePhotoPath,
                'is_active' => true,
            ]);
            
            unset($employeeData['email'], $employeeData['password'], $employeeData['password_confirmation']);
            
            $employee = Employee::create($employeeData);
            
            DB::commit();
            
            return redirect()->route('employees.show', $employee)
                ->with('success', 'Employee created successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Clean up uploaded file if exists
            if ($profilePhotoPath && Storage::disk('public')->exists($profilePhotoPath)) {
                Storage::disk('public')->delete($profilePhotoPath);
            }
            
            return back()->withInput()
                ->with('error', 'Failed to create employee. Please try again.');
        }
    }

    /**
     * Display the specified employee
     * 
     * @param Employee $employee
     * @return View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function show(Employee $employee): View
    {
        $this->authorize('view', $employee);
        
        $employee->load(['user', 'employeeType', 'schedules.period']);
        
        // Get recent attendance records
        $recentAttendance = $employee->attendanceRecords()
            ->with('approver')
            ->latest('date')
            ->take(10)
            ->get();
            
        // Get current month statistics
        $currentMonth = Carbon::now();
        $monthlyStats = [
            'total_days' => $this->getWorkingDaysInMonth($currentMonth),
            'present_days' => $employee->attendanceRecords()
                ->forMonth($currentMonth->year, $currentMonth->month)
                ->present()
                ->count(),
            'absent_days' => $employee->attendanceRecords()
                ->forMonth($currentMonth->year, $currentMonth->month)
                ->absent()
                ->count(),
            'late_days' => $employee->attendanceRecords()
                ->forMonth($currentMonth->year, $currentMonth->month)
                ->where('status', AttendanceRecord::STATUS_LATE)
                ->count(),
            'total_hours' => $employee->getWorkingHoursForMonth($currentMonth->year, $currentMonth->month),
            'overtime_hours' => $employee->getOvertimeHoursForMonth($currentMonth->year, $currentMonth->month),
        ];
        
        $monthlyStats['attendance_rate'] = $monthlyStats['total_days'] > 0 
            ? round(($monthlyStats['present_days'] / $monthlyStats['total_days']) * 100, 1) 
            : 0;
            
        return view('employees.show', compact('employee', 'recentAttendance', 'monthlyStats'));
    }

    /**
     * Show the form for editing the specified employee
     * 
     * @param Employee $employee
     * @return View
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function edit(Employee $employee): View
    {
        $this->authorize('update', $employee);
        
        $employee->load('user');
        $employeeTypes = EmployeeType::active()->get();
        
        return view('employees.edit', compact('employee', 'employeeTypes'));
    }

    /**
     * Update the specified employee
     * 
     * @param Request $request
     * @param Employee $employee
     * @return RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function update(Request $request, Employee $employee): RedirectResponse
    {
        $this->authorize('update', $employee);
        
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users', 'email')->ignore($employee->user_id)],
            'employee_id' => ['required', 'string', 'max:50', Rule::unique('employees', 'employee_id')->ignore($employee->id)],
            'employee_type_id' => 'required|exists:employee_types,id',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'date_of_birth' => 'nullable|date|before:today',
            'gender' => 'nullable|in:male,female,other',
            'hire_date' => 'required|date',
            'position' => 'required|string|max:255',
            'department' => 'nullable|string|max:255',
            'salary' => 'nullable|numeric|min:0',
            'profile_photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
            'password' => 'nullable|string|min:8|confirmed',
        ]);
        
        try {
            DB::beginTransaction();
            
            // Update user account
            $userData = [
                'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                'email' => $validated['email'],
            ];
            
            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
            }
            
            $employee->user->update($userData);
            
            // Handle profile photo upload
            if ($request->hasFile('profile_photo')) {
                // Delete old photo if exists
                if ($employee->profile_photo && Storage::disk('public')->exists($employee->profile_photo)) {
                    Storage::disk('public')->delete($employee->profile_photo);
                }
                
                $validated['profile_photo'] = $request->file('profile_photo')->store('profile_photos', 'public');
            }
            
            // Update employee record
            $employeeData = $validated;
            unset($employeeData['email'], $employeeData['password'], $employeeData['password_confirmation']);
            
            $employee->update($employeeData);
            
            DB::commit();
            
            return redirect()->route('employees.show', $employee)
                ->with('success', 'Employee updated successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            
            return back()->withInput()
                ->with('error', 'Failed to update employee. Please try again.');
        }
    }

    /**
     * Remove the specified employee
     * 
     * @param Employee $employee
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function destroy(Employee $employee): JsonResponse
    {
        $this->authorize('delete', $employee);
        
        // Check if employee has attendance records
        if ($employee->attendanceRecords()->exists()) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot delete employee with existing attendance records. Consider deactivating instead.'
            ], 422);
        }
        
        try {
            DB::beginTransaction();
            
            // Delete profile photo if exists
            if ($employee->profile_photo && Storage::disk('public')->exists($employee->profile_photo)) {
                Storage::disk('public')->delete($employee->profile_photo);
            }
            
            // Delete related records
            $employee->schedules()->delete();
            $employee->leaveRequests()->delete();
            $employee->payrollSettings()->delete();
            $employee->faceLogs()->delete();
            
            // Delete user account
            $employee->user->delete();
            
            // Delete employee record
            $employee->delete();
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Employee deleted successfully.'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete employee. Please try again.'
            ], 500);
        }
    }
    
    /**
     * Activate an employee
     * 
     * @param Employee $employee
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function activate(Employee $employee): JsonResponse
    {
        $this->authorize('update', $employee);
        
        try {
            $employee->activate();
            
            return response()->json([
                'success' => true,
                'message' => 'Employee activated successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to activate employee.'
            ], 500);
        }
    }
    
    /**
     * Deactivate an employee
     * 
     * @param Employee $employee
     * @return JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function deactivate(Employee $employee): JsonResponse
    {
        $this->authorize('update', $employee);
        
        try {
            $employee->deactivate();
            
            return response()->json([
                'success' => true,
                'message' => 'Employee deactivated successfully.'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate employee.'
            ], 500);
        }
    }
    
    /**
     * Get employee attendance history
     * 
     * @param Employee $employee
     * @param Request $request
     * @return View|JsonResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function attendanceHistory(Employee $employee, Request $request)
    {
        $this->authorize('view', $employee);
        
        if ($request->ajax()) {
            $query = $employee->attendanceRecords()
                ->with('approver')
                ->select('attendance_records.*');
                
            return DataTables::of($query)
                ->addIndexColumn()
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
                        return '<span class="badge badge-success">Approved</span>';
                    }
                    return '<span class="badge badge-warning">Pending</span>';
                })
                ->filter(function ($query) use ($request) {
                    if ($request->filled('month')) {
                        $date = Carbon::createFromFormat('Y-m', $request->month);
                        $query->whereYear('date', $date->year)
                              ->whereMonth('date', $date->month);
                    }
                    
                    if ($request->filled('status')) {
                        $query->where('status', $request->status);
                    }
                })
                ->rawColumns(['status_badge', 'approval_status'])
                ->make(true);
        }
        
        return view('employees.attendance-history', compact('employee'));
    }
    
    /**
     * Export employees data
     * 
     * @param Request $request
     * @return \Symfony\Component\HttpFoundation\BinaryFileResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function export(Request $request)
    {
        $this->authorize('viewAny', Employee::class);
        
        // This would typically use Laravel Excel or similar package
        // For now, return a basic CSV export
        
        $employees = Employee::with(['user', 'employeeType'])
            ->active()
            ->get();
            
        $filename = 'employees_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];
        
        $callback = function() use ($employees) {
            $file = fopen('php://output', 'w');
            
            // Header row
            fputcsv($file, [
                'Employee ID',
                'Full Name',
                'Email',
                'Employee Type',
                'Position',
                'Department',
                'Hire Date',
                'Phone',
                'Status'
            ]);
            
            // Data rows
            foreach ($employees as $employee) {
                fputcsv($file, [
                    $employee->employee_id,
                    $employee->full_name,
                    $employee->user->email,
                    $employee->employeeType->name,
                    $employee->position,
                    $employee->department,
                    $employee->hire_date->format('Y-m-d'),
                    $employee->phone,
                    $employee->is_active ? 'Active' : 'Inactive'
                ]);
            }
            
            fclose($file);
        };
        
        return response()->stream($callback, 200, $headers);
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
