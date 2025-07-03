<template>
  <div
    ref="containerRef"
    class="virtual-scroll-container"
    :style="{ height: containerHeight + 'px', overflow: 'auto' }"
    role="region"
    :aria-label="ariaLabel"
    tabindex="0"
    @scroll="handleScroll"
    @keydown="handleKeydown"
  >
    <div class="virtual-scroll-content" :style="{ height: totalHeight + 'px', position: 'relative' }">
      <div class="virtual-scroll-items" :style="{ transform: `translateY(${offsetY}px)` }">
        <div
          v-for="(item, index) in visibleItems"
          :key="getItemKey(item, startIndex + index)"
          class="virtual-scroll-item"
          :style="{ height: itemHeight + 'px' }"
          :data-index="startIndex + index"
        >
          <slot :item="item" :index="startIndex + index" :is-visible="true">
            {{ item }}
          </slot>
        </div>
      </div>
    </div>

    <!-- Loading indicator for lazy loading -->
    <div v-if="isLoading" class="virtual-scroll-loading" role="status" aria-live="polite">
      <LoadingState variant="spinner" message="Loading more items..." />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { usePerformance } from '@/composables/usePerformance'
import LoadingState from './LoadingState.vue'

const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  itemHeight: {
    type: Number,
    default: 50
  },
  containerHeight: {
    type: Number,
    default: 400
  },
  buffer: {
    type: Number,
    default: 3
  },
  keyField: {
    type: String,
    default: 'id'
  },
  ariaLabel: {
    type: String,
    default: 'Virtual scroll list'
  },
  enableLazyLoading: {
    type: Boolean,
    default: false
  },
  loadThreshold: {
    type: Number,
    default: 0.8
  }
})

const emit = defineEmits(['scroll', 'loadMore', 'itemFocus'])

// Composables
const { virtualScrolling } = usePerformance()

// Refs
const containerRef = ref(null)
const scrollTop = ref(0)
const isLoading = ref(false)

// Computed properties
const totalHeight = computed(() => {
  const calculated = props.items.length * props.itemHeight
  // Cap total height at 100,000px to prevent performance issues
  return Math.min(calculated, 100000)
})

const visibleRange = computed(() => {
  return virtualScrolling.calculateVisibleItems(
    props.containerHeight,
    props.itemHeight,
    scrollTop.value,
    props.items.length,
    props.buffer
  )
})

const startIndex = computed(() => visibleRange.value.startIndex)
const endIndex = computed(() => visibleRange.value.endIndex)
const offsetY = computed(() => visibleRange.value.offsetY)

const visibleItems = computed(() => {
  return props.items.slice(startIndex.value, endIndex.value + 1)
})

// Methods
const handleScroll = event => {
  scrollTop.value = event.target.scrollTop

  emit('scroll', {
    scrollTop: scrollTop.value,
    startIndex: startIndex.value,
    endIndex: endIndex.value
  })

  // Lazy loading check
  if (props.enableLazyLoading && !isLoading.value) {
    const scrollPercent = scrollTop.value / (totalHeight.value - props.containerHeight)
    if (scrollPercent >= props.loadThreshold) {
      isLoading.value = true
      emit('loadMore')
    }
  }
}

const handleKeydown = event => {
  const items = containerRef.value?.querySelectorAll('.virtual-scroll-item')
  if (!items || items.length === 0) return

  const currentIndex = Array.from(items).findIndex(item => item.contains(document.activeElement))

  let newIndex = currentIndex

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault()
      newIndex = Math.min(currentIndex + 1, items.length - 1)
      break
    case 'ArrowUp':
      event.preventDefault()
      newIndex = Math.max(currentIndex - 1, 0)
      break
    case 'Home':
      event.preventDefault()
      newIndex = 0
      scrollToIndex(0)
      break
    case 'End':
      event.preventDefault()
      newIndex = items.length - 1
      scrollToIndex(props.items.length - 1)
      break
    case 'PageDown':
      event.preventDefault()
      const pageSize = Math.floor(props.containerHeight / props.itemHeight)
      newIndex = Math.min(currentIndex + pageSize, items.length - 1)
      scrollToIndex(startIndex.value + pageSize)
      break
    case 'PageUp':
      event.preventDefault()
      const pageSizeUp = Math.floor(props.containerHeight / props.itemHeight)
      newIndex = Math.max(currentIndex - pageSizeUp, 0)
      scrollToIndex(Math.max(startIndex.value - pageSizeUp, 0))
      break
  }

  if (newIndex !== currentIndex && items[newIndex]) {
    const focusableElement = items[newIndex].querySelector('[tabindex], button, input, select, textarea, a[href]')
    if (focusableElement) {
      focusableElement.focus()
    } else {
      items[newIndex].focus()
    }

    emit('itemFocus', {
      index: startIndex.value + newIndex,
      item: visibleItems.value[newIndex]
    })
  }
}

const scrollToIndex = index => {
  if (!containerRef.value) return

  const targetScrollTop = index * props.itemHeight
  containerRef.value.scrollTop = targetScrollTop
}

const getItemKey = (item, index) => {
  if (props.keyField && item[props.keyField] !== undefined) {
    return item[props.keyField]
  }
  return index
}

const finishLoading = () => {
  isLoading.value = false
}

// Watch for items changes
watch(
  () => props.items,
  () => {
    // Reset scroll position if items change significantly
    if (containerRef.value && scrollTop.value > totalHeight.value) {
      containerRef.value.scrollTop = 0
    }
  },
  { deep: true }
)

// Expose methods
defineExpose({
  scrollToIndex,
  finishLoading,
  containerRef
})

// Performance monitoring
onMounted(() => {
  if (containerRef.value) {
    // Add intersection observer for performance tracking
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Track visible items for performance
        }
      })
    })

    // Observe container
    observer.observe(containerRef.value)

    onUnmounted(() => {
      observer.disconnect()
    })
  }
})
</script>

<style scoped>
.virtual-scroll-container {
  position: relative;
  outline: none;
}

.virtual-scroll-container:focus {
  outline: 2px solid #007bff;
  outline-offset: -2px;
}

.virtual-scroll-content {
  width: 100%;
}

.virtual-scroll-items {
  width: 100%;
}

.virtual-scroll-item {
  width: 100%;
  box-sizing: border-box;
}

.virtual-scroll-loading {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  text-align: center;
}

/* Smooth scrolling */
.virtual-scroll-container {
  scroll-behavior: smooth;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .virtual-scroll-container:focus {
    outline: 3px solid;
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .virtual-scroll-container {
    scroll-behavior: auto;
  }

  .virtual-scroll-items {
    transition: none;
  }
}
</style>
