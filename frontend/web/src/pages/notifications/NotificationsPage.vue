<template>
  <div class="container-xl">
    <!-- Page Header -->
    <div class="page-header d-print-none">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="page-title">Notifications</h2>
          <div class="text-muted mt-1">Manage your notifications and preferences</div>
        </div>
        <div class="col-auto ms-auto d-print-none">
          <div class="btn-list">
            <div class="dropdown">
              <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                  <path d="M3 6h18"/>
                  <path d="M7 12h10"/>
                  <path d="M10 18h4"/>
                </svg>
                Filter
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#" @click.prevent="setFilter('all')" :class="{ active: currentFilter === 'all' }">
                  All Notifications
                </a>
                <a class="dropdown-item" href="#" @click.prevent="setFilter('unread')" :class="{ active: currentFilter === 'unread' }">
                  Unread Only
                </a>
                <div class="dropdown-divider"></div>
                <a class="dropdown-item" href="#" @click.prevent="setFilter('attendance')" :class="{ active: currentFilter === 'attendance' }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                  Attendance
                </a>
                <a class="dropdown-item" href="#" @click.prevent="setFilter('leave')" :class="{ active: currentFilter === 'leave' }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  Leave Requests
                </a>
                <a class="dropdown-item" href="#" @click.prevent="setFilter('payroll')" :class="{ active: currentFilter === 'payroll' }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                  Payroll
                </a>
                <a class="dropdown-item" href="#" @click.prevent="setFilter('system')" :class="{ active: currentFilter === 'system' }">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                    <path d="M12 9v2m0 4v.01"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                  System Alerts
                </a>
              </div>
            </div>
            <button class="btn btn-primary" @click="markAllAsRead" v-if="unreadCount > 0">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Mark All Read ({{ unreadCount }})
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- Connection Status -->
      <div v-if="!isConnected" class="alert alert-warning">
        <div class="d-flex">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon alert-icon">
              <path d="M12 9v2m0 4v.01"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div>
            <h4 class="alert-title">Real-time Connection Lost</h4>
            <div class="text-muted">
              You may not receive new notifications in real-time. 
              Reconnecting... ({{ reconnectAttempts }}/5)
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Statistics -->
      <div class="row row-cards mb-4">
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-primary text-white avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                      <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ totalNotifications }}</div>
                  <div class="text-muted">Total Notifications</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-warning text-white avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ unreadCount }}</div>
                  <div class="text-muted">Unread</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-success text-white avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ todayCount }}</div>
                  <div class="text-muted">Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-danger text-white avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                      <path d="M12 9v2m0 4v.01"/>
                      <circle cx="12" cy="12" r="10"/>
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ highPriorityCount }}</div>
                  <div class="text-muted">High Priority</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Notifications List -->
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">
            {{ getFilterTitle() }}
            <span v-if="filteredNotifications.length > 0" class="badge bg-secondary ms-2">
              {{ filteredNotifications.length }}
            </span>
          </h3>
          <div class="card-actions">
            <button v-if="filteredNotifications.length > 0" class="btn btn-sm btn-outline-danger" @click="clearFiltered">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
              </svg>
              Clear {{ getFilterTitle() }}
            </button>
          </div>
        </div>
        <div class="card-body p-0">
          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary mb-3"></div>
            <div>Loading notifications...</div>
          </div>
          
          <div v-else-if="filteredNotifications.length > 0" class="list-group list-group-flush">
            <div 
              v-for="notification in paginatedNotifications" 
              :key="notification.id"
              class="list-group-item list-group-item-action"
              :class="{ 'bg-light': !notification.read_at }"
              @click="handleNotificationClick(notification)"
            >
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="avatar" :class="getAvatarClass(notification.type)">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                      <path v-if="notification.type === 'attendance'" d="M12 6v6l4 2"/>
                      <path v-else-if="notification.type === 'leave'" d="M8 2v4"/>
                      <path v-else-if="notification.type === 'payroll'" d="M12 1v6"/>
                      <path v-else-if="notification.type === 'system'" d="M12 9v2m0 4v.01"/>
                      <path v-else d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
                      
                      <circle v-if="notification.type === 'attendance'" cx="12" cy="12" r="10"/>
                      <rect v-else-if="notification.type === 'leave'" width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                      <path v-else-if="notification.type === 'payroll'" d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                      <circle v-else-if="notification.type === 'system'" cx="12" cy="12" r="10"/>
                      <path v-else d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-fill">
                      <h4 class="mb-1" :class="{ 'fw-bold': !notification.read_at }">
                        {{ notification.title }}
                      </h4>
                      <div class="text-muted">{{ notification.message }}</div>
                      <div class="mt-2">
                        <small class="text-muted">
                          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-1">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {{ formatTime(notification.created_at) }}
                        </small>
                        <span v-if="notification.priority === 'high'" class="badge bg-danger ms-2">High Priority</span>
                        <span v-if="!notification.read_at" class="badge bg-primary ms-2">New</span>
                      </div>
                    </div>
                    <div class="ms-3">
                      <div class="dropdown">
                        <a href="#" class="btn-action" data-bs-toggle="dropdown">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                            <circle cx="12" cy="12" r="1"/>
                            <circle cx="12" cy="5" r="1"/>
                            <circle cx="12" cy="19" r="1"/>
                          </svg>
                        </a>
                        <div class="dropdown-menu dropdown-menu-end">
                          <a v-if="!notification.read_at" class="dropdown-item" href="#" @click.prevent="markAsRead(notification.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Mark as read
                          </a>
                          <a class="dropdown-item text-danger" href="#" @click.prevent="deleteNotification(notification.id)">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                              <path d="M3 6h18"/>
                              <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                              <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                            </svg>
                            Delete
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-5">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="icon text-muted mb-3">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <h3 class="text-muted">{{ getEmptyStateTitle() }}</h3>
            <p class="text-muted">{{ getEmptyStateMessage() }}</p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="card-footer">
          <div class="d-flex align-items-center justify-content-between">
            <div class="text-muted">
              Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, filteredNotifications.length) }} 
              of {{ filteredNotifications.length }} notifications
            </div>
            <div class="btn-list">
              <button 
                class="btn btn-outline-secondary" 
                :disabled="currentPage === 1"
                @click="currentPage--"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
                Previous
              </button>
              <button 
                class="btn btn-outline-secondary" 
                :disabled="currentPage === totalPages"
                @click="currentPage++"
              >
                Next
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { notificationService } from '@/services/notificationService'

const router = useRouter()

// State
const loading = ref(false)
const currentFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(20)

// Computed properties
const notifications = computed(() => notificationService.getNotifications())
const unreadCount = computed(() => notificationService.getUnreadCount())
const isConnected = computed(() => notificationService.isConnected())
const reconnectAttempts = computed(() => notificationService.getReconnectAttempts())

const totalNotifications = computed(() => notifications.value.length)

const todayCount = computed(() => {
  const today = new Date().toDateString()
  return notifications.value.filter(n => 
    new Date(n.created_at).toDateString() === today
  ).length
})

const highPriorityCount = computed(() => {
  return notifications.value.filter(n => n.priority === 'high').length
})

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  switch (currentFilter.value) {
    case 'unread':
      filtered = filtered.filter(n => !n.read_at)
      break
    case 'attendance':
      filtered = filtered.filter(n => n.type === 'attendance')
      break
    case 'leave':
      filtered = filtered.filter(n => n.type === 'leave')
      break
    case 'payroll':
      filtered = filtered.filter(n => n.type === 'payroll')
      break
    case 'system':
      filtered = filtered.filter(n => n.type === 'system')
      break
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const totalPages = computed(() => {
  return Math.ceil(filteredNotifications.value.length / pageSize.value)
})

const paginatedNotifications = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredNotifications.value.slice(start, end)
})

// Methods
const setFilter = (filter) => {
  currentFilter.value = filter
  currentPage.value = 1
}

const getFilterTitle = () => {
  const titles = {
    all: 'All Notifications',
    unread: 'Unread Notifications',
    attendance: 'Attendance Notifications',
    leave: 'Leave Request Notifications',
    payroll: 'Payroll Notifications',
    system: 'System Alert Notifications'
  }
  return titles[currentFilter.value] || 'Notifications'
}

const getEmptyStateTitle = () => {
  return currentFilter.value === 'unread' ? 'No unread notifications' : 'No notifications'
}

const getEmptyStateMessage = () => {
  if (currentFilter.value === 'unread') {
    return 'Great! You\'re all caught up.'
  }
  return 'Notifications will appear here when you receive them.'
}

const getAvatarClass = (type) => {
  const classes = {
    attendance: 'bg-blue-lt',
    leave: 'bg-orange-lt',
    payroll: 'bg-green-lt',
    system: 'bg-red-lt',
    default: 'bg-gray-lt'
  }
  return classes[type] || classes.default
}

const formatTime = (timestamp) => {
  return notificationService.formatNotificationTime(timestamp)
}

const handleNotificationClick = async (notification) => {
  // Mark as read
  if (!notification.read_at) {
    await markAsRead(notification.id)
  }

  // Navigate to relevant page if URL is provided
  if (notification.data?.url) {
    router.push(notification.data.url)
  }
}

const markAsRead = async (notificationId) => {
  await notificationService.markAsRead(notificationId)
}

const markAllAsRead = async () => {
  await notificationService.markAllAsRead()
}

const deleteNotification = async (notificationId) => {
  await notificationService.deleteNotification(notificationId)
}

const clearFiltered = async () => {
  if (confirm(`Are you sure you want to clear all ${getFilterTitle().toLowerCase()}?`)) {
    // Delete filtered notifications
    const promises = filteredNotifications.value.map(n => 
      notificationService.deleteNotification(n.id)
    )
    await Promise.all(promises)
    
    // Reset to first page
    currentPage.value = 1
  }
}

const refreshNotifications = async () => {
  loading.value = true
  try {
    await notificationService.loadNotifications()
  } finally {
    loading.value = false
  }
}

// Lifecycle
onMounted(() => {
  refreshNotifications()
})
</script>