/**
 * Base API Service
 * Centralized HTTP client with interceptors and error handling
 */

import axios from 'axios'
import { useAuthStore } from '@/stores/auth'
import { useNotifications } from '@/composables/useNotifications'
import logger from '@/utils/logger'

// Create axios instance
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api = axios.create({
  baseURL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Request interceptor for auth token, CSRF token, and logging
api.interceptors.request.use(
  (config) => {
    // Add CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1]
    
    if (csrfToken) {
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken)
    }

    // Add auth token
    const authStore = useAuthStore()
    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`
    }
    
    return config
  },
  (error) => {
    logger.error('Request interceptor error', { error })
    return Promise.reject(error)
  }
)

// Response interceptor for error handling and logging
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    
    const { showError } = useNotifications()
    
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      showError('Session expired. Please login again.')
      logger.warn('User logged out due to 401 response')
    } else if (error.response?.status === 403) {
      showError('Access denied. Insufficient permissions.')
      logger.warn('Access denied', { url: error.config?.url })
    } else if (error.response?.status >= 500) {
      // Don't show error for notification endpoints
      if (!error.config?.url?.includes('notification')) {
        showError('Server error. Please try again later.')
        logger.error('Server error', { 
          status: error.response?.status,
          url: error.config?.url,
          data: error.response?.data
        })
      }
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
