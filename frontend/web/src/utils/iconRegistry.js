/**
 * Tabler Icons Registry
 * Centralized icon management for the attendance system
 */

// Icon categories for the attendance system
export const iconCategories = {
  // Navigation Icons
  navigation: [
    'layout-dashboard', // dashboard
    'users', // employees
    'clock', // attendance
    'calendar', // schedule
    'currency-dollar', // payroll
    'report' // reports
  ],

  // Action Icons
  actions: [
    'plus', // add
    'edit', // edit
    'trash', // delete
    'device-floppy', // save
    'download', // export
    'search' // search
  ],

  // Status Icons
  status: [
    'check', // present
    'x', // absent
    'clock', // late
    'circle-check', // approved
    'clock-pause' // pending
  ],

  // Employee Type Icons
  employeeTypes: [
    'school', // permanentTeacher
    'user-check', // honoraryTeacher
    'briefcase', // permanentStaff
    'user-cog' // honoraryStaff
  ],

  // Face Detection Icons
  faceDetection: [
    'face-id', // faceRecognition
    'camera', // camera
    'scan', // scanning
    'arrow-up', // nod
    'arrows-horizontal', // shake
    'mood-smile', // smile
    'eye' // blink
  ],

  // Legacy categories for backward compatibility
  users: ['user', 'users', 'user-plus', 'user-minus', 'user-check', 'user-x', 'user-circle', 'id', 'badge'],

  attendance: [
    'clock',
    'clock-check',
    'clock-x',
    'calendar',
    'calendar-event',
    'calendar-plus',
    'calendar-minus',
    'calendar-off',
    'stopwatch',
    'hourglass'
  ],

  faceRecognition: [
    'face-id',
    'scan',
    'camera',
    'camera-plus',
    'camera-off',
    'shield',
    'shield-check',
    'shield-x',
    'lock',
    'unlock'
  ],

  reports: [
    'chart-bar',
    'chart-line',
    'chart-pie',
    'chart-area',
    'file-analytics',
    'report',
    'presentation',
    'trending-up',
    'trending-down'
  ],

  ui: [
    'menu',
    'dots-vertical',
    'dots',
    'grip-vertical',
    'grid-dots',
    'layout-dashboard',
    'layout-grid',
    'layout-list',
    'maximize',
    'minimize',
    'external-link'
  ],

  system: [
    'settings',
    'adjustments-horizontal',
    'cog',
    'tools',
    'database',
    'server',
    'cloud',
    'wifi',
    'power',
    'logout'
  ]
}

// Common icon aliases for easier usage
export const iconAliases = {
  // Navigation aliases
  dashboard: 'layout-dashboard',
  employees: 'users',
  attendance: 'clock',
  schedule: 'calendar',
  payroll: 'currency-dollar',
  reports: 'report',

  // Action aliases
  add: 'plus',
  edit: 'edit',
  delete: 'trash',
  save: 'device-floppy',
  export: 'download',
  search: 'search',

  // Status aliases
  present: 'check',
  absent: 'x',
  late: 'clock',
  approved: 'circle-check',
  pending: 'clock-pause',

  // Employee Type aliases
  permanentTeacher: 'school',
  honoraryTeacher: 'user-check',
  permanentStaff: 'briefcase',
  honoraryStaff: 'user-cog',

  // Face Detection aliases
  faceRecognition: 'face-id',
  camera: 'camera',
  scanning: 'scan',
  nod: 'arrow-up',
  shake: 'arrows-horizontal',
  smile: 'mood-smile',
  blink: 'eye',

  // Legacy aliases for backward compatibility
  back: 'arrow-left',
  forward: 'arrow-right',
  up: 'chevron-up',
  down: 'chevron-down',
  left: 'chevron-left',
  right: 'chevron-right',
  home: 'home',
  menu: 'menu-2',
  employee: 'user',
  'add-user': 'user-plus',
  'remove-user': 'user-minus',
  'approve-user': 'user-check',
  'reject-user': 'user-x',
  profile: 'user-circle',
  checkin: 'clock-check',
  checkout: 'clock-x',
  time: 'clock',
  event: 'calendar-event',
  'add-event': 'calendar-plus',
  timer: 'stopwatch',
  'face-scan': 'face-id',
  security: 'shield-check',
  secure: 'lock',
  unsecure: 'unlock',
  success: 'circle-check',
  error: 'circle-x',
  warning: 'alert-triangle',
  info: 'info-circle',
  question: 'help',
  notification: 'bell',
  visible: 'eye',
  hidden: 'eye-off',
  close: 'x',
  confirm: 'check',
  cancel: 'x',
  import: 'upload',
  reload: 'refresh',
  find: 'search',
  config: 'settings',
  analytics: 'chart-bar',
  statistics: 'chart-line'
}

// Icon size presets
export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 32,
  xl: 48,
  '2xl': 64
}

/**
 * Get icon name with alias resolution
 * @param {string} iconName - The icon name or alias
 * @returns {string} The resolved icon name
 */
export function resolveIconName(iconName) {
  return iconAliases[iconName] || iconName
}

/**
 * Check if an icon exists in any category
 * @param {string} iconName - The icon name to check
 * @returns {boolean} Whether the icon exists
 */
export function iconExists(iconName) {
  const resolvedName = resolveIconName(iconName)

  for (const category of Object.values(iconCategories)) {
    if (category.includes(resolvedName)) {
      return true
    }
  }

  return false
}

/**
 * Get all icons from a specific category
 * @param {string} categoryName - The category name
 * @returns {string[]} Array of icon names in the category
 */
export function getIconsByCategory(categoryName) {
  return iconCategories[categoryName] || []
}

/**
 * Get the category for a specific icon
 * @param {string} iconName - The icon name
 * @returns {string|null} The category name or null if not found
 */
export function getIconCategory(iconName) {
  const resolvedName = resolveIconName(iconName)

  for (const [categoryName, icons] of Object.entries(iconCategories)) {
    if (icons.includes(resolvedName)) {
      return categoryName
    }
  }

  return null
}

/**
 * Get all available icon names
 * @returns {string[]} Array of all icon names
 */
export function getAllIcons() {
  const allIcons = new Set()

  for (const icons of Object.values(iconCategories)) {
    icons.forEach(icon => allIcons.add(icon))
  }

  return Array.from(allIcons).sort()
}

/**
 * Search icons by name or category
 * @param {string} query - Search query
 * @returns {string[]} Array of matching icon names
 */
export function searchIcons(query) {
  const lowerQuery = query.toLowerCase()
  const results = new Set()

  // Search in icon names
  getAllIcons().forEach(icon => {
    if (icon.toLowerCase().includes(lowerQuery)) {
      results.add(icon)
    }
  })

  // Search in aliases
  Object.entries(iconAliases).forEach(([alias, iconName]) => {
    if (alias.toLowerCase().includes(lowerQuery)) {
      results.add(iconName)
    }
  })

  // Search in category names
  Object.entries(iconCategories).forEach(([categoryName, icons]) => {
    if (categoryName.toLowerCase().includes(lowerQuery)) {
      icons.forEach(icon => results.add(icon))
    }
  })

  return Array.from(results).sort()
}

/**
 * Validate icon props for components
 * @param {object} props - The props object
 * @returns {object} Validated props with defaults
 */
export function validateIconProps(props) {
  const validated = { ...props }

  // Resolve icon name
  if (validated.name) {
    validated.name = resolveIconName(validated.name)
  }

  // Validate size
  if (typeof validated.size === 'string' && !iconSizes[validated.size]) {
    console.warn(`Invalid icon size: ${validated.size}. Using default 'md'.`)
    validated.size = 'md'
  }

  return validated
}

// Frequently used icon sets for quick access
export const commonIcons = {
  // Most frequently used in attendance system
  essential: [
    'layout-dashboard', // dashboard
    'users', // employees
    'clock', // attendance
    'calendar', // schedule
    'currency-dollar', // payroll
    'report', // reports
    'plus', // add
    'edit', // edit
    'trash', // delete
    'face-id', // faceRecognition
    'settings', // settings
    'search' // search
  ],

  // Navigation specific
  navigation: ['layout-dashboard', 'users', 'clock', 'calendar', 'currency-dollar', 'report'],

  // Status indicators
  status: [
    'check', // present
    'x', // absent
    'clock', // late
    'circle-check', // approved
    'clock-pause' // pending
  ],

  // Employee types
  employeeTypes: [
    'school', // permanentTeacher
    'user-check', // honoraryTeacher
    'briefcase', // permanentStaff
    'user-cog' // honoraryStaff
  ],

  // Face detection
  faceDetection: [
    'face-id', // faceRecognition
    'camera', // camera
    'scan', // scanning
    'arrow-up', // nod
    'arrows-horizontal', // shake
    'mood-smile', // smile
    'eye' // blink
  ]
}

export default {
  iconCategories,
  iconAliases,
  iconSizes,
  commonIcons,
  resolveIconName,
  iconExists,
  getIconsByCategory,
  getIconCategory,
  getAllIcons,
  searchIcons,
  validateIconProps
}
