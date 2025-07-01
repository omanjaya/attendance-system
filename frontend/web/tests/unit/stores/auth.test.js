import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

describe('Auth Store', () => {
  let authStore

  beforeEach(() => {
    setActivePinia(createPinia())
    authStore = useAuthStore()
    vi.clearAllMocks()
    
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    }
  })

  describe('Initial State', () => {
    it('has correct initial state', () => {
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
      expect(authStore.loading).toBe(false)
      expect(authStore.initialized).toBe(false)
      expect(authStore.loginAttempts).toBe(0)
      expect(authStore.lastLoginAttempt).toBe(null)
    })
  })

  describe('Getters', () => {
    it('isAuthenticated returns false when no user or token', () => {
      expect(authStore.isAuthenticated).toBe(false)
    })

    it('isAuthenticated returns true when user and token exist', () => {
      authStore.user = { id: 1, name: 'John Doe' }
      authStore.token = 'mock-token'
      expect(authStore.isAuthenticated).toBe(true)
    })

    it('userName returns guest when no user', () => {
      expect(authStore.userName).toBe('Guest')
    })

    it('userName returns user name when user exists', () => {
      authStore.user = { name: 'John Doe' }
      expect(authStore.userName).toBe('John Doe')
    })

    it('hasRole checks user roles correctly', () => {
      authStore.user = {
        roles: [{ name: 'admin' }, { name: 'manager' }]
      }

      expect(authStore.hasRole('admin')).toBe(true)
      expect(authStore.hasRole('employee')).toBe(false)
    })

    it('hasPermission checks user permissions correctly', () => {
      authStore.user = {
        permissions: [{ name: 'users.create' }, { name: 'users.edit' }]
      }

      expect(authStore.hasPermission('users.create')).toBe(true)
      expect(authStore.hasPermission('users.delete')).toBe(false)
    })

    it('hasAnyRole checks multiple roles correctly', () => {
      authStore.user = {
        roles: [{ name: 'admin' }]
      }

      expect(authStore.hasAnyRole(['admin', 'manager'])).toBe(true)
      expect(authStore.hasAnyRole(['employee', 'guest'])).toBe(false)
    })

    it('canLoginAgain returns true initially', () => {
      expect(authStore.canLoginAgain).toBe(true)
    })

    it('canLoginAgain returns false during cooldown', () => {
      authStore.loginAttempts = 3
      authStore.lastLoginAttempt = Date.now()
      expect(authStore.canLoginAgain).toBe(false)
    })

    it('userInitials returns correct initials', () => {
      authStore.user = { name: 'John Doe Smith' }
      expect(authStore.userInitials).toBe('JD')
    })
  })

  describe('Login', () => {
    it('handles successful login', async () => {
      const mockResponse = {
        data: {
          success: true,
          data: {
            user: { id: 1, name: 'John Doe' },
            token: 'mock-token'
          }
        }
      }

      mockedAxios.get.mockResolvedValueOnce({}) // CSRF cookie
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await authStore.login({
        email: 'john@example.com',
        password: 'password'
      })

      expect(mockedAxios.get).toHaveBeenCalledWith('/sanctum/csrf-cookie')
      expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/auth/login', {
        email: 'john@example.com',
        password: 'password'
      })

      expect(result.success).toBe(true)
      expect(authStore.user).toEqual({ id: 1, name: 'John Doe' })
      expect(authStore.token).toBe('mock-token')
      expect(authStore.loginAttempts).toBe(0)
    })

    it('handles failed login', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Invalid credentials'
        }
      }

      mockedAxios.get.mockResolvedValueOnce({})
      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await authStore.login({
        email: 'john@example.com',
        password: 'wrong'
      })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Invalid credentials')
      expect(authStore.loginAttempts).toBe(1)
    })

    it('handles rate limiting', async () => {
      authStore.loginAttempts = 3
      authStore.lastLoginAttempt = Date.now()

      const result = await authStore.login({
        email: 'john@example.com',
        password: 'password'
      })

      expect(result.success).toBe(false)
      expect(result.rateLimited).toBe(true)
      expect(mockedAxios.post).not.toHaveBeenCalled()
    })

    it('handles login error', async () => {
      mockedAxios.get.mockResolvedValueOnce({})
      mockedAxios.post.mockRejectedValueOnce(new Error('Network error'))

      const result = await authStore.login({
        email: 'john@example.com',
        password: 'password'
      })

      expect(result.success).toBe(false)
      expect(authStore.loginAttempts).toBe(1)
    })
  })

  describe('Fetch User', () => {
    it('fetches user successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: { id: 1, name: 'John Doe' }
        }
      }

      mockedAxios.get.mockResolvedValueOnce(mockResponse)

      const result = await authStore.fetchUser()

      expect(mockedAxios.get).toHaveBeenCalledWith('/api/v1/auth/user')
      expect(result).toBe(true)
      expect(authStore.user).toEqual({ id: 1, name: 'John Doe' })
    })

    it('handles fetch user failure', async () => {
      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 401 }
      })

      const result = await authStore.fetchUser()

      expect(result).toBe(false)
    })

    it('clears auth on 401 error', async () => {
      authStore.user = { id: 1 }
      authStore.token = 'token'

      mockedAxios.get.mockRejectedValueOnce({
        response: { status: 401 }
      })

      await authStore.fetchUser()

      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
    })
  })

  describe('Logout', () => {
    it('handles successful logout', async () => {
      authStore.user = { id: 1, name: 'John Doe' }
      authStore.token = 'mock-token'

      mockedAxios.post.mockResolvedValueOnce({})

      await authStore.logout()

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/auth/logout')
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
    })

    it('clears auth even on logout error', async () => {
      authStore.user = { id: 1, name: 'John Doe' }
      authStore.token = 'mock-token'

      mockedAxios.post.mockRejectedValueOnce(new Error('Logout failed'))

      await authStore.logout()

      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
    })
  })

  describe('Initialize Auth', () => {
    it('initializes auth from localStorage', async () => {
      global.localStorage.getItem.mockImplementation((key) => {
        if (key === 'auth_token') return 'stored-token'
        if (key === 'user_data') return JSON.stringify({ id: 1, name: 'John Doe' })
        return null
      })

      mockedAxios.get.mockResolvedValueOnce({
        data: {
          success: true,
          user: { id: 1, name: 'John Doe' }
        }
      })

      const result = await authStore.initAuth()

      expect(authStore.token).toBe('stored-token')
      expect(authStore.user).toEqual({ id: 1, name: 'John Doe' })
      expect(result).toBe(true)
      expect(authStore.initialized).toBe(true)
    })

    it('clears invalid stored auth', async () => {
      global.localStorage.getItem.mockImplementation((key) => {
        if (key === 'auth_token') return 'invalid-token'
        if (key === 'user_data') return JSON.stringify({ id: 1, name: 'John Doe' })
        return null
      })

      mockedAxios.get.mockResolvedValueOnce({
        data: { success: false }
      })

      const result = await authStore.initAuth()

      expect(result).toBe(false)
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
    })

    it('returns early if already initialized', async () => {
      authStore.initialized = true
      authStore.user = { id: 1 }
      authStore.token = 'token'

      const result = await authStore.initAuth()

      expect(result).toBe(true)
      expect(mockedAxios.get).not.toHaveBeenCalled()
    })
  })

  describe('Utility Methods', () => {
    it('persists auth to localStorage', () => {
      authStore.token = 'test-token'
      authStore.user = { id: 1, name: 'John Doe' }

      authStore.persistAuth()

      expect(global.localStorage.setItem).toHaveBeenCalledWith('auth_token', 'test-token')
      expect(global.localStorage.setItem).toHaveBeenCalledWith('user_data', JSON.stringify({ id: 1, name: 'John Doe' }))
    })

    it('restores auth from localStorage', () => {
      global.localStorage.getItem.mockImplementation((key) => {
        if (key === 'auth_token') return 'stored-token'
        if (key === 'user_data') return JSON.stringify({ id: 1, name: 'John Doe' })
        return null
      })

      authStore.restoreAuth()

      expect(authStore.token).toBe('stored-token')
      expect(authStore.user).toEqual({ id: 1, name: 'John Doe' })
    })

    it('clears auth data', () => {
      authStore.user = { id: 1 }
      authStore.token = 'token'
      authStore.loginAttempts = 3

      authStore.clearAuth()

      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
      expect(authStore.loginAttempts).toBe(0)
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('auth_token')
      expect(global.localStorage.removeItem).toHaveBeenCalledWith('user_data')
    })

    it('sets auth header', () => {
      authStore.token = 'test-token'
      authStore.setAuthHeader()

      expect(axios.defaults.headers.common['Authorization']).toBe('Bearer test-token')
    })
  })

  describe('Profile Management', () => {
    it('updates profile successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          user: { id: 1, name: 'John Updated' }
        }
      }

      mockedAxios.put.mockResolvedValueOnce(mockResponse)

      const result = await authStore.updateProfile({ name: 'John Updated' })

      expect(mockedAxios.put).toHaveBeenCalledWith('/api/v1/auth/profile', { name: 'John Updated' })
      expect(result.success).toBe(true)
      expect(authStore.user).toEqual({ id: 1, name: 'John Updated' })
    })

    it('handles profile update failure', async () => {
      const mockResponse = {
        data: {
          success: false,
          message: 'Update failed'
        }
      }

      mockedAxios.put.mockResolvedValueOnce(mockResponse)

      const result = await authStore.updateProfile({ name: 'John Updated' })

      expect(result.success).toBe(false)
      expect(result.message).toBe('Update failed')
    })

    it('changes password successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          message: 'Password changed'
        }
      }

      mockedAxios.put.mockResolvedValueOnce(mockResponse)

      const result = await authStore.changePassword({
        current_password: 'old',
        new_password: 'new'
      })

      expect(mockedAxios.put).toHaveBeenCalledWith('/api/v1/auth/password', {
        current_password: 'old',
        new_password: 'new'
      })
      expect(result.success).toBe(true)
    })
  })

  describe('Token Refresh', () => {
    it('refreshes token successfully', async () => {
      const mockResponse = {
        data: {
          success: true,
          token: 'new-token'
        }
      }

      mockedAxios.post.mockResolvedValueOnce(mockResponse)

      const result = await authStore.refreshToken()

      expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/auth/refresh')
      expect(result).toBe(true)
      expect(authStore.token).toBe('new-token')
    })

    it('handles token refresh failure', async () => {
      mockedAxios.post.mockRejectedValueOnce(new Error('Refresh failed'))

      const result = await authStore.refreshToken()

      expect(result).toBe(false)
      expect(authStore.user).toBe(null)
      expect(authStore.token).toBe(null)
    })
  })
})