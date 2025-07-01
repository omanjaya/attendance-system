import { ref, nextTick } from 'vue'
import { createApp } from 'vue'
import NotificationToast from '@/components/common/NotificationToast.vue'

// Global state for managing notifications
const notifications = ref([])
let notificationId = 0

// Default configuration
const defaultConfig = {
  duration: 5000,
  position: 'top-right',
  dismissible: true,
  persistent: false
}

/**
 * Create and mount a toast notification
 */
const createToast = (options) => {
  const id = String(++notificationId)
  
  // Merge with defaults
  const config = {
    ...defaultConfig,
    ...options,
    id
  }
  
  // Create a container for this toast
  const container = document.createElement('div')
  container.id = `toast-${id}`
  document.body.appendChild(container)
  
  // Create Vue app instance for the toast
  const app = createApp(NotificationToast, {
    ...config,
    onDismiss: () => {
      // Remove from notifications array
      const index = notifications.value.findIndex(n => n.id === id)
      if (index > -1) {
        notifications.value.splice(index, 1)
      }
      
      // Cleanup
      app.unmount()
      if (container.parentNode) {
        container.parentNode.removeChild(container)
      }
      
      // Call user-provided dismiss handler
      if (config.onDismiss) {
        config.onDismiss()
      }
    },
    onAction: (action) => {
      // Call user-provided action handler
      if (config.onAction) {
        config.onAction(action)
      }
    }
  })
  
  // Mount the toast
  app.mount(container)
  
  // Add to notifications array
  const notification = {
    id,
    app,
    container,
    config,
    dismiss: () => {
      const toastInstance = app._instance?.exposed
      if (toastInstance) {
        toastInstance.dismiss()
      }
    }
  }
  
  notifications.value.push(notification)
  
  return notification
}

/**
 * Show a success notification
 */
export const showSuccess = (message, options = {}) => {
  return createToast({
    message,
    variant: 'success',
    icon: 'check',
    ...options
  })
}

/**
 * Show an error notification
 */
export const showError = (message, options = {}) => {
  return createToast({
    message,
    variant: 'error',
    icon: 'alert-circle',
    duration: 8000, // Longer duration for errors
    ...options
  })
}

/**
 * Show a warning notification
 */
export const showWarning = (message, options = {}) => {
  return createToast({
    message,
    variant: 'warning',
    icon: 'alert-triangle',
    duration: 6000,
    ...options
  })
}

/**
 * Show an info notification
 */
export const showInfo = (message, options = {}) => {
  return createToast({
    message,
    variant: 'info',
    icon: 'info-circle',
    ...options
  })
}

/**
 * Show a custom notification
 */
export const showNotification = (options) => {
  return createToast(options)
}

/**
 * Show a loading notification that can be updated
 */
export const showLoading = (message, options = {}) => {
  return createToast({
    message,
    variant: 'info',
    icon: 'loader',
    persistent: true,
    dismissible: false,
    ...options
  })
}

/**
 * Update an existing notification
 */
export const updateNotification = (notification, updates) => {
  if (notification && notification.config) {
    Object.assign(notification.config, updates)
    // Force re-render if needed
    notification.app._instance?.proxy?.$forceUpdate()
  }
}

/**
 * Dismiss a specific notification
 */
export const dismissNotification = (notification) => {
  if (notification && typeof notification.dismiss === 'function') {
    notification.dismiss()
  }
}

/**
 * Dismiss all notifications
 */
export const dismissAll = () => {
  notifications.value.forEach(notification => {
    notification.dismiss()
  })
  notifications.value = []
}

/**
 * Get all active notifications
 */
export const getNotifications = () => {
  return notifications.value
}

/**
 * Common notification patterns
 */
export const notificationPatterns = {
  /**
   * Show a save success notification
   */
  saveSuccess: (entityName = 'Item') => {
    return showSuccess(`${entityName} saved successfully!`, {
      title: 'Success'
    })
  },
  
  /**
   * Show a delete success notification
   */
  deleteSuccess: (entityName = 'Item') => {
    return showSuccess(`${entityName} deleted successfully!`, {
      title: 'Deleted'
    })
  },
  
  /**
   * Show a validation error notification
   */
  validationError: (message = 'Please check the form for errors.') => {
    return showError(message, {
      title: 'Validation Error'
    })
  },
  
  /**
   * Show a network error notification
   */
  networkError: (message = 'Unable to connect to the server. Please try again.') => {
    return showError(message, {
      title: 'Connection Error',
      persistent: true,
      actions: [
        {
          key: 'retry',
          label: 'Retry',
          variant: 'primary'
        }
      ]
    })
  },
  
  /**
   * Show an action confirmation
   */
  actionConfirm: (message, onConfirm) => {
    return showWarning(message, {
      title: 'Confirm Action',
      persistent: true,
      actions: [
        {
          key: 'cancel',
          label: 'Cancel',
          variant: 'link'
        },
        {
          key: 'confirm',
          label: 'Confirm',
          variant: 'warning'
        }
      ],
      onAction: (action) => {
        if (action.key === 'confirm' && onConfirm) {
          onConfirm()
        }
      }
    })
  },
  
  /**
   * Show an undo notification
   */
  undoAction: (message, onUndo) => {
    return showInfo(message, {
      duration: 8000,
      actions: [
        {
          key: 'undo',
          label: 'Undo',
          variant: 'primary'
        }
      ],
      onAction: (action) => {
        if (action.key === 'undo' && onUndo) {
          onUndo()
        }
      }
    })
  }
}

/**
 * Vue composable for using notifications
 */
export const useNotifications = () => {
  return {
    // Basic notification methods
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification,
    showLoading,
    
    // Management methods
    updateNotification,
    dismissNotification,
    dismissAll,
    getNotifications,
    
    // Common patterns
    ...notificationPatterns,
    
    // Reactive state
    notifications
  }
}

// Global notification methods for use outside of components
export const $notify = {
  success: showSuccess,
  error: showError,
  warning: showWarning,
  info: showInfo,
  show: showNotification,
  loading: showLoading,
  update: updateNotification,
  dismiss: dismissNotification,
  dismissAll,
  patterns: notificationPatterns
}

// Auto-import for common use cases
export {
  showSuccess as success,
  showError as error,
  showWarning as warning,
  showInfo as info
}

export default useNotifications