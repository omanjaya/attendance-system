<template>
  <Teleport to="body">
    <div v-if="visible" class="toast-container" :class="`toast-${position}`">
      <Transition name="toast" appear @after-leave="onAfterLeave">
        <div
          v-if="show"
          class="toast"
          :class="[`toast-${variant}`, { 'toast-dismissible': dismissible }]"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
        >
          <div class="toast-header">
            <div class="toast-icon">
              <svg v-if="icon" class="toast-icon-svg">
                <use :href="`#tabler-${icon}`"></use>
              </svg>
              <svg v-else-if="defaultIcon" class="toast-icon-svg">
                <use :href="`#tabler-${defaultIcon}`"></use>
              </svg>
            </div>

            <div class="toast-content">
              <div v-if="title" class="toast-title">{{ title }}</div>
              <div class="toast-message">{{ message }}</div>
            </div>

            <button v-if="dismissible" type="button" class="toast-close" aria-label="Close" @click="dismiss">
              <svg class="toast-close-icon">
                <use href="#tabler-x"></use>
              </svg>
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

const props = defineProps({
  // Toast content
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
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
      ['top-left', 'top-center', 'top-right', 'bottom-left', 'bottom-center', 'bottom-right', 'center'].includes(value)
  },

  // Actions
  actions: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['dismiss', 'action'])

// State
const visible = ref(false)
const show = ref(false)
const paused = ref(false)
let timer = null

// Computed
const defaultIcon = computed(() => {
  const iconMap = {
    success: 'check-circle',
    error: 'alert-circle',
    warning: 'alert-triangle',
    info: 'info-circle'
  }
  return iconMap[props.variant]
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
  z-index: var(--z-toast, 9999);
  pointer-events: none;
}

.toast-top-left {
  top: var(--space-4);
  left: var(--space-4);
}

.toast-top-center {
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
}

.toast-top-right {
  top: var(--space-4);
  right: var(--space-4);
}

.toast-bottom-left {
  bottom: var(--space-4);
  left: var(--space-4);
}

.toast-bottom-center {
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
}

.toast-bottom-right {
  bottom: var(--space-4);
  right: var(--space-4);
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
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  pointer-events: auto;
  position: relative;
}

.toast-header {
  display: flex;
  align-items: flex-start;
  padding: var(--space-4);
  gap: var(--space-3);
}

.toast-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.toast-icon-svg {
  width: 1.25rem;
  height: 1.25rem;
}

.toast-content {
  flex: 1;
  min-width: 0;
}

.toast-title {
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
  margin-bottom: var(--space-1);
}

.toast-message {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
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
  border-left: 4px solid var(--color-success);
}

.toast-success .toast-icon {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.toast-error {
  border-left: 4px solid var(--color-danger);
}

.toast-error .toast-icon {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.toast-warning {
  border-left: 4px solid var(--color-warning);
}

.toast-warning .toast-icon {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}

.toast-info {
  border-left: 4px solid var(--color-info);
}

.toast-info .toast-icon {
  background-color: var(--color-info-light);
  color: var(--color-info);
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
