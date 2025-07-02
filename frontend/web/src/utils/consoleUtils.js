/**
 * Console utilities for clean and informative logging
 */

const isDevelopment = import.meta.env.MODE === 'development'

// Store original console methods
const originalConsole = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
  debug: console.debug
}

// Known noisy patterns to filter out
const NOISE_PATTERNS = [
  /Failed to load notifications.*500/,
  /WebSocket.*failed.*closed before/,
  /Notification service initialized/,
  /Connecting to WebSocket/,
  /WebSocket error.*Event/,
  /WebSocket disconnected.*1006/,
  /Scheduling reconnect attempt/,
  /🔔|✅|🔌|❌|🔄|📨|📍|🚨|🔍/,
  /DEBUG.*Axios/,
  /CSRF Token.*eyJ/
]

// Check if message should be filtered
function shouldFilter(message) {
  const messageStr = String(message)
  return NOISE_PATTERNS.some(pattern => pattern.test(messageStr))
}

// Check if any argument contains filtered content
function shouldFilterArgs(args) {
  return args.some(arg => shouldFilter(arg))
}

// Clean error logging - only show important errors
console.error = (...args) => {
  if (!isDevelopment) {
    originalConsole.error(...args)
    return
  }

  // Filter out noise
  if (shouldFilterArgs(args)) return

  // Show authentication errors prominently
  if (String(args[0]).includes('Auth') && !String(args[0]).includes('Token validation failed')) {
    originalConsole.error('🔐 AUTH ERROR:', ...args)
    return
  }

  // Show network errors that aren't notifications
  if (String(args[0]).includes('Request failed') && !String(args[0]).includes('notifications')) {
    originalConsole.error('🌐 NETWORK ERROR:', ...args)
    return
  }

  originalConsole.error(...args)
}

// Clean warning logging
console.warn = (...args) => {
  if (!isDevelopment) {
    originalConsole.warn(...args)
    return
  }

  if (shouldFilterArgs(args)) return

  originalConsole.warn(...args)
}

// Clean info logging - reduce noise
console.log = (...args) => {
  if (!isDevelopment) {
    originalConsole.log(...args)
    return
  }

  if (shouldFilterArgs(args)) return

  // Filter out most other logs in development
  const firstArg = String(args[0])
  if (
    firstArg.includes('Registering') ||
    firstArg.includes('Using fallback') ||
    firstArg.includes('Initializing') ||
    firstArg.includes('Performance Metrics')
  ) {
    return
  }

  // Only show important app lifecycle logs
  if (
    firstArg.includes('Navigation') ||
    firstArg.includes('component') ||
    firstArg.includes('mounted')
  ) {
    originalConsole.log(...args)
    return
  }

  // Show everything else for now (can be made more restrictive)
  originalConsole.log(...args)
}

// Enhanced console for app-specific logging
export const cleanConsole = {
  // Authentication related logs
  auth: {
    success: (message, data) => originalConsole.log('🔐 AUTH SUCCESS:', message, data),
    error: (message, error) => originalConsole.error('🔐 AUTH ERROR:', message, error),
    info: (message, data) => originalConsole.info('🔐 AUTH:', message, data)
  },

  // Navigation logs
  nav: {
    info: (message, data) => originalConsole.log('🧭 NAV:', message, data),
    error: (message, error) => originalConsole.error('🧭 NAV ERROR:', message, error)
  },

  // API logs (only for non-notification endpoints)
  api: {
    success: (url, data) => {
      if (!url.includes('notifications')) {
        originalConsole.log('🌐 API SUCCESS:', url, data)
      }
    },
    error: (url, error) => {
      if (!url.includes('notifications')) {
        originalConsole.error('🌐 API ERROR:', url, error)
      }
    }
  },

  // App lifecycle logs
  app: {
    mount: component => originalConsole.log('⚡ MOUNTED:', component),
    error: (message, error) => originalConsole.error('⚠️ APP ERROR:', message, error)
  }
}

export default cleanConsole
