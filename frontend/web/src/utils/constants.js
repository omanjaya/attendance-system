/**
 * Application Constants
 * Global constants used throughout the application
 */

// Employee Types
export const EMPLOYEE_TYPES = {
  TENAGA_KEPENDIDIKAN: 'tenaga_kependidikan',
  GURU_TETAP: 'guru_tetap',
  GURU_HONORER: 'guru_honorer',
  TENAGA_HONORER: 'tenaga_honorer'
}

export const EMPLOYEE_TYPE_LABELS = {
  [EMPLOYEE_TYPES.TENAGA_KEPENDIDIKAN]: 'Tenaga Kependidikan',
  [EMPLOYEE_TYPES.GURU_TETAP]: 'Guru Tetap',
  [EMPLOYEE_TYPES.GURU_HONORER]: 'Guru Honorer',
  [EMPLOYEE_TYPES.TENAGA_HONORER]: 'Tenaga Honorer'
}

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EARLY_LEAVE: 'early_leave',
  PARTIAL: 'partial'
}

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.EARLY_LEAVE]: 'Early Leave',
  [ATTENDANCE_STATUS.PARTIAL]: 'Partial'
}

// Leave Types
export const LEAVE_TYPES = {
  SICK: 'sick',
  PERSONAL: 'personal',
  VACATION: 'vacation',
  MATERNITY: 'maternity',
  EMERGENCY: 'emergency'
}

export const LEAVE_TYPE_LABELS = {
  [LEAVE_TYPES.SICK]: 'Sick Leave',
  [LEAVE_TYPES.PERSONAL]: 'Personal Leave',
  [LEAVE_TYPES.VACATION]: 'Vacation',
  [LEAVE_TYPES.MATERNITY]: 'Maternity Leave',
  [LEAVE_TYPES.EMERGENCY]: 'Emergency Leave'
}

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
}

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: '/auth',
  EMPLOYEES: '/employees',
  ATTENDANCE: '/attendance',
  SCHEDULES: '/schedules',
  PAYROLL: '/payroll',
  REPORTS: '/reports'
}

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM DD, YYYY',
  INPUT: 'YYYY-MM-DD',
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  TIME: 'HH:mm'
}

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
  MAX_PAGE_SIZE: 100
}

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: {
    IMAGES: ['image/jpeg', 'image/png', 'image/gif'],
    DOCUMENTS: ['application/pdf', 'application/vnd.ms-excel'],
    EXCEL: ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
  }
}

// UI Constants
export const UI = {
  SIDEBAR_WIDTH: 250,
  HEADER_HEIGHT: 60,
  MOBILE_BREAKPOINT: 768,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 5000
}

// Validation Rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[+]?[1-9]?[0-9]{7,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  EMPLOYEE_ID_REGEX: /^[A-Z]{2}\d{6}$/
}

// Theme Colors
export const COLORS = {
  PRIMARY: '#206bc4',
  SUCCESS: '#2fb344',
  WARNING: '#f76707',
  DANGER: '#d63384',
  INFO: '#4299e1',
  LIGHT: '#f8f9fa',
  DARK: '#354052'
}
