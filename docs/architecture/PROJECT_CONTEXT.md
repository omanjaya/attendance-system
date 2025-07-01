# 🏫 School Attendance Management System - Project Context

## 📋 Project Overview

This is a comprehensive **School Attendance Management System** designed specifically for educational institutions with complex scheduling needs, multiple employee types, and advanced face recognition capabilities.

## 🎯 Core Focus Areas

### 1. **Attendance System (Primary Focus)**
- **Employee Management**: Teachers, Staff, Honorary Teachers
- **Schedule Assignment**: Flexible and Fixed schedules
- **Radius Settings**: GPS-based attendance validation
- **Face Recognition**: Advanced anti-spoofing detection

### 2. **Multi-Employee Type Support**
- **Permanent Teachers**: Fixed working hours
- **Permanent Staff**: Fixed working hours  
- **Honorary Teachers**: Flexible working hours
- **Honorary Staff**: Variable schedules

### 3. **Advanced Scheduling Logic**
Example: Honorary teacher with teaching hours 10:00 AM - 12:00 PM
- ✅ Clock in at 9:30 AM → On time
- ❌ Clock in at 11:00 AM → Late
- 💰 Payroll: Only actual working hours (10:00 AM - 12:00 PM) counted
- ⏰ If present 8:00 AM - 1:00 PM, still only paid for 10:00 AM - 12:00 PM

## 🔧 Technical Requirements

### **Backend Technology Stack**
- **Framework**: Laravel 12
- **Database**: SQLite
- **Authentication**: Multi-permission login system
- **Permissions**: Spatie Permission package
- **Data Tables**: Server-side rendering (Yajra DataTables)
- **API**: RESTful with AJAX (GET, POST, PUT, DELETE)

### **Frontend Technology Stack**
- **Framework**: Vue.js 3 with Composition API
- **UI Framework**: Tabler.io (100% compliance)
- **State Management**: Pinia
- **HTTP Client**: Axios
- **Charts**: Chart.js
- **Icons**: Tabler Icons

### **Face Recognition Features**
- **Basic Detection**: Face identification
- **Anti-Spoofing**: Head shaking detection
- **Anti-Spoofing**: Head nodding detection  
- **Anti-Spoofing**: Smiling detection
- **Anti-Spoofing**: Blinking detection
- **Live Verification**: Real-time validation

## 📊 Feature Requirements

### **1. Multi-Permission Login**
- Role-based authentication
- Persistent sessions (until cache cleared)
- Permission-based page access
- Dynamic menu based on user roles

### **2. Employee Management (CRUD)**
- Create, Read, Update, Delete employees
- Employee type classification
- Profile management
- Face recognition enrollment

### **3. Period Management**
- Define class periods (e.g., 1st period: 08:00-09:00)
- Break time management
- Academic calendar integration

### **4. Teacher Schedule Management**
- Individual teacher schedules
- Subject assignments
- Classroom assignments
- Flexible vs Fixed schedules

### **5. School Schedule Management**
- Academic calendar
- Holiday management
- Special events
- Schedule exceptions

### **6. Leave/Permit Submissions**
- Leave request workflow
- Approval process
- Leave balance tracking
- Calendar integration

### **7. Payroll Settings**
- Hourly rate configuration
- Full-time salary settings
- Overtime calculations
- Deduction management

### **8. Payroll Export**
- Monthly payroll reports per employee
- Excel/PDF export capabilities
- Detailed breakdown reports
- Tax calculations

### **9. Data Tables with Server-Side Rendering**
- Yajra DataTables integration
- Real-time data loading
- Advanced filtering
- Export capabilities

### **10. AJAX Operations**
- RESTful API endpoints
- Real-time updates
- Form submissions
- Data validation

### **11. Spatie Permission Integration**
- Role-based access control
- Resource-based permissions
- Dynamic permission assignment
- Permission inheritance

### **12. Page-Level Access Control**
- Route-level permission checking
- Action-level authorization
- Dynamic UI based on permissions
- Permission management interface

### **13. Attendance Radius Settings**
- GPS coordinate configuration
- Radius boundary settings
- Location validation
- Map integration

### **14. Persistent Login Sessions**
- Remember me functionality
- Session management
- Auto-logout prevention
- Cache-based session storage

### **15. Tabler.io Compliance**
- 100% Tabler.io design system
- Official component usage
- Responsive design
- Dark mode support

## 🏗️ System Architecture

### **Frontend Architecture**
```
src/
├── components/
│   ├── layout/          # Tabler.io layouts
│   ├── common/          # Reusable components
│   ├── forms/           # Form components
│   └── modules/         # Feature-specific components
├── pages/
│   ├── auth/            # Authentication pages
│   ├── employees/       # Employee management
│   ├── attendance/      # Attendance system
│   ├── schedules/       # Schedule management
│   ├── payroll/         # Payroll system
│   ├── leaves/          # Leave management
│   ├── reports/         # Analytics & reports
│   └── settings/        # System configuration
├── stores/              # Pinia state management
├── services/            # API services
├── composables/         # Vue composables
└── utils/               # Utility functions
```

### **Backend Architecture** (Planned)
```
app/
├── Models/
│   ├── User.php
│   ├── Employee.php
│   ├── Attendance.php
│   ├── Schedule.php
│   └── Payroll.php
├── Http/
│   ├── Controllers/
│   ├── Middleware/
│   └── Requests/
├── Services/
│   ├── AttendanceService.php
│   ├── FaceRecognitionService.php
│   └── PayrollService.php
└── Repositories/
```

## 🎯 User Stories

### **Admin User Stories**
- As an admin, I can manage employee records and assign roles
- As an admin, I can configure attendance radius and periods
- As an admin, I can generate payroll reports and export data
- As an admin, I can approve/reject leave requests

### **Teacher User Stories**
- As a teacher, I can clock in/out using face recognition
- As a teacher, I can view my schedule and attendance history
- As a teacher, I can submit leave requests
- As a teacher, I can view my payroll information

### **Honorary Teacher User Stories**
- As an honorary teacher, I have flexible working hours
- As an honorary teacher, I'm only paid for actual teaching time
- As an honorary teacher, I can see my variable schedule

## 🔄 Development Phases

### **Phase 1: Foundation (Current)**
- ✅ Frontend structure with Tabler.io
- ✅ Routing and navigation
- ✅ Component architecture
- ✅ State management setup

### **Phase 2: Backend Integration**
- [ ] Laravel 12 API development
- [ ] Database schema design
- [ ] Authentication system
- [ ] Basic CRUD operations

### **Phase 3: Advanced Features**
- [ ] Face recognition implementation
- [ ] Flexible scheduling logic
- [ ] Advanced payroll calculations
- [ ] GPS radius validation

### **Phase 4: Production**
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Testing & QA
- [ ] Deployment automation

## 🚀 Success Metrics

- **Attendance Accuracy**: 99%+ face recognition success rate
- **Performance**: <2s page load times
- **Usability**: 95%+ user satisfaction
- **Reliability**: 99.9% system uptime
- **Security**: Zero data breaches

## 📝 Notes for Development Team

1. **Face Recognition Priority**: Implement robust anti-spoofing measures
2. **Flexible Scheduling**: Core differentiator - pay careful attention to logic
3. **Mobile Responsive**: Essential for on-site attendance
4. **Offline Capability**: Consider offline attendance for poor connectivity
5. **Performance**: Optimize for schools with 500+ employees

This system is designed to be the definitive solution for school attendance management with uncompromising attention to scheduling flexibility and security.