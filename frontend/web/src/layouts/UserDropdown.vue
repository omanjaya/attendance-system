<template>
  <div class="nav-item dropdown">
    <a
      href="#"
      class="nav-link d-flex lh-1 text-reset p-0"
      data-bs-toggle="dropdown"
      aria-label="Open user menu"
    >
      <span 
        class="avatar avatar-sm"
        :style="displayUser.avatar ? `background-image: url(${displayUser.avatar})` : ''"
      >
        {{ !displayUser.avatar ? displayUser.initials : '' }}
      </span>
      <div v-if="!compact" class="d-none d-xl-block ps-2">
        <div>{{ displayUser.name }}</div>
        <div class="mt-1 small text-muted">{{ displayUser.email }}</div>
      </div>
    </a>
    <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
      <!-- User Info -->
      <div class="dropdown-header d-flex flex-column align-items-center">
        <span 
          class="avatar avatar-lg mb-2"
          :style="displayUser.avatar ? `background-image: url(${displayUser.avatar})` : ''"
        >
          {{ !displayUser.avatar ? displayUser.initials : '' }}
        </span>
        <div class="text-center">
          <div class="font-weight-medium">{{ displayUser.name }}</div>
          <div class="small text-muted">{{ displayUser.email }}</div>
          <div v-if="user?.roles?.length" class="small text-primary mt-1">
            {{ user.roles.map(r => r.name || r).join(', ') }}
          </div>
        </div>
      </div>
      <div class="dropdown-divider"></div>
      
      <!-- User Menu Items -->
      <template v-for="item in userMenuItems" :key="item.label">
        <router-link 
          v-if="item.route" 
          :to="item.route" 
          class="dropdown-item"
        >
          <TablerIcon :name="item.icon" class="dropdown-item-icon" />
          {{ item.label }}
        </router-link>
        <a 
          v-else
          href="#" 
          class="dropdown-item" 
          @click.prevent="handleMenuClick(item)"
        >
          <TablerIcon :name="item.icon" class="dropdown-item-icon" />
          {{ item.label }}
        </a>
      </template>
      
      <div class="dropdown-divider"></div>
      
      <!-- Quick Access Items -->
      <template v-for="item in quickMenuItems" :key="item.label">
        <router-link :to="item.route" class="dropdown-item">
          <TablerIcon :name="item.icon" class="dropdown-item-icon" />
          {{ item.label }}
          <span v-if="item.badge && item.badge > 0" class="badge bg-primary ms-auto">
            {{ item.badge }}
          </span>
        </router-link>
      </template>
      
      <div class="dropdown-divider"></div>
      
      <a href="#" @click.prevent="handleLogout" class="dropdown-item text-danger">
        <TablerIcon name="logout" class="dropdown-item-icon" />
        <span v-if="isLoggingOut">Logging out...</span>
        <span v-else>Logout</span>
      </a>
    </div>
    
    <!-- Logout Confirmation Modal -->
    <Modal
      v-model:visible="showLogoutModal"
      title="Confirm Logout"
      variant="warning"
      show-default-actions
      :loading="isLoggingOut"
      @confirm="confirmLogout"
      @cancel="showLogoutModal = false"
    >
      <p>Are you sure you want to logout? Any unsaved changes will be lost.</p>
    </Modal>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'
import TablerIcon from '@/components/common/TablerIcon.vue'
import Modal from '@/components/common/Modal.vue'

const props = defineProps({
  compact: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const { 
  user, 
  logout, 
  isLoggingOut, 
  hasRole, 
  hasPermission,
  getUserDisplayName,
  getUserAvatarUrl,
  userInitials
} = useAuth()

const showLogoutModal = ref(false)

// Computed properties for user data
const displayUser = computed(() => ({
  name: getUserDisplayName(),
  email: user.value?.email || '',
  avatar: getUserAvatarUrl(),
  initials: userInitials.value
}))

// Mock data - replace with actual store data
const pendingLeaves = computed(() => {
  // This should come from a leaves store or API
  return user.value?.pending_leaves_count || 0
})

const userMenuItems = computed(() => {
  const items = [
    {
      label: 'Profile',
      icon: 'user',
      route: '/profile',
      visible: true
    },
    {
      label: 'Settings',
      icon: 'settings',
      route: '/settings',
      visible: hasPermission('settings.view')
    },
    {
      label: 'Keyboard Shortcuts',
      icon: 'keyboard',
      action: showShortcuts,
      visible: true
    }
  ]
  
  return items.filter(item => item.visible)
})

const quickMenuItems = computed(() => {
  const items = [
    {
      label: 'My Attendance',
      icon: 'clock',
      route: '/attendance/history',
      visible: true
    },
    {
      label: 'My Leaves',
      icon: 'calendar-off',
      route: '/leaves',
      badge: pendingLeaves.value,
      visible: true
    },
    {
      label: 'My Reports',
      icon: 'file-text',
      route: '/reports/personal',
      visible: hasRole('employee')
    },
    {
      label: 'Team Overview',
      icon: 'users',
      route: '/team',
      visible: hasAnyRole(['manager', 'admin'])
    }
  ]
  
  return items.filter(item => item.visible)
})

// Methods
const handleLogout = () => {
  showLogoutModal.value = true
}

const confirmLogout = async () => {
  showLogoutModal.value = false
  await logout()
}

const showShortcuts = () => {
  window.dispatchEvent(new Event('shortcuts-help-toggle'))
}

const handleMenuClick = (item) => {
  if (item.route) {
    router.push(item.route)
  } else if (item.action) {
    item.action()
  }
}

const hasAnyRole = (roles) => {
  return roles.some(role => hasRole(role))
}
</script>

<style scoped>
/* Avatar styling */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  background-color: var(--tblr-primary);
  color: white;
}

/* Dropdown header */
.dropdown-header {
  padding: 1rem;
  background-color: var(--tblr-bg-surface-secondary);
}

/* Dropdown item icon */
.dropdown-item-icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.5rem;
  opacity: 0.7;
}

.dropdown-item:hover .dropdown-item-icon {
  opacity: 1;
}

/* Badge positioning */
.dropdown-item .badge {
  font-size: 0.625rem;
  padding: 0.25rem 0.5rem;
}

/* Dark mode support */
:root.dark .dropdown-header {
  background-color: var(--tblr-dark-mode-bg);
}

:root.dark .dropdown-menu {
  background-color: var(--tblr-dark-mode-bg);
  border-color: var(--tblr-border-color-dark);
}

:root.dark .dropdown-item {
  color: var(--tblr-light);
}

:root.dark .dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>