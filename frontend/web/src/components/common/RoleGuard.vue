<template>
  <!-- Render content only if user has required permissions -->
  <div v-if="hasAccess" :class="wrapperClass">
    <slot />
  </div>

  <!-- Fallback content for unauthorized users -->
  <div v-else-if="showFallback" :class="fallbackClass">
    <slot name="fallback">
      <div class="text-center py-4">
        <TablerIcon name="lock" size="lg" class="text-muted mb-2" />
        <p class="text-muted mb-0">
          {{ fallbackMessage || 'You do not have permission to view this content' }}
        </p>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useAuth } from '@/composables/useAuth'
import TablerIcon from './TablerIcon.vue'

const props = defineProps({
  // Role-based access
  roles: {
    type: [String, Array],
    default: null
  },

  // Permission-based access
  permissions: {
    type: [String, Array],
    default: null
  },

  // Require ALL roles/permissions vs ANY (default: any)
  requireAll: {
    type: Boolean,
    default: false
  },

  // Show fallback content when access denied
  showFallback: {
    type: Boolean,
    default: true
  },

  // Custom fallback message
  fallbackMessage: String,

  // CSS classes
  wrapperClass: String,
  fallbackClass: String,

  // Invert logic (hide if user HAS the roles/permissions)
  invert: {
    type: Boolean,
    default: false
  }
})

const { hasRole, hasPermission, hasAnyRole, hasAnyPermission, isAuthenticated } = useAuth()

// Computed access check
const hasAccess = computed(() => {
  // Must be authenticated
  if (!isAuthenticated.value) {
    return props.invert ? true : false
  }

  let hasRoleAccess = true
  let hasPermissionAccess = true

  // Check role requirements
  if (props.roles) {
    const roleArray = Array.isArray(props.roles) ? props.roles : [props.roles]

    if (props.requireAll) {
      // User must have ALL specified roles
      hasRoleAccess = roleArray.every(role => hasRole(role))
    } else {
      // User must have ANY of the specified roles
      hasRoleAccess = hasAnyRole(roleArray)
    }
  }

  // Check permission requirements
  if (props.permissions) {
    const permissionArray = Array.isArray(props.permissions)
      ? props.permissions
      : [props.permissions]

    if (props.requireAll) {
      // User must have ALL specified permissions
      hasPermissionAccess = permissionArray.every(permission => hasPermission(permission))
    } else {
      // User must have ANY of the specified permissions
      hasPermissionAccess = hasAnyPermission(permissionArray)
    }
  }

  const access = hasRoleAccess && hasPermissionAccess

  // Invert logic if requested
  return props.invert ? !access : access
})
</script>

<style scoped>
/* Fallback styling can be customized via fallbackClass prop */
</style>
