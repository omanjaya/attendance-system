<template>
  <div class="nav-item dropdown d-none d-md-flex me-3">
    <a href="#" class="nav-link px-0" data-bs-toggle="dropdown" tabindex="-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
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
      <span v-if="unreadCount > 0" class="badge bg-red">{{ unreadCount }}</span>
    </a>

    <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Notifications</h3>
          <div class="card-actions">
            <a v-if="unreadCount > 0" href="#" @click.prevent="markAllAsRead"> Mark all as read </a>
          </div>
        </div>

        <div class="list-group list-group-flush list-group-hoverable">
          <div v-if="loading" class="list-group-item">
            <div class="text-center">
              <div class="spinner-border spinner-border-sm"></div>
            </div>
          </div>

          <div v-else-if="notifications.length === 0" class="list-group-item">
            <div class="text-center text-muted">No notifications</div>
          </div>

          <div
            v-for="notification in notifications"
            v-else
            :key="notification.id"
            class="list-group-item"
            :class="{ 'bg-light': !notification.read_at }"
          >
            <div class="row align-items-center">
              <div class="col-auto">
                <span class="status-dot" :class="getStatusClass(notification.type)"></span>
              </div>
              <div class="col text-truncate">
                <a href="#" class="text-body d-block" @click.prevent="markAsRead(notification)">
                  {{ notification.data.title || notification.data.message }}
                </a>
                <div class="d-block text-muted text-truncate mt-n1">
                  {{ formatTime(notification.created_at) }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import axios from 'axios'

const notifications = ref([])
const loading = ref(false)

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read_at).length
})

const loadNotifications = async () => {
  try {
    loading.value = true
    const response = await axios.get('/api/v1/notifications')

    if (response.data.success) {
      notifications.value = response.data.notifications
    }
  } catch (error) {
    console.error('Error loading notifications:', error)
  } finally {
    loading.value = false
  }
}

const markAsRead = async notification => {
  if (notification.read_at) return

  try {
    await axios.post(`/api/v1/notifications/${notification.id}/mark-read`)
    notification.read_at = new Date().toISOString()
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

const markAllAsRead = async () => {
  try {
    await axios.post('/api/v1/notifications/mark-all-read')
    notifications.value.forEach(n => {
      if (!n.read_at) {
        n.read_at = new Date().toISOString()
      }
    })
  } catch (error) {
    console.error('Error marking all notifications as read:', error)
  }
}

const getStatusClass = type => {
  switch (type) {
    case 'success':
      return 'status-green'
    case 'warning':
      return 'status-yellow'
    case 'error':
      return 'status-red'
    case 'info':
      return 'status-blue'
    default:
      return 'status-blue'
  }
}

const formatTime = timestamp => {
  const date = new Date(timestamp)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
  return date.toLocaleDateString()
}

onMounted(() => {
  loadNotifications()
})
</script>
