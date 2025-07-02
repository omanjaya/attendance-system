<template>
  <component
    :is="iconComponent"
    :class="iconClasses"
    :size="iconSize"
    :stroke-width="strokeWidth"
    :aria-label="computedAriaLabel"
    :aria-hidden="computedAriaHidden"
    :role="computedRole"
    :tabindex="computedTabindex"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: value => {
      // Basic validation - the actual validation happens during import
      return typeof value === 'string' && value.length > 0
    }
  },
  size: {
    type: [String, Number],
    default: 24,
    validator: value => {
      if (typeof value === 'number') return value > 0
      const validSizes = [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        'mobile-sm',
        'mobile-md',
        'mobile-lg',
        'tablet-sm',
        'tablet-md',
        'tablet-lg',
        'desktop-sm',
        'desktop-md',
        'desktop-lg'
      ]
      return validSizes.includes(value)
    }
  },
  strokeWidth: {
    type: [Number, String],
    default: 2
  },
  color: {
    type: String,
    default: 'currentColor'
  },
  // Accessibility props
  ariaLabel: {
    type: String,
    default: ''
  },
  ariaHidden: {
    type: Boolean,
    default: false
  },
  decorative: {
    type: Boolean,
    default: false
  },
  focusable: {
    type: Boolean,
    default: false
  },
  role: {
    type: String,
    default: '',
    validator: value => {
      if (!value) return true
      return ['img', 'button', 'presentation', 'none'].includes(value)
    }
  }
})

defineOptions({
  inheritAttrs: false
})

// Responsive size mappings
const sizeMap = {
  // Inline icons - small text elements
  xs: 16,

  // Navigation icons - menu items, buttons
  sm: 20,

  // Standard icons - form elements, tables
  md: 24,

  // Dashboard icons - cards, widgets
  lg: 32,

  // Feature icons - landing pages, headers
  xl: 48,

  // Hero icons - splash screens, empty states
  '2xl': 64,

  // Responsive breakpoint sizes
  'mobile-sm': 20, // Mobile small icons
  'mobile-md': 24, // Mobile medium icons
  'mobile-lg': 28, // Mobile large icons (touch-friendly)
  'tablet-sm': 24, // Tablet small icons
  'tablet-md': 28, // Tablet medium icons
  'tablet-lg': 32, // Tablet large icons
  'desktop-sm': 20, // Desktop small icons
  'desktop-md': 24, // Desktop medium icons
  'desktop-lg': 32 // Desktop large icons
}

// Computed properties
const iconSize = computed(() => {
  if (typeof props.size === 'number') return props.size
  return sizeMap[props.size] || 24
})

const iconClasses = computed(() => {
  const classes = ['tabler-icon']

  if (typeof props.size === 'string') {
    classes.push(`tabler-icon-${props.size}`)
  }

  classes.push(`tabler-icon-${props.name}`)

  // Add accessibility classes
  if (props.focusable) {
    classes.push('tabler-icon-focusable')
  }

  if (props.decorative) {
    classes.push('tabler-icon-decorative')
  }

  return classes
})

// Computed accessibility properties
const computedAriaLabel = computed(() => {
  if (props.decorative || props.ariaHidden) return undefined

  if (props.ariaLabel) return props.ariaLabel

  // Generate default aria-label from icon name
  return `${props.name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')} icon`
})

const computedAriaHidden = computed(() => {
  if (props.decorative) return true
  return props.ariaHidden
})

const computedRole = computed(() => {
  if (props.role) return props.role

  if (props.decorative) return 'presentation'
  if (props.focusable) return 'button'

  return 'img'
})

const computedTabindex = computed(() => {
  if (props.focusable) return 0
  if (props.decorative || props.ariaHidden) return -1
  return undefined
})

// Dynamic icon component menggunakan template compilation
const iconComponent = computed(() => {
  const iconPaths = getIconPaths(props.name)

  return {
    name: 'TablerIconSVG',
    props: ['size', 'strokeWidth'],
    template: `
      <svg 
        :width="size || 24" 
        :height="size || 24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        :stroke-width="strokeWidth || 2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
        class="tabler-icon-svg"
      >
        ${iconPaths}
      </svg>
    `
  }
})

// Icon path definitions - a simplified set of commonly used icons
function getIconPaths(iconName) {
  const iconPaths = {
    // Navigation
    'layout-dashboard': () =>
      [
        '<rect x="4" y="4" width="6" height="6" rx="1"/>',
        '<rect x="14" y="4" width="6" height="6" rx="1"/>',
        '<rect x="4" y="14" width="6" height="6" rx="1"/>',
        '<rect x="14" y="14" width="6" height="6" rx="1"/>'
      ].join(''),

    users: () =>
      [
        '<circle cx="9" cy="7" r="4"/>',
        '<path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>',
        '<path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
        '<path d="M21 21v-2a4 4 0 0 0 -3 -3.85"/>'
      ].join(''),

    clock: () =>
      ['<circle cx="12" cy="12" r="9"/>', '<polyline points="12 7 12 12 15 15"/>'].join(''),

    calendar: () =>
      [
        '<rect x="4" y="5" width="16" height="16" rx="2"/>',
        '<line x1="16" y1="3" x2="16" y2="7"/>',
        '<line x1="8" y1="3" x2="8" y2="7"/>',
        '<line x1="4" y1="11" x2="20" y2="11"/>'
      ].join(''),

    'currency-dollar': () =>
      [
        '<line x1="12" y1="1" x2="12" y2="23"/>',
        '<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>'
      ].join(''),

    report: () =>
      [
        '<path d="M14 3v4a1 1 0 0 0 1 1h4"/>',
        '<path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z"/>',
        '<line x1="9" y1="9" x2="10" y2="9"/>',
        '<line x1="9" y1="13" x2="15" y2="13"/>',
        '<line x1="9" y1="17" x2="15" y2="17"/>'
      ].join(''),

    // Actions
    plus: () => '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
    edit: () =>
      '<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>',
    trash: () =>
      '<polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
    'device-floppy': () =>
      '<path d="M6 4h10l4 4v10a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2"/><circle cx="12" cy="14" r="2"/><polyline points="14,4 14,8 8,8 8,4"/>',
    download: () =>
      '<path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2"/><polyline points="7 11 12 16 17 11"/><line x1="12" y1="4" x2="12" y2="16"/>',
    search: () => '<circle cx="10" cy="10" r="7"/><line x1="21" y1="21" x2="15" y2="15"/>',

    // Status
    check: () => '<path d="M5 12l5 5l10 -10"/>',
    x: () => '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
    'circle-check': () => '<circle cx="12" cy="12" r="9"/><path d="M9 12l2 2 4 -4"/>',
    'clock-pause': () => '<circle cx="12" cy="12" r="9"/><path d="M10 10v4"/><path d="M14 10v4"/>',

    // Employee types
    school: () =>
      '<path d="M22 9L12 5 2 9l10 4 10-4v6"/><path d="M6 10.6V16a6 3 0 0 0 12 0v-5.4"/>',
    'user-check': () =>
      '<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/><path d="M16 11l2 2 4 -4"/>',
    briefcase: () =>
      '<rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
    'user-cog': () =>
      '<circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/><path d="M19.001 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"/><path d="M19.001 15.5v1.5"/><path d="M19.001 21v1.5"/><path d="M22.032 17.25l-1.299 .75"/><path d="M17.27 20l-1.3 .75"/><path d="M15.97 17.25l1.3 .75"/><path d="M20.733 20l1.3 .75"/>',

    // Face detection
    'face-id': () =>
      '<path d="M4 8V6a2 2 0 0 1 2-2h2"/><path d="M4 16v2a2 2 0 0 0 2 2h2"/><path d="M16 4h2a2 2 0 0 1 2 2v2"/><path d="M16 20h2a2 2 0 0 0 2-2v-2"/><line x1="9" y1="10" x2="9.01" y2="10"/><line x1="15" y1="10" x2="15.01" y2="10"/><path d="M9.5 15a3.5 3.5 0 0 0 5 0"/>',
    camera: () =>
      '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
    scan: () =>
      '<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><line x1="7" y1="12" x2="17" y2="12"/>',
    'arrow-up': () => '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
    'arrows-horizontal': () =>
      '<polyline points="7 8 3 12 7 16"/><line x1="3" y1="12" x2="21" y2="12"/><polyline points="17 8 21 12 17 16"/>',
    'mood-smile': () =>
      '<circle cx="12" cy="12" r="9"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/>',
    eye: () =>
      '<circle cx="12" cy="12" r="2"/><path d="M22 12c-2.667 4.667-6 7-10 7s-7.333-2.333-10-7c2.667-4.667 6-7 10-7s7.333 2.333 10 7"/>',

    // Fallback
    help: () =>
      '<circle cx="12" cy="12" r="9"/><line x1="12" y1="17" x2="12" y2="17.01"/><path d="M12 13.5a1.5 1.5 0 0 1 1-1.5a2.6 2.6 0 1 0 -3 -4"/>'
  }

  const pathData = iconPaths[iconName] || iconPaths['help']
  return typeof pathData === 'function' ? pathData() : pathData
}
</script>

<style scoped>
.tabler-icon {
  vertical-align: middle;
  flex-shrink: 0;
  display: inline-block;
  transition: all 0.2s ease;
}

/* Standard sizes */
.tabler-icon-xs {
  width: 1rem;
  height: 1rem;
}

.tabler-icon-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.tabler-icon-md {
  width: 1.5rem;
  height: 1.5rem;
}

.tabler-icon-lg {
  width: 2rem;
  height: 2rem;
}

.tabler-icon-xl {
  width: 3rem;
  height: 3rem;
}

.tabler-icon-2xl {
  width: 4rem;
  height: 4rem;
}

/* Responsive sizes for mobile optimization */
.tabler-icon-mobile-sm {
  width: 1.25rem;
  height: 1.25rem;
  min-width: 44px; /* Touch-friendly minimum */
  min-height: 44px;
  padding: 0.75rem;
}

.tabler-icon-mobile-md {
  width: 1.5rem;
  height: 1.5rem;
  min-width: 48px;
  min-height: 48px;
  padding: 0.75rem;
}

.tabler-icon-mobile-lg {
  width: 1.75rem;
  height: 1.75rem;
  min-width: 52px;
  min-height: 52px;
  padding: 0.875rem;
}

/* Tablet sizes */
.tabler-icon-tablet-sm {
  width: 1.5rem;
  height: 1.5rem;
}

.tabler-icon-tablet-md {
  width: 1.75rem;
  height: 1.75rem;
}

.tabler-icon-tablet-lg {
  width: 2rem;
  height: 2rem;
}

/* Desktop sizes */
.tabler-icon-desktop-sm {
  width: 1.25rem;
  height: 1.25rem;
}

.tabler-icon-desktop-md {
  width: 1.5rem;
  height: 1.5rem;
}

.tabler-icon-desktop-lg {
  width: 2rem;
  height: 2rem;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  /* Mobile: Increase icon sizes for better touch interaction */
  .tabler-icon-sm {
    width: 1.375rem;
    height: 1.375rem;
    min-width: 44px;
    min-height: 44px;
    padding: 0.8125rem;
  }

  .tabler-icon-md {
    width: 1.5rem;
    height: 1.5rem;
    min-width: 48px;
    min-height: 48px;
    padding: 0.75rem;
  }

  .tabler-icon-lg {
    width: 1.75rem;
    height: 1.75rem;
    min-width: 52px;
    min-height: 52px;
    padding: 0.875rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  /* Tablet: Moderate sizing */
  .tabler-icon-lg {
    width: 2.25rem;
    height: 2.25rem;
  }

  .tabler-icon-xl {
    width: 3.5rem;
    height: 3.5rem;
  }
}

@media (min-width: 1025px) {
  /* Desktop: Standard sizing */
  .tabler-icon-xl {
    width: 3rem;
    height: 3rem;
  }

  .tabler-icon-2xl {
    width: 4rem;
    height: 4rem;
  }
}

/* Ensure icons inherit color properly */
.tabler-icon {
  color: inherit;
  stroke: currentColor;
}

/* Loading and error states */
.tabler-icon-loading {
  opacity: 0.6;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.3;
  }
}

/* Accessibility improvements */
.tabler-icon:focus-visible {
  outline: 2px solid var(--tblr-primary);
  outline-offset: 2px;
  border-radius: 0.25rem;
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .tabler-icon {
    filter: contrast(1.2);
  }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  .tabler-icon {
    transition: none;
  }

  .tabler-icon-loading {
    animation: none;
  }
}

/* Touch device optimizations */
@media (hover: none) and (pointer: coarse) {
  .tabler-icon {
    /* Increase touch targets on touch devices */
    min-width: 44px;
    min-height: 44px;
    padding: 0.5rem;
  }

  .tabler-icon:active {
    transform: scale(0.95);
    opacity: 0.8;
  }
}

/* Print optimizations */
@media print {
  .tabler-icon {
    /* Ensure icons are visible in print */
    color: black !important;
    background: transparent !important;
  }
}
</style>
