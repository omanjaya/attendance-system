<template>
  <div class="loading-spinner" :class="spinnerClass">
    <!-- Spinner -->
    <div v-if="type === 'spinner'" class="spinner" :class="sizeClass">
      <div class="spinner-border" :class="variantClass" role="status">
        <span class="visually-hidden">{{ loadingText }}</span>
      </div>
    </div>

    <!-- Dots -->
    <div v-else-if="type === 'dots'" class="dots-spinner" :class="sizeClass">
      <div class="dot" :class="variantClass"></div>
      <div class="dot" :class="variantClass"></div>
      <div class="dot" :class="variantClass"></div>
    </div>

    <!-- Pulse -->
    <div v-else-if="type === 'pulse'" class="pulse-spinner" :class="sizeClass">
      <div class="pulse" :class="variantClass"></div>
    </div>

    <!-- Bars -->
    <div v-else-if="type === 'bars'" class="bars-spinner" :class="sizeClass">
      <div class="bar" :class="variantClass"></div>
      <div class="bar" :class="variantClass"></div>
      <div class="bar" :class="variantClass"></div>
      <div class="bar" :class="variantClass"></div>
    </div>

    <!-- Ring -->
    <div v-else-if="type === 'ring'" class="ring-spinner" :class="sizeClass">
      <div class="ring" :class="variantClass">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>

    <!-- Ripple -->
    <div v-else-if="type === 'ripple'" class="ripple-spinner" :class="sizeClass">
      <div class="ripple" :class="variantClass">
        <div></div>
        <div></div>
      </div>
    </div>

    <!-- Icon Spinner -->
    <div v-else-if="type === 'icon'" class="icon-spinner" :class="sizeClass">
      <TablerIcon :name="icon" :class="['spin', variantClass]" />
    </div>

    <!-- Text -->
    <div v-if="showText" class="loading-text" :class="textClass">
      {{ loadingText }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import TablerIcon from './TablerIcon.vue'

const props = defineProps({
  // Type of spinner
  type: {
    type: String,
    default: 'spinner',
    validator: value =>
      ['spinner', 'dots', 'pulse', 'bars', 'ring', 'ripple', 'icon'].includes(value)
  },

  // Size
  size: {
    type: String,
    default: 'md',
    validator: value => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
  },

  // Color variant
  variant: {
    type: String,
    default: 'primary',
    validator: value =>
      ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'light', 'dark'].includes(
        value
      )
  },

  // Icon for icon type
  icon: {
    type: String,
    default: 'loader'
  },

  // Text
  loadingText: {
    type: String,
    default: 'Loading...'
  },
  showText: {
    type: Boolean,
    default: false
  },

  // Layout
  center: {
    type: Boolean,
    default: false
  },
  overlay: {
    type: Boolean,
    default: false
  },
  fullscreen: {
    type: Boolean,
    default: false
  },

  // Styling
  color: String,
  backgroundColor: String
})

// Computed
const spinnerClass = computed(() => ({
  'loading-center': props.center,
  'loading-overlay': props.overlay,
  'loading-fullscreen': props.fullscreen,
  [`loading-${props.size}`]: props.size !== 'md'
}))

const sizeClass = computed(() => `spinner-${props.size}`)

const variantClass = computed(() => {
  if (props.color) {
    return ''
  }
  return `text-${props.variant}`
})

const textClass = computed(() => ({
  [`text-${props.variant}`]: !props.color,
  [`text-${props.size}`]: props.size !== 'md'
}))
</script>

<style scoped>
.loading-spinner {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.loading-center {
  justify-content: center;
  align-items: center;
  min-height: 100px;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loading-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Size variants */
.spinner-xs {
  font-size: 0.75rem;
}

.spinner-sm {
  font-size: 0.875rem;
}

.spinner-md {
  font-size: 1rem;
}

.spinner-lg {
  font-size: 1.25rem;
}

.spinner-xl {
  font-size: 1.5rem;
}

/* Spinner sizes */
.spinner-xs .spinner-border {
  width: 1rem;
  height: 1rem;
  border-width: 0.1em;
}

.spinner-sm .spinner-border {
  width: 1.5rem;
  height: 1.5rem;
  border-width: 0.15em;
}

.spinner-lg .spinner-border {
  width: 3rem;
  height: 3rem;
  border-width: 0.25em;
}

.spinner-xl .spinner-border {
  width: 4rem;
  height: 4rem;
  border-width: 0.3em;
}

/* Dots Spinner */
.dots-spinner {
  display: flex;
  gap: 0.25rem;
}

.dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background-color: currentColor;
  animation: dots-bounce 1.4s ease-in-out infinite both;
}

.dot:nth-child(1) {
  animation-delay: -0.32s;
}
.dot:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes dots-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.spinner-xs .dot {
  width: 0.3rem;
  height: 0.3rem;
}
.spinner-sm .dot {
  width: 0.4rem;
  height: 0.4rem;
}
.spinner-lg .dot {
  width: 0.75rem;
  height: 0.75rem;
}
.spinner-xl .dot {
  width: 1rem;
  height: 1rem;
}

/* Pulse Spinner */
.pulse {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: currentColor;
  animation: pulse-scale 1s ease-in-out infinite;
}

@keyframes pulse-scale {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.7;
  }
}

.spinner-xs .pulse {
  width: 1rem;
  height: 1rem;
}
.spinner-sm .pulse {
  width: 1.5rem;
  height: 1.5rem;
}
.spinner-lg .pulse {
  width: 3rem;
  height: 3rem;
}
.spinner-xl .pulse {
  width: 4rem;
  height: 4rem;
}

/* Bars Spinner */
.bars-spinner {
  display: flex;
  gap: 0.2rem;
  align-items: center;
}

.bar {
  width: 0.2rem;
  height: 1rem;
  background-color: currentColor;
  animation: bars-stretch 1.2s ease-in-out infinite;
}

.bar:nth-child(1) {
  animation-delay: -1.1s;
}
.bar:nth-child(2) {
  animation-delay: -1s;
}
.bar:nth-child(3) {
  animation-delay: -0.9s;
}
.bar:nth-child(4) {
  animation-delay: -0.8s;
}

@keyframes bars-stretch {
  0%,
  40%,
  100% {
    transform: scaleY(0.4);
  }
  20% {
    transform: scaleY(1);
  }
}

.spinner-xs .bar {
  width: 0.15rem;
  height: 0.75rem;
}
.spinner-sm .bar {
  width: 0.18rem;
  height: 0.875rem;
}
.spinner-lg .bar {
  width: 0.25rem;
  height: 1.5rem;
}
.spinner-xl .bar {
  width: 0.3rem;
  height: 2rem;
}

/* Ring Spinner */
.ring {
  position: relative;
  width: 2rem;
  height: 2rem;
}

.ring div {
  position: absolute;
  border: 0.2rem solid currentColor;
  border-radius: 50%;
  animation: ring-spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: currentColor transparent transparent transparent;
}

.ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.ring div:nth-child(3) {
  animation-delay: -0.15s;
}

@keyframes ring-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.spinner-xs .ring {
  width: 1rem;
  height: 1rem;
}
.spinner-xs .ring div {
  border-width: 0.1rem;
}
.spinner-sm .ring {
  width: 1.5rem;
  height: 1.5rem;
}
.spinner-sm .ring div {
  border-width: 0.15rem;
}
.spinner-lg .ring {
  width: 3rem;
  height: 3rem;
}
.spinner-lg .ring div {
  border-width: 0.3rem;
}
.spinner-xl .ring {
  width: 4rem;
  height: 4rem;
}
.spinner-xl .ring div {
  border-width: 0.4rem;
}

/* Ripple Spinner */
.ripple {
  position: relative;
  width: 2rem;
  height: 2rem;
}

.ripple div {
  position: absolute;
  border: 0.2rem solid currentColor;
  border-radius: 50%;
  animation: ripple-expand 1s linear infinite;
  opacity: 1;
}

.ripple div:nth-child(2) {
  animation-delay: -0.5s;
}

@keyframes ripple-expand {
  0% {
    top: 1rem;
    left: 1rem;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0;
    left: 0;
    width: 2rem;
    height: 2rem;
    opacity: 0;
  }
}

.spinner-xs .ripple {
  width: 1rem;
  height: 1rem;
}
.spinner-xs .ripple div {
  border-width: 0.1rem;
}
.spinner-sm .ripple {
  width: 1.5rem;
  height: 1.5rem;
}
.spinner-sm .ripple div {
  border-width: 0.15rem;
}
.spinner-lg .ripple {
  width: 3rem;
  height: 3rem;
}
.spinner-lg .ripple div {
  border-width: 0.3rem;
}
.spinner-xl .ripple {
  width: 4rem;
  height: 4rem;
}
.spinner-xl .ripple div {
  border-width: 0.4rem;
}

/* Icon Spinner */
.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Loading Text */
.loading-text {
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 0.5rem;
}

.text-xs {
  font-size: 0.75rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-lg {
  font-size: 1.125rem;
}
.text-xl {
  font-size: 1.25rem;
}

/* Dark mode support */
:root.dark .loading-overlay {
  background-color: rgba(26, 32, 44, 0.8);
}

:root.dark .loading-fullscreen {
  background-color: rgba(26, 32, 44, 0.9);
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .spinner-border,
  .dot,
  .pulse,
  .bar,
  .ring div,
  .ripple div,
  .spin {
    animation-duration: 3s;
  }
}
</style>
