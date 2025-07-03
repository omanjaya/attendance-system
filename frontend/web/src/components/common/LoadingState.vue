<template>
  <div
    class="loading-state"
    :class="[`loading-${variant}`, `loading-${size}`, { 'loading-overlay': overlay }]"
    :aria-label="ariaLabel"
    role="status"
    aria-live="polite"
  >
    <div v-if="overlay" class="loading-backdrop"></div>

    <div class="loading-content">
      <!-- Spinner Variants -->
      <div v-if="variant === 'spinner'" class="loading-spinner">
        <div class="spinner"></div>
        <div v-if="message" class="loading-message">{{ message }}</div>
      </div>

      <!-- Dots Variants -->
      <div v-else-if="variant === 'dots'" class="loading-dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
        <div v-if="message" class="loading-message">{{ message }}</div>
      </div>

      <!-- Pulse Variants -->
      <div v-else-if="variant === 'pulse'" class="loading-pulse">
        <div class="pulse-circle"></div>
        <div v-if="message" class="loading-message">{{ message }}</div>
      </div>

      <!-- Progress Bar -->
      <div v-else-if="variant === 'progress'" class="loading-progress">
        <div v-if="message" class="loading-message">{{ message }}</div>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${progress}%` }"></div>
        </div>
        <div v-if="showPercentage" class="progress-percentage">{{ progress }}%</div>
      </div>

      <!-- Custom Icon -->
      <div v-else-if="variant === 'icon'" class="loading-icon">
        <svg class="loading-icon-svg">
          <use :href="`#tabler-${icon}`"></use>
        </svg>
        <div v-if="message" class="loading-message">{{ message }}</div>
      </div>

      <!-- Skeleton Screen -->
      <div v-else-if="variant === 'skeleton'" class="loading-skeleton">
        <SkeletonLoader
          :variant="skeletonType"
          :lines="skeletonLines"
          :rows="skeletonRows"
          :columns="skeletonColumns"
          :animated="true"
        />
      </div>

      <!-- Card Placeholder -->
      <div v-else-if="variant === 'card'" class="loading-card-placeholder">
        <div class="card-placeholder">
          <div class="card-header-placeholder">
            <SkeletonLoader variant="avatar" size="medium" />
            <div class="card-text-placeholder">
              <SkeletonLoader variant="text" :lines="2" />
            </div>
          </div>
          <div class="card-body-placeholder">
            <SkeletonLoader variant="text" :lines="3" />
          </div>
          <div class="card-actions-placeholder">
            <SkeletonLoader variant="button" width="80px" />
            <SkeletonLoader variant="button" width="80px" />
          </div>
        </div>
      </div>

      <!-- Table Placeholder -->
      <div v-else-if="variant === 'table'" class="loading-table-placeholder">
        <SkeletonLoader variant="table" :rows="skeletonRows || 5" :columns="skeletonColumns || 4" />
      </div>

      <!-- Default Spinner -->
      <div v-else class="loading-spinner">
        <div class="spinner"></div>
        <div v-if="message" class="loading-message">{{ message }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SkeletonLoader from './SkeletonLoader.vue'

defineProps({
  // Loading state variant
  variant: {
    type: String,
    default: 'spinner',
    validator: value => ['spinner', 'dots', 'pulse', 'progress', 'icon', 'skeleton', 'card', 'table'].includes(value)
  },

  // Size of the loading indicator
  size: {
    type: String,
    default: 'medium',
    validator: value => ['small', 'medium', 'large'].includes(value)
  },

  // Loading message
  message: {
    type: String,
    default: ''
  },

  // Progress value (0-100) for progress variant
  progress: {
    type: Number,
    default: 0,
    validator: value => value >= 0 && value <= 100
  },

  // Show percentage for progress variant
  showPercentage: {
    type: Boolean,
    default: false
  },

  // Icon for icon variant
  icon: {
    type: String,
    default: 'loader'
  },

  // Overlay mode
  overlay: {
    type: Boolean,
    default: false
  },

  // Skeleton-specific props
  skeletonType: {
    type: String,
    default: 'rectangular'
  },
  skeletonLines: {
    type: Number,
    default: 3
  },
  skeletonRows: {
    type: Number,
    default: 5
  },
  skeletonColumns: {
    type: Number,
    default: 4
  },

  // Accessibility
  ariaLabel: {
    type: String,
    default: 'Loading content'
  }
})
</script>

<style scoped>
/* Base Loading State */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 4rem;
  position: relative;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: var(--z-modal);
  background-color: var(--bg-overlay);
}

.loading-backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
}

.loading-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-3);
}

/* Size Variants */
.loading-small {
  min-height: 2rem;
  --loading-size: 1rem;
  --loading-message-size: var(--font-size-xs);
}

.loading-medium {
  min-height: 4rem;
  --loading-size: 1.5rem;
  --loading-message-size: var(--font-size-sm);
}

.loading-large {
  min-height: 6rem;
  --loading-size: 2rem;
  --loading-message-size: var(--font-size-base);
}

/* Loading Message */
.loading-message {
  font-size: var(--loading-message-size);
  color: var(--text-secondary);
  text-align: center;
  margin-top: var(--space-2);
}

/* Spinner Variant */
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.spinner {
  width: calc(var(--loading-size) * 1.5);
  height: calc(var(--loading-size) * 1.5);
  border: 2px solid var(--color-gray-200);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spinner-rotate 1s linear infinite;
}

@keyframes spinner-rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Dots Variant */
.loading-dots {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-dots .dot {
  width: var(--loading-size);
  height: var(--loading-size);
  margin: 0 var(--space-1);
  background-color: var(--color-primary);
  border-radius: 50%;
  display: inline-block;
  animation: dots-bounce 1.4s ease-in-out both infinite;
}

.loading-dots .dot:nth-child(1) {
  animation-delay: -0.32s;
}
.loading-dots .dot:nth-child(2) {
  animation-delay: -0.16s;
}
.loading-dots .dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes dots-bounce {
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
}

/* Pulse Variant */
.loading-pulse {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pulse-circle {
  width: calc(var(--loading-size) * 2);
  height: calc(var(--loading-size) * 2);
  background-color: var(--color-primary);
  border-radius: 50%;
  animation: pulse-scale 1.5s ease-in-out infinite;
}

@keyframes pulse-scale {
  0% {
    transform: scale(0);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 0;
  }
}

/* Progress Variant */
.loading-progress {
  width: 100%;
  max-width: 20rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.progress-bar {
  width: 100%;
  height: 0.5rem;
  background-color: var(--color-gray-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-base);
}

.progress-percentage {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  text-align: center;
}

/* Icon Variant */
.loading-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.loading-icon-svg {
  width: calc(var(--loading-size) * 1.5);
  height: calc(var(--loading-size) * 1.5);
  color: var(--color-primary);
  animation: icon-spin 2s linear infinite;
}

@keyframes icon-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Skeleton Variant */
.loading-skeleton {
  width: 100%;
  padding: var(--space-4);
}

/* Card Placeholder */
.loading-card-placeholder {
  width: 100%;
  max-width: 24rem;
}

.card-placeholder {
  padding: var(--space-4);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
}

.card-header-placeholder {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.card-text-placeholder {
  flex: 1;
}

.card-body-placeholder {
  margin-bottom: var(--space-4);
}

.card-actions-placeholder {
  display: flex;
  gap: var(--space-2);
}

/* Table Placeholder */
.loading-table-placeholder {
  width: 100%;
  padding: var(--space-4);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
}

/* Dark theme adjustments */
[data-theme='dark'] .loading-backdrop {
  background-color: rgba(0, 0, 0, 0.8);
}

[data-theme='dark'] .spinner {
  border-color: var(--color-gray-700);
  border-top-color: var(--color-primary);
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .spinner,
  .loading-icon-svg {
    animation: none;
  }

  .loading-dots .dot {
    animation: none;
    opacity: 0.7;
  }

  .pulse-circle {
    animation: none;
    opacity: 0.7;
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .loading-progress {
    max-width: 100%;
  }

  .card-placeholder {
    padding: var(--space-3);
  }

  .card-actions-placeholder {
    flex-direction: column;
  }
}
</style>
