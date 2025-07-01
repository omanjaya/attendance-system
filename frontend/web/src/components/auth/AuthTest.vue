<template>
  <div class="container-xl py-4">
    <div class="page-header">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="page-title">Authentication & Authorization Test</h2>
          <div class="text-muted mt-1">
            Testing role-based rendering and authentication features
          </div>
        </div>
      </div>
    </div>
    
    <div class="row row-cards">
      <!-- User Info Card -->
      <div class="col-12 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Current User Info</h3>
          </div>
          <div class="card-body">
            <div v-if="isAuthenticated" class="d-flex align-items-center mb-3">
              <span 
                class="avatar avatar-md me-3"
                :style="userAvatar ? `background-image: url(${userAvatar})` : ''"
              >
                {{ userInitials }}
              </span>
              <div>
                <div class="font-weight-medium">{{ userName }}</div>
                <div class="text-muted small">{{ userEmail }}</div>
              </div>
            </div>
            
            <div class="row">
              <div class="col-6">
                <div class="mb-2">
                  <strong>Authenticated:</strong>
                  <span :class="isAuthenticated ? 'text-success' : 'text-danger'">
                    {{ isAuthenticated ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div class="mb-2">
                  <strong>Roles:</strong>
                  <div v-if="userRoles.length">
                    <span 
                      v-for="role in userRoles" 
                      :key="role.name || role"
                      class="badge bg-primary me-1"
                    >
                      {{ role.name || role }}
                    </span>
                  </div>
                  <span v-else class="text-muted">None</span>
                </div>
              </div>
              <div class="col-6">
                <div class="mb-2">
                  <strong>Is Admin:</strong>
                  <span :class="isAdmin ? 'text-success' : 'text-muted'">
                    {{ isAdmin ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div class="mb-2">
                  <strong>Is Manager:</strong>
                  <span :class="isManager ? 'text-success' : 'text-muted'">
                    {{ isManager ? 'Yes' : 'No' }}
                  </span>
                </div>
                <div class="mb-2">
                  <strong>Is Employee:</strong>
                  <span :class="isEmployee ? 'text-success' : 'text-muted'">
                    {{ isEmployee ? 'Yes' : 'No' }}
                  </span>
                </div>
              </div>
            </div>
            
            <div v-if="userPermissions.length" class="mt-3">
              <strong>Permissions:</strong>
              <div class="mt-2">
                <span 
                  v-for="permission in userPermissions" 
                  :key="permission.name || permission"
                  class="badge bg-secondary me-1 mb-1"
                >
                  {{ permission.name || permission }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Role-Based Rendering Tests -->
      <div class="col-12 col-lg-6">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Role-Based Rendering Tests</h3>
          </div>
          <div class="card-body">
            <!-- Admin Only Content -->
            <RoleGuard roles="admin">
              <div class="alert alert-success">
                <TablerIcon name="shield-check" class="me-2" />
                <strong>Admin Only:</strong> You can see this because you have admin role.
              </div>
            </RoleGuard>
            
            <!-- Manager or Admin Content -->
            <RoleGuard :roles="['manager', 'admin']">
              <div class="alert alert-info">
                <TablerIcon name="users" class="me-2" />
                <strong>Manager/Admin:</strong> Visible to managers and admins.
              </div>
            </RoleGuard>
            
            <!-- Employee Content -->
            <RoleGuard roles="employee">
              <div class="alert alert-primary">
                <TablerIcon name="user" class="me-2" />
                <strong>Employee:</strong> Basic employee access content.
              </div>
            </RoleGuard>
            
            <!-- Permission-Based Content -->
            <RoleGuard permissions="users.create">
              <div class="alert alert-warning">
                <TablerIcon name="user-plus" class="me-2" />
                <strong>Create Users:</strong> You have user creation permissions.
              </div>
            </RoleGuard>
            
            <!-- Multiple Permissions (ANY) -->
            <RoleGuard :permissions="['reports.view', 'analytics.view']">
              <div class="alert alert-secondary">
                <TablerIcon name="chart-bar" class="me-2" />
                <strong>Reports/Analytics:</strong> You can view reports or analytics.
              </div>
            </RoleGuard>
            
            <!-- Inverted Access (Hide from admins) -->
            <RoleGuard roles="admin" invert>
              <div class="alert alert-light">
                <TablerIcon name="eye-off" class="me-2" />
                <strong>Non-Admin:</strong> This is hidden from admins.
              </div>
            </RoleGuard>
            
            <!-- No Access Fallback -->
            <RoleGuard roles="super-admin">
              <template #fallback>
                <div class="alert alert-danger">
                  <TablerIcon name="lock" class="me-2" />
                  <strong>Access Denied:</strong> You need super-admin role for this.
                </div>
              </template>
              <div class="alert alert-success">
                <strong>Super Admin Only:</strong> Secret content!
              </div>
            </RoleGuard>
          </div>
        </div>
      </div>
      
      <!-- Action Tests -->
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Action Permission Tests</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-3 mb-3">
                <div class="d-grid">
                  <button 
                    class="btn btn-primary" 
                    :disabled="!canPerformAction('create_employee')"
                    @click="testAction('create_employee')"
                  >
                    <TablerIcon name="user-plus" class="me-2" />
                    Create Employee
                  </button>
                  <small class="text-muted mt-1">
                    Requires: employees.create
                  </small>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="d-grid">
                  <button 
                    class="btn btn-success" 
                    :disabled="!canPerformAction('view_reports')"
                    @click="testAction('view_reports')"
                  >
                    <TablerIcon name="file-text" class="me-2" />
                    View Reports
                  </button>
                  <small class="text-muted mt-1">
                    Requires: reports.view
                  </small>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="d-grid">
                  <button 
                    class="btn btn-warning" 
                    :disabled="!canPerformAction('manage_settings')"
                    @click="testAction('manage_settings')"
                  >
                    <TablerIcon name="settings" class="me-2" />
                    Manage Settings
                  </button>
                  <small class="text-muted mt-1">
                    Requires: settings.manage
                  </small>
                </div>
              </div>
              
              <div class="col-md-3 mb-3">
                <div class="d-grid">
                  <button 
                    class="btn btn-danger" 
                    :disabled="!hasRole('admin')"
                    @click="testAction('admin_action')"
                  >
                    <TablerIcon name="shield" class="me-2" />
                    Admin Action
                  </button>
                  <small class="text-muted mt-1">
                    Requires: admin role
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Auth State Management -->
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Authentication State Management</h3>
          </div>
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h4>User Actions</h4>
                <div class="btn-list">
                  <button 
                    class="btn btn-primary" 
                    @click="refreshUser" 
                    :disabled="loading"
                  >
                    <LoadingSpinner v-if="loading" size="sm" class="me-2" />
                    <TablerIcon v-else name="refresh" class="me-2" />
                    Refresh User Data
                  </button>
                  
                  <button 
                    class="btn btn-outline-secondary" 
                    @click="showUpdateProfileModal = true"
                  >
                    <TablerIcon name="edit" class="me-2" />
                    Test Profile Update
                  </button>
                  
                  <button 
                    class="btn btn-outline-danger" 
                    @click="logout" 
                    :disabled="isLoggingOut"
                  >
                    <LoadingSpinner v-if="isLoggingOut" size="sm" class="me-2" />
                    <TablerIcon v-else name="logout" class="me-2" />
                    Logout
                  </button>
                </div>
              </div>
              
              <div class="col-md-6">
                <h4>State Information</h4>
                <div class="list-group list-group-flush">
                  <div class="list-group-item">
                    <strong>Loading:</strong> {{ loading ? 'Yes' : 'No' }}
                  </div>
                  <div class="list-group-item">
                    <strong>Login Error:</strong> {{ loginError || 'None' }}
                  </div>
                  <div class="list-group-item">
                    <strong>Can Login Again:</strong> {{ canLoginAgain ? 'Yes' : 'No' }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Test Results Modal -->
    <Modal
      v-model:visible="showResultModal"
      title="Action Test Result"
      size="md"
    >
      <div class="alert" :class="`alert-${testResult.type}`">
        <TablerIcon :name="testResult.icon" class="me-2" />
        <strong>{{ testResult.title }}</strong>
        <p class="mb-0 mt-2">{{ testResult.message }}</p>
      </div>
    </Modal>
    
    <!-- Profile Update Test Modal -->
    <Modal
      v-model:visible="showUpdateProfileModal"
      title="Test Profile Update"
      size="md"
      show-default-actions
      @confirm="testProfileUpdate"
    >
      <FormField
        v-model="testProfileData.name"
        label="Name"
        type="text"
        placeholder="Enter test name"
      />
      <FormField
        v-model="testProfileData.email"
        label="Email"
        type="email"
        placeholder="Enter test email"
      />
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useAuth } from '@/composables/useAuth'
import RoleGuard from '@/components/common/RoleGuard.vue'
import Modal from '@/components/common/Modal.vue'
import FormField from '@/components/common/FormField.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import TablerIcon from '@/components/common/TablerIcon.vue'

const {
  // User state
  user,
  isAuthenticated,
  loading,
  isLoggingOut,
  loginError,
  canLoginAgain,
  
  // User data
  userName,
  userEmail,
  userRoles,
  userPermissions,
  userAvatar,
  userInitials,
  
  // Role helpers
  isAdmin,
  isManager,
  isEmployee,
  
  // Methods
  logout,
  refreshUser,
  updateProfile,
  
  // Permission methods
  hasRole,
  hasPermission,
  canPerformAction
} = useAuth()

// Test state
const showResultModal = ref(false)
const showUpdateProfileModal = ref(false)
const testResult = reactive({
  type: 'info',
  icon: 'info-circle',
  title: '',
  message: ''
})

const testProfileData = reactive({
  name: '',
  email: ''
})

// Methods
const testAction = (action) => {
  const canPerform = canPerformAction(action)
  
  testResult.type = canPerform ? 'success' : 'danger'
  testResult.icon = canPerform ? 'check' : 'x'
  testResult.title = canPerform ? 'Action Allowed' : 'Action Denied'
  testResult.message = canPerform 
    ? `You have permission to perform the "${action}" action.`
    : `You do not have permission to perform the "${action}" action.`
  
  showResultModal.value = true
}

const testProfileUpdate = async () => {
  showUpdateProfileModal.value = false
  
  try {
    const result = await updateProfile(testProfileData)
    
    testResult.type = result.success ? 'success' : 'danger'
    testResult.icon = result.success ? 'check' : 'x'
    testResult.title = result.success ? 'Profile Updated' : 'Update Failed'
    testResult.message = result.success 
      ? 'Profile update test completed successfully.'
      : result.message || 'Profile update test failed.'
    
    showResultModal.value = true
  } catch (error) {
    testResult.type = 'danger'
    testResult.icon = 'x'
    testResult.title = 'Update Error'
    testResult.message = 'An error occurred during the profile update test.'
    
    showResultModal.value = true
  }
}
</script>

<style scoped>
.alert {
  border-left: 4px solid;
}

.alert-success {
  border-left-color: var(--tblr-success);
}

.alert-info {
  border-left-color: var(--tblr-info);
}

.alert-warning {
  border-left-color: var(--tblr-warning);
}

.alert-danger {
  border-left-color: var(--tblr-danger);
}

.badge {
  font-size: 0.75rem;
}

.btn:disabled {
  opacity: 0.5;
}
</style>