<template>
  <div class="quick-actions">
    <!-- Quick Actions Button -->
    <button
      class="quick-actions-trigger"
      :class="{ 'is-open': isOpen }"
      @click="toggleActions"
      :title="triggerTitle"
    >
      <svg class="quick-actions-icon" :class="{ 'rotate': isOpen }">
        <use href="#tabler-plus"></use>
      </svg>
    </button>
    
    <!-- Actions Menu -->
    <transition name="quick-actions-menu">
      <div v-if="isOpen" class="quick-actions-menu">
        <div class="quick-actions-list">
          <button
            v-for="action in availableActions"
            :key="action.key"
            class="quick-action-item"
            :class="action.class"
            @click="executeAction(action)"
            :disabled="action.disabled"
          >
            <div class="quick-action-icon">
              <svg class="action-icon">
                <use :href="`#tabler-${action.icon}`"></use>
              </svg>
            </div>
            <div class="quick-action-content">
              <div class="quick-action-title">{{ action.title }}</div>
              <div v-if="action.subtitle" class="quick-action-subtitle">{{ action.subtitle }}</div>
            </div>
            <div v-if="action.badge" class="quick-action-badge">
              <span class="badge" :class="`bg-${action.badgeColor || 'primary'}`">
                {{ action.badge }}
              </span>
            </div>
          </button>
        </div>
        
        <!-- Quick Stats -->
        <div v-if="showStats" class="quick-stats">
          <div class="quick-stats-title">Today's Overview</div>
          <div class="quick-stats-grid">
            <div class="quick-stat-item">
              <div class="quick-stat-value">{{ todayStats.present }}</div>
              <div class="quick-stat-label">Present</div>
            </div>
            <div class="quick-stat-item">
              <div class="quick-stat-value text-warning">{{ todayStats.late }}</div>
              <div class="quick-stat-label">Late</div>
            </div>
            <div class="quick-stat-item">
              <div class="quick-stat-value text-danger">{{ todayStats.absent }}</div>
              <div class="quick-stat-label">Absent</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
    
    <!-- Backdrop -->
    <div
      v-if="isOpen"
      class="quick-actions-backdrop"
      @click="closeActions"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const props = defineProps({
  // Show today's stats in menu
  showStats: {
    type: Boolean,
    default: true
  },
  
  // Custom actions to include
  customActions: {
    type: Array,
    default: () => []
  },
  
  // Position of the menu
  position: {
    type: String,
    default: 'bottom-right',
    validator: (value) => ['bottom-right', 'bottom-left', 'top-right', 'top-left'].includes(value)
  }
})

const emit = defineEmits(['action'])

const router = useRouter()
const route = useRoute()

// State
const isOpen = ref(false)
const todayStats = ref({
  present: 85,
  late: 5,
  absent: 10
})

// Computed
const triggerTitle = computed(() => {
  return isOpen.value ? 'Close quick actions' : 'Quick actions (Q)'
})

// Define contextual actions based on current route
const availableActions = computed(() => {
  const baseActions = [
    {
      key: 'add-employee',
      title: 'Add Employee',
      subtitle: 'Create new employee record',
      icon: 'user-plus',
      action: () => router.push('/employees/create'),
      show: true,
      class: 'quick-action-primary'
    },
    {
      key: 'take-attendance',
      title: 'Take Attendance',
      subtitle: 'Record today\'s attendance',
      icon: 'calendar-check',
      action: () => router.push('/attendance/today'),
      show: true,
      class: 'quick-action-success'
    },
    {
      key: 'face-recognition',
      title: 'Face Recognition',
      subtitle: 'Verify employee identity',
      icon: 'scan',
      action: () => router.push('/face-recognition'),
      show: true,
      class: 'quick-action-info'
    },
    {
      key: 'generate-report',
      title: 'Generate Report',
      subtitle: 'Create attendance report',
      icon: 'file-plus',
      action: () => router.push('/reports/create'),
      show: true,
      class: 'quick-action-secondary'
    },
    {
      key: 'bulk-import',
      title: 'Bulk Import',
      subtitle: 'Import employee data',
      icon: 'upload',
      action: () => openImportModal(),
      show: route.path.startsWith('/employees'),
      class: 'quick-action-warning'
    },
    {
      key: 'schedule-meeting',
      title: 'Schedule Meeting',
      subtitle: 'Plan team meeting',
      icon: 'calendar-event',
      action: () => router.push('/schedules/create'),
      show: true,
      class: 'quick-action-purple'
    },
    {
      key: 'view-dashboard',
      title: 'Dashboard',
      subtitle: 'Overview and analytics',
      icon: 'dashboard',
      action: () => router.push('/'),
      show: route.path !== '/',
      class: 'quick-action-dark'
    },
    {
      key: 'emergency-alert',
      title: 'Emergency Alert',
      subtitle: 'Send urgent notification',
      icon: 'alert-triangle',
      action: () => openEmergencyModal(),
      show: true,
      class: 'quick-action-danger',
      badge: 'Emergency',
      badgeColor: 'danger'
    }
  ]
  
  // Add custom actions
  const customActions = props.customActions.map(action => ({
    ...action,
    show: true,
    class: action.class || 'quick-action-custom'
  }))
  
  // Filter actions based on show property and current context
  return [...baseActions, ...customActions].filter(action => action.show)
})

// Methods
const toggleActions = () => {
  isOpen.value = !isOpen.value
}

const closeActions = () => {
  isOpen.value = false
}

const executeAction = (action) => {
  emit('action', action)
  
  if (action.action) {
    action.action()
  }
  
  closeActions()
}

const openImportModal = () => {
  // TODO: Implement import modal
  console.log('Opening import modal...')
}

const openEmergencyModal = () => {
  // TODO: Implement emergency alert modal
  console.log('Opening emergency alert modal...')
}

// Load today's stats
const loadTodayStats = async () => {
  try {
    // TODO: Replace with actual API call
    // const response = await axios.get('/api/v1/dashboard/today-stats')
    // todayStats.value = response.data.stats
    
    // Mock data for now
    todayStats.value = {
      present: Math.floor(Math.random() * 100) + 80,
      late: Math.floor(Math.random() * 10) + 2,
      absent: Math.floor(Math.random() * 15) + 5
    }
  } catch (error) {
    console.error('Failed to load today stats:', error)
  }
}

// Keyboard shortcuts
const handleKeydown = (event) => {
  // Toggle with 'Q' key
  if (event.key.toLowerCase() === 'q' && !event.ctrlKey && !event.metaKey && !event.altKey) {
    // Only if not in an input field
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) {
      event.preventDefault()
      toggleActions()
    }
  }
  
  // Close with Escape
  if (event.key === 'Escape' && isOpen.value) {
    closeActions()
  }
}

// Lifecycle
onMounted(() => {
  loadTodayStats()
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style scoped>
/* Quick Actions Container */
.quick-actions {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: var(--z-modal);
}

/* Trigger Button */
.quick-actions-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  background: var(--color-primary);
  border: none;
  border-radius: 50%;
  color: var(--color-white);
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: var(--transition-base);
}

.quick-actions-trigger:hover {
  background: var(--color-primary-hover);
  transform: scale(1.05);
  box-shadow: var(--shadow-xl);
}

.quick-actions-trigger.is-open {
  background: var(--color-danger);
}

.quick-actions-icon {
  width: 1.5rem;
  height: 1.5rem;
  transition: var(--transition-base);
}

.quick-actions-icon.rotate {
  transform: rotate(45deg);
}

/* Actions Menu */
.quick-actions-menu {
  position: absolute;
  bottom: 4.5rem;
  right: 0;
  width: 20rem;
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  overflow: hidden;
}

.quick-actions-list {
  padding: var(--space-2);
  max-height: 24rem;
  overflow-y: auto;
}

/* Action Items */
.quick-action-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3);
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  text-align: left;
  cursor: pointer;
  transition: var(--transition-fast);
  margin-bottom: var(--space-1);
}

.quick-action-item:hover {
  background-color: var(--color-gray-50);
  transform: translateX(2px);
}

.quick-action-item:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Action Icons */
.quick-action-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-lg);
  transition: var(--transition-fast);
}

.action-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Action Variants */
.quick-action-primary .quick-action-icon {
  background-color: var(--color-primary-light);
  color: var(--color-primary);
}

.quick-action-success .quick-action-icon {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.quick-action-info .quick-action-icon {
  background-color: var(--color-info-light);
  color: var(--color-info);
}

.quick-action-warning .quick-action-icon {
  background-color: var(--color-warning-light);
  color: var(--color-warning);
}

.quick-action-danger .quick-action-icon {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.quick-action-secondary .quick-action-icon {
  background-color: var(--color-secondary-light);
  color: var(--color-secondary);
}

.quick-action-purple .quick-action-icon {
  background-color: #f3e8ff;
  color: #7c3aed;
}

.quick-action-dark .quick-action-icon {
  background-color: var(--color-gray-200);
  color: var(--color-gray-700);
}

/* Action Content */
.quick-action-content {
  flex: 1;
  min-width: 0;
}

.quick-action-title {
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
}

.quick-action-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-top: var(--space-1);
}

.quick-action-badge {
  margin-left: auto;
}

/* Quick Stats */
.quick-stats {
  border-top: 1px solid var(--border-light);
  padding: var(--space-4);
  background-color: var(--color-gray-50);
}

.quick-stats-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}

.quick-stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.quick-stat-item {
  text-align: center;
}

.quick-stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  line-height: var(--line-height-tight);
}

.quick-stat-label {
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  margin-top: var(--space-1);
}

/* Backdrop */
.quick-actions-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.1);
  z-index: -1;
}

/* Animations */
.quick-actions-menu-enter-active,
.quick-actions-menu-leave-active {
  transition: all var(--transition-base);
}

.quick-actions-menu-enter-from {
  opacity: 0;
  transform: translateY(1rem) scale(0.95);
}

.quick-actions-menu-leave-to {
  opacity: 0;
  transform: translateY(0.5rem) scale(0.98);
}

/* Responsive */
@media (max-width: 768px) {
  .quick-actions {
    bottom: 1rem;
    right: 1rem;
  }
  
  .quick-actions-trigger {
    width: 3rem;
    height: 3rem;
  }
  
  .quick-actions-icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  .quick-actions-menu {
    width: calc(100vw - 2rem);
    right: -1rem;
    bottom: 4rem;
  }
  
  .quick-action-item {
    padding: var(--space-3) var(--space-2);
  }
  
  .quick-action-icon {
    width: 2rem;
    height: 2rem;
  }
  
  .action-icon {
    width: 1rem;
    height: 1rem;
  }
}

@media (max-width: 480px) {
  .quick-actions-menu {
    bottom: 4rem;
    left: 1rem;
    right: 1rem;
    width: auto;
  }
  
  .quick-stats-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--space-2);
  }
}

/* Dark theme adjustments */
[data-theme="dark"] .quick-action-item:hover {
  background-color: var(--color-gray-800);
}

[data-theme="dark"] .quick-stats {
  background-color: var(--color-gray-900);
}

[data-theme="dark"] .quick-action-dark .quick-action-icon {
  background-color: var(--color-gray-800);
  color: var(--color-gray-300);
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .quick-actions-trigger {
    border: 2px solid var(--color-white);
  }
  
  .quick-actions-menu {
    border-width: 2px;
  }
}
</style>