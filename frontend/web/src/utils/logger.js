/**
 * Enhanced Logger Utility for Frontend
 * Provides structured logging with levels, timestamps, and context
 */

class Logger {
  constructor() {
    this.levels = {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      DEBUG: 3,
      TRACE: 4
    }

    // Get log level from environment or localStorage
    this.currentLevel = this.getLogLevel()

    // Store logs for later inspection
    this.logs = []
    this.maxLogs = 1000

    // Console styling
    this.styles = {
      ERROR: 'color: #ff4444; font-weight: bold;',
      WARN: 'color: #ff8800; font-weight: bold;',
      INFO: 'color: #0099ff;',
      DEBUG: 'color: #666666;',
      TRACE: 'color: #999999; font-style: italic;'
    }
  }

  getLogLevel() {
    const envLevel = import.meta.env.VITE_LOG_LEVEL
    const storedLevel = localStorage.getItem('log_level')
    const level = storedLevel || envLevel || 'INFO'
    return this.levels[level.toUpperCase()] ?? this.levels.INFO
  }

  setLogLevel(level) {
    if (typeof level === 'string') {
      level = this.levels[level.toUpperCase()]
    }
    this.currentLevel = level
    localStorage.setItem(
      'log_level',
      Object.keys(this.levels).find(k => this.levels[k] === level)
    )
  }

  shouldLog(level) {
    return level <= this.currentLevel
  }

  formatMessage(level, message, context = {}) {
    const timestamp = new Date().toISOString()
    const levelName = Object.keys(this.levels).find(k => this.levels[k] === level)

    return {
      timestamp,
      level: levelName,
      message,
      context,
      stack: new Error().stack
    }
  }

  log(level, message, context = {}) {
    if (!this.shouldLog(level)) return

    const logEntry = this.formatMessage(level, message, context)

    // Store log
    this.logs.push(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Get level name and style
    const levelName = logEntry.level
    const style = this.styles[levelName]

    // Console output with styling
    console.groupCollapsed(`%c[${levelName}] ${logEntry.timestamp} - ${message}`, style)

    if (Object.keys(context).length > 0) {
      console.log('Context:', context)
    }

    if (level === this.levels.ERROR && context.error) {
      console.error(context.error)
    }

    console.groupEnd()

    // Send critical errors to backend
    if (level === this.levels.ERROR && import.meta.env.PROD) {
      this.sendToBackend(logEntry)
    }
  }

  error(message, context = {}) {
    this.log(this.levels.ERROR, message, context)
  }

  warn(message, context = {}) {
    this.log(this.levels.WARN, message, context)
  }

  info(message, context = {}) {
    this.log(this.levels.INFO, message, context)
  }

  debug(message, context = {}) {
    this.log(this.levels.DEBUG, message, context)
  }

  trace(message, context = {}) {
    this.log(this.levels.TRACE, message, context)
  }

  // Log API requests
  logRequest(config) {
    this.debug('API Request', {
      method: config.method?.toUpperCase(),
      url: config.url,
      params: config.params,
      data: config.data,
      headers: config.headers
    })
  }

  // Log API responses
  logResponse(response) {
    const context = {
      status: response.status,
      statusText: response.statusText,
      url: response.config?.url,
      method: response.config?.method?.toUpperCase(),
      duration: response.config?.metadata?.duration,
      data: response.data
    }

    if (response.status >= 200 && response.status < 300) {
      this.debug('API Response Success', context)
    } else if (response.status >= 400) {
      this.error('API Response Error', context)
    }
  }

  // Log navigation
  logNavigation(to, from) {
    this.info('Navigation', {
      from: from?.path,
      to: to.path,
      params: to.params,
      query: to.query
    })
  }

  // Log Vuex/Pinia actions
  logAction(storeName, actionName, payload) {
    this.debug(`Store Action: ${storeName}/${actionName}`, { payload })
  }

  // Log performance metrics
  logPerformance(metric, value, context = {}) {
    this.info(`Performance: ${metric}`, {
      value,
      unit: context.unit || 'ms',
      ...context
    })
  }

  // Get all logs
  getLogs(level = null) {
    if (level === null) return this.logs
    return this.logs.filter(log => this.levels[log.level] === level)
  }

  // Clear logs
  clearLogs() {
    this.logs = []
  }

  // Export logs
  exportLogs() {
    const blob = new Blob([JSON.stringify(this.logs, null, 2)], {
      type: 'application/json'
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `logs-${new Date().toISOString()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  // Send logs to backend
  async sendToBackend(logEntry) {
    try {
      await fetch('/api/logs/frontend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`
        },
        body: JSON.stringify(logEntry)
      })
    } catch (error) {
      console.error('Failed to send log to backend:', error)
    }
  }

  // Console table for structured data
  table(data, columns) {
    if (this.shouldLog(this.levels.DEBUG)) {
      console.table(data, columns)
    }
  }

  // Group related logs
  group(label, fn) {
    if (this.shouldLog(this.levels.DEBUG)) {
      console.group(label)
      fn()
      console.groupEnd()
    }
  }

  // Time operations
  time(label) {
    if (this.shouldLog(this.levels.DEBUG)) {
      console.time(label)
    }
  }

  timeEnd(label) {
    if (this.shouldLog(this.levels.DEBUG)) {
      console.timeEnd(label)
    }
  }
}

// Create singleton instance
const logger = new Logger()

// Add to window for debugging
if (import.meta.env.DEV) {
  window.logger = logger
}

export default logger
