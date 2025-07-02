/**
 * Feature Flag System for Gradual Rollout
 * Manages feature rollout strategy with user segmentation
 */

class FeatureFlagManager {
  constructor(options = {}) {
    this.config = {
      apiEndpoint: '/api/v1/feature-flags',
      fallbackFlags: {},
      userId: null,
      userSegments: [],
      environment: process.env.NODE_ENV || 'development',
      cacheTimeout: 300000, // 5 minutes
      enableLocalStorage: true,
      ...options
    }

    this.flags = new Map()
    this.cache = {
      timestamp: 0,
      flags: {}
    }
    this.rolloutPhases = new Map()
    this.userSegments = new Set()
    this.metrics = {
      flagChecks: new Map(),
      exposures: new Map(),
      performance: new Map()
    }

    this.init()
  }

  async init() {
    this.loadFromLocalStorage()
    await this.fetchFlags()
    this.setupRolloutPhases()
    this.startPeriodicSync()
  }

  // Feature flag evaluation
  isEnabled(flagName, context = {}) {
    const startTime = performance.now()

    try {
      const flag = this.getFlag(flagName)
      if (!flag) {
        this.recordMetric('flagChecks', flagName, { result: 'not_found', context })
        return false
      }

      const result = this.evaluateFlag(flag, context)

      if (result) {
        this.recordExposure(flagName, context)
      }

      this.recordMetric('flagChecks', flagName, { result, context })
      return result
    } finally {
      const duration = performance.now() - startTime
      this.recordMetric('performance', flagName, { duration })
    }
  }

  // Get flag configuration
  getFlag(flagName) {
    return this.flags.get(flagName) || this.config.fallbackFlags[flagName]
  }

  // Evaluate flag based on rules
  evaluateFlag(flag, context = {}) {
    // Default enabled state
    if (typeof flag === 'boolean') {
      return flag
    }

    if (typeof flag !== 'object') {
      return false
    }

    // Environment check
    if (flag.environments && !flag.environments.includes(this.config.environment)) {
      return false
    }

    // User segment check
    if (flag.userSegments && flag.userSegments.length > 0) {
      const hasSegment = flag.userSegments.some(
        segment => this.userSegments.has(segment) || this.config.userSegments.includes(segment)
      )
      if (!hasSegment) {
        return false
      }
    }

    // User ID whitelist/blacklist
    if (flag.userWhitelist && this.config.userId) {
      return flag.userWhitelist.includes(this.config.userId)
    }

    if (flag.userBlacklist && this.config.userId) {
      return !flag.userBlacklist.includes(this.config.userId)
    }

    // Percentage rollout
    if (flag.percentage !== undefined) {
      return this.isInPercentageRollout(flag.flagName || 'unknown', flag.percentage)
    }

    // Time-based rollout
    if (flag.startTime && flag.endTime) {
      const now = Date.now()
      return now >= flag.startTime && now <= flag.endTime
    }

    // Custom rules evaluation
    if (flag.rules && flag.rules.length > 0) {
      return this.evaluateRules(flag.rules, context)
    }

    return flag.enabled !== undefined ? flag.enabled : false
  }

  // Percentage-based rollout using consistent hashing
  isInPercentageRollout(flagName, percentage) {
    if (percentage <= 0) return false
    if (percentage >= 100) return true

    const userId = this.config.userId || this.getSessionId()
    const hash = this.hashString(`${flagName}:${userId}`)
    const bucket = hash % 100

    return bucket < percentage
  }

  // Evaluate custom rules
  evaluateRules(rules, context) {
    return rules.every(rule => {
      switch (rule.operator) {
      case 'equals':
        return context[rule.field] === rule.value
      case 'not_equals':
        return context[rule.field] !== rule.value
      case 'contains':
        return String(context[rule.field] || '').includes(rule.value)
      case 'greater_than':
        return Number(context[rule.field]) > Number(rule.value)
      case 'less_than':
        return Number(context[rule.field]) < Number(rule.value)
      case 'in':
        return Array.isArray(rule.value) && rule.value.includes(context[rule.field])
      case 'regex':
        return new RegExp(rule.value).test(String(context[rule.field] || ''))
      default:
        return false
      }
    })
  }

  // Rollout phase management
  setupRolloutPhases() {
    const phases = {
      phase1: {
        name: 'Layout and Navigation',
        startDate: '2024-01-01',
        percentage: 25,
        features: ['new_layout', 'enhanced_navigation', 'sidebar_improvements']
      },
      phase2: {
        name: 'Employee Management',
        startDate: '2024-01-08',
        percentage: 50,
        features: ['employee_table_v2', 'employee_form_enhanced', 'bulk_operations']
      },
      phase3: {
        name: 'Attendance Features',
        startDate: '2024-01-15',
        percentage: 75,
        features: ['attendance_dashboard', 'schedule_management', 'time_tracking']
      },
      phase4: {
        name: 'Advanced Modules',
        startDate: '2024-01-22',
        percentage: 90,
        features: ['reports_v2', 'analytics_dashboard', 'export_improvements']
      },
      phase5: {
        name: 'Performance Optimization',
        startDate: '2024-01-29',
        percentage: 100,
        features: ['lazy_loading', 'code_splitting', 'cache_optimization']
      }
    }

    Object.entries(phases).forEach(([phaseId, phase]) => {
      this.rolloutPhases.set(phaseId, {
        ...phase,
        startTimestamp: new Date(phase.startDate).getTime(),
        isActive: this.isPhaseActive(phase)
      })
    })
  }

  isPhaseActive(phase) {
    const now = Date.now()
    const startTime = new Date(phase.startDate).getTime()
    return now >= startTime
  }

  getCurrentPhase() {
    const now = Date.now()
    let currentPhase = null

    for (const [phaseId, phase] of this.rolloutPhases.entries()) {
      if (phase.startTimestamp <= now) {
        currentPhase = { id: phaseId, ...phase }
      }
    }

    return currentPhase
  }

  // Feature access methods
  hasAccess(feature, context = {}) {
    const phase = this.getCurrentPhase()
    if (!phase) return false

    // Check if feature is in current phase
    if (!phase.features.includes(feature)) {
      return false
    }

    // Check if user is in rollout percentage
    return this.isInPercentageRollout(feature, phase.percentage)
  }

  // User segmentation
  addUserSegment(segment) {
    this.userSegments.add(segment)
  }

  removeUserSegment(segment) {
    this.userSegments.delete(segment)
  }

  setUser(userId, segments = []) {
    this.config.userId = userId
    this.config.userSegments = segments
    segments.forEach(segment => this.addUserSegment(segment))
  }

  // Flag management
  async fetchFlags() {
    // Skip API calls in development mode or if no API endpoint is configured
    if (
      this.config.environment === 'development' ||
      !this.config.apiEndpoint ||
      this.config.apiEndpoint.startsWith('/api/')
    ) {
      console.log('Using fallback feature flags (development mode)')
      this.loadFallbackFlags()
      return
    }

    try {
      const response = await fetch(this.config.apiEndpoint, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': this.config.userId || '',
          'X-Environment': this.config.environment
        }
      })

      if (response.ok) {
        const data = await response.json()
        this.updateFlags(data.flags || data)
        this.cache = {
          timestamp: Date.now(),
          flags: data.flags || data
        }
        this.saveToLocalStorage()
      } else {
        console.warn('Feature flags API returned non-OK status:', response.status)
        this.loadFallbackFlags()
      }
    } catch (error) {
      console.warn('Failed to fetch feature flags:', error)
      this.loadFallbackFlags()
    }
  }

  updateFlags(flagsData) {
    Object.entries(flagsData).forEach(([flagName, flagConfig]) => {
      this.flags.set(flagName, {
        flagName,
        ...flagConfig
      })
    })
  }

  loadFallbackFlags() {
    Object.entries(this.config.fallbackFlags).forEach(([flagName, flagConfig]) => {
      if (!this.flags.has(flagName)) {
        this.flags.set(flagName, flagConfig)
      }
    })
  }

  // Exposure tracking
  recordExposure(flagName, context) {
    if (!this.metrics.exposures.has(flagName)) {
      this.metrics.exposures.set(flagName, [])
    }

    this.metrics.exposures.get(flagName).push({
      timestamp: Date.now(),
      userId: this.config.userId,
      context,
      sessionId: this.getSessionId()
    })
  }

  // Metrics recording
  recordMetric(category, flagName, data) {
    if (!this.metrics[category].has(flagName)) {
      this.metrics[category].set(flagName, [])
    }

    this.metrics[category].get(flagName).push({
      timestamp: Date.now(),
      ...data
    })

    // Trim old metrics to prevent memory leaks
    const metrics = this.metrics[category].get(flagName)
    if (metrics.length > 1000) {
      metrics.splice(0, metrics.length - 1000)
    }
  }

  // Persistence
  saveToLocalStorage() {
    if (!this.config.enableLocalStorage) return

    try {
      const data = {
        flags: Object.fromEntries(this.flags),
        cache: this.cache,
        userSegments: Array.from(this.userSegments),
        timestamp: Date.now()
      }
      localStorage.setItem('featureFlags', JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save feature flags to localStorage:', error)
    }
  }

  loadFromLocalStorage() {
    if (!this.config.enableLocalStorage) return

    try {
      const stored = localStorage.getItem('featureFlags')
      if (stored) {
        const data = JSON.parse(stored)

        // Check if cache is still valid
        if (Date.now() - data.timestamp < this.config.cacheTimeout) {
          this.flags = new Map(Object.entries(data.flags || {}))
          this.cache = data.cache || this.cache
          this.userSegments = new Set(data.userSegments || [])
        }
      }
    } catch (error) {
      console.warn('Failed to load feature flags from localStorage:', error)
    }
  }

  // Periodic sync
  startPeriodicSync() {
    setInterval(() => {
      this.fetchFlags()
    }, this.config.cacheTimeout)
  }

  // Utilities
  hashString(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }

  getSessionId() {
    if (!this.sessionId) {
      this.sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }
    return this.sessionId
  }

  // Analytics and reporting
  getMetrics() {
    return {
      flagChecks: Object.fromEntries(this.metrics.flagChecks),
      exposures: Object.fromEntries(this.metrics.exposures),
      performance: Object.fromEntries(this.metrics.performance),
      activeFlags: Array.from(this.flags.keys()),
      userSegments: Array.from(this.userSegments),
      currentPhase: this.getCurrentPhase()
    }
  }

  generateRolloutReport() {
    const currentPhase = this.getCurrentPhase()
    const flagUsage = new Map()

    // Calculate flag usage statistics
    this.metrics.flagChecks.forEach((checks, flagName) => {
      const totalChecks = checks.length
      const trueResults = checks.filter(check => check.result === true).length
      const exposureRate = totalChecks > 0 ? (trueResults / totalChecks) * 100 : 0

      flagUsage.set(flagName, {
        totalChecks,
        exposures: trueResults,
        exposureRate,
        lastCheck: checks[checks.length - 1]?.timestamp
      })
    })

    return {
      timestamp: Date.now(),
      currentPhase,
      rolloutProgress: {
        totalPhases: this.rolloutPhases.size,
        completedPhases: Array.from(this.rolloutPhases.values()).filter(phase => phase.isActive)
          .length,
        currentPercentage: currentPhase?.percentage || 0
      },
      flagUsage: Object.fromEntries(flagUsage),
      userSegmentation: {
        totalSegments: this.userSegments.size,
        activeSegments: Array.from(this.userSegments)
      },
      recommendations: this.generateRecommendations()
    }
  }

  generateRecommendations() {
    const recommendations = []
    const currentPhase = this.getCurrentPhase()

    // Check for unused flags
    const unusedFlags = Array.from(this.flags.keys()).filter(
      flagName =>
        !this.metrics.flagChecks.has(flagName) || this.metrics.flagChecks.get(flagName).length === 0
    )

    if (unusedFlags.length > 0) {
      recommendations.push({
        type: 'cleanup',
        priority: 'low',
        message: `${unusedFlags.length} flags are not being used and can be removed`,
        flags: unusedFlags
      })
    }

    // Check for flags with low exposure rates
    const lowExposureFlags = []
    this.metrics.flagChecks.forEach((checks, flagName) => {
      const trueResults = checks.filter(check => check.result === true).length
      const exposureRate = checks.length > 0 ? (trueResults / checks.length) * 100 : 0

      if (exposureRate < 10 && checks.length > 50) {
        lowExposureFlags.push({ flagName, exposureRate })
      }
    })

    if (lowExposureFlags.length > 0) {
      recommendations.push({
        type: 'exposure',
        priority: 'medium',
        message: `${lowExposureFlags.length} flags have low exposure rates`,
        flags: lowExposureFlags
      })
    }

    // Phase progression recommendations
    if (currentPhase && currentPhase.percentage < 100) {
      const nextPhase = this.getNextPhase(currentPhase.id)
      if (nextPhase) {
        recommendations.push({
          type: 'rollout',
          priority: 'high',
          message: `Ready to proceed to ${nextPhase.name}?`,
          nextPhase
        })
      }
    }

    return recommendations
  }

  getNextPhase(currentPhaseId) {
    const phases = Array.from(this.rolloutPhases.entries())
    const currentIndex = phases.findIndex(([id]) => id === currentPhaseId)

    if (currentIndex >= 0 && currentIndex < phases.length - 1) {
      const [nextId, nextPhase] = phases[currentIndex + 1]
      return { id: nextId, ...nextPhase }
    }

    return null
  }

  // Emergency controls
  enableEmergencyMode() {
    this.flags.clear()
    this.loadFallbackFlags()
    console.warn('Emergency mode enabled - using fallback flags only')
  }

  killSwitch(flagName) {
    this.flags.set(flagName, false)
    console.warn(`Kill switch activated for flag: ${flagName}`)
  }

  // Public API
  variant(flagName, variants = {}, context = {}) {
    const flag = this.getFlag(flagName)
    if (!flag || !flag.variants) {
      return variants.default
    }

    // Evaluate variant based on percentage distribution
    const userId = this.config.userId || this.getSessionId()
    const hash = this.hashString(`${flagName}:variant:${userId}`)
    const bucket = hash % 100

    let currentPercentage = 0
    for (const [variantName, percentage] of Object.entries(flag.variants)) {
      currentPercentage += percentage
      if (bucket < currentPercentage) {
        this.recordExposure(`${flagName}:${variantName}`, context)
        return variants[variantName] || variants.default
      }
    }

    return variants.default
  }
}

// Create singleton instance
const featureFlags = new FeatureFlagManager()

// Vue integration
export function useFeatureFlags() {
  return {
    isEnabled: (flag, context) => featureFlags.isEnabled(flag, context),
    hasAccess: (feature, context) => featureFlags.hasAccess(feature, context),
    variant: (flag, variants, context) => featureFlags.variant(flag, variants, context),
    getCurrentPhase: () => featureFlags.getCurrentPhase(),
    getMetrics: () => featureFlags.getMetrics(),
    addUserSegment: segment => featureFlags.addUserSegment(segment),
    setUser: (userId, segments) => featureFlags.setUser(userId, segments)
  }
}

export { FeatureFlagManager, featureFlags }
export default featureFlags
