<template>
  <teleport to="body">
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show"
        role="alert"
        :class="getToastClass(toast.type)"
      >
        <div class="toast-header">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="icon me-2"
            :class="getIconClass(toast.type)"
          >
            <path v-if="toast.type === 'success'" d="M9 12l2 2 4-4" />
            <path v-else-if="toast.type === 'warning'" d="M12 9v2m0 4v.01" />
            <path v-else-if="toast.type === 'error'" d="M18 6L6 18M6 6l12 12" />
            <path v-else d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />

            <circle v-if="toast.type !== 'info'" cx="12" cy="12" r="10" />
          </svg>
          <strong class="me-auto">{{ toast.title }}</strong>
          <small class="text-muted">{{ formatTime(toast.timestamp) }}</small>
          <button type="button" class="btn-close" @click="removeToast(toast.id)"></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>

        <!-- Progress bar for auto-dismiss -->
        <div v-if="toast.duration > 0" class="progress" style="height: 2px">
          <div
            class="progress-bar"
            :class="getProgressClass(toast.type)"
            :style="`width: ${toast.progress}%; transition: width ${toast.updateInterval}ms linear;`"
          ></div>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'

// State
const toasts = ref([])
let toastIdCounter = 0

// Methods
const addToast = (type, title, message, duration = 4000) => {
  const id = ++toastIdCounter
  const toast = {
    id,
    type,
    title,
    message,
    duration,
    timestamp: Date.now(),
    progress: 100,
    updateInterval: 100,
    timer: null,
    progressTimer: null
  }

  toasts.value.push(toast)

  // Auto-dismiss if duration is set
  if (duration > 0) {
    startToastTimer(toast)
  }

  return id
}

const removeToast = id => {
  const index = toasts.value.findIndex(t => t.id === id)
  if (index > -1) {
    const toast = toasts.value[index]
    clearToastTimers(toast)
    toasts.value.splice(index, 1)
  }
}

const startToastTimer = toast => {
  const startTime = Date.now()

  // Update progress bar
  toast.progressTimer = setInterval(() => {
    const elapsed = Date.now() - startTime
    const remaining = Math.max(0, toast.duration - elapsed)
    toast.progress = (remaining / toast.duration) * 100

    if (remaining <= 0) {
      clearInterval(toast.progressTimer)
    }
  }, toast.updateInterval)

  // Auto-dismiss timer
  toast.timer = setTimeout(() => {
    removeToast(toast.id)
  }, toast.duration)
}

const clearToastTimers = toast => {
  if (toast.timer) {
    clearTimeout(toast.timer)
    toast.timer = null
  }
  if (toast.progressTimer) {
    clearInterval(toast.progressTimer)
    toast.progressTimer = null
  }
}

const getToastClass = type => {
  const classes = {
    success: 'border-success',
    warning: 'border-warning',
    error: 'border-danger',
    info: 'border-info'
  }
  return classes[type] || classes.info
}

const getIconClass = type => {
  const classes = {
    success: 'text-success',
    warning: 'text-warning',
    error: 'text-danger',
    info: 'text-info'
  }
  return classes[type] || classes.info
}

const getProgressClass = type => {
  const classes = {
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-danger',
    info: 'bg-info'
  }
  return classes[type] || classes.info
}

const formatTime = timestamp => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const clearAllToasts = () => {
  toasts.value.forEach(toast => clearToastTimers(toast))
  toasts.value = []
}

// Custom event listener for toast notifications
const handleShowToast = event => {
  const { type, title, message, duration } = event.detail
  addToast(type, title, message, duration)
}

// Lifecycle
onMounted(() => {
  window.addEventListener('show-toast', handleShowToast)
})

onUnmounted(() => {
  window.removeEventListener('show-toast', handleShowToast)
  clearAllToasts()
})

// Expose methods for direct usage
defineExpose({
  addToast,
  removeToast,
  clearAllToasts
})
</script>

<style scoped>
.toast-container {
  z-index: 1060;
  max-width: 400px;
}

.toast {
  margin-bottom: 0.5rem;
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
}

.toast.show {
  display: block;
  opacity: 1;
}

.progress {
  border-radius: 0;
  margin: 0;
}

.progress-bar {
  border-radius: 0;
}
</style>
