<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\EmployeeType;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use App\Http\Requests\Employee\StoreEmployeeRequest;
use App\Services\SecurityService;
use Carbon\Carbon;

class EmployeeApiController extends Controller
{
    protected SecurityService $securityService;

    /**
     * Create a new controller instance.
     */
    public function __construct(SecurityService $securityService)
    {
        $this->securityService = $securityService;
        $this->middleware('auth:sanctum');
        $this->middleware('throttle:60,1');
    }

    /**
     * Display a paginated listing of employees.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = Employee::with(['user']);

            // Apply filters
            if ($request->filled('search')) {
                $search = $request->get('search');
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('employee_id', 'like', "%{$search}%")
                      ->orWhere('position', 'like', "%{$search}%")
                      ->orWhere('department', 'like', "%{$search}%");
                });
            }

            if ($request->filled('department')) {
                $query->where('department', $request->get('department'));
            }

            if ($request->filled('type')) {
                $query->where('type', $request->get('type'));
            }

            if ($request->filled('status')) {
                $query->where('status', $request->get('status'));
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = min($request->get('per_page', 15), 100);
            $employees = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Employees retrieved successfully',
                'data' => $employees,
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve employees',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }

    /**
     * Store a newly created employee.
     */
    public function store(StoreEmployeeRequest $request): JsonResponse
    {
        try {
            // Use sanitized data from form request
            $validated = $request->sanitized();

            DB::beginTransaction();

            $user = null;
            // Create user account only if email and password provided
            if ($validated['email'] && $validated['password']) {
                $user = User::create([
                    'name' => $validated['first_name'] . ' ' . $validated['last_name'],
                    'email' => $validated['email'],
                    'password' => Hash::make($validated['password']),
                    'email_verified_at' => now(),
                ]);

                // Assign default role based on employee type
                $role = match($validated['type']) {
                    'permanent_teacher', 'honorary_teacher' => 'teacher',
                    'permanent_staff', 'honorary_staff' => 'staff',
                    default => 'staff'
                };
                $user->assignRole($role);
            }

            // Handle profile photo upload
            $profilePhotoPath = null;
            if ($request->hasFile('profile_photo')) {
                $profilePhotoPath = $request->file('profile_photo')->store('employee-photos', 'public');
            }

            // Create employee record
            $employee = Employee::create([
                'user_id' => $user?->id,
                'employee_id' => $validated['employee_id'],
                'first_name' => $validated['first_name'],
                'last_name' => $validated['last_name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'type' => $validated['type'],
                'position' => $validated['position'],
                'department' => $validated['department'],
                'hire_date' => $validated['hire_date'],
                'salary' => $validated['salary'],
                'hourly_rate' => $validated['hourly_rate'],
                'status' => 'active',
                'profile_photo' => $profilePhotoPath,
                'address' => $validated['address'],
                'emergency_contact_name' => $validated['emergency_contact_name'],
                'emergency_contact_phone' => $validated['emergency_contact_phone'],
                'notes' => $validated['notes'],
            ]);

            DB::commit();

            $employee->load(['user']);

            return response()->json([
                'success' => true,
                'message' => 'Employee created successfully',
                'data' => $employee,
                'timestamp' => now()->toISOString(),
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'timestamp' => now()->toISOString(),
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to create employee',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }

    /**
     * Display the specified employee.
     */
    public function show(Employee $employee): JsonResponse
    {
        try {
            $employee->load(['user', 'employeeType', 'schedules.period', 'attendanceRecords' => function ($query) {
                $query->latest()->limit(10);
            }]);

            return response()->json([
                'success' => true,
                'message' => 'Employee retrieved successfully',
                'data' => $employee,
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve employee',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }

    /**
     * Update the specified employee.
     */
    public function update(Request $request, Employee $employee): JsonResponse
    {
        try {
            $validated = $request->validate([
                'first_name' => 'sometimes|required|string|max:255',
                'last_name' => 'sometimes|required|string|max:255',
                'email' => ['sometimes', 'required', 'email', Rule::unique('users', 'email')->ignore($employee->user_id)],
                'employee_id' => ['sometimes', 'required', 'string', 'max:50', Rule::unique('employees', 'employee_id')->ignore($employee->id)],
                'employee_type_id' => 'sometimes|required|exists:employee_types,id',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string|max:500',
                'date_of_birth' => 'nullable|date|before:today',
                'gender' => 'nullable|in:male,female,other',
                'hire_date' => 'sometimes|required|date',
                'position' => 'sometimes|required|string|max:255',
                'department' => 'nullable|string|max:255',
                'salary' => 'nullable|numeric|min:0',
                'is_active' => 'sometimes|boolean',
                'profile_photo' => 'nullable|image|mimes:jpg,jpeg,png|max:2048',
            ]);

            DB::beginTransaction();

            // Update user if email is provided
            if (isset($validated['email']) || isset($validated['first_name']) || isset($validated['last_name'])) {
                $userUpdates = [];
                if (isset($validated['email'])) {
                    $userUpdates['email'] = $validated['email'];
                }
                if (isset($validated['first_name']) || isset($validated['last_name'])) {
                    $firstName = $validated['first_name'] ?? $employee->first_name;
                    $lastName = $validated['last_name'] ?? $employee->last_name;
                    $userUpdates['name'] = $firstName . ' ' . $lastName;
                }
                
                if (!empty($userUpdates)) {
                    $employee->user->update($userUpdates);
                }
            }

            // Handle profile photo upload
            if ($request->hasFile('profile_photo')) {
                // Delete old photo if exists
                if ($employee->profile_photo) {
                    Storage::disk('public')->delete($employee->profile_photo);
                }
                $validated['profile_photo'] = $request->file('profile_photo')->store('employee-photos', 'public');
            }

            // Update employee record
            $employee->update($validated);

            DB::commit();

            $employee->load(['user', 'employeeType']);

            return response()->json([
                'success' => true,
                'message' => 'Employee updated successfully',
                'data' => $employee,
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors(),
                'timestamp' => now()->toISOString(),
            ], 422);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to update employee',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }

    /**
     * Remove the specified employee (soft delete by deactivating).
     */
    public function destroy(Employee $employee): JsonResponse
    {
        try {
            DB::beginTransaction();

            // Deactivate instead of deleting to maintain data integrity
            $employee->deactivate();
            
            // Optionally deactivate the associated user account
            $employee->user->update(['email_verified_at' => null]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Employee deactivated successfully',
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Failed to deactivate employee',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }

    /**
     * Activate an employee.
     */
    public function activate(Employee $employee): JsonResponse
    {
        try {
            $employee->activate();
            $employee->user->update(['email_verified_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Employee activated successfully',
                'data' => $employee,
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to activate employee',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }

    /**
     * Get employee statistics and attendance summary.
     */
    public function stats(Employee $employee, Request $request): JsonResponse
    {
        try {
            $request->validate([
                'month' => 'nullable|integer|between:1,12',
                'year' => 'nullable|integer|min:2020|max:' . (date('Y') + 1),
            ]);

            $month = $request->get('month', now()->month);
            $year = $request->get('year', now()->year);

            $stats = [
                'employee' => $employee->only(['id', 'employee_id', 'full_name', 'position', 'department']),
                'monthly_stats' => [
                    'working_hours' => $employee->getWorkingHoursForMonth($year, $month),
                    'overtime_hours' => $employee->getOvertimeHoursForMonth($year, $month),
                ],
                'face_recognition' => [
                    'configured' => $employee->hasFaceRecognition(),
                    'can_use' => $employee->canUseFaceRecognition(),
                ],
                'employment_info' => [
                    'hire_date' => $employee->hire_date->format('Y-m-d'),
                    'years_of_service' => $employee->years_of_service,
                    'is_active' => $employee->is_active,
                ],
            ];

            return response()->json([
                'success' => true,
                'message' => 'Employee statistics retrieved successfully',
                'data' => $stats,
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve employee statistics',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }

    /**
     * Get employee types for dropdown/select inputs.
     */
    public function getEmployeeTypes(): JsonResponse
    {
        try {
            $employeeTypes = EmployeeType::select('id', 'name', 'description')
                ->orderBy('name')
                ->get();

            return response()->json([
                'success' => true,
                'message' => 'Employee types retrieved successfully',
                'data' => $employeeTypes,
                'timestamp' => now()->toISOString(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve employee types',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error',
                'timestamp' => now()->toISOString(),
            ], 500);
        }
    }
}
