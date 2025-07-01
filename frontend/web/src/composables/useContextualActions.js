import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

/**
 * Contextual actions composable for smart UI interactions
 */
export const useContextualActions = () => {
  const route = useRoute()
  const router = useRouter()
  
  // State
  const selectedItems = ref([])
  const contextualData = ref({})
  const availableActions = ref([])
  
  /**
   * Set selected items for bulk actions
   */
  const setSelectedItems = (items) => {
    selectedItems.value = Array.isArray(items) ? items : [items]
    updateAvailableActions()
  }
  
  /**
   * Set contextual data (user permissions, current state, etc.)
   */
  const setContextualData = (data) => {
    contextualData.value = { ...contextualData.value, ...data }
    updateAvailableActions()
  }
  
  /**
   * Update available actions based on context
   */
  const updateAvailableActions = () => {
    const actions = []
    const currentPath = route.path
    const selectedCount = selectedItems.value.length
    const hasSelection = selectedCount > 0
    const isMultipleSelection = selectedCount > 1
    const userData = contextualData.value.user || {}
    const permissions = userData.permissions || []
    
    // Route-based actions
    if (currentPath.startsWith('/employees')) {
      // Employee management actions
      if (hasPermission('create_employee', permissions)) {
        actions.push({
          id: 'create-employee',
          label: 'Add Employee',
          icon: 'user-plus',
          variant: 'primary',
          shortcut: 'ctrl+n',
          action: () => router.push('/employees/create'),
          visible: !hasSelection,
          group: 'primary'
        })
      }
      
      if (hasSelection) {
        if (hasPermission('edit_employee', permissions)) {
          actions.push({
            id: 'edit-employee',
            label: isMultipleSelection ? 'Edit Selected' : 'Edit Employee',
            icon: 'edit',
            variant: 'secondary',
            shortcut: 'e',
            action: () => handleBulkEdit(),
            visible: true,
            group: 'edit'
          })
        }
        
        if (hasPermission('delete_employee', permissions)) {
          actions.push({
            id: 'delete-employee',
            label: isMultipleSelection ? `Delete ${selectedCount} Employees` : 'Delete Employee',
            icon: 'trash',
            variant: 'danger',
            shortcut: 'del',
            action: () => handleBulkDelete(),
            visible: true,
            group: 'danger',
            confirmMessage: isMultipleSelection 
              ? `Are you sure you want to delete ${selectedCount} employees?`
              : 'Are you sure you want to delete this employee?'
          })
        }
        
        // Status actions
        actions.push({
          id: 'activate-employee',
          label: isMultipleSelection ? 'Activate Selected' : 'Activate Employee',
          icon: 'check',
          variant: 'success',
          action: () => handleBulkStatusChange('active'),
          visible: hasInactiveItems(),
          group: 'status'
        })
        
        actions.push({
          id: 'deactivate-employee',
          label: isMultipleSelection ? 'Deactivate Selected' : 'Deactivate Employee',
          icon: 'x',
          variant: 'warning',
          action: () => handleBulkStatusChange('inactive'),
          visible: hasActiveItems(),
          group: 'status'
        })
        
        // Export actions
        actions.push({
          id: 'export-selected',
          label: 'Export Selected',
          icon: 'download',
          variant: 'outline-primary',
          action: () => handleExport(selectedItems.value),
          visible: true,
          group: 'export'
        })
      }
      
      // General actions
      actions.push({
        id: 'import-employees',
        label: 'Import Data',
        icon: 'upload',
        variant: 'outline-secondary',
        action: () => handleImport(),
        visible: hasPermission('import_employee', permissions),
        group: 'import'
      })
      
      actions.push({
        id: 'export-all',
        label: 'Export All',
        icon: 'file-export',
        variant: 'outline-secondary',
        action: () => handleExport(),
        visible: true,
        group: 'export'
      })
    }
    
    // Attendance actions
    if (currentPath.startsWith('/attendance')) {
      actions.push({
        id: 'take-attendance',
        label: 'Take Attendance',
        icon: 'calendar-check',
        variant: 'primary',
        shortcut: 'ctrl+t',
        action: () => router.push('/attendance/take'),
        visible: hasPermission('manage_attendance', permissions),
        group: 'primary'
      })
      
      if (hasSelection) {
        actions.push({
          id: 'mark-present',
          label: 'Mark as Present',
          icon: 'check-circle',
          variant: 'success',
          action: () => handleAttendanceChange('present'),
          visible: true,
          group: 'attendance'
        })
        
        actions.push({
          id: 'mark-absent',
          label: 'Mark as Absent',
          icon: 'x-circle',
          variant: 'danger',
          action: () => handleAttendanceChange('absent'),
          visible: true,
          group: 'attendance'
        })
      }
    }
    
    // Reports actions
    if (currentPath.startsWith('/reports')) {
      actions.push({
        id: 'generate-report',
        label: 'Generate Report',
        icon: 'file-plus',
        variant: 'primary',
        shortcut: 'ctrl+g',
        action: () => router.push('/reports/create'),
        visible: hasPermission('create_report', permissions),
        group: 'primary'
      })
    }
    
    // Universal actions
    actions.push({
      id: 'refresh',
      label: 'Refresh',
      icon: 'refresh',
      variant: 'outline-secondary',
      shortcut: 'f5',
      action: () => handleRefresh(),
      visible: true,
      group: 'general'
    })
    
    availableActions.value = actions.filter(action => action.visible)
  }
  
  /**
   * Get actions by group
   */
  const getActionsByGroup = (group) => {
    return availableActions.value.filter(action => action.group === group)
  }
  
  /**
   * Get primary actions (most important)
   */
  const getPrimaryActions = () => {
    return availableActions.value.filter(action => 
      action.group === 'primary' || action.variant === 'primary'
    ).slice(0, 3)
  }
  
  /**
   * Get secondary actions
   */
  const getSecondaryActions = () => {
    return availableActions.value.filter(action => 
      action.group !== 'primary' && action.variant !== 'primary'
    )
  }
  
  /**
   * Execute action with confirmation if needed
   */
  const executeAction = async (actionId, options = {}) => {
    const action = availableActions.value.find(a => a.id === actionId)
    if (!action) return
    
    // Show confirmation if required
    if (action.confirmMessage && !options.skipConfirmation) {
      const confirmed = await showConfirmation(action.confirmMessage)
      if (!confirmed) return
    }
    
    try {
      await action.action()
      
      // Emit success event
      emitActionEvent('action-success', { action, data: selectedItems.value })
    } catch (error) {
      // Emit error event
      emitActionEvent('action-error', { action, error })
    }
  }
  
  /**
   * Clear selection
   */
  const clearSelection = () => {
    selectedItems.value = []
    updateAvailableActions()
  }
  
  /**
   * Smart action suggestions based on context
   */
  const getSmartSuggestions = () => {
    const suggestions = []
    const timeOfDay = new Date().getHours()
    const dayOfWeek = new Date().getDay()
    
    // Time-based suggestions
    if (timeOfDay >= 8 && timeOfDay <= 10 && route.path.startsWith('/attendance')) {
      suggestions.push({
        id: 'morning-attendance',
        label: 'Take Morning Attendance',
        icon: 'sun',
        variant: 'info',
        action: () => router.push('/attendance/take'),
        reason: 'Morning attendance period'
      })
    }
    
    // Day-based suggestions
    if (dayOfWeek === 1 && route.path === '/') { // Monday
      suggestions.push({
        id: 'weekly-report',
        label: 'Generate Weekly Report',
        icon: 'calendar-week',
        variant: 'secondary',
        action: () => router.push('/reports/weekly'),
        reason: 'Start of the week'
      })
    }
    
    return suggestions
  }
  
  // Computed properties
  const hasSelectedItems = computed(() => selectedItems.value.length > 0)
  const selectedCount = computed(() => selectedItems.value.length)
  const primaryActions = computed(() => getPrimaryActions())
  const secondaryActions = computed(() => getSecondaryActions())
  const smartSuggestions = computed(() => getSmartSuggestions())
  
  // Watch route changes to update actions
  watch(() => route.path, () => {
    clearSelection()
    updateAvailableActions()
  })
  
  return {
    // State
    selectedItems,
    contextualData,
    availableActions,
    
    // Computed
    hasSelectedItems,
    selectedCount,
    primaryActions,
    secondaryActions,
    smartSuggestions,
    
    // Methods
    setSelectedItems,
    setContextualData,
    executeAction,
    clearSelection,
    getActionsByGroup,
    getPrimaryActions,
    getSecondaryActions,
    getSmartSuggestions
  }
}

/**
 * Helper functions
 */

const hasPermission = (permission, userPermissions) => {
  if (!userPermissions || userPermissions.includes('*')) return true
  return userPermissions.includes(permission)
}

const hasActiveItems = () => {
  // Implementation would check if any selected items are active
  return true
}

const hasInactiveItems = () => {
  // Implementation would check if any selected items are inactive
  return true
}

const handleBulkEdit = () => {
  // Implementation for bulk edit
  console.log('Bulk edit action')
}

const handleBulkDelete = () => {
  // Implementation for bulk delete
  console.log('Bulk delete action')
}

const handleBulkStatusChange = (status) => {
  // Implementation for status change
  console.log('Bulk status change:', status)
}

const handleExport = (items = null) => {
  // Implementation for export
  console.log('Export action:', items)
}

const handleImport = () => {
  // Implementation for import
  console.log('Import action')
}

const handleAttendanceChange = (status) => {
  // Implementation for attendance change
  console.log('Attendance change:', status)
}

const handleRefresh = () => {
  // Implementation for refresh
  window.location.reload()
}

const showConfirmation = async (message) => {
  // Implementation would show a confirmation dialog
  return window.confirm(message)
}

const emitActionEvent = (eventName, data) => {
  // Implementation would emit custom events
  const event = new CustomEvent(eventName, { detail: data })
  document.dispatchEvent(event)
}

/**
 * Quick actions for common workflows
 */
export const quickActions = {
  employee: {
    create: () => ({ action: 'navigate', target: '/employees/create' }),
    import: () => ({ action: 'modal', target: 'import-employees' }),
    export: () => ({ action: 'download', target: 'employees.xlsx' })
  },
  
  attendance: {
    take: () => ({ action: 'navigate', target: '/attendance/take' }),
    report: () => ({ action: 'navigate', target: '/reports/attendance' }),
    calendar: () => ({ action: 'navigate', target: '/attendance/calendar' })
  },
  
  reports: {
    generate: () => ({ action: 'modal', target: 'report-generator' }),
    schedule: () => ({ action: 'modal', target: 'schedule-report' }),
    export: () => ({ action: 'download', target: 'report.pdf' })
  }
}

export default useContextualActions