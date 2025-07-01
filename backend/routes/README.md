# Attendance System Routing Documentation

This document provides a comprehensive overview of the routing system for the School Attendance Management System.

## Overview

The routing system is organized into two main files:
- `web.php` - Web application routes
- `api.php` - API endpoints for mobile/external applications

## Route Structure

### Web Routes (`routes/web.php`)

#### Public Routes
- `GET /` - Welcome/landing page

#### Authentication Routes (Guest only)
- `GET /login` - Show login form
- `POST /login` - Process login
- `GET /register` - Show registration form  
- `POST /register` - Process registration
- `GET /forgot-password` - Show forgot password form
- `POST /forgot-password` - Send reset link
- `GET /reset-password/{token}` - Show reset form
- `POST /reset-password` - Process password reset

#### Protected Routes (Authentication required)

##### Dashboard
- `GET /dashboard` - Main dashboard
- `GET /dashboard/stats` - Dashboard statistics

##### Profile Management
- `GET /profile` - View profile
- `GET /profile/edit` - Edit profile form
- `PUT /profile/update` - Update profile
- `PUT /profile/password` - Change password
- `DELETE /profile/avatar` - Delete avatar

##### Employee Management (Permission: `manage employees`)
- `GET /employees` - List employees
- `GET /employees/create` - Create employee form
- `POST /employees` - Store employee
- `GET /employees/{employee}` - View employee
- `GET /employees/{employee}/edit` - Edit employee form
- `PUT /employees/{employee}` - Update employee
- `DELETE /employees/{employee}` - Delete employee
- `POST /employees/{employee}/activate` - Activate employee
- `POST /employees/{employee}/deactivate` - Deactivate employee
- `GET /employees/{employee}/attendance-history` - View attendance history
- `POST /employees/bulk-import` - Bulk import employees
- `GET /employees/export` - Export employees

##### Attendance Management
All users can manage their own attendance:
- `GET /attendance` - View own attendance
- `GET /attendance/calendar` - Calendar view
- `POST /attendance/check-in` - Check in
- `POST /attendance/check-out` - Check out
- `POST /attendance/break-start` - Start break
- `POST /attendance/break-end` - End break

Permission: `manage attendance` required for:
- `GET /attendance/manage` - Manage all attendance
- `POST /attendance/manual-entry` - Manual attendance entry
- `PUT /attendance/{attendance}/edit` - Edit attendance
- `DELETE /attendance/{attendance}` - Delete attendance
- `POST /attendance/bulk-approve` - Bulk approve
- `GET /attendance/export` - Export attendance

##### Schedule Management (Permission: `manage schedules`)
- `GET /schedules` - List schedules
- `GET /schedules/create` - Create schedule form
- `POST /schedules` - Store schedule
- `GET /schedules/{schedule}` - View schedule
- `GET /schedules/{schedule}/edit` - Edit schedule form
- `PUT /schedules/{schedule}` - Update schedule
- `DELETE /schedules/{schedule}` - Delete schedule
- `POST /schedules/bulk-assign` - Bulk assign schedules
- `GET /schedules/calendar` - Calendar view
- `POST /schedules/copy` - Copy schedule

##### Leave Management
All users can manage their own leaves:
- `GET /leaves` - List own leaves
- `GET /leaves/create` - Create leave form
- `POST /leaves` - Submit leave request
- `GET /leaves/{leave}` - View leave
- `GET /leaves/{leave}/edit` - Edit leave form
- `PUT /leaves/{leave}` - Update leave
- `DELETE /leaves/{leave}` - Cancel leave

Permission: `manage leaves` required for:
- `GET /leaves/manage/pending` - Manage pending leaves
- `POST /leaves/{leave}/approve` - Approve leave
- `POST /leaves/{leave}/reject` - Reject leave
- `GET /leaves/balance/{employee}` - View leave balance

##### Payroll Management (Permission: `manage payroll`)
- `GET /payroll` - List payroll
- `GET /payroll/create` - Create payroll form
- `POST /payroll` - Store payroll
- `GET /payroll/{payroll}` - View payroll
- `GET /payroll/{payroll}/edit` - Edit payroll form
- `PUT /payroll/{payroll}` - Update payroll
- `DELETE /payroll/{payroll}` - Delete payroll
- `POST /payroll/generate` - Generate payroll
- `POST /payroll/bulk-process` - Bulk process payroll
- `GET /payroll/{payroll}/download` - Download pay slip
- `POST /payroll/{payroll}/send-email` - Send pay slip via email

##### Reports (Permission: `view reports`)
- `GET /reports` - Reports dashboard
- `GET /reports/attendance` - Attendance reports
- `GET /reports/attendance/summary` - Attendance summary
- `GET /reports/leave` - Leave reports
- `GET /reports/payroll` - Payroll reports
- `GET /reports/employee-performance` - Employee performance
- `GET /reports/department-stats` - Department statistics
- `POST /reports/custom` - Generate custom report
- `GET /reports/export/{type}` - Export reports

##### Settings (Permission: `manage settings`)
- `GET /settings` - Settings dashboard
- `GET /settings/general` - General settings
- `POST /settings/general` - Update general settings
- `GET /settings/attendance` - Attendance settings
- `POST /settings/attendance` - Update attendance settings
- `GET /settings/leave-policies` - Leave policies
- `POST /settings/leave-policies` - Update leave policies
- `GET /settings/notifications` - Notification settings
- `POST /settings/notifications` - Update notifications
- `GET /settings/integrations` - Integration settings
- `POST /settings/integrations` - Update integrations
- `GET /settings/backup` - Backup settings
- `POST /settings/backup/create` - Create backup
- `GET /settings/logs` - View logs

##### Face Recognition
- `GET /face-recognition/setup` - Setup face recognition
- `POST /face-recognition/register-face` - Register face
- `POST /face-recognition/verify-face` - Verify face
- `DELETE /face-recognition/remove-face` - Remove face
- `GET /face-recognition/status` - Face recognition status

### API Routes (`routes/api.php`)

All API routes are prefixed with `/api/v1`

#### Public API Routes

##### Authentication
- `POST /api/v1/auth/login` - API login
- `POST /api/v1/auth/register` - API registration
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password
- `POST /api/v1/auth/verify-email` - Verify email
- `POST /api/v1/auth/resend-verification` - Resend verification

##### Face Recognition (Public for kiosks)
- `POST /api/v1/face-recognition/identify` - Identify person
- `POST /api/v1/face-recognition/attendance-check` - Check attendance via face
- `GET /api/v1/face-recognition/kiosk-status` - Kiosk status

#### Protected API Routes (Require Authentication)

##### Authentication Management
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/refresh` - Refresh token
- `GET /api/v1/auth/user` - Get user info
- `POST /api/v1/auth/change-password` - Change password

##### Dashboard
- `GET /api/v1/dashboard/stats` - Dashboard statistics
- `GET /api/v1/dashboard/recent-activity` - Recent activity
- `GET /api/v1/dashboard/notifications` - Notifications
- `GET /api/v1/dashboard/quick-stats` - Quick statistics

##### Profile Management
- `GET /api/v1/profile` - Get profile
- `PUT /api/v1/profile/update` - Update profile
- `POST /api/v1/profile/avatar` - Upload avatar
- `DELETE /api/v1/profile/avatar` - Delete avatar
- `PUT /api/v1/profile/password` - Update password
- `GET /api/v1/profile/notifications-settings` - Get notification settings
- `PUT /api/v1/profile/notifications-settings` - Update notification settings

##### Employee Management (Permission: `manage employees`)
- `GET /api/v1/employees` - List employees
- `POST /api/v1/employees` - Create employee
- `GET /api/v1/employees/{employee}` - Get employee
- `PUT /api/v1/employees/{employee}` - Update employee
- `DELETE /api/v1/employees/{employee}` - Delete employee
- `POST /api/v1/employees/{employee}/activate` - Activate employee
- `POST /api/v1/employees/{employee}/deactivate` - Deactivate employee
- `GET /api/v1/employees/{employee}/attendance-history` - Attendance history
- `POST /api/v1/employees/bulk-import` - Bulk import
- `GET /api/v1/employees/export` - Export employees
- `GET /api/v1/employees/search` - Search employees
- `GET /api/v1/employees/departments` - List departments
- `GET /api/v1/employees/positions` - List positions

##### Attendance Management
Personal attendance (all users):
- `GET /api/v1/attendance` - List own attendance
- `GET /api/v1/attendance/today` - Today's attendance
- `GET /api/v1/attendance/status` - Current status
- `POST /api/v1/attendance/check-in` - Check in
- `POST /api/v1/attendance/check-out` - Check out
- `POST /api/v1/attendance/break-start` - Start break
- `POST /api/v1/attendance/break-end` - End break
- `GET /api/v1/attendance/history` - Attendance history
- `GET /api/v1/attendance/calendar/{month?}` - Calendar view
- `GET /api/v1/attendance/summary/{period?}` - Summary

Management (Permission: `manage attendance`):
- `GET /api/v1/attendance/manage` - Manage attendance
- `POST /api/v1/attendance/manual-entry` - Manual entry
- `PUT /api/v1/attendance/{attendance}` - Update attendance
- `DELETE /api/v1/attendance/{attendance}` - Delete attendance
- `POST /api/v1/attendance/bulk-approve` - Bulk approve
- `GET /api/v1/attendance/export` - Export
- `GET /api/v1/attendance/employee/{employee}` - Employee attendance
- `GET /api/v1/attendance/department/{department}` - Department attendance

##### Schedule Management
Personal (all users):
- `GET /api/v1/schedules/my-schedule` - My schedule
- `GET /api/v1/schedules/upcoming` - Upcoming schedules

Management (Permission: `manage schedules`):
- `GET /api/v1/schedules` - List schedules
- `POST /api/v1/schedules` - Create schedule
- `GET /api/v1/schedules/{schedule}` - Get schedule
- `PUT /api/v1/schedules/{schedule}` - Update schedule
- `DELETE /api/v1/schedules/{schedule}` - Delete schedule
- `POST /api/v1/schedules/bulk-assign` - Bulk assign
- `GET /api/v1/schedules/calendar/{date?}` - Calendar
- `POST /api/v1/schedules/copy` - Copy schedule
- `GET /api/v1/schedules/templates` - Templates
- `POST /api/v1/schedules/generate` - Generate schedule

##### Leave Management
Personal (all users):
- `GET /api/v1/leaves` - List own leaves
- `POST /api/v1/leaves` - Create leave request
- `GET /api/v1/leaves/{leave}` - Get leave
- `PUT /api/v1/leaves/{leave}` - Update leave
- `DELETE /api/v1/leaves/{leave}` - Cancel leave
- `GET /api/v1/leaves/balance/me` - My leave balance
- `GET /api/v1/leaves/types` - Leave types
- `GET /api/v1/leaves/calendar/{year?}` - Leave calendar

Management (Permission: `manage leaves`):
- `GET /api/v1/leaves/manage/pending` - Pending leaves
- `GET /api/v1/leaves/manage/all` - All leaves
- `POST /api/v1/leaves/{leave}/approve` - Approve leave
- `POST /api/v1/leaves/{leave}/reject` - Reject leave
- `GET /api/v1/leaves/balance/{employee}` - Employee balance
- `GET /api/v1/leaves/department/{department}` - Department leaves
- `GET /api/v1/leaves/export` - Export leaves

##### Payroll Management (Permission: `manage payroll`)
- `GET /api/v1/payroll` - List payroll
- `POST /api/v1/payroll` - Create payroll
- `GET /api/v1/payroll/{payroll}` - Get payroll
- `PUT /api/v1/payroll/{payroll}` - Update payroll
- `DELETE /api/v1/payroll/{payroll}` - Delete payroll
- `POST /api/v1/payroll/generate` - Generate payroll
- `POST /api/v1/payroll/bulk-process` - Bulk process
- `GET /api/v1/payroll/{payroll}/download` - Download slip
- `POST /api/v1/payroll/{payroll}/send-email` - Send email
- `GET /api/v1/payroll/employee/{employee}` - Employee payroll
- `GET /api/v1/payroll/summary/{period}` - Payroll summary

Personal payroll access:
- `GET /api/v1/my-payroll` - My payroll records
- `GET /api/v1/my-payroll/{payroll}` - My payroll details
- `GET /api/v1/my-payroll/{payroll}/download` - Download my slip

##### Reports (Permission: `view reports`)
- `GET /api/v1/reports/attendance` - Attendance reports
- `GET /api/v1/reports/attendance/summary` - Attendance summary
- `GET /api/v1/reports/leave` - Leave reports
- `GET /api/v1/reports/payroll` - Payroll reports
- `GET /api/v1/reports/employee-performance` - Performance reports
- `GET /api/v1/reports/department-stats` - Department statistics
- `POST /api/v1/reports/custom` - Custom reports
- `GET /api/v1/reports/export/{type}` - Export reports
- `GET /api/v1/reports/dashboard-widgets` - Dashboard widgets

##### Face Recognition
- `GET /api/v1/face-recognition/status` - Status
- `POST /api/v1/face-recognition/register-face` - Register face
- `POST /api/v1/face-recognition/verify-face` - Verify face
- `DELETE /api/v1/face-recognition/remove-face` - Remove face
- `GET /api/v1/face-recognition/training-status` - Training status
- `POST /api/v1/face-recognition/retrain` - Retrain model

Management (Permission: `manage settings`):
- `GET /api/v1/face-recognition/manage` - Manage face recognition
- `POST /api/v1/face-recognition/bulk-register` - Bulk register
- `GET /api/v1/face-recognition/analytics` - Analytics
- `POST /api/v1/face-recognition/settings` - Update settings

##### Notifications
- `GET /api/v1/notifications` - List notifications
- `GET /api/v1/notifications/unread-count` - Unread count
- `POST /api/v1/notifications/{notification}/mark-read` - Mark as read
- `POST /api/v1/notifications/mark-all-read` - Mark all as read
- `DELETE /api/v1/notifications/{notification}` - Delete notification
- `DELETE /api/v1/notifications/clear-all` - Clear all notifications

##### Utility Routes
- `GET /api/v1/utils/time-zones` - List time zones
- `GET /api/v1/utils/countries` - List countries
- `GET /api/v1/utils/app-version` - App version
- `GET /api/v1/utils/system-health` - System health check

#### Webhook Routes

These routes don't require authentication but have specific middleware:

- `POST /api/v1/webhooks/attendance-device` - Attendance device webhook
- `POST /api/v1/webhooks/face-recognition` - Face recognition webhook
- `POST /api/v1/webhooks/payroll-integration` - Payroll integration webhook

## Middleware

### Web Middleware
- `guest` - Only for unauthenticated users
- `auth` - Requires authentication
- `verified` - Requires email verification
- `permission:permission-name` - Requires specific permission

### API Middleware
- `auth:sanctum` - API authentication using Laravel Sanctum
- `throttle:api` - Rate limiting (60 requests/minute)
- `throttle:face-recognition` - Face recognition rate limiting (30 requests/minute)
- `throttle:webhooks` - Webhook rate limiting (100 requests/minute)
- `permission:permission-name` - Permission checking
- `api.response` - Consistent API response formatting
- `api.log` - API request logging

### Custom Middleware
- `CheckPermissionOrOwner` - Checks permission or resource ownership
- `ApiResponse` - Formats API responses consistently
- `LogApiRequests` - Logs API requests for monitoring

## Security Features

1. **CSRF Protection** - All web routes are protected against CSRF attacks
2. **Rate Limiting** - API endpoints have rate limiting to prevent abuse
3. **Permission System** - Uses Spatie Laravel Permission for role-based access
4. **CORS Configuration** - Proper CORS setup for API access
5. **Request Logging** - API requests are logged for security monitoring
6. **Input Validation** - All sensitive data is filtered in logs
7. **Sanctum Authentication** - Secure API authentication

## Permission List

The following permissions are used throughout the system:

- `manage employees` - Employee management access
- `manage attendance` - Attendance management access
- `manage schedules` - Schedule management access
- `manage leaves` - Leave management access
- `manage payroll` - Payroll management access
- `view reports` - Reports access
- `manage settings` - System settings access

## Rate Limiting

- General API: 60 requests per minute
- Face Recognition: 30 requests per minute
- Webhooks: 100 requests per minute

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "message": "Success message",
  "data": {},
  "timestamp": "2023-01-01T00:00:00.000000Z"
}
```

## Error Handling

Standard HTTP status codes are used:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 422: Validation Error
- 429: Too Many Requests
- 500: Server Error