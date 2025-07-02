import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import axios from 'axios'

// Import console utilities for clean logging
import './utils/forceCacheBust.js'

// Import main App component
import App from './App.vue'

// Import global styles
import './assets/css/app.css'
import './assets/css/dark-mode.css'

// Configure Axios defaults
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'
axios.defaults.withCredentials = true
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
axios.defaults.headers.common['Accept'] = 'application/json'
axios.defaults.headers.common['Content-Type'] = 'application/json'

// Add request interceptor to handle CSRF token
axios.interceptors.request.use(
  config => {
    // Get XSRF token from cookie
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]

    if (token) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(token)
    }

    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      // Try to refresh token first
      try {
        // Import authStore reference from below
        const refreshed = await authStore.refreshToken()

        if (refreshed) {
          // Retry the original request with new token
          return axios(originalRequest)
        }
      } catch (refreshError) {
        console.warn('Token refresh failed:', refreshError)
      }

      // If refresh fails or no token, clear auth and redirect
      authStore.clearAuth()
      if (window.location.pathname !== '/auth/login') {
        window.location.href = '/auth/login'
      }
    } else if (error.response?.status === 419) {
      // Session expired - refresh page
      window.location.reload()
    }

    return Promise.reject(error)
  }
)

// Create Vue app
const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
app.use(pinia)

// Initialize auth state immediately if we have stored data
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()

// Restore auth state synchronously to prevent logout on reload
authStore.restoreAuth()

// Set auth header immediately if token exists
if (authStore.token) {
  authStore.setAuthHeader()
}

// Initialize notification service
import { notificationService } from './services/notificationService'
authStore.$subscribe((mutation, state) => {
  // Initialize notification service when user is authenticated
  if (state.user && state.token) {
    notificationService.init(state.user.id)
  } else {
    // Disconnect notification service when user logs out
    notificationService.disconnect()
  }
})

// Setup Router
app.use(router)

// Register global components
import ComponentsPlugin from './plugins/components'
app.use(ComponentsPlugin)

// Register Tabler Icons
import IconsPlugin from './plugins/icons'
app.use(IconsPlugin, {
  preloadCommonIcons: true,
  enableAliases: true,
  showWarnings: process.env.NODE_ENV === 'development'
})

// Global properties
app.config.globalProperties.$http = axios

// Global notification system
import { $notify } from './composables/useNotifications'
app.config.globalProperties.$notify = $notify

// Global loading system
import { loadingDirective } from './composables/useLoading'
app.directive('loading', loadingDirective)

// Global accessibility system
import { accessibilityDirective } from './composables/useAccessibility'
app.directive('a11y', accessibilityDirective)

// Global performance system
import { lazyDirective, performanceDirective } from './composables/usePerformance'
app.directive('performance', performanceDirective)
app.directive('lazy', lazyDirective)

// Initialize global keyboard shortcuts
import { useGlobalShortcuts } from './composables/useKeyboardShortcuts'
const { initializeGlobalShortcuts } = useGlobalShortcuts()
initializeGlobalShortcuts()

// Initialize global performance monitoring
import { usePerformance } from './composables/usePerformance'
const { init: initPerformance } = usePerformance()
initPerformance()

// Initialize enhanced monitoring systems
import PerformancePlugin from '@/plugins/performancePlugin'
import { featureFlags } from '@/utils/featureFlags'
import performanceMonitor from '@/utils/performanceMonitor'
import codeQualityMetrics from '@/utils/codeQualityMetrics'

// Install performance monitoring plugin
app.use(PerformancePlugin, {
  enableComponentTracking: true,
  enableRouteTracking: true,
  enableErrorTracking: true,
  enableUserInteractionTracking: true,
  sampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0
})

// Configure feature flags
if (authStore.user) {
  featureFlags.setUser(authStore.user.id, authStore.user.roles?.map(role => role.name) || [])
}

// Enhanced error handling
const originalErrorHandler = app.config.errorHandler
app.config.errorHandler = (error, vm, info) => {
  // Call original handler first
  if (originalErrorHandler) {
    originalErrorHandler(error, vm, info)
  }

  // Enhanced error tracking
  performanceMonitor.recordMetric('applicationError', {
    error: error.message,
    stack: error.stack,
    component: vm?.$options.name || 'Unknown',
    info,
    route: router.currentRoute.value.path,
    user: authStore.user?.id,
    timestamp: Date.now()
  })
}

// Expose monitoring tools in development
if (process.env.NODE_ENV === 'development') {
  window.performanceMonitor = performanceMonitor
  window.featureFlags = featureFlags
  window.codeQualityMetrics = codeQualityMetrics

  // Performance warnings
  const devObserver = new PerformanceObserver(list => {
    for (const entry of list.getEntries()) {
      if (entry.duration > 16.67) {
        console.warn('⚠️ Slow performance detected:', entry.name, `${entry.duration.toFixed(2)}ms`)
      }
    }
  })

  try {
    devObserver.observe({ entryTypes: ['measure'] })
  } catch (e) {
    console.warn('Performance observer not supported:', e)
  }
}

// Mount app
app.mount('#app')

// Get initial CSRF cookie
axios.get('/sanctum/csrf-cookie').catch(error => {
  console.warn('Failed to get CSRF cookie:', error)
})
