# Client Context: School Attendance Management System

## Project Overview
A comprehensive school attendance management system with advanced face detection capabilities, designed specifically for educational institutions with diverse employee types and flexible scheduling requirements.

## Client Business Requirements

### Primary Focus: Attendance System
The system is **attendance-centric** with three core pillars:
1. **Employee Management** - Handle different employee types with specific business rules
2. **Schedule Assignment** - Flexible scheduling system for various working patterns  
3. **Radius Setting** - Location-based attendance validation

### Employee Classification & Business Logic

#### 1. Honorary Teachers (Flexible Schedule)
- **Working Pattern**: Variable hours (e.g., 10 AM - 12 PM for specific classes)
- **Attendance Rule**: Must clock in BEFORE scheduled start time to avoid "late" status
- **Payroll Logic**: Only actual working hours within scheduled time are paid
- **Example Scenario**:
  - Scheduled: 10 AM - 12 PM (2 hours)
  - Actual arrival: 8 AM, departure: 1 PM
  - **Payroll calculation**: Only 10 AM - 12 PM = 2 hours paid
  - **Late detection**: If arrives at 11 AM (after 10 AM start) = marked as LATE

#### 2. Permanent Teachers
- **Working Pattern**: Fixed full-day schedule
- **Attendance Rule**: Standard full-day attendance tracking
- **Payroll Logic**: Fixed salary regardless of exact hours

#### 3. Permanent Staff  
- **Working Pattern**: Fixed working hours
- **Attendance Rule**: Standard attendance with fixed schedule
- **Payroll Logic**: Fixed salary structure

#### 4. Honorary Staff
- **Working Pattern**: Flexible hours similar to honorary teachers
- **Attendance Rule**: Must arrive before scheduled time
- **Payroll Logic**: Hourly rate for scheduled hours only

### System Features Specification

#### Core Features (Must Have)
1. **Multi-permission login** - Role-based access with granular controls
2. **Employee management (CRUD)** - Complete employee lifecycle management
3. **Period management** - Define class periods, break times, schedule blocks
4. **Teacher schedule management** - Assign teachers to specific time slots/classes
5. **School schedule management** - Handle holidays, events, calendar management
6. **Leave/permit submissions** - Digital leave request and approval workflow
7. **Flexible payroll system** - Support both hourly and salary-based calculations
8. **Payroll export** - Generate monthly reports per employee
9. **Server-side data tables** - Use Yajra DataTables for performance
10. **AJAX operations** - All CRUD operations via AJAX (PUT, POST, GET, DELETE)
11. **Spatie permission system** - Granular role and permission management
12. **Page-level access control** - Every page/action requires role verification
13. **SQLite database** - Lightweight, self-contained database
14. **Attendance radius settings** - GPS-based location validation
15. **Persistent login sessions** - Remember me functionality for users
16. **Tabler.io frontend** - Must follow official Tabler.io documentation

#### Advanced Attendance Features
- **Face Detection System** with gesture recognition:
  - **Head nodding** detection
  - **Head shaking** detection  
  - **Smiling** detection
  - **Blinking** detection
  - **Liveness verification** using gesture combinations
- **Location-based validation** with configurable radius
- **Real-time attendance monitoring**
- **Automatic late/early detection** based on employee type and schedule

#### Technical Requirements

##### Backend Requirements
- **Framework**: Laravel 12 (latest version)
- **Architecture**: Modular, production-ready structure
- **Database**: SQLite with optimized schema design
- **Authentication**: Laravel Sanctum + Spatie Laravel-Permission
- **DataTables**: Yajra server-side implementation
- **Best Practices**: Follow experienced programmer standards
- **Code Quality**: Clean, maintainable, well-documented code

##### Frontend Requirements  
- **Framework**: Must use Tabler.io exclusively
- **Documentation**: Follow official Tabler.io documentation for all implementations
- **Responsive**: Mobile-friendly design for field use
- **Interactive**: Rich AJAX-based user interactions
- **Real-time**: Live updates for attendance monitoring

##### Face Detection Service
- **Technology**: Python-based microservice
- **Capabilities**: Face recognition + 4 gesture types
- **Security**: Anti-spoofing through liveness detection
- **Performance**: Real-time processing for smooth user experience

## Business Logic Examples

### Scenario 1: Honorary Teacher Attendance
```
Teacher: John Doe (Honorary)
Scheduled: Monday 10:00 AM - 12:00 PM (Teaching Math)
Actual: Arrives 9:30 AM, Leaves 12:30 PM

System Logic:
- Attendance Status: ON TIME (arrived before 10:00 AM)
- Payroll Hours: 2 hours (10:00 AM - 12:00 PM only)
- System ignores: 9:30-10:00 AM and 12:00-12:30 PM
```

### Scenario 2: Honorary Teacher Late Arrival
```  
Teacher: Jane Smith (Honorary)
Scheduled: Tuesday 08:00 AM - 10:00 AM (Teaching English)
Actual: Arrives 8:30 AM, Leaves 10:00 AM

System Logic:
- Attendance Status: LATE (arrived after 8:00 AM)
- Payroll Hours: 1.5 hours (8:30 AM - 10:00 AM)
- Late Duration: 30 minutes
- Potential Deduction: Based on school policy
```

### Scenario 3: Permanent Teacher
```
Teacher: Bob Wilson (Permanent)  
Scheduled: Full day 7:00 AM - 3:00 PM
Actual: Arrives 7:15 AM, Leaves 3:00 PM

System Logic:
- Attendance Status: LATE (15 minutes)
- Payroll: Full day salary (not affected by 15min late)
- Record: Late arrival logged for HR review
```

## Permission Matrix Examples

### Role-Based Access Control
```
Super Admin:
- ✅ All system access
- ✅ User management
- ✅ Permission assignment
- ✅ System configuration

HR Manager:
- ✅ Employee management
- ✅ Payroll management  
- ✅ Leave approval
- ❌ System configuration

Teacher:
- ✅ Own attendance view
- ✅ Own schedule view
- ✅ Leave request submission
- ❌ Other employee data

Principal:
- ✅ All employee attendance view
- ✅ Schedule management
- ✅ Reports generation
- ❌ System configuration
```

## Integration Requirements

### Face Detection Workflow
1. **Employee Registration**: Capture face photos during onboarding
2. **Daily Check-in**: Face recognition + gesture verification
3. **Liveness Check**: Require specific gestures to prevent spoofing
4. **Fallback Options**: Manual entry if face detection fails
5. **Audit Trail**: Log all face detection attempts and results

### Location Validation Workflow  
1. **GPS Capture**: Get employee location during check-in
2. **Radius Check**: Validate against configured school boundaries
3. **Override System**: Allow manual override with supervisor approval
4. **Multiple Locations**: Support for schools with multiple campuses

## Success Metrics
- **Accuracy**: Face recognition >95% success rate
- **Performance**: Page load times <2 seconds
- **Usability**: Mobile-friendly for teachers using phones
- **Reliability**: 99.9% uptime during school hours
- **Security**: Zero unauthorized access incidents
- **Efficiency**: Reduce attendance processing time by 80%

## Technical Constraints
- **Database**: Must use SQLite (no MySQL/PostgreSQL)
- **Frontend**: Exclusive use of Tabler.io framework
- **Authentication**: Persistent sessions required
- **Deployment**: Production-ready with Docker support
- **Testing**: Comprehensive test coverage required
- **Documentation**: Complete API and user documentation

## Project Timeline Expectation
- **Total Duration**: 12 weeks
- **MVP Delivery**: 8 weeks (core attendance features)
- **Full System**: 12 weeks (including advanced features)
- **Testing Phase**: Integrated throughout development
- **Deployment**: Ready for production use

This system will serve as the central attendance management solution for the school, handling all employee types with their specific business rules while maintaining security, performance, and user experience standards.