import { ref, onMounted, onUnmounted } from 'vue'

// Global shortcut registry
const globalShortcuts = ref(new Map())
let isInitialized = false

/**
 * Keyboard shortcuts composable
 */
export const useKeyboardShortcuts = () => {
  const localShortcuts = ref(new Map())
  
  /**
   * Register a keyboard shortcut
   */
  const registerShortcut = (keys, callback, options = {}) => {
    const {
      description = '',
      scope = 'local', // 'local' or 'global'
      preventDefault = true,
      stopPropagation = false,
      enabled = true
    } = options
    
    const normalizedKeys = normalizeKeys(keys)
    const shortcut = {
      keys: normalizedKeys,
      callback,
      description,
      preventDefault,
      stopPropagation,
      enabled
    }
    
    if (scope === 'global') {
      globalShortcuts.value.set(normalizedKeys, shortcut)
    } else {
      localShortcuts.value.set(normalizedKeys, shortcut)
    }
    
    return normalizedKeys
  }
  
  /**
   * Unregister a keyboard shortcut
   */
  const unregisterShortcut = (keys, scope = 'local') => {
    const normalizedKeys = normalizeKeys(keys)
    
    if (scope === 'global') {
      globalShortcuts.value.delete(normalizedKeys)
    } else {
      localShortcuts.value.delete(normalizedKeys)
    }
  }
  
  /**
   * Enable/disable a shortcut
   */
  const toggleShortcut = (keys, enabled, scope = 'local') => {
    const normalizedKeys = normalizeKeys(keys)
    const shortcuts = scope === 'global' ? globalShortcuts.value : localShortcuts.value
    const shortcut = shortcuts.get(normalizedKeys)
    
    if (shortcut) {
      shortcut.enabled = enabled
    }
  }
  
  /**
   * Get all registered shortcuts
   */
  const getShortcuts = (scope = 'all') => {
    if (scope === 'global') return Array.from(globalShortcuts.value.values())
    if (scope === 'local') return Array.from(localShortcuts.value.values())
    
    return [
      ...Array.from(globalShortcuts.value.values()),
      ...Array.from(localShortcuts.value.values())
    ]
  }
  
  /**
   * Handle keydown events
   */
  const handleKeydown = (event) => {
    // Skip if typing in input fields
    if (isInInputField(event.target)) {
      return
    }
    
    const pressedKeys = getePressedKeys(event)
    
    // Check local shortcuts first, then global
    const shortcut = localShortcuts.value.get(pressedKeys) || globalShortcuts.value.get(pressedKeys)
    
    if (shortcut && shortcut.enabled) {
      if (shortcut.preventDefault) {
        event.preventDefault()
      }
      if (shortcut.stopPropagation) {
        event.stopPropagation()
      }
      
      shortcut.callback(event)
    }
  }
  
  /**
   * Clear all local shortcuts
   */
  const clearShortcuts = () => {
    localShortcuts.value.clear()
  }
  
  return {
    registerShortcut,
    unregisterShortcut,
    toggleShortcut,
    getShortcuts,
    clearShortcuts,
    handleKeydown
  }
}

/**
 * Global keyboard shortcuts manager
 */
export const useGlobalShortcuts = () => {
  const initializeGlobalShortcuts = () => {
    if (isInitialized) return
    
    // Register default global shortcuts
    registerGlobalShortcut('ctrl+k', () => {
      // Trigger global search
      const searchEvent = new CustomEvent('global-search-toggle')
      document.dispatchEvent(searchEvent)
    }, { description: 'Open global search' })
    
    registerGlobalShortcut('q', () => {
      // Trigger quick actions
      const quickActionsEvent = new CustomEvent('quick-actions-toggle')
      document.dispatchEvent(quickActionsEvent)
    }, { description: 'Open quick actions' })
    
    registerGlobalShortcut('?', () => {
      // Show keyboard shortcuts help
      const helpEvent = new CustomEvent('shortcuts-help-toggle')
      document.dispatchEvent(helpEvent)
    }, { description: 'Show keyboard shortcuts help' })
    
    registerGlobalShortcut('esc', () => {
      // Close modals/overlays
      const escapeEvent = new CustomEvent('global-escape')
      document.dispatchEvent(escapeEvent)
    }, { description: 'Close modals and overlays' })
    
    // Navigation shortcuts
    registerGlobalShortcut('g h', () => {
      window.location.href = '/'
    }, { description: 'Go to dashboard' })
    
    registerGlobalShortcut('g e', () => {
      window.location.href = '/employees'
    }, { description: 'Go to employees' })
    
    registerGlobalShortcut('g a', () => {
      window.location.href = '/attendance'
    }, { description: 'Go to attendance' })
    
    registerGlobalShortcut('g r', () => {
      window.location.href = '/reports'
    }, { description: 'Go to reports' })
    
    // Document event listener
    document.addEventListener('keydown', globalKeydownHandler)
    
    isInitialized = true
  }
  
  const registerGlobalShortcut = (keys, callback, options = {}) => {
    const normalizedKeys = normalizeKeys(keys)
    globalShortcuts.value.set(normalizedKeys, {
      keys: normalizedKeys,
      callback,
      description: options.description || '',
      preventDefault: options.preventDefault !== false,
      stopPropagation: options.stopPropagation || false,
      enabled: options.enabled !== false
    })
  }
  
  const globalKeydownHandler = (event) => {
    // Skip if typing in input fields
    if (isInInputField(event.target)) {
      return
    }
    
    const pressedKeys = getePressedKeys(event)
    const shortcut = globalShortcuts.value.get(pressedKeys)
    
    if (shortcut && shortcut.enabled) {
      if (shortcut.preventDefault) {
        event.preventDefault()
      }
      if (shortcut.stopPropagation) {
        event.stopPropagation()
      }
      
      shortcut.callback(event)
    }
  }
  
  const destroyGlobalShortcuts = () => {
    document.removeEventListener('keydown', globalKeydownHandler)
    globalShortcuts.value.clear()
    isInitialized = false
  }
  
  return {
    initializeGlobalShortcuts,
    registerGlobalShortcut,
    destroyGlobalShortcuts,
    getGlobalShortcuts: () => Array.from(globalShortcuts.value.values())
  }
}

/**
 * Predefined shortcut patterns
 */
export const shortcutPatterns = {
  // Data management
  save: 'ctrl+s',
  cancel: 'esc',
  delete: 'del',
  edit: 'e',
  create: 'c',
  refresh: 'f5',
  
  // Navigation
  back: 'alt+left',
  forward: 'alt+right',
  home: 'alt+h',
  
  // Selection
  selectAll: 'ctrl+a',
  copy: 'ctrl+c',
  paste: 'ctrl+v',
  
  // Search and filter
  search: 'ctrl+f',
  filter: 'ctrl+shift+f',
  
  // UI
  toggleSidebar: 'ctrl+b',
  toggleTheme: 'ctrl+shift+d',
  fullscreen: 'f11'
}

/**
 * Utility functions
 */

// Normalize key combinations for consistent matching
const normalizeKeys = (keys) => {
  return keys
    .toLowerCase()
    .replace(/\s+/g, '')
    .split(/[\+\s]/)
    .sort((a, b) => {
      // Sort modifiers first
      const modifierOrder = ['ctrl', 'alt', 'shift', 'meta']
      const aIndex = modifierOrder.indexOf(a)
      const bIndex = modifierOrder.indexOf(b)
      
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      
      return a.localeCompare(b)
    })
    .join('+')
}

// Get currently pressed key combination
const getePressedKeys = (event) => {
  const keys = []
  
  if (event.ctrlKey) keys.push('ctrl')
  if (event.altKey) keys.push('alt')
  if (event.shiftKey) keys.push('shift')
  if (event.metaKey) keys.push('meta')
  
  // Handle special keys
  const specialKeys = {
    ' ': 'space',
    'Enter': 'enter',
    'Escape': 'esc',
    'Tab': 'tab',
    'Delete': 'del',
    'Backspace': 'backspace',
    'ArrowUp': 'up',
    'ArrowDown': 'down',
    'ArrowLeft': 'left',
    'ArrowRight': 'right',
    'F1': 'f1', 'F2': 'f2', 'F3': 'f3', 'F4': 'f4',
    'F5': 'f5', 'F6': 'f6', 'F7': 'f7', 'F8': 'f8',
    'F9': 'f9', 'F10': 'f10', 'F11': 'f11', 'F12': 'f12'
  }
  
  const key = specialKeys[event.key] || event.key.toLowerCase()
  
  // Don't add modifier keys as the main key
  if (!['ctrl', 'alt', 'shift', 'meta'].includes(key)) {
    keys.push(key)
  }
  
  return keys.join('+')
}

// Check if the target is an input field
const isInInputField = (target) => {
  const inputTags = ['INPUT', 'TEXTAREA', 'SELECT']
  const editableElements = target.isContentEditable
  
  return inputTags.includes(target.tagName) || editableElements
}

/**
 * Component-specific shortcut hooks
 */

// Table shortcuts
export const useTableShortcuts = (tableActions = {}) => {
  const { registerShortcut } = useKeyboardShortcuts()
  
  onMounted(() => {
    if (tableActions.refresh) {
      registerShortcut('f5', tableActions.refresh, {
        description: 'Refresh table data'
      })
    }
    
    if (tableActions.create) {
      registerShortcut('ctrl+n', tableActions.create, {
        description: 'Create new item'
      })
    }
    
    if (tableActions.selectAll) {
      registerShortcut('ctrl+a', (event) => {
        // Only if not in input field
        if (!isInInputField(event.target)) {
          tableActions.selectAll()
        }
      }, {
        description: 'Select all items'
      })
    }
    
    if (tableActions.delete) {
      registerShortcut('del', tableActions.delete, {
        description: 'Delete selected items'
      })
    }
  })
}

// Form shortcuts
export const useFormShortcuts = (formActions = {}) => {
  const { registerShortcut } = useKeyboardShortcuts()
  
  onMounted(() => {
    if (formActions.save) {
      registerShortcut('ctrl+s', formActions.save, {
        description: 'Save form'
      })
    }
    
    if (formActions.cancel) {
      registerShortcut('esc', formActions.cancel, {
        description: 'Cancel form'
      })
    }
    
    if (formActions.reset) {
      registerShortcut('ctrl+r', formActions.reset, {
        description: 'Reset form'
      })
    }
  })
}

// Modal shortcuts
export const useModalShortcuts = (modalActions = {}) => {
  const { registerShortcut } = useKeyboardShortcuts()
  
  onMounted(() => {
    if (modalActions.close) {
      registerShortcut('esc', modalActions.close, {
        description: 'Close modal'
      })
    }
    
    if (modalActions.confirm) {
      registerShortcut('enter', modalActions.confirm, {
        description: 'Confirm action'
      })
    }
  })
}

export default useKeyboardShortcuts