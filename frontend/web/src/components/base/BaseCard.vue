<template>
  <div :class="cardClasses" v-bind="$attrs">
    <!-- Card Header -->
    <div v-if="$slots.header || title || subtitle || $slots.actions" class="card-header" :class="headerClasses">
      <div v-if="$slots.header" class="card-header-content">
        <slot name="header" />
      </div>
      <div v-else-if="title || subtitle" class="card-header-content">
        <h3 v-if="title" class="card-title">{{ title }}</h3>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </div>

      <div v-if="$slots.actions" class="card-actions">
        <slot name="actions" />
      </div>
    </div>

    <!-- Card Body -->
    <div v-if="$slots.default" class="card-body" :class="bodyClasses">
      <slot />
    </div>

    <!-- Card Footer -->
    <div v-if="$slots.footer" class="card-footer" :class="footerClasses">
      <slot name="footer" />
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="card-loading">
      <div class="card-loading-content">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <div v-if="loadingText" class="loading-text">{{ loadingText }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Card content
  title: {
    type: String,
    default: null
  },

  subtitle: {
    type: String,
    default: null
  },

  // Card variants
  variant: {
    type: String,
    default: 'default',
    validator: value => ['default', 'primary', 'secondary', 'success', 'warning', 'danger', 'info'].includes(value)
  },

  // Card styles
  shadow: {
    type: String,
    default: 'sm',
    validator: value => ['none', 'sm', 'base', 'md', 'lg', 'xl'].includes(value)
  },

  border: {
    type: Boolean,
    default: true
  },

  rounded: {
    type: String,
    default: 'lg',
    validator: value => ['none', 'sm', 'base', 'md', 'lg', 'xl', 'full'].includes(value)
  },

  // Card states
  loading: {
    type: Boolean,
    default: false
  },

  loadingText: {
    type: String,
    default: null
  },

  disabled: {
    type: Boolean,
    default: false
  },

  hoverable: {
    type: Boolean,
    default: false
  },

  clickable: {
    type: Boolean,
    default: false
  },

  // Layout options
  flush: {
    type: Boolean,
    default: false
  },

  compact: {
    type: Boolean,
    default: false
  },

  // Header options
  headerBorder: {
    type: Boolean,
    default: true
  },

  // Footer options
  footerBorder: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['click'])

// Card classes
const cardClasses = computed(() => {
  const classes = ['card']

  // Variant classes
  if (props.variant !== 'default') {
    classes.push(`card-${props.variant}`)
  }

  // Shadow classes
  if (props.shadow !== 'none') {
    classes.push(`shadow-${props.shadow}`)
  }

  // Border classes
  if (!props.border) {
    classes.push('card-borderless')
  }

  // Rounded classes
  if (props.rounded !== 'base') {
    classes.push(`rounded-${props.rounded}`)
  }

  // State classes
  if (props.disabled) {
    classes.push('card-disabled')
  }

  if (props.hoverable) {
    classes.push('card-hoverable')
  }

  if (props.clickable) {
    classes.push('card-clickable')
  }

  if (props.loading) {
    classes.push('card-loading-state')
  }

  // Layout classes
  if (props.flush) {
    classes.push('card-flush')
  }

  if (props.compact) {
    classes.push('card-compact')
  }

  return classes
})

// Header classes
const headerClasses = computed(() => {
  const classes = []

  if (!props.headerBorder) {
    classes.push('card-header-borderless')
  }

  return classes
})

// Body classes
const bodyClasses = computed(() => {
  const classes = []

  if (props.compact) {
    classes.push('card-body-compact')
  }

  return classes
})

// Footer classes
const footerClasses = computed(() => {
  const classes = []

  if (!props.footerBorder) {
    classes.push('card-footer-borderless')
  }

  return classes
})

// Handle click event
const handleClick = event => {
  if (props.clickable && !props.disabled && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
/* Base Card Styles */
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: var(--bg-surface);
  background-clip: border-box;
  border: 1px solid var(--card-border-color);
  border-radius: var(--card-border-radius);
  transition: var(--transition-base);
}

/* Card Variants */
.card-primary {
  border-color: var(--color-primary);
}

.card-primary .card-header {
  background-color: var(--color-primary-light);
  border-bottom-color: var(--color-primary);
}

.card-success {
  border-color: var(--color-success);
}

.card-success .card-header {
  background-color: var(--color-success-light);
  border-bottom-color: var(--color-success);
}

.card-warning {
  border-color: var(--color-warning);
}

.card-warning .card-header {
  background-color: var(--color-warning-light);
  border-bottom-color: var(--color-warning);
}

.card-danger {
  border-color: var(--color-danger);
}

.card-danger .card-header {
  background-color: var(--color-danger-light);
  border-bottom-color: var(--color-danger);
}

/* Card States */
.card-disabled {
  opacity: 0.6;
  pointer-events: none;
}

.card-hoverable:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.card-loading-state {
  overflow: hidden;
}

/* Card Layout */
.card-borderless {
  border: none;
}

.card-flush .card-body {
  padding: 0;
}

.card-compact .card-body {
  padding: var(--space-4);
}

/* Card Header */
.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--card-padding);
  margin-bottom: 0;
  background-color: rgba(0, 0, 0, 0.02);
  border-bottom: 1px solid var(--card-border-color);
  border-top-left-radius: calc(var(--card-border-radius) - 1px);
  border-top-right-radius: calc(var(--card-border-radius) - 1px);
}

.card-header-borderless {
  border-bottom: none;
  background-color: transparent;
}

.card-header-content {
  flex: 1;
  min-width: 0;
}

.card-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-tight);
  color: var(--text-primary);
}

.card-subtitle {
  margin: var(--space-1) 0 0 0;
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
}

.card-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: var(--space-4);
}

/* Card Body */
.card-body {
  flex: 1 1 auto;
  padding: var(--card-padding);
}

.card-body-compact {
  padding: var(--space-4);
}

/* Card Footer */
.card-footer {
  padding: var(--card-padding);
  background-color: rgba(0, 0, 0, 0.02);
  border-top: 1px solid var(--card-border-color);
  border-bottom-left-radius: calc(var(--card-border-radius) - 1px);
  border-bottom-right-radius: calc(var(--card-border-radius) - 1px);
}

.card-footer-borderless {
  border-top: none;
  background-color: transparent;
}

/* Loading Overlay */
.card-loading {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  border-radius: var(--card-border-radius);
}

.card-loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

.loading-text {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  font-weight: var(--font-weight-medium);
}

/* Responsive */
@media (max-width: 576px) {
  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .card-actions {
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
  }

  .card-body {
    padding: var(--space-4);
  }

  .card-header,
  .card-footer {
    padding: var(--space-4);
  }
}

/* Dark theme adjustments */
[data-theme='dark'] .card-loading {
  background-color: rgba(35, 39, 48, 0.9);
}
</style>
