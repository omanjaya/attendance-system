<template>
  <TablerIcon
    :name="iconName"
    :size="size"
    :class="iconClasses"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue'
import TablerIcon from './TablerIcon.vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: value =>
      [
        'present',
        'absent',
        'late',
        'approved',
        'pending',
        'active',
        'inactive',
        'success',
        'error',
        'warning',
        'info'
      ].includes(value)
  },
  size: {
    type: [String, Number],
    default: 24
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})

defineOptions({
  inheritAttrs: false
})

// Status to icon mapping
const statusIconMap = {
  // Attendance status
  present: 'check',
  absent: 'x',
  late: 'clock',

  // Approval status
  approved: 'circle-check',
  pending: 'clock-pause',

  // General status
  active: 'circle-check',
  inactive: 'circle-x',
  success: 'circle-check',
  error: 'circle-x',
  warning: 'alert-triangle',
  info: 'info-circle'
}

// Status to color class mapping
const statusColorMap = {
  present: 'text-success',
  absent: 'text-danger',
  late: 'text-warning',
  approved: 'text-success',
  pending: 'text-warning',
  active: 'text-success',
  inactive: 'text-muted',
  success: 'text-success',
  error: 'text-danger',
  warning: 'text-warning',
  info: 'text-info'
}

// Status labels for accessibility
const statusLabels = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  approved: 'Approved',
  pending: 'Pending',
  active: 'Active',
  inactive: 'Inactive',
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Information'
}

const iconName = computed(() => statusIconMap[props.status] || 'help')

const iconClasses = computed(() => {
  const classes = [statusColorMap[props.status] || 'text-muted']

  // Add status-specific classes
  classes.push(`status-icon-${props.status}`)

  return classes
})

const ariaLabel = computed(() => {
  return statusLabels[props.status] || props.status
})
</script>

<style scoped>
/* Status-specific styling */
.status-icon-present {
  --icon-color: var(--tblr-success);
}

.status-icon-absent {
  --icon-color: var(--tblr-danger);
}

.status-icon-late {
  --icon-color: var(--tblr-warning);
}

.status-icon-approved {
  --icon-color: var(--tblr-success);
}

.status-icon-pending {
  --icon-color: var(--tblr-warning);
}

.status-icon-active {
  --icon-color: var(--tblr-success);
}

.status-icon-inactive {
  --icon-color: var(--tblr-muted);
}

.status-icon-success {
  --icon-color: var(--tblr-success);
}

.status-icon-error {
  --icon-color: var(--tblr-danger);
}

.status-icon-warning {
  --icon-color: var(--tblr-warning);
}

.status-icon-info {
  --icon-color: var(--tblr-info);
}

/* Animation for status changes */
.tabler-icon {
  transition:
    color 0.2s ease,
    transform 0.2s ease;
}

.tabler-icon:hover {
  transform: scale(1.1);
}

/* Pulse animation for pending status */
.status-icon-pending .tabler-icon {
  animation: pulse-warning 2s infinite;
}

@keyframes pulse-warning {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
  }
}
</style>
