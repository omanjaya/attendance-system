<template>
  <div class="employee-card" :class="{ 'employee-card-detailed': detailed }">
    <!-- Card Header -->
    <div v-if="!detailed" class="card h-100">
      <div class="card-body text-center">
        <!-- Employee Avatar -->
        <div class="avatar avatar-lg mb-3 mx-auto">
          <img
            v-if="employee.photo"
            :src="employee.photo"
            :alt="employee.name"
            class="avatar-img"
          />
          <span v-else class="avatar-placeholder">
            {{ getInitials(employee.name) }}
          </span>

          <!-- Status Badge -->
          <span
            class="badge badge-notification"
            :class="employee.is_active ? 'bg-success' : 'bg-secondary'"
          >
            {{ employee.is_active ? '●' : '●' }}
          </span>
        </div>

        <!-- Basic Info -->
        <h5 class="card-title mb-1">{{ employee.name }}</h5>
        <div class="text-muted small mb-2">{{ employee.employee_id }}</div>
        <div class="text-muted small mb-3">{{ employee.position }}</div>

        <!-- Department Badge -->
        <span class="badge bg-primary-lt mb-3">
          {{ employee.department?.name || 'No Department' }}
        </span>

        <!-- Quick Stats -->
        <div class="row text-center">
          <div class="col-6">
            <div class="small text-muted">Type</div>
            <div class="font-weight-medium">{{ formatEmployeeType(employee.employee_type) }}</div>
          </div>
          <div class="col-6">
            <div class="small text-muted">Joined</div>
            <div class="font-weight-medium">{{ formatDate(employee.hire_date) }}</div>
          </div>
        </div>

        <!-- Actions -->
        <div class="mt-3 btn-list justify-content-center">
          <RoleGuard permissions="employees.view">
            <button class="btn btn-sm btn-outline-primary" @click="$emit('view', employee)">
              <TablerIcon name="eye" size="sm" />
            </button>
          </RoleGuard>

          <RoleGuard permissions="employees.edit">
            <button class="btn btn-sm btn-outline-secondary" @click="$emit('edit', employee)">
              <TablerIcon name="edit" size="sm" />
            </button>
          </RoleGuard>

          <RoleGuard permissions="employees.delete">
            <button class="btn btn-sm btn-outline-danger" @click="$emit('delete', employee)">
              <TablerIcon name="trash" size="sm" />
            </button>
          </RoleGuard>
        </div>
      </div>
    </div>

    <!-- Detailed View -->
    <div v-else class="employee-detailed">
      <!-- Header Section -->
      <div class="card mb-3">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-auto">
              <div class="avatar avatar-xl">
                <img
                  v-if="employee.photo"
                  :src="employee.photo"
                  :alt="employee.name"
                  class="avatar-img"
                />
                <span v-else class="avatar-placeholder">
                  {{ getInitials(employee.name) }}
                </span>
              </div>
            </div>

            <div class="col">
              <h2 class="mb-1">{{ employee.name }}</h2>
              <div class="text-muted mb-2">
                <TablerIcon name="id" size="sm" class="me-1" />
                {{ employee.employee_id }}
              </div>
              <div class="d-flex align-items-center gap-3">
                <span class="badge" :class="employee.is_active ? 'bg-success' : 'bg-secondary'">
                  {{ employee.is_active ? 'Active' : 'Inactive' }}
                </span>
                <span class="badge bg-primary-lt">
                  {{ formatEmployeeType(employee.employee_type) }}
                </span>
                <span class="text-muted small">
                  <TablerIcon name="calendar" size="sm" class="me-1" />
                  Joined {{ formatDate(employee.hire_date) }}
                </span>
              </div>
            </div>

            <div class="col-auto">
              <div class="btn-list">
                <RoleGuard permissions="employees.edit">
                  <button class="btn btn-primary" @click="$emit('edit', employee)">
                    <TablerIcon name="edit" class="me-2" />
                    Edit Employee
                  </button>
                </RoleGuard>

                <div class="dropdown">
                  <button
                    class="btn btn-outline-secondary dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                  >
                    <TablerIcon name="dots" />
                  </button>
                  <ul class="dropdown-menu dropdown-menu-end">
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="printEmployee">
                        <TablerIcon name="printer" size="sm" class="me-2" />
                        Print Profile
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="exportEmployee">
                        <TablerIcon name="download" size="sm" class="me-2" />
                        Export Data
                      </a>
                    </li>
                    <li><hr class="dropdown-divider" /></li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="resetPassword">
                        <TablerIcon name="key" size="sm" class="me-2" />
                        Reset Password
                      </a>
                    </li>
                    <li>
                      <a class="dropdown-item" href="#" @click.prevent="toggleStatus">
                        <TablerIcon
                          :name="employee.is_active ? 'user-off' : 'user-check'"
                          size="sm"
                          class="me-2"
                        />
                        {{ employee.is_active ? 'Deactivate' : 'Activate' }}
                      </a>
                    </li>
                    <RoleGuard permissions="employees.delete">
                      <li>
                        <a
                          class="dropdown-item text-danger"
                          href="#"
                          @click.prevent="$emit('delete', employee)"
                        >
                          <TablerIcon name="trash" size="sm" class="me-2" />
                          Delete Employee
                        </a>
                      </li>
                    </RoleGuard>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Information Tabs -->
      <div class="card">
        <div class="card-header">
          <ul class="nav nav-tabs card-header-tabs" role="tablist">
            <li class="nav-item" role="presentation">
              <button
                class="nav-link active"
                data-bs-toggle="tab"
                data-bs-target="#personal-info"
                type="button"
                role="tab"
              >
                <TablerIcon name="user" size="sm" class="me-2" />
                Personal Info
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#employment"
                type="button"
                role="tab"
              >
                <TablerIcon name="briefcase" size="sm" class="me-2" />
                Employment
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#attendance"
                type="button"
                role="tab"
              >
                <TablerIcon name="clock" size="sm" class="me-2" />
                Attendance
              </button>
            </li>
            <li class="nav-item" role="presentation">
              <button
                class="nav-link"
                data-bs-toggle="tab"
                data-bs-target="#documents"
                type="button"
                role="tab"
              >
                <TablerIcon name="file-text" size="sm" class="me-2" />
                Documents
              </button>
            </li>
          </ul>
        </div>

        <div class="card-body">
          <div class="tab-content">
            <!-- Personal Information -->
            <div id="personal-info" class="tab-pane fade show active">
              <div class="row">
                <div class="col-md-6">
                  <h4 class="h5 mb-3">Contact Information</h4>
                  <table class="table table-borderless">
                    <tbody>
                      <tr>
                        <td class="text-muted" style="width: 30%">Email:</td>
                        <td>
                          <a :href="`mailto:${employee.email}`">{{ employee.email }}</a>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-muted">Phone:</td>
                        <td>
                          <a v-if="employee.phone" :href="`tel:${employee.phone}`">
                            {{ employee.phone }}
                          </a>
                          <span v-else class="text-muted">Not provided</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-muted">Address:</td>
                        <td>
                          <span v-if="employee.address">{{ employee.address }}</span>
                          <span v-else class="text-muted">Not provided</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="col-md-6">
                  <h4 class="h5 mb-3">Personal Details</h4>
                  <table class="table table-borderless">
                    <tbody>
                      <tr>
                        <td class="text-muted" style="width: 40%">Date of Birth:</td>
                        <td>
                          <span v-if="employee.date_of_birth">
                            {{ formatDate(employee.date_of_birth) }}
                            <span class="text-muted small"
                              >({{ getAge(employee.date_of_birth) }} years old)</span
                            >
                          </span>
                          <span v-else class="text-muted">Not provided</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-muted">Gender:</td>
                        <td>
                          <span v-if="employee.gender">{{ formatGender(employee.gender) }}</span>
                          <span v-else class="text-muted">Not specified</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <h4 class="h5 mb-3 mt-4">Emergency Contact</h4>
                  <table class="table table-borderless">
                    <tbody>
                      <tr>
                        <td class="text-muted" style="width: 40%">Name:</td>
                        <td>
                          <span v-if="employee.emergency_contact_name">
                            {{ employee.emergency_contact_name }}
                          </span>
                          <span v-else class="text-muted">Not provided</span>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-muted">Phone:</td>
                        <td>
                          <a
                            v-if="employee.emergency_contact_phone"
                            :href="`tel:${employee.emergency_contact_phone}`"
                          >
                            {{ employee.emergency_contact_phone }}
                          </a>
                          <span v-else class="text-muted">Not provided</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Employment Information -->
            <div id="employment" class="tab-pane fade">
              <div class="row">
                <div class="col-md-6">
                  <h4 class="h5 mb-3">Position Details</h4>
                  <table class="table table-borderless">
                    <tbody>
                      <tr>
                        <td class="text-muted" style="width: 30%">Position:</td>
                        <td class="font-weight-medium">{{ employee.position }}</td>
                      </tr>
                      <tr>
                        <td class="text-muted">Department:</td>
                        <td>{{ employee.department?.name || 'Not assigned' }}</td>
                      </tr>
                      <tr>
                        <td class="text-muted">Employee Type:</td>
                        <td>
                          <span class="badge bg-primary-lt">
                            {{ formatEmployeeType(employee.employee_type) }}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td class="text-muted">Status:</td>
                        <td>
                          <span
                            class="badge"
                            :class="employee.is_active ? 'bg-success' : 'bg-secondary'"
                          >
                            {{ employee.is_active ? 'Active' : 'Inactive' }}
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div class="col-md-6">
                  <h4 class="h5 mb-3">Employment Timeline</h4>
                  <table class="table table-borderless">
                    <tbody>
                      <tr>
                        <td class="text-muted" style="width: 30%">Hire Date:</td>
                        <td>{{ formatDate(employee.hire_date) }}</td>
                      </tr>
                      <tr>
                        <td class="text-muted">Duration:</td>
                        <td>{{ getEmploymentDuration(employee.hire_date) }}</td>
                      </tr>
                      <tr v-if="employee.salary">
                        <td class="text-muted">Salary:</td>
                        <td class="font-weight-medium">{{ formatCurrency(employee.salary) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <!-- Attendance Summary -->
            <div id="attendance" class="tab-pane fade">
              <AttendanceSummary
                v-if="detailed"
                :employee-id="employee.id"
                :period="'current_month'"
              />
            </div>

            <!-- Documents -->
            <div id="documents" class="tab-pane fade">
              <EmployeeDocuments
                v-if="detailed"
                :employee-id="employee.id"
                @upload="handleDocumentUpload"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { formatters } from '@/utils/formatters'
import RoleGuard from '@/components/common/RoleGuard.vue'
import TablerIcon from '@/components/common/TablerIcon.vue'
// import AttendanceSummary from '@/components/attendance/AttendanceSummary.vue'
// import EmployeeDocuments from '@/components/employees/EmployeeDocuments.vue'

const props = defineProps({
  employee: {
    type: Object,
    required: true
  },
  detailed: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['edit', 'delete', 'view', 'close'])

// Methods
const getInitials = name => {
  if (!name) return 'NA'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatEmployeeType = type => {
  if (!type) return 'N/A'
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const formatDate = date => {
  return formatters.date(date)
}

const formatCurrency = amount => {
  return formatters.currency(amount)
}

const formatGender = gender => {
  const genderMap = {
    male: 'Male',
    female: 'Female',
    other: 'Other',
    not_specified: 'Prefer not to say'
  }
  return genderMap[gender] || 'Not specified'
}

const getAge = birthDate => {
  if (!birthDate) return 'N/A'

  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }

  return age
}

const getEmploymentDuration = hireDate => {
  if (!hireDate) return 'N/A'

  const now = new Date()
  const hire = new Date(hireDate)
  const diffTime = Math.abs(now - hire)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays < 30) {
    return `${diffDays} days`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''}`
  } else {
    const years = Math.floor(diffDays / 365)
    const remainingMonths = Math.floor((diffDays % 365) / 30)
    return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
  }
}

// Action handlers
const printEmployee = () => {
  window.print()
}

const exportEmployee = () => {
  // Implementation for exporting employee data
  console.log('Export employee:', props.employee.id)
}

const resetPassword = () => {
  // Implementation for resetting password
  console.log('Reset password for:', props.employee.id)
}

const toggleStatus = () => {
  // Implementation for toggling employee status
  console.log('Toggle status for:', props.employee.id)
}

const handleDocumentUpload = document => {
  // Implementation for document upload
  console.log('Document uploaded:', document)
}
</script>

<style scoped>
.employee-card {
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.employee-card:not(.employee-card-detailed):hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
}

.avatar {
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--tblr-primary);
  color: white;
  font-weight: 600;
  font-size: 1.2rem;
}

.badge-notification {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid white;
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.table-borderless td {
  padding: 0.5rem 0;
  border: none;
}

.table-borderless td:first-child {
  padding-left: 0;
}

.nav-tabs .nav-link {
  border: none;
  color: var(--tblr-muted);
  padding: 0.75rem 1rem;
}

.nav-tabs .nav-link.active {
  color: var(--tblr-primary);
  border-bottom: 2px solid var(--tblr-primary);
  background: none;
}

.nav-tabs .nav-link:hover:not(.active) {
  color: var(--tblr-body-color);
  border: none;
}

/* Print styles */
@media print {
  .btn-list,
  .dropdown,
  .nav-tabs {
    display: none !important;
  }

  .card {
    border: none !important;
    box-shadow: none !important;
  }

  .tab-content .tab-pane {
    display: block !important;
    opacity: 1 !important;
  }
}

/* Dark mode support */
:root.dark .badge-notification {
  border-color: var(--tblr-dark-mode-bg);
}

:root.dark .avatar-placeholder {
  background-color: var(--tblr-primary-dark);
}

/* Responsive design */
@media (max-width: 768px) {
  .employee-detailed .row {
    flex-direction: column;
  }

  .employee-detailed .col-auto {
    order: -1;
    text-align: center;
    margin-bottom: 1rem;
  }

  .btn-list {
    justify-content: center;
    flex-wrap: wrap;
  }

  .nav-tabs {
    flex-wrap: wrap;
  }

  .nav-tabs .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.875rem;
  }
}
</style>
