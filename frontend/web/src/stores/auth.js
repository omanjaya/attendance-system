import { defineStore } from 'pinia'
import api from '@/services/api'
import logger from '@/utils/logger'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: null,
    loading: false,
    initialized: false,
    loginAttempts: 0,
    lastLoginAttempt: null
  }),

  getters: {
    isAuthenticated: (state) => !!(state.user && state.token),
    
    userName: (state) => state.user?.name || 'Guest',
    
    userEmail: (state) => state.user?.email || '',
    
    userRoles: (state) => state.user?.roles || [],
    
    userPermissions: (state) => state.user?.permissions || [],
    
    hasRole: (state) => (role) => {
      return state.user?.roles?.some(r => r.name === role || r === role) || false
    },
    
    hasPermission: (state) => (permission) => {
      return state.user?.permissions?.some(p => p.name === permission || p === permission) || false
    },
    
    hasAnyRole: (state) => (roles) => {
      return roles.some(role => state.user?.roles?.some(r => r.name === role || r === role))
    },
    
    hasAnyPermission: (state) => (permissions) => {
      return permissions.some(permission => 
        state.user?.permissions?.some(p => p.name === permission || p === permission)
      )
    },
    
    canLoginAgain: (state) => {
      if (!state.lastLoginAttempt || state.loginAttempts === 0) return true
      const now = Date.now()
      const timeSinceLastAttempt = now - state.lastLoginAttempt
      const cooldownMs = Math.min(state.loginAttempts * 5000, 30000) // Max 30s cooldown
      return timeSinceLastAttempt > cooldownMs
    },
    
    userAvatar: (state) => state.user?.avatar || null,
    
    userInitials: (state) => {
      const name = state.user?.name || 'Guest'
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    }
  },

  actions: {
    async login(credentials) {
      
      // Check rate limiting
      if (!this.canLoginAgain) {
        const cooldownMs = Math.min(this.loginAttempts * 5000, 30000)
        const timeSinceLastAttempt = Date.now() - this.lastLoginAttempt
        const remainingTime = Math.max(0, Math.ceil((cooldownMs - timeSinceLastAttempt) / 1000))
        return { 
          success: false, 
          message: `Too many login attempts. Please wait ${remainingTime} seconds.`,
          rateLimited: true,
          remainingTime
        }
      }
      
      this.loading = true
      
      try {
        // Set attempt timestamp before actual login
        this.lastLoginAttempt = Date.now()
        
        // Login using the configured API instance
        const response = await api.post('/auth/login', credentials)
        
        if (response.data.success) {
          // Store user data and token from our backend API format
          this.user = response.data.data?.user
          this.token = response.data.data?.token
          
          
          // Reset login attempts on successful login
          this.loginAttempts = 0
          this.lastLoginAttempt = null
          
          // Persist to localStorage
          this.persistAuth()
          
          // Set up axios interceptor for future requests
          this.setAuthHeader()
          
          return { success: true, user: this.user }
        }
        
        // Increment login attempts on failure
        this.loginAttempts++
        return { success: false, message: response.data.message || 'Login failed', attempts: this.loginAttempts }
      } catch (error) {
        
        // Increment login attempts on failure
        this.loginAttempts++
        
        let message = 'Login failed. Please try again.'
        
        if (error.response?.status === 422) {
          // Validation errors
          const errors = error.response.data.errors
          if (errors) {
            message = Object.values(errors).flat().join(', ')
          } else {
            message = error.response.data.message || 'Invalid credentials'
          }
        } else if (error.response?.status === 401) {
          message = 'Invalid credentials. Please check your email and password.'
        } else if (error.response?.status >= 500) {
          message = 'Server error. Please try again later.'
        } else if (error.code === 'NETWORK_ERROR' || !error.response) {
          message = 'Network error. Please check your connection.'
        } else {
          message = error.response?.data?.message || message
        }
        
        return { success: false, message, attempts: this.loginAttempts }
      } finally {
        this.loading = false
      }
    },

    async fetchUser() {
      try {
        const response = await api.get('/auth/user')
        
        if (response.data.success) {
          this.user = response.data.data?.user
          this.persistAuth()
          return true
        }
        
        return false
      } catch (error) {
        
        // If it's a 401, the token is invalid
        if (error.response?.status === 401) {
          this.clearAuth()
        }
        
        return false
      }
    },

    async logout() {
      this.loading = true
      
      try {
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch (error) {
      } finally {
        this.clearAuth()
        this.loading = false
        
        // Navigate to login page
        window.location.href = '/auth/login'
      }
    },

    async initAuth() {
      if (this.initialized) return this.isAuthenticated
      
      this.loading = true
      
      try {
        // If no token was restored, mark as initialized and return false
        if (!this.token) {
          this.initialized = true
          return false
        }
        
        // If we have a token, verify it's still valid
        this.setAuthHeader()
        const success = await this.fetchUser()
        
        if (!success) {
          this.clearAuth()
        }
        
        this.initialized = true
        return success
      } catch (error) {
        this.clearAuth()
        this.initialized = true
        return false
      } finally {
        this.loading = false
      }
    },

    // New utility methods
    persistAuth() {
      if (this.token) {
        localStorage.setItem('auth_token', this.token)
      }
      if (this.user) {
        localStorage.setItem('user_data', JSON.stringify(this.user))
      }
    },

    restoreAuth() {
      const token = localStorage.getItem('auth_token')
      const userData = localStorage.getItem('user_data')
      
      if (token) {
        this.token = token
      }
      
      if (userData) {
        try {
          this.user = JSON.parse(userData)
        } catch (error) {
          localStorage.removeItem('user_data')
        }
      }
      
      // Reset rate limiting on page reload
      this.resetRateLimit()
    },

    clearAuth() {
      this.user = null
      this.token = null
      this.loginAttempts = 0
      this.lastLoginAttempt = null
      this.initialized = true // Mark as initialized when clearing
      
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      
      // Clear api header
      delete api.defaults.headers.common['Authorization']
    },

    resetRateLimit() {
      this.loginAttempts = 0
      this.lastLoginAttempt = null
    },

    setAuthHeader() {
      if (this.token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    },

    async refreshToken() {
      try {
        const response = await api.post('/auth/refresh')
        
        if (response.data.success) {
          this.token = response.data.token
          this.persistAuth()
          this.setAuthHeader()
          return true
        }
        
        return false
      } catch (error) {
        this.clearAuth()
        return false
      }
    },

    async updateProfile(profileData) {
      this.loading = true
      
      try {
        const response = await api.put('/auth/profile', profileData)
        
        if (response.data.success) {
          this.user = { ...this.user, ...response.data.user }
          this.persistAuth()
          return { success: true, user: this.user }
        }
        
        return { success: false, message: response.data.message || 'Update failed' }
      } catch (error) {
        const message = error.response?.data?.message || 'Profile update failed'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    },

    async changePassword(passwordData) {
      this.loading = true
      
      try {
        const response = await api.put('/auth/password', passwordData)
        
        if (response.data.success) {
          return { success: true, message: 'Password changed successfully' }
        }
        
        return { success: false, message: response.data.message || 'Password change failed' }
      } catch (error) {
        const message = error.response?.data?.message || 'Password change failed'
        return { success: false, message }
      } finally {
        this.loading = false
      }
    }
  }
})