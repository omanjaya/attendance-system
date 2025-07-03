/**
 * Performance Monitoring System
 * Tracks and reports various performance metrics
 */

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.observers = new Map()
    this.config = {
      sampleRate: 1.0,
      bufferSize: 100,
      reportInterval: 30000, // 30 seconds
      enableMemoryTracking: true,
      enableRenderTracking: true,
      enableNetworkTracking: true
    }

    this.init()
  }

  init() {
    if (typeof window === 'undefined') return

    this.setupPerformanceObserver()
    this.setupMemoryTracking()
    this.setupNetworkTracking()
    this.setupRenderTracking()
    this.setupErrorTracking()

    // Start periodic reporting
    this.startPeriodicReporting()
  }

  // Performance Observer for Web Vitals
  setupPerformanceObserver() {
    if (!('PerformanceObserver' in window)) return

    // Core Web Vitals tracking
    const vitalsObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        this.recordMetric('webVitals', {
          name: entry.name,
          value: entry.value,
          timestamp: Date.now(),
          type: entry.entryType
        })
      }
    })

    try {
      vitalsObserver.observe({ entryTypes: ['measure', 'navigation', 'paint'] })
    } catch (e) {
      console.warn('Performance Observer not fully supported:', e)
    }

    // Track Largest Contentful Paint (LCP)
    this.trackLCP()

    // Track First Input Delay (FID)
    this.trackFID()

    // Track Cumulative Layout Shift (CLS)
    this.trackCLS()
  }

  trackLCP() {
    if (!('PerformanceObserver' in window)) return

    const lcpObserver = new PerformanceObserver(list => {
      const entries = list.getEntries()
      const lastEntry = entries[entries.length - 1]

      this.recordMetric('lcp', {
        value: lastEntry.startTime,
        timestamp: Date.now(),
        element: lastEntry.element?.tagName || 'unknown'
      })
    })

    try {
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
    } catch (e) {
      console.warn('LCP tracking not supported:', e)
    }
  }

  trackFID() {
    if (!('PerformanceObserver' in window)) return

    const fidObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        this.recordMetric('fid', {
          value: entry.processingStart - entry.startTime,
          timestamp: Date.now(),
          eventType: entry.name
        })
      }
    })

    try {
      fidObserver.observe({ entryTypes: ['first-input'] })
    } catch (e) {
      console.warn('FID tracking not supported:', e)
    }
  }

  trackCLS() {
    if (!('PerformanceObserver' in window)) return

    let clsValue = 0
    const clsObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value
          this.recordMetric('cls', {
            value: clsValue,
            timestamp: Date.now(),
            sources: entry.sources?.map(source => source.node?.tagName) || []
          })
        }
      }
    })

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] })
    } catch (e) {
      console.warn('CLS tracking not supported:', e)
    }
  }

  // Memory usage tracking
  setupMemoryTracking() {
    if (!this.config.enableMemoryTracking) return
    if (!('memory' in performance)) return

    const trackMemory = () => {
      const memory = performance.memory
      this.recordMetric('memory', {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
        timestamp: Date.now()
      })
    }

    // Track memory every 10 seconds
    setInterval(trackMemory, 10000)
    trackMemory() // Initial measurement
  }

  // Network performance tracking
  setupNetworkTracking() {
    if (!this.config.enableNetworkTracking) return

    const networkObserver = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'resource') {
          this.recordMetric('network', {
            name: entry.name,
            duration: entry.duration,
            transferSize: entry.transferSize,
            encodedBodySize: entry.encodedBodySize,
            decodedBodySize: entry.decodedBodySize,
            timestamp: Date.now(),
            type: this.getResourceType(entry.name)
          })
        }
      }
    })

    try {
      networkObserver.observe({ entryTypes: ['resource'] })
    } catch (e) {
      console.warn('Network tracking not supported:', e)
    }
  }

  // Component render tracking
  setupRenderTracking() {
    if (!this.config.enableRenderTracking) return

    // Track Vue component render times
    if (window.Vue) {
      this.trackVueRenders()
    }

    // Track route changes
    this.trackRouteChanges()
  }

  trackVueRenders() {
    // This would integrate with Vue's performance tracking
    // For now, we'll track basic mount/update cycles
    const originalMount = window.Vue?.config?.globalProperties?.$mount
    if (originalMount) {
      window.Vue.config.globalProperties.$mount = function (...args) {
        const start = performance.now()
        const result = originalMount.apply(this, args)
        const end = performance.now()

        performanceMonitor.recordMetric('componentRender', {
          component: this.$options.name || 'Anonymous',
          duration: end - start,
          timestamp: Date.now(),
          type: 'mount'
        })

        return result
      }
    }
  }

  trackRouteChanges() {
    if (typeof window === 'undefined') return

    let routeChangeStart = null

    // Listen for route changes (assuming Vue Router)
    window.addEventListener('beforeunload', () => {
      routeChangeStart = performance.now()
    })

    window.addEventListener('load', () => {
      if (routeChangeStart) {
        this.recordMetric('routeChange', {
          duration: performance.now() - routeChangeStart,
          timestamp: Date.now()
        })
        routeChangeStart = null
      }
    })
  }

  // Error tracking
  setupErrorTracking() {
    window.addEventListener('error', event => {
      this.recordMetric('jsError', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        timestamp: Date.now(),
        stack: event.error?.stack
      })
    })

    window.addEventListener('unhandledrejection', event => {
      this.recordMetric('promiseRejection', {
        reason: event.reason?.toString(),
        timestamp: Date.now(),
        stack: event.reason?.stack
      })
    })
  }

  // Bundle size tracking
  async trackBundleSize() {
    try {
      const response = await fetch('/dist/manifest.json')
      const manifest = await response.json()

      let totalSize = 0
      const assets = {}

      for (const [key, value] of Object.entries(manifest)) {
        if (value.file) {
          const assetResponse = await fetch(`/dist/${value.file}`, { method: 'HEAD' })
          const size = parseInt(assetResponse.headers.get('content-length') || '0')
          totalSize += size
          assets[key] = { file: value.file, size }
        }
      }

      this.recordMetric('bundleSize', {
        totalSize,
        assets,
        timestamp: Date.now()
      })
    } catch (e) {
      console.warn('Bundle size tracking failed:', e)
    }
  }

  // User interaction tracking
  trackUserInteraction(action, target, metadata = {}) {
    this.recordMetric('userInteraction', {
      action,
      target,
      timestamp: Date.now(),
      ...metadata
    })
  }

  // Page load performance
  trackPageLoad() {
    if (typeof window === 'undefined') return

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0]

      this.recordMetric('pageLoad', {
        domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
        loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
        totalTime: navigation.loadEventEnd - navigation.fetchStart,
        dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcpConnect: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        domProcessing: navigation.domComplete - navigation.domLoading,
        timestamp: Date.now()
      })
    })
  }

  // Record metric
  recordMetric(category, data) {
    if (Math.random() > this.config.sampleRate) return

    if (!this.metrics.has(category)) {
      this.metrics.set(category, [])
    }

    const metrics = this.metrics.get(category)
    metrics.push({
      ...data,
      id: this.generateId(),
      sessionId: this.getSessionId()
    })

    // Keep buffer size manageable
    if (metrics.length > this.config.bufferSize) {
      metrics.shift()
    }

    // Emit event for real-time monitoring
    this.emit('metric', { category, data })
  }

  // Get metrics
  getMetrics(category) {
    return category ? this.metrics.get(category) || [] : Object.fromEntries(this.metrics)
  }

  // Get performance summary
  getPerformanceSummary() {
    const summary = {
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      webVitals: this.calculateWebVitals(),
      memory: this.calculateMemoryStats(),
      network: this.calculateNetworkStats(),
      errors: this.calculateErrorStats(),
      userExperience: this.calculateUXMetrics()
    }

    return summary
  }

  calculateWebVitals() {
    const lcp = this.getMetrics('lcp')
    const fid = this.getMetrics('fid')
    const cls = this.getMetrics('cls')

    return {
      lcp: lcp.length > 0 ? lcp[lcp.length - 1].value : null,
      fid: fid.length > 0 ? fid.reduce((sum, entry) => sum + entry.value, 0) / fid.length : null,
      cls: cls.length > 0 ? cls[cls.length - 1].value : null,
      rating: this.calculateWebVitalsRating(lcp, fid, cls)
    }
  }

  calculateWebVitalsRating(lcp, fid, cls) {
    const lcpScore =
      lcp.length > 0
        ? lcp[lcp.length - 1].value <= 2500
          ? 'good'
          : lcp[lcp.length - 1].value <= 4000
            ? 'needs-improvement'
            : 'poor'
        : 'unknown'
    const fidScore =
      fid.length > 0
        ? fid.reduce((sum, entry) => sum + entry.value, 0) / fid.length <= 100
          ? 'good'
          : 'poor'
        : 'unknown'
    const clsScore =
      cls.length > 0
        ? cls[cls.length - 1].value <= 0.1
          ? 'good'
          : cls[cls.length - 1].value <= 0.25
            ? 'needs-improvement'
            : 'poor'
        : 'unknown'

    return { lcp: lcpScore, fid: fidScore, cls: clsScore }
  }

  calculateMemoryStats() {
    const memoryMetrics = this.getMetrics('memory')
    if (memoryMetrics.length === 0) return null

    const latest = memoryMetrics[memoryMetrics.length - 1]
    const initial = memoryMetrics[0]

    return {
      current: latest,
      growth: latest.usedJSHeapSize - initial.usedJSHeapSize,
      trend: this.calculateTrend(memoryMetrics.map(m => m.usedJSHeapSize))
    }
  }

  calculateNetworkStats() {
    const networkMetrics = this.getMetrics('network')
    if (networkMetrics.length === 0) return null

    const totalTransferSize = networkMetrics.reduce((sum, metric) => sum + (metric.transferSize || 0), 0)
    const avgLoadTime = networkMetrics.reduce((sum, metric) => sum + metric.duration, 0) / networkMetrics.length

    return {
      requests: networkMetrics.length,
      totalTransferSize,
      avgLoadTime,
      slowRequests: networkMetrics.filter(m => m.duration > 1000).length,
      resourceTypes: this.groupBy(networkMetrics, 'type')
    }
  }

  calculateErrorStats() {
    const jsErrors = this.getMetrics('jsError')
    const promiseRejections = this.getMetrics('promiseRejection')

    return {
      jsErrors: jsErrors.length,
      promiseRejections: promiseRejections.length,
      errorRate: (jsErrors.length + promiseRejections.length) / (this.getMetrics('userInteraction').length || 1),
      commonErrors: this.groupBy(jsErrors, 'message')
    }
  }

  calculateUXMetrics() {
    const interactions = this.getMetrics('userInteraction')
    const pageLoads = this.getMetrics('pageLoad')

    return {
      interactions: interactions.length,
      avgPageLoadTime:
        pageLoads.length > 0 ? pageLoads.reduce((sum, load) => sum + load.totalTime, 0) / pageLoads.length : null,
      bounceRate: this.calculateBounceRate(interactions),
      engagementScore: this.calculateEngagementScore(interactions)
    }
  }

  // Helper methods
  calculateTrend(values) {
    if (values.length < 2) return 'stable'
    const slope = (values[values.length - 1] - values[0]) / values.length
    return slope > 0 ? 'increasing' : slope < 0 ? 'decreasing' : 'stable'
  }

  calculateBounceRate(interactions) {
    // Simplified bounce rate calculation
    const sessions = this.groupBy(interactions, 'sessionId')
    const bouncedSessions = Object.values(sessions).filter(session => session.length <= 1).length
    return sessions.length > 0 ? bouncedSessions / Object.keys(sessions).length : 0
  }

  calculateEngagementScore(interactions) {
    if (interactions.length === 0) return 0

    const timeSpent =
      interactions.length > 1 ? interactions[interactions.length - 1].timestamp - interactions[0].timestamp : 0

    return Math.min(100, interactions.length * 10 + timeSpent / 1000)
  }

  groupBy(array, key) {
    return array.reduce((groups, item) => {
      const group = item[key] || 'unknown'
      groups[group] = groups[group] || []
      groups[group].push(item)
      return groups
    }, {})
  }

  getResourceType(url) {
    if (url.includes('.js')) return 'javascript'
    if (url.includes('.css')) return 'stylesheet'
    if (url.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image'
    if (url.includes('.woff') || url.includes('.ttf')) return 'font'
    return 'other'
  }

  generateId() {
    return Math.random().toString(36).substr(2, 9)
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    return this.sessionId
  }

  // Event emitter
  emit(event, data) {
    if (this.observers.has(event)) {
      this.observers.get(event).forEach(callback => callback(data))
    }
  }

  on(event, callback) {
    if (!this.observers.has(event)) {
      this.observers.set(event, [])
    }
    this.observers.get(event).push(callback)
  }

  off(event, callback) {
    if (this.observers.has(event)) {
      const callbacks = this.observers.get(event)
      const index = callbacks.indexOf(callback)
      if (index > -1) {
        callbacks.splice(index, 1)
      }
    }
  }

  // Periodic reporting
  startPeriodicReporting() {
    setInterval(() => {
      this.reportMetrics()
    }, this.config.reportInterval)
  }

  async reportMetrics() {
    const summary = this.getPerformanceSummary()

    // Send to analytics service
    try {
      await this.sendToAnalytics(summary)
    } catch (e) {
      console.warn('Failed to send performance metrics:', e)
    }

    // Store locally for debugging
    this.storeLocally(summary)
  }

  async sendToAnalytics(data) {
    // Implementation would depend on your analytics service
    // Example: Google Analytics, custom endpoint, etc.
    if (process.env.NODE_ENV === 'development') {
      console.log('Performance Metrics:', data)
    }
  }

  storeLocally(data) {
    try {
      const stored = JSON.parse(localStorage.getItem('performance_metrics') || '[]')
      stored.push(data)

      // Keep only last 10 reports
      if (stored.length > 10) {
        stored.shift()
      }

      localStorage.setItem('performance_metrics', JSON.stringify(stored))
    } catch (e) {
      console.warn('Failed to store performance metrics locally:', e)
    }
  }

  // Public API methods
  mark(name) {
    performance.mark(name)
  }

  measure(name, startMark, endMark) {
    performance.measure(name, startMark, endMark)
  }

  time(label) {
    console.time(label)
  }

  timeEnd(label) {
    console.timeEnd(label)
  }

  // Clear metrics
  clearMetrics(category) {
    if (category) {
      this.metrics.delete(category)
    } else {
      this.metrics.clear()
    }
  }

  // Export metrics
  exportMetrics() {
    return {
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      config: this.config,
      metrics: Object.fromEntries(this.metrics),
      summary: this.getPerformanceSummary()
    }
  }
}

// Create singleton instance
const performanceMonitor = new PerformanceMonitor()

export { performanceMonitor, PerformanceMonitor }
export default performanceMonitor
