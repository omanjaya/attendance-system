/**
 * Lazy Route Definitions
 * All routes use dynamic imports for optimal code splitting
 */

export const lazyRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: {
      title: 'Dashboard',
      preload: true // Preload this critical route
    }
  },

  // Authentication routes
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/auth/Login.vue'),
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'Register',
        component: () => import('@/pages/auth/Register.vue'),
        meta: { title: 'Register' }
      }
    ]
  },

  // Employee management routes
  {
    path: '/employees',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'EmployeeList',
        component: () => import('@/pages/employees/EmployeeList.vue'),
        meta: { title: 'Employees' }
      },
      {
        path: 'create',
        name: 'EmployeeCreate',
        component: () => import('@/pages/employees/EmployeeCreate.vue'),
        meta: { title: 'Add Employee' }
      },
      {
        path: ':id',
        name: 'EmployeeView',
        component: () => import('@/pages/employees/EmployeeView.vue'),
        meta: { title: 'Employee Details' }
      },
      {
        path: ':id/edit',
        name: 'EmployeeEdit',
        component: () => import('@/pages/employees/EmployeeEdit.vue'),
        meta: { title: 'Edit Employee' }
      }
    ]
  },

  // Attendance routes
  {
    path: '/attendance',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AttendanceCalendar',
        component: () => import('@/pages/attendance/AttendanceCalendar.vue'),
        meta: { title: 'Attendance Calendar' }
      },
      {
        path: 'history',
        name: 'AttendanceHistory',
        component: () => import('@/pages/attendance/AttendanceHistory.vue'),
        meta: { title: 'Attendance History' }
      },
      {
        path: 'kiosk',
        name: 'AttendanceKiosk',
        component: () => import('@/pages/attendance/AttendanceKiosk.vue'),
        meta: {
          title: 'Attendance Kiosk',
          layout: 'KioskLayout'
        }
      }
    ]
  },

  // Reports routes (heavy components)
  {
    path: '/reports',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ReportsDashboard',
        component: () => import('@/pages/reports/ReportsDashboard.vue'),
        meta: { title: 'Reports' }
      },
      {
        path: 'attendance',
        name: 'AttendanceReports',
        component: () => import('@/pages/reports/AttendanceReports.vue'),
        meta: { title: 'Attendance Reports' }
      },
      {
        path: 'payroll',
        name: 'PayrollReports',
        component: () => import('@/pages/reports/PayrollReports.vue'),
        meta: { title: 'Payroll Reports' }
      }
    ]
  }
]

// Route preloading utility
export const preloadRoutes = (routes = []) => {
  routes.forEach(routeName => {
    const route = lazyRoutes.find(r => r.name === routeName)
    if (route && typeof route.component === 'function') {
      route.component()
    }
  })
}

// Critical routes that should be preloaded
export const criticalRoutes = ['Dashboard', 'Login', 'EmployeeList']
