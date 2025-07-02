/**
 * Asset Optimization Utilities
 */

// Lazy load CSS for non-critical components
export const loadComponentStyles = async componentName => {
  try {
    await import(`@/assets/css/components/${componentName}.css`)
  } catch (error) {
    console.warn(`No specific styles for component: ${componentName}`)
  }
}

// Image optimization utilities
export const optimizeImage = (src, options = {}) => {
  const { width = 'auto', height = 'auto', quality = 85, format = 'webp' } = options

  // In production, this would integrate with an image CDN
  return src
}

// CSS purging for production
export const purgeCSSConfig = {
  content: ['./src/**/*.vue', './src/**/*.js', './src/**/*.ts'],
  safelist: [
    // Tabler classes that might be used dynamically
    /^btn-/,
    /^card-/,
    /^alert-/,
    /^badge-/,
    /^text-/,
    /^bg-/
  ]
}
