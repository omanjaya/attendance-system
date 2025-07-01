<template>
  <span 
    :class="['animated-number', { 'animating': isAnimating }]"
    :aria-label="accessibleValue"
  >
    {{ displayValue }}
  </span>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // The target value to animate to
  value: {
    type: [Number, String],
    required: true
  },
  
  // Animation duration in milliseconds
  duration: {
    type: Number,
    default: 1000
  },
  
  // Whether to animate the number
  animate: {
    type: Boolean,
    default: true
  },
  
  // Number formatting
  format: {
    type: String,
    default: 'decimal',
    validator: (value) => ['decimal', 'currency', 'percent', 'compact'].includes(value)
  },
  
  // Decimal places
  decimals: {
    type: Number,
    default: 0
  },
  
  // Currency options (when format is 'currency')
  currency: {
    type: String,
    default: 'USD'
  },
  
  // Locale for formatting
  locale: {
    type: String,
    default: 'en-US'
  },
  
  // Custom prefix
  prefix: {
    type: String,
    default: ''
  },
  
  // Custom suffix
  suffix: {
    type: String,
    default: ''
  },
  
  // Easing function
  easing: {
    type: String,
    default: 'easeOutCubic',
    validator: (value) => ['linear', 'easeInCubic', 'easeOutCubic', 'easeInOutCubic'].includes(value)
  }
})

// State
const currentValue = ref(0)
const isAnimating = ref(false)
let animationId = null

// Computed properties
const numericValue = computed(() => {
  const value = parseFloat(props.value)
  return isNaN(value) ? 0 : value
})

const displayValue = computed(() => {
  const value = currentValue.value
  let formatted = ''
  
  switch (props.format) {
    case 'currency':
      formatted = new Intl.NumberFormat(props.locale, {
        style: 'currency',
        currency: props.currency,
        minimumFractionDigits: props.decimals,
        maximumFractionDigits: props.decimals
      }).format(value)
      break
      
    case 'percent':
      formatted = new Intl.NumberFormat(props.locale, {
        style: 'percent',
        minimumFractionDigits: props.decimals,
        maximumFractionDigits: props.decimals
      }).format(value / 100)
      break
      
    case 'compact':
      formatted = new Intl.NumberFormat(props.locale, {
        notation: 'compact',
        compactDisplay: 'short',
        minimumFractionDigits: 0,
        maximumFractionDigits: 1
      }).format(value)
      break
      
    default: // decimal
      formatted = new Intl.NumberFormat(props.locale, {
        minimumFractionDigits: props.decimals,
        maximumFractionDigits: props.decimals
      }).format(value)
      break
  }
  
  return `${props.prefix}${formatted}${props.suffix}`
})

const accessibleValue = computed(() => {
  return `${props.prefix}${numericValue.value}${props.suffix}`
})

// Animation functions
const easingFunctions = {
  linear: (t) => t,
  easeInCubic: (t) => t * t * t,
  easeOutCubic: (t) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

const animateValue = (start, end, duration) => {
  if (!props.animate || start === end) {
    currentValue.value = end
    return
  }
  
  isAnimating.value = true
  
  const startTime = performance.now()
  const easingFunction = easingFunctions[props.easing] || easingFunctions.easeOutCubic
  
  const animate = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    const easedProgress = easingFunction(progress)
    const value = start + (end - start) * easedProgress
    
    currentValue.value = value
    
    if (progress < 1) {
      animationId = requestAnimationFrame(animate)
    } else {
      currentValue.value = end
      isAnimating.value = false
      animationId = null
    }
  }
  
  animationId = requestAnimationFrame(animate)
}

const stopAnimation = () => {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
    isAnimating.value = false
  }
}

// Watchers
watch(() => numericValue.value, (newValue, oldValue) => {
  stopAnimation()
  animateValue(oldValue || 0, newValue, props.duration)
}, { immediate: false })

// Lifecycle
onMounted(() => {
  // Set initial value without animation
  currentValue.value = numericValue.value
})

onUnmounted(() => {
  stopAnimation()
})

// Methods for parent component
const setValue = (value, animate = true) => {
  const oldValue = currentValue.value
  const newValue = parseFloat(value) || 0
  
  if (animate && props.animate) {
    animateValue(oldValue, newValue, props.duration)
  } else {
    currentValue.value = newValue
  }
}

const reset = () => {
  stopAnimation()
  currentValue.value = 0
}

// Expose methods
defineExpose({
  setValue,
  reset,
  stopAnimation
})
</script>

<style scoped>
.animated-number {
  display: inline-block;
  font-variant-numeric: tabular-nums;
  transition: color var(--transition-fast);
}

.animated-number.animating {
  color: var(--color-primary);
}

/* Ensure consistent width for tabular numbers */
.animated-number {
  font-feature-settings: 'tnum';
}

/* Accessibility - reduce motion */
@media (prefers-reduced-motion: reduce) {
  .animated-number {
    /* Numbers will still update but without smooth animation */
    transition: none;
  }
}
</style>