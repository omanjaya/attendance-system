<template>
  <div class="page-body">
    <div class="container-xl">
      <div v-if="employee" class="page-header d-print-none">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">
              {{ employee.name }}
            </h2>
            <div class="page-subtitle">
              {{ employee.employee_id }} • {{ getEmployeeTypeLabel(employee.employee_type) }}
            </div>
          </div>
          <div class="col-auto ms-auto d-print-none">
            <div class="btn-list">
              <router-link :to="`/employees/${employee.id}/edit`" class="btn btn-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                  <path
                    d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
                  />
                  <path d="M16 5l3 3" />
                </svg>
                Edit
              </router-link>
              <router-link to="/employees" class="btn btn-outline-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l14 0" />
                  <path d="M5 12l6 6" />
                  <path d="M5 12l6 -6" />
                </svg>
                Back to List
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="row row-deck row-cards">
        <!-- Loading State -->
        <div v-if="loading" class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2">Loading employee data...</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Employee Not Found -->
        <div v-else-if="!employee" class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="empty">
                <div class="empty-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <circle cx="10" cy="10" r="7" />
                    <path d="m21 21l-6 -6" />
                  </svg>
                </div>
                <p class="empty-title">Employee not found</p>
                <p class="empty-subtitle text-muted">
                  The employee you're looking for doesn't exist or has been deleted.
                </p>
                <div class="empty-action">
                  <router-link to="/employees" class="btn btn-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="m9 14l-4 -4l4 -4" />
                      <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                    </svg>
                    Go back
                  </router-link>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Employee Details -->
        <template v-else>
          <!-- Employee Header Card -->
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Employee Details</h3>
                <div class="card-actions">
                  <router-link :to="`/employees/${employeeId}/edit`" class="btn btn-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                      <path
                        d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
                      />
                      <path d="M16 5l3 3" />
                    </svg>
                    Edit
                  </router-link>
                  <router-link to="/employees" class="btn btn-outline-secondary ms-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="m9 14l-4 -4l4 -4" />
                      <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                    </svg>
                    Back to List
                  </router-link>
                </div>
              </div>

              <div class="card-body">
                <div class="row">
                  <div class="col-auto">
                    <span
                      class="avatar avatar-xl"
                      :style="
                        employee.avatar_url ? `background-image: url(${employee.avatar_url})` : ''
                      "
                    >
                      {{ employee.avatar_url ? '' : getInitials(employee.name) }}
                    </span>
                  </div>
                  <div class="col">
                    <div class="mb-1">
                      <h2 class="mb-0">{{ employee.name }}</h2>
                      <div class="text-muted">{{ employee.employee_id }}</div>
                    </div>
                    <div class="list-inline list-inline-dots mb-0 text-muted">
                      <div class="list-inline-item">
                        <span
                          class="badge"
                          :class="`bg-${getEmployeeTypeColor(employee.employee_type)}`"
                        >
                          {{ getEmployeeTypeLabel(employee.employee_type) }}
                        </span>
                      </div>
                      <div class="list-inline-item">
                        <span
                          class="badge"
                          :class="employee.is_active ? 'bg-success' : 'bg-danger'"
                        >
                          {{ employee.is_active ? 'Active' : 'Inactive' }}
                        </span>
                      </div>
                      <div class="list-inline-item">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        Hired {{ formatDate(employee.hire_date) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Basic Information -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Basic Information</h3>
              </div>
              <div class="card-body">
                <dl class="row">
                  <dt class="col-5">Full Name:</dt>
                  <dd class="col-7">{{ employee.name }}</dd>

                  <dt class="col-5">Employee ID:</dt>
                  <dd class="col-7">
                    <span class="badge bg-azure-lt">{{ employee.employee_id }}</span>
                  </dd>

                  <dt class="col-5">Email:</dt>
                  <dd class="col-7">
                    <a :href="`mailto:${employee.email}`" class="text-decoration-none">
                      {{ employee.email }}
                    </a>
                  </dd>

                  <dt class="col-5">Phone:</dt>
                  <dd class="col-7">
                    <a
                      v-if="employee.phone"
                      :href="`tel:${employee.phone}`"
                      class="text-decoration-none"
                    >
                      {{ employee.phone }}
                    </a>
                    <span v-else class="text-muted">-</span>
                  </dd>

                  <dt class="col-5">Address:</dt>
                  <dd class="col-7">
                    <span v-if="employee.address">{{ employee.address }}</span>
                    <span v-else class="text-muted">-</span>
                  </dd>

                  <dt class="col-5">Hire Date:</dt>
                  <dd class="col-7">{{ formatDate(employee.hire_date) }}</dd>

                  <dt class="col-5">Status:</dt>
                  <dd class="col-7">
                    <span class="badge" :class="employee.is_active ? 'bg-success' : 'bg-danger'">
                      {{ employee.is_active ? 'Active' : 'Inactive' }}
                    </span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <!-- Role & Department Information -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Role & Department</h3>
              </div>
              <div class="card-body">
                <dl class="row">
                  <dt class="col-5">Employee Type:</dt>
                  <dd class="col-7">
                    <span
                      class="badge"
                      :class="`bg-${getEmployeeTypeColor(employee.employee_type)}`"
                    >
                      {{ getEmployeeTypeLabel(employee.employee_type) }}
                    </span>
                  </dd>

                  <!-- For Teachers -->
                  <template v-if="isTeacher">
                    <dt class="col-5">Subject:</dt>
                    <dd class="col-7">
                      <span v-if="employee.subject">{{ employee.subject }}</span>
                      <span v-else class="text-muted">-</span>
                    </dd>

                    <dt class="col-5">Grade Level:</dt>
                    <dd class="col-7">
                      <span v-if="employee.grade_level">{{ employee.grade_level }}</span>
                      <span v-else class="text-muted">-</span>
                    </dd>
                  </template>

                  <!-- For Staff -->
                  <template v-if="isStaff">
                    <dt class="col-5">Department:</dt>
                    <dd class="col-7">
                      <span v-if="employee.department">{{ employee.department }}</span>
                      <span v-else class="text-muted">-</span>
                    </dd>
                  </template>

                  <dt class="col-5">Work Schedule:</dt>
                  <dd class="col-7">
                    <span v-if="requiresFixedSchedule" class="badge bg-blue-lt">Fixed Hours</span>
                    <span v-else class="badge bg-orange-lt">Flexible Hours</span>
                  </dd>

                  <dt class="col-5">Overtime:</dt>
                  <dd class="col-7">
                    <span v-if="allowsOvertime" class="badge bg-green-lt">Allowed</span>
                    <span v-else class="badge bg-red-lt">Not Allowed</span>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <!-- Compensation Information -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Compensation</h3>
              </div>
              <div class="card-body">
                <dl class="row">
                  <dt class="col-5">Payment Type:</dt>
                  <dd class="col-7">
                    <span v-if="isSalaryBased" class="badge bg-green">Monthly Salary</span>
                    <span v-else class="badge bg-orange">Hourly Rate</span>
                  </dd>

                  <template v-if="isSalaryBased">
                    <dt class="col-5">Monthly Salary:</dt>
                    <dd class="col-7">
                      <span class="h4 text-primary">{{
                        formatCurrency(employee.monthly_salary)
                      }}</span>
                    </dd>
                  </template>

                  <template v-if="isHourlyBased">
                    <dt class="col-5">Hourly Rate:</dt>
                    <dd class="col-7">
                      <span class="h4 text-primary"
                        >{{ formatCurrency(employee.hourly_rate) }}/hour</span
                      >
                    </dd>
                  </template>

                  <dt class="col-5">Allowances:</dt>
                  <dd class="col-7">
                    <div class="d-flex flex-wrap gap-1">
                      <span
                        v-for="allowance in allowances"
                        :key="allowance"
                        class="badge bg-indigo-lt"
                      >
                        {{ formatAllowance(allowance) }}
                      </span>
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Recent Activity</h3>
              </div>
              <div class="card-body">
                <div v-if="recentActivity.length === 0" class="text-center text-muted py-3">
                  No recent activity
                </div>
                <div v-else class="divide-y">
                  <div v-for="activity in recentActivity" :key="activity.id" class="row py-2">
                    <div class="col-auto">
                      <span class="avatar avatar-sm bg-primary text-white">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="icon"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          stroke-width="2"
                          stroke="currentColor"
                          fill="none"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12,6 12,12 16,14" />
                        </svg>
                      </span>
                    </div>
                    <div class="col">
                      <div class="text-truncate">
                        {{ activity.description }}
                      </div>
                      <div class="text-muted small">{{ formatDateTime(activity.created_at) }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions Card -->
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Actions</h3>
              </div>
              <div class="card-body">
                <div class="btn-list">
                  <router-link :to="`/employees/${employeeId}/edit`" class="btn btn-primary">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                      <path
                        d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"
                      />
                      <path d="M16 5l3 3" />
                    </svg>
                    Edit Employee
                  </router-link>

                  <button
                    class="btn"
                    :class="employee.is_active ? 'btn-warning' : 'btn-success'"
                    @click="toggleStatus"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path v-if="employee.is_active" d="M9 12h6" />
                      <path v-else d="M9 12l2 2 4-4" />
                    </svg>
                    {{ employee.is_active ? 'Deactivate' : 'Activate' }}
                  </button>

                  <button class="btn btn-outline-danger" @click="deleteEmployee">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M4 7l16 0" />
                      <path d="M10 11l0 6" />
                      <path d="M14 11l0 6" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                    Delete Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeTypes } from '@/composables/useEmployeeTypes'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// Get employee ID from route params
const employeeId = computed(() => route.params.id)

// Employee Types Composable
const {
  EMPLOYEE_TYPES,
  getEmployeeTypeConfig,
  getEmployeeTypeLabel,
  getEmployeeTypeColor,
  isSalaryBased: isSalaryBasedType,
  isHourlyPayment,
  requiresFixedSchedule: requiresFixedScheduleType,
  allowsOvertime: allowsOvertimeType,
  getAllowances
} = useEmployeeTypes()

// State
const loading = ref(false)
const employee = ref(null)
const recentActivity = ref([])

// Computed properties
const isTeacher = computed(() => {
  if (!employee.value) return false
  return (
    employee.value.employee_type === EMPLOYEE_TYPES.GURU_TETAP ||
    employee.value.employee_type === EMPLOYEE_TYPES.GURU_HONORER
  )
})

const isStaff = computed(() => {
  if (!employee.value) return false
  return (
    employee.value.employee_type === EMPLOYEE_TYPES.TENAGA_KEPENDIDIKAN ||
    employee.value.employee_type === EMPLOYEE_TYPES.TENAGA_HONORER
  )
})

const isSalaryBased = computed(() => {
  return employee.value ? isSalaryBasedType(employee.value.employee_type) : false
})

const isHourlyBased = computed(() => {
  return employee.value ? isHourlyPayment(employee.value.employee_type) : false
})

const requiresFixedSchedule = computed(() => {
  return employee.value ? requiresFixedScheduleType(employee.value.employee_type) : true
})

const allowsOvertime = computed(() => {
  return employee.value ? allowsOvertimeType(employee.value.employee_type) : false
})

const allowances = computed(() => {
  return employee.value ? getAllowances(employee.value.employee_type) : []
})

// Methods
const loadEmployee = async () => {
  loading.value = true

  try {
    // TODO: Replace with actual API call
    // For now, generate dummy data based on ID
    await new Promise(resolve => setTimeout(resolve, 1000))

    const dummyEmployee = {
      id: parseInt(employeeId.value),
      name: 'John Doe',
      employee_id: `EMP${String(employeeId.value).padStart(3, '0')}`,
      email: `employee${employeeId.value}@school.edu`,
      phone: `+62812345${String(employeeId.value).padStart(4, '0')}`,
      employee_type: 'guru_tetap',
      department: 'Mathematics',
      subject: 'Mathematics',
      grade_level: 'Grade 10',
      hire_date: '2023-01-15',
      is_active: true,
      address: 'Jl. Contoh No. 123, Jakarta',
      monthly_salary: 5000000,
      hourly_rate: null,
      avatar_url: null
    }

    employee.value = dummyEmployee

    // Load recent activity
    recentActivity.value = [
      {
        id: 1,
        description: 'Clock in at 08:00 AM',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      },
      {
        id: 2,
        description: 'Updated profile information',
        created_at: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        id: 3,
        description: 'Submitted monthly report',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      }
    ]

    // Actual API call would be:
    // const response = await axios.get(`/api/v1/employees/${employeeId.value}`)
    // if (response.data.success) {
    //   employee.value = response.data.data
    // }
  } catch (error) {
    console.error('Error loading employee:', error)
    employee.value = null
  } finally {
    loading.value = false
  }
}

const toggleStatus = async () => {
  try {
    const newStatus = !employee.value.is_active
    const action = newStatus ? 'activate' : 'deactivate'

    if (confirm(`Are you sure you want to ${action} ${employee.value.name}?`)) {
      // TODO: Replace with actual API call
      console.log(`${action} employee:`, employee.value.id)

      // Update local state
      employee.value.is_active = newStatus

      alert(`Employee ${action}d successfully!`)

      // Actual API call would be:
      // await axios.patch(`/api/v1/employees/${employeeId.value}/status`, {
      //   is_active: newStatus
      // })
    }
  } catch (error) {
    console.error('Error updating employee status:', error)
    alert('Error updating employee status. Please try again.')
  }
}

const deleteEmployee = async () => {
  try {
    if (
      confirm(
        `Are you sure you want to delete ${employee.value.name}? This action cannot be undone.`
      )
    ) {
      // TODO: Replace with actual API call
      console.log('Delete employee:', employee.value.id)

      alert('Employee deleted successfully!')
      router.push('/employees')

      // Actual API call would be:
      // await axios.delete(`/api/v1/employees/${employeeId.value}`)
      // router.push('/employees')
    }
  } catch (error) {
    console.error('Error deleting employee:', error)
    alert('Error deleting employee. Please try again.')
  }
}

// Utility functions
const getInitials = name => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = date => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatDateTime = date => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatCurrency = amount => {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(amount)
}

const formatAllowance = allowance => {
  const allowanceMap = {
    transport: 'Transport',
    meal: 'Meal',
    teaching: 'Teaching',
    performance: 'Performance'
  }
  return allowanceMap[allowance] || allowance
}

// Load employee data on component mount
onMounted(() => {
  if (employeeId.value) {
    loadEmployee()
  }
})

// Watch for route changes
watch(
  () => route.params.id,
  newId => {
    if (newId) {
      loadEmployee()
    }
  }
)
</script>

<style scoped>
.avatar-xl {
  width: 5rem;
  height: 5rem;
  font-size: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #354052;
}

.empty {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-icon svg {
  width: 3rem;
  height: 3rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  margin-bottom: 1.5rem;
}

.btn-list .btn {
  margin-right: 0.5rem;
}

.btn-list .btn:last-child {
  margin-right: 0;
}

.divide-y > * + * {
  border-top: 1px solid #e6e7e9;
}

dl.row {
  margin-bottom: 0;
}

dl.row dt {
  font-weight: 600;
  color: #6c757d;
}

dl.row dd {
  margin-bottom: 0.5rem;
}

.gap-1 {
  gap: 0.25rem;
}

.list-inline-dots .list-inline-item:not(:last-child)::after {
  content: '·';
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  color: #6c757d;
}
</style>
