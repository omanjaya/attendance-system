<template>
  <!-- Exact Tabler.io Attendance Management ---->
  <div class="row row-deck row-cards">
    <!-- Attendance Summary Cards ---->
    <div class="col-12">
      <div class="row row-cards">
        <div class="col-sm-6 col-lg-3">
          <div class="card card-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-success text-white avatar">
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
                      <path d="M9 12l2 2l4 -4" />
                      <path
                        d="M21 12c-.1 0 -.1 0 -.1 0a1 1 0 0 1 -.9 -.9c0 0 0 -.1 0 -.1c.1 -2.2 .1 -4.4 0 -6.5c0 0 0 -.1 0 -.1a1 1 0 0 1 .9 -.9c0 0 .1 0 .1 0c2.2 .1 4.4 .1 6.5 0c0 0 .1 0 .1 0a1 1 0 0 1 .9 .9c0 0 0 .1 0 .1c-.1 2.2 -.1 4.4 0 6.5"
                      />
                      <path
                        d="M3 12c.1 0 .1 0 .1 0a1 1 0 0 1 .9 .9c0 0 0 .1 0 .1c-.1 2.2 -.1 4.4 0 6.5c0 0 0 .1 0 .1a1 1 0 0 1 -.9 .9c0 0 -.1 0 -.1 0c-2.2 -.1 -4.4 -.1 -6.5 0"
                      />
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ presentToday }}</div>
                  <div class="text-muted">Present Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card card-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-danger text-white avatar">
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ absentToday }}</div>
                  <div class="text-muted">Absent Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card card-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-warning text-white avatar">
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
                      <circle cx="12" cy="12" r="9" />
                      <polyline points="12,7 12,12 15,15" />
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ lateToday }}</div>
                  <div class="text-muted">Late Today</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card card-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-info text-white avatar">
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
                      <path d="M8 3v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-1" />
                      <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z" />
                      <path d="M10 14l2 2l4 -4" />
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ totalEmployees }}</div>
                  <div class="text-muted">Total Employees</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Table -->
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Daily Attendance</h3>
          <div class="card-actions">
            <div class="d-flex">
              <input v-model="selectedDate" type="date" class="form-control d-inline-block w-auto me-3" />
              <input
                v-model="searchQuery"
                type="search"
                class="form-control d-inline-block w-9 me-3"
                placeholder="Search attendance..."
              />
              <router-link to="/attendance/manage" class="btn btn-primary">
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
                  <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                  <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                </svg>
                Manage Attendance
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
            <div class="mt-2">Loading attendance data...</div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredAttendance.length === 0" class="card-body">
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
                <path d="M8 3v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-1" />
                <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z" />
              </svg>
            </div>
            <p class="empty-title">No attendance records found</p>
            <p class="empty-subtitle text-muted">
              No attendance data for {{ formatDate(selectedDate) }}. Try selecting a different date.
            </p>
          </div>
        </div>

        <!-- Attendance Table -->
        <div v-else class="table-responsive">
          <table class="table table-vcenter card-table">
            <thead>
              <tr>
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
                <th>Employee</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Working Hours</th>
                <th>Status</th>
                <th>Notes</th>
                <th class="w-1">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="record in filteredAttendance" :key="record.id">
                <td>
                  <span
                    class="avatar avatar-sm"
                    :style="record.employee.avatar ? `background-image: url(${record.employee.avatar})` : ''"
                    :class="!record.employee.avatar ? 'bg-primary-lt' : ''"
                  >
                    {{ record.employee.avatar ? '' : getInitials(record.employee.name) }}
                  </span>
                </td>
                <td>
                  <div class="d-flex py-1 align-items-center">
                    <div class="flex-fill">
                      <div class="font-weight-medium">{{ record.employee.name }}</div>
                      <div class="text-muted">{{ record.employee.employee_id }}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div class="text-nowrap">
                    <div v-if="record.check_in" class="text-green">
                      {{ formatTime(record.check_in) }}
                    </div>
                    <div v-else class="text-muted">Not checked in</div>
                  </div>
                </td>
                <td>
                  <div class="text-nowrap">
                    <div v-if="record.check_out" class="text-red">
                      {{ formatTime(record.check_out) }}
                    </div>
                    <div v-else class="text-muted">Not checked out</div>
                  </div>
                </td>
                <td>
                  <span class="text-muted">{{ calculateWorkingHours(record.check_in, record.check_out) }}</span>
                </td>
                <td>
                  <span class="badge" :class="getStatusBadgeClass(record.status)">
                    {{ record.status }}
                  </span>
                </td>
                <td class="text-muted">
                  {{ record.notes || '-' }}
                </td>
                <td>
                  <div class="btn-list flex-nowrap">
                    <div class="dropdown">
                      <button class="btn btn-white btn-sm dropdown-toggle align-text-top" data-bs-toggle="dropdown">
                        Actions
                      </button>
                      <div class="dropdown-menu dropdown-menu-end">
                        <a class="dropdown-item" href="#" @click.prevent="editAttendance(record)">
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
                        </a>
                        <a class="dropdown-item" href="#" @click.prevent="viewDetails(record)">
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
                          View Details
                        </a>
                        <div class="dropdown-divider"></div>
                        <a href="#" class="dropdown-item text-danger" @click.prevent="deleteRecord(record)">
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
        <div v-if="filteredAttendance.length > 0" class="card-footer d-flex align-items-center">
          <p class="m-0 text-muted">
            Showing <span>{{ (currentPage - 1) * perPage + 1 }}</span> to
            <span>{{ Math.min(currentPage * perPage, filteredAttendance.length) }}</span> of
            <span>{{ filteredAttendance.length }}</span> entries
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
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// State
const loading = ref(false)
const searchQuery = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const currentPage = ref(1)
const perPage = ref(10)

// Sample attendance data
const attendanceRecords = ref([
  {
    id: 1,
    employee: {
      id: 1,
      name: 'John Doe',
      employee_id: 'EMP001',
      avatar: null
    },
    date: new Date().toISOString().split('T')[0],
    check_in: '08:00:00',
    check_out: '17:00:00',
    status: 'Present',
    notes: 'On time'
  },
  {
    id: 2,
    employee: {
      id: 2,
      name: 'Jane Smith',
      employee_id: 'EMP002',
      avatar: null
    },
    date: new Date().toISOString().split('T')[0],
    check_in: '08:15:00',
    check_out: '17:30:00',
    status: 'Late',
    notes: 'Late arrival'
  },
  {
    id: 3,
    employee: {
      id: 3,
      name: 'Ahmad Rahman',
      employee_id: 'EMP003',
      avatar: null
    },
    date: new Date().toISOString().split('T')[0],
    check_in: '07:45:00',
    check_out: '16:45:00',
    status: 'Present',
    notes: 'Early arrival'
  },
  {
    id: 4,
    employee: {
      id: 4,
      name: 'Sarah Wilson',
      employee_id: 'EMP004',
      avatar: null
    },
    date: new Date().toISOString().split('T')[0],
    check_in: null,
    check_out: null,
    status: 'Absent',
    notes: 'Sick leave'
  }
])

// Computed properties
const filteredAttendance = computed(() => {
  let filtered = attendanceRecords.value.filter(record => record.date === selectedDate.value)

  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    filtered = filtered.filter(
      record =>
        record.employee.name.toLowerCase().includes(query) ||
        record.employee.employee_id.toLowerCase().includes(query) ||
        record.status.toLowerCase().includes(query)
    )
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredAttendance.value.length / perPage.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const presentToday = computed(() => {
  return filteredAttendance.value.filter(record => record.status === 'Present' || record.status === 'Late').length
})

const absentToday = computed(() => {
  return filteredAttendance.value.filter(record => record.status === 'Absent').length
})

const lateToday = computed(() => {
  return filteredAttendance.value.filter(record => record.status === 'Late').length
})

const totalEmployees = computed(() => {
  return filteredAttendance.value.length
})

// Methods
const getInitials = name => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatTime = time => {
  if (!time) return '-'
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

const formatDate = date => {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const calculateWorkingHours = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return '-'

  const start = new Date(`2000-01-01T${checkIn}`)
  const end = new Date(`2000-01-01T${checkOut}`)
  const diff = end - start
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  return `${hours}h ${minutes}m`
}

const getStatusBadgeClass = status => {
  switch (status.toLowerCase()) {
    case 'present':
      return 'bg-success'
    case 'late':
      return 'bg-warning'
    case 'absent':
      return 'bg-danger'
    case 'half day':
      return 'bg-info'
    default:
      return 'bg-secondary'
  }
}

const editAttendance = record => {
  // TODO: Implement edit attendance modal
  console.log('Edit attendance:', record)
}

const viewDetails = record => {
  // TODO: Implement view details modal
  console.log('View details:', record)
}

const deleteRecord = record => {
  if (confirm(`Are you sure you want to delete attendance record for ${record.employee.name}?`)) {
    const index = attendanceRecords.value.findIndex(r => r.id === record.id)
    if (index > -1) {
      attendanceRecords.value.splice(index, 1)
    }
  }
}

// Lifecycle
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

<style scoped>
/* Exact Tabler.io Table Styling */
.card-table tbody tr:hover {
  background-color: rgba(var(--tblr-primary-rgb), 0.04);
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

.text-green {
  color: var(--tblr-success) !important;
}

.text-red {
  color: var(--tblr-danger) !important;
}

.bg-primary-lt {
  background-color: rgba(var(--tblr-primary-rgb), 0.1) !important;
  color: var(--tblr-primary) !important;
}

/* Responsive adjustments */
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
