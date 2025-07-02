/**
 * Tabler Icons Plugin for Vue
 * Global icon registration and utilities
 */

import TablerIcon from '@/components/common/TablerIcon.vue'
import { commonIcons, resolveIconName, validateIconProps } from '@/utils/iconRegistry'

// Pre-register commonly used icons for better performance
const preregisteredIcons = new Set(commonIcons.essential)

/**
 * Vue plugin for Tabler Icons integration
 */
export default {
  install(app, options = {}) {
    // Global TablerIcon component registration
    app.component('TablerIcon', TablerIcon)
    app.component('TIcon', TablerIcon) // Short alias

    // Global properties for icon utilities
    app.config.globalProperties.$icon = {
      resolve: resolveIconName,
      validate: validateIconProps,
      preregister: iconName => {
        preregisteredIcons.add(resolveIconName(iconName))
      },
      isPreregistered: iconName => {
        return preregisteredIcons.has(resolveIconName(iconName))
      }
    }

    // Global icon directive for simple icon rendering
    app.directive('icon', {
      mounted(el, binding) {
        const iconName = resolveIconName(binding.value)
        const size = binding.arg || 'md'
        const modifiers = binding.modifiers

        // Create icon element
        const iconComponent = app.component('TablerIcon')
        if (iconComponent) {
          const iconEl = document.createElement('span')
          iconEl.innerHTML = `<tabler-icon name="${iconName}" size="${size}"></tabler-icon>`

          // Apply modifier classes
          if (modifiers.inline) iconEl.classList.add('icon-inline')
          if (modifiers.spin) iconEl.classList.add('icon-spin')
          if (modifiers.pulse) iconEl.classList.add('icon-pulse')

          el.appendChild(iconEl)
        }
      },

      updated(el, binding) {
        // Re-render if binding value changes
        el.innerHTML = ''
        this.mounted(el, binding)
      }
    })

    // Configure options
    const config = {
      preloadCommonIcons: true,
      enableAliases: true,
      showWarnings: process.env.NODE_ENV === 'development',
      ...options
    }

    // Store config in app
    app.provide('iconConfig', config)

    // Preload common icons if enabled
    if (config.preloadCommonIcons) {
      preloadIcons(commonIcons.essential)
    }
  }
}

/**
 * Preload icons for better performance
 * @param {string[]} iconNames - Array of icon names to preload
 */
function preloadIcons(iconNames) {
  // Skip preloading in production to avoid build issues
  if (process.env.NODE_ENV === 'production') {
    return Promise.resolve()
  }

  console.log(`Registering ${iconNames.length} common icons for preload`)
  // Icons will be loaded on-demand via the TablerIcon component
  return Promise.resolve()
}

/**
 * Composable for icon management
 */
export function useIcons() {
  return {
    // Icon utilities
    resolve: resolveIconName,
    validate: validateIconProps,

    // Common icon sets
    common: commonIcons,

    // Preload helper
    preload: preloadIcons
  }
}

/**
 * Icon component factory for programmatic icon creation
 * @param {string} iconName - The icon name
 * @param {object} props - Icon props
 * @returns {object} Component definition
 */
export function createIcon(iconName, props = {}) {
  return {
    name: 'DynamicIcon',
    template: '<TablerIcon :name="iconName" v-bind="iconProps" />',
    data() {
      return {
        iconName: resolveIconName(iconName),
        iconProps: validateIconProps(props)
      }
    }
  }
}

/**
 * Bulk icon registration helper
 * @param {object} app - Vue app instance
 * @param {object} iconMap - Map of component names to icon names
 */
export function registerIcons(app, iconMap) {
  Object.entries(iconMap).forEach(([componentName, iconName]) => {
    app.component(componentName, {
      template: `<TablerIcon name="${resolveIconName(iconName)}" v-bind="$attrs" />`,
      inheritAttrs: false
    })
  })
}

// Export common icon sets for convenience
export { commonIcons }

// Icon component aliases for common use cases
export const IconAliases = {
  // Navigation
  HomeIcon: { name: 'home' },
  BackIcon: { name: 'arrow-left' },
  ForwardIcon: { name: 'arrow-right' },
  MenuIcon: { name: 'menu' },

  // User management
  UserIcon: { name: 'user' },
  UsersIcon: { name: 'users' },
  AddUserIcon: { name: 'user-plus' },

  // Attendance
  ClockIcon: { name: 'clock' },
  CheckInIcon: { name: 'clock-check' },
  CheckOutIcon: { name: 'clock-x' },
  CalendarIcon: { name: 'calendar' },

  // Actions
  AddIcon: { name: 'plus' },
  EditIcon: { name: 'edit' },
  DeleteIcon: { name: 'trash' },
  SaveIcon: { name: 'device-floppy' },
  CancelIcon: { name: 'x' },
  ConfirmIcon: { name: 'check' },

  // Status
  SuccessIcon: { name: 'circle-check' },
  ErrorIcon: { name: 'circle-x' },
  WarningIcon: { name: 'alert-triangle' },
  InfoIcon: { name: 'info-circle' },

  // System
  SettingsIcon: { name: 'settings' },
  LogoutIcon: { name: 'logout' },
  SearchIcon: { name: 'search' },
  NotificationIcon: { name: 'bell' }
}
