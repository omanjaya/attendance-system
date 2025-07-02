<template>
  <div class="dropdown">
    <button
      class="btn btn-ghost-secondary position-relative"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="icon"
      >
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      <span v-if="unreadCount > 0" class="badge bg-red position-absolute top-0 end-0 rounded-pill">
        {{ unreadCount > 99 ? '99+' : unreadCount }}
      </span>
    </button>

    <div class="dropdown-menu dropdown-menu-end dropdown-menu-card" style="width: 400px">
      <div class="card">
        <div class="card-header d-flex align-items-center justify-content-between">
          <h3 class="card-title mb-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon me-2"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Notifications
          </h3>
          <div class="card-actions">
            <div class="dropdown">
              <a href="#" class="btn-action dropdown-toggle" data-bs-toggle="dropdown">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon"
                >
                  <circle cx="12" cy="12" r="1" />
                  <circle cx="12" cy="5" r="1" />
                  <circle cx="12" cy="19" r="1" />
                </svg>
              </a>
              <div class="dropdown-menu dropdown-menu-end">
                <a
                  v-if="unreadCount > 0"
                  class="dropdown-item"
                  href="#"
                  @click.prevent="markAllAsRead"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon me-2"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Mark all as read
                </a>
                <a class="dropdown-item" href="#" @click.prevent="clearAll">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon me-2"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                  Clear all
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click.prevent="openSettings">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon me-2"
                  >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 1v6" />
                    <path d="M12 17v6" />
                    <path d="M3.05 11h4" />
                    <path d="M16.95 11h4" />
                    <path d="M3.05 13h4" />
                    <path d="M16.95 13h4" />
                  </svg>
                  Settings
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="card-body p-0" style="max-height: 400px; overflow-y: auto">
          <!-- Connection Status -->
          <div v-if="!isConnected" class="alert alert-warning m-3 mb-0">
            <div class="d-flex">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon alert-icon"
                >
                  <path d="M12 9v2m0 4v.01" />
                  <circle cx="12" cy="12" r="10" />
                </svg>
              </div>
              <div>
                <h4 class="alert-title">Connection Lost</h4>
                <div class="text-muted">Reconnecting... ({{ reconnectAttempts }}/5)</div>
              </div>
            </div>
          </div>

          <!-- Notifications List -->
          <div v-if="notifications.length > 0" class="list-group list-group-flush">
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="list-group-item list-group-item-action"
              :class="{ 'bg-light': !notification.read_at }"
              @click="handleNotificationClick(notification)"
            >
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="avatar avatar-sm" :class="getAvatarClass(notification.type)">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="icon"
                    >
                      <path v-if="notification.type === 'attendance'" d="M12 6v6l4 2" />
                      <path v-else-if="notification.type === 'leave'" d="M8 2v4" />
                      <path v-else-if="notification.type === 'payroll'" d="M12 1v6" />
                      <path v-else-if="notification.type === 'system'" d="M12 9v2m0 4v.01" />
                      <path v-else d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />

                      <circle v-if="notification.type === 'attendance'" cx="12" cy="12" r="10" />
                      <rect
                        v-else-if="notification.type === 'leave'"
                        width="18"
                        height="18"
                        x="3"
                        y="4"
                        rx="2"
                        ry="2"
                      />
                      <path
                        v-else-if="notification.type === 'payroll'"
                        d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
                      />
                      <circle v-else-if="notification.type === 'system'" cx="12" cy="12" r="10" />
                      <path v-else d="M13.73 21a2 2 0 0 1-3.46 0" />
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-fill">
                      <h4 class="mb-1 text-body" :class="{ 'fw-bold': !notification.read_at }">
                        {{ notification.title }}
                      </h4>
                      <div class="text-muted small">{{ notification.message }}</div>
                    </div>
                    <div class="ms-2 d-flex flex-column align-items-end">
                      <small class="text-muted">{{ formatTime(notification.created_at) }}</small>
                      <div v-if="!notification.read_at" class="badge bg-primary badge-pill mt-1">
                        New
                      </div>
                      <span
                        v-if="notification.priority === 'high'"
                        class="badge bg-danger badge-pill mt-1"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon"
                        >
                          <path d="M12 9v2m0 4v.01" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-auto">
                  <div class="dropdown">
                    <a href="#" class="btn-action" data-bs-toggle="dropdown">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon"
                      >
                        <circle cx="12" cy="12" r="1" />
                        <circle cx="12" cy="5" r="1" />
                        <circle cx="12" cy="19" r="1" />
                      </svg>
                    </a>
                    <div class="dropdown-menu dropdown-menu-end">
                      <a
                        v-if="!notification.read_at"
                        class="dropdown-item"
                        href="#"
                        @click.prevent="markAsRead(notification.id)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon me-2"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Mark as read
                      </a>
                      <a
                        class="dropdown-item text-danger"
                        href="#"
                        @click.prevent="deleteNotification(notification.id)"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon me-2"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                        </svg>
                        Delete
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="icon text-muted mb-3"
            >
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            <h3 class="text-muted">No notifications</h3>
            <p class="text-muted">You're all caught up!</p>
          </div>
        </div>

        <!-- Footer with view all link -->
        <div v-if="notifications.length > 0" class="card-footer text-center">
          <router-link to="/notifications" class="btn btn-link">
            View all notifications
          </router-link>
        </div>
      </div>
    </div>

    <!-- Notification Settings Modal -->
    <div
      v-if="showSettings"
      class="modal modal-blur fade show"
      style="display: block"
      tabindex="-1"
    >
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Notification Settings</h5>
            <button type="button" class="btn-close" @click="closeSettings"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label class="form-label">Browser Notifications</label>
              <div class="form-check form-switch">
                <input
                  v-model="settings.browser_notifications"
                  class="form-check-input"
                  type="checkbox"
                  @change="updateSettings"
                />
                <label class="form-check-label"> Enable browser notifications </label>
              </div>
            </div>

            <div class="mb-3">
              <label class="form-label">Notification Types</label>
              <div class="form-check">
                <input
                  v-model="settings.attendance_notifications"
                  class="form-check-input"
                  type="checkbox"
                  @change="updateSettings"
                />
                <label class="form-check-label">Attendance updates</label>
              </div>
              <div class="form-check">
                <input
                  v-model="settings.leave_notifications"
                  class="form-check-input"
                  type="checkbox"
                  @change="updateSettings"
                />
                <label class="form-check-label">Leave requests</label>
              </div>
              <div class="form-check">
                <input
                  v-model="settings.payroll_notifications"
                  class="form-check-input"
                  type="checkbox"
                  @change="updateSettings"
                />
                <label class="form-check-label">Payroll updates</label>
              </div>
              <div class="form-check">
                <input
                  v-model="settings.system_notifications"
                  class="form-check-input"
                  type="checkbox"
                  @change="updateSettings"
                />
                <label class="form-check-label">System alerts</label>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeSettings">Close</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
    <div v-if="showSettings" class="modal-backdrop fade show" @click="closeSettings"></div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { notificationService } from '@/services/notificationService'

const router = useRouter()

// State
const showSettings = ref(false)
const settings = ref({
  browser_notifications: true,
  attendance_notifications: true,
  leave_notifications: true,
  payroll_notifications: true,
  system_notifications: true
})

// Computed
const notifications = computed(() => notificationService.getNotifications())
const unreadCount = computed(() => notificationService.getUnreadCount())
const isConnected = computed(() => notificationService.isConnected())
const reconnectAttempts = computed(() => notificationService.getReconnectAttempts())

// Methods
const getAvatarClass = type => {
  const classes = {
    attendance: 'bg-blue-lt',
    leave: 'bg-orange-lt',
    payroll: 'bg-green-lt',
    system: 'bg-red-lt',
    default: 'bg-gray-lt'
  }
  return classes[type] || classes.default
}

const formatTime = timestamp => {
  return notificationService.formatNotificationTime(timestamp)
}

const handleNotificationClick = async notification => {
  // Mark as read
  if (!notification.read_at) {
    await markAsRead(notification.id)
  }

  // Navigate to relevant page if URL is provided
  if (notification.data?.url) {
    router.push(notification.data.url)
  }
}

const markAsRead = async notificationId => {
  await notificationService.markAsRead(notificationId)
}

const markAllAsRead = async () => {
  await notificationService.markAllAsRead()
}

const deleteNotification = async notificationId => {
  await notificationService.deleteNotification(notificationId)
}

const clearAll = async () => {
  if (confirm('Are you sure you want to clear all notifications?')) {
    await notificationService.clearAllNotifications()
  }
}

const openSettings = () => {
  showSettings.value = true
  loadSettings()
}

const closeSettings = () => {
  showSettings.value = false
}

const loadSettings = async () => {
  try {
    const prefs = await notificationService.getPreferences()
    if (prefs.success) {
      settings.value = { ...settings.value, ...prefs.data }
    } else if (prefs && typeof prefs === 'object') {
      // If getPreferences returns default settings directly
      settings.value = { ...settings.value, ...prefs }
    }
  } catch (error) {
    // Silently handle error - defaults are already set
  }
}

const updateSettings = async () => {
  try {
    await notificationService.updatePreferences(settings.value)
  } catch (error) {
    console.error('Failed to update notification settings:', error)
  }
}

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>
