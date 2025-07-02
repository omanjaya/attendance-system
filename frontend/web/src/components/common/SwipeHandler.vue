<template>
  <div
    ref="swipeContainer"
    class="swipe-handler"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
    @mousedown="handleMouseDown"
    @mousemove="handleMouseMove"
    @mouseup="handleMouseEnd"
  >
    <slot />

    <!-- Swipe indicator -->
    <div
      v-if="showIndicator && isActive"
      class="swipe-indicator"
      :class="`swipe-${direction}`"
      :style="{ opacity: swipeProgress }"
    >
      <TablerIcon :name="indicatorIcon" />
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import TablerIcon from './TablerIcon.vue'

const props = defineProps({
  direction: {
    type: String,
    default: 'horizontal',
    validator: value => ['horizontal', 'vertical', 'both'].includes(value)
  },
  threshold: {
    type: Number,
    default: 50
  },
  showIndicator: {
    type: Boolean,
    default: true
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits([
  'swipe-left',
  'swipe-right',
  'swipe-up',
  'swipe-down',
  'swipe-start',
  'swipe-move',
  'swipe-end'
])

// State
const swipeContainer = ref(null)
const isActive = ref(false)
const startX = ref(0)
const startY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const deltaX = ref(0)
const deltaY = ref(0)
const isMouseDown = ref(false)

// Computed
const swipeProgress = computed(() => {
  if (!isActive.value) return 0

  const maxDelta = Math.max(Math.abs(deltaX.value), Math.abs(deltaY.value))
  return Math.min(maxDelta / (props.threshold * 2), 1)
})

const direction = computed(() => {
  if (Math.abs(deltaX.value) > Math.abs(deltaY.value)) {
    return deltaX.value > 0 ? 'right' : 'left'
  } else {
    return deltaY.value > 0 ? 'down' : 'up'
  }
})

const indicatorIcon = computed(() => {
  const icons = {
    left: 'arrow-left',
    right: 'arrow-right',
    up: 'arrow-up',
    down: 'arrow-down'
  }
  return icons[direction.value] || 'arrow-right'
})

// Touch handlers
const handleTouchStart = e => {
  if (props.disabled) return

  const touch = e.touches[0]
  startSwipe(touch.clientX, touch.clientY)
}

const handleTouchMove = e => {
  if (props.disabled || !isActive.value) return

  e.preventDefault()
  const touch = e.touches[0]
  updateSwipe(touch.clientX, touch.clientY)
}

const handleTouchEnd = e => {
  if (props.disabled || !isActive.value) return

  endSwipe()
}

// Mouse handlers (for desktop testing)
const handleMouseDown = e => {
  if (props.disabled) return

  isMouseDown.value = true
  startSwipe(e.clientX, e.clientY)
}

const handleMouseMove = e => {
  if (props.disabled || !isActive.value || !isMouseDown.value) return

  e.preventDefault()
  updateSwipe(e.clientX, e.clientY)
}

const handleMouseEnd = e => {
  if (props.disabled || !isActive.value) return

  isMouseDown.value = false
  endSwipe()
}

// Swipe logic
const startSwipe = (x, y) => {
  isActive.value = true
  startX.value = x
  startY.value = y
  currentX.value = x
  currentY.value = y
  deltaX.value = 0
  deltaY.value = 0

  emit('swipe-start', { x, y })
}

const updateSwipe = (x, y) => {
  currentX.value = x
  currentY.value = y
  deltaX.value = x - startX.value
  deltaY.value = y - startY.value

  emit('swipe-move', {
    deltaX: deltaX.value,
    deltaY: deltaY.value,
    direction: direction.value,
    progress: swipeProgress.value
  })
}

const endSwipe = () => {
  const absX = Math.abs(deltaX.value)
  const absY = Math.abs(deltaY.value)

  // Check if swipe meets threshold
  if (absX > props.threshold || absY > props.threshold) {
    // Determine swipe direction and emit appropriate event
    if (props.direction === 'horizontal' || props.direction === 'both') {
      if (absX > absY) {
        if (deltaX.value > 0) {
          emit('swipe-right', { distance: absX })
        } else {
          emit('swipe-left', { distance: absX })
        }
      }
    }

    if (props.direction === 'vertical' || props.direction === 'both') {
      if (absY > absX) {
        if (deltaY.value > 0) {
          emit('swipe-down', { distance: absY })
        } else {
          emit('swipe-up', { distance: absY })
        }
      }
    }
  }

  emit('swipe-end', {
    deltaX: deltaX.value,
    deltaY: deltaY.value,
    direction: direction.value
  })

  // Reset state
  isActive.value = false
  deltaX.value = 0
  deltaY.value = 0
}
</script>

<style scoped>
.swipe-handler {
  position: relative;
  touch-action: pan-x pan-y;
  user-select: none;
  -webkit-user-select: none;
}

.swipe-indicator {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background-color: rgba(var(--tblr-primary-rgb), 0.1);
  border: 2px solid var(--tblr-primary);
  border-radius: 50%;
  color: var(--tblr-primary);
  pointer-events: none;
  z-index: 10;
  transition: opacity 0.2s ease;
}

.swipe-indicator.swipe-left {
  left: 20%;
}

.swipe-indicator.swipe-right {
  left: 80%;
}

.swipe-indicator.swipe-up {
  top: 20%;
}

.swipe-indicator.swipe-down {
  top: 80%;
}

/* Dark mode support */
:root.dark .swipe-indicator {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: var(--tblr-light);
  color: var(--tblr-light);
}
</style>
