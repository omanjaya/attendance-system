<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        $permissions = [
            // Employee Management
            'view-employees',
            'create-employees',
            'edit-employees',
            'delete-employees',
            'export-employees',
            
            // Attendance Management
            'view-attendances',
            'create-attendances',
            'edit-attendances',
            'delete-attendances',
            'export-attendances',
            'clock-in-out',
            'manual-attendance',
            
            // Schedule Management
            'view-schedules',
            'create-schedules',
            'edit-schedules',
            'delete-schedules',
            'assign-schedules',
            
            // Period Management
            'view-periods',
            'create-periods',
            'edit-periods',
            'delete-periods',
            
            // Leave Management
            'view-leaves',
            'create-leaves',
            'edit-leaves',
            'delete-leaves',
            'approve-leaves',
            'export-leaves',
            
            // Payroll Management
            'view-payrolls',
            'create-payrolls',
            'edit-payrolls',
            'delete-payrolls',
            'calculate-payrolls',
            'approve-payrolls',
            'export-payrolls',
            
            // Face Recognition
            'register-face',
            'verify-face',
            'manage-face-data',
            
            // Reports
            'view-reports',
            'generate-reports',
            'export-reports',
            
            // Settings
            'view-settings',
            'edit-settings',
            'manage-permissions',
            
            // System Administration
            'manage-users',
            'manage-roles',
            'view-logs',
            'system-backup',
        ];

        foreach ($permissions as $permission) {
            Permission::create(['name' => $permission]);
        }

        // Create roles and assign permissions
        
        // Super Admin - All permissions
        $superAdmin = Role::create(['name' => 'super_admin']);
        $superAdmin->givePermissionTo(Permission::all());
        
        // Admin - Most permissions except system administration
        $admin = Role::create(['name' => 'admin']);
        $adminPermissions = [
            'view-employees', 'create-employees', 'edit-employees', 'delete-employees', 'export-employees',
            'view-attendances', 'create-attendances', 'edit-attendances', 'delete-attendances', 'export-attendances', 'manual-attendance',
            'view-schedules', 'create-schedules', 'edit-schedules', 'delete-schedules', 'assign-schedules',
            'view-periods', 'create-periods', 'edit-periods', 'delete-periods',
            'view-leaves', 'create-leaves', 'edit-leaves', 'delete-leaves', 'approve-leaves', 'export-leaves',
            'view-payrolls', 'create-payrolls', 'edit-payrolls', 'calculate-payrolls', 'approve-payrolls', 'export-payrolls',
            'register-face', 'verify-face', 'manage-face-data',
            'view-reports', 'generate-reports', 'export-reports',
            'view-settings', 'edit-settings',
        ];
        $admin->givePermissionTo($adminPermissions);
        
        // HR Manager - Employee, leave, and payroll management
        $hrManager = Role::create(['name' => 'hr_manager']);
        $hrPermissions = [
            'view-employees', 'create-employees', 'edit-employees', 'export-employees',
            'view-attendances', 'export-attendances',
            'view-leaves', 'create-leaves', 'edit-leaves', 'approve-leaves', 'export-leaves',
            'view-payrolls', 'create-payrolls', 'edit-payrolls', 'calculate-payrolls', 'export-payrolls',
            'view-reports', 'generate-reports', 'export-reports',
            'register-face',
        ];
        $hrManager->givePermissionTo($hrPermissions);
        
        // Teacher - Basic attendance and leave management
        $teacher = Role::create(['name' => 'teacher']);
        $teacherPermissions = [
            'clock-in-out',
            'verify-face',
            'view-attendances', // Own attendance only
            'create-leaves', // Own leaves only
            'view-leaves', // Own leaves only
            'view-schedules', // Own schedule only
        ];
        $teacher->givePermissionTo($teacherPermissions);
        
        // Staff - Similar to teacher but may have different permissions
        $staff = Role::create(['name' => 'staff']);
        $staffPermissions = [
            'clock-in-out',
            'verify-face',
            'view-attendances', // Own attendance only
            'create-leaves', // Own leaves only
            'view-leaves', // Own leaves only
            'view-schedules', // Own schedule only
        ];
        $staff->givePermissionTo($staffPermissions);
        
        // Supervisor - Can manage attendance and some reports
        $supervisor = Role::create(['name' => 'supervisor']);
        $supervisorPermissions = [
            'view-employees', 'export-employees',
            'view-attendances', 'create-attendances', 'edit-attendances', 'export-attendances', 'manual-attendance',
            'view-schedules', 'create-schedules', 'edit-schedules',
            'view-leaves', 'approve-leaves',
            'view-reports', 'generate-reports',
            'clock-in-out', 'verify-face',
        ];
        $supervisor->givePermissionTo($supervisorPermissions);
    }
}
