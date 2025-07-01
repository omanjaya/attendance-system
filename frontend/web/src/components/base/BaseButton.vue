<template>
  <component
    :is="tag"
    :type="tag === 'button' ? type : undefined"
    :to="tag === 'router-link' ? to : undefined"
    :href="tag === 'a' ? href : undefined"
    :disabled="disabled"
    :class="buttonClasses"
    v-bind="$attrs"
    @click="handleClick"
  >
    <span v-if="loading" class="btn-loading">
      <span class="spinner-border spinner-border-sm" role="status"></span>
    </span>
    
    <span v-if="icon && !loading" class="btn-icon" :class="{ 'btn-icon-start': iconPosition === 'start', 'btn-icon-end': iconPosition === 'end' }">
      <svg v-if="typeof icon === 'string'" class="icon" :class="`icon-${icon}`">
        <use :href="`#tabler-${icon}`"></use>
      </svg>
      <component v-else :is="icon" class="icon" />
    </span>
    
    <span v-if="$slots.default" class="btn-text">
      <slot />
    </span>
  </component>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Button variants
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => [
      'primary', 'secondary', 'success', 'warning', 'danger', 'info',
      'light', 'dark', 'outline-primary', 'outline-secondary', 'outline-success',
      'outline-warning', 'outline-danger', 'outline-info', 'outline-light', 'outline-dark',
      'ghost', 'link'
    ].includes(value)
  },
  
  // Button sizes
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },
  
  // Button states
  loading: {
    type: Boolean,
    default: false
  },
  
  disabled: {
    type: Boolean,
    default: false
  },
  
  // Button type (when used as button element)
  type: {
    type: String,
    default: 'button',
    validator: (value) => ['button', 'submit', 'reset'].includes(value)
  },
  
  // Router link props
  to: {
    type: [String, Object],
    default: null
  },
  
  // External link props
  href: {
    type: String,
    default: null
  },
  
  // Icon props
  icon: {
    type: [String, Object, Function],
    default: null
  },
  
  iconPosition: {
    type: String,
    default: 'start',
    validator: (value) => ['start', 'end'].includes(value)
  },
  
  // Button styles
  block: {
    type: Boolean,
    default: false
  },
  
  pill: {
    type: Boolean,
    default: false
  },
  
  square: {
    type: Boolean,
    default: false
  },
  
  // Only icon button
  iconOnly: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

// Determine the component tag
const tag = computed(() => {
  if (props.to) return 'router-link'
  if (props.href) return 'a'
  return 'button'
})

// Button classes
const buttonClasses = computed(() => {
  const classes = ['btn']
  
  // Variant classes
  if (props.variant.startsWith('outline-')) {
    classes.push(`btn-outline-${props.variant.replace('outline-', '')}`)
  } else if (props.variant === 'ghost') {
    classes.push('btn-ghost')
  } else if (props.variant === 'link') {
    classes.push('btn-link')
  } else {
    classes.push(`btn-${props.variant}`)
  }
  
  // Size classes
  if (props.size !== 'md') {
    classes.push(`btn-${props.size}`)
  }
  
  // State classes
  if (props.loading) {
    classes.push('btn-loading')
  }
  
  if (props.disabled) {
    classes.push('disabled')
  }
  
  // Style classes
  if (props.block) {
    classes.push('btn-block')
  }
  
  if (props.pill) {
    classes.push('btn-pill')
  }
  
  if (props.square) {
    classes.push('btn-square')
  }
  
  if (props.iconOnly) {
    classes.push('btn-icon-only')
  }
  
  return classes
})

// Handle click event
const handleClick = (event) => {
  if (props.loading || props.disabled) {
    event.preventDefault()
    return
  }
  emit('click', event)
}
</script>

<style scoped>
/* Base Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--btn-padding-y) var(--btn-padding-x);
  font-family: var(--font-family-base);
  font-size: var(--btn-font-size);
  font-weight: var(--font-weight-medium);
  line-height: var(--btn-line-height);
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  border-radius: var(--btn-border-radius);
  transition: var(--btn-transition);
  position: relative;
  overflow: hidden;
}

.btn:focus {
  outline: 0;
  box-shadow: 0 0 0 0.2rem rgba(32, 107, 196, 0.25);
}

.btn:disabled,
.btn.disabled {
  pointer-events: none;
  opacity: 0.65;
}

/* Button Variants */
.btn-primary {
  color: var(--color-white);
  background-color: var(--color-primary);
  border-color: var(--color-primary);
}

.btn-primary:hover {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.btn-secondary {
  color: var(--color-white);
  background-color: var(--color-secondary);
  border-color: var(--color-secondary);
}

.btn-secondary:hover {
  background-color: var(--color-secondary-hover);
  border-color: var(--color-secondary-hover);
}

.btn-success {
  color: var(--color-white);
  background-color: var(--color-success);
  border-color: var(--color-success);
}

.btn-success:hover {
  background-color: var(--color-success-hover);
  border-color: var(--color-success-hover);
}

.btn-warning {
  color: var(--color-white);
  background-color: var(--color-warning);
  border-color: var(--color-warning);
}

.btn-warning:hover {
  background-color: var(--color-warning-hover);
  border-color: var(--color-warning-hover);
}

.btn-danger {
  color: var(--color-white);
  background-color: var(--color-danger);
  border-color: var(--color-danger);
}

.btn-danger:hover {
  background-color: var(--color-danger-hover);
  border-color: var(--color-danger-hover);
}

.btn-info {
  color: var(--color-white);
  background-color: var(--color-info);
  border-color: var(--color-info);
}

.btn-info:hover {
  background-color: var(--color-info-hover);
  border-color: var(--color-info-hover);
}

/* Outline Variants */
.btn-outline-primary {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background-color: transparent;
}

.btn-outline-primary:hover {
  color: var(--color-white);
  background-color: var(--color-primary);
}

.btn-outline-secondary {
  color: var(--color-secondary);
  border-color: var(--color-secondary);
  background-color: transparent;
}

.btn-outline-secondary:hover {
  color: var(--color-white);
  background-color: var(--color-secondary);
}

/* Ghost and Link Variants */
.btn-ghost {
  color: var(--text-primary);
  background-color: transparent;
  border-color: transparent;
}

.btn-ghost:hover {
  background-color: var(--color-gray-100);
}

.btn-link {
  color: var(--text-link);
  background-color: transparent;
  border-color: transparent;
  text-decoration: underline;
}

.btn-link:hover {
  color: var(--text-link-hover);
}

/* Button Sizes */
.btn-xs {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-xs);
}

.btn-sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
}

.btn-lg {
  padding: var(--space-3) var(--space-6);
  font-size: var(--font-size-lg);
}

.btn-xl {
  padding: var(--space-4) var(--space-8);
  font-size: var(--font-size-xl);
}

/* Button Styles */
.btn-block {
  display: flex;
  width: 100%;
}

.btn-pill {
  border-radius: var(--radius-full);
}

.btn-square {
  border-radius: 0;
}

.btn-icon-only {
  aspect-ratio: 1;
  padding: var(--btn-padding-y);
}

/* Loading State */
.btn-loading {
  position: relative;
}

.btn-loading .btn-text {
  opacity: 0;
}

.btn-loading .spinner-border {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Icon Positioning */
.btn-icon {
  display: flex;
  align-items: center;
}

.btn-icon-start {
  order: -1;
}

.btn-icon-end {
  order: 1;
}

/* Icon styles */
.icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.5;
}

/* Responsive */
@media (max-width: 576px) {
  .btn {
    font-size: var(--font-size-sm);
    padding: var(--space-2) var(--space-3);
  }
  
  .btn-lg {
    font-size: var(--font-size-base);
    padding: var(--space-3) var(--space-4);
  }
}
</style>