/**
 * Vue Performance Monitoring Plugin
 * Integrates performance monitoring with Vue application
 */

import performanceMonitor from '@/utils/performanceMonitor'
import { nextTick } from 'vue'

export default {
  install(app, options = {}) {
    const config = {
      enableComponentTracking: true,
      enableRouteTracking: true,
      enableErrorTracking: true,
      enableUserInteractionTracking: true,
      sampleRate: 1.0,
      ...options
    }

    // Make performance monitor available globally
    app.config.globalProperties.$performance = performanceMonitor
    app.provide('performanceMonitor', performanceMonitor)

    // Configure performance monitor
    performanceMonitor.config = { ...performanceMonitor.config, ...config }

    // Component lifecycle tracking
    if (config.enableComponentTracking) {
      setupComponentTracking(app)
    }

    // Route tracking
    if (config.enableRouteTracking) {
      setupRouteTracking(app)
    }

    // Error tracking
    if (config.enableErrorTracking) {
      setupErrorTracking(app)
    }

    // User interaction tracking
    if (config.enableUserInteractionTracking) {
      setupUserInteractionTracking(app)
    }

    // Vue-specific metrics
    setupVueMetrics(app)
  }
}

function setupComponentTracking(app) {
  const originalMount = app.mount
  app.mount = function (rootContainer) {
    performanceMonitor.mark('app-mount-start')
    const result = originalMount.call(this, rootContainer)
    performanceMonitor.mark('app-mount-end')
    performanceMonitor.measure('app-mount-duration', 'app-mount-start', 'app-mount-end')

    performanceMonitor.recordMetric('appLifecycle', {
      event: 'mount',
      timestamp: Date.now()
    })

    return result
  }

  // Track component render performance
  const componentRenderTimes = new Map()

  app.mixin({
    beforeCreate() {
      if (Math.random() <= performanceMonitor.config.sampleRate) {
        const componentName = this.$options.name || this.$options.__name || 'Anonymous'
        const startTime = performance.now()
        componentRenderTimes.set(this, { componentName, startTime })
      }
    },

    mounted() {
      const renderData = componentRenderTimes.get(this)
      if (renderData) {
        const endTime = performance.now()
        const renderTime = endTime - renderData.startTime

        performanceMonitor.recordMetric('componentRender', {
          component: renderData.componentName,
          renderTime,
          phase: 'mount',
          timestamp: Date.now()
        })

        componentRenderTimes.delete(this)
      }
    },

    beforeUpdate() {
      if (Math.random() <= performanceMonitor.config.sampleRate) {
        const componentName = this.$options.name || this.$options.__name || 'Anonymous'
        const startTime = performance.now()
        componentRenderTimes.set(this, { componentName, startTime, isUpdate: true })
      }
    },

    updated() {
      const renderData = componentRenderTimes.get(this)
      if (renderData && renderData.isUpdate) {
        const endTime = performance.now()
        const renderTime = endTime - renderData.startTime

        performanceMonitor.recordMetric('componentRender', {
          component: renderData.componentName,
          renderTime,
          phase: 'update',
          timestamp: Date.now()
        })

        componentRenderTimes.delete(this)
      }
    },

    beforeUnmount() {
      componentRenderTimes.delete(this)
    },

    errorCaptured(err, vm, info) {
      performanceMonitor.recordMetric('componentError', {
        error: err.message,
        component: vm?.$options.name || 'Unknown',
        info,
        stack: err.stack,
        timestamp: Date.now()
      })

      return false // Let error propagate
    }
  })
}

function setupRouteTracking(app) {
  let routeStartTime = null
  let currentRoute = null

  // Track route navigation performance
  const trackRouteChange = (to, from) => {
    if (routeStartTime && currentRoute) {
      const navigationTime = performance.now() - routeStartTime

      performanceMonitor.recordMetric('routeNavigation', {
        from: from ? from.path : null,
        to: to.path,
        navigationTime,
        timestamp: Date.now()
      })
    }

    routeStartTime = performance.now()
    currentRoute = to
  }

  // Track route load performance
  const trackRouteLoad = to => {
    nextTick(() => {
      if (routeStartTime) {
        const loadTime = performance.now() - routeStartTime

        performanceMonitor.recordMetric('routeLoad', {
          route: to.path,
          loadTime,
          timestamp: Date.now()
        })

        routeStartTime = null
      }
    })
  }

  // Provide methods to be used with router
  app.config.globalProperties.$trackRouteChange = trackRouteChange
  app.config.globalProperties.$trackRouteLoad = trackRouteLoad
}

function setupErrorTracking(app) {
  // Vue error handler
  app.config.errorHandler = (err, vm, info) => {
    performanceMonitor.recordMetric('vueError', {
      error: err.message,
      component: vm?.$options.name || vm?.$options.__name || 'Unknown',
      info,
      stack: err.stack,
      timestamp: Date.now()
    })

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Vue Error:', err, vm, info)
    }
  }

  // Warning handler
  app.config.warnHandler = (msg, vm, trace) => {
    performanceMonitor.recordMetric('vueWarning', {
      message: msg,
      component: vm?.$options.name || vm?.$options.__name || 'Unknown',
      trace,
      timestamp: Date.now()
    })

    if (process.env.NODE_ENV === 'development') {
      console.warn('Vue Warning:', msg, vm, trace)
    }
  }
}

function setupUserInteractionTracking(app) {
  const trackInteraction = (event, element, metadata = {}) => {
    performanceMonitor.trackUserInteraction(event, element, {
      ...metadata,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    })
  }

  // Provide interaction tracking method
  app.config.globalProperties.$trackInteraction = trackInteraction

  // Auto-track common interactions
  if (typeof window !== 'undefined') {
    // Track clicks
    document.addEventListener('click', event => {
      if (Math.random() <= performanceMonitor.config.sampleRate) {
        const target = event.target
        const targetInfo = {
          tagName: target.tagName,
          className: target.className,
          id: target.id,
          textContent: target.textContent?.substring(0, 50) || ''
        }

        trackInteraction('click', targetInfo, {
          x: event.clientX,
          y: event.clientY
        })
      }
    })

    // Track form submissions
    document.addEventListener('submit', event => {
      const form = event.target
      trackInteraction('form-submit', {
        formId: form.id,
        formName: form.name,
        action: form.action
      })
    })

    // Track input focus (for engagement metrics)
    document.addEventListener(
      'focus',
      event => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
          trackInteraction('input-focus', {
            inputType: event.target.type,
            inputName: event.target.name
          })
        }
      },
      true
    )
  }
}

function setupVueMetrics(app) {
  // Track Vue-specific performance metrics
  const vueMetrics = {
    totalComponents: 0,
    activeComponents: 0,
    rerenderCount: 0,
    errorCount: 0
  }

  app.mixin({
    created() {
      vueMetrics.totalComponents++
      vueMetrics.activeComponents++
    },

    updated() {
      vueMetrics.rerenderCount++
    },

    beforeUnmount() {
      vueMetrics.activeComponents--
    }
  })

  // Periodic Vue metrics reporting
  setInterval(() => {
    performanceMonitor.recordMetric('vueMetrics', {
      ...vueMetrics,
      timestamp: Date.now()
    })
  }, 30000) // Every 30 seconds

  // Make Vue metrics available globally
  app.config.globalProperties.$vueMetrics = vueMetrics
}

// Performance composable for use in components
export function usePerformance() {
  const startTimer = label => {
    const startTime = performance.now()
    return {
      end: () => {
        const endTime = performance.now()
        const duration = endTime - startTime

        performanceMonitor.recordMetric('customTimer', {
          label,
          duration,
          timestamp: Date.now()
        })

        return duration
      }
    }
  }

  const markComponent = (componentName, action) => {
    performanceMonitor.mark(`${componentName}-${action}`)
  }

  const measureComponent = (componentName, startAction, endAction) => {
    const measureName = `${componentName}-duration`
    performanceMonitor.measure(measureName, `${componentName}-${startAction}`, `${componentName}-${endAction}`)
  }

  const trackAsyncOperation = async (operationName, asyncFunction) => {
    const startTime = performance.now()

    try {
      const result = await asyncFunction()
      const endTime = performance.now()

      performanceMonitor.recordMetric('asyncOperation', {
        operation: operationName,
        duration: endTime - startTime,
        success: true,
        timestamp: Date.now()
      })

      return result
    } catch (error) {
      const endTime = performance.now()

      performanceMonitor.recordMetric('asyncOperation', {
        operation: operationName,
        duration: endTime - startTime,
        success: false,
        error: error.message,
        timestamp: Date.now()
      })

      throw error
    }
  }

  const getMetrics = category => {
    return performanceMonitor.getMetrics(category)
  }

  const getPerformanceSummary = () => {
    return performanceMonitor.getPerformanceSummary()
  }

  return {
    startTimer,
    markComponent,
    measureComponent,
    trackAsyncOperation,
    getMetrics,
    getPerformanceSummary,
    performanceMonitor
  }
}

// Performance directive for tracking specific elements
export const performanceDirective = {
  mounted(el, binding) {
    const { value, modifiers } = binding

    if (modifiers.click) {
      el.addEventListener('click', () => {
        performanceMonitor.trackUserInteraction('directive-click', {
          element: el.tagName,
          value: value || 'unknown'
        })
      })
    }

    if (modifiers.visible) {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            performanceMonitor.recordMetric('elementVisible', {
              element: el.tagName,
              value: value || 'unknown',
              timestamp: Date.now()
            })
          }
        })
      })

      observer.observe(el)
      el._performanceObserver = observer
    }
  },

  beforeUnmount(el) {
    if (el._performanceObserver) {
      el._performanceObserver.disconnect()
    }
  }
}
