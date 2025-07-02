/**
 * Alternative API configurations for testing
 * Used to isolate environment variable issues
 */

import axios from 'axios'

// Method 1: Direct hardcoded URL
export const apiDirect = axios.create({
  baseURL: 'http://localhost:8000/api', // Hardcoded for testing
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Method 2: Using window location
export const apiDynamic = axios.create({
  baseURL: `${window.location.protocol}//${window.location.hostname}:8000/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Method 3: Using localhost with different port logic
export const apiLocalhost = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  }
})

// Debug function to test all APIs
export const testAllApis = async () => {
  const apis = {
    apiDirect,
    apiDynamic,
    apiLocalhost
  }

  for (const [name, apiInstance] of Object.entries(apis)) {
    try {
      console.log(`🧪 Testing ${name} with baseURL: ${apiInstance.defaults.baseURL}`)
      const response = await apiInstance.post('/auth/login', {
        email: 'test@example.com',
        password: 'password'
      })
      console.log(`✅ ${name} SUCCESS:`, response.data)
    } catch (error) {
      console.error(`❌ ${name} FAILED:`, {
        status: error.response?.status,
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        fullURL: error.config?.baseURL + error.config?.url
      })
    }
  }
}
