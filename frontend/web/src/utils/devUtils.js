/**
 * Development Utilities
 * Helper functions for debugging and development
 */

import { useAuthStore } from '@/stores/auth'

export const devUtils = {
  // Reset authentication rate limiting
  resetRateLimit() {
    const authStore = useAuthStore()
    authStore.resetRateLimit()
    console.log('✅ Rate limiting has been reset')
  },

  // Clear all authentication data
  clearAuth() {
    const authStore = useAuthStore()
    authStore.clearAuth()
    console.log('✅ Authentication data cleared')
  },

  // Show current auth state
  showAuthState() {
    const authStore = useAuthStore()
    console.log('🔍 Current Auth State:', {
      isAuthenticated: authStore.isAuthenticated,
      user: authStore.user,
      token: authStore.token ? 'Present' : 'None',
      loginAttempts: authStore.loginAttempts,
      lastLoginAttempt: authStore.lastLoginAttempt,
      canLoginAgain: authStore.canLoginAgain,
      initialized: authStore.initialized
    })
  },

  // Test credentials for development
  getTestCredentials() {
    return {
      email: 'admin@example.com',
      password: 'password123'
    }
  },

  // Quick login with test credentials
  async quickLogin() {
    const authStore = useAuthStore()
    const { login } = useAuth()
    
    const credentials = this.getTestCredentials()
    console.log('🚀 Attempting quick login with test credentials...')
    
    try {
      const result = await login(credentials)
      if (result.success) {
        console.log('✅ Quick login successful!')
      } else {
        console.log('❌ Quick login failed:', result.message)
      }
      return result
    } catch (error) {
      console.error('❌ Quick login error:', error)
      return { success: false, message: error.message }
    }
  }
}

// Expose to window in development
if (process.env.NODE_ENV === 'development') {
  window.devUtils = devUtils
  console.log('🛠️ Development utilities available at window.devUtils')
  console.log('Available methods:')
  console.log('- devUtils.resetRateLimit() - Reset login rate limiting')
  console.log('- devUtils.clearAuth() - Clear authentication data')
  console.log('- devUtils.showAuthState() - Show current auth state')
  console.log('- devUtils.quickLogin() - Login with test credentials')
}

export default devUtils