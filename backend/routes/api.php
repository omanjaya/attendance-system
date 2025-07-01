<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Import all API controllers
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\EmployeeApiController;
use App\Http\Controllers\Api\AttendanceApiController;
use App\Http\Controllers\Api\PayrollController;
use App\Http\Controllers\Api\LeaveController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\FaceRecognitionController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\PeriodController;
use App\Http\Controllers\Api\SchoolCalendarController;
use App\Http\Controllers\Api\ProfileController;

// Test route
Route::get('/test', function () {
    return response()->json([
        'message' => 'School Attendance API is working',
        'timestamp' => now(),
        'version' => '1.0.0'
    ]);
});

// Debug endpoint
Route::get('/debug', function () {
    try {
        $checks = [
            'php_version' => PHP_VERSION,
            'laravel_version' => app()->version(),
            'database_connection' => DB::connection()->getPdo() ? 'OK' : 'FAILED',
            'users_table_exists' => Schema::hasTable('users'),
            'user_count' => Schema::hasTable('users') ? \App\Models\User::count() : 0,
            'sanctum_installed' => class_exists('Laravel\\Sanctum\\Sanctum'),
            'storage_writable' => is_writable(storage_path()),
            'cache_writable' => is_writable(storage_path('framework/cache')),
            'logs_writable' => is_writable(storage_path('logs')),
            'auth_controller_exists' => class_exists('App\\Http\\Controllers\\Api\\AuthController'),
        ];

        return response()->json([
            'status' => 'debug',
            'checks' => $checks,
            'env_vars' => [
                'APP_ENV' => config('app.env'),
                'APP_DEBUG' => config('app.debug'),
                'DB_CONNECTION' => config('database.default'),
                'SANCTUM_STATEFUL_DOMAINS' => config('sanctum.stateful'),
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ], 500);
    }
});

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'database' => DB::connection()->getPdo() ? 'connected' : 'disconnected',
        'timestamp' => now()
    ]);
});

// Authentication routes (with rate limiting)
Route::prefix('auth')->group(function () {
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [AuthController::class, 'register'])->middleware('rate.limit:login');
    Route::post('logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
    Route::get('user', [AuthController::class, 'user'])->middleware('auth:sanctum');
    Route::post('refresh', [AuthController::class, 'refresh'])->middleware('auth:sanctum');
    Route::post('forgot-password', [AuthController::class, 'forgotPassword'])->middleware('rate.limit:password_reset');
    Route::post('reset-password', [AuthController::class, 'resetPassword'])->middleware('rate.limit:password_reset');
});

// Logging routes
Route::prefix('logs')->group(function () {
    Route::post('frontend', [App\Http\Controllers\Api\LogController::class, 'storeFrontendLog']);
    
    // Development only routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/', [App\Http\Controllers\Api\LogController::class, 'getLogs']);
        Route::get('channels', [App\Http\Controllers\Api\LogController::class, 'getChannels']);
        Route::delete('clear', [App\Http\Controllers\Api\LogController::class, 'clearLogs']);
    });
});

// Protected API routes
Route::middleware(['auth:sanctum'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index']);
    Route::get('/dashboard/stats', [DashboardController::class, 'getStats']);
    Route::get('/dashboard/charts', [DashboardController::class, 'getChartData']);
    
    // Employee Management
    Route::prefix('employees')->group(function () {
        Route::get('/', [EmployeeApiController::class, 'index']);
        Route::post('/', [EmployeeApiController::class, 'store'])->middleware('permission:create-employees');
        Route::get('/{employee}', [EmployeeApiController::class, 'show']);
        Route::put('/{employee}', [EmployeeApiController::class, 'update'])->middleware('permission:edit-employees');
        Route::delete('/{employee}', [EmployeeApiController::class, 'destroy'])->middleware('permission:delete-employees');
        Route::post('/{employee}/avatar', [EmployeeApiController::class, 'uploadAvatar'])->middleware('rate.limit:upload');
        Route::get('/export/excel', [EmployeeApiController::class, 'exportExcel']);
        Route::get('/export/pdf', [EmployeeApiController::class, 'exportPdf']);
        Route::post('/import', [EmployeeApiController::class, 'import'])->middleware('permission:import-employees');
        Route::get('/search', [EmployeeApiController::class, 'search']);
        Route::get('/by-department/{department}', [EmployeeApiController::class, 'byDepartment']);
    });

    // Attendance Management
    Route::prefix('attendance')->group(function () {
        Route::get('/', [AttendanceApiController::class, 'index']);
        Route::post('/clock-in', [AttendanceApiController::class, 'clockIn']);
        Route::post('/clock-out', [AttendanceApiController::class, 'clockOut']);
        Route::get('/status', [AttendanceApiController::class, 'status']);
        Route::get('/history', [AttendanceApiController::class, 'history']);
        Route::post('/manual', [AttendanceApiController::class, 'manualEntry'])->middleware('permission:manual-attendance');
        Route::put('/{attendance}', [AttendanceApiController::class, 'update'])->middleware('permission:edit-attendance');
        Route::delete('/{attendance}', [AttendanceApiController::class, 'destroy'])->middleware('permission:delete-attendance');
        Route::get('/export/excel', [AttendanceApiController::class, 'exportExcel']);
        Route::get('/export/pdf', [AttendanceApiController::class, 'exportPdf']);
        Route::get('/calendar', [AttendanceApiController::class, 'calendar']);
        Route::get('/summary', [AttendanceApiController::class, 'summary']);
        Route::post('/bulk-import', [AttendanceApiController::class, 'bulkImport']);
    });

    // Payroll Management
    Route::prefix('payroll')->group(function () {
        Route::get('/', [PayrollController::class, 'index']);
        Route::post('/', [PayrollController::class, 'store'])->middleware('permission:create-payroll');
        Route::get('/{payroll}', [PayrollController::class, 'show']);
        Route::put('/{payroll}', [PayrollController::class, 'update'])->middleware('permission:edit-payroll');
        Route::delete('/{payroll}', [PayrollController::class, 'destroy'])->middleware('permission:delete-payroll');
        Route::post('/calculate', [PayrollController::class, 'calculate'])->middleware('permission:calculate-payroll');
        Route::post('/generate', [PayrollController::class, 'generate'])->middleware('permission:generate-payroll');
        Route::post('/bulk-calculate', [PayrollController::class, 'bulkCalculate'])->middleware('permission:calculate-payroll');
        Route::get('/summary', [PayrollController::class, 'summary']);
        Route::put('/{payroll}/approve', [PayrollController::class, 'approve'])->middleware('permission:approve-payroll');
        Route::get('/export/excel', [PayrollController::class, 'exportExcel']);
        Route::get('/export/pdf', [PayrollController::class, 'exportPdf']);
    });

    // Leave Management
    Route::prefix('leaves')->group(function () {
        Route::get('/', [LeaveController::class, 'index']);
        Route::post('/', [LeaveController::class, 'store']);
        Route::get('/{leave}', [LeaveController::class, 'show']);
        Route::put('/{leave}', [LeaveController::class, 'update']);
        Route::delete('/{leave}', [LeaveController::class, 'destroy']);
        Route::post('/{leave}/approve', [LeaveController::class, 'approve'])->middleware('permission:approve-leave');
        Route::post('/{leave}/reject', [LeaveController::class, 'reject'])->middleware('permission:approve-leave');
        Route::get('/calendar', [LeaveController::class, 'calendar']);
        Route::get('/balance/{employee}', [LeaveController::class, 'balance']);
        Route::get('/types', [LeaveController::class, 'getLeaveTypes']);
        Route::get('/export/excel', [LeaveController::class, 'exportExcel']);
    });

    // Schedule Management
    Route::prefix('schedules')->group(function () {
        Route::get('/', [ScheduleController::class, 'index']);
        Route::post('/', [ScheduleController::class, 'store'])->middleware('permission:create-schedule');
        Route::get('/{schedule}', [ScheduleController::class, 'show']);
        Route::put('/{schedule}', [ScheduleController::class, 'update'])->middleware('permission:edit-schedule');
        Route::delete('/{schedule}', [ScheduleController::class, 'destroy'])->middleware('permission:delete-schedule');
        Route::get('/calendar', [ScheduleController::class, 'calendar']);
        Route::get('/employee/{employee}', [ScheduleController::class, 'byEmployee']);
        Route::post('/bulk-create', [ScheduleController::class, 'bulkCreate'])->middleware('permission:create-schedule');
        Route::get('/conflicts', [ScheduleController::class, 'checkConflicts']);
    });

    // Reports and Analytics
    Route::prefix('reports')->group(function () {
        Route::get('/dashboard', [ReportController::class, 'dashboard']);
        Route::get('/attendance', [ReportController::class, 'attendance']);
        Route::get('/payroll', [ReportController::class, 'payroll']);
        Route::get('/leave', [ReportController::class, 'leave']);
        Route::get('/employee-performance', [ReportController::class, 'employeePerformance']);
        Route::post('/attendance/export', [ReportController::class, 'exportAttendance']);
        Route::post('/payroll/export', [ReportController::class, 'exportPayroll']);
        Route::post('/performance/export', [ReportController::class, 'exportPerformance']);
        Route::get('/charts/attendance-trends', [ReportController::class, 'attendanceTrends']);
        Route::get('/charts/employee-distribution', [ReportController::class, 'employeeDistribution']);
    });

    // Notifications
    Route::prefix('notifications')->group(function () {
        Route::get('/', [NotificationController::class, 'index']);
        Route::post('/', [NotificationController::class, 'store'])->middleware('permission:send-notifications');
        Route::get('/{notification}', [NotificationController::class, 'show']);
        Route::patch('/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::delete('/{notification}', [NotificationController::class, 'destroy']);
        Route::patch('/mark-all-read', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/', [NotificationController::class, 'clearAll']);
        Route::get('/preferences', [NotificationController::class, 'getPreferences']);
        Route::put('/preferences', [NotificationController::class, 'updatePreferences']);
        Route::post('/send', [NotificationController::class, 'send'])->middleware('permission:send-notifications');
    });

    // Face Recognition (with rate limiting)
    Route::prefix('face-recognition')->middleware('rate.limit:face_recognition')->group(function () {
        Route::post('/register', [FaceRecognitionController::class, 'register']);
        Route::post('/verify', [FaceRecognitionController::class, 'verify']);
        Route::delete('/employee/{employee}', [FaceRecognitionController::class, 'deleteFaceData']);
        Route::get('/employee/{employee}/status', [FaceRecognitionController::class, 'getStatus']);
        Route::post('/train', [FaceRecognitionController::class, 'trainModel'])->middleware('permission:manage-face-recognition');
        Route::get('/settings', [FaceRecognitionController::class, 'getSettings']);
        Route::put('/settings', [FaceRecognitionController::class, 'updateSettings'])->middleware('permission:manage-face-recognition');
    });

    // School Calendar
    Route::prefix('calendar')->group(function () {
        Route::get('/', [SchoolCalendarController::class, 'index']);
        Route::post('/', [SchoolCalendarController::class, 'store'])->middleware('permission:manage-calendar');
        Route::get('/{event}', [SchoolCalendarController::class, 'show']);
        Route::put('/{event}', [SchoolCalendarController::class, 'update'])->middleware('permission:manage-calendar');
        Route::delete('/{event}', [SchoolCalendarController::class, 'destroy'])->middleware('permission:manage-calendar');
        Route::get('/events/month/{year}/{month}', [SchoolCalendarController::class, 'getMonthEvents']);
    });

    // Period Management
    Route::prefix('periods')->group(function () {
        Route::get('/', [PeriodController::class, 'index']);
        Route::post('/', [PeriodController::class, 'store'])->middleware('permission:manage-periods');
        Route::get('/{period}', [PeriodController::class, 'show']);
        Route::put('/{period}', [PeriodController::class, 'update'])->middleware('permission:manage-periods');
        Route::delete('/{period}', [PeriodController::class, 'destroy'])->middleware('permission:manage-periods');
        Route::get('/current', [PeriodController::class, 'current']);
        Route::post('/{period}/activate', [PeriodController::class, 'activate'])->middleware('permission:manage-periods');
    });

    // Profile Management
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'show']);
        Route::put('/', [ProfileController::class, 'update']);
        Route::post('/avatar', [ProfileController::class, 'uploadAvatar'])->middleware('rate.limit:upload');
        Route::put('/password', [ProfileController::class, 'changePassword']);
        Route::get('/activity-log', [ProfileController::class, 'activityLog']);
    });

    // Settings (these would be handled by specific controllers)
    Route::prefix('settings')->group(function () {
        Route::get('/general', function () {
            return response()->json([
                'success' => true,
                'data' => [
                    'app_name' => config('app.name'),
                    'timezone' => config('app.timezone'),
                    'locale' => config('app.locale'),
                ]
            ]);
        });
        
        Route::get('/attendance', function () {
            return response()->json([
                'success' => true,
                'data' => [
                    'grace_period' => 15,
                    'work_hours_start' => '08:00',
                    'work_hours_end' => '17:00',
                    'break_duration' => 60,
                ]
            ]);
        });
        
        Route::get('/leave', function () {
            return response()->json([
                'success' => true,
                'data' => [
                    'annual_leave_days' => 12,
                    'sick_leave_days' => 12,
                    'maternity_leave_days' => 90,
                ]
            ]);
        });
    });

    // Search functionality
    Route::get('/search', function (Request $request) {
        $query = $request->get('q');
        $type = $request->get('type', 'all');
        
        $results = [];
        
        if ($type === 'all' || $type === 'employees') {
            $employees = \App\Models\Employee::where('name', 'like', "%{$query}%")
                ->orWhere('employee_id', 'like', "%{$query}%")
                ->take(5)
                ->get(['id', 'name', 'employee_id', 'department']);
            
            $results['employees'] = $employees;
        }
        
        return response()->json([
            'success' => true,
            'data' => $results
        ]);
    });
});

// Public routes (no authentication required)
Route::prefix('public')->group(function () {
    Route::get('/company-info', function () {
        return response()->json([
            'success' => true,
            'data' => [
                'name' => 'School Attendance System',
                'logo' => asset('images/logo.png'),
                'contact' => [
                    'email' => 'admin@school.edu',
                    'phone' => '+62 21 1234 5678'
                ]
            ]
        ]);
    });
});