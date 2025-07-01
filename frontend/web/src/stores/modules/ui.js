/**
 * UI Store
 * Global UI state management
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUIStore = defineStore('ui', () => {
  // State
  const sidebarOpen = ref(true)
  const theme = ref('light')
  const loading = ref(false)
  const notifications = ref([])
  const modals = ref({})
  const breadcrumbs = ref([])

  // Getters
  const isDark = computed(() => theme.value === 'dark')
  const hasNotifications = computed(() => notifications.value.length > 0)
  const activeModals = computed(() => 
    Object.entries(modals.value).filter(([_, isOpen]) => isOpen)
  )

  // Actions
  const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value
  }

  const setSidebarOpen = (open) => {
    sidebarOpen.value = open
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light'
    localStorage.setItem('theme', theme.value)
  }

  const setTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
  }

  const addNotification = (notification) => {
    const id = Date.now()
    notifications.value.push({
      id,
      ...notification,
      timestamp: new Date()
    })
    return id
  }

  const removeNotification = (id) => {
    notifications.value = notifications.value.filter(n => n.id !== id)
  }

  const clearNotifications = () => {
    notifications.value = []
  }

  const openModal = (modalId) => {
    modals.value[modalId] = true
  }

  const closeModal = (modalId) => {
    modals.value[modalId] = false
  }

  const setBreadcrumbs = (newBreadcrumbs) => {
    breadcrumbs.value = newBreadcrumbs
  }

  const setLoading = (isLoading) => {
    loading.value = isLoading
  }

  // Initialize theme from localStorage
  const initializeTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      theme.value = savedTheme
    }
  }

  return {
    // State
    sidebarOpen,
    theme,
    loading,
    notifications,
    modals,
    breadcrumbs,
    
    // Getters
    isDark,
    hasNotifications,
    activeModals,
    
    // Actions
    toggleSidebar,
    setSidebarOpen,
    toggleTheme,
    setTheme,
    addNotification,
    removeNotification,
    clearNotifications,
    openModal,
    closeModal,
    setBreadcrumbs,
    setLoading,
    initializeTheme
  }
})
