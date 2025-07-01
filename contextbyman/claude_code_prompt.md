# Claude Code Prompt: School Attendance Management System

## Project Overview
Build a comprehensive, production-ready school attendance management system with advanced face detection, flexible scheduling for different employee types (permanent teachers, honorary teachers, permanent staff, honorary staff), and granular permission management.

## Client Requirements Summary

### Core Features Required
1. **Multi-permission login system** with role-based access control
2. **Employee management (CRUD)** for all staff types
3. **Period management** (class periods, break times, etc.)
4. **Teacher schedule management** with flexible hour assignments
5. **School schedule management** (holidays, events, calendar)
6. **Leave/permit submission system** with approval workflow
7. **Flexible payroll system** (hourly vs full-time calculations)
8. **Payroll export** per employee per month
9. **Server-side data tables** using Yajra DataTables
10. **AJAX operations** (PUT, POST, GET, DELETE) throughout
11. **Spatie permission system** for granular role management
12. **Page-level access control** with role checking before any action
13. **SQLite database** implementation
14. **Attendance radius settings** for location-based check-in
15. **Persistent login sessions** (remember me functionality)
16. **Tabler.io frontend** following official documentation

### Attendance System Focus Areas

#### Employee Types & Schedule Logic
- **Honorary Teachers**: Flexible working hours (e.g., 10 AM - 12 PM)
  - Must clock in BEFORE scheduled start time to avoid "late" status
  - Payroll calculated ONLY for actual working hours within schedule
  - Example: Schedule 10 AM-12 PM, arrives 8 AM, leaves 1 PM → paid for 10 AM-12 PM only
- **Permanent Teachers**: Fixed working hours with full-day calculations
- **Permanent Staff**: Fixed working hours with full-day calculations  
- **Honorary Staff**: Flexible hours similar to honorary teachers

#### Advanced Face Detection Requirements
- **Primary**: Face recognition for identity verification
- **Gesture Detection**: Head shaking, head nodding, smiling, blinking
- **Anti-spoofing**: Liveness detection through gesture combinations
- **Audit Trail**: Complete logging of all face detection attempts

#### Location & Schedule Management
- **Radius-based attendance**: GPS/location verification for valid check-ins
- **Dynamic schedule assignment**: Different schedules per employee type
- **Real-time validation**: Immediate feedback on attendance status

## Technical Architecture

### Backend Stack
- **Framework**: Laravel 12 (latest best practices)
- **Database**: SQLite with optimized schema
- **Authentication**: Laravel Sanctum + Spatie Laravel-Permission
- **DataTables**: Yajra Laravel DataTables (server-side)
- **Queue System**: Laravel Queue with Redis
- **API**: RESTful with comprehensive AJAX support

### Frontend Stack
- **Framework**: Vue 3 with Composition API
- **UI Framework**: Tabler.io (mandatory - follow official docs)
- **State Management**: Pinia
- **Build Tool**: Vite with HMR
- **HTTP Client**: Axios with CSRF protection

### Face Detection Microservice
- **Framework**: Python FastAPI
- **Libraries**: OpenCV, Dlib, face_recognition, MediaPipe
- **Features**: Face recognition + gesture detection (nod, shake, smile, blink)
- **Security**: JWT authentication, input validation, rate limiting

### DevOps & Production
- **Containerization**: Docker Compose
- **CI/CD**: GitHub Actions
- **Testing**: PHPUnit/Pest + Cypress E2E
- **Monitoring**: Health checks and logging

## Implementation Phases

### Phase 1: Core Foundation (Week 1-2)
1. **Laravel 12 Setup with Production Standards**
   - Initialize project with proper folder structure
   - Configure SQLite with optimized settings
   - Setup Spatie Laravel-Permission with custom models
   - Configure Laravel Sanctum with persistent sessions
   - Setup Yajra DataTables package

2. **Database Schema Design**
   ```sql
   -- Core Models Required:
   - users (base authentication)
   - employees (extends users with employee-specific data)
   - employee_types (permanent_teacher, honorary_teacher, permanent_staff, honorary_staff)
   - periods (class periods: 1st period, 2nd period, break, etc.)
   - schedules (employee schedule assignments)
   - school_calendars (holidays, events)
   - attendance_records (check-in/out with location data)
   - leave_requests (permit submissions)
   - payroll_settings (hourly rates, full-time salaries)
   - payroll_records (monthly calculations)
   - attendance_radius_settings (location boundaries)
   - face_logs (face detection audit trail)
   ```

3. **Permission System Architecture**
   - Define granular permissions for every page and action
   - Create role-based middleware for route protection
   - Implement permission checking before any CRUD operation
   - Build permission management interface

### Phase 2: Employee & Schedule Management (Week 3-4)
1. **Employee Management Module**
   - CRUD operations with different employee types
   - Employee type-specific fields and validations
   - Bulk import/export functionality
   - Employee photo management for face recognition

2. **Schedule Management System**
   - Period management (configurable class periods)
   - Teacher schedule assignments with time validation
   - School calendar management (holidays, events)
   - Schedule conflict detection and resolution

3. **Advanced Schedule Logic Implementation**
   - Honorary teacher flexible hour calculations
   - Permanent employee fixed schedule handling
   - Overtime and undertime calculations
   - Schedule-based payroll calculations

### Phase 3: Attendance System Core (Week 5-6)
1. **Attendance Recording System**
   - Location-based check-in with radius validation
   - Real-time attendance status calculation
   - Late/early arrival detection based on employee type
   - Manual attendance entry with approval workflow

2. **Radius & Location Management**
   - Configurable attendance radius settings
   - GPS coordinate validation
   - Multiple location support (different buildings/campuses)
   - Location-based reporting

3. **Attendance Business Logic**
   - Honorary teacher: payroll only for scheduled hours
   - Permanent employee: full-day calculations
   - Overtime calculations and approval system
   - Attendance pattern analysis

### Phase 4: Face Detection Integration (Week 7)
1. **Python FastAPI Microservice**
   ```python
   # Required endpoints:
   - POST /detect-face: Basic face detection
   - POST /verify-face: Face recognition against employee database
   - POST /detect-gestures: Nod, shake, smile, blink detection
   - POST /liveness-check: Anti-spoofing verification
   ```

2. **Advanced Gesture Detection**
   - Head nodding detection using facial landmarks
   - Head shaking detection with motion tracking
   - Smile detection using facial expression analysis
   - Blink detection with eye aspect ratio
   - Combination gestures for liveness verification

3. **Integration with Laravel Backend**
   - Face enrollment system for new employees
   - Real-time face verification during attendance
   - Fallback mechanisms for face detection failures
   - Comprehensive audit logging

### Phase 5: Frontend with Tabler.io (Week 8-9)
1. **Tabler.io Dashboard Implementation**
   - Main dashboard with attendance overview
   - Employee management interface with DataTables
   - Schedule management with calendar view
   - Real-time attendance monitoring

2. **Key Components (All Tabler.io Based)**
   ```vue
   - EmployeeTable.vue: Server-side DataTables with AJAX
   - ScheduleManager.vue: Drag-drop schedule builder
   - AttendanceForm.vue: Manual attendance entry
   - FaceAttendance.vue: Camera-based check-in with gestures
   - PayrollManager.vue: Payroll calculation interface
   - PermissionManager.vue: Role and permission assignment
   - RadiusSettings.vue: Location boundary configuration
   ```

3. **AJAX Implementation Throughout**
   - All CRUD operations via AJAX (PUT, POST, GET, DELETE)
   - Real-time form validation
   - Server-side DataTables pagination and filtering
   - File upload handling for employee photos

### Phase 6: Payroll & Leave Management (Week 10)
1. **Flexible Payroll System**
   - Hourly rate calculations for honorary employees
   - Fixed salary calculations for permanent employees
   - Overtime and deduction handling
   - Monthly payroll generation with export (PDF/Excel)

2. **Leave Management System**
   - Leave request submission interface
   - Approval workflow with email notifications
   - Leave balance tracking
   - Integration with attendance calculations

### Phase 7: Advanced Features (Week 11)
1. **Reporting & Analytics**
   - Monthly attendance reports per employee
   - Schedule compliance tracking
   - Payroll summary reports
   - Attendance pattern analysis

2. **Real-time Features**
   - Live attendance dashboard
   - Real-time notifications for late arrivals
   - WebSocket integration for instant updates
   - Mobile-responsive interface

### Phase 8: Testing & Production (Week 12)
1. **Comprehensive Testing**
   - Unit tests for all business logic
   - Feature tests for AJAX operations
   - E2E tests for critical user flows
   - Face detection accuracy testing

2. **Production Deployment**
   - Docker containerization
   - CI/CD pipeline with GitHub Actions
   - Security audit and penetration testing
   - Performance optimization

## Critical Implementation Requirements

### Security & Permission System
```php
// Every controller action must check permissions:
public function index()
{
    $this->authorize('view-employees');
    // Controller logic
}

// Middleware for route protection:
Route::middleware(['auth:sanctum', 'permission:manage-schedules'])
    ->group(function () {
        // Protected routes
    });
```

### Attendance Logic for Honorary Teachers
```php
// Example: Honorary teacher scheduled 10 AM - 12 PM
// Arrives: 8 AM, Leaves: 1 PM
// Payroll calculation: Only 10 AM - 12 PM (2 hours)
class AttendanceCalculator
{
    public function calculatePayableHours($employee, $checkIn, $checkOut)
    {
        if ($employee->type === 'honorary_teacher') {
            // Calculate intersection of actual hours with scheduled hours
            return $this->getScheduledHoursIntersection($employee, $checkIn, $checkOut);
        }
        // For permanent employees, different logic
    }
}
```

### Face Detection with Gestures
```python
# FastAPI endpoint for gesture detection
@app.post("/detect-gestures")
async def detect_gestures(image: UploadFile):
    # Detect face
    # Analyze facial landmarks for nod/shake
    # Check for smile using expression analysis
    # Detect blink using eye aspect ratio
    return {
        "face_detected": True,
        "gestures": {
            "nod": True,
            "shake": False,
            "smile": True,
            "blink": True
        },
        "liveness_score": 0.95
    }
```

### Tabler.io Implementation Standard
```vue
<!-- All components must follow Tabler.io documentation -->
<template>
  <div class="page">
    <div class="page-header d-print-none">
      <div class="container-xl">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">Employee Management</h2>
          </div>
        </div>
      </div>
    </div>
    <!-- Use Tabler.io table classes -->
    <div class="page-body">
      <div class="container-xl">
        <div class="card">
          <div class="table-responsive">
            <table class="table table-vcenter card-table">
              <!-- Server-side DataTables integration -->
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
```

## Success Criteria
- [ ] Multi-role permission system with page-level access control
- [ ] Employee management for all 4 employee types
- [ ] Flexible schedule assignment with business logic validation
- [ ] Face detection with 4 gesture types (nod, shake, smile, blink)
- [ ] Location-based attendance with radius validation
- [ ] Honorary teacher payroll calculation (scheduled hours only)
- [ ] Server-side DataTables with AJAX operations
- [ ] Monthly payroll export per employee
- [ ] 100% Tabler.io frontend implementation
- [ ] Persistent login sessions
- [ ] Production-ready with comprehensive testing

## Development Notes
- Prioritize attendance system core functionality
- Implement gesture detection early for client validation
- Use modular architecture for easy maintenance
- Follow Laravel 12 best practices throughout
- Maintain comprehensive documentation
- Ensure mobile responsiveness for field use

Start with Phase 1 and build systematically. The system must handle the complex business logic around different employee types while maintaining security and performance standards.