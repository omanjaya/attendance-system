<template>
  <div class="monitoring-dashboard">
    <div class="row">
      <div class="col-12">
        <div class="page-header">
          <h1 class="page-title">System Monitoring</h1>
          <div class="page-actions">
            <button class="btn btn-primary" :disabled="loading" @click="refreshData">
              <TablerIcon name="refresh" />
              Refresh
            </button>
            <button class="btn btn-outline-primary" @click="exportMetrics">
              <TablerIcon name="download" />
              Export
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Overview -->
    <div class="row mb-4">
      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="me-3">
                <div class="icon bg-primary text-white rounded">
                  <TablerIcon name="clock" />
                </div>
              </div>
              <div>
                <div class="text-muted">Page Load Time</div>
                <div class="h3 mb-0">
                  {{ formatTime(performanceMetrics.pageLoad?.avgLoadTime) }}
                </div>
                <div :class="getTrendClass(performanceMetrics.pageLoad?.trend)">
                  {{ performanceMetrics.pageLoad?.trend || 'stable' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="me-3">
                <div class="icon bg-success text-white rounded">
                  <TablerIcon name="cpu" />
                </div>
              </div>
              <div>
                <div class="text-muted">Memory Usage</div>
                <div class="h3 mb-0">
                  {{ formatMemory(performanceMetrics.memory?.current?.usedJSHeapSize) }}
                </div>
                <div :class="getTrendClass(performanceMetrics.memory?.trend)">
                  {{ performanceMetrics.memory?.trend || 'stable' }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="me-3">
                <div class="icon bg-warning text-white rounded">
                  <TablerIcon name="alert-triangle" />
                </div>
              </div>
              <div>
                <div class="text-muted">Error Rate</div>
                <div class="h3 mb-0">{{ (performanceMetrics.errors?.errorRate * 100).toFixed(2) }}%</div>
                <div class="text-sm text-muted">{{ performanceMetrics.errors?.jsErrors || 0 }} errors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-3 col-md-6">
        <div class="card">
          <div class="card-body">
            <div class="d-flex align-items-center">
              <div class="me-3">
                <div class="icon bg-info text-white rounded">
                  <TablerIcon name="users" />
                </div>
              </div>
              <div>
                <div class="text-muted">Active Users</div>
                <div class="h3 mb-0">
                  {{ performanceMetrics.userExperience?.interactions || 0 }}
                </div>
                <div class="text-sm text-muted">
                  Engagement: {{ performanceMetrics.userExperience?.engagementScore || 0 }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Web Vitals -->
    <div class="row mb-4">
      <div class="col-lg-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Core Web Vitals</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-4">
                <div class="text-center">
                  <div class="h2 mb-0" :class="getVitalsColor('lcp', performanceMetrics.webVitals?.lcp)">
                    {{ formatTime(performanceMetrics.webVitals?.lcp) }}
                  </div>
                  <div class="text-muted">LCP (Largest Contentful Paint)</div>
                  <div class="progress mt-2" style="height: 4px">
                    <div
                      class="progress-bar"
                      :class="getVitalsProgressClass('lcp', performanceMetrics.webVitals?.lcp)"
                      :style="{
                        width: getVitalsProgress('lcp', performanceMetrics.webVitals?.lcp) + '%'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">
                  <div class="h2 mb-0" :class="getVitalsColor('fid', performanceMetrics.webVitals?.fid)">
                    {{ formatTime(performanceMetrics.webVitals?.fid) }}
                  </div>
                  <div class="text-muted">FID (First Input Delay)</div>
                  <div class="progress mt-2" style="height: 4px">
                    <div
                      class="progress-bar"
                      :class="getVitalsProgressClass('fid', performanceMetrics.webVitals?.fid)"
                      :style="{
                        width: getVitalsProgress('fid', performanceMetrics.webVitals?.fid) + '%'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="text-center">
                  <div class="h2 mb-0" :class="getVitalsColor('cls', performanceMetrics.webVitals?.cls)">
                    {{ (performanceMetrics.webVitals?.cls || 0).toFixed(3) }}
                  </div>
                  <div class="text-muted">CLS (Cumulative Layout Shift)</div>
                  <div class="progress mt-2" style="height: 4px">
                    <div
                      class="progress-bar"
                      :class="getVitalsProgressClass('cls', performanceMetrics.webVitals?.cls)"
                      :style="{
                        width: getVitalsProgress('cls', performanceMetrics.webVitals?.cls) + '%'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-4">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Code Quality Score</h3>
          </div>
          <div class="card-body text-center">
            <div class="chart-circle chart-circle-lg" :data-value="codeQualityMetrics.overallScore">
              <div class="chart-circle-value">
                {{ Math.round(codeQualityMetrics.overallScore || 0) }}
              </div>
            </div>
            <div class="text-muted mt-2">Overall Quality Rating</div>
            <div class="mt-3">
              <div class="row">
                <div class="col-6">
                  <div class="text-sm text-muted">Complexity</div>
                  <div class="font-weight-medium">
                    {{ codeQualityMetrics.complexity?.rating || 'N/A' }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-sm text-muted">Coverage</div>
                  <div class="font-weight-medium">
                    {{ Math.round(codeQualityMetrics.coverage?.statements?.percentage || 0) }}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Bundle Analysis -->
    <div class="row mb-4">
      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Bundle Size Analysis</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <span>Total Bundle Size</span>
                <span class="font-weight-medium">{{ formatSize(bundleMetrics.totalSize) }}</span>
              </div>
              <div class="progress mt-1" style="height: 6px">
                <div
                  class="progress-bar"
                  :class="getBundleSizeClass(bundleMetrics.totalSize)"
                  :style="{ width: getBundleSizeProgress(bundleMetrics.totalSize) + '%' }"
                ></div>
              </div>
            </div>

            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <span>Gzipped Size</span>
                <span class="font-weight-medium">{{ formatSize(bundleMetrics.gzippedSize) }}</span>
              </div>
              <div class="text-muted text-sm">
                Compression ratio:
                {{ ((bundleMetrics.gzippedSize / bundleMetrics.totalSize) * 100).toFixed(1) }}%
              </div>
            </div>

            <div class="list-group list-group-flush">
              <div
                v-for="chunk in bundleMetrics.largestChunks"
                :key="chunk.path"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div class="font-weight-medium">{{ chunk.name }}</div>
                  <div class="text-muted text-sm">{{ chunk.path }}</div>
                </div>
                <span class="badge" :class="chunk.isLarge ? 'bg-warning' : 'bg-success'">
                  {{ formatSize(chunk.size) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Feature Flags Status</h3>
          </div>
          <div class="card-body">
            <div class="mb-3">
              <div class="d-flex justify-content-between align-items-center">
                <span>Current Rollout Phase</span>
                <span class="badge bg-primary">{{ rolloutMetrics.currentPhase?.name || 'None' }}</span>
              </div>
              <div class="progress mt-1" style="height: 6px">
                <div
                  class="progress-bar bg-primary"
                  :style="{ width: (rolloutMetrics.currentPhase?.percentage || 0) + '%' }"
                ></div>
              </div>
              <div class="text-muted text-sm mt-1">
                {{ rolloutMetrics.currentPhase?.percentage || 0 }}% rollout completion
              </div>
            </div>

            <div class="list-group list-group-flush">
              <div
                v-for="flag in rolloutMetrics.activeFlags"
                :key="flag.name"
                class="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <div class="font-weight-medium">{{ flag.name }}</div>
                  <div class="text-muted text-sm">{{ flag.exposures }} exposures</div>
                </div>
                <span class="badge" :class="flag.enabled ? 'bg-success' : 'bg-secondary'">
                  {{ flag.enabled ? 'Active' : 'Inactive' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Optimization Recommendations</h3>
          </div>
          <div class="card-body">
            <div v-if="recommendations.length === 0" class="text-center text-muted py-4">
              <TablerIcon name="check-circle" size="48" class="mb-2" />
              <div>No recommendations at this time</div>
              <div class="text-sm">Your application is performing well!</div>
            </div>

            <div v-else class="list-group list-group-flush">
              <div v-for="(recommendation, index) in recommendations" :key="index" class="list-group-item">
                <div class="d-flex align-items-start">
                  <div class="me-3">
                    <div class="badge rounded-pill" :class="getPriorityClass(recommendation.priority)">
                      {{ recommendation.priority }}
                    </div>
                  </div>
                  <div class="flex-fill">
                    <div class="font-weight-medium">{{ recommendation.title }}</div>
                    <div class="text-muted">{{ recommendation.message }}</div>
                    <div v-if="recommendation.actions" class="mt-2">
                      <button
                        v-for="(action, actionIndex) in recommendation.actions"
                        :key="actionIndex"
                        class="btn btn-sm btn-outline-primary me-2"
                        @click="executeAction(action)"
                      >
                        {{ action.label }}
                      </button>
                    </div>
                  </div>
                  <div class="ms-3">
                    <button class="btn btn-sm btn-ghost-secondary" @click="dismissRecommendation(index)">
                      <TablerIcon name="x" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref } from 'vue'
import { usePerformance } from '@/plugins/performancePlugin'
import { useFeatureFlags } from '@/utils/featureFlags'
import codeQualityMetrics from '@/utils/codeQualityMetrics'
import TablerIcon from '@/components/common/TablerIcon.vue'

export default {
  name: 'MonitoringDashboard',
  components: {
    TablerIcon
  },
  setup() {
    const loading = ref(false)
    const { getPerformanceSummary, performanceMonitor } = usePerformance()
    const { getMetrics, getCurrentPhase } = useFeatureFlags()

    const performanceMetrics = reactive({
      webVitals: {},
      memory: {},
      network: {},
      errors: {},
      userExperience: {},
      pageLoad: {}
    })

    const codeQualityMetrics = reactive({
      overallScore: 0,
      complexity: {},
      coverage: {},
      debt: {}
    })

    const bundleMetrics = reactive({
      totalSize: 0,
      gzippedSize: 0,
      largestChunks: [],
      recommendations: []
    })

    const rolloutMetrics = reactive({
      currentPhase: null,
      activeFlags: [],
      rolloutProgress: 0
    })

    const recommendations = ref([])

    const refreshData = async () => {
      loading.value = true
      try {
        await Promise.all([
          loadPerformanceMetrics(),
          loadCodeQualityMetrics(),
          loadBundleMetrics(),
          loadRolloutMetrics(),
          generateRecommendations()
        ])
      } finally {
        loading.value = false
      }
    }

    const loadPerformanceMetrics = async () => {
      const summary = getPerformanceSummary()
      Object.assign(performanceMetrics, summary)
    }

    const loadCodeQualityMetrics = async () => {
      const qualityData = codeQualityMetrics.getQualityOverview()
      Object.assign(codeQualityMetrics, qualityData)
    }

    const loadBundleMetrics = async () => {
      try {
        const response = await fetch('/bundle-analysis.json')
        if (response.ok) {
          const data = await response.json()
          bundleMetrics.totalSize = data.totalSize || 0
          bundleMetrics.gzippedSize = data.gzippedSize || 0
          bundleMetrics.largestChunks = (data.chunks || [])
            .sort((a, b) => b.size - a.size)
            .slice(0, 5)
            .map(chunk => ({
              name: chunk.path.split('/').pop(),
              path: chunk.path,
              size: chunk.size,
              isLarge: chunk.isLarge
            }))
        }
      } catch (error) {
        console.warn('Failed to load bundle metrics:', error)
      }
    }

    const loadRolloutMetrics = async () => {
      const flagMetrics = getMetrics()
      const currentPhase = getCurrentPhase()

      rolloutMetrics.currentPhase = currentPhase
      rolloutMetrics.activeFlags = (flagMetrics.activeFlags || []).map(flagName => ({
        name: flagName,
        enabled: true, // Simplified
        exposures: flagMetrics.exposures?.[flagName]?.length || 0
      }))
    }

    const generateRecommendations = async () => {
      const recs = []

      // Performance recommendations
      if (performanceMetrics.webVitals?.lcp > 2500) {
        recs.push({
          type: 'performance',
          priority: 'high',
          title: 'Improve Largest Contentful Paint',
          message: 'LCP is above 2.5s. Consider optimizing images and critical resources.',
          actions: [
            { label: 'Optimize Images', action: 'optimize-images' },
            { label: 'Analyze Critical Path', action: 'analyze-critical-path' }
          ]
        })
      }

      // Bundle size recommendations
      if (bundleMetrics.totalSize > 2 * 1024 * 1024) {
        recs.push({
          type: 'bundle',
          priority: 'medium',
          title: 'Large Bundle Size',
          message: `Bundle size (${formatSize(bundleMetrics.totalSize)}) exceeds 2MB. Consider code splitting.`,
          actions: [
            { label: 'Analyze Bundle', action: 'analyze-bundle' },
            { label: 'Enable Code Splitting', action: 'enable-code-splitting' }
          ]
        })
      }

      // Code quality recommendations
      if (codeQualityMetrics.overallScore < 70) {
        recs.push({
          type: 'quality',
          priority: 'medium',
          title: 'Code Quality Below Threshold',
          message: 'Code quality score is below 70. Review complexity and test coverage.',
          actions: [
            { label: 'Review Complexity', action: 'review-complexity' },
            { label: 'Improve Coverage', action: 'improve-coverage' }
          ]
        })
      }

      recommendations.value = recs
    }

    const exportMetrics = () => {
      const data = {
        timestamp: Date.now(),
        performance: performanceMetrics,
        codeQuality: codeQualityMetrics,
        bundle: bundleMetrics,
        rollout: rolloutMetrics,
        recommendations: recommendations.value
      }

      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `monitoring-report-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    }

    const executeAction = action => {
      console.log('Executing action:', action)
      // Implementation would depend on the specific action
    }

    const dismissRecommendation = index => {
      recommendations.value.splice(index, 1)
    }

    // Utility functions
    const formatTime = ms => {
      if (!ms) return 'N/A'
      if (ms < 1000) return `${Math.round(ms)}ms`
      return `${(ms / 1000).toFixed(2)}s`
    }

    const formatMemory = bytes => {
      if (!bytes) return 'N/A'
      const mb = bytes / (1024 * 1024)
      return `${mb.toFixed(1)}MB`
    }

    const formatSize = bytes => {
      if (!bytes) return '0 B'
      const k = 1024
      const sizes = ['B', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
    }

    const getTrendClass = trend => {
      switch (trend) {
        case 'increasing':
          return 'text-danger'
        case 'decreasing':
          return 'text-success'
        default:
          return 'text-muted'
      }
    }

    const getVitalsColor = (metric, value) => {
      if (!value) return 'text-muted'

      const thresholds = {
        lcp: { good: 2500, poor: 4000 },
        fid: { good: 100, poor: 300 },
        cls: { good: 0.1, poor: 0.25 }
      }

      const threshold = thresholds[metric]
      if (value <= threshold.good) return 'text-success'
      if (value <= threshold.poor) return 'text-warning'
      return 'text-danger'
    }

    const getVitalsProgressClass = (metric, value) => {
      const color = getVitalsColor(metric, value)
      return color.replace('text-', 'bg-')
    }

    const getVitalsProgress = (metric, value) => {
      if (!value) return 0

      const thresholds = {
        lcp: { max: 5000 },
        fid: { max: 500 },
        cls: { max: 0.5 }
      }

      return Math.min(100, (value / thresholds[metric].max) * 100)
    }

    const getBundleSizeClass = size => {
      if (size > 3 * 1024 * 1024) return 'bg-danger'
      if (size > 2 * 1024 * 1024) return 'bg-warning'
      return 'bg-success'
    }

    const getBundleSizeProgress = size => {
      const maxSize = 5 * 1024 * 1024 // 5MB max
      return Math.min(100, (size / maxSize) * 100)
    }

    const getPriorityClass = priority => {
      switch (priority) {
        case 'high':
          return 'bg-danger'
        case 'medium':
          return 'bg-warning'
        case 'low':
          return 'bg-info'
        default:
          return 'bg-secondary'
      }
    }

    onMounted(() => {
      refreshData()

      // Auto-refresh every 30 seconds
      const interval = setInterval(refreshData, 30000)

      // Cleanup on unmount
      return () => clearInterval(interval)
    })

    return {
      loading,
      performanceMetrics,
      codeQualityMetrics,
      bundleMetrics,
      rolloutMetrics,
      recommendations,
      refreshData,
      exportMetrics,
      executeAction,
      dismissRecommendation,
      formatTime,
      formatMemory,
      formatSize,
      getTrendClass,
      getVitalsColor,
      getVitalsProgressClass,
      getVitalsProgress,
      getBundleSizeClass,
      getBundleSizeProgress,
      getPriorityClass
    }
  }
}
</script>

<style scoped>
.monitoring-dashboard {
  padding: 1rem;
}

.icon {
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-circle {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.chart-circle-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 2rem;
  font-weight: bold;
}

.progress {
  border-radius: 0.25rem;
}

.list-group-item {
  border-left: none;
  border-right: none;
  padding: 0.75rem 0;
}

.list-group-item:first-child {
  border-top: none;
}

.list-group-item:last-child {
  border-bottom: none;
}

.page-header {
  display: flex;
  justify-content: between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-actions {
  display: flex;
  gap: 0.5rem;
}
</style>
