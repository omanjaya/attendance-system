import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuth } from '@/composables/useAuth'
import { useAuthStore } from '@/stores/auth'

// Mock the router
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

// Mock notifications
const mockShowNotification = vi.fn()
vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({
    showNotification: mockShowNotification
  })
}))

describe('useAuth', () => {
  let authStore

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    mockRouter.push.mockClear()
    mockShowNotification.mockClear()
  })

  describe('State Properties', () => {
    it('returns authentication state', () => {
      const { isAuthenticated, user, loading } = useAuth()

      expect(isAuthenticated.value).toBe(false)
      expect(user.value).toBe(null)
      expect(loading.value).toBe(false)
    })

    it('returns user data when authenticated', () => {
      authStore.user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        roles: [{ name: 'admin' }]
      }
      authStore.token = 'mock-token'

      const { isAuthenticated, userName, userEmail, userRoles } = useAuth()

      expect(isAuthenticated.value).toBe(true)
      expect(userName.value).toBe('John Doe')
      expect(userEmail.value).toBe('john@example.com')
      expect(userRoles.value).toEqual([{ name: 'admin' }])
    })
  })

  describe('Role Helpers', () => {
    beforeEach(() => {
      authStore.user = {
        id: 1,
        name: 'John Doe',
        roles: [{ name: 'admin' }, { name: 'manager' }],
        permissions: [{ name: 'users.create' }, { name: 'users.edit' }]
      }
      authStore.token = 'mock-token'
    })

    it('identifies admin users correctly', () => {
      const { isAdmin, isManager, isEmployee } = useAuth()

      expect(isAdmin.value).toBe(true)
      expect(isManager.value).toBe(true)
      expect(isEmployee.value).toBe(false)
    })

    it('checks roles correctly', () => {
      const { hasRole, hasAnyRole } = useAuth()

      expect(hasRole('admin')).toBe(true)
      expect(hasRole('employee')).toBe(false)
      expect(hasAnyRole(['admin', 'employee'])).toBe(true)
      expect(hasAnyRole(['employee', 'guest'])).toBe(false)
    })

    it('checks permissions correctly', () => {
      const { hasPermission, hasAnyPermission } = useAuth()

      expect(hasPermission('users.create')).toBe(true)
      expect(hasPermission('users.delete')).toBe(false)
      expect(hasAnyPermission(['users.create', 'users.delete'])).toBe(true)
      expect(hasAnyPermission(['users.delete', 'posts.create'])).toBe(false)
    })
  })

  describe('Login', () => {
    it('handles successful login', async () => {
      // Mock successful login
      authStore.login = vi.fn().mockResolvedValue({
        success: true,
        user: { id: 1, name: 'John Doe' }
      })

      const { login } = useAuth()
      const result = await login({ email: 'john@example.com', password: 'password' })

      expect(authStore.login).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'password',
        remember: false
      })
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back, John Doe!'
      })
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
      expect(result.success).toBe(true)
    })

    it('handles failed login', async () => {
      // Mock failed login
      authStore.login = vi.fn().mockResolvedValue({
        success: false,
        message: 'Invalid credentials'
      })

      const { login, loginError } = useAuth()
      const result = await login({ email: 'john@example.com', password: 'wrong' })

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid credentials'
      })
      expect(result.success).toBe(false)
    })

    it('handles rate limited login', async () => {
      // Mock rate limited login
      authStore.login = vi.fn().mockResolvedValue({
        success: false,
        message: 'Too many attempts',
        rateLimited: true
      })

      const { login } = useAuth()
      await login({ email: 'john@example.com', password: 'password' })

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'warning',
        title: 'Rate Limited',
        message: 'Too many attempts'
      })
    })

    it('handles login errors', async () => {
      // Mock login error
      authStore.login = vi.fn().mockRejectedValue(new Error('Network error'))

      const { login, loginError } = useAuth()
      const result = await login({ email: 'john@example.com', password: 'password' })

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Login Error',
        message: 'An unexpected error occurred during login'
      })
      expect(result.success).toBe(false)
    })
  })

  describe('Logout', () => {
    it('handles successful logout', async () => {
      authStore.logout = vi.fn().mockResolvedValue()

      const { logout } = useAuth()
      await logout()

      expect(authStore.logout).toHaveBeenCalled()
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out'
      })
    })

    it('handles logout errors', async () => {
      authStore.logout = vi.fn().mockRejectedValue(new Error('Logout failed'))

      const { logout } = useAuth()
      await logout()

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Logout Error',
        message: 'An error occurred during logout'
      })
    })
  })

  describe('Profile Management', () => {
    it('handles successful profile update', async () => {
      authStore.updateProfile = vi.fn().mockResolvedValue({
        success: true,
        user: { id: 1, name: 'John Updated' }
      })

      const { updateProfile } = useAuth()
      const result = await updateProfile({ name: 'John Updated' })

      expect(authStore.updateProfile).toHaveBeenCalledWith({ name: 'John Updated' })
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your profile has been successfully updated'
      })
      expect(result.success).toBe(true)
    })

    it('handles failed profile update', async () => {
      authStore.updateProfile = vi.fn().mockResolvedValue({
        success: false,
        message: 'Update failed'
      })

      const { updateProfile } = useAuth()
      const result = await updateProfile({ name: 'John Updated' })

      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Update Failed',
        message: 'Update failed'
      })
      expect(result.success).toBe(false)
    })

    it('handles successful password change', async () => {
      authStore.changePassword = vi.fn().mockResolvedValue({
        success: true,
        message: 'Password changed successfully'
      })

      const { changePassword } = useAuth()
      const result = await changePassword({ 
        current_password: 'old',
        new_password: 'new'
      })

      expect(authStore.changePassword).toHaveBeenCalledWith({
        current_password: 'old',
        new_password: 'new'
      })
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Password Changed',
        message: 'Password changed successfully'
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Permission Guards', () => {
    beforeEach(() => {
      authStore.user = {
        id: 1,
        name: 'John Doe',
        roles: [{ name: 'admin' }],
        permissions: [{ name: 'users.create' }]
      }
      authStore.token = 'mock-token'
    })

    it('requires authentication correctly', () => {
      const { requireAuth } = useAuth()
      const result = requireAuth()

      expect(result).toBe(true)
    })

    it('redirects to login when not authenticated', () => {
      authStore.user = null
      authStore.token = null

      const { requireAuth } = useAuth()
      const result = requireAuth()

      expect(result).toBe(false)
      expect(mockRouter.push).toHaveBeenCalledWith({
        path: '/auth/login',
        query: { redirect: '/dashboard' }
      })
    })

    it('requires role correctly', () => {
      const { requireRole } = useAuth()
      const result = requireRole('admin')

      expect(result).toBe(true)
    })

    it('denies access for missing role', () => {
      const { requireRole } = useAuth()
      const result = requireRole('super-admin')

      expect(result).toBe(false)
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have the required permissions to access this resource'
      })
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard')
    })

    it('requires permission correctly', () => {
      const { requirePermission } = useAuth()
      const result = requirePermission('users.create')

      expect(result).toBe(true)
    })

    it('denies access for missing permission', () => {
      const { requirePermission } = useAuth()
      const result = requirePermission('users.delete')

      expect(result).toBe(false)
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have the required permissions to perform this action'
      })
    })
  })

  describe('Action Permissions', () => {
    beforeEach(() => {
      authStore.user = {
        id: 1,
        name: 'John Doe',
        permissions: [{ name: 'employees.create' }]
      }
      authStore.token = 'mock-token'
    })

    it('checks action permissions correctly', () => {
      const { canPerformAction } = useAuth()

      expect(canPerformAction('create_employee')).toBe(true)
      expect(canPerformAction('delete_employee')).toBe(false)
    })
  })

  describe('Utility Methods', () => {
    beforeEach(() => {
      authStore.user = {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        avatar: 'avatar.jpg'
      }
      authStore.token = 'mock-token'
    })

    it('returns user display name', () => {
      const { getUserDisplayName } = useAuth()
      expect(getUserDisplayName()).toBe('John Doe')
    })

    it('returns user avatar URL', () => {
      const { getUserAvatarUrl } = useAuth()
      expect(getUserAvatarUrl()).toBe('avatar.jpg')
    })

    it('returns user initials when no avatar', () => {
      authStore.user.avatar = null
      const { userInitials } = useAuth()
      expect(userInitials.value).toBe('JD')
    })
  })

  describe('Refresh Operations', () => {
    it('refreshes user data', async () => {
      authStore.fetchUser = vi.fn().mockResolvedValue(true)

      const { refreshUser } = useAuth()
      const result = await refreshUser()

      expect(authStore.fetchUser).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('initializes authentication', async () => {
      authStore.initAuth = vi.fn().mockResolvedValue(true)

      const { initializeAuth } = useAuth()
      const result = await initializeAuth()

      expect(authStore.initAuth).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('refreshes token', async () => {
      authStore.refreshToken = vi.fn().mockResolvedValue(true)

      const { refreshToken } = useAuth()
      const result = await refreshToken()

      expect(authStore.refreshToken).toHaveBeenCalled()
      expect(result).toBe(true)
    })
  })
})