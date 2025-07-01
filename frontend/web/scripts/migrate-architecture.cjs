#!/usr/bin/env node

/**
 * Architecture Migration Script
 * Migrates existing frontend structure to new organized architecture
 */

const fs = require('fs')
const path = require('path')

class ArchitectureMigrator {
  constructor() {
    this.srcPath = path.join(__dirname, '../src')
    this.backupPath = path.join(__dirname, '../src-backup')
    this.migrations = []
    
    // New directory structure
    this.newStructure = {
      'components/common': 'Reusable UI components',
      'components/layout': 'Layout-specific components', 
      'components/modules/employee': 'Employee feature components',
      'components/modules/attendance': 'Attendance feature components',
      'components/modules/schedule': 'Schedule feature components',
      'components/modules/payroll': 'Payroll feature components',
      'components/modules/face-detection': 'Face detection components',
      'services': 'API service layer',
      'utils': 'Utility functions',
      'types': 'TypeScript definitions',
      'stores/modules': 'Feature-specific stores'
    }
  }

  async migrate() {
    console.log('🏗️ Starting Architecture Migration...\n')
    
    // Step 1: Create backup
    await this.createBackup()
    
    // Step 2: Create new directory structure
    await this.createNewStructure()
    
    // Step 3: Migrate components
    await this.migrateComponents()
    
    // Step 4: Create service layer
    await this.createServiceLayer()
    
    // Step 5: Update stores
    await this.enhanceStores()
    
    // Step 6: Create utilities
    await this.createUtilities()
    
    // Step 7: Update imports
    await this.updateImports()
    
    this.printMigrationSummary()
  }

  async createBackup() {
    console.log('💾 Creating backup...')
    
    if (!fs.existsSync(this.backupPath)) {
      fs.mkdirSync(this.backupPath, { recursive: true })
      this.copyDirectory(this.srcPath, this.backupPath)
      this.migrations.push('✅ Created backup at src-backup/')
    } else {
      this.migrations.push('⚠️ Backup already exists, skipping...')
    }
  }

  async createNewStructure() {
    console.log('📁 Creating new directory structure...')
    
    Object.keys(this.newStructure).forEach(dir => {
      const fullPath = path.join(this.srcPath, dir)
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true })
        
        // Create index.js for component directories
        if (dir.startsWith('components/')) {
          const indexPath = path.join(fullPath, 'index.js')
          fs.writeFileSync(indexPath, '// Component exports will be added here\\n')
        }
      }
    })
    
    this.migrations.push('✅ Created new directory structure')
  }

  async migrateComponents() {
    console.log('🔄 Migrating components...')
    
    // Migration mapping
    const componentMigrations = {
      'components/base': 'components/common',
      'components/ui': 'components/common',
      'components/charts': 'components/common',
      'components/layout': 'components/layout'
    }
    
    Object.entries(componentMigrations).forEach(([oldDir, newDir]) => {
      const oldPath = path.join(this.srcPath, oldDir)
      const newPath = path.join(this.srcPath, newDir)
      
      if (fs.existsSync(oldPath)) {
        const files = fs.readdirSync(oldPath)
        files.forEach(file => {
          if (file.endsWith('.vue') || file.endsWith('.js')) {
            const oldFilePath = path.join(oldPath, file)
            const newFilePath = path.join(newPath, file)
            
            // Copy file to new location
            fs.copyFileSync(oldFilePath, newFilePath)
          }
        })
      }
    })
    
    // Migrate page components to modules
    this.migratePageComponents()
    
    this.migrations.push('✅ Migrated components to new structure')
  }

  migratePageComponents() {
    const pagesPath = path.join(this.srcPath, 'pages')
    const moduleMap = {
      'employees': 'components/modules/employee',
      'attendance': 'components/modules/attendance', 
      'schedules': 'components/modules/schedule',
      'payroll': 'components/modules/payroll',
      'face-recognition': 'components/modules/face-detection'
    }
    
    Object.entries(moduleMap).forEach(([pageDir, moduleDir]) => {
      const pagePath = path.join(pagesPath, pageDir)
      const modulePath = path.join(this.srcPath, moduleDir)
      
      if (fs.existsSync(pagePath)) {
        const files = fs.readdirSync(pagePath)
        files.forEach(file => {
          if (file.endsWith('.vue')) {
            const oldFilePath = path.join(pagePath, file)
            const newFilePath = path.join(modulePath, file)
            
            // Copy component-specific parts to modules
            if (this.isComponentCandidate(file)) {
              fs.copyFileSync(oldFilePath, newFilePath)
            }
          }
        })
      }
    })
  }

  isComponentCandidate(filename) {
    // Components that should be in modules (not pages)
    const componentPatterns = [
      /Form\.vue$/,
      /Card\.vue$/,
      /Table\.vue$/,
      /Modal\.vue$/,
      /Widget\.vue$/
    ]
    
    return componentPatterns.some(pattern => pattern.test(filename))
  }

  async createServiceLayer() {
    console.log('🔧 Creating service layer...')
    
    const services = {
      'api.js': this.generateBaseApiService(),
      'authService.js': this.generateAuthService(),
      'employeeService.js': this.generateEmployeeService(),
      'attendanceService.js': this.generateAttendanceService(),
      'scheduleService.js': this.generateScheduleService(),
      'payrollService.js': this.generatePayrollService()
    }
    
    const servicesPath = path.join(this.srcPath, 'services')
    Object.entries(services).forEach(([filename, content]) => {
      const filePath = path.join(servicesPath, filename)
      fs.writeFileSync(filePath, content)
    })
    
    this.migrations.push('✅ Created service layer')
  }

  generateBaseApiService() {
    return `/**
 * Base API Service
 * Centralized HTTP client with interceptors and error handling
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Request interceptor for auth token
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = \`Bearer \${authStore.token}\`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { showError } = useNotifications()
    
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      showError('Session expired. Please login again.')
    } else if (error.response?.status === 403) {
      showError('Access denied. Insufficient permissions.')
    } else if (error.response?.status >= 500) {
      showError('Server error. Please try again later.')
    }
    
    return Promise.reject(error)
  }
)

// API utilities
export const apiUtils = {
  // GET request
  get: (url, config = {}) => api.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => api.delete(url, config),
  
  // File upload
  upload: (url, formData, config = {}) => {
    return api.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    })
  },
  
  // Download file
  download: (url, filename, config = {}) => {
    return api.get(url, {
      ...config,
      responseType: 'blob'
    }).then(response => {
      const blob = new Blob([response.data])
      const link = document.createElement('a')
      link.href = window.URL.createObjectURL(blob)
      link.download = filename
      link.click()
    })
  }
}

export default api
`
  }

  generateAuthService() {
    return `/**
 * Authentication Service
 * Handles user authentication and authorization
 */

import { apiUtils } from './api.js'

export const authService = {
  // Login user
  async login(credentials) {
    const response = await apiUtils.post('/auth/login', credentials)
    return response.data
  },
  
  // Logout user
  async logout() {
    const response = await apiUtils.post('/auth/logout')
    return response.data
  },
  
  // Register new user
  async register(userData) {
    const response = await apiUtils.post('/auth/register', userData)
    return response.data
  },
  
  // Get current user
  async getCurrentUser() {
    const response = await apiUtils.get('/auth/user')
    return response.data
  },
  
  // Update profile
  async updateProfile(profileData) {
    const response = await apiUtils.put('/auth/profile', profileData)
    return response.data
  },
  
  // Change password
  async changePassword(passwords) {
    const response = await apiUtils.put('/auth/password', passwords)
    return response.data
  },
  
  // Refresh token
  async refreshToken() {
    const response = await apiUtils.post('/auth/refresh')
    return response.data
  },
  
  // Verify email
  async verifyEmail(token) {
    const response = await apiUtils.post('/auth/verify-email', { token })
    return response.data
  },
  
  // Reset password request
  async requestPasswordReset(email) {
    const response = await apiUtils.post('/auth/password/reset', { email })
    return response.data
  },
  
  // Reset password
  async resetPassword(resetData) {
    const response = await apiUtils.post('/auth/password/update', resetData)
    return response.data
  }
}

export default authService
`
  }

  generateEmployeeService() {
    return `/**
 * Employee Service
 * Handles employee-related API operations
 */

import { apiUtils } from './api.js'

export const employeeService = {
  // Get all employees
  async getAll(params = {}) {
    const response = await apiUtils.get('/employees', { params })
    return response.data
  },
  
  // Get employee by ID
  async getById(id) {
    const response = await apiUtils.get(\`/employees/\${id}\`)
    return response.data
  },
  
  // Create new employee
  async create(employeeData) {
    const response = await apiUtils.post('/employees', employeeData)
    return response.data
  },
  
  // Update employee
  async update(id, employeeData) {
    const response = await apiUtils.put(\`/employees/\${id}\`, employeeData)
    return response.data
  },
  
  // Delete employee
  async delete(id) {
    const response = await apiUtils.delete(\`/employees/\${id}\`)
    return response.data
  },
  
  // Bulk operations
  async bulkUpdate(ids, updateData) {
    const response = await apiUtils.put('/employees/bulk', { ids, ...updateData })
    return response.data
  },
  
  async bulkDelete(ids) {
    const response = await apiUtils.delete('/employees/bulk', { data: { ids } })
    return response.data
  },
  
  // Employee types
  async getTypes() {
    const response = await apiUtils.get('/employees/types')
    return response.data
  },
  
  // Employee statistics
  async getStatistics() {
    const response = await apiUtils.get('/employees/statistics')
    return response.data
  },
  
  // Export employees
  async export(format = 'excel', filters = {}) {
    return apiUtils.download('/employees/export', \`employees.\${format}\`, {
      params: { format, ...filters }
    })
  },
  
  // Import employees
  async import(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiUtils.upload('/employees/import', formData)
    return response.data
  },
  
  // Upload employee photo
  async uploadPhoto(id, photo) {
    const formData = new FormData()
    formData.append('photo', photo)
    const response = await apiUtils.upload(\`/employees/\${id}/photo\`, formData)
    return response.data
  }
}

export default employeeService
`
  }

  generateAttendanceService() {
    return `/**
 * Attendance Service
 * Handles attendance-related API operations
 */

import { apiUtils } from './api.js'

export const attendanceService = {
  // Get attendance records
  async getRecords(params = {}) {
    const response = await apiUtils.get('/attendance', { params })
    return response.data
  },
  
  // Get attendance by employee
  async getByEmployee(employeeId, params = {}) {
    const response = await apiUtils.get(\`/attendance/employee/\${employeeId}\`, { params })
    return response.data
  },
  
  // Clock in
  async clockIn(data) {
    const response = await apiUtils.post('/attendance/clock-in', data)
    return response.data
  },
  
  // Clock out
  async clockOut(data) {
    const response = await apiUtils.post('/attendance/clock-out', data)
    return response.data
  },
  
  // Manual attendance entry
  async createRecord(attendanceData) {
    const response = await apiUtils.post('/attendance/manual', attendanceData)
    return response.data
  },
  
  // Update attendance record
  async updateRecord(id, attendanceData) {
    const response = await apiUtils.put(\`/attendance/\${id}\`, attendanceData)
    return response.data
  },
  
  // Delete attendance record
  async deleteRecord(id) {
    const response = await apiUtils.delete(\`/attendance/\${id}\`)
    return response.data
  },
  
  // Get attendance summary
  async getSummary(params = {}) {
    const response = await apiUtils.get('/attendance/summary', { params })
    return response.data
  },
  
  // Get attendance statistics
  async getStatistics(params = {}) {
    const response = await apiUtils.get('/attendance/statistics', { params })
    return response.data
  },
  
  // Export attendance data
  async export(format = 'excel', filters = {}) {
    return apiUtils.download('/attendance/export', \`attendance.\${format}\`, {
      params: { format, ...filters }
    })
  },
  
  // Get attendance settings
  async getSettings() {
    const response = await apiUtils.get('/attendance/settings')
    return response.data
  },
  
  // Update attendance settings
  async updateSettings(settings) {
    const response = await apiUtils.put('/attendance/settings', settings)
    return response.data
  }
}

export default attendanceService
`
  }

  generateScheduleService() {
    return `/**
 * Schedule Service
 * Handles schedule-related API operations
 */

import { apiUtils } from './api.js'

export const scheduleService = {
  // Get schedules
  async getAll(params = {}) {
    const response = await apiUtils.get('/schedules', { params })
    return response.data
  },
  
  // Get schedule by ID
  async getById(id) {
    const response = await apiUtils.get(\`/schedules/\${id}\`)
    return response.data
  },
  
  // Create schedule
  async create(scheduleData) {
    const response = await apiUtils.post('/schedules', scheduleData)
    return response.data
  },
  
  // Update schedule
  async update(id, scheduleData) {
    const response = await apiUtils.put(\`/schedules/\${id}\`, scheduleData)
    return response.data
  },
  
  // Delete schedule
  async delete(id) {
    const response = await apiUtils.delete(\`/schedules/\${id}\`)
    return response.data
  },
  
  // Get employee schedules
  async getByEmployee(employeeId, params = {}) {
    const response = await apiUtils.get(\`/schedules/employee/\${employeeId}\`, { params })
    return response.data
  },
  
  // Assign schedule to employee
  async assignToEmployee(scheduleId, employeeId) {
    const response = await apiUtils.post(\`/schedules/\${scheduleId}/assign\`, { employeeId })
    return response.data
  },
  
  // Bulk assign schedules
  async bulkAssign(scheduleId, employeeIds) {
    const response = await apiUtils.post(\`/schedules/\${scheduleId}/bulk-assign\`, { employeeIds })
    return response.data
  }
}

export default scheduleService
`
  }

  generatePayrollService() {
    return `/**
 * Payroll Service
 * Handles payroll-related API operations
 */

import { apiUtils } from './api.js'

export const payrollService = {
  // Get payroll records
  async getAll(params = {}) {
    const response = await apiUtils.get('/payroll', { params })
    return response.data
  },
  
  // Get payroll by ID
  async getById(id) {
    const response = await apiUtils.get(\`/payroll/\${id}\`)
    return response.data
  },
  
  // Calculate payroll
  async calculate(params) {
    const response = await apiUtils.post('/payroll/calculate', params)
    return response.data
  },
  
  // Generate payroll
  async generate(periodId) {
    const response = await apiUtils.post('/payroll/generate', { periodId })
    return response.data
  },
  
  // Approve payroll
  async approve(id) {
    const response = await apiUtils.put(\`/payroll/\${id}/approve\`)
    return response.data
  },
  
  // Export payroll
  async export(format = 'excel', filters = {}) {
    return apiUtils.download('/payroll/export', \`payroll.\${format}\`, {
      params: { format, ...filters }
    })
  }
}

export default payrollService
`
  }

  async enhanceStores() {
    console.log('🏪 Enhancing stores...')
    
    const stores = {
      'modules/employee.js': this.generateEmployeeStore(),
      'modules/attendance.js': this.generateAttendanceStore(),
      'modules/ui.js': this.generateUIStore()
    }
    
    const storesPath = path.join(this.srcPath, 'stores')
    Object.entries(stores).forEach(([filename, content]) => {
      const filePath = path.join(storesPath, filename)
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      fs.writeFileSync(filePath, content)
    })
    
    this.migrations.push('✅ Enhanced store structure')
  }

  generateEmployeeStore() {
    return `/**
 * Employee Store
 * Normalized state management for employees
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { employeeService } from '@/services/employeeService.js'

export const useEmployeeStore = defineStore('employee', () => {
  // State
  const entities = ref({})
  const ids = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({})
  const pagination = ref({
    page: 1,
    perPage: 10,
    total: 0
  })

  // Getters
  const all = computed(() => ids.value.map(id => entities.value[id]))
  const byId = computed(() => (id) => entities.value[id])
  const filtered = computed(() => {
    let employees = all.value
    
    // Apply filters
    if (filters.value.type) {
      employees = employees.filter(emp => emp.employee_type === filters.value.type)
    }
    if (filters.value.status !== undefined) {
      employees = employees.filter(emp => emp.is_active === filters.value.status)
    }
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      employees = employees.filter(emp => 
        emp.name.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.employee_id.toLowerCase().includes(search)
      )
    }
    
    return employees
  })

  const statistics = computed(() => {
    const stats = {
      total: all.value.length,
      active: 0,
      inactive: 0,
      byType: {}
    }
    
    all.value.forEach(employee => {
      if (employee.is_active) stats.active++
      else stats.inactive++
      
      const type = employee.employee_type
      stats.byType[type] = (stats.byType[type] || 0) + 1
    })
    
    return stats
  })

  // Actions
  const fetchAll = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await employeeService.getAll(params)
      
      // Normalize data
      const normalized = {}
      const newIds = []
      
      response.data.forEach(employee => {
        normalized[employee.id] = employee
        newIds.push(employee.id)
      })
      
      entities.value = normalized
      ids.value = newIds
      
      if (response.pagination) {
        pagination.value = response.pagination
      }
      
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id) => {
    if (entities.value[id]) {
      return entities.value[id]
    }
    
    loading.value = true
    try {
      const response = await employeeService.getById(id)
      entities.value[id] = response.data
      if (!ids.value.includes(id)) {
        ids.value.push(id)
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (employeeData) => {
    loading.value = true
    try {
      const response = await employeeService.create(employeeData)
      const employee = response.data
      
      entities.value[employee.id] = employee
      ids.value.push(employee.id)
      
      return employee
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id, employeeData) => {
    loading.value = true
    try {
      const response = await employeeService.update(id, employeeData)
      const employee = response.data
      
      entities.value[id] = employee
      
      return employee
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const remove = async (id) => {
    loading.value = true
    try {
      await employeeService.delete(id)
      
      delete entities.value[id]
      ids.value = ids.value.filter(existingId => existingId !== id)
      
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const reset = () => {
    entities.value = {}
    ids.value = []
    error.value = null
    filters.value = {}
    pagination.value = { page: 1, perPage: 10, total: 0 }
  }

  return {
    // State
    entities,
    ids,
    loading,
    error,
    filters,
    pagination,
    
    // Getters
    all,
    byId,
    filtered,
    statistics,
    
    // Actions
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    setFilters,
    clearFilters,
    reset
  }
})
`
  }

  generateAttendanceStore() {
    return `/**
 * Attendance Store
 * State management for attendance records
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { attendanceService } from '@/services/attendanceService.js'

export const useAttendanceStore = defineStore('attendance', () => {
  // State
  const records = ref({})
  const recordIds = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentRecord = ref(null)
  const settings = ref({})

  // Getters
  const allRecords = computed(() => recordIds.value.map(id => records.value[id]))
  const recordById = computed(() => (id) => records.value[id])
  const todayRecords = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return allRecords.value.filter(record => 
      record.date === today
    )
  })

  // Actions
  const fetchRecords = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await attendanceService.getRecords(params)
      
      // Normalize records
      const normalized = {}
      const newIds = []
      
      response.data.forEach(record => {
        normalized[record.id] = record
        newIds.push(record.id)
      })
      
      records.value = normalized
      recordIds.value = newIds
      
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clockIn = async (data) => {
    loading.value = true
    try {
      const response = await attendanceService.clockIn(data)
      const record = response.data
      
      records.value[record.id] = record
      if (!recordIds.value.includes(record.id)) {
        recordIds.value.push(record.id)
      }
      currentRecord.value = record
      
      return record
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clockOut = async (data) => {
    loading.value = true
    try {
      const response = await attendanceService.clockOut(data)
      const record = response.data
      
      records.value[record.id] = record
      currentRecord.value = record
      
      return record
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    records.value = {}
    recordIds.value = []
    error.value = null
    currentRecord.value = null
  }

  return {
    // State
    records,
    recordIds,
    loading,
    error,
    currentRecord,
    settings,
    
    // Getters
    allRecords,
    recordById,
    todayRecords,
    
    // Actions
    fetchRecords,
    clockIn,
    clockOut,
    reset
  }
})
`
  }

  generateUIStore() {
    return `/**
 * UI Store
 * Global UI state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarOpen = ref(true)
  const theme = ref('light')
  const loading = ref(false)
  const notifications = ref([])
  const modals = ref({})
  const breadcrumbs = ref([])

  // Getters
  const isDark = computed(() => theme.value === 'dark')
  const hasNotifications = computed(() => notifications.value.length > 0)
  const activeModals = computed(() => 
    Object.entries(modals.value).filter(([_, isOpen]) => isOpen)
  )

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setSidebarOpen = (open) => {
    sidebarOpen.value = open
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const addNotification = (notification) => {
    const id = Date.now()
    notifications.value.push({
      id,
      ...notification,
      timestamp: new Date()
    })
    return id
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const openModal = (modalId) => {
    modals.value[modalId] = true
  }

  const closeModal = (modalId) => {
    modals.value[modalId] = false
  }

  const setBreadcrumbs = (newBreadcrumbs) => {
    breadcrumbs.value = newBreadcrumbs
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  // Initialize theme from localStorage
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    }
  }

  return {
    // State
    sidebarOpen,
    theme,
    loading,
    notifications,
    modals,
    breadcrumbs,
    
    // Getters
    isDark,
    hasNotifications,
    activeModals,
    
    // Actions
    toggleSidebar,
    setSidebarOpen,
    toggleTheme,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    openModal,
    closeModal,
    setBreadcrumbs,
    setLoading,
    initializeTheme
  }
})
`
  }

  async createUtilities() {
    console.log('🛠️ Creating utilities...')
    
    const utilities = {
      'helpers.js': this.generateHelpers(),
      'constants.js': this.generateConstants(),
      'formatters.js': this.generateFormatters(),
      'validators.js': this.generateValidators()
    }
    
    const utilsPath = path.join(this.srcPath, 'utils')
    Object.entries(utilities).forEach(([filename, content]) => {
      const filePath = path.join(utilsPath, filename)
      fs.writeFileSync(filePath, content)
    })
    
    this.migrations.push('✅ Created utility functions')
  }

  generateHelpers() {
    return `/**
 * Helper Functions
 * Common utility functions used across the application
 */

// Deep clone an object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Sleep function
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

// Pick specific properties from object
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

// Omit specific properties from object
export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Convert string to kebab-case
export const kebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// Convert string to camelCase
export const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

// Array utilities
export const arrayUtils = {
  // Remove duplicates
  unique: (arr) => [...new Set(arr)],
  
  // Group array by key
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const value = item[key]
      groups[value] = groups[value] || []
      groups[value].push(item)
      return groups
    }, {})
  },
  
  // Sort array by multiple keys
  sortBy: (arr, ...keys) => {
    return arr.sort((a, b) => {
      for (const key of keys) {
        const aVal = a[key]
        const bVal = b[key]
        if (aVal < bVal) return -1
        if (aVal > bVal) return 1
      }
      return 0
    })
  },
  
  // Chunk array into smaller arrays
  chunk: (arr, size) => {
    const chunks = []
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size))
    }
    return chunks
  }
}

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}
`
  }

  generateConstants() {
    return `/**
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
  EMAIL_REGEX: /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/,
  PHONE_REGEX: /^[+]?[1-9]?[0-9]{7,15}$/,
  PASSWORD_MIN_LENGTH: 8,
  EMPLOYEE_ID_REGEX: /^[A-Z]{2}\\d{6}$/
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
`
  }

  generateFormatters() {
    return `/**
 * Formatter Functions
 * Data formatting utilities
 */

// Date formatters
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return ''
  
  const d = new Date(date)
  const options = {}
  
  switch (format) {
    case 'MMM DD, YYYY':
      options.year = 'numeric'
      options.month = 'short'
      options.day = '2-digit'
      break
    case 'DD/MM/YYYY':
      return d.toLocaleDateString('en-GB')
    case 'YYYY-MM-DD':
      return d.toISOString().split('T')[0]
    case 'relative':
      return formatRelativeTime(d)
    default:
      return d.toLocaleDateString()
  }
  
  return d.toLocaleDateString('en-US', options)
}

export const formatTime = (time, format24h = true) => {
  if (!time) return ''
  
  const d = new Date(\`1970-01-01T\${time}\`)
  return d.toLocaleTimeString('en-US', {
    hour12: !format24h,
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateTime = (datetime) => {
  if (!datetime) return ''
  
  const d = new Date(datetime)
  return \`\${formatDate(d)} \${formatTime(d.toTimeString().slice(0, 5))}\`
}

export const formatRelativeTime = (date) => {
  if (!date) return ''
  
  const now = new Date()
  const diffMs = now - new Date(date)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return \`\${diffMins} minute\${diffMins > 1 ? 's' : ''} ago\`
  if (diffHours < 24) return \`\${diffHours} hour\${diffHours > 1 ? 's' : ''} ago\`
  if (diffDays < 7) return \`\${diffDays} day\${diffDays > 1 ? 's' : ''} ago\`
  
  return formatDate(date)
}

// Number formatters
export const formatCurrency = (amount, currency = 'IDR') => {
  if (amount === null || amount === undefined) return ''
  
  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })
  
  return formatter.format(amount)
}

export const formatNumber = (number, options = {}) => {
  if (number === null || number === undefined) return ''
  
  const formatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  })
  
  return formatter.format(number)
}

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return ''
  
  return \`\${(value * 100).toFixed(decimals)}%\`
}

// Text formatters
export const formatName = (name) => {
  if (!name) return ''
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const formatInitials = (name) => {
  if (!name) return ''
  
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export const formatPhone = (phone) => {
  if (!phone) return ''
  
  // Remove all non-digit characters
  const cleaned = phone.replace(/\\D/g, '')
  
  // Format Indonesian phone number
  if (cleaned.startsWith('62')) {
    return \`+\${cleaned.slice(0, 2)} \${cleaned.slice(2, 5)} \${cleaned.slice(5, 9)} \${cleaned.slice(9)}\`
  } else if (cleaned.startsWith('0')) {
    return \`\${cleaned.slice(0, 4)} \${cleaned.slice(4, 8)} \${cleaned.slice(8)}\`
  }
  
  return phone
}

export const formatEmployeeId = (id) => {
  if (!id) return ''
  return id.toUpperCase()
}

// Duration formatters
export const formatDuration = (minutes) => {
  if (!minutes) return '0m'
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  
  if (hours === 0) return \`\${mins}m\`
  if (mins === 0) return \`\${hours}h\`
  return \`\${hours}h \${mins}m\`
}

export const formatWorkingHours = (startTime, endTime) => {
  if (!startTime || !endTime) return ''
  
  return \`\${formatTime(startTime)} - \${formatTime(endTime)}\`
}

// File size formatter
export const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  
  return \`\${(bytes / Math.pow(1024, i)).toFixed(1)} \${sizes[i]}\`
}

// Status formatters
export const formatStatus = (status) => {
  if (!status) return ''
  
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const formatBadgeClass = (status) => {
  const statusMap = {
    active: 'bg-success',
    inactive: 'bg-danger',
    pending: 'bg-warning',
    approved: 'bg-success',
    rejected: 'bg-danger',
    present: 'bg-success',
    absent: 'bg-danger',
    late: 'bg-warning'
  }
  
  return statusMap[status] || 'bg-secondary'
}
`
  }

  generateValidators() {
    return `/**
 * Validation Functions
 * Form validation utilities
 */

// Basic validators
export const required = (value) => {
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined && value !== ''
}

export const minLength = (min) => (value) => {
  return value && value.length >= min
}

export const maxLength = (max) => (value) => {
  return !value || value.length <= max
}

export const email = (value) => {
  if (!value) return true
  const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/
  return emailRegex.test(value)
}

export const phone = (value) => {
  if (!value) return true
  const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/
  return phoneRegex.test(value.replace(/\\s/g, ''))
}

export const numeric = (value) => {
  if (!value) return true
  return !isNaN(value) && !isNaN(parseFloat(value))
}

export const integer = (value) => {
  if (!value) return true
  return Number.isInteger(Number(value))
}

export const positive = (value) => {
  if (!value) return true
  return Number(value) > 0
}

export const min = (minValue) => (value) => {
  if (!value) return true
  return Number(value) >= minValue
}

export const max = (maxValue) => (value) => {
  if (!value) return true
  return Number(value) <= maxValue
}

export const between = (minValue, maxValue) => (value) => {
  if (!value) return true
  const num = Number(value)
  return num >= minValue && num <= maxValue
}

// Date validators
export const date = (value) => {
  if (!value) return true
  return !isNaN(Date.parse(value))
}

export const dateAfter = (afterDate) => (value) => {
  if (!value) return true
  return new Date(value) > new Date(afterDate)
}

export const dateBefore = (beforeDate) => (value) => {
  if (!value) return true
  return new Date(value) < new Date(beforeDate)
}

export const dateRange = (startDate, endDate) => (value) => {
  if (!value) return true
  const date = new Date(value)
  return date >= new Date(startDate) && date <= new Date(endDate)
}

// Custom validators
export const employeeId = (value) => {
  if (!value) return true
  const regex = /^[A-Z]{2}\\d{6}$/
  return regex.test(value)
}

export const password = (value) => {
  if (!value) return true
  
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const minLength = value.length >= 8
  const hasUpper = /[A-Z]/.test(value)
  const hasLower = /[a-z]/.test(value)
  const hasNumber = /\\d/.test(value)
  
  return minLength && hasUpper && hasLower && hasNumber
}

export const confirmPassword = (originalPassword) => (value) => {
  return value === originalPassword
}

export const fileSize = (maxSizeInBytes) => (file) => {
  if (!file) return true
  return file.size <= maxSizeInBytes
}

export const fileType = (allowedTypes) => (file) => {
  if (!file) return true
  return allowedTypes.includes(file.type)
}

// Validation utilities
export const createValidator = (rules) => {
  return (value) => {
    for (const rule of rules) {
      if (typeof rule === 'function') {
        if (!rule(value)) return false
      } else if (typeof rule === 'object' && rule.validator) {
        if (!rule.validator(value)) {
          return rule.message || false
        }
      }
    }
    return true
  }
}

export const validateForm = (formData, validationRules) => {
  const errors = {}
  
  Object.keys(validationRules).forEach(field => {
    const value = formData[field]
    const rules = validationRules[field]
    const result = createValidator(rules)(value)
    
    if (result !== true) {
      errors[field] = typeof result === 'string' ? result : \`\${field} is invalid\`
    }
  })
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Common validation rule sets
export const commonRules = {
  email: [required, email],
  password: [required, password],
  name: [required, minLength(2), maxLength(100)],
  phone: [phone],
  employeeId: [required, employeeId],
  salary: [required, numeric, positive],
  date: [required, date]
}

// Error messages
export const errorMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  employeeId: 'Employee ID must be in format: XX123456',
  numeric: 'This field must be a number',
  positive: 'This field must be a positive number',
  date: 'Please enter a valid date'
}
`
  }

  async updateImports() {
    console.log('🔗 Updating import paths...')
    
    // This would scan all files and update import paths
    // For now, we'll create a mapping file for reference
    const importMapping = `/**
 * Import Path Mapping
 * Reference for updating import paths after migration
 */

export const importMappings = {
  // Base components moved to common
  '@/components/base/BaseButton.vue': '@/components/common/BaseButton.vue',
  '@/components/base/BaseCard.vue': '@/components/common/BaseCard.vue',
  '@/components/base/BaseInput.vue': '@/components/common/BaseInput.vue',
  
  // UI components moved to common
  '@/components/ui/': '@/components/common/',
  
  // Charts moved to common
  '@/components/charts/': '@/components/common/',
  
  // New service imports
  '@/services/api.js': '@/services/api.js',
  '@/services/authService.js': '@/services/authService.js',
  '@/services/employeeService.js': '@/services/employeeService.js',
  
  // Store imports
  '@/stores/auth.js': '@/stores/auth.js',
  '@/stores/modules/employee.js': '@/stores/modules/employee.js',
  '@/stores/modules/attendance.js': '@/stores/modules/attendance.js',
  
  // Utility imports
  '@/utils/helpers.js': '@/utils/helpers.js',
  '@/utils/formatters.js': '@/utils/formatters.js',
  '@/utils/validators.js': '@/utils/validators.js'
}

// Commands to run for updating imports:
// find src -name "*.vue" -o -name "*.js" | xargs sed -i 's|@/components/base/|@/components/common/|g'
// find src -name "*.vue" -o -name "*.js" | xargs sed -i 's|@/components/ui/|@/components/common/|g'
// find src -name "*.vue" -o -name "*.js" | xargs sed -i 's|@/components/charts/|@/components/common/|g'
`
    
    const mappingPath = path.join(this.srcPath, 'import-mapping.js')
    fs.writeFileSync(mappingPath, importMapping)
    
    this.migrations.push('✅ Created import mapping reference')
  }

  copyDirectory(src, dest) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true })
    }
    
    const files = fs.readdirSync(src)
    files.forEach(file => {
      const srcPath = path.join(src, file)
      const destPath = path.join(dest, file)
      
      if (fs.statSync(srcPath).isDirectory()) {
        this.copyDirectory(srcPath, destPath)
      } else {
        fs.copyFileSync(srcPath, destPath)
      }
    })
  }

  printMigrationSummary() {
    console.log('\\n🎉 ARCHITECTURE MIGRATION COMPLETE!\\n')
    console.log('Migration Summary:')
    console.log('=' + '='.repeat(40))
    
    this.migrations.forEach((migration, index) => {
      console.log((index + 1) + '. ' + migration)
    })
    
    console.log('\\n📁 New Directory Structure:')
    console.log('-'.repeat(30))
    Object.entries(this.newStructure).forEach(([dir, description]) => {
      console.log(dir + ': ' + description)
    })
    
    console.log('\\n📋 Next Steps:')
    console.log('-'.repeat(20))
    console.log('1. Review migrated components')
    console.log('2. Update import paths in existing files')
    console.log('3. Test build: npm run build')
    console.log('4. Update component documentation')
    console.log('5. Run: npm run dev to test functionality')
    
    console.log('\\n⚠️ Important Notes:')
    console.log('-'.repeat(25))
    console.log('• Backup created at src-backup/')
    console.log('• Import paths need manual updating')
    console.log('• Test all functionality after migration')
    console.log('• Update documentation as needed')
  }
}

// Run migration
if (require.main === module) {
  const migrator = new ArchitectureMigrator()
  migrator.migrate().catch(console.error)
}

module.exports = ArchitectureMigrator