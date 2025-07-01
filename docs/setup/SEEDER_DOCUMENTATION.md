# School Attendance System - Database Seeders

## Overview
This document describes the comprehensive database seeders created for the school attendance system, which includes employee types, roles, permissions, and demo users.

## Created Seeders

### 1. EmployeeTypeSeeder
Creates the four employee types as specified:
- **permanent_teacher**: Permanent teaching staff with full benefits and job security
- **honorary_teacher**: Honorary or contract teaching staff
- **permanent_staff**: Permanent administrative and support staff with full benefits
- **honorary_staff**: Honorary or contract administrative and support staff

### 2. RolePermissionSeeder
Creates comprehensive roles and permissions for the entire system:

#### Permissions (63 total) organized by category:

**Employee Management (6 permissions)**
- employees.view
- employees.create
- employees.edit
- employees.delete
- employees.import
- employees.export

**Attendance Management (8 permissions)**
- attendance.view
- attendance.view.own
- attendance.create
- attendance.edit
- attendance.delete
- attendance.approve
- attendance.import
- attendance.export

**Schedule Management (5 permissions)**
- schedules.view
- schedules.create
- schedules.edit
- schedules.delete
- schedules.assign

**Payroll Management (7 permissions)**
- payroll.view
- payroll.create
- payroll.edit
- payroll.delete
- payroll.approve
- payroll.export
- payroll.settings

**Leave Management (9 permissions)**
- leave.view
- leave.view.own
- leave.create
- leave.create.own
- leave.edit
- leave.edit.own
- leave.delete
- leave.approve
- leave.reject

**System Administration (11 permissions)**
- settings.view
- settings.edit
- users.view
- users.create
- users.edit
- users.delete
- roles.view
- roles.create
- roles.edit
- roles.delete
- permissions.view
- permissions.assign

**Reports (9 permissions)**
- reports.attendance.view
- reports.attendance.export
- reports.payroll.view
- reports.payroll.export
- reports.leave.view
- reports.leave.export
- reports.employee.view
- reports.employee.export
- reports.dashboard.view

**School Calendar (4 permissions)**
- calendar.view
- calendar.create
- calendar.edit
- calendar.delete

**Face Recognition (4 permissions)**
- face.logs.view
- face.settings.edit
- face.sync

#### Roles with Permission Assignments:

**Super Admin (63 permissions)**
- Full access to all system features

**HR Manager (44 permissions)**
- Complete employee, attendance, leave, and payroll management
- Schedule management and assignment
- Comprehensive reporting access
- Basic user management

**Principal (26 permissions)**
- High-level oversight and approval authority
- View and approve attendance, leave, and payroll
- Complete access to reports and calendar
- Settings management

**Teacher (7 permissions)**
- View own attendance and create attendance records
- Manage own leave requests
- View schedules and calendar

**Staff (7 permissions)**
- Same as Teacher role (own attendance and leave management)
- View schedules and calendar

**Accountant (15 permissions)**
- Payroll management and settings
- Financial reporting access
- Employee and attendance viewing for payroll purposes

### 3. DemoUsersSeeder
Creates demo users for each role with complete employee profiles:

#### Demo User Accounts:
1. **Super Administrator** (superadmin@school.edu)
   - Role: Super Admin
   - Employee Type: permanent_staff
   - Position: System Administrator

2. **HR Manager** (hr@school.edu)
   - Role: HR Manager
   - Employee Type: permanent_staff
   - Position: Human Resources Manager

3. **Principal** (principal@school.edu)
   - Role: Principal
   - Employee Type: permanent_staff
   - Position: School Principal

4. **Teacher Demo** (teacher@school.edu)
   - Role: Teacher
   - Employee Type: permanent_teacher
   - Position: Mathematics Teacher

5. **Staff Demo** (staff@school.edu)
   - Role: Staff
   - Employee Type: permanent_staff
   - Position: Administrative Assistant

6. **Accountant Demo** (accountant@school.edu)
   - Role: Accountant
   - Employee Type: permanent_staff
   - Position: School Accountant

7. **Honorary Teacher** (honorary.teacher@school.edu)
   - Role: Teacher
   - Employee Type: honorary_teacher
   - Position: Science Teacher (Contract)

8. **Honorary Staff** (honorary.staff@school.edu)
   - Role: Staff
   - Employee Type: honorary_staff
   - Position: Part-time Office Assistant

**All demo users have the password: `password123`**

### 4. Updated DatabaseSeeder
The main DatabaseSeeder has been updated to call all seeders in the correct order:
1. EmployeeTypeSeeder
2. RolePermissionSeeder
3. DemoUsersSeeder

## Usage

To run the seeders:

```bash
# Run all seeders
php artisan db:seed

# Or refresh database and seed
php artisan migrate:fresh --seed

# Run specific seeder
php artisan db:seed --class=EmployeeTypeSeeder
php artisan db:seed --class=RolePermissionSeeder
php artisan db:seed --class=DemoUsersSeeder
```

## Features

### Granular Permissions
The permission system is designed with fine-grained control, allowing for:
- Distinction between viewing all records vs. own records (e.g., `attendance.view` vs `attendance.view.own`)
- Separate permissions for different operations (view, create, edit, delete, approve, export)
- Role-specific access patterns that match real-world school hierarchies

### Comprehensive Demo Data
- Each demo user has a complete employee profile with realistic data
- Covers all employee types (permanent/honorary teachers and staff)
- Demonstrates the relationship between users, employees, and employee types

### Extensible Design
- Easy to add new permissions by updating the `getPermissions()` method
- Roles can be modified by adjusting permission assignments
- New employee types can be added to the EmployeeTypeSeeder

## Security Considerations
- All passwords are properly hashed using Laravel's Hash facade
- Permissions are cached for performance using Spatie's permission caching
- Role assignments are properly validated before creation

This seeder system provides a solid foundation for the school attendance system with proper role-based access control and comprehensive demo data for testing and development.