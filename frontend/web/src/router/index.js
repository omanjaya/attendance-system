import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { nextTick } from 'vue'

// Layouts
import AuthLayout from '@/layouts/AuthLayout.vue'
import TablerLayout from '@/layouts/TablerLayout.vue'

// Enhanced lazy loading with error handling and retry mechanism
const lazyLoad = (importFunc, componentName = 'Component') => {
  return () => {
    console.log(`🚀 Loading component: ${componentName}`)
    return importFunc()
      .then(module => {
        console.log(`✅ Component loaded successfully: ${componentName}`)
        return module
      })
      .catch(error => {
        console.error(`❌ Component loading failed: ${componentName}`, error)
        
        // Retry mechanism - try loading again after a short delay
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            console.log(`🔄 Retrying component load: ${componentName}`)
            importFunc()
              .then(resolve)
              .catch(retryError => {
                console.error(`❌ Component retry failed: ${componentName}`, retryError)
                // Return a fallback error component
                resolve({
                  default: {
                    template: `
                      <div class="card">
                        <div class="card-body text-center">
                          <div class="empty">
                            <div class="empty-img">
                              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-lg text-danger" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                                <path d="M12 9v2m0 4v.01"/>
                                <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"/>
                              </svg>
                            </div>
                            <p class="empty-title">Failed to load ${componentName}</p>
                            <p class="empty-subtitle text-muted">There was an error loading this page component.</p>
                            <div class="empty-action">
                              <button class="btn btn-primary" onclick="window.location.reload()">
                                Reload Page
                              </button>
                              <router-link to="/" class="btn btn-link">Go to Dashboard</router-link>
                            </div>
                          </div>
                        </div>
                      </div>
                    `
                  }
                })
              })
          }, 1000) // 1 second delay before retry
        })
      })
  }
}

// Mixed loading strategy - eager for critical, lazy for others
// Auth Pages (eager - critical)
import Login from '@/pages/auth/Login.vue'
import Register from '@/pages/auth/Register.vue'

// App Pages (eager - dashboard is critical)
import Dashboard from '@/pages/Dashboard.vue'

// Employee Management (enhanced lazy loading)
const EmployeeList = lazyLoad(() => import('@/pages/employees/EmployeeList.vue'), 'EmployeeList')
const EmployeeCreate = lazyLoad(() => import('@/pages/employees/EmployeeCreate.vue'), 'EmployeeCreate')
const EmployeeEdit = lazyLoad(() => import('@/pages/employees/EmployeeEdit.vue'), 'EmployeeEdit')
const EmployeeView = lazyLoad(() => import('@/pages/employees/EmployeeView.vue'), 'EmployeeView')

// Attendance Management (enhanced lazy loading)
const AttendanceList = lazyLoad(() => import('@/pages/attendance/AttendanceList.vue'), 'AttendanceList')
const AttendanceManage = lazyLoad(() => import('@/pages/attendance/AttendanceManage.vue'), 'AttendanceManage')
const AttendanceHistory = lazyLoad(() => import('@/pages/attendance/AttendanceHistory.vue'), 'AttendanceHistory')
const AttendanceCalendar = lazyLoad(() => import('@/pages/attendance/AttendanceCalendar.vue'), 'AttendanceCalendar')
const AttendanceKiosk = lazyLoad(() => import('@/pages/attendance/AttendanceKiosk.vue'), 'AttendanceKiosk')

// Schedule Management (enhanced lazy loading)
const ScheduleList = lazyLoad(() => import('@/pages/schedules/ScheduleList.vue'), 'ScheduleList')
const ScheduleCreate = lazyLoad(() => import('@/pages/schedules/ScheduleCreate.vue'), 'ScheduleCreate')
const ScheduleCalendar = lazyLoad(() => import('@/pages/schedules/ScheduleCalendar.vue'), 'ScheduleCalendar')

// Payroll Management (enhanced lazy loading)
const PayrollList = lazyLoad(() => import('@/pages/payroll/PayrollList.vue'), 'PayrollList')
const PayrollCreate = lazyLoad(() => import('@/pages/payroll/PayrollCreate.vue'), 'PayrollCreate')
const PayrollSummary = lazyLoad(() => import('@/pages/payroll/PayrollSummary.vue'), 'PayrollSummary')

// Leave Management (enhanced lazy loading)
const LeaveList = lazyLoad(() => import('@/pages/leaves/LeaveList.vue'), 'LeaveList')
const LeaveCreate = lazyLoad(() => import('@/pages/leaves/LeaveCreate.vue'), 'LeaveCreate')
const LeaveManage = lazyLoad(() => import('@/pages/leaves/LeaveManage.vue'), 'LeaveManage')
const LeaveCalendar = lazyLoad(() => import('@/pages/leaves/LeaveCalendar.vue'), 'LeaveCalendar')

// Face Recognition (enhanced lazy loading)
const FaceRecognitionSetup = lazyLoad(() => import('@/pages/face-recognition/FaceRecognitionSetup.vue'), 'FaceRecognitionSetup')
const FaceRecognitionManage = lazyLoad(() => import('@/pages/face-recognition/FaceRecognitionManage.vue'), 'FaceRecognitionManage')

// Reports (enhanced lazy loading)
const ReportsDashboard = lazyLoad(() => import('@/pages/reports/ReportsDashboard.vue'), 'ReportsDashboard')
const AttendanceReports = lazyLoad(() => import('@/pages/reports/AttendanceReports.vue'), 'AttendanceReports')
const PayrollReports = lazyLoad(() => import('@/pages/reports/PayrollReports.vue'), 'PayrollReports')
const LeaveReports = lazyLoad(() => import('@/pages/reports/LeaveReports.vue'), 'LeaveReports')

// Settings (enhanced lazy loading)
const SettingsGeneral = lazyLoad(() => import('@/pages/settings/SettingsGeneral.vue'), 'SettingsGeneral')
const SettingsAttendance = lazyLoad(() => import('@/pages/settings/SettingsAttendance.vue'), 'SettingsAttendance')
const SettingsLeave = lazyLoad(() => import('@/pages/settings/SettingsLeave.vue'), 'SettingsLeave')

// Other Pages (enhanced lazy loading)
const Profile = lazyLoad(() => import('@/pages/auth/Profile.vue'), 'Profile')
const SchoolCalendar = lazyLoad(() => import('@/pages/calendar/SchoolCalendar.vue'), 'SchoolCalendar')
const PeriodManagement = lazyLoad(() => import('@/pages/periods/PeriodManagement.vue'), 'PeriodManagement')

// Notifications (enhanced lazy loading)
const NotificationsPage = lazyLoad(() => import('@/pages/notifications/NotificationsPage.vue'), 'NotificationsPage')

const routes = [
  // Auth Routes
  {
    path: '/auth',
    component: AuthLayout,
    redirect: '/auth/login',
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { guest: true, title: 'Login' }
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { guest: true, title: 'Register' }
      }
    ]
  },
  
  // App Routes
  {
    path: '/',
    component: TablerLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: { 
          title: 'Dashboard',
          subtitle: 'Overview',
          showHeader: false
        }
      },
      
      // Employee Management Routes
      {
        path: 'employees',
        name: 'employees',
        component: EmployeeList,
        meta: { 
          title: 'Employee Management',
          subtitle: 'Manage all employees',
          showHeader: true,
          breadcrumbs: [
            { label: 'Employee Management', icon: 'users' }
          ]
        }
      },
      {
        path: 'employees/create',
        name: 'employees.create',
        component: EmployeeCreate,
        meta: { 
          title: 'Add New Employee',
          subtitle: 'Employee Management',
          showHeader: true,
          breadcrumbs: [
            { label: 'Employee Management', icon: 'users', to: '/employees' },
            { label: 'Add New Employee', icon: 'plus' }
          ]
        }
      },
      {
        path: 'employees/:id/edit',
        name: 'employees.edit',
        component: EmployeeEdit,
        meta: { 
          title: 'Edit Employee',
          subtitle: 'Employee Management',
          showHeader: true,
          breadcrumbs: [
            { label: 'Employee Management', icon: 'users', to: '/employees' },
            { label: 'Edit Employee', icon: 'edit' }
          ]
        }
      },
      {
        path: 'employees/:id',
        name: 'employees.view',
        component: EmployeeView,
        meta: { 
          title: 'Employee Details',
          subtitle: 'Employee Management',
          showHeader: true,
          breadcrumbs: [
            { label: 'Employee Management', icon: 'users', to: '/employees' },
            { label: 'Employee Details', icon: 'user' }
          ]
        }
      },
      
      // Attendance Management Routes
      {
        path: 'attendance',
        name: 'attendance',
        component: AttendanceList,
        meta: { 
          title: 'Attendance Records',
          subtitle: 'Daily attendance tracking',
          showHeader: true,
          breadcrumbs: [
            { label: 'Attendance', icon: 'calendar-check' }
          ]
        }
      },
      {
        path: 'attendance/manage',
        name: 'attendance.manage',
        component: AttendanceManage,
        meta: { 
          title: 'Manage Attendance',
          subtitle: 'Check in/out and bulk operations',
          showHeader: true,
          breadcrumbs: [
            { label: 'Attendance', icon: 'calendar-check', to: '/attendance' },
            { label: 'Manage', icon: 'settings' }
          ]
        }
      },
      {
        path: 'attendance/history',
        name: 'attendance.history',
        component: AttendanceHistory,
        meta: { 
          title: 'Attendance History',
          subtitle: 'Historical attendance data',
          showHeader: true,
          breadcrumbs: [
            { label: 'Attendance', icon: 'calendar-check', to: '/attendance' },
            { label: 'History', icon: 'history' }
          ]
        }
      },
      {
        path: 'attendance/calendar',
        name: 'attendance.calendar',
        component: AttendanceCalendar,
        meta: { 
          title: 'Attendance Calendar',
          subtitle: 'Calendar view of attendance',
          showHeader: true,
          breadcrumbs: [
            { label: 'Attendance', icon: 'calendar-check', to: '/attendance' },
            { label: 'Calendar', icon: 'calendar' }
          ]
        }
      },
      {
        path: 'attendance/kiosk',
        name: 'attendance.kiosk',
        component: AttendanceKiosk,
        meta: { 
          title: 'Attendance Kiosk',
          subtitle: 'Self-service attendance terminal',
          showHeader: false
        }
      },
      
      // Schedule Management Routes
      {
        path: 'schedules',
        name: 'schedules',
        component: ScheduleList,
        meta: { 
          title: 'Work Schedules',
          subtitle: 'Employee work schedule management',
          showHeader: true,
          breadcrumbs: [
            { label: 'Schedules', icon: 'calendar-time' }
          ]
        }
      },
      {
        path: 'schedules/create',
        name: 'schedules.create',
        component: ScheduleCreate,
        meta: { 
          title: 'Create Schedule',
          subtitle: 'Schedule Management',
          showHeader: true,
          breadcrumbs: [
            { label: 'Schedules', icon: 'calendar-time', to: '/schedules' },
            { label: 'Create Schedule', icon: 'plus' }
          ]
        }
      },
      {
        path: 'schedules/calendar',
        name: 'schedules.calendar',
        component: ScheduleCalendar,
        meta: { 
          title: 'Schedule Calendar',
          subtitle: 'Calendar view of work schedules',
          showHeader: true,
          breadcrumbs: [
            { label: 'Schedules', icon: 'calendar-time', to: '/schedules' },
            { label: 'Calendar', icon: 'calendar' }
          ]
        }
      },
      
      // Payroll Management Routes
      {
        path: 'payroll',
        name: 'payroll',
        component: PayrollList,
        meta: { 
          title: 'Payroll Management',
          subtitle: 'Employee salary and payroll processing',
          showHeader: true,
          breadcrumbs: [
            { label: 'Payroll', icon: 'currency-dollar' }
          ]
        }
      },
      {
        path: 'payroll/create',
        name: 'payroll.create',
        component: PayrollCreate,
        meta: { 
          title: 'Process Payroll',
          subtitle: 'Payroll Management',
          showHeader: true,
          breadcrumbs: [
            { label: 'Payroll', icon: 'currency-dollar', to: '/payroll' },
            { label: 'Process Payroll', icon: 'plus' }
          ]
        }
      },
      {
        path: 'payroll/summary',
        name: 'payroll.summary',
        component: PayrollSummary,
        meta: { 
          title: 'Payroll Summary',
          subtitle: 'Overview of payroll data',
          showHeader: true,
          breadcrumbs: [
            { label: 'Payroll', icon: 'currency-dollar', to: '/payroll' },
            { label: 'Summary', icon: 'chart-bar' }
          ]
        }
      },
      
      // Leave Management Routes
      {
        path: 'leaves',
        name: 'leaves',
        component: LeaveList,
        meta: { 
          title: 'Leave Management',
          subtitle: 'Employee leave requests and approvals',
          showHeader: true,
          breadcrumbs: [
            { label: 'Leave Management', icon: 'calendar-x' }
          ]
        }
      },
      {
        path: 'leaves/create',
        name: 'leaves.create',
        component: LeaveCreate,
        meta: { 
          title: 'Request Leave',
          subtitle: 'Leave Management',
          showHeader: true,
          breadcrumbs: [
            { label: 'Leave Management', icon: 'calendar-x', to: '/leaves' },
            { label: 'Request Leave', icon: 'plus' }
          ]
        }
      },
      {
        path: 'leaves/manage',
        name: 'leaves.manage',
        component: LeaveManage,
        meta: { 
          title: 'Manage Leave Requests',
          subtitle: 'Approve or reject leave requests',
          showHeader: true,
          breadcrumbs: [
            { label: 'Leave Management', icon: 'calendar-x', to: '/leaves' },
            { label: 'Manage Requests', icon: 'settings' }
          ]
        }
      },
      {
        path: 'leaves/calendar',
        name: 'leaves.calendar',
        component: LeaveCalendar,
        meta: { 
          title: 'Leave Calendar',
          subtitle: 'Calendar view of leave requests',
          showHeader: true,
          breadcrumbs: [
            { label: 'Leave Management', icon: 'calendar-x', to: '/leaves' },
            { label: 'Calendar', icon: 'calendar' }
          ]
        }
      },
      
      // Face Recognition Routes
      {
        path: 'face-recognition/setup',
        name: 'face-recognition.setup',
        component: FaceRecognitionSetup,
        meta: { 
          title: 'Face Recognition Setup',
          subtitle: 'Configure facial recognition system',
          showHeader: true,
          breadcrumbs: [
            { label: 'Face Recognition', icon: 'face-id' },
            { label: 'Setup', icon: 'settings' }
          ]
        }
      },
      {
        path: 'face-recognition/manage',
        name: 'face-recognition.manage',
        component: FaceRecognitionManage,
        meta: { 
          title: 'Manage Face Recognition',
          subtitle: 'Manage employee facial recognition data',
          showHeader: true,
          breadcrumbs: [
            { label: 'Face Recognition', icon: 'face-id' },
            { label: 'Manage', icon: 'users' }
          ]
        }
      },
      
      // Reports Routes
      {
        path: 'reports',
        name: 'reports',
        component: ReportsDashboard,
        meta: { 
          title: 'Reports & Analytics',
          subtitle: 'Attendance and payroll reports',
          showHeader: true,
          breadcrumbs: [
            { label: 'Reports', icon: 'chart-bar' }
          ]
        }
      },
      {
        path: 'reports/attendance',
        name: 'reports.attendance',
        component: AttendanceReports,
        meta: { 
          title: 'Attendance Reports',
          subtitle: 'Detailed attendance analytics',
          showHeader: true,
          breadcrumbs: [
            { label: 'Reports', icon: 'chart-bar', to: '/reports' },
            { label: 'Attendance', icon: 'calendar-check' }
          ]
        }
      },
      {
        path: 'reports/payroll',
        name: 'reports.payroll',
        component: PayrollReports,
        meta: { 
          title: 'Payroll Reports',
          subtitle: 'Payroll and financial analytics',
          showHeader: true,
          breadcrumbs: [
            { label: 'Reports', icon: 'chart-bar', to: '/reports' },
            { label: 'Payroll', icon: 'currency-dollar' }
          ]
        }
      },
      {
        path: 'reports/leave',
        name: 'reports.leave',
        component: LeaveReports,
        meta: { 
          title: 'Leave Reports',
          subtitle: 'Leave usage and analytics',
          showHeader: true,
          breadcrumbs: [
            { label: 'Reports', icon: 'chart-bar', to: '/reports' },
            { label: 'Leave', icon: 'calendar-x' }
          ]
        }
      },
      
      // Settings Routes
      {
        path: 'settings',
        redirect: '/settings/general'
      },
      {
        path: 'settings/general',
        name: 'settings.general',
        component: SettingsGeneral,
        meta: { 
          title: 'General Settings',
          subtitle: 'System configuration and preferences',
          showHeader: true,
          breadcrumbs: [
            { label: 'Settings', icon: 'settings' },
            { label: 'General', icon: 'adjustments' }
          ]
        }
      },
      {
        path: 'settings/attendance',
        name: 'settings.attendance',
        component: SettingsAttendance,
        meta: { 
          title: 'Attendance Settings',
          subtitle: 'Attendance rules and policies',
          showHeader: true,
          breadcrumbs: [
            { label: 'Settings', icon: 'settings' },
            { label: 'Attendance', icon: 'clock' }
          ]
        }
      },
      {
        path: 'settings/leave',
        name: 'settings.leave',
        component: SettingsLeave,
        meta: { 
          title: 'Leave Settings',
          subtitle: 'Leave policies and configuration',
          showHeader: true,
          breadcrumbs: [
            { label: 'Settings', icon: 'settings' },
            { label: 'Leave', icon: 'calendar-x' }
          ]
        }
      },
      
      // Profile Route
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
        meta: { 
          title: 'Profile',
          subtitle: 'User profile and account settings',
          showHeader: true,
          breadcrumbs: [
            { label: 'Profile', icon: 'user' }
          ]
        }
      },
      
      // School Calendar Route
      {
        path: 'calendar',
        name: 'calendar',
        component: SchoolCalendar,
        meta: { 
          title: 'School Calendar',
          subtitle: 'Academic calendar and events',
          showHeader: true,
          breadcrumbs: [
            { label: 'Calendar', icon: 'calendar-event' }
          ]
        }
      },
      
      // Period Management Route
      {
        path: 'periods',
        name: 'periods',
        component: PeriodManagement,
        meta: { 
          title: 'Period Management',
          subtitle: 'Manage academic periods and terms',
          showHeader: true,
          breadcrumbs: [
            { label: 'Period Management', icon: 'calendar-time' }
          ]
        }
      },
      
      // Notifications Route
      {
        path: 'notifications',
        name: 'notifications',
        component: NotificationsPage,
        meta: { 
          title: 'Notifications',
          subtitle: 'Manage your notifications and preferences',
          showHeader: true,
          breadcrumbs: [
            { label: 'Notifications', icon: 'bell' }
          ]
        }
      }
    ]
  },
  
  // Catch all
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Enhanced Navigation Guard with preloading and error handling
router.beforeEach(async (to, from, next) => {
  console.log(`🧭 Navigation: ${from.path} → ${to.path}`)
  
  const authStore = useAuthStore()
  
  // Initialize auth properly if not already done
  if (!authStore.initialized) {
    try {
      console.log('🔑 Initializing authentication...')
      await authStore.initAuth()
    } catch (error) {
      console.error('❌ Auth initialization error:', error)
      authStore.clearAuth()
    }
  }
  
  const isAuthenticated = authStore.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const isGuest = to.matched.some(record => record.meta.guest)
  
  // Auth validation
  if (requiresAuth && !isAuthenticated) {
    console.log('🚫 Access denied - authentication required')
    next({
      path: '/auth/login',
      query: to.path !== '/' ? { redirect: to.fullPath } : {}
    })
    return
  } else if (isGuest && isAuthenticated) {
    console.log('👤 Already authenticated - redirecting')
    const redirect = to.query.redirect || '/'
    next(redirect)
    return
  }
  
  // Preload component if it's lazy loaded
  const targetRoute = to.matched[to.matched.length - 1]
  if (targetRoute && typeof targetRoute.components?.default === 'function') {
    try {
      console.log(`🚀 Preloading component for ${to.name}...`)
      await targetRoute.components.default()
      console.log(`✅ Component preloaded successfully: ${to.name}`)
    } catch (error) {
      console.error(`❌ Component preload failed for ${to.name}:`, error)
      // Continue navigation even if preload fails
    }
  }
  
  // All good - proceed with navigation
  console.log(`✅ Navigation approved: ${to.path}`)
  next()
})

// Enhanced after navigation hook
router.afterEach(async (to, from, failure) => {
  if (failure) {
    console.error('❌ Navigation failed:', failure)
    return
  }
  
  console.log(`🎯 Navigation completed: ${to.path}`)
  
  // Wait for DOM to be ready
  await nextTick()
  
  // Clear any focus to prevent blue border
  if (document.activeElement && document.activeElement !== document.body) {
    document.activeElement.blur()
  }
  
  // Update document title
  if (to.meta.title) {
    document.title = `${to.meta.title} - Attendance System`
  }
})

// Navigation error handling
router.onError((error) => {
  console.error('🚨 Router error:', error)
  
  // Try to recover from navigation errors
  if (error.message.includes('Loading chunk') || error.message.includes('Loading CSS chunk')) {
    console.log('🔄 Chunk loading error detected - attempting recovery...')
    // Reload the page to recover from chunk loading errors
    window.location.reload()
  } else {
    // For other errors, try to go to dashboard
    console.log('🏠 Navigating to dashboard due to error...')
    router.push('/').catch(() => {
      // If even dashboard navigation fails, force reload
      window.location.href = '/'
    })
  }
})

export default router