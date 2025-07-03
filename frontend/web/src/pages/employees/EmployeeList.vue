<template>
  <!-- Exact Tabler.io Employee Table -->
  <div class="row row-deck row-cards">
    <!-- Employee Type Filter Cards -->
    <div class="col-12">
      <div class="row row-cards">
        <div v-for="typeOption in employeeTypeOptions" :key="typeOption.value" class="col-sm-6 col-lg-3">
          <div
            class="card card-sm cursor-pointer"
            :class="{ 'card-active': selectedType === typeOption.value }"
            @click="filterByType(typeOption.value)"
          >
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="avatar" :class="`bg-${typeOption.color} text-white`">
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
                      <circle cx="9" cy="7" r="4" />
                      <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ getTypeCount(typeOption.value) }}</div>
                  <div class="text-muted">{{ typeOption.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Employee Table -->
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Employees</h3>
          <div class="card-actions">
            <div class="d-flex">
              <input
                v-model="searchQuery"
                type="search"
                class="form-control d-inline-block w-9 me-3"
                placeholder="Search employees..."
              />
              <router-link to="/employees/create" class="btn btn-primary">
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add new
              </router-link>
            </div>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="card-body">
          <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
            <div class="mt-2">Loading employees...</div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredEmployees.length === 0" class="card-body">
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
                <circle cx="9" cy="7" r="4" />
                <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
              </svg>
            </div>
            <p class="empty-title">No employees found</p>
            <p class="empty-subtitle text-muted">
              Try adjusting your search or filter to find what you're looking for.
            </p>
            <div class="empty-action">
              <router-link to="/employees/create" class="btn btn-primary">
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add your first employee
              </router-link>
            </div>
          </div>
        </div>

        <!-- Employee Table -->
        <div v-else class="table-responsive">
          <table class="table table-vcenter card-table">
            <thead>
              <tr>
                <th class="w-1">
                  <input
                    v-model="selectAll"
                    class="form-check-input m-0 align-middle"
                    type="checkbox"
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="w-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-sm text-dark"
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
                    <circle cx="12" cy="7" r="4" />
                    <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  </svg>
                </th>
                <th>Name</th>
                <th>Type</th>
                <th>Department</th>
                <th>Contact</th>
                <th>Status</th>
                <th>Last Activity</th>
                <th class="w-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in filteredEmployees" :key="employee.id">
                <td>
                  <input
                    v-model="selectedEmployees"
                    class="form-check-input m-0 align-middle"
                    type="checkbox"
                    :value="employee.id"
                  />
                </td>
                <td>
                  <span
                    class="avatar avatar-sm"
                    :style="employee.photo ? `background-image: url(${employee.photo})` : ''"
                    :class="!employee.photo ? `bg-${getEmployeeTypeColor(employee.type)}-lt` : ''"
                  >
                    {{ employee.photo ? '' : getInitials(employee.name) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex py-1 align-items-center">
                    <div class="flex-fill">
                      <div class="font-weight-medium">{{ employee.name }}</div>
                      <div class="text-muted">{{ employee.employee_id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge" :class="`bg-${getEmployeeTypeColor(employee.type)}`">
                    {{ getEmployeeTypeLabel(employee.type) }}
                  </span>
                </td>
                <td class="text-muted">
                  {{ employee.department || '-' }}
                </td>
                <td>
                  <div>{{ employee.email }}</div>
                  <div class="text-muted small">{{ employee.phone || '-' }}</div>
                </td>
                <td>
                  <span class="badge" :class="employee.status === 'active' ? 'bg-success' : 'bg-danger'">
                    {{ employee.status === 'active' ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="text-muted">
                  {{ formatLastActivity(employee.updated_at) }}
                </td>
                <td>
                  <div class="btn-list flex-nowrap">
                    <router-link :to="`/employees/${employee.id}`" class="btn btn-white btn-sm"> View </router-link>
                    <div class="dropdown">
                      <button class="btn btn-white btn-sm dropdown-toggle align-text-top" data-bs-toggle="dropdown">
                        Actions
                      </button>
                      <div class="dropdown-menu dropdown-menu-end">
                        <router-link class="dropdown-item" :to="`/employees/${employee.id}`">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon dropdown-item-icon"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            stroke-width="2"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          >
                            <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                            <path
                              d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
                            />
                          </svg>
                          View details
                        </router-link>
                        <router-link class="dropdown-item" :to="`/employees/${employee.id}/edit`">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon dropdown-item-icon"
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
                            <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                            <path d="M16 5l3 3" />
                          </svg>
                          Edit
                        </router-link>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item text-danger" @click.prevent="deleteEmployee(employee)">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon dropdown-item-icon"
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
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="10" y1="11" x2="10" y2="17" />
                            <line x1="14" y1="11" x2="14" y2="17" />
                            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                          </svg>
                          Delete
                        </a>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Table Footer with Pagination -->
        <div v-if="filteredEmployees.length > 0" class="card-footer d-flex align-items-center">
          <p class="m-0 text-muted">
            Showing <span>{{ (currentPage - 1) * perPage + 1 }}</span> to
            <span>{{ Math.min(currentPage * perPage, filteredEmployees.length) }}</span> of
            <span>{{ filteredEmployees.length }}</span> entries
          </p>
          <ul class="pagination m-0 ms-auto">
            <li class="page-item" :class="{ disabled: currentPage === 1 }">
              <a class="page-link" href="#" @click.prevent="currentPage = Math.max(1, currentPage - 1)">
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
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                prev
              </a>
            </li>
            <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
              <a class="page-link" href="#" @click.prevent="currentPage = page">{{ page }}</a>
            </li>
            <li class="page-item" :class="{ disabled: currentPage === totalPages }">
              <a class="page-link" href="#" @click.prevent="currentPage = Math.min(totalPages, currentPage + 1)">
                next
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
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { employeeService } from '@/services/employeeService'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Employee type configuration
const employeeTypeOptions = [
  { value: '', label: 'All Types', color: 'secondary' },
  { value: 'permanent_teacher', label: 'Permanent Teachers', color: 'success' },
  { value: 'honorary_teacher', label: 'Honorary Teachers', color: 'warning' },
  { value: 'permanent_staff', label: 'Permanent Staff', color: 'primary' },
  { value: 'honorary_staff', label: 'Honorary Staff', color: 'info' }
]

// State
const loading = ref(false)
const searchQuery = ref('')
const selectedType = ref('')
const selectedEmployees = ref([])
const selectAll = ref(false)
const currentPage = ref(1)
const perPage = ref(10)
const employees = ref([])
const error = ref('')
const statistics = ref(null)

// Computed properties
const filteredEmployees = computed(() => {
  let filtered = employees.value

  // Filter by type
  if (selectedType.value) {
    filtered = filtered.filter(emp => emp.employee_type === selectedType.value)
  }

  // Filter by search query
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      emp =>
        emp.name.toLowerCase().includes(query) ||
        emp.employee_id.toLowerCase().includes(query) ||
        emp.email.toLowerCase().includes(query) ||
        emp.department?.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredEmployees.value.length / perPage.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// Methods
const fetchEmployees = async () => {
  try {
    loading.value = true
    error.value = ''

    const params = {
      page: currentPage.value,
      per_page: perPage.value,
      search: searchQuery.value,
      type: selectedType.value,
      with: ['user'] // Include user relationship
    }

    const response = await employeeService.getAll(params)
    if (response.success) {
      employees.value = response.data.data || response.data
      // Handle pagination if available
      if (response.data.meta) {
        currentPage.value = response.data.meta.current_page
      }
    } else {
      error.value = response.message || 'Failed to fetch employees'
    }
  } catch (err) {
    console.error('Error fetching employees:', err)
    error.value = 'Failed to fetch employees. Please try again.'
  } finally {
    loading.value = false
  }
}

const fetchStatistics = async () => {
  try {
    const response = await employeeService.getStatistics()
    if (response.success) {
      statistics.value = response.data
    }
  } catch (err) {
    console.error('Error fetching statistics:', err)
  }
}

const filterByType = type => {
  selectedType.value = type
  currentPage.value = 1
  fetchEmployees()
}

const getTypeCount = type => {
  if (!statistics.value) {
    // Fallback to local count
    if (!type) return employees.value.length
    return employees.value.filter(emp => emp.type === type).length
  }

  // Use statistics from backend
  if (!type) return statistics.value.total || 0
  return statistics.value[type] || 0
}

const getInitials = name => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const getEmployeeTypeLabel = type => {
  const typeOption = employeeTypeOptions.find(opt => opt.value === type)
  return typeOption ? typeOption.label : type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())
}

const getEmployeeTypeColor = type => {
  const typeOption = employeeTypeOptions.find(opt => opt.value === type)
  return typeOption ? typeOption.color : 'secondary'
}

const formatLastActivity = date => {
  if (!date) return 'Never'

  const now = new Date()
  const diff = now - new Date(date)
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `${minutes} min ago`
  } else if (hours < 24) {
    return `${hours} hours ago`
  } else {
    return `${days} days ago`
  }
}

const toggleSelectAll = () => {
  if (selectAll.value) {
    selectedEmployees.value = filteredEmployees.value.map(emp => emp.id)
  } else {
    selectedEmployees.value = []
  }
}

const deleteEmployee = async employee => {
  if (confirm(`Are you sure you want to delete ${employee.name}?`)) {
    try {
      loading.value = true
      const response = await employeeService.delete(employee.id)

      if (response.success) {
        // Remove from local array
        const index = employees.value.findIndex(emp => emp.id === employee.id)
        if (index > -1) {
          employees.value.splice(index, 1)
        }

        // Refresh statistics
        await fetchStatistics()

        // Show success message
        console.log('Employee deleted successfully')
      } else {
        error.value = response.message || 'Failed to delete employee'
      }
    } catch (err) {
      console.error('Error deleting employee:', err)
      error.value = 'Failed to delete employee. Please try again.'
    } finally {
      loading.value = false
    }
  }
}

// Watchers
watch(
  [searchQuery, currentPage],
  () => {
    fetchEmployees()
  },
  { deep: true }
)

// Debounce search
let searchTimeout = null
watch(searchQuery, () => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
    fetchEmployees()
  }, 300)
})

// Lifecycle
onMounted(async () => {
  await Promise.all([fetchEmployees(), fetchStatistics()])
})
</script>

<style scoped>
/* Exact Tabler.io Table Styling */
.card-table tbody tr:hover {
  background-color: rgba(var(--tblr-primary-rgb), 0.04);
}

.cursor-pointer {
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}

.cursor-pointer:hover {
  transform: translateY(-1px);
  box-shadow: 0 0.25rem 0.5rem rgba(var(--tblr-body-color-rgb), 0.075);
}

.card-active {
  border-color: var(--tblr-primary);
  background-color: rgba(var(--tblr-primary-rgb), 0.05);
}

.font-weight-medium {
  font-weight: 500;
}

.avatar {
  width: 2rem;
  height: 2rem;
  font-size: 0.75rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: white;
  border-radius: 50%;
}

.empty {
  padding: 3rem 1rem;
  text-align: center;
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-icon svg {
  width: 3rem;
  height: 3rem;
  color: var(--tblr-text-muted);
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  margin-bottom: 1.5rem;
}

.dropdown-item-icon {
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
}

/* Badge light variants */
.bg-primary-lt {
  background-color: rgba(var(--tblr-primary-rgb), 0.1) !important;
  color: var(--tblr-primary) !important;
}
.bg-success-lt {
  background-color: rgba(var(--tblr-success-rgb), 0.1) !important;
  color: var(--tblr-success) !important;
}
.bg-warning-lt {
  background-color: rgba(var(--tblr-warning-rgb), 0.1) !important;
  color: var(--tblr-warning) !important;
}
.bg-info-lt {
  background-color: rgba(var(--tblr-info-rgb), 0.1) !important;
  color: var(--tblr-info) !important;
}
.bg-secondary-lt {
  background-color: rgba(var(--tblr-secondary-rgb), 0.1) !important;
  color: var(--tblr-secondary) !important;
}

/* Responsive table */
@media (max-width: 768px) {
  .table-responsive table {
    font-size: 0.875rem;
  }

  .btn-list .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>
