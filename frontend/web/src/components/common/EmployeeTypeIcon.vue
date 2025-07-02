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
  type: {
    type: String,
    required: true,
    validator: value =>
      [
        'permanent_teacher',
        'honorary_teacher',
        'permanent_staff',
        'honorary_staff',
        'teacher',
        'staff',
        'admin',
        'permanent',
        'honorary'
      ].includes(value)
  },
  size: {
    type: [String, Number],
    default: 24
  },
  showTooltip: {
    type: Boolean,
    default: true
  }
})

defineOptions({
  inheritAttrs: false
})

// Employee type to icon mapping
const typeIconMap = {
  permanent_teacher: 'school',
  honorary_teacher: 'user-check',
  permanent_staff: 'briefcase',
  honorary_staff: 'user-cog',

  // Simplified aliases
  teacher: 'school',
  staff: 'briefcase',
  admin: 'shield-check',
  permanent: 'id-badge',
  honorary: 'user-star'
}

// Employee type to color class mapping
const typeColorMap = {
  permanent_teacher: 'text-primary',
  honorary_teacher: 'text-info',
  permanent_staff: 'text-success',
  honorary_staff: 'text-warning',

  // Simplified aliases
  teacher: 'text-primary',
  staff: 'text-success',
  admin: 'text-danger',
  permanent: 'text-primary',
  honorary: 'text-info'
}

// Employee type labels for accessibility
const typeLabels = {
  permanent_teacher: 'Permanent Teacher',
  honorary_teacher: 'Honorary Teacher',
  permanent_staff: 'Permanent Staff',
  honorary_staff: 'Honorary Staff',
  teacher: 'Teacher',
  staff: 'Staff',
  admin: 'Administrator',
  permanent: 'Permanent Employee',
  honorary: 'Honorary Employee'
}

// Employee type descriptions for tooltips
const typeDescriptions = {
  permanent_teacher: 'Full-time teaching staff with permanent contract',
  honorary_teacher: 'Part-time or temporary teaching staff',
  permanent_staff: 'Full-time administrative staff with permanent contract',
  honorary_staff: 'Part-time or temporary administrative staff',
  teacher: 'Teaching staff member',
  staff: 'Administrative staff member',
  admin: 'System administrator',
  permanent: 'Permanent employee',
  honorary: 'Honorary or temporary employee'
}

const iconName = computed(() => typeIconMap[props.type] || 'user')

const iconClasses = computed(() => {
  const classes = [typeColorMap[props.type] || 'text-muted']

  // Add type-specific classes
  classes.push(`employee-type-${props.type.replace('_', '-')}`)

  // Add tooltip class if enabled
  if (props.showTooltip) {
    classes.push('has-tooltip')
  }

  return classes
})

const ariaLabel = computed(() => {
  return typeLabels[props.type] || props.type.replace('_', ' ')
})

const tooltipText = computed(() => {
  return typeDescriptions[props.type] || typeLabels[props.type] || props.type
})
</script>

<style scoped>
/* Employee type specific styling */
.employee-type-permanent-teacher {
  --icon-color: var(--tblr-primary);
}

.employee-type-honorary-teacher {
  --icon-color: var(--tblr-info);
}

.employee-type-permanent-staff {
  --icon-color: var(--tblr-success);
}

.employee-type-honorary-staff {
  --icon-color: var(--tblr-warning);
}

.employee-type-teacher {
  --icon-color: var(--tblr-primary);
}

.employee-type-staff {
  --icon-color: var(--tblr-success);
}

.employee-type-admin {
  --icon-color: var(--tblr-danger);
}

.employee-type-permanent {
  --icon-color: var(--tblr-primary);
}

.employee-type-honorary {
  --icon-color: var(--tblr-info);
}

/* Icon hover effects */
.tabler-icon {
  transition: all 0.2s ease;
}

.tabler-icon:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}

/* Tooltip styling */
.has-tooltip {
  position: relative;
  cursor: help;
}

.has-tooltip::after {
  content: attr(title);
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tblr-dark);
  color: var(--tblr-light);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.2s ease;
  z-index: 1000;
}

.has-tooltip:hover::after {
  opacity: 1;
}

/* Badge-like appearance for smaller sizes */
.tabler-icon[data-size='16'],
.tabler-icon[data-size='xs'] {
  padding: 0.125rem;
  border-radius: 50%;
  background: rgba(var(--icon-color), 0.1);
}

/* Special styling for permanent vs honorary distinction */
.employee-type-permanent-teacher,
.employee-type-permanent-staff {
  border: 1px solid currentColor;
  border-radius: 0.25rem;
  padding: 0.125rem;
}

.employee-type-honorary-teacher,
.employee-type-honorary-staff {
  border: 1px dashed currentColor;
  border-radius: 0.25rem;
  padding: 0.125rem;
}
</style>
