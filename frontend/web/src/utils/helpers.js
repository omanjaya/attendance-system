/**
 * Helper Functions
 * Common utility functions used across the application
 */

// Deep clone an object
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime())
  if (obj instanceof Array) return obj.map(item => deepClone(item))
  if (typeof obj === 'object') {
    const clonedObj = {}
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj
  }
}

// Debounce function
export const debounce = (func, wait, immediate = false) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      timeout = null
      if (!immediate) func(...args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func(...args)
  }
}

// Throttle function
export const throttle = (func, limit) => {
  let inThrottle
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// Generate unique ID
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Sleep function
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Check if object is empty
export const isEmpty = (obj) => {
  return Object.keys(obj).length === 0
}

// Pick specific properties from object
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (key in obj) {
      result[key] = obj[key]
    }
    return result
  }, {})
}

// Omit specific properties from object
export const omit = (obj, keys) => {
  const result = { ...obj }
  keys.forEach(key => delete result[key])
  return result
}

// Capitalize first letter
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

// Convert string to kebab-case
export const kebabCase = (str) => {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
}

// Convert string to camelCase
export const camelCase = (str) => {
  return str.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
}

// Array utilities
export const arrayUtils = {
  // Remove duplicates
  unique: (arr) => [...new Set(arr)],
  
  // Group array by key
  groupBy: (arr, key) => {
    return arr.reduce((groups, item) => {
      const value = item[key]
      groups[value] = groups[value] || []
      groups[value].push(item)
      return groups
    }, {})
  },
  
  // Sort array by multiple keys
  sortBy: (arr, ...keys) => {
    return arr.sort((a, b) => {
      for (const key of keys) {
        const aVal = a[key]
        const bVal = b[key]
        if (aVal < bVal) return -1
        if (aVal > bVal) return 1
      }
      return 0
    })
  },
  
  // Chunk array into smaller arrays
  chunk: (arr, size) => {
    const chunks = []
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size))
    }
    return chunks
  }
}

// Local storage utilities
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch {
      return defaultValue
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch {
      return false
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key)
      return true
    } catch {
      return false
    }
  },
  
  clear: () => {
    try {
      localStorage.clear()
      return true
    } catch {
      return false
    }
  }
}
