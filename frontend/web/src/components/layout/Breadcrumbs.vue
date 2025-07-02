<template>
  <nav v-if="breadcrumbs.length > 0" class="breadcrumb-nav" aria-label="Breadcrumb">
    <ol class="breadcrumb">
      <li class="breadcrumb-item">
        <router-link to="/" class="breadcrumb-link">
          <svg class="breadcrumb-icon">
            <use href="#tabler-home"></use>
          </svg>
          <span class="breadcrumb-text">Dashboard</span>
        </router-link>
      </li>

      <li
        v-for="(crumb, index) in breadcrumbs"
        :key="index"
        class="breadcrumb-item"
        :class="{ active: index === breadcrumbs.length - 1 }"
      >
        <router-link
          v-if="crumb.to && index !== breadcrumbs.length - 1"
          :to="crumb.to"
          class="breadcrumb-link"
        >
          <svg v-if="crumb.icon" class="breadcrumb-icon">
            <use :href="`#tabler-${crumb.icon}`"></use>
          </svg>
          <span class="breadcrumb-text">{{ crumb.label }}</span>
        </router-link>

        <span v-else class="breadcrumb-current">
          <svg v-if="crumb.icon" class="breadcrumb-icon">
            <use :href="`#tabler-${crumb.icon}`"></use>
          </svg>
          <span class="breadcrumb-text">{{ crumb.label }}</span>
        </span>
      </li>
    </ol>

    <!-- Quick Actions -->
    <div v-if="quickActions.length > 0" class="breadcrumb-actions">
      <BaseButton
        v-for="action in quickActions"
        :key="action.key"
        :variant="action.variant || 'outline-primary'"
        :size="action.size || 'sm'"
        :icon="action.icon"
        :to="action.to"
        :disabled="action.disabled"
        @click="action.onClick"
      >
        {{ action.label }}
      </BaseButton>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const props = defineProps({
  // Custom breadcrumbs override
  items: {
    type: Array,
    default: null
  },

  // Quick action buttons
  quickActions: {
    type: Array,
    default: () => []
  },

  // Hide home breadcrumb
  hideHome: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()

// Generate breadcrumbs from route or use custom items
const breadcrumbs = computed(() => {
  if (props.items) {
    return props.items
  }

  return generateBreadcrumbsFromRoute()
})

// Generate breadcrumbs from current route
const generateBreadcrumbsFromRoute = () => {
  const routeBreadcrumbs = []
  const pathSegments = route.path.split('/').filter(segment => segment)

  // Route-based breadcrumb mapping
  const routeMap = {
    employees: {
      label: 'Employee Management',
      icon: 'users',
      to: '/employees'
    },
    create: {
      label: 'Add New Employee',
      icon: 'plus'
    },
    edit: {
      label: 'Edit Employee',
      icon: 'edit'
    },
    attendance: {
      label: 'Attendance',
      icon: 'calendar',
      to: '/attendance'
    },
    schedules: {
      label: 'Schedules',
      icon: 'clock',
      to: '/schedules'
    },
    'face-recognition': {
      label: 'Face Recognition',
      icon: 'scan',
      to: '/face-recognition'
    },
    reports: {
      label: 'Reports',
      icon: 'chart-bar',
      to: '/reports'
    },
    settings: {
      label: 'Settings',
      icon: 'settings',
      to: '/settings'
    },
    profile: {
      label: 'Profile',
      icon: 'user',
      to: '/profile'
    }
  }

  let currentPath = ''

  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`

    // Skip numeric IDs (like employee IDs)
    if (/^\d+$/.test(segment)) {
      return
    }

    const routeConfig = routeMap[segment]
    if (routeConfig) {
      // For the last segment, don't include 'to' property
      const isLast = index === pathSegments.length - 1

      routeBreadcrumbs.push({
        label: routeConfig.label,
        icon: routeConfig.icon,
        to: isLast ? null : routeConfig.to || currentPath
      })
    } else {
      // Fallback for unknown routes
      routeBreadcrumbs.push({
        label: segment.charAt(0).toUpperCase() + segment.slice(1).replace('-', ' '),
        to: index === pathSegments.length - 1 ? null : currentPath
      })
    }
  })

  // Add custom breadcrumbs from route meta
  if (route.meta?.breadcrumbs) {
    routeBreadcrumbs.push(...route.meta.breadcrumbs)
  }

  // Handle dynamic segments (like employee names)
  if (route.params?.id && route.meta?.entityName) {
    const lastCrumb = routeBreadcrumbs[routeBreadcrumbs.length - 1]
    if (lastCrumb) {
      lastCrumb.label = `${lastCrumb.label} - ${route.meta.entityName}`
    }
  }

  return routeBreadcrumbs
}
</script>

<style scoped>
/* Breadcrumb Navigation */
.breadcrumb-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) 0;
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--border-light);
}

.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: var(--font-size-sm);
}

.breadcrumb-item {
  display: flex;
  align-items: center;
}

.breadcrumb-item:not(:last-child)::after {
  content: '/';
  margin: 0 var(--space-2);
  color: var(--text-muted);
  font-weight: var(--font-weight-normal);
}

.breadcrumb-item.active .breadcrumb-current {
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

/* Breadcrumb Links */
.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: var(--transition-fast);
}

.breadcrumb-link:hover {
  color: var(--text-link);
  background-color: var(--color-gray-50);
  text-decoration: none;
}

.breadcrumb-current {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-1) var(--space-2);
  color: var(--text-primary);
  font-weight: var(--font-weight-medium);
}

/* Breadcrumb Icons */
.breadcrumb-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.5;
}

.breadcrumb-text {
  white-space: nowrap;
}

/* Quick Actions */
.breadcrumb-actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: var(--space-4);
}

/* Responsive Design */
@media (max-width: 768px) {
  .breadcrumb-nav {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--space-3);
  }

  .breadcrumb-actions {
    width: 100%;
    justify-content: flex-end;
    margin-left: 0;
  }

  .breadcrumb-text {
    display: none;
  }

  .breadcrumb-item:first-child .breadcrumb-text {
    display: inline;
  }

  .breadcrumb-item:last-child .breadcrumb-text {
    display: inline;
  }
}

@media (max-width: 576px) {
  .breadcrumb {
    font-size: var(--font-size-xs);
  }

  .breadcrumb-actions {
    flex-wrap: wrap;
  }

  .breadcrumb-item:not(:first-child):not(:last-child) {
    display: none;
  }

  .breadcrumb-item:not(:first-child):not(:last-child) + .breadcrumb-item::before {
    content: '...';
    margin: 0 var(--space-2);
    color: var(--text-muted);
  }
}

/* Dark theme adjustments */
[data-theme='dark'] .breadcrumb-link:hover {
  background-color: var(--color-gray-800);
}
</style>
