import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

/**
 * Accessibility composable for enhanced a11y features
 */
export const useAccessibility = () => {
  // State
  const focusHistory = ref([])
  const announcements = ref([])
  const preferences = ref({
    reducedMotion: false,
    highContrast: false,
    largeText: false,
    screenReader: false
  })

  /**
   * Focus management
   */
  const manageFocus = {
    /**
     * Save current focus to history
     */
    saveFocus: () => {
      const activeElement = document.activeElement
      if (activeElement && activeElement !== document.body) {
        focusHistory.value.push(activeElement)
      }
    },

    /**
     * Restore previous focus
     */
    restoreFocus: () => {
      const lastFocus = focusHistory.value.pop()
      if (lastFocus && typeof lastFocus.focus === 'function') {
        try {
          lastFocus.focus()
        } catch (error) {
          // Element might be removed from DOM
          console.warn('Could not restore focus:', error)
        }
      }
    },

    /**
     * Focus first focusable element in container
     */
    focusFirst: (container = document) => {
      const focusable = getFocusableElements(container)
      if (focusable.length > 0) {
        focusable[0].focus()
        return true
      }
      return false
    },

    /**
     * Focus last focusable element in container
     */
    focusLast: (container = document) => {
      const focusable = getFocusableElements(container)
      if (focusable.length > 0) {
        focusable[focusable.length - 1].focus()
        return true
      }
      return false
    },

    /**
     * Trap focus within container
     */
    trapFocus: container => {
      const focusable = getFocusableElements(container)
      if (focusable.length === 0) return

      const firstFocusable = focusable[0]
      const lastFocusable = focusable[focusable.length - 1]

      const handleKeyDown = event => {
        if (event.key === 'Tab') {
          if (event.shiftKey) {
            if (document.activeElement === firstFocusable) {
              event.preventDefault()
              lastFocusable.focus()
            }
          } else {
            if (document.activeElement === lastFocusable) {
              event.preventDefault()
              firstFocusable.focus()
            }
          }
        }
      }

      container.addEventListener('keydown', handleKeyDown)

      // Return cleanup function
      return () => {
        container.removeEventListener('keydown', handleKeyDown)
      }
    }
  }

  /**
   * Screen reader announcements
   */
  const announce = (message, priority = 'polite') => {
    const announcement = {
      id: Date.now(),
      message,
      priority,
      timestamp: new Date()
    }

    announcements.value.push(announcement)

    // Create live region for announcement
    const liveRegion = document.createElement('div')
    liveRegion.setAttribute('aria-live', priority)
    liveRegion.setAttribute('aria-atomic', 'true')
    liveRegion.className = 'sr-only'
    liveRegion.textContent = message

    document.body.appendChild(liveRegion)

    // Remove after announcement
    setTimeout(() => {
      if (liveRegion.parentNode) {
        liveRegion.parentNode.removeChild(liveRegion)
      }
      const index = announcements.value.findIndex(a => a.id === announcement.id)
      if (index > -1) {
        announcements.value.splice(index, 1)
      }
    }, 1000)
  }

  /**
   * Keyboard navigation helpers
   */
  const keyboardNavigation = {
    /**
     * Handle arrow key navigation
     */
    handleArrowKeys: (event, elements, currentIndex) => {
      let newIndex = currentIndex

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          newIndex = (currentIndex + 1) % elements.length
          break
        case 'ArrowUp':
        case 'ArrowLeft':
          newIndex = currentIndex === 0 ? elements.length - 1 : currentIndex - 1
          break
        case 'Home':
          newIndex = 0
          break
        case 'End':
          newIndex = elements.length - 1
          break
        default:
          return currentIndex
      }

      if (elements[newIndex]) {
        elements[newIndex].focus()
        event.preventDefault()
      }

      return newIndex
    },

    /**
     * Handle escape key
     */
    handleEscape: callback => {
      const handleKeyDown = event => {
        if (event.key === 'Escape') {
          callback(event)
        }
      }

      document.addEventListener('keydown', handleKeyDown)

      return () => {
        document.removeEventListener('keydown', handleKeyDown)
      }
    },

    /**
     * Handle enter/space activation
     */
    handleActivation: (event, callback) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault()
        callback(event)
      }
    }
  }

  /**
   * ARIA helpers
   */
  const aria = {
    /**
     * Set ARIA attributes
     */
    setAttributes: (element, attributes) => {
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          element.setAttribute(key, value)
        } else {
          element.removeAttribute(key)
        }
      })
    },

    /**
     * Generate unique ID for ARIA relationships
     */
    generateId: (prefix = 'a11y') => {
      return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    },

    /**
     * Link elements with ARIA relationships
     */
    linkElements: (trigger, target, relationship = 'controls') => {
      const targetId = target.id || aria.generateId()
      target.id = targetId
      trigger.setAttribute(`aria-${relationship}`, targetId)
    }
  }

  /**
   * Color contrast helpers
   */
  const colorContrast = {
    /**
     * Calculate color contrast ratio
     */
    getContrastRatio: (color1, color2) => {
      const l1 = getRelativeLuminance(color1)
      const l2 = getRelativeLuminance(color2)
      const lighter = Math.max(l1, l2)
      const darker = Math.min(l1, l2)
      return (lighter + 0.05) / (darker + 0.05)
    },

    /**
     * Check if contrast meets WCAG standards
     */
    meetsWCAG: (color1, color2, level = 'AA', size = 'normal') => {
      const ratio = colorContrast.getContrastRatio(color1, color2)
      const minRatio = getMinContrastRatio(level, size)
      return ratio >= minRatio
    },

    /**
     * Suggest accessible color
     */
    suggestAccessibleColor: (foreground, background, level = 'AA') => {
      // Implementation would analyze and suggest accessible color combinations
      return foreground // Simplified for now
    }
  }

  /**
   * User preference detection
   */
  const detectPreferences = () => {
    const mediaQueries = {
      reducedMotion: '(prefers-reduced-motion: reduce)',
      highContrast: '(prefers-contrast: high)',
      largeText: '(prefers-reduced-data: reduce)', // Approximate
      darkMode: '(prefers-color-scheme: dark)'
    }

    Object.entries(mediaQueries).forEach(([key, query]) => {
      const mediaQuery = window.matchMedia(query)
      preferences.value[key] = mediaQuery.matches

      mediaQuery.addEventListener('change', e => {
        preferences.value[key] = e.matches
      })
    })

    // Detect screen reader
    preferences.value.screenReader = detectScreenReader()
  }

  /**
   * Skip links management
   */
  const skipLinks = {
    /**
     * Create skip link
     */
    create: (target, text = 'Skip to main content') => {
      const skipLink = document.createElement('a')
      skipLink.href = `#${target}`
      skipLink.className = 'skip-link'
      skipLink.textContent = text
      skipLink.setAttribute('tabindex', '0')

      skipLink.addEventListener('click', e => {
        e.preventDefault()
        const targetElement = document.getElementById(target)
        if (targetElement) {
          targetElement.focus()
          targetElement.scrollIntoView()
        }
      })

      return skipLink
    },

    /**
     * Add skip links to page
     */
    addToPage: (links = []) => {
      const container = document.createElement('div')
      container.className = 'skip-links'

      const defaultLinks = [
        { target: 'main-content', text: 'Skip to main content' },
        { target: 'main-navigation', text: 'Skip to navigation' },
        ...links
      ]

      defaultLinks.forEach(link => {
        const skipLink = skipLinks.create(link.target, link.text)
        container.appendChild(skipLink)
      })

      document.body.insertBefore(container, document.body.firstChild)
    }
  }

  return {
    // State
    preferences,
    announcements,

    // Focus management
    manageFocus,

    // Screen reader
    announce,

    // Keyboard navigation
    keyboardNavigation,

    // ARIA helpers
    aria,

    // Color contrast
    colorContrast,

    // Skip links
    skipLinks,

    // Initialization
    detectPreferences
  }
}

/**
 * Vue directive for accessibility
 */
export const accessibilityDirective = {
  mounted(el, binding) {
    const { value, modifiers } = binding

    if (modifiers.focus) {
      el.setAttribute('tabindex', value?.tabindex || '0')
    }

    if (modifiers.announce) {
      el.setAttribute('aria-live', value?.live || 'polite')
    }

    if (modifiers.label) {
      el.setAttribute('aria-label', value?.label || '')
    }

    if (modifiers.describedby && value?.describedby) {
      el.setAttribute('aria-describedby', value.describedby)
    }

    if (modifiers.expanded !== undefined) {
      el.setAttribute('aria-expanded', value?.expanded || 'false')
    }
  },

  updated(el, binding) {
    const { value, modifiers } = binding

    if (modifiers.expanded !== undefined) {
      el.setAttribute('aria-expanded', value?.expanded || 'false')
    }
  }
}

/**
 * Utility functions
 */

// Get all focusable elements
const getFocusableElements = (container = document) => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]'
  ].join(', ')

  return Array.from(container.querySelectorAll(focusableSelectors)).filter(
    el => isVisible(el) && !el.hasAttribute('inert')
  )
}

// Check if element is visible
const isVisible = element => {
  const style = window.getComputedStyle(element)
  return (
    style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0' && element.offsetParent !== null
  )
}

// Detect screen reader
const detectScreenReader = () => {
  // Check for common screen reader indicators
  return !!(
    navigator.userAgent.match(/NVDA|JAWS|VoiceOver|TalkBack/i) ||
    window.speechSynthesis ||
    window.navigator.userAgent.includes('Accessibility')
  )
}

// Get relative luminance for contrast calculation
const getRelativeLuminance = color => {
  // Convert color to RGB values
  const rgb = hexToRgb(color)
  if (!rgb) return 0

  // Convert to linear RGB
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  })

  // Calculate relative luminance
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

// Convert hex to RGB
const hexToRgb = hex => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

// Get minimum contrast ratio for WCAG compliance
const getMinContrastRatio = (level, size) => {
  if (level === 'AAA') {
    return size === 'large' ? 4.5 : 7
  }
  return size === 'large' ? 3 : 4.5
}

/**
 * Accessibility testing helpers
 */
export const a11yTesting = {
  /**
   * Run basic accessibility audit
   */
  audit: () => {
    const issues = []

    // Check for missing alt text
    const images = document.querySelectorAll('img:not([alt])')
    if (images.length > 0) {
      issues.push({
        type: 'missing-alt',
        count: images.length,
        elements: Array.from(images)
      })
    }

    // Check for missing form labels
    const inputs = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])')
    const unlabeledInputs = Array.from(inputs).filter(input => {
      const label = document.querySelector(`label[for="${input.id}"]`)
      return !label
    })

    if (unlabeledInputs.length > 0) {
      issues.push({
        type: 'missing-labels',
        count: unlabeledInputs.length,
        elements: unlabeledInputs
      })
    }

    // Check for heading hierarchy
    const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'))
    const headingLevels = headings.map(h => parseInt(h.tagName.substr(1)))

    for (let i = 1; i < headingLevels.length; i++) {
      if (headingLevels[i] - headingLevels[i - 1] > 1) {
        issues.push({
          type: 'heading-hierarchy',
          message: 'Heading levels should not skip',
          element: headings[i]
        })
      }
    }

    return issues
  },

  /**
   * Check color contrast
   */
  checkContrast: () => {
    const issues = []
    // Implementation would check all text/background combinations
    return issues
  }
}

export default useAccessibility
