<template>
  <div class="page">
    <!-- Sidebar -->
    <Sidebar
      :navigation="navigation"
      :is-active-group="isActiveGroup"
      @toggle-mobile="toggleMobileSidebar"
    />

    <!-- Header -->
    <Header
      :user="currentUser"
      :show-mobile-toggle="true"
      @toggle-sidebar="toggleMobileSidebar"
      @toggle-theme="toggleTheme"
      @logout="logout"
    />

    <!-- Main Content -->
    <div class="page-wrapper">
      <!-- Page header -->
      <div v-if="showPageHeader" class="page-header d-print-none">
        <div class="container-xl">
          <!-- Breadcrumbs -->
          <Breadcrumbs :quick-actions="breadcrumbActions" />

          <div class="row g-2 align-items-center">
            <div class="col">
              <div v-if="pageSubtitle" class="page-pretitle">{{ pageSubtitle }}</div>
              <h2 class="page-title">{{ pageTitle }}</h2>
            </div>
            <div v-if="$slots.actions" class="col-12 col-md-auto ms-auto d-print-none">
              <div class="btn-list">
                <slot name="actions"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Page body -->
      <div class="page-body">
        <div class="container-xl">
          <!-- Loading overlay for route transitions -->
          <LoadingState v-if="isRouteLoading" overlay />

          <main id="main-content" ref="mainContent" tabindex="-1">
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </main>
        </div>
      </div>

      <!-- Footer -->
      <footer class="footer footer-transparent d-print-none">
        <div class="container-xl">
          <div class="row text-center align-items-center flex-row-reverse">
            <div class="col-lg-auto ms-lg-auto">
              <ul class="list-inline list-inline-dots mb-0">
                <li class="list-inline-item">
                  <a href="#" class="link-secondary">Documentation</a>
                </li>
                <li class="list-inline-item">
                  <a href="#" class="link-secondary">Support</a>
                </li>
              </ul>
            </div>
            <div class="col-12 col-lg-auto mt-3 mt-lg-0">
              <ul class="list-inline list-inline-dots mb-0">
                <li class="list-inline-item">© {{ currentYear }} Presensiari</li>
                <li class="list-inline-item">Version 1.0.0</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>

    <!-- Quick Actions -->
    <QuickActions
      :show-stats="true"
      :custom-actions="quickActionsData"
      @action="handleQuickAction"
    />

    <!-- Keyboard Shortcuts Help -->
    <ShortcutHelp :visible="showShortcutHelp" @close="showShortcutHelp = false" />

    <!-- Mobile Bottom Navigation -->
    <MobileBottomNav />

    <!-- Notification Toast Container -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <NotificationToast
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
        @dismiss="dismissNotification"
      />
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/modules/ui'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import Breadcrumbs from '@/components/layout/Breadcrumbs.vue'
import QuickActions from '@/components/layout/QuickActions.vue'
import ShortcutHelp from '@/components/common/ShortcutHelp.vue'
import NotificationToast from '@/components/common/NotificationToast.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import MobileBottomNav from '@/components/common/MobileBottomNav.vue'
import { useAccessibility } from '@/composables/useAccessibility'
import { useKeyboardShortcuts } from '@/composables/useKeyboardShortcuts'
import { useNotifications } from '@/composables/useNotifications'
import { useMobileOptimization } from '@/composables/useMobileOptimization'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()
const { detectPreferences, skipLinks, announceRoute } = useAccessibility()
const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts()
const { notifications, dismissNotification } = useNotifications()
const { isMobile, deviceType } = useMobileOptimization()

// State
const showShortcutHelp = ref(false)
const isRouteLoading = ref(false)
const mainContent = ref(null)
const currentYear = new Date().getFullYear()

// User data
const currentUser = computed(() => ({
  name: authStore.userName,
  email: authStore.userEmail,
  initials: authStore.userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2),
  avatar: authStore.userAvatar
}))

// Page metadata
const pageTitle = computed(() => route.meta?.title || 'Dashboard')
const pageSubtitle = computed(() => route.meta?.subtitle)
const showPageHeader = computed(() => route.meta?.showHeader !== false)

// Navigation structure
const navigation = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: 'dashboard',
    to: '/',
    exact: true
  },
  {
    id: 'employees',
    title: 'Employees',
    icon: 'users',
    children: [
      { title: 'All Employees', to: '/employees', icon: 'list' },
      { title: 'Add Employee', to: '/employees/create', icon: 'plus' },
      { title: 'Employee Types', to: '/employees/types', icon: 'tag' }
    ]
  },
  {
    id: 'attendance',
    title: 'Attendance',
    icon: 'calendar',
    children: [
      { title: 'Calendar', to: '/attendance' },
      { title: 'My History', to: '/attendance/history' },
      { title: 'Manage', to: '/attendance/manage' },
      { title: 'Kiosk Mode', to: '/attendance/kiosk', target: '_blank' }
    ]
  },
  {
    id: 'schedules',
    title: 'Schedules',
    icon: 'clock',
    children: [
      { title: 'View Schedules', to: '/schedules' },
      { title: 'Create Schedule', to: '/schedules/create' },
      { title: 'Calendar View', to: '/schedules/calendar' }
    ]
  },
  {
    id: 'leaves',
    title: 'Leaves',
    icon: 'calendar-off',
    children: [
      { title: 'Leave List', to: '/leaves' },
      { title: 'Apply Leave', to: '/leaves/create' },
      { title: 'Leave Calendar', to: '/leaves/calendar' }
    ]
  },
  {
    id: 'payroll',
    title: 'Payroll',
    icon: 'credit-card',
    children: [
      { title: 'Payroll List', to: '/payroll' },
      { title: 'Create Payroll', to: '/payroll/create' },
      { title: 'Summary', to: '/payroll/summary' }
    ]
  },
  {
    id: 'face-recognition',
    title: 'Face Recognition',
    icon: 'face-id',
    children: [
      { title: 'Setup Face', to: '/face-recognition/setup' },
      { title: 'Manage Faces', to: '/face-recognition/manage' }
    ]
  },
  {
    id: 'reports',
    title: 'Reports',
    icon: 'chart-bar',
    children: [
      { title: 'Dashboard', to: '/reports' },
      { title: 'Attendance', to: '/reports/attendance' },
      { title: 'Payroll', to: '/reports/payroll' },
      { title: 'Leaves', to: '/reports/leaves' }
    ]
  },
  {
    id: 'settings',
    title: 'Settings',
    icon: 'settings',
    children: [
      { title: 'General', to: '/settings' },
      { title: 'Attendance', to: '/settings/attendance' },
      { title: 'Leave', to: '/settings/leave' }
    ]
  }
]

// Check if a navigation group is active
const isActiveGroup = item => {
  if (item.to && item.exact) {
    return route.path === item.to
  }
  if (item.to) {
    return route.path.startsWith(item.to)
  }
  if (item.children) {
    return item.children.some(child => child.to && route.path.startsWith(child.to))
  }
  return false
}

// Dynamic breadcrumb actions
const breadcrumbActions = computed(() => {
  const actions = []

  if (route.path === '/employees') {
    actions.push({
      key: 'add-employee',
      label: 'Add Employee',
      icon: 'plus',
      to: '/employees/create',
      variant: 'primary'
    })
  } else if (route.path.startsWith('/employees/') && route.path.includes('/edit')) {
    actions.push({
      key: 'view-employee',
      label: 'View Details',
      icon: 'eye',
      to: route.path.replace('/edit', ''),
      variant: 'outline-primary'
    })
  }

  return actions
})

// Quick actions data
const quickActionsData = computed(() => {
  const customActions = []

  if (route.path.startsWith('/employees')) {
    customActions.push({
      key: 'export-employees',
      title: 'Export Data',
      subtitle: 'Download employee list',
      icon: 'download',
      action: () => handleExport('employees'),
      class: 'quick-action-info'
    })
  }

  return customActions
})

// Methods
const toggleMobileSidebar = () => {
  uiStore.toggleSidebar()
}

const toggleTheme = () => {
  uiStore.toggleTheme()
}

const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

const handleQuickAction = action => {
  console.log('Quick action executed:', action)
}

const handleExport = type => {
  console.log('Exporting:', type)
  // Implement export logic
}

// Route change handling
watch(
  () => route.path,
  async (newPath, oldPath) => {
    if (newPath !== oldPath) {
      isRouteLoading.value = true

      // Announce route change for screen readers
      announceRoute(pageTitle.value)

      // Focus main content on route change
      await nextTick()
      if (mainContent.value) {
        mainContent.value.focus()
      }

      setTimeout(() => {
        isRouteLoading.value = false
      }, 300)
    }
  }
)

// Global keyboard shortcuts
const setupKeyboardShortcuts = () => {
  // Toggle shortcuts help
  registerShortcut({
    key: 'help',
    keys: ['?'],
    description: 'Show keyboard shortcuts',
    handler: () => {
      showShortcutHelp.value = !showShortcutHelp.value
    }
  })

  // Global search
  registerShortcut({
    key: 'search',
    keys: ['/', 'ctrl+k', 'cmd+k'],
    description: 'Focus global search',
    handler: () => {
      document.dispatchEvent(new Event('focus-global-search'))
    }
  })

  // Navigation shortcuts
  registerShortcut({
    key: 'go-dashboard',
    keys: ['g', 'd'],
    description: 'Go to Dashboard',
    handler: () => router.push('/')
  })

  registerShortcut({
    key: 'go-employees',
    keys: ['g', 'e'],
    description: 'Go to Employees',
    handler: () => router.push('/employees')
  })

  registerShortcut({
    key: 'go-attendance',
    keys: ['g', 'a'],
    description: 'Go to Attendance',
    handler: () => router.push('/attendance')
  })
}

// Lifecycle
onMounted(() => {
  // Initialize accessibility features
  detectPreferences()

  // Skip links removed for pure Tabler.io implementation
  // skipLinks.addToPage([
  //   { target: 'main-content', text: 'Skip to main content' },
  //   { target: 'sidebar-menu', text: 'Skip to navigation' }
  // ])

  // Setup keyboard shortcuts
  setupKeyboardShortcuts()

  // Apply saved theme
  if (uiStore.theme === 'dark') {
    document.documentElement.classList.add('dark')
  }
})

onUnmounted(() => {
  // Cleanup keyboard shortcuts
  unregisterShortcut('help')
  unregisterShortcut('search')
  unregisterShortcut('go-dashboard')
  unregisterShortcut('go-employees')
  unregisterShortcut('go-attendance')
})
</script>

<style scoped>
/* Page layout */
.page-wrapper {
  margin-left: 15rem;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

@media (max-width: 991.98px) {
  .page-wrapper {
    margin-left: 0;
  }
}

/* Page body flex grow */
.page-body {
  flex: 1;
}

/* Route transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Focus styles */
#main-content:focus {
  outline: 2px solid var(--tblr-primary);
  outline-offset: -2px;
}

/* Dark mode support */
:root.dark .page {
  background-color: var(--tblr-dark);
  color: var(--tblr-light);
}

:root.dark .footer {
  background-color: var(--tblr-dark-mode-bg);
  border-top: 1px solid var(--tblr-border-color-dark);
}
</style>
