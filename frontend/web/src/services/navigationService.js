import { nextTick } from 'vue'
import router from '@/router'

/**
 * Enhanced Navigation Service for handling lazy-loaded routes
 * Provides better error handling and preloading capabilities
 */
class NavigationService {
  constructor() {
    this.isNavigating = false
    this.navigationQueue = []
    this.preloadedComponents = new Set()
    this.navigationHistory = []
    this.retryAttempts = new Map()
  }

  /**
   * Navigate to a route with enhanced error handling and preloading
   * @param {string|object} route - Route path or route object
   * @param {object} options - Navigation options
   */
  async navigateTo(route, options = {}) {
    const { force = false, preload = true, retry = true } = options

    console.log(`🧭 NavigationService: Navigating to ${route}`)

    if (this.isNavigating && !force) {
      console.log('⏳ Navigation in progress, queueing...')
      return this._queueNavigation(route, options)
    }

    this.isNavigating = true
    const startTime = Date.now()

    try {
      // Get route record for preloading
      const routeRecord = this._getRouteRecord(route)

      // Preload component if it's lazy loaded
      if (preload && routeRecord && typeof routeRecord.component === 'function') {
        await this._preloadComponent(routeRecord, route)
      }

      // Perform navigation
      await router.push(route)

      // Wait for DOM update
      await nextTick()

      // Track successful navigation
      const navigationTime = Date.now() - startTime
      this._trackNavigation(route, navigationTime, 'success')

      console.log(`✅ Navigation completed successfully in ${navigationTime}ms`)

      // Clear retry attempts on success
      this.retryAttempts.delete(route)
    } catch (error) {
      console.error('❌ Navigation failed:', error)

      if (retry && this._shouldRetry(route, error)) {
        return this._retryNavigation(route, options)
      }

      throw error
    } finally {
      this.isNavigating = false
      this._processQueue()
    }
  }

  /**
   * Preload a component without navigating to it
   * @param {string} route - Route path
   */
  async preloadRoute(route) {
    const routeRecord = this._getRouteRecord(route)

    if (routeRecord && typeof routeRecord.component === 'function') {
      await this._preloadComponent(routeRecord, route)
    }
  }

  /**
   * Preload multiple routes in parallel
   * @param {string[]} routes - Array of route paths
   */
  async preloadRoutes(routes) {
    console.log(`🚀 Preloading ${routes.length} routes...`)

    const preloadPromises = routes.map(route =>
      this.preloadRoute(route).catch(error => {
        console.warn(`⚠️ Failed to preload ${route}:`, error)
      })
    )

    await Promise.allSettled(preloadPromises)
    console.log('✅ Route preloading completed')
  }

  /**
   * Force refresh current route
   */
  async refresh() {
    console.log('🔄 Refreshing current route...')
    const currentRoute = router.currentRoute.value

    try {
      // Navigate to a temporary route then back
      await router.replace('/loading')
      await nextTick()
      await router.replace(currentRoute.fullPath)
      console.log('✅ Route refreshed successfully')
    } catch (error) {
      console.error('❌ Route refresh failed:', error)
      // Fallback to page reload
      window.location.reload()
    }
  }

  /**
   * Get navigation statistics
   */
  getStatistics() {
    const totalNavigations = this.navigationHistory.length
    const averageTime =
      totalNavigations > 0 ? this.navigationHistory.reduce((sum, nav) => sum + nav.time, 0) / totalNavigations : 0

    const successRate =
      totalNavigations > 0
        ? (this.navigationHistory.filter(nav => nav.status === 'success').length / totalNavigations) * 100
        : 100

    return {
      totalNavigations,
      averageTime: Math.round(averageTime),
      successRate: Math.round(successRate),
      preloadedComponents: this.preloadedComponents.size,
      queueSize: this.navigationQueue.length
    }
  }

  /**
   * Clear navigation history and statistics
   */
  clearHistory() {
    this.navigationHistory = []
    this.retryAttempts.clear()
    console.log('🧹 Navigation history cleared')
  }

  // Private methods
  _getRouteRecord(route) {
    const routePath = typeof route === 'string' ? route : route.path
    return router.getRoutes().find(r => r.path === routePath || r.name === route)
  }

  async _preloadComponent(routeRecord, route) {
    const routeKey = routeRecord.path || route

    if (this.preloadedComponents.has(routeKey)) {
      console.log(`✅ Component already preloaded: ${routeKey}`)
      return
    }

    try {
      console.log(`🚀 Preloading component: ${routeKey}`)
      await routeRecord.component()
      this.preloadedComponents.add(routeKey)
      console.log(`✅ Component preloaded successfully: ${routeKey}`)
    } catch (error) {
      console.error(`❌ Component preload failed: ${routeKey}`, error)
      throw error
    }
  }

  _queueNavigation(route, options) {
    return new Promise(resolve => {
      this.navigationQueue.push({ route, options, resolve })
    })
  }

  _processQueue() {
    if (this.navigationQueue.length > 0) {
      const { route, options, resolve } = this.navigationQueue.shift()
      this.navigateTo(route, options).then(resolve).catch(resolve)
    }
  }

  _shouldRetry(route, error) {
    const routeKey = typeof route === 'string' ? route : route.path
    const attempts = this.retryAttempts.get(routeKey) || 0

    // Retry for chunk loading errors or network issues
    const isRetryableError =
      error.message.includes('Loading chunk') ||
      error.message.includes('Loading CSS chunk') ||
      error.message.includes('fetch') ||
      error.message.includes('network')

    return isRetryableError && attempts < 2
  }

  async _retryNavigation(route, options) {
    const routeKey = typeof route === 'string' ? route : route.path
    const attempts = this.retryAttempts.get(routeKey) || 0

    this.retryAttempts.set(routeKey, attempts + 1)

    console.log(`🔄 Retrying navigation to ${route} (attempt ${attempts + 1})`)

    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000 * (attempts + 1)))

    return this.navigateTo(route, { ...options, retry: false })
  }

  _trackNavigation(route, time, status) {
    this.navigationHistory.push({
      route: typeof route === 'string' ? route : route.path,
      time,
      status,
      timestamp: Date.now()
    })

    // Keep only last 50 navigation records
    if (this.navigationHistory.length > 50) {
      this.navigationHistory = this.navigationHistory.slice(-50)
    }
  }
}

// Create singleton instance
export const navigationService = new NavigationService()

// Auto-preload common routes when service is imported
navigationService.preloadRoutes(['/employees', '/attendance', '/reports']).catch(() => {
  // Silent fail for initial preloading
})

export default navigationService
