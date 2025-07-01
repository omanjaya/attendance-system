import { computed, ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import { useNotifications } from '@/composables/useNotifications'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const { showNotification } = useNotifications()
  
  // Reactive refs for local state
  const isLoggingIn = ref(false)
  const isLoggingOut = ref(false)
  const loginError = ref('')
  const rememberMe = ref(false)

  // Computed properties from store
  const user = computed(() => authStore.user)
  const isAuthenticated = computed(() => authStore.isAuthenticated)
  const loading = computed(() => authStore.loading)
  const userRoles = computed(() => authStore.userRoles)
  const userPermissions = computed(() => authStore.userPermissions)
  const userName = computed(() => authStore.userName)
  const userEmail = computed(() => authStore.userEmail)
  const userAvatar = computed(() => authStore.userAvatar)
  const userInitials = computed(() => authStore.userInitials)
  const canLoginAgain = computed(() => authStore.canLoginAgain)

  // Authentication methods
  const login = async (credentials) => {
    isLoggingIn.value = true
    loginError.value = ''
    
    try {
      const result = await authStore.login({
        ...credentials,
        remember: rememberMe.value
      })
      
      if (result.success) {
        showNotification({
          type: 'success',
          title: 'Login Successful',
          message: `Welcome back, ${result.user.name}!`
        })
        
        // Redirect to intended route or dashboard
        const redirect = router.currentRoute.value.query.redirect || '/dashboard'
        router.push(redirect)
        
        return result
      } else {
        loginError.value = result.message
        
        if (result.rateLimited) {
          showNotification({
            type: 'warning',
            title: 'Rate Limited',
            message: result.message
          })
        } else {
          showNotification({
            type: 'error',
            title: 'Login Failed',
            message: result.message
          })
        }
        
        return result
      }
    } catch (error) {
      const message = 'An unexpected error occurred during login'
      loginError.value = message
      
      showNotification({
        type: 'error',
        title: 'Login Error',
        message
      })
      
      return { success: false, message }
    } finally {
      isLoggingIn.value = false
    }
  }

  const logout = async () => {
    isLoggingOut.value = true
    
    try {
      await authStore.logout()
      
      showNotification({
        type: 'info',
        title: 'Logged Out',
        message: 'You have been successfully logged out'
      })
    } catch (error) {
      console.error('Logout error:', error)
      
      showNotification({
        type: 'error',
        title: 'Logout Error',
        message: 'An error occurred during logout'
      })
    } finally {
      isLoggingOut.value = false
    }
  }

  const initializeAuth = async () => {
    try {
      return await authStore.initAuth()
    } catch (error) {
      console.error('Auth initialization error:', error)
      return false
    }
  }

  const refreshUser = async () => {
    try {
      return await authStore.fetchUser()
    } catch (error) {
      console.error('User refresh error:', error)
      return false
    }
  }

  const updateProfile = async (profileData) => {
    try {
      const result = await authStore.updateProfile(profileData)
      
      if (result.success) {
        showNotification({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your profile has been successfully updated'
        })
      } else {
        showNotification({
          type: 'error',
          title: 'Update Failed',
          message: result.message
        })
      }
      
      return result
    } catch (error) {
      const message = 'An error occurred while updating your profile'
      
      showNotification({
        type: 'error',
        title: 'Update Error',
        message
      })
      
      return { success: false, message }
    }
  }

  const changePassword = async (passwordData) => {
    try {
      const result = await authStore.changePassword(passwordData)
      
      if (result.success) {
        showNotification({
          type: 'success',
          title: 'Password Changed',
          message: result.message
        })
      } else {
        showNotification({
          type: 'error',
          title: 'Password Change Failed',
          message: result.message
        })
      }
      
      return result
    } catch (error) {
      const message = 'An error occurred while changing your password'
      
      showNotification({
        type: 'error',
        title: 'Password Change Error',
        message
      })
      
      return { success: false, message }
    }
  }

  // Permission checking utilities
  const hasRole = (role) => {
    return authStore.hasRole(role)
  }

  const hasPermission = (permission) => {
    return authStore.hasPermission(permission)
  }

  const hasAnyRole = (roles) => {
    return authStore.hasAnyRole(roles)
  }

  const hasAnyPermission = (permissions) => {
    return authStore.hasAnyPermission(permissions)
  }

  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push({
        path: '/auth/login',
        query: { redirect: router.currentRoute.value.fullPath }
      })
      return false
    }
    return true
  }

  const requireRole = (role) => {
    if (!requireAuth()) return false
    
    if (!hasRole(role)) {
      showNotification({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have the required permissions to access this resource'
      })
      router.push('/dashboard')
      return false
    }
    
    return true
  }

  const requirePermission = (permission) => {
    if (!requireAuth()) return false
    
    if (!hasPermission(permission)) {
      showNotification({
        type: 'error',
        title: 'Access Denied',
        message: 'You do not have the required permissions to perform this action'
      })
      return false
    }
    
    return true
  }

  // Reactive watchers
  watch(isAuthenticated, (newValue) => {
    if (!newValue && router.currentRoute.value.meta?.requiresAuth) {
      router.push('/auth/login')
    }
  })

  // Token refresh utilities
  const refreshToken = async () => {
    try {
      return await authStore.refreshToken()
    } catch (error) {
      console.error('Token refresh error:', error)
      return false
    }
  }

  const resetRateLimit = () => {
    authStore.resetRateLimit()
  }

  // Helper methods for UI components
  const getUserDisplayName = () => {
    return user.value?.name || user.value?.email || 'User'
  }

  const getUserAvatarUrl = () => {
    return userAvatar.value || null
  }

  const canPerformAction = (action) => {
    // You can define action-based permissions here
    const actionPermissions = {
      'create_employee': 'employees.create',
      'edit_employee': 'employees.edit',
      'delete_employee': 'employees.delete',
      'view_reports': 'reports.view',
      'manage_settings': 'settings.manage'
    }
    
    const permission = actionPermissions[action]
    return permission ? hasPermission(permission) : false
  }

  const isAdmin = computed(() => hasRole('admin'))
  const isManager = computed(() => hasAnyRole(['admin', 'manager']))
  const isEmployee = computed(() => hasRole('employee'))

  return {
    // State
    user,
    isAuthenticated,
    loading,
    isLoggingIn,
    isLoggingOut,
    loginError,
    rememberMe,
    canLoginAgain,
    
    // User data
    userName,
    userEmail,
    userRoles,
    userPermissions,
    userAvatar,
    userInitials,
    
    // Role helpers
    isAdmin,
    isManager,
    isEmployee,
    
    // Methods
    login,
    logout,
    initializeAuth,
    refreshUser,
    updateProfile,
    changePassword,
    refreshToken,
    resetRateLimit,
    
    // Permission methods
    hasRole,
    hasPermission,
    hasAnyRole,
    hasAnyPermission,
    requireAuth,
    requireRole,
    requirePermission,
    canPerformAction,
    
    // Utility methods
    getUserDisplayName,
    getUserAvatarUrl
  }
}

// Standalone utility functions that can be used without the composable
export const createAuthGuard = (requiredRole = null, requiredPermission = null) => {
  return async (to, from, next) => {
    const authStore = useAuthStore()
    
    // Initialize auth if not already done
    if (!authStore.initialized) {
      await authStore.initAuth()
    }
    
    // Check authentication
    if (!authStore.isAuthenticated) {
      next({
        path: '/auth/login',
        query: { redirect: to.fullPath }
      })
      return
    }
    
    // Check role
    if (requiredRole && !authStore.hasRole(requiredRole)) {
      next('/dashboard') // Redirect to dashboard if no permission
      return
    }
    
    // Check permission
    if (requiredPermission && !authStore.hasPermission(requiredPermission)) {
      next('/dashboard') // Redirect to dashboard if no permission
      return
    }
    
    next()
  }
}

export const createRoleChecker = (roles) => {
  return () => {
    const authStore = useAuthStore()
    return authStore.hasAnyRole(roles)
  }
}

export const createPermissionChecker = (permissions) => {
  return () => {
    const authStore = useAuthStore()
    return authStore.hasAnyPermission(permissions)
  }
}