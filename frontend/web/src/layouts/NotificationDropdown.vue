<template>
  <div class="nav-item dropdown">
    <a
      href="#"
      class="nav-link px-0 position-relative"
      data-bs-toggle="dropdown"
      tabindex="-1"
      aria-label="Show notifications"
    >
      <TablerIcon name="bell" />
      <span v-if="unreadCount > 0" class="badge bg-red badge-pill badge-notification">
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </span>
    </a>
    <div class="dropdown-menu dropdown-menu-arrow dropdown-menu-end dropdown-menu-card">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Notifications</h3>
          <div class="card-actions">
            <a v-if="unreadCount > 0" href="#" class="btn btn-sm btn-link" @click.prevent="markAllAsRead">
              Mark all as read
            </a>
          </div>
        </div>

        <div v-if="notifications.length > 0" class="list-group list-group-flush">
          <a
            v-for="notification in displayedNotifications"
            :key="notification.id"
            href="#"
            class="list-group-item list-group-item-action"
            :class="{ unread: !notification.read }"
            @click.prevent="handleNotificationClick(notification)"
          >
            <div class="row align-items-center">
              <div class="col-auto">
                <span
                  class="status-dot"
                  :class="`status-dot-${notification.type}`"
                  :data-bs-toggle="tooltip.enabled ? 'tooltip' : undefined"
                  :title="notification.type"
                  :aria-label="`Status: ${notification.type}`"
                ></span>
              </div>
              <div class="col text-truncate">
                <div class="text-body d-block">{{ notification.title }}</div>
                <div class="d-block text-muted text-truncate mt-n1">
                  {{ notification.message }}
                </div>
                <div class="small text-muted mt-1">
                  <TablerIcon name="clock" size="sm" />
                  {{ formatTime(notification.timestamp) }}
                </div>
              </div>
              <div v-if="notification.action" class="col-auto">
                <a href="#" class="list-group-item-actions">
                  <TablerIcon name="chevron-right" />
                </a>
              </div>
            </div>
          </a>
        </div>

        <div v-else class="card-body text-center py-4">
          <TablerIcon name="bell-off" size="lg" class="text-muted mb-2" />
          <p class="text-muted">No notifications</p>
        </div>

        <div v-if="notifications.length > 5" class="card-footer text-center">
          <router-link to="/notifications" class="text-primary"> View all notifications </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TablerIcon from '@/components/common/TablerIcon.vue'
import { formatters } from '@/utils/formatters'

const router = useRouter()

// Mock notifications - replace with actual store data
const notifications = ref([
  {
    id: 1,
    type: 'success',
    title: 'Employee Added',
    message: 'John Doe has been successfully added to the system',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    read: false,
    action: '/employees/123'
  },
  {
    id: 2,
    type: 'warning',
    title: 'Late Check-in',
    message: '5 employees checked in late today',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    read: false,
    action: '/attendance'
  },
  {
    id: 3,
    type: 'info',
    title: 'Schedule Updated',
    message: "Next week's schedule has been published",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: true,
    action: '/schedules'
  },
  {
    id: 4,
    type: 'danger',
    title: 'Face Recognition Failed',
    message: 'Multiple failed attempts detected for Employee #456',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
    read: true,
    action: '/face-recognition/manage'
  }
])

// Computed
const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const displayedNotifications = computed(() => notifications.value.slice(0, 5))

// Methods
const formatTime = timestamp => {
  const now = new Date()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`

  return formatters.date(timestamp)
}

const handleNotificationClick = notification => {
  // Mark as read
  notification.read = true

  // Navigate if action exists
  if (notification.action) {
    router.push(notification.action)
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => {
    n.read = true
  })
}

// Initialize tooltips
const initializeTooltips = () => {
  nextTick(() => {
    // Initialize Bootstrap tooltips jika tersedia
    if (typeof window !== 'undefined' && window.bootstrap) {
      const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
      tooltipTriggerList.forEach(tooltipTriggerEl => {
        if (!tooltipTriggerEl._tooltip) {
          tooltipTriggerEl._tooltip = new window.bootstrap.Tooltip(tooltipTriggerEl)
        }
      })
    }
  })
}

// Computed untuk tooltip support
const tooltip = computed(() => {
  return {
    init: initializeTooltips,
    enabled: typeof window !== 'undefined' && window.bootstrap
  }
})

// Lifecycle
onMounted(() => {
  initializeTooltips()
})
</script>

<style scoped>
/* Badge positioning */
.badge-notification {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  font-size: 0.625rem;
  padding: 0.25rem 0.375rem;
  min-width: 1.25rem;
}

/* Dropdown card */
.dropdown-menu-card {
  width: 25rem;
  max-width: calc(100vw - 2rem);
}

.dropdown-menu-card .card {
  margin: 0;
  border: 0;
  box-shadow: none;
}

/* Notification list */
.list-group-item.unread {
  background-color: rgba(32, 107, 196, 0.03);
}

.list-group-item.unread:hover {
  background-color: rgba(32, 107, 196, 0.06);
}

/* Status dots */
.status-dot {
  width: 0.75rem;
  height: 0.75rem;
  display: inline-block;
  border-radius: 50%;
}

.status-dot-success {
  background-color: var(--tblr-success);
}

.status-dot-warning {
  background-color: var(--tblr-warning);
}

.status-dot-danger {
  background-color: var(--tblr-danger);
}

.status-dot-info {
  background-color: var(--tblr-info);
}

/* Dark mode support */
:root.dark .list-group-item.unread {
  background-color: rgba(255, 255, 255, 0.03);
}

:root.dark .list-group-item.unread:hover {
  background-color: rgba(255, 255, 255, 0.06);
}

:root.dark .dropdown-menu {
  background-color: var(--tblr-dark-mode-bg);
  border-color: var(--tblr-border-color-dark);
}

:root.dark .list-group-item {
  background-color: transparent;
  border-color: var(--tblr-border-color-dark);
  color: var(--tblr-light);
}

:root.dark .list-group-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>
