import { ref, computed } from 'vue'

// Global loading states
const globalLoadingStates = ref(new Map())
let loadingId = 0

/**
 * Create a scoped loading manager
 */
export const useLoading = (namespace = 'default') => {
  const localStates = ref(new Map())
  
  /**
   * Set loading state for a specific key
   */
  const setLoading = (key, state = true, options = {}) => {
    const id = typeof key === 'string' ? key : `loading-${++loadingId}`
    
    if (state) {
      localStates.value.set(id, {
        id,
        loading: true,
        message: options.message || '',
        progress: options.progress || 0,
        startTime: Date.now(),
        ...options
      })
    } else {
      localStates.value.delete(id)
    }
    
    // Trigger reactivity
    localStates.value = new Map(localStates.value)
    
    return id
  }
  
  /**
   * Get loading state for a specific key
   */
  const getLoading = (key) => {
    return localStates.value.get(key) || null
  }
  
  /**
   * Check if a specific key is loading
   */
  const isLoading = (key) => {
    return localStates.value.has(key)
  }
  
  /**
   * Check if any operation is loading
   */
  const isAnyLoading = computed(() => {
    return localStates.value.size > 0
  })
  
  /**
   * Get all loading states
   */
  const getAllLoading = computed(() => {
    return Array.from(localStates.value.values())
  })
  
  /**
   * Update loading state
   */
  const updateLoading = (key, updates) => {
    const existing = localStates.value.get(key)
    if (existing) {
      localStates.value.set(key, { ...existing, ...updates })
      localStates.value = new Map(localStates.value)
    }
  }
  
  /**
   * Clear specific loading state
   */
  const clearLoading = (key) => {
    localStates.value.delete(key)
    localStates.value = new Map(localStates.value)
  }
  
  /**
   * Clear all loading states
   */
  const clearAllLoading = () => {
    localStates.value.clear()
    localStates.value = new Map()
  }
  
  /**
   * Wrap an async function with loading state
   */
  const withLoading = async (key, asyncFn, options = {}) => {
    const loadingId = setLoading(key, true, options)
    
    try {
      const result = await asyncFn()
      return result
    } finally {
      clearLoading(loadingId)
    }
  }
  
  /**
   * Create a loading wrapper for API calls
   */
  const createLoadingWrapper = (key, options = {}) => {
    return async (asyncFn) => {
      return withLoading(key, asyncFn, options)
    }
  }
  
  return {
    // State management
    setLoading,
    getLoading,
    isLoading,
    isAnyLoading,
    getAllLoading,
    updateLoading,
    clearLoading,
    clearAllLoading,
    
    // Utilities
    withLoading,
    createLoadingWrapper,
    
    // Reactive state
    states: computed(() => localStates.value)
  }
}

/**
 * Global loading manager
 */
export const useGlobalLoading = () => {
  const setGlobalLoading = (key, state = true, options = {}) => {
    const id = typeof key === 'string' ? key : `global-loading-${++loadingId}`
    
    if (state) {
      globalLoadingStates.value.set(id, {
        id,
        loading: true,
        message: options.message || '',
        progress: options.progress || 0,
        startTime: Date.now(),
        ...options
      })
    } else {
      globalLoadingStates.value.delete(id)
    }
    
    // Trigger reactivity
    globalLoadingStates.value = new Map(globalLoadingStates.value)
    
    return id
  }
  
  const isGlobalLoading = computed(() => {
    return globalLoadingStates.value.size > 0
  })
  
  const getAllGlobalLoading = computed(() => {
    return Array.from(globalLoadingStates.value.values())
  })
  
  const clearGlobalLoading = (key) => {
    globalLoadingStates.value.delete(key)
    globalLoadingStates.value = new Map(globalLoadingStates.value)
  }
  
  const clearAllGlobalLoading = () => {
    globalLoadingStates.value.clear()
    globalLoadingStates.value = new Map()
  }
  
  return {
    setGlobalLoading,
    isGlobalLoading,
    getAllGlobalLoading,
    clearGlobalLoading,
    clearAllGlobalLoading,
    globalStates: computed(() => globalLoadingStates.value)
  }
}

/**
 * Common loading patterns
 */
export const loadingPatterns = {
  /**
   * API request loading
   */
  apiRequest: (endpoint, options = {}) => {
    return {
      message: options.message || 'Loading...',
      variant: 'spinner',
      size: 'medium',
      ...options
    }
  },
  
  /**
   * Form submission loading
   */
  formSubmit: (action = 'Saving', options = {}) => {
    return {
      message: `${action}...`,
      variant: 'spinner',
      size: 'medium',
      overlay: true,
      ...options
    }
  },
  
  /**
   * Data fetch loading
   */
  dataFetch: (entity = 'data', options = {}) => {
    return {
      message: `Loading ${entity}...`,
      variant: 'skeleton',
      skeletonType: options.skeletonType || 'table',
      ...options
    }
  },
  
  /**
   * File upload loading
   */
  fileUpload: (options = {}) => {
    return {
      message: 'Uploading file...',
      variant: 'progress',
      showPercentage: true,
      progress: options.progress || 0,
      ...options
    }
  },
  
  /**
   * Page navigation loading
   */
  pageNavigation: (options = {}) => {
    return {
      message: 'Loading page...',
      variant: 'pulse',
      size: 'large',
      overlay: true,
      ...options
    }
  },
  
  /**
   * Search loading
   */
  search: (options = {}) => {
    return {
      message: 'Searching...',
      variant: 'dots',
      size: 'small',
      ...options
    }
  }
}

/**
 * Loading state hooks for common scenarios
 */
export const useApiLoading = () => {
  const { setLoading, clearLoading, isLoading, withLoading } = useLoading('api')
  
  const apiCall = async (key, asyncFn, options = {}) => {
    return withLoading(key, asyncFn, loadingPatterns.apiRequest(key, options))
  }
  
  return {
    setLoading,
    clearLoading,
    isLoading,
    apiCall
  }
}

export const useFormLoading = () => {
  const { setLoading, clearLoading, isLoading, withLoading } = useLoading('form')
  
  const submitForm = async (action, asyncFn, options = {}) => {
    return withLoading(action, asyncFn, loadingPatterns.formSubmit(action, options))
  }
  
  return {
    setLoading,
    clearLoading,
    isLoading,
    submitForm
  }
}

export const usePageLoading = () => {
  const { setGlobalLoading, clearGlobalLoading, isGlobalLoading } = useGlobalLoading()
  
  const showPageLoading = (message = 'Loading page...') => {
    return setGlobalLoading('page', true, loadingPatterns.pageNavigation({ message }))
  }
  
  const hidePageLoading = () => {
    clearGlobalLoading('page')
  }
  
  return {
    showPageLoading,
    hidePageLoading,
    isPageLoading: isGlobalLoading
  }
}

/**
 * Directive for automatic loading states
 */
export const loadingDirective = {
  mounted(el, binding) {
    const { value, modifiers } = binding
    
    if (value) {
      el.classList.add('loading')
      
      if (modifiers.overlay) {
        el.style.position = 'relative'
        
        const overlay = document.createElement('div')
        overlay.className = 'loading-overlay'
        overlay.innerHTML = '<div class="loading-spinner"><div class="spinner"></div></div>'
        
        el.appendChild(overlay)
        el._loadingOverlay = overlay
      }
    }
  },
  
  updated(el, binding) {
    const { value, modifiers } = binding
    
    if (value) {
      el.classList.add('loading')
    } else {
      el.classList.remove('loading')
      
      if (el._loadingOverlay) {
        el.removeChild(el._loadingOverlay)
        delete el._loadingOverlay
      }
    }
  },
  
  unmounted(el) {
    if (el._loadingOverlay) {
      el.removeChild(el._loadingOverlay)
      delete el._loadingOverlay
    }
  }
}

export default useLoading