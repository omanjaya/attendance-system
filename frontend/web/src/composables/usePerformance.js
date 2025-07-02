import { nextTick, onMounted, onUnmounted, ref } from 'vue'

/**
 * Performance monitoring and optimization composable
 */
export const usePerformance = () => {
  // State
  const metrics = ref({
    pageLoad: 0,
    renderTime: 0,
    firstContentfulPaint: 0,
    timeToInteractive: 0,
    memoryUsage: 0
  })

  const performanceObserver = ref(null)
  const intersectionObserver = ref(null)

  /**
   * Performance monitoring
   */
  const monitoring = {
    /**
     * Start performance monitoring
     */
    start: () => {
      // Performance Observer for measuring render times
      if ('PerformanceObserver' in window) {
        performanceObserver.value = new PerformanceObserver(list => {
          const entries = list.getEntries()

          entries.forEach(entry => {
            switch (entry.entryType) {
            case 'navigation':
              metrics.value.pageLoad = entry.loadEventEnd - entry.loadEventStart
              break
            case 'paint':
              if (entry.name === 'first-contentful-paint') {
                metrics.value.firstContentfulPaint = entry.startTime
              }
              break
            case 'measure':
              if (entry.name.startsWith('vue-render')) {
                metrics.value.renderTime = entry.duration
              }
              break
            }
          })
        })

        performanceObserver.value.observe({
          entryTypes: ['navigation', 'paint', 'measure']
        })
      }

      // Memory usage monitoring
      if ('memory' in performance) {
        setInterval(() => {
          metrics.value.memoryUsage = performance.memory.usedJSHeapSize / 1024 / 1024 // MB
        }, 5000)
      }
    },

    /**
     * Stop performance monitoring
     */
    stop: () => {
      if (performanceObserver.value) {
        performanceObserver.value.disconnect()
        performanceObserver.value = null
      }
    },

    /**
     * Mark custom performance points
     */
    mark: name => {
      if ('performance' in window) {
        performance.mark(name)
      }
    },

    /**
     * Measure time between marks
     */
    measure: (name, startMark, endMark) => {
      if ('performance' in window) {
        try {
          performance.measure(name, startMark, endMark)
        } catch (error) {
          console.warn('Performance measure failed:', error)
        }
      }
    }
  }

  /**
   * Lazy loading utilities
   */
  const lazyLoading = {
    /**
     * Observe element for lazy loading
     */
    observe: (element, callback, options = {}) => {
      if (!intersectionObserver.value) {
        intersectionObserver.value = new IntersectionObserver(
          entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                callback(entry.target)
                intersectionObserver.value.unobserve(entry.target)
              }
            })
          },
          {
            rootMargin: '50px',
            threshold: 0.1,
            ...options
          }
        )
      }

      intersectionObserver.value.observe(element)
    },

    /**
     * Lazy load images
     */
    lazyLoadImages: (container = document) => {
      const images = container.querySelectorAll('img[data-src]')

      images.forEach(img => {
        lazyLoading.observe(img, element => {
          element.src = element.dataset.src
          element.removeAttribute('data-src')
          element.classList.add('loaded')
        })
      })
    },

    /**
     * Lazy load components
     */
    lazyLoadComponent: (element, loader) => {
      lazyLoading.observe(element, async () => {
        try {
          await loader()
        } catch (error) {
          console.error('Lazy component loading failed:', error)
        }
      })
    }
  }

  /**
   * Code splitting utilities
   */
  const codeSplitting = {
    /**
     * Preload route component
     */
    preloadRoute: async routeName => {
      try {
        const router = getCurrentInstance()?.appContext.app.config.globalProperties.$router
        if (router) {
          const route = router.getRoutes().find(r => r.name === routeName)
          if (route?.component && typeof route.component === 'function') {
            await route.component()
          }
        }
      } catch (error) {
        console.warn('Route preload failed:', error)
      }
    },

    /**
     * Dynamic import with error handling
     */
    dynamicImport: async (importFn, fallback = null) => {
      try {
        return await importFn()
      } catch (error) {
        console.error('Dynamic import failed:', error)
        return fallback
      }
    }
  }

  /**
   * Bundle analysis utilities
   */
  const bundleAnalysis = {
    /**
     * Get bundle information
     */
    getBundleInfo: () => {
      const scripts = Array.from(document.querySelectorAll('script[src]'))
      const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))

      return {
        scripts: scripts.map(s => ({
          src: s.src,
          size: s.dataset.size || 'unknown'
        })),
        styles: styles.map(s => ({
          href: s.href,
          size: s.dataset.size || 'unknown'
        })),
        totalScripts: scripts.length,
        totalStyles: styles.length
      }
    },

    /**
     * Analyze unused CSS
     */
    analyzeUnusedCSS: () => {
      const usedSelectors = new Set()
      const allSelectors = new Set()

      // Get all CSS rules
      Array.from(document.styleSheets).forEach(sheet => {
        try {
          Array.from(sheet.cssRules || []).forEach(rule => {
            if (rule.selectorText) {
              allSelectors.add(rule.selectorText)

              // Check if selector is used
              try {
                if (document.querySelector(rule.selectorText)) {
                  usedSelectors.add(rule.selectorText)
                }
              } catch (e) {
                // Invalid selector
              }
            }
          })
        } catch (e) {
          // Cross-origin stylesheet
        }
      })

      return {
        total: allSelectors.size,
        used: usedSelectors.size,
        unused: allSelectors.size - usedSelectors.size,
        unusedPercentage: (
          ((allSelectors.size - usedSelectors.size) / allSelectors.size) *
          100
        ).toFixed(2)
      }
    }
  }

  /**
   * Caching utilities
   */
  const caching = {
    /**
     * Cache API responses
     */
    cacheResponse: (key, data, ttl = 300000) => {
      // 5 minutes default
      const item = {
        data,
        timestamp: Date.now(),
        ttl
      }

      try {
        localStorage.setItem(`cache_${key}`, JSON.stringify(item))
      } catch (error) {
        console.warn('Failed to cache response:', error)
      }
    },

    /**
     * Get cached response
     */
    getCachedResponse: key => {
      try {
        const item = localStorage.getItem(`cache_${key}`)
        if (!item) return null

        const parsed = JSON.parse(item)
        const now = Date.now()

        if (now - parsed.timestamp > parsed.ttl) {
          localStorage.removeItem(`cache_${key}`)
          return null
        }

        return parsed.data
      } catch (error) {
        console.warn('Failed to get cached response:', error)
        return null
      }
    },

    /**
     * Clear expired cache
     */
    clearExpiredCache: () => {
      const now = Date.now()

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('cache_')) {
          try {
            const item = JSON.parse(localStorage.getItem(key))
            if (now - item.timestamp > item.ttl) {
              localStorage.removeItem(key)
            }
          } catch (error) {
            localStorage.removeItem(key)
          }
        }
      })
    }
  }

  /**
   * Virtual scrolling utilities
   */
  const virtualScrolling = {
    /**
     * Calculate visible items for virtual scrolling
     */
    calculateVisibleItems: (containerHeight, itemHeight, scrollTop, totalItems, buffer = 3) => {
      const visibleCount = Math.ceil(containerHeight / itemHeight)
      const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - buffer)
      const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + buffer * 2)

      return {
        startIndex,
        endIndex,
        visibleCount,
        offsetY: startIndex * itemHeight
      }
    },

    /**
     * Create virtual scroll container
     */
    createVirtualContainer: (items, itemHeight, containerHeight) => {
      const totalHeight = items.length * itemHeight
      const visibleItems = ref([])
      const offsetY = ref(0)

      const updateVisibleItems = scrollTop => {
        const result = virtualScrolling.calculateVisibleItems(
          containerHeight,
          itemHeight,
          scrollTop,
          items.length
        )

        visibleItems.value = items.slice(result.startIndex, result.endIndex + 1)
        offsetY.value = result.offsetY
      }

      return {
        visibleItems,
        offsetY,
        totalHeight,
        updateVisibleItems
      }
    }
  }

  /**
   * Initialize performance optimization
   */
  const init = () => {
    monitoring.start()
    caching.clearExpiredCache()

    // Preload critical resources
    nextTick(() => {
      lazyLoading.lazyLoadImages()
    })
  }

  /**
   * Cleanup
   */
  const cleanup = () => {
    monitoring.stop()

    if (intersectionObserver.value) {
      intersectionObserver.value.disconnect()
      intersectionObserver.value = null
    }
  }

  return {
    // State
    metrics,

    // Performance monitoring
    monitoring,

    // Lazy loading
    lazyLoading,

    // Code splitting
    codeSplitting,

    // Bundle analysis
    bundleAnalysis,

    // Caching
    caching,

    // Virtual scrolling
    virtualScrolling,

    // Lifecycle
    init,
    cleanup
  }
}

/**
 * Performance directive for measuring component render times
 */
export const performanceDirective = {
  beforeMount(el, binding) {
    const name = binding.value || 'component'
    performance.mark(`${name}-start`)
  },

  mounted(el, binding) {
    const name = binding.value || 'component'
    performance.mark(`${name}-end`)
    performance.measure(`vue-render-${name}`, `${name}-start`, `${name}-end`)
  }
}

/**
 * Lazy loading directive
 */
export const lazyDirective = {
  mounted(el, binding) {
    const { lazyLoading } = usePerformance()

    if (binding.value && typeof binding.value === 'function') {
      lazyLoading.observe(el, binding.value)
    } else if (el.tagName === 'IMG' && el.dataset.src) {
      lazyLoading.observe(el, element => {
        element.src = element.dataset.src
        element.removeAttribute('data-src')
        element.classList.add('loaded')
      })
    }
  }
}

export default usePerformance
