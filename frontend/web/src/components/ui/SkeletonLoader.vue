<template>
  <div
    class="skeleton"
    :class="[
      `skeleton-${variant}`,
      `skeleton-${size}`,
      { 'skeleton-animated': animated }
    ]"
    :style="customStyles"
    :aria-label="ariaLabel"
    role="progressbar"
    aria-valuemin="0"
    aria-valuemax="100"
    aria-valuetext="Loading..."
  >
    <div v-if="variant === 'text'" class="skeleton-content">
      <div
        v-for="line in lines"
        :key="line"
        class="skeleton-line"
        :style="getLineStyle(line)"
      ></div>
    </div>
    
    <div v-else-if="variant === 'avatar'" class="skeleton-content">
      <div class="skeleton-avatar-inner"></div>
    </div>
    
    <div v-else-if="variant === 'card'" class="skeleton-content">
      <div class="skeleton-card-header">
        <div class="skeleton-card-avatar"></div>
        <div class="skeleton-card-text">
          <div class="skeleton-card-title"></div>
          <div class="skeleton-card-subtitle"></div>
        </div>
      </div>
      <div class="skeleton-card-body">
        <div v-for="line in (lines || 3)" :key="line" class="skeleton-card-line"></div>
      </div>
      <div v-if="showCardActions" class="skeleton-card-actions">
        <div class="skeleton-card-button"></div>
        <div class="skeleton-card-button"></div>
      </div>
    </div>
    
    <div v-else-if="variant === 'table'" class="skeleton-content">
      <div class="skeleton-table-header">
        <div 
          v-for="col in columns" 
          :key="col" 
          class="skeleton-table-header-cell"
        ></div>
      </div>
      <div 
        v-for="row in rows" 
        :key="row" 
        class="skeleton-table-row"
      >
        <div 
          v-for="col in columns" 
          :key="col" 
          class="skeleton-table-cell"
        ></div>
      </div>
    </div>
    
    <div v-else-if="variant === 'button'" class="skeleton-content">
      <div class="skeleton-button-inner"></div>
    </div>
    
    <div v-else-if="variant === 'input'" class="skeleton-content">
      <div class="skeleton-input-inner"></div>
    </div>
    
    <div v-else class="skeleton-content">
      <!-- Default rectangular skeleton -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // Skeleton type
  variant: {
    type: String,
    default: 'rectangular',
    validator: (value) => [
      'rectangular', 'circular', 'rounded', 'text', 'avatar', 
      'card', 'table', 'button', 'input'
    ].includes(value)
  },
  
  // Size presets
  size: {
    type: String,
    default: 'medium',
    validator: (value) => ['small', 'medium', 'large'].includes(value)
  },
  
  // Animation
  animated: {
    type: Boolean,
    default: true
  },
  
  // Dimensions
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },
  
  // Text-specific props
  lines: {
    type: Number,
    default: 1
  },
  
  // Table-specific props
  rows: {
    type: Number,
    default: 5
  },
  columns: {
    type: Number,
    default: 4
  },
  
  // Card-specific props
  showCardActions: {
    type: Boolean,
    default: true
  },
  
  // Accessibility
  ariaLabel: {
    type: String,
    default: 'Loading content'
  }
})

// Computed styles
const customStyles = computed(() => {
  const styles = {}
  
  if (props.width) {
    styles.width = typeof props.width === 'number' ? `${props.width}px` : props.width
  }
  
  if (props.height) {
    styles.height = typeof props.height === 'number' ? `${props.height}px` : props.height
  }
  
  return styles
})

// Generate line styles for text variant
const getLineStyle = (lineNumber) => {
  const styles = {}
  
  // Make last line shorter for more realistic text appearance
  if (lineNumber === props.lines && props.lines > 1) {
    styles.width = `${60 + Math.random() * 30}%`
  }
  
  return styles
}
</script>

<style scoped>
/* Base Skeleton Styles */
.skeleton {
  display: block;
  background: var(--skeleton-base, #f0f0f0);
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

.skeleton-animated::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--skeleton-highlight, rgba(255, 255, 255, 0.4)),
    transparent
  );
  animation: skeleton-shimmer 1.5s infinite;
}

@keyframes skeleton-shimmer {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: 100%;
  }
}

/* Size Variants */
.skeleton-small {
  --skeleton-height: 1rem;
}

.skeleton-medium {
  --skeleton-height: 1.5rem;
}

.skeleton-large {
  --skeleton-height: 2rem;
}

/* Shape Variants */
.skeleton-rectangular {
  width: 100%;
  height: var(--skeleton-height, 1.5rem);
}

.skeleton-circular {
  width: var(--skeleton-height, 1.5rem);
  height: var(--skeleton-height, 1.5rem);
  border-radius: 50%;
}

.skeleton-rounded {
  width: 100%;
  height: var(--skeleton-height, 1.5rem);
  border-radius: var(--radius-full);
}

/* Text Variant */
.skeleton-text {
  width: 100%;
}

.skeleton-text .skeleton-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.skeleton-line {
  height: 1rem;
  background: var(--skeleton-base);
  border-radius: var(--radius-sm);
  width: 100%;
}

.skeleton-line:last-child {
  width: 75%;
}

/* Avatar Variant */
.skeleton-avatar {
  width: var(--skeleton-height, 2.5rem);
  height: var(--skeleton-height, 2.5rem);
}

.skeleton-avatar-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: var(--skeleton-base);
}

/* Card Variant */
.skeleton-card {
  width: 100%;
  min-height: 12rem;
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}

.skeleton-card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}

.skeleton-card-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background: var(--skeleton-base);
  flex-shrink: 0;
}

.skeleton-card-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.skeleton-card-title {
  height: 1rem;
  width: 60%;
  background: var(--skeleton-base);
  border-radius: var(--radius-sm);
}

.skeleton-card-subtitle {
  height: 0.875rem;
  width: 40%;
  background: var(--skeleton-base);
  border-radius: var(--radius-sm);
}

.skeleton-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.skeleton-card-line {
  height: 0.875rem;
  background: var(--skeleton-base);
  border-radius: var(--radius-sm);
  width: 100%;
}

.skeleton-card-line:nth-child(2) {
  width: 85%;
}

.skeleton-card-line:last-child {
  width: 65%;
}

.skeleton-card-actions {
  display: flex;
  gap: var(--space-2);
  margin-top: auto;
}

.skeleton-card-button {
  height: 2rem;
  width: 4rem;
  background: var(--skeleton-base);
  border-radius: var(--radius-md);
}

/* Table Variant */
.skeleton-table {
  width: 100%;
}

.skeleton-table-header {
  display: grid;
  grid-template-columns: repeat(var(--columns, 4), 1fr);
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: var(--space-2);
}

.skeleton-table-header-cell {
  height: 1rem;
  background: var(--skeleton-base);
  border-radius: var(--radius-sm);
}

.skeleton-table-row {
  display: grid;
  grid-template-columns: repeat(var(--columns, 4), 1fr);
  gap: var(--space-4);
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border-light);
}

.skeleton-table-cell {
  height: 0.875rem;
  background: var(--skeleton-base);
  border-radius: var(--radius-sm);
}

.skeleton-table-cell:first-child {
  width: 80%;
}

.skeleton-table-cell:last-child {
  width: 60%;
}

/* Button Variant */
.skeleton-button {
  display: inline-block;
  width: auto;
  min-width: 4rem;
  height: 2.25rem;
}

.skeleton-button-inner {
  width: 100%;
  height: 100%;
  background: var(--skeleton-base);
  border-radius: var(--radius-md);
}

/* Input Variant */
.skeleton-input {
  width: 100%;
  height: 2.5rem;
}

.skeleton-input-inner {
  width: 100%;
  height: 100%;
  background: var(--skeleton-base);
  border-radius: var(--radius-md);
}

/* Dark theme adjustments */
[data-theme="dark"] .skeleton {
  --skeleton-base: #2a2a2a;
  --skeleton-highlight: rgba(255, 255, 255, 0.1);
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .skeleton {
    --skeleton-base: #e0e0e0;
    --skeleton-highlight: rgba(255, 255, 255, 0.6);
  }
  
  [data-theme="dark"] .skeleton {
    --skeleton-base: #404040;
    --skeleton-highlight: rgba(255, 255, 255, 0.2);
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  .skeleton-animated::before {
    animation: none;
  }
  
  .skeleton-animated {
    opacity: 0.7;
  }
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .skeleton-card {
    padding: var(--space-3);
    min-height: 10rem;
  }
  
  .skeleton-table-header,
  .skeleton-table-row {
    gap: var(--space-2);
  }
  
  .skeleton-card-actions {
    flex-direction: column;
  }
  
  .skeleton-card-button {
    width: 100%;
  }
}

/* Custom CSS properties for dynamic columns */
.skeleton-table {
  --columns: v-bind(columns);
}
</style>