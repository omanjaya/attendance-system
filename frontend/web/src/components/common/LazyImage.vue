<template>
  <div
    class="lazy-image-container"
    :class="{ loaded: isLoaded, loading: isLoading, error: hasError }"
  >
    <img
      ref="imageRef"
      v-lazy="lazyConfig"
      :src="currentSrc"
      :alt="alt"
      :class="imageClass"
      :style="imageStyle"
      @load="handleLoad"
      @error="handleError"
    />

    <!-- Loading placeholder -->
    <div
      v-if="isLoading && showPlaceholder"
      class="lazy-image-placeholder"
      :style="placeholderStyle"
      role="img"
      :aria-label="`Loading ${alt}`"
    >
      <slot name="loading">
        <div class="lazy-image-spinner">
          <LoadingState variant="spinner" size="sm" />
        </div>
      </slot>
    </div>

    <!-- Error placeholder -->
    <div
      v-if="hasError && showErrorPlaceholder"
      class="lazy-image-error"
      :style="placeholderStyle"
      role="img"
      :aria-label="`Failed to load ${alt}`"
    >
      <slot name="error">
        <div class="lazy-image-error-content">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="3" y1="3" x2="21" y2="21" />
            <path d="M21 15l-6 -6l-2 2l-3 -3l-3 3l-2 -2l-6 6" />
            <path d="M3 9l6 6l2 -2l3 3l3 -3l2 2l6 -6" />
          </svg>
          <span class="text-muted small">Failed to load image</span>
        </div>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { usePerformance } from '@/composables/usePerformance'
import LoadingState from './LoadingState.vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: ''
  },
  width: {
    type: [String, Number],
    default: 'auto'
  },
  height: {
    type: [String, Number],
    default: 'auto'
  },
  objectFit: {
    type: String,
    default: 'cover',
    validator: value => ['fill', 'contain', 'cover', 'none', 'scale-down'].includes(value)
  },
  lazy: {
    type: Boolean,
    default: true
  },
  threshold: {
    type: Number,
    default: 0.1
  },
  rootMargin: {
    type: String,
    default: '50px'
  },
  showPlaceholder: {
    type: Boolean,
    default: true
  },
  showErrorPlaceholder: {
    type: Boolean,
    default: true
  },
  retryAttempts: {
    type: Number,
    default: 3
  },
  retryDelay: {
    type: Number,
    default: 1000
  },
  imageClass: {
    type: [String, Array, Object],
    default: ''
  },
  fadeInDuration: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['load', 'error', 'intersect'])

// Composables
const { lazyLoading } = usePerformance()

// Refs
const imageRef = ref(null)
const isLoading = ref(true)
const isLoaded = ref(false)
const hasError = ref(false)
const currentSrc = ref(props.placeholder || '')
const retryCount = ref(0)
const intersectionObserver = ref(null)

// Computed properties
const imageStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  objectFit: props.objectFit,
  opacity: isLoaded.value ? 1 : 0,
  transition: `opacity ${props.fadeInDuration}ms ease-in-out`
}))

const placeholderStyle = computed(() => ({
  width: typeof props.width === 'number' ? `${props.width}px` : props.width,
  height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#f8f9fa',
  border: '1px solid #e9ecef'
}))

const lazyConfig = computed(() => ({
  threshold: props.threshold,
  rootMargin: props.rootMargin
}))

// Methods
const loadImage = () => {
  if (!props.src || hasError.value) return

  isLoading.value = true
  hasError.value = false
  currentSrc.value = props.src
}

const handleLoad = () => {
  isLoading.value = false
  isLoaded.value = true
  hasError.value = false
  retryCount.value = 0

  emit('load', {
    src: props.src,
    naturalWidth: imageRef.value?.naturalWidth,
    naturalHeight: imageRef.value?.naturalHeight
  })
}

const handleError = () => {
  isLoading.value = false
  hasError.value = true

  // Retry logic
  if (retryCount.value < props.retryAttempts) {
    retryCount.value++
    setTimeout(() => {
      if (hasError.value) {
        loadImage()
      }
    }, props.retryDelay * retryCount.value)
  } else {
    // All retries failed
    currentSrc.value = props.placeholder || ''
    emit('error', {
      src: props.src,
      retryCount: retryCount.value
    })
  }
}

const handleIntersection = entries => {
  const entry = entries[0]
  if (entry.isIntersecting && !isLoaded.value && !hasError.value) {
    loadImage()
    emit('intersect', entry)
  }
}

const setupLazyLoading = () => {
  if (!props.lazy || !imageRef.value) return

  intersectionObserver.value = new IntersectionObserver(handleIntersection, {
    threshold: props.threshold,
    rootMargin: props.rootMargin
  })

  intersectionObserver.value.observe(imageRef.value)
}

const cleanup = () => {
  if (intersectionObserver.value) {
    intersectionObserver.value.disconnect()
    intersectionObserver.value = null
  }
}

// Watchers
watch(
  () => props.src,
  (newSrc, oldSrc) => {
    if (newSrc !== oldSrc) {
      isLoaded.value = false
      hasError.value = false
      retryCount.value = 0

      if (props.lazy) {
        currentSrc.value = props.placeholder || ''
        setupLazyLoading()
      } else {
        loadImage()
      }
    }
  }
)

// Lifecycle
onMounted(() => {
  if (props.lazy) {
    setupLazyLoading()
  } else {
    loadImage()
  }
})

onUnmounted(() => {
  cleanup()
})

// Public methods
const reload = () => {
  hasError.value = false
  retryCount.value = 0
  loadImage()
}

const preload = () => {
  if (!isLoaded.value && !isLoading.value) {
    loadImage()
  }
}

defineExpose({
  reload,
  preload,
  isLoaded,
  isLoading,
  hasError
})
</script>

<style scoped>
.lazy-image-container {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.lazy-image-container img {
  display: block;
  max-width: 100%;
  height: auto;
}

.lazy-image-placeholder,
.lazy-image-error {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.lazy-image-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.lazy-image-error-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  color: #6c757d;
  text-align: center;
  padding: 1rem;
}

.lazy-image-error-content .icon {
  width: 2rem;
  height: 2rem;
  opacity: 0.5;
}

/* Loading animation */
.lazy-image-container.loading .lazy-image-placeholder {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Loaded state */
.lazy-image-container.loaded .lazy-image-placeholder,
.lazy-image-container.loaded .lazy-image-error {
  display: none;
}

/* Error state */
.lazy-image-container.error img {
  display: none;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .lazy-image-placeholder,
  .lazy-image-error {
    border: 2px solid;
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .lazy-image-container img {
    transition: none;
  }

  .lazy-image-container.loading .lazy-image-placeholder {
    animation: none;
    background: #f0f0f0;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .lazy-image-placeholder {
    background-color: #343a40;
    border-color: #495057;
  }

  .lazy-image-container.loading .lazy-image-placeholder {
    background: linear-gradient(90deg, #343a40 25%, #495057 50%, #343a40 75%);
    background-size: 200% 100%;
  }
}
</style>
