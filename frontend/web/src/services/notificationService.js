/**
 * Notification Service
 * Handles real-time notifications for attendance events, leave requests, payroll processing, and system alerts
 */

import { ref } from 'vue'
import { apiUtils } from './api.js'

// Global notification state
const notifications = ref([])
const unreadCount = ref(0)
const isConnected = ref(false)
const reconnectAttempts = ref(0)
const maxReconnectAttempts = 5

export const notificationService = {
  // WebSocket connection
  websocket: null,
  heartbeatInterval: null,

  // Initialize notification service
  async init(userId) {
    // Load existing notifications from API
    await this.loadNotifications()

    // WebSocket is disabled - no WebSocket server available
    // this.connectWebSocket(userId)

    // Request notification permission
    await this.requestNotificationPermission()
  },

  // Load notifications from API
  async loadNotifications(params = {}) {
    try {
      const response = await apiUtils.get('/notifications', {
        params: { limit: 50, ...params }
      })

      if (response.data.success) {
        notifications.value = response.data.data || []
        unreadCount.value = notifications.value.filter(n => !n.read_at).length
      }
    } catch (error) {
      // Gracefully handle API errors - notifications are not critical to app function
      if (error.response?.status === 500) {
        // Silently handle notification API errors
        if (error.response?.status !== 500) {
          console.warn('Notification service temporarily unavailable')
        }
      }
      // Initialize with empty state to prevent UI errors
      notifications.value = []
      unreadCount.value = 0
    }
  },

  // Connect to WebSocket
  connectWebSocket(userId) {
    // WebSocket is disabled - server not available
    return

    if (this.websocket) {
      this.websocket.close()
    }

    try {
      const wsUrl = `${import.meta.env.VITE_WS_URL || 'ws://localhost:8080'}/notifications/${userId}`

      this.websocket = new WebSocket(wsUrl)

      this.websocket.onopen = () => {
        isConnected.value = true
        reconnectAttempts.value = 0
        this.startHeartbeat()
      }

      this.websocket.onmessage = event => {
        try {
          const data = JSON.parse(event.data)
          this.handleWebSocketMessage(data)
        } catch (error) {}
      }

      this.websocket.onclose = event => {
        isConnected.value = false
        this.stopHeartbeat()

        if (reconnectAttempts.value < maxReconnectAttempts) {
          this.scheduleReconnect(userId)
        }
      }

      this.websocket.onerror = error => {
        // Silently handle WebSocket errors - this is expected when WebSocket server is not running
        isConnected.value = false
      }
    } catch (error) {
      // WebSocket creation failed - this is expected when server is not running
      isConnected.value = false
      reconnectAttempts.value++
    }
  },

  // Handle WebSocket messages
  handleWebSocketMessage(data) {
    switch (data.type) {
    case 'notification':
      this.addNotification(data.notification)
      break
    case 'attendance_update':
      this.handleAttendanceUpdate(data)
      break
    case 'leave_request':
      this.handleLeaveRequest(data)
      break
    case 'payroll_update':
      this.handlePayrollUpdate(data)
      break
    case 'system_alert':
      this.handleSystemAlert(data)
      break
    case 'heartbeat':
      // Keep connection alive
      break
    default:
    }
  },

  // Add new notification
  addNotification(notification) {
    // Add to beginning of array
    notifications.value.unshift({
      ...notification,
      id: notification.id || Date.now(),
      created_at: notification.created_at || new Date().toISOString(),
      read_at: null
    })

    // Limit to 100 notifications
    if (notifications.value.length > 100) {
      notifications.value = notifications.value.slice(0, 100)
    }

    unreadCount.value++

    // Show browser notification
    this.showBrowserNotification(notification)

    // Show in-app notification toast
    this.showToastNotification(notification)
  },

  // Handle specific notification types
  handleAttendanceUpdate(data) {
    const notification = {
      type: 'attendance',
      title: 'Attendance Update',
      message: data.message || `${data.employee_name} has ${data.action}`,
      icon: 'clock',
      priority: 'normal',
      data
    }

    this.addNotification(notification)
  },

  handleLeaveRequest(data) {
    const notification = {
      type: 'leave',
      title: 'Leave Request',
      message: data.message || `New leave request from ${data.employee_name}`,
      icon: 'calendar',
      priority: 'high',
      data
    }

    this.addNotification(notification)
  },

  handlePayrollUpdate(data) {
    const notification = {
      type: 'payroll',
      title: 'Payroll Update',
      message: data.message || 'Payroll processing completed',
      icon: 'dollar-sign',
      priority: 'normal',
      data
    }

    this.addNotification(notification)
  },

  handleSystemAlert(data) {
    const notification = {
      type: 'system',
      title: 'System Alert',
      message: data.message || 'System notification',
      icon: 'alert-triangle',
      priority: data.priority || 'high',
      data
    }

    this.addNotification(notification)
  },

  // Show browser notification
  async showBrowserNotification(notification) {
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    try {
      const browserNotification = new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.type,
        requireInteraction: notification.priority === 'high',
        silent: notification.priority === 'low'
      })

      browserNotification.onclick = () => {
        window.focus()
        browserNotification.close()

        // Navigate to relevant page if needed
        if (notification.data?.url) {
          window.location.href = notification.data.url
        }
      }

      // Auto close after 5 seconds
      setTimeout(() => {
        browserNotification.close()
      }, 5000)
    } catch (error) {}
  },

  // Show in-app toast notification
  showToastNotification(notification) {
    // Create custom event for toast notifications
    const event = new CustomEvent('show-toast', {
      detail: {
        type: this.getToastType(notification.priority),
        title: notification.title,
        message: notification.message,
        duration: notification.priority === 'high' ? 8000 : 4000
      }
    })

    window.dispatchEvent(event)
  },

  // Get toast type based on priority
  getToastType(priority) {
    switch (priority) {
    case 'high':
        return 'warning'
    case 'low':
        return 'info'
    default:
        return 'success'
    }
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    try {
      await apiUtils.patch(`/notifications/${notificationId}/read`)

      const notification = notifications.value.find(n => n.id === notificationId)
      if (notification && !notification.read_at) {
        notification.read_at = new Date().toISOString()
        unreadCount.value = Math.max(0, unreadCount.value - 1)
      }
    } catch (error) {}
  },

  // Mark all notifications as read
  async markAllAsRead() {
    try {
      await apiUtils.patch('/notifications/mark-all-read')

      notifications.value.forEach(notification => {
        if (!notification.read_at) {
          notification.read_at = new Date().toISOString()
        }
      })

      unreadCount.value = 0
    } catch (error) {}
  },

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      await apiUtils.delete(`/notifications/${notificationId}`)

      const index = notifications.value.findIndex(n => n.id === notificationId)
      if (index > -1) {
        const notification = notifications.value[index]
        if (!notification.read_at) {
          unreadCount.value = Math.max(0, unreadCount.value - 1)
        }
        notifications.value.splice(index, 1)
      }
    } catch (error) {}
  },

  // Clear all notifications
  async clearAllNotifications() {
    try {
      await apiUtils.delete('/notifications')
      notifications.value = []
      unreadCount.value = 0
    } catch (error) {}
  },

  // Request notification permission
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission === 'denied') {
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    } catch (error) {
      return false
    }
  },

  // Schedule reconnection
  scheduleReconnect(userId) {
    reconnectAttempts.value++
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts.value), 30000) // Exponential backoff, max 30s

    setTimeout(() => {
      if (reconnectAttempts.value <= maxReconnectAttempts) {
        this.connectWebSocket(userId)
      }
    }, delay)
  },

  // Start heartbeat
  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
        this.websocket.send(JSON.stringify({ type: 'heartbeat' }))
      }
    }, 30000) // 30 seconds
  },

  // Stop heartbeat
  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval)
      this.heartbeatInterval = null
    }
  },

  // Send notification (admin/manager only)
  async sendNotification(notification) {
    try {
      const response = await apiUtils.post('/notifications/send', notification)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Disconnect and cleanup
  disconnect() {
    if (this.websocket) {
      this.websocket.close()
      this.websocket = null
    }

    this.stopHeartbeat()
    isConnected.value = false
    reconnectAttempts.value = 0
  },

  // Get notification preferences
  async getPreferences() {
    try {
      const response = await apiUtils.get('/notifications/preferences')
      return response.data
    } catch (error) {
      // Silently return default preferences if API fails
      return {
        browser_notifications: true,
        attendance_notifications: true,
        leave_notifications: true,
        payroll_notifications: true,
        system_notifications: true,
        email_notifications: false,
        sms_notifications: false,
        notification_sound: 'default'
      }
    }
  },

  // Update notification preferences
  async updatePreferences(preferences) {
    try {
      const response = await apiUtils.put('/notifications/preferences', preferences)
      return response.data
    } catch (error) {
      throw error
    }
  },

  // Format notification time
  formatNotificationTime(timestamp) {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now - date

    // Less than 1 minute
    if (diff < 60000) {
      return 'Just now'
    }

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000)
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
    }

    // Less than 1 day
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000)
      return `${hours} hour${hours > 1 ? 's' : ''} ago`
    }

    // More than 1 day
    const days = Math.floor(diff / 86400000)
    if (days < 7) {
      return `${days} day${days > 1 ? 's' : ''} ago`
    }

    // Format as date
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  },

  // Getters for reactive state
  getNotifications: () => notifications.value,
  getUnreadCount: () => unreadCount.value,
  isConnected: () => isConnected.value,
  getReconnectAttempts: () => reconnectAttempts.value
}

export default notificationService
