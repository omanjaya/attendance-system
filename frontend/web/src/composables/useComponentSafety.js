/**
 * useComponentSafety Composable
 * Mengatasi masalah Vue warnings umum secara konsisten
 */

import { computed, nextTick, onMounted, onUnmounted } from 'vue'

/**
 * Composable untuk menangani props yang aman dan menghindari attribute warnings
 * @param {Object} props - Props komponen
 * @param {Object} options - Options tambahan
 * @returns {Object} Utilities untuk komponen yang aman
 */
export function useComponentSafety(props = {}, options = {}) {
  const {
    defaultMessage = 'No message provided',
    enableTooltips = true,
    validateRequired = true
  } = options

  // Tooltip management
  let tooltipInstances = []

  const initializeTooltips = (selector = '[data-bs-toggle="tooltip"]') => {
    if (!enableTooltips) return

    nextTick(() => {
      if (typeof window !== 'undefined' && window.bootstrap) {
        const tooltipTriggerList = document.querySelectorAll(selector)
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          if (!tooltipTriggerEl._tooltip) {
            try {
              const tooltip = new window.bootstrap.Tooltip(tooltipTriggerEl)
              tooltipTriggerEl._tooltip = tooltip
              tooltipInstances.push(tooltip)
            } catch (error) {
              console.warn('Failed to initialize tooltip:', error)
            }
          }
        })
      }
    })
  }

  const destroyTooltips = () => {
    tooltipInstances.forEach(tooltip => {
      try {
        tooltip.dispose()
      } catch (error) {
        // Ignore disposal errors
      }
    })
    tooltipInstances = []
  }

  // Safe computed properties untuk notification
  const safeMessage = computed(() => {
    if (props.message) return props.message
    if (props.notification?.message) return props.notification.message
    if (validateRequired && !props.message) {
      console.warn('Component: message prop is missing, using default')
    }
    return defaultMessage
  })

  const safeTitle = computed(() => {
    if (props.title) return props.title
    if (props.notification?.title) return props.notification.title
    return ''
  })

  const safeVariant = computed(() => {
    if (props.variant && props.variant !== 'info') return props.variant
    if (props.type) return props.type
    if (props.notification?.type) return props.notification.type
    return 'info'
  })

  const safeIcon = computed(() => {
    if (props.icon) return props.icon
    if (props.notification?.icon) return props.notification.icon
    
    const iconMap = {
      success: 'check',
      error: 'x',
      warning: 'alert-triangle',
      info: 'info-circle'
    }
    return iconMap[safeVariant.value] || 'info-circle'
  })

  // Tooltip state
  const tooltipEnabled = computed(() => {
    return enableTooltips && typeof window !== 'undefined' && window.bootstrap
  })

  // Lifecycle management
  if (enableTooltips) {
    onMounted(() => {
      initializeTooltips()
    })

    onUnmounted(() => {
      destroyTooltips()
    })
  }

  // Validation helpers
  const validateProp = (propName, value, rules = {}) => {
    if (rules.required && (!value || value === '')) {
      console.warn(`Required prop "${propName}" is missing or empty`)
      return rules.default || ''
    }

    if (rules.validator && value && !rules.validator(value)) {
      console.warn(`Prop "${propName}" failed validation:`, value)
      return rules.default || value
    }

    return value
  }

  // Attribute helpers
  const safeAttrs = computed(() => {
    const attrs = {}
    
    // Only include non-empty attributes
    if (props.id) attrs.id = props.id
    if (props.class) attrs.class = props.class
    if (props.style) attrs.style = props.style
    
    return attrs
  })

  return {
    // Safe computed properties
    safeMessage,
    safeTitle,
    safeVariant,
    safeIcon,
    safeAttrs,
    
    // Tooltip utilities
    tooltipEnabled,
    initializeTooltips,
    destroyTooltips,
    
    // Validation utilities
    validateProp,
    
    // Helper methods
    isEmpty: (value) => !value || value === '' || value === null || value === undefined,
    isObject: (value) => value && typeof value === 'object' && !Array.isArray(value)
  }
}

/**
 * Composable khusus untuk NotificationToast
 * @param {Object} props - Props komponen toast
 * @returns {Object} Utilities untuk toast
 */
export function useNotificationToast(props) {
  const safety = useComponentSafety(props, {
    defaultMessage: 'Notification message',
    validateRequired: false // Toast bisa tanpa message di beberapa kasus
  })

  const toastId = computed(() => {
    return props.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  })

  const toastClasses = computed(() => {
    const classes = [`toast-${safety.safeVariant.value}`]
    
    if (props.dismissible) classes.push('toast-dismissible')
    if (props.persistent) classes.push('toast-persistent')
    
    return classes
  })

  return {
    ...safety,
    toastId,
    toastClasses
  }
}

/**
 * Composable khusus untuk Dropdown dengan tooltips
 * @param {Object} props - Props komponen dropdown
 * @returns {Object} Utilities untuk dropdown
 */
export function useDropdownWithTooltips(props) {
  const safety = useComponentSafety(props, {
    enableTooltips: true
  })

  // Refresh tooltips ketika data berubah
  const refreshTooltips = () => {
    safety.destroyTooltips()
    safety.initializeTooltips()
  }

  return {
    ...safety,
    refreshTooltips
  }
}

export default {
  useComponentSafety,
  useNotificationToast,
  useDropdownWithTooltips
}