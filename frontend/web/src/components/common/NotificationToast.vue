<template>
  <Teleport to="body">
    <div v-if="visible" class="toast-container" :class="`toast-${position}`">
      <Transition name="toast" appear @after-leave="onAfterLeave">
        <div
          v-if="show"
          :id="id || undefined"
          class="toast"
          :class="[`toast-${computedVariant}`, { 'toast-dismissible': dismissible }]"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-header">
            <div class="toast-icon">
              <TablerIcon v-if="icon" :name="icon" />
              <TablerIcon v-else-if="defaultIcon" :name="defaultIcon" />
            </div>

            <div class="toast-content">
              <div v-if="computedTitle" class="toast-title">{{ computedTitle }}</div>
              <div class="toast-message">{{ computedMessage }}</div>
            </div>

            <button
              v-if="dismissible"
              type="button"
              class="toast-close"
              aria-label="Close"
              @click="dismiss"
            >
              <TablerIcon name="x" size="sm" />
            </button>
          </div>

          <div v-if="actions.length > 0" class="toast-actions">
            <button
              v-for="action in actions"
              :key="action.key"
              type="button"
              class="toast-action"
              :class="action.variant ? `btn-${action.variant}` : 'btn-link'"
              @click="handleAction(action)"
            >
              {{ action.label }}
            </button>
          </div>

          <div v-if="duration > 0 && !paused" class="toast-progress">
            <div class="toast-progress-bar" :style="{ animationDuration: `${duration}ms` }"></div>
          </div>
        </div>
      </Transition>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import TablerIcon from './TablerIcon.vue'

const props = defineProps({
  // Toast content
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: false,
    default: ''
  },

  // Additional attributes that might be passed
  type: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  notification: {
    type: Object,
    default: () => ({})
  },

  // Toast appearance
  variant: {
    type: String,
    default: 'info',
    validator: value => ['success', 'error', 'warning', 'info'].includes(value)
  },
  icon: {
    type: String,
    default: ''
  },

  // Toast behavior
  duration: {
    type: Number,
    default: 5000 // 5 seconds
  },
  dismissible: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  },

  // Toast positioning
  position: {
    type: String,
    default: 'top-right',
    validator: value =>
      [
        'top-left',
        'top-center',
        'top-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
        'center'
      ].includes(value)
  },

  // Actions
  actions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['dismiss', 'action'])

defineOptions({
  inheritAttrs: false
})

// State
const visible = ref(false)
const show = ref(false)
const paused = ref(false)
let timer = null

// Computed
const computedMessage = computed(() => {
  // Prioritas: props.message -> props.notification.message -> default
  if (props.message) return props.message
  if (props.notification && props.notification.message) return props.notification.message
  return 'No message provided'
})

const computedTitle = computed(() => {
  // Prioritas: props.title -> props.notification.title
  if (props.title) return props.title
  if (props.notification && props.notification.title) return props.notification.title
  return ''
})

const computedVariant = computed(() => {
  // Prioritas: props.variant -> props.type -> props.notification.type -> default
  if (props.variant && props.variant !== 'info') return props.variant
  if (props.type) return props.type
  if (props.notification && props.notification.type) return props.notification.type
  return 'info'
})

const defaultIcon = computed(() => {
  const iconMap = {
    success: 'check',
    error: 'x',
    warning: 'alert-triangle',
    info: 'info-circle'
  }
  return iconMap[computedVariant.value]
})

// Methods
const showToast = () => {
  visible.value = true
  // Small delay for smooth transition
  setTimeout(() => {
    show.value = true
  }, 10)

  if (props.duration > 0 && !props.persistent) {
    startTimer()
  }
}

const dismiss = () => {
  clearTimer()
  show.value = false
}

const onAfterLeave = () => {
  visible.value = false
  emit('dismiss')
}

const handleAction = action => {
  emit('action', action)
  if (action.dismiss !== false) {
    dismiss()
  }
}

const startTimer = () => {
  clearTimer()
  timer = setTimeout(() => {
    dismiss()
  }, props.duration)
}

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

const pauseTimer = () => {
  paused.value = true
  clearTimer()
}

const resumeTimer = () => {
  paused.value = false
  if (props.duration > 0 && !props.persistent) {
    startTimer()
  }
}

// Lifecycle
onMounted(() => {
  showToast()
})

onUnmounted(() => {
  clearTimer()
})

// Watch for duration changes
watch(
  () => props.duration,
  newDuration => {
    if (newDuration > 0 && !props.persistent && show.value) {
      startTimer()
    } else {
      clearTimer()
    }
  }
)

// Expose methods for parent components
defineExpose({
  dismiss,
  pauseTimer,
  resumeTimer
})
</script>

<style scoped>
/* Toast Container Positioning */
.toast-container {
  position: fixed;
  z-index: 1050;
  pointer-events: none;
}

.toast-top-left {
  top: 1rem;
  left: 1rem;
}

.toast-top-center {
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

.toast-top-right {
  top: 1rem;
  right: 1rem;
}

.toast-bottom-left {
  bottom: 1rem;
  left: 1rem;
}

.toast-bottom-center {
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
}

.toast-bottom-right {
  bottom: 1rem;
  right: 1rem;
}

.toast-center {
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Toast Base Styles */
.toast {
  display: flex;
  flex-direction: column;
  min-width: 20rem;
  max-width: 24rem;
  background: var(--tblr-bg-surface);
  border: 1px solid var(--tblr-border-color);
  border-radius: var(--tblr-border-radius);
  box-shadow: var(--tblr-box-shadow);
  overflow: hidden;
  pointer-events: auto;
  position: relative;
}

.toast-header {
  display: flex;
  align-items: flex-start;
  padding: 1rem;
  gap: 0.75rem;
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--tblr-border-radius);
  flex-shrink: 0;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: 600;
  color: var(--tblr-body-color);
  line-height: 1.2;
  margin-bottom: 0.25rem;
}

.toast-message {
  color: var(--tblr-muted);
  font-size: 0.875rem;
  line-height: 1.5;
}

.toast-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition-fast);
  flex-shrink: 0;
}

.toast-close:hover {
  background-color: var(--color-gray-100);
  color: var(--text-primary);
}

.toast-close-icon {
  width: 1rem;
  height: 1rem;
}

/* Toast Actions */
.toast-actions {
  display: flex;
  gap: var(--space-2);
  padding: 0 var(--space-4) var(--space-4);
  margin-top: var(--space-2);
}

.toast-action {
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: var(--transition-fast);
}

.toast-action.btn-link {
  background: transparent;
  color: var(--color-primary);
  border: none;
}

.toast-action.btn-link:hover {
  background-color: var(--color-primary-light);
}

.toast-action.btn-primary {
  background-color: var(--color-primary);
  color: var(--color-white);
  border-color: var(--color-primary);
}

.toast-action.btn-primary:hover {
  background-color: var(--color-primary-hover);
}

/* Toast Variants */
.toast-success {
  border-left: 4px solid var(--tblr-success);
}

.toast-success .toast-icon {
  background-color: rgba(var(--tblr-success-rgb), 0.1);
  color: var(--tblr-success);
}

.toast-error {
  border-left: 4px solid var(--tblr-danger);
}

.toast-error .toast-icon {
  background-color: rgba(var(--tblr-danger-rgb), 0.1);
  color: var(--tblr-danger);
}

.toast-warning {
  border-left: 4px solid var(--tblr-warning);
}

.toast-warning .toast-icon {
  background-color: rgba(var(--tblr-warning-rgb), 0.1);
  color: var(--tblr-warning);
}

.toast-info {
  border-left: 4px solid var(--tblr-info);
}

.toast-info .toast-icon {
  background-color: rgba(var(--tblr-info-rgb), 0.1);
  color: var(--tblr-info);
}

/* Progress Bar */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background-color: var(--color-gray-200);
  overflow: hidden;
}

.toast-progress-bar {
  height: 100%;
  background-color: var(--color-primary);
  width: 100%;
  animation: toast-progress linear forwards;
  transform-origin: left;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Toast Transitions */
.toast-enter-active {
  transition: all var(--transition-base);
}

.toast-leave-active {
  transition: all var(--transition-base);
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

/* Different entrance animations based on position */
.toast-top-left .toast-enter-from,
.toast-bottom-left .toast-enter-from {
  transform: translateX(-100%);
}

.toast-top-left .toast-leave-to,
.toast-bottom-left .toast-leave-to {
  transform: translateX(-100%);
}

.toast-top-center .toast-enter-from,
.toast-bottom-center .toast-enter-from {
  transform: translateY(-100%);
}

.toast-top-center .toast-leave-to,
.toast-bottom-center .toast-leave-to {
  transform: translateY(-100%);
}

.toast-center .toast-enter-from,
.toast-center .toast-leave-to {
  transform: translate(-50%, -50%) scale(0.8);
}

/* Responsive Design */
@media (max-width: 768px) {
  .toast {
    min-width: calc(100vw - 2rem);
    max-width: calc(100vw - 2rem);
  }

  .toast-container {
    left: var(--space-2) !important;
    right: var(--space-2) !important;
    transform: none !important;
  }

  .toast-top-center,
  .toast-bottom-center {
    left: var(--space-2);
    transform: none;
  }
}

/* Dark theme adjustments */
[data-theme='dark'] .toast-close:hover {
  background-color: var(--color-gray-800);
}

[data-theme='dark'] .toast-action.btn-link:hover {
  background-color: var(--color-primary-dark);
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .toast {
    border-width: 2px;
  }

  .toast-success {
    border-left-width: 6px;
  }

  .toast-error {
    border-left-width: 6px;
  }

  .toast-warning {
    border-left-width: 6px;
  }

  .toast-info {
    border-left-width: 6px;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active {
    transition: opacity var(--transition-fast);
  }

  .toast-enter-from,
  .toast-leave-to {
    transform: none;
  }

  .toast-progress-bar {
    animation: none;
    transform: scaleX(0);
  }
}
</style>
