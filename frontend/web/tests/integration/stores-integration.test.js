import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useEmployeeStore } from '@/stores/employees'
import { useAuth } from '@/composables/useAuth'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

// Mock notifications
const mockShowNotification = vi.fn()
vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({
    showNotification: mockShowNotification
  })
}))

// Mock router
const mockRouter = {
  push: vi.fn(),
  currentRoute: {
    value: {
      fullPath: '/dashboard',
      query: {},
      meta: { requiresAuth: false }
    }
  }
}

vi.mock('vue-router', () => ({
  useRouter: () => mockRouter
}))

// Mock employee service
vi.mock('@/services/employeeService', () => ({
  employeeService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    bulkDelete: vi.fn(),
    export: vi.fn()
  }
}))

import { employeeService } from '@/services/employeeService'

describe('Store Integration Tests', () => {
  let authStore
  let employeeStore
  let pinia

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
    employeeStore = useEmployeeStore()
    
    vi.clearAllMocks()
    mockShowNotification.mockClear()
    localStorage.clear()
  })

  describe('Auth Store Integration', () => {
    it('integrates authentication with localStorage persistence', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        roles: [{ name: 'admin' }]
      }

      // Mock successful login
      mockedAxios.get.mockResolvedValueOnce({}) // CSRF cookie
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          success: true,
          data: {
            user: mockUser,
            token: 'test-token'
          }
        }
      })

      const result = await authStore.login({
        email: 'test@example.com',
        password: 'password'
      })

      expect(result.success).toBe(true)
      expect(authStore.user).toEqual(mockUser)
      expect(authStore.token).toBe('test-token')
      expect(localStorage.getItem('auth_token')).toBe('test-token')
      expect(JSON.parse(localStorage.getItem('user_data'))).toEqual(mockUser)
    })

    it('integrates logout with cleanup', async () => {
      // Set up authenticated state
      authStore.user = { id: 1, name: 'User' }
      authStore.token = 'token'
      localStorage.setItem('auth_token', 'token')
      localStorage.setItem('user_data', JSON.stringify({ id: 1, name: 'User' }))

      mockedAxios.post.mockResolvedValueOnce({})

      await authStore.logout()

      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
      expect(localStorage.getItem('auth_token')).toBe(null)
      expect(localStorage.getItem('user_data')).toBe(null)
    })
  })

  describe('Employee Store Integration', () => {
    it('integrates employee fetching with data normalization', async () => {
      const mockEmployees = [
        { id: 1, name: 'Employee 1', status: 'active' },
        { id: 2, name: 'Employee 2', status: 'inactive' }
      ]

      employeeService.getAll.mockResolvedValueOnce({
        data: mockEmployees,
        meta: { total: 2 }
      })

      await employeeStore.fetchEmployees()

      expect(employeeStore.employees).toEqual(mockEmployees)
      expect(employeeStore.total).toBe(2)
      expect(employeeStore.loading).toBe(false)
    })

    it('integrates employee creation with store updates', async () => {
      const newEmployee = {
        id: 3,
        name: 'New Employee',
        status: 'active'
      }

      employeeService.create.mockResolvedValueOnce({
        success: true,
        data: newEmployee
      })

      const result = await employeeStore.createEmployee({
        name: 'New Employee',
        status: 'active'
      })

      expect(result.success).toBe(true)
      expect(employeeStore.employees).toContain(newEmployee)
      expect(employeeStore.total).toBe(1)
    })

    it('integrates employee deletion with store cleanup', async () => {
      // Set up initial state
      employeeStore.employees = [
        { id: 1, name: 'Employee 1' },
        { id: 2, name: 'Employee 2' }
      ]
      employeeStore.total = 2

      employeeService.delete.mockResolvedValueOnce({ success: true })

      await employeeStore.deleteEmployee(1)

      expect(employeeStore.employees).toHaveLength(1)
      expect(employeeStore.employees[0].id).toBe(2)
      expect(employeeStore.total).toBe(1)
    })
  })

  describe('Auth and Employee Store Interaction', () => {
    it('integrates role-based access to employee operations', () => {
      // Set up authenticated admin user
      authStore.user = {
        id: 1,
        name: 'Admin User',
        roles: [{ name: 'admin' }],
        permissions: [{ name: 'employees.create' }, { name: 'employees.delete' }]
      }
      authStore.token = 'admin-token'

      const { hasPermission, hasRole } = useAuth()

      // Test role checking
      expect(hasRole('admin')).toBe(true)
      expect(hasRole('employee')).toBe(false)

      // Test permission checking
      expect(hasPermission('employees.create')).toBe(true)
      expect(hasPermission('employees.delete')).toBe(true)
      expect(hasPermission('employees.super_admin')).toBe(false)

      // Test combined permissions for employee operations
      const canCreateEmployee = hasPermission('employees.create')
      const canDeleteEmployee = hasPermission('employees.delete')

      expect(canCreateEmployee).toBe(true)
      expect(canDeleteEmployee).toBe(true)
    })

    it('integrates user context in employee operations', async () => {
      // Set up authenticated user
      authStore.user = {
        id: 1,
        name: 'Manager User',
        roles: [{ name: 'manager' }]
      }
      authStore.token = 'manager-token'

      // Set up employees including the authenticated user
      const employees = [
        { id: 1, name: 'Manager User', manager_id: null },
        { id: 2, name: 'Employee 1', manager_id: 1 },
        { id: 3, name: 'Employee 2', manager_id: 1 }
      ]

      employeeService.getAll.mockResolvedValueOnce({
        data: employees,
        meta: { total: 3 }
      })

      await employeeStore.fetchEmployees()

      // Test filtering by user context
      const managedEmployees = employeeStore.employees.filter(
        emp => emp.manager_id === authStore.user.id
      )

      expect(managedEmployees).toHaveLength(2)
      expect(managedEmployees.every(emp => emp.manager_id === 1)).toBe(true)
    })
  })

  describe('Error Handling Integration', () => {
    it('integrates error handling across auth and employee operations', async () => {
      // Test auth error handling
      mockedAxios.get.mockResolvedValueOnce({})
      mockedAxios.post.mockRejectedValueOnce(new Error('Login failed'))

      const loginResult = await authStore.login({
        email: 'test@example.com',
        password: 'wrong'
      })

      expect(loginResult.success).toBe(false)
      expect(authStore.loginAttempts).toBe(1)

      // Test employee error handling
      employeeService.getAll.mockRejectedValueOnce(new Error('Server error'))

      try {
        await employeeStore.fetchEmployees()
      } catch (error) {
        expect(error.message).toBe('Server error')
      }

      expect(employeeStore.loading).toBe(false)
      expect(employeeStore.employees).toHaveLength(0)
    })
  })

  describe('State Persistence Integration', () => {
    it('integrates state restoration across application restart', async () => {
      // Simulate stored auth state
      const storedUser = {
        id: 1,
        name: 'Stored User',
        roles: [{ name: 'employee' }]
      }

      localStorage.setItem('auth_token', 'stored-token')
      localStorage.setItem('user_data', JSON.stringify(storedUser))

      // Mock successful token validation
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          user: storedUser
        }
      })

      // Initialize auth from storage
      const initResult = await authStore.initAuth()

      expect(initResult).toBe(true)
      expect(authStore.user).toEqual(storedUser)
      expect(authStore.token).toBe('stored-token')
      expect(authStore.initialized).toBe(true)

      // Verify axios header was set
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer stored-token')
    })

    it('integrates state cleanup on authentication failure', async () => {
      // Set up invalid stored state
      localStorage.setItem('auth_token', 'invalid-token')
      localStorage.setItem('user_data', JSON.stringify({ id: 1, name: 'User' }))

      // Mock token validation failure
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 401 }
      })

      const initResult = await authStore.initAuth()

      expect(initResult).toBe(false)
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
      expect(localStorage.getItem('auth_token')).toBe(null)
      expect(localStorage.getItem('user_data')).toBe(null)
    })
  })

  describe('Reactive State Integration', () => {
    it('integrates reactive updates across multiple stores', async () => {
      // Set up auth state
      authStore.user = { id: 1, name: 'User' }
      authStore.token = 'token'

      // Set up employee state
      employeeStore.employees = [
        { id: 1, name: 'Employee 1', status: 'active' },
        { id: 2, name: 'Employee 2', status: 'inactive' }
      ]

      // Test computed properties that depend on both stores
      expect(authStore.isAuthenticated).toBe(true)
      expect(employeeStore.activeEmployees).toHaveLength(1)

      // Update employee status and verify reactivity
      employeeStore.employees[1].status = 'active'
      expect(employeeStore.activeEmployees).toHaveLength(2)

      // Clear auth and verify impact
      authStore.user = null
      authStore.token = null
      expect(authStore.isAuthenticated).toBe(false)
    })
  })
})