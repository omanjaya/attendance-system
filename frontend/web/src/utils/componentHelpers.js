/**
 * Component Helper Utilities
 * Membantu mengatasi masalah Vue umum seperti attribute inheritance dan validation
 */

/**
 * Membuat prop definition yang aman untuk attributes yang mungkin diteruskan
 * @param {Object} additionalProps - Props tambahan yang spesifik untuk komponen
 * @returns {Object} Props definition lengkap
 */
export function createSafeProps(additionalProps = {}) {
  const commonProps = {
    // Attributes umum yang sering diteruskan
    id: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: ''
    },
    class: {
      type: [String, Array, Object],
      default: ''
    },
    style: {
      type: [String, Object],
      default: ''
    }
  }

  return {
    ...commonProps,
    ...additionalProps
  }
}

/**
 * Membuat computed property yang aman untuk message dengan fallback
 * @param {Object} props - Props dari komponen
 * @param {string} defaultMessage - Pesan default jika tidak ada message
 * @returns {Object} Computed property untuk message
 */
export function createSafeMessage(props, defaultMessage = 'No message provided') {
  return {
    message: () => {
      if (props.message) return props.message
      if (props.notification && props.notification.message) return props.notification.message
      return defaultMessage
    },
    title: () => {
      if (props.title) return props.title
      if (props.notification && props.notification.title) return props.notification.title
      return ''
    }
  }
}

/**
 * Membuat component wrapper yang menangani fragment/teleport dengan attrs
 * @param {Object} options - Options untuk wrapper
 * @returns {Object} Component definition
 */
export function createFragmentWrapper(options = {}) {
  const {
    name = 'FragmentWrapper',
    inheritAttrs = false,
    renderRoot = true
  } = options

  return {
    name,
    inheritAttrs,
    props: createSafeProps(),
    setup(props, { slots, attrs }) {
      return () => {
        if (renderRoot) {
          // Render dengan root element untuk menerima attrs
          return h('div', {
            ...attrs,
            class: [props.class, attrs.class],
            style: [props.style, attrs.style],
            id: props.id || attrs.id
          }, slots.default?.())
        } else {
          // Render fragment tanpa root element
          return slots.default?.()
        }
      }
    }
  }
}

/**
 * Validasi props yang aman dengan fallback
 * @param {Object} props - Props yang akan divalidasi
 * @param {Object} rules - Rules validasi
 * @returns {Object} Props yang sudah divalidasi
 */
export function validateProps(props, rules = {}) {
  const validated = { ...props }

  Object.entries(rules).forEach(([key, rule]) => {
    if (rule.required && (!validated[key] || validated[key] === '')) {
      if (rule.default !== undefined) {
        validated[key] = rule.default
      } else {
        console.warn(`Required prop "${key}" is missing or empty`)
      }
    }

    if (rule.validator && validated[key] && !rule.validator(validated[key])) {
      console.warn(`Prop "${key}" failed validation`)
      if (rule.default !== undefined) {
        validated[key] = rule.default
      }
    }
  })

  return validated
}

/**
 * Membuat tooltip helper yang aman
 * @param {Function} nextTick - Vue nextTick function
 * @returns {Object} Tooltip utilities
 */
export function createTooltipHelper(nextTick) {
  const initializeTooltips = (selector = '[data-bs-toggle="tooltip"]') => {
    nextTick(() => {
      if (typeof window !== 'undefined' && window.bootstrap) {
        const tooltipTriggerList = document.querySelectorAll(selector)
        tooltipTriggerList.forEach(tooltipTriggerEl => {
          if (!tooltipTriggerEl._tooltip) {
            try {
              tooltipTriggerEl._tooltip = new window.bootstrap.Tooltip(tooltipTriggerEl)
            } catch (error) {
              console.warn('Failed to initialize tooltip:', error)
            }
          }
        })
      }
    })
  }

  const destroyTooltips = (selector = '[data-bs-toggle="tooltip"]') => {
    if (typeof window !== 'undefined') {
      const tooltipTriggerList = document.querySelectorAll(selector)
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        if (tooltipTriggerEl._tooltip) {
          tooltipTriggerEl._tooltip.dispose()
          tooltipTriggerEl._tooltip = null
        }
      })
    }
  }

  return {
    init: initializeTooltips,
    destroy: destroyTooltips,
    enabled: typeof window !== 'undefined' && window.bootstrap
  }
}

/**
 * Membuat notification props yang aman
 * @param {Object} baseProps - Props dasar
 * @returns {Object} Props definition untuk notifikasi
 */
export function createNotificationProps(baseProps = {}) {
  return createSafeProps({
    // Notification content
    message: {
      type: String,
      required: false,
      default: ''
    },
    title: {
      type: String,
      default: ''
    },
    
    // Notification object (alternative way to pass data)
    notification: {
      type: Object,
      default: () => ({})
    },
    
    // Notification type/variant
    variant: {
      type: String,
      default: 'info',
      validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
    },
    
    // Icon
    icon: {
      type: String,
      default: ''
    },
    
    // Behavior
    duration: {
      type: Number,
      default: 5000
    },
    dismissible: {
      type: Boolean,
      default: true
    },
    
    ...baseProps
  })
}

/**
 * Membuat computed properties untuk notification yang aman
 * @param {Object} props - Props dari komponen
 * @returns {Object} Computed properties
 */
export function createNotificationComputed(props) {
  return {
    computedMessage: () => {
      if (props.message) return props.message
      if (props.notification && props.notification.message) return props.notification.message
      return 'No message provided'
    },
    
    computedTitle: () => {
      if (props.title) return props.title
      if (props.notification && props.notification.title) return props.notification.title
      return ''
    },
    
    computedVariant: () => {
      if (props.variant && props.variant !== 'info') return props.variant
      if (props.type) return props.type
      if (props.notification && props.notification.type) return props.notification.type
      return 'info'
    },
    
    computedIcon: () => {
      if (props.icon) return props.icon
      if (props.notification && props.notification.icon) return props.notification.icon
      
      // Default icons based on variant
      const iconMap = {
        success: 'check',
        error: 'x',
        warning: 'alert-triangle',
        info: 'info-circle'
      }
      return iconMap[props.computedVariant] || 'info-circle'
    }
  }
}

export default {
  createSafeProps,
  createSafeMessage,
  createFragmentWrapper,
  validateProps,
  createTooltipHelper,
  createNotificationProps,
  createNotificationComputed
}