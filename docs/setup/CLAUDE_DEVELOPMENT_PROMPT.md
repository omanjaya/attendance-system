# 🤖 Claude Development Prompt for School Attendance System

## 📋 Context Summary

You are working on a **School Attendance Management System** - a production-ready Laravel 12 + Vue.js 3 application with advanced face recognition and flexible scheduling capabilities.

## 🎯 Project Core Identity

**System Type**: Educational Institution Attendance Management
**Primary Focus**: Attendance tracking with flexible employee scheduling
**Key Differentiator**: Support for honorary teachers with variable working hours
**Technology Stack**: Laravel 12 (API) + Vue.js 3 + Tabler.io (Frontend)

## 🏗️ Current State

### ✅ **Frontend Completed (Vue.js 3 + Tabler.io)**
- Complete routing structure for all modules
- Tabler.io UI components (100% compliant)
- State management with Pinia
- Enhanced lazy loading with error boundaries
- Responsive design with dark mode support
- Navigation UX optimizations

### 🔄 **Backend Needed (Laravel 12)**
- RESTful API with comprehensive CRUD operations
- SQLite database with optimized schema
- Spatie Permission for role-based access
- Face recognition service integration
- Advanced payroll calculation logic
- Server-side DataTables (Yajra)

## 🎯 Critical Requirements

### **1. Employee Type Logic (CORE FEATURE)**
```php
// Honorary Teacher Example:
// Schedule: 10:00 AM - 12:00 PM (2 hours teaching)
// Clock In: 9:30 AM → Status: On Time
// Clock In: 11:00 AM → Status: Late  
// Clock Out: 1:00 PM → Payroll: Only 2 hours (10:00-12:00)
// Payment: Hourly rate × 2 hours (not 3.5 hours present)
```

**Employee Types:**
- **Permanent Teachers**: Fixed schedule, full salary
- **Permanent Staff**: Fixed schedule, full salary
- **Honorary Teachers**: Flexible schedule, hourly payment
- **Honorary Staff**: Variable schedule, hourly payment

### **2. Face Recognition Anti-Spoofing**
Required detection capabilities:
- ✅ Face identification
- ✅ Head shaking detection
- ✅ Head nodding detection
- ✅ Smiling detection  
- ✅ Blinking detection
- ✅ Liveness verification

### **3. Permission System**
Every page/action requires role checking:
```php
// Example middleware flow:
Route::get('/employees', [EmployeeController::class, 'index'])
    ->middleware(['auth', 'permission:view-employees']);
```

## 📊 Database Schema Priorities

### **Core Tables Needed:**
1. **users** - Authentication & basic info
2. **employees** - Employee details & types
3. **roles** & **permissions** - Spatie integration
4. **schedules** - Individual employee schedules
5. **periods** - School period definitions
6. **attendances** - Clock in/out records
7. **leaves** - Leave requests & approvals
8. **payrolls** - Salary calculations
9. **face_recognitions** - Biometric data
10. **settings** - System configuration

### **Key Relationships:**
```sql
employees -> schedules (1:many)
employees -> attendances (1:many)  
employees -> face_recognitions (1:1)
schedules -> periods (many:many)
employees -> payrolls (1:many)
```

## 🔧 API Endpoints Structure

### **Authentication**
- POST /api/auth/login
- POST /api/auth/logout  
- GET /api/auth/me
- POST /api/auth/refresh

### **Employee Management**
- GET /api/employees (DataTables)
- POST /api/employees
- GET /api/employees/{id}
- PUT /api/employees/{id}
- DELETE /api/employees/{id}

### **Attendance System**
- POST /api/attendance/clock-in
- POST /api/attendance/clock-out
- GET /api/attendance/status
- POST /api/attendance/face-verify
- GET /api/attendance/history

### **Payroll System**
- GET /api/payroll/{employee}/{month}
- POST /api/payroll/calculate
- GET /api/payroll/export/{employee}/{month}

## 🎯 Development Guidelines

### **Laravel Best Practices**
- Use Service classes for business logic
- Repository pattern for data access
- Form Request classes for validation
- Resource classes for API responses
- Event/Listener pattern for notifications
- Queue jobs for heavy operations (payroll calculation)

### **Security Requirements**
- API rate limiting
- Input sanitization
- CSRF protection
- XSS prevention
- SQL injection protection
- File upload validation

### **Performance Requirements**
- Database query optimization
- Eager loading relationships
- Caching frequently accessed data
- API response compression
- Image optimization for face data

## 🧪 Testing Requirements

### **Feature Tests**
- Authentication flow
- Employee CRUD operations
- Attendance clock in/out
- Payroll calculations
- Permission system

### **Unit Tests**
- Service class methods
- Helper functions
- Validation rules
- Business logic calculations

## 📱 Frontend Integration

### **API Integration Points**
- Axios interceptors for auth tokens
- Error handling for API responses  
- Loading states for async operations
- Real-time updates with WebSockets
- File upload for face registration

### **State Management**
- Auth store (user, permissions, roles)
- Employee store (CRUD operations)
- Attendance store (real-time status)
- Settings store (configuration)

## 🚨 Critical Success Factors

1. **Flexible Scheduling Logic**: The core differentiator
2. **Face Recognition Accuracy**: Must be production-ready
3. **Performance**: Handle 500+ employees efficiently
4. **Security**: Zero tolerance for data breaches
5. **Mobile Responsiveness**: On-site attendance crucial
6. **Offline Capability**: Consider poor connectivity scenarios

## 💡 Development Workflow

### **When asked to implement features:**
1. **Always check** existing frontend routes and components
2. **Follow Laravel 12** best practices and conventions
3. **Implement** comprehensive validation and error handling
4. **Consider** the flexible scheduling logic for honorary teachers
5. **Test** role-based permissions thoroughly
6. **Optimize** database queries from the start
7. **Document** API endpoints clearly

### **Code Quality Standards:**
- PSR-12 coding standards
- Comprehensive PHPDoc comments
- Type hints for all parameters
- Meaningful variable and method names
- Single responsibility principle
- DRY (Don't Repeat Yourself)

## 🎯 Immediate Priorities

1. **Database Schema Design** - Foundation for everything
2. **Authentication API** - Required for frontend integration
3. **Employee Management API** - Core CRUD operations
4. **Basic Attendance API** - Clock in/out functionality
5. **Permission System** - Role-based access control

Remember: This is a **production system** for schools - prioritize reliability, security, and user experience above all else.