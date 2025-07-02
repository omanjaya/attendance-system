// Force cache refresh to apply console filtering
console.log('🧹 APPLYING CONSOLE FILTERS...')

// Force timestamp for cache busting
window.__CONSOLE_CLEAN_TIMESTAMP = Date.now()

// More aggressive console filtering
const NOISE_KEYWORDS = [
  'notifications',
  'WebSocket',
  'DEBUG',
  'CSRF Token',
  '🔔',
  '✅',
  '🔌',
  '❌',
  '🔄',
  '📨',
  '📍',
  '🚨',
  '🔍',
  'Failed to load notifications',
  'WebSocket error',
  'Scheduling reconnect',
  'Connecting to WebSocket',
  'Performance Metrics',
  'Registering',
  'Using fallback',
  'Axios Request Interceptor',
  'Axios Response',
  'Status: 500',
  'Internal Server Error'
]

function containsNoise(message) {
  const str = String(message)
  return NOISE_KEYWORDS.some(keyword => str.includes(keyword))
}

function filterArgs(args) {
  return args.some(arg => containsNoise(arg))
}

// Store originals if not already stored
if (!window.__originalConsole) {
  window.__originalConsole = {
    log: console.log.bind(console),
    error: console.error.bind(console),
    warn: console.warn.bind(console),
    info: console.info.bind(console)
  }
}

const orig = window.__originalConsole

// Override console methods
console.log = (...args) => {
  if (filterArgs(args)) return
  const msg = String(args[0])
  if (msg.includes('Navigation')) {
    orig.log('🧭', ...args)
  } else if (msg.includes('AUTH') || msg.includes('Login')) {
    orig.log('🔐', ...args)
  } else {
    orig.log(...args)
  }
}

console.error = (...args) => {
  if (filterArgs(args)) return
  orig.error('🚨', ...args)
}

console.warn = (...args) => {
  if (filterArgs(args)) return
  orig.warn('⚠️', ...args)
}

console.info = (...args) => {
  if (filterArgs(args)) return
  orig.info('ℹ️', ...args)
}

console.log('✅ Console filters applied successfully!')

export default true
