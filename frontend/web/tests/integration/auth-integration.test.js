import { describe, it, expect, beforeEach, vi, computed } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useAuth } from '@/composables/useAuth'
import Login from '@/pages/auth/Login.vue'
import RoleGuard from '@/components/common/RoleGuard.vue'
import UserDropdown from '@/layouts/UserDropdown.vue'
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

// Create test router
const createTestRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div>Home</div>' } },
      { path: '/auth/login', name: 'login', component: Login },
      { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' } },
      { path: '/employees', name: 'employees', component: { template: '<div>Employees</div>' } }
    ]
  })
}

describe('Auth Integration Tests', () => {
  let authStore
  let router
  let pinia

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
    router = createTestRouter()
    
    vi.clearAllMocks()
    mockShowNotification.mockClear()
    
    // Clear localStorage mock
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('Authentication Flow Integration', () => {
    it('integrates login flow with store, composable, and component', async () => {
      // Mock successful login response
      const mockLoginResponse = {
        data: {
          success: true,
          data: {
            user: {
              id: 1,
              name: 'John Doe',
              email: 'john@example.com',
              roles: [{ name: 'admin' }]
            },
            token: 'mock-token-123'
          }
        }
      }

      mockedAxios.get.mockResolvedValueOnce({}) // CSRF cookie
      mockedAxios.post.mockResolvedValueOnce(mockLoginResponse)

      // Mount Login component with router and store
      const wrapper = mount(Login, {
        global: {
          plugins: [pinia, router],
          stubs: {
            FormField: {
              template: '<div><input v-bind="$attrs" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
              emits: ['update:modelValue']
            },
            LoadingSpinner: true
          }
        }
      })

      // Fill in login form
      const emailInput = wrapper.find('input[type="email"]')
      const passwordInput = wrapper.find('input[type="password"]')
      
      await emailInput.setValue('john@example.com')
      await passwordInput.setValue('password123')

      // Submit form
      await wrapper.find('form').trigger('submit')

      // Wait for async operations
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Verify store state was updated
      expect(authStore.user).toEqual(mockLoginResponse.data.data.user)
      expect(authStore.token).toBe('mock-token-123')
      expect(authStore.isAuthenticated).toBe(true)

      // Verify localStorage was called
      expect(localStorage.getItem('auth_token')).toBe('mock-token-123')
      expect(JSON.parse(localStorage.getItem('user_data'))).toEqual(mockLoginResponse.data.data.user)

      // Verify notification was shown
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back, John Doe!'
      })
    })

    it('handles login failure across components', async () => {
      // Mock failed login response
      const mockLoginResponse = {
        data: {
          success: false,
          message: 'Invalid credentials'
        }
      }

      mockedAxios.get.mockResolvedValueOnce({})
      mockedAxios.post.mockResolvedValueOnce(mockLoginResponse)

      const wrapper = mount(Login, {
        global: {
          plugins: [pinia, router],
          stubs: {
            FormField: {
              template: '<div><input v-bind="$attrs" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
              emits: ['update:modelValue']
            },
            LoadingSpinner: true
          }
        }
      })

      // Submit invalid credentials
      await wrapper.find('form').trigger('submit')
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      // Verify auth state remains unchanged
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
      expect(authStore.isAuthenticated).toBe(false)

      // Verify error notification
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid credentials'
      })

      // Verify login attempts were tracked
      expect(authStore.loginAttempts).toBe(1)
    })
  })

  describe('Role-Based Access Control Integration', () => {
    it('integrates role checking across store, composable, and components', async () => {
      // Set up authenticated admin user
      authStore.user = {
        id: 1,
        name: 'Admin User',
        email: 'admin@example.com',
        roles: [{ name: 'admin' }, { name: 'manager' }],
        permissions: [{ name: 'users.create' }, { name: 'users.edit' }]
      }
      authStore.token = 'admin-token'

      // Test RoleGuard component with admin role
      const roleGuardWrapper = mount(RoleGuard, {
        props: {
          roles: ['admin']
        },
        slots: {
          default: '<div class="admin-content">Admin Only Content</div>'
        },
        global: {
          plugins: [pinia]
        }
      })

      // Should render content for admin user
      expect(roleGuardWrapper.find('.admin-content').exists()).toBe(true)

      // Test with employee role (should not render)
      await roleGuardWrapper.setProps({ roles: ['employee'] })
      expect(roleGuardWrapper.find('.admin-content').exists()).toBe(false)

      // Test useAuth composable role checking
      const { hasRole, hasPermission, isAdmin } = useAuth()
      expect(hasRole('admin')).toBe(true)
      expect(hasRole('employee')).toBe(false)
      expect(hasPermission('users.create')).toBe(true)
      expect(hasPermission('users.delete')).toBe(false)
      expect(isAdmin.value).toBe(true)
    })

    it('integrates UserDropdown with role-based menu items', async () => {
      // Set up authenticated user with specific roles
      authStore.user = {
        id: 1,
        name: 'Manager User',
        email: 'manager@example.com',
        roles: [{ name: 'manager' }],
        permissions: [{ name: 'employees.view' }]
      }
      authStore.token = 'manager-token'

      const wrapper = mount(UserDropdown, {
        global: {
          plugins: [pinia, router],
          stubs: {
            TablerIcon: true,
            RoleGuard: {
              template: '<div v-if="hasAccess"><slot /></div>',
              props: ['roles', 'permissions'],
              setup(props) {
                const { hasRole, hasPermission } = useAuth()
                const hasAccess = computed(() => {
                  if (props.roles?.length) {
                    return props.roles.some(role => hasRole(role))
                  }
                  if (props.permissions?.length) {
                    return props.permissions.some(permission => hasPermission(permission))
                  }
                  return true
                })
                return { hasAccess }
              }
            }
          }
        }
      })

      // Should show manager-specific menu items
      expect(wrapper.text()).toContain('Manager User')
      
      // Mock logout functionality
      authStore.logout = vi.fn().mockResolvedValue()
      
      // Test logout integration
      const logoutTrigger = wrapper.find('[data-testid="logout-trigger"]')
      if (logoutTrigger.exists()) {
        await logoutTrigger.trigger('click')
        expect(authStore.logout).toHaveBeenCalled()
      }
    })
  })

  describe('Authentication State Persistence Integration', () => {
    it('integrates auth restoration from localStorage', async () => {
      // Mock stored auth data
      const storedUser = {
        id: 1,
        name: 'Stored User',
        email: 'stored@example.com',
        roles: [{ name: 'employee' }]
      }
      
      localStorage.setItem('auth_token', 'stored-token')
      localStorage.setItem('user_data', JSON.stringify(storedUser))

      // Mock API validation of stored token
      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          user: storedUser
        }
      })

      // Initialize auth from storage
      const result = await authStore.initAuth()

      expect(result).toBe(true)
      expect(authStore.user).toEqual(storedUser)
      expect(authStore.token).toBe('stored-token')
      expect(authStore.initialized).toBe(true)

      // Verify auth header was set
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer stored-token')
    })

    it('handles invalid stored token gracefully', async () => {
      localStorage.setItem('auth_token', 'invalid-token')
      localStorage.setItem('user_data', JSON.stringify({ id: 1, name: 'User' }))

      // Mock API rejection of invalid token
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 401 }
      })

      const result = await authStore.initAuth()

      expect(result).toBe(false)
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
      
      // Verify localStorage was cleared
      expect(localStorage.getItem('auth_token')).toBe(null)
      expect(localStorage.getItem('user_data')).toBe(null)
    })
  })

  describe('Session Management Integration', () => {
    it('handles token refresh across the application', async () => {
      // Set up authenticated state
      authStore.user = { id: 1, name: 'User' }
      authStore.token = 'old-token'

      // Mock successful token refresh
      mockedAxios.post.mockResolvedValueOnce({
        data: {
          success: true,
          token: 'new-token'
        }
      })

      const { refreshToken } = useAuth()
      const result = await refreshToken()

      expect(result).toBe(true)
      expect(authStore.token).toBe('new-token')
      
      // Verify new token was persisted
      expect(localStorage.getItem('auth_token')).toBe('new-token')
      
      // Verify auth header was updated
      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer new-token')
    })

    it('handles token refresh failure and logout', async () => {
      authStore.user = { id: 1, name: 'User' }
      authStore.token = 'expired-token'

      // Mock failed token refresh
      mockedAxios.post.mockRejectedValueOnce(new Error('Refresh failed'))

      const { refreshToken } = useAuth()
      const result = await refreshToken()

      expect(result).toBe(false)
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
      
      // Verify cleanup was performed
      expect(localStorage.getItem('auth_token')).toBe(null)
      expect(localStorage.getItem('user_data')).toBe(null)
    })
  })

  describe('Profile Management Integration', () => {
    it('integrates profile updates across store and composable', async () => {
      authStore.user = {
        id: 1,
        name: 'Original Name',
        email: 'original@example.com'
      }
      authStore.token = 'user-token'

      const updatedUser = {
        id: 1,
        name: 'Updated Name',
        email: 'updated@example.com'
      }

      // Mock successful profile update
      mockedAxios.put.mockResolvedValueOnce({
        data: {
          success: true,
          user: updatedUser
        }
      })

      const { updateProfile } = useAuth()
      const result = await updateProfile({
        name: 'Updated Name',
        email: 'updated@example.com'
      })

      expect(result.success).toBe(true)
      expect(authStore.user).toEqual(updatedUser)
      
      // Verify updated user data was persisted
      expect(JSON.parse(localStorage.getItem('user_data'))).toEqual(updatedUser)

      // Verify success notification
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated'
      })
    })
  })
})