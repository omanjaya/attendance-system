<template>
  <div class="pull-to-refresh-container">
    <!-- Pull indicator -->
    <div
      class="pull-indicator"
      :class="{
        'pull-active': isPulling,
        'pull-triggered': isTriggered,
        'pull-refreshing': isRefreshing
      }"
      :style="{ transform: `translateY(${pullDistance}px)` }"
    >
      <div class="pull-content">
        <div v-if="!isRefreshing" class="pull-arrow" :style="{ transform: `rotate(${arrowRotation}deg)` }">
          <TablerIcon name="arrow-down" />
        </div>
        <div v-else class="pull-spinner">
          <TablerIcon name="loader" />
        </div>
        <span class="pull-text">{{ pullText }}</span>
      </div>
    </div>

    <!-- Main content -->
    <div
      ref="contentRef"
      class="pull-content-wrapper"
      :style="{ transform: `translateY(${contentOffset}px)` }"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue'
import TablerIcon from './TablerIcon.vue'

const props = defineProps({
  threshold: {
    type: Number,
    default: 80
  },
  maxDistance: {
    type: Number,
    default: 120
  },
  disabled: {
    type: Boolean,
    default: false
  },
  dampening: {
    type: Number,
    default: 0.3
  }
})

const emit = defineEmits(['refresh'])

// State
const contentRef = ref(null)
const isPulling = ref(false)
const isTriggered = ref(false)
const isRefreshing = ref(false)
const pullDistance = ref(0)
const touchStartY = ref(0)
const lastTouchY = ref(0)

// Computed
const contentOffset = computed(() => {
  return isPulling.value ? Math.min(pullDistance.value, props.maxDistance) : 0
})

const arrowRotation = computed(() => {
  if (isTriggered.value) return 180
  return Math.min((pullDistance.value / props.threshold) * 180, 180)
})

const pullText = computed(() => {
  if (isRefreshing.value) return 'Refreshing...'
  if (isTriggered.value) return 'Release to refresh'
  return 'Pull to refresh'
})

// Touch handlers
const handleTouchStart = e => {
  if (props.disabled || isRefreshing.value) return

  // Only start pulling if at top of page
  if (window.scrollY > 0) return

  const touch = e.touches[0]
  touchStartY.value = touch.clientY
  lastTouchY.value = touch.clientY
}

const handleTouchMove = e => {
  if (props.disabled || isRefreshing.value) return

  const touch = e.touches[0]
  const deltaY = touch.clientY - touchStartY.value

  // Only pull if moving down and at top of page
  if (deltaY > 0 && window.scrollY === 0) {
    e.preventDefault()

    isPulling.value = true

    // Apply dampening effect
    pullDistance.value = deltaY * props.dampening

    // Check if threshold is reached
    isTriggered.value = pullDistance.value >= props.threshold

    // Limit maximum pull distance
    if (pullDistance.value > props.maxDistance) {
      pullDistance.value = props.maxDistance
    }
  }

  lastTouchY.value = touch.clientY
}

const handleTouchEnd = () => {
  if (props.disabled || isRefreshing.value || !isPulling.value) return

  if (isTriggered.value) {
    // Trigger refresh
    startRefresh()
  } else {
    // Reset pull state
    resetPull()
  }
}

// Methods
const startRefresh = async () => {
  isRefreshing.value = true

  try {
    // Emit refresh event
    await emit('refresh')
  } catch (error) {
    console.error('Refresh error:', error)
  } finally {
    // Reset after delay for smooth animation
    setTimeout(() => {
      finishRefresh()
    }, 500)
  }
}

const finishRefresh = () => {
  isRefreshing.value = false
  resetPull()
}

const resetPull = () => {
  isPulling.value = false
  isTriggered.value = false
  pullDistance.value = 0

  // Smooth reset animation
  nextTick(() => {
    if (contentRef.value) {
      contentRef.value.style.transition = 'transform 0.3s ease'
      setTimeout(() => {
        if (contentRef.value) {
          contentRef.value.style.transition = ''
        }
      }, 300)
    }
  })
}

// Expose methods
defineExpose({
  startRefresh,
  finishRefresh,
  resetPull
})
</script>

<style scoped>
.pull-to-refresh-container {
  position: relative;
  overflow: hidden;
}

.pull-indicator {
  position: absolute;
  top: -80px;
  left: 0;
  right: 0;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--tblr-bg-surface);
  border-bottom: 1px solid var(--tblr-border-color);
  z-index: 10;
  transition: all 0.3s ease;
}

.pull-indicator.pull-active {
  top: -80px;
}

.pull-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--tblr-muted);
}

.pull-arrow {
  transition: transform 0.3s ease;
  margin-bottom: 0.5rem;
}

.pull-spinner {
  margin-bottom: 0.5rem;
  animation: spin 1s linear infinite;
}

.pull-text {
  font-size: 0.875rem;
  font-weight: 500;
}

.pull-content-wrapper {
  transition: transform 0.1s ease-out;
  min-height: 100vh;
}

/* Animations */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode support */
:root.dark .pull-indicator {
  background-color: var(--tblr-dark-mode-bg);
  border-bottom-color: var(--tblr-border-color-dark);
}

/* Smooth transitions */
.pull-indicator.pull-refreshing .pull-content {
  transform: scale(1.1);
}

.pull-indicator.pull-triggered .pull-arrow {
  color: var(--tblr-primary);
}

.pull-indicator.pull-refreshing .pull-spinner {
  color: var(--tblr-primary);
}
</style>
