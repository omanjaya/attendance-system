<template>
  <header class="navbar navbar-expand-md d-print-none" :class="navbarClass">
    <div class="container-xl">
      <!-- Mobile Toggle -->
      <button
        v-if="showMobileToggle"
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        @click="$emit('toggle-sidebar')"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Page Title (Mobile) -->
      <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
        <router-link to="/">
          {{ pageTitle }}
        </router-link>
      </h1>

      <div class="navbar-nav flex-row order-md-last">
        <!-- Theme Toggle -->
        <div class="nav-item dropdown d-none d-md-flex me-3">
          <button
            class="nav-link px-0"
            :title="isDarkMode ? 'Enable light mode' : 'Enable dark mode'"
            data-bs-toggle="tooltip"
            data-bs-placement="bottom"
            @click="$emit('toggle-theme')"
          >
            <TablerIcon :name="isDarkMode ? 'sun' : 'moon'" />
          </button>
        </div>

        <!-- Global Search -->
        <div class="nav-item me-3 d-none d-md-flex">
          <GlobalSearch />
        </div>

        <!-- Notifications -->
        <NotificationDropdown class="d-none d-md-flex me-3" />

        <!-- Quick Actions -->
        <div class="nav-item dropdown d-none d-md-flex me-3">
          <a href="#" class="nav-link px-0" data-bs-toggle="dropdown" tabindex="-1" aria-label="Show quick actions">
            <TablerIcon name="apps" />
          </a>
          <div class="dropdown-menu dropdown-menu-end dropdown-menu-card">
            <div class="card">
              <div class="card-body">
                <div class="row g-3">
                  <div v-for="action in quickActions" :key="action.id" class="col-4">
                    <a
                      :href="action.href || '#'"
                      class="text-center text-decoration-none"
                      @click.prevent="handleQuickAction(action)"
                    >
                      <div class="avatar bg-primary-lt mb-2">
                        <TablerIcon :name="action.icon" />
                      </div>
                      <div class="text-muted small">{{ action.label }}</div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Menu -->
        <UserDropdown :user="user" @logout="$emit('logout')" />
      </div>

      <!-- Mobile Bottom Bar -->
      <div id="navbar-menu" class="collapse navbar-collapse">
        <div class="d-flex flex-column flex-md-row flex-fill align-items-stretch align-items-md-center">
          <ul class="navbar-nav">
            <!-- Mobile only items -->
            <li class="nav-item d-md-none">
              <a class="nav-link" href="#" @click.prevent="$emit('toggle-theme')">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <TablerIcon :name="isDarkMode ? 'sun' : 'moon'" />
                </span>
                <span class="nav-link-title">
                  {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
                </span>
              </a>
            </li>
            <li class="nav-item d-md-none">
              <a class="nav-link" href="#" @click.prevent="showMobileSearch = true">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <TablerIcon name="search" />
                </span>
                <span class="nav-link-title">Search</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Mobile Search Overlay -->
    <transition name="slide-down">
      <div v-if="showMobileSearch" class="navbar-search-overlay">
        <div class="container-xl">
          <GlobalSearch :autofocus="true" @close="showMobileSearch = false" @search="handleMobileSearch" />
        </div>
      </div>
    </transition>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/modules/ui'
import GlobalSearch from '@/components/layout/GlobalSearch.vue'
import UserDropdown from './UserDropdown.vue'
import NotificationDropdown from './NotificationDropdown.vue'
import TablerIcon from '@/components/common/TablerIcon.vue'

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  showMobileToggle: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['toggle-sidebar', 'toggle-theme', 'logout'])

const route = useRoute()
const uiStore = useUIStore()

// State
const showMobileSearch = ref(false)

// Computed
const isDarkMode = computed(() => uiStore.theme === 'dark')
const pageTitle = computed(() => route.meta?.title || 'Dashboard')
const navbarClass = computed(() => ({
  'navbar-light': !isDarkMode.value,
  'navbar-dark': isDarkMode.value,
  'navbar-glass': route.meta?.transparentHeader
}))

// Quick actions for the dropdown
const quickActions = [
  {
    id: 'add-employee',
    icon: 'user-plus',
    label: 'Add Employee',
    href: '/employees/create'
  },
  {
    id: 'check-in',
    icon: 'clock',
    label: 'Check In',
    action: 'check-in'
  },
  {
    id: 'reports',
    icon: 'chart-bar',
    label: 'Reports',
    href: '/reports'
  },
  {
    id: 'schedule',
    icon: 'calendar',
    label: 'Schedule',
    href: '/schedules'
  },
  {
    id: 'settings',
    icon: 'settings',
    label: 'Settings',
    href: '/settings'
  },
  {
    id: 'help',
    icon: 'help',
    label: 'Help',
    action: 'show-help'
  }
]

// Methods
const handleQuickAction = action => {
  if (action.href) {
    // Navigation handled by href
    return
  }

  switch (action.action) {
    case 'check-in':
      // Emit check-in event
      window.dispatchEvent(new Event('quick-check-in'))
      break
    case 'show-help':
      // Show help modal
      window.dispatchEvent(new Event('shortcuts-help-toggle'))
      break
  }
}

const handleMobileSearch = query => {
  showMobileSearch.value = false
  // Handle search query
}
</script>

<style scoped>
/* Header base styles */
.navbar {
  background-color: var(--tblr-bg-surface);
  border-bottom: 1px solid var(--tblr-border-color);
  backdrop-filter: blur(10px);
}

/* Glass effect for transparent header */
.navbar-glass {
  background-color: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

:root.dark .navbar-glass {
  background-color: rgba(24, 28, 33, 0.95);
}

/* Mobile search overlay */
.navbar-search-overlay {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: var(--tblr-bg-surface);
  border-bottom: 1px solid var(--tblr-border-color);
  padding: 1rem 0;
  z-index: 1020;
}

/* Quick actions grid */
.dropdown-menu-card {
  width: 20rem;
}

.dropdown-menu-card .card {
  margin: 0;
  border: 0;
  box-shadow: none;
}

/* Transitions */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

/* Dark mode support */
:root.dark .navbar {
  background-color: var(--tblr-dark-mode-bg);
  border-bottom-color: var(--tblr-border-color-dark);
}

/* Responsive adjustments */
@media (max-width: 767.98px) {
  .navbar-nav {
    padding: 0.5rem 0;
  }

  .navbar-collapse {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background-color: var(--tblr-bg-surface);
    border-bottom: 1px solid var(--tblr-border-color);
    z-index: 1020;
  }
}
</style>
