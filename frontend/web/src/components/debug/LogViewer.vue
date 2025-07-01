<template>
  <div class="log-viewer">
    <div class="log-viewer-header">
      <h3>Development Log Viewer</h3>
      <div class="log-controls">
        <select v-model="selectedChannel" @change="fetchLogs">
          <option v-for="channel in channels" :key="channel" :value="channel">
            {{ channel }}
          </option>
        </select>
        <input 
          v-model="lines" 
          type="number" 
          min="10" 
          max="1000" 
          placeholder="Lines"
          @change="fetchLogs"
        >
        <button @click="fetchLogs" :disabled="loading">
          {{ loading ? 'Loading...' : 'Refresh' }}
        </button>
        <button @click="clearLogs" :disabled="loading">
          Clear
        </button>
        <button @click="exportFrontendLogs">
          Export Frontend Logs
        </button>
        <button @click="toggleAutoRefresh">
          Auto: {{ autoRefresh ? 'ON' : 'OFF' }}
        </button>
      </div>
    </div>

    <div class="log-viewer-content">
      <div class="log-filters">
        <label>
          <input type="checkbox" v-model="filters.error"> Errors
        </label>
        <label>
          <input type="checkbox" v-model="filters.warning"> Warnings
        </label>
        <label>
          <input type="checkbox" v-model="filters.info"> Info
        </label>
        <label>
          <input type="checkbox" v-model="filters.debug"> Debug
        </label>
        <input 
          v-model="searchTerm" 
          type="text" 
          placeholder="Search logs..."
          class="log-search"
        >
      </div>

      <div class="log-container" ref="logContainer">
        <div 
          v-for="(log, index) in filteredLogs" 
          :key="index"
          :class="['log-entry', getLogClass(log)]"
        >
          <span class="log-timestamp">{{ formatTimestamp(log.timestamp) }}</span>
          <span class="log-level">{{ log.level }}</span>
          <span class="log-message">{{ log.message }}</span>
          <div v-if="log.context && Object.keys(log.context).length" class="log-context">
            <pre>{{ JSON.stringify(log.context, null, 2) }}</pre>
          </div>
        </div>
      </div>
    </div>

    <div class="log-viewer-footer">
      <span>{{ filteredLogs.length }} / {{ logs.length }} logs</span>
      <span v-if="lastUpdated">Last updated: {{ formatTimestamp(lastUpdated) }}</span>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import api from '@/services/api'
import logger from '@/utils/logger'

export default {
  name: 'LogViewer',
  setup() {
    const logs = ref([])
    const channels = ref(['laravel', 'api', 'auth', 'frontend', 'database'])
    const selectedChannel = ref('api')
    const lines = ref(100)
    const loading = ref(false)
    const lastUpdated = ref(null)
    const autoRefresh = ref(false)
    const autoRefreshInterval = ref(null)
    const searchTerm = ref('')
    const logContainer = ref(null)

    const filters = ref({
      error: true,
      warning: true,
      info: true,
      debug: true
    })

    const filteredLogs = computed(() => {
      let filtered = logs.value

      // Apply level filters
      filtered = filtered.filter(log => {
        const level = log.level?.toLowerCase()
        if (level === 'error' && !filters.value.error) return false
        if (['warn', 'warning'].includes(level) && !filters.value.warning) return false
        if (level === 'info' && !filters.value.info) return false
        if (['debug', 'trace'].includes(level) && !filters.value.debug) return false
        return true
      })

      // Apply search filter
      if (searchTerm.value) {
        const term = searchTerm.value.toLowerCase()
        filtered = filtered.filter(log => 
          log.message?.toLowerCase().includes(term) ||
          JSON.stringify(log.context).toLowerCase().includes(term)
        )
      }

      return filtered
    })

    const fetchLogs = async () => {
      loading.value = true
      try {
        const response = await api.get('/logs', {
          params: {
            channel: selectedChannel.value,
            lines: lines.value
          }
        })

        if (response.data.success) {
          logs.value = parseLogs(response.data.data.logs)
          lastUpdated.value = new Date().toISOString()
          
          // Scroll to bottom
          setTimeout(() => {
            if (logContainer.value) {
              logContainer.value.scrollTop = logContainer.value.scrollHeight
            }
          }, 100)
        }
      } catch (error) {
        logger.error('Failed to fetch logs', { error: error.message })
      } finally {
        loading.value = false
      }
    }

    const clearLogs = async () => {
      if (!confirm(`Are you sure you want to clear ${selectedChannel.value} logs?`)) {
        return
      }

      loading.value = true
      try {
        const response = await api.delete('/logs/clear', {
          params: { channel: selectedChannel.value }
        })

        if (response.data.success) {
          logs.value = []
          logger.info('Logs cleared', { channel: selectedChannel.value })
        }
      } catch (error) {
        logger.error('Failed to clear logs', { error: error.message })
      } finally {
        loading.value = false
      }
    }

    const exportFrontendLogs = () => {
      logger.exportLogs()
    }

    const toggleAutoRefresh = () => {
      autoRefresh.value = !autoRefresh.value
      
      if (autoRefresh.value) {
        autoRefreshInterval.value = setInterval(fetchLogs, 5000)
      } else {
        if (autoRefreshInterval.value) {
          clearInterval(autoRefreshInterval.value)
          autoRefreshInterval.value = null
        }
      }
    }

    const parseLogs = (rawLogs) => {
      return rawLogs.map(line => {
        try {
          // Try to parse as JSON first (structured logs)
          if (line.trim().startsWith('{')) {
            return JSON.parse(line)
          }
          
          // Parse Laravel log format
          const match = line.match(/\[(\d{4}-\d{2}-\d{2}[T\s]\d{2}:\d{2}:\d{2}[^\]]*)\]\s+(\w+)\.(\w+):\s+(.+)/)
          if (match) {
            return {
              timestamp: match[1],
              channel: match[2],
              level: match[3],
              message: match[4],
              context: {}
            }
          }
          
          // Fallback for unknown format
          return {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: line,
            context: {}
          }
        } catch (e) {
          return {
            timestamp: new Date().toISOString(),
            level: 'info',
            message: line,
            context: {}
          }
        }
      }).filter(log => log.message?.trim())
    }

    const getLogClass = (log) => {
      const level = log.level?.toLowerCase()
      if (level === 'error') return 'log-error'
      if (['warn', 'warning'].includes(level)) return 'log-warning'
      if (level === 'info') return 'log-info'
      return 'log-debug'
    }

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return ''
      try {
        return new Date(timestamp).toLocaleString()
      } catch (e) {
        return timestamp
      }
    }

    onMounted(() => {
      fetchLogs()
    })

    onUnmounted(() => {
      if (autoRefreshInterval.value) {
        clearInterval(autoRefreshInterval.value)
      }
    })

    return {
      logs,
      channels,
      selectedChannel,
      lines,
      loading,
      lastUpdated,
      autoRefresh,
      searchTerm,
      logContainer,
      filters,
      filteredLogs,
      fetchLogs,
      clearLogs,
      exportFrontendLogs,
      toggleAutoRefresh,
      getLogClass,
      formatTimestamp
    }
  }
}
</script>

<style scoped>
.log-viewer {
  display: flex;
  flex-direction: column;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: monospace;
  font-size: 12px;
}

.log-viewer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: #f5f5f5;
  border-bottom: 1px solid #ddd;
}

.log-viewer-header h3 {
  margin: 0;
  font-size: 14px;
}

.log-controls {
  display: flex;
  gap: 10px;
  align-items: center;
}

.log-controls select,
.log-controls input,
.log-controls button {
  padding: 4px 8px;
  font-size: 12px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.log-viewer-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.log-filters {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 8px 10px;
  background: #fafafa;
  border-bottom: 1px solid #eee;
  font-size: 11px;
}

.log-search {
  margin-left: auto;
  width: 200px;
}

.log-container {
  flex: 1;
  overflow-y: auto;
  padding: 5px;
  background: #fff;
}

.log-entry {
  display: flex;
  gap: 10px;
  padding: 2px 5px;
  border-bottom: 1px solid #f0f0f0;
}

.log-entry:hover {
  background: #f9f9f9;
}

.log-timestamp {
  flex-shrink: 0;
  width: 160px;
  color: #666;
  font-size: 11px;
}

.log-level {
  flex-shrink: 0;
  width: 60px;
  font-weight: bold;
}

.log-message {
  flex: 1;
  word-break: break-word;
}

.log-context {
  margin-top: 5px;
  padding: 5px;
  background: #f8f8f8;
  border-radius: 3px;
  font-size: 10px;
}

.log-context pre {
  margin: 0;
  white-space: pre-wrap;
}

.log-error .log-level {
  color: #d32f2f;
}

.log-warning .log-level {
  color: #f57c00;
}

.log-info .log-level {
  color: #1976d2;
}

.log-debug .log-level {
  color: #388e3c;
}

.log-viewer-footer {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background: #f5f5f5;
  border-top: 1px solid #ddd;
  font-size: 11px;
  color: #666;
}
</style>