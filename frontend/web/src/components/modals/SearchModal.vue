<template>
  <!-- Exact Tabler.io Search Modal -->
  <div v-if="isVisible" class="modal modal-blur fade show" style="display: block;" tabindex="-1">
    <div class="modal-dialog modal-lg modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">
            <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="M21 21l-4.35-4.35"/>
            </svg>
            Search
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <div class="modal-body">
          <!-- Search Input -->
          <div class="mb-3">
            <div class="input-group input-group-flat">
              <input 
                type="search" 
                class="form-control form-control-lg" 
                placeholder="Search employees, attendance, schedules..."
                v-model="searchQuery"
                @input="performSearch"
                @keydown.enter="selectFirstResult"
                @keydown.arrow-down.prevent="navigateDown"
                @keydown.arrow-up.prevent="navigateUp"
                @keydown.escape="close"
                ref="searchInput"
                autocomplete="off"
              >
              <span class="input-group-text">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </span>
            </div>
          </div>

          <!-- Search Results -->
          <div v-if="searchQuery.length > 0" class="search-results">
            <!-- Loading State -->
            <div v-if="isSearching" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary me-2" role="status"></div>
              Searching...
            </div>

            <!-- Results -->
            <div v-else-if="hasResults" class="search-results-container">
              <!-- Employees -->
              <div v-if="results.employees.length > 0" class="search-category mb-4">
                <h6 class="text-muted mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-sm me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0"/>
                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85"/>
                  </svg>
                  Employees
                </h6>
                <div class="list-group list-group-flush">
                  <a 
                    v-for="(employee, index) in results.employees" 
                    :key="'employee-' + employee.id" 
                    href="#" 
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    :class="{ 'active': selectedIndex === getGlobalIndex('employees', index) }"
                    @click.prevent="navigateToEmployee(employee)"
                  >
                    <span class="avatar avatar-sm me-3" :style="employee.avatar ? `background-image: url(${employee.avatar})` : ''" :class="!employee.avatar ? 'bg-primary-lt' : ''">
                      {{ employee.avatar ? '' : getInitials(employee.name) }}
                    </span>
                    <div class="flex-fill">
                      <div class="font-weight-medium" v-html="highlightMatch(employee.name, searchQuery)"></div>
                      <div class="text-muted small">{{ employee.employee_id }} • {{ employee.department }}</div>
                    </div>
                    <div class="text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>

              <!-- Attendance Records -->
              <div v-if="results.attendance.length > 0" class="search-category mb-4">
                <h6 class="text-muted mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-sm me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M8 3v1a2 2 0 0 0 2 2h4a2 2 0 0 0 2 -2v-1"/>
                    <path d="M6 4h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2z"/>
                    <path d="M10 14l2 2l4 -4"/>
                  </svg>
                  Attendance
                </h6>
                <div class="list-group list-group-flush">
                  <a 
                    v-for="(record, index) in results.attendance" 
                    :key="'attendance-' + record.id" 
                    href="#" 
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    :class="{ 'active': selectedIndex === getGlobalIndex('attendance', index) }"
                    @click.prevent="navigateToAttendance(record)"
                  >
                    <span class="avatar avatar-sm me-3 bg-success-lt">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M9 12l2 2l4 -4"/>
                      </svg>
                    </span>
                    <div class="flex-fill">
                      <div class="font-weight-medium" v-html="highlightMatch(record.employee.name, searchQuery)"></div>
                      <div class="text-muted small">{{ formatDate(record.date) }} • {{ record.status }}</div>
                    </div>
                    <div class="text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>

              <!-- Schedules -->
              <div v-if="results.schedules.length > 0" class="search-category mb-4">
                <h6 class="text-muted mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-sm me-1" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <rect x="4" y="5" width="16" height="16" rx="2"/>
                    <line x1="16" y1="3" x2="16" y2="7"/>
                    <line x1="8" y1="3" x2="8" y2="7"/>
                    <line x1="4" y1="11" x2="20" y2="11"/>
                  </svg>
                  Schedules
                </h6>
                <div class="list-group list-group-flush">
                  <a 
                    v-for="(schedule, index) in results.schedules" 
                    :key="'schedule-' + schedule.id" 
                    href="#" 
                    class="list-group-item list-group-item-action d-flex align-items-center"
                    :class="{ 'active': selectedIndex === getGlobalIndex('schedules', index) }"
                    @click.prevent="navigateToSchedule(schedule)"
                  >
                    <span class="avatar avatar-sm me-3 bg-warning-lt">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="9"/>
                        <polyline points="12,7 12,12 15,15"/>
                      </svg>
                    </span>
                    <div class="flex-fill">
                      <div class="font-weight-medium" v-html="highlightMatch(schedule.name, searchQuery)"></div>
                      <div class="text-muted small">{{ schedule.employee.name }} • {{ schedule.department }}</div>
                    </div>
                    <div class="text-muted">
                      <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="9 18 15 12 9 6"/>
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            <!-- No Results -->
            <div v-else class="empty py-4">
              <div class="empty-icon">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="11" cy="11" r="8"/>
                  <path d="M21 21l-4.35-4.35"/>
                </svg>
              </div>
              <p class="empty-title">No results found</p>
              <p class="empty-subtitle text-muted">
                Try searching with different keywords
              </p>
            </div>
          </div>

          <!-- Search Tips -->
          <div v-else class="search-tips">
            <div class="text-muted small">
              <p class="mb-2"><strong>Search tips:</strong></p>
              <ul class="list-unstyled mb-0">
                <li>• Search by employee name or ID</li>
                <li>• Find attendance records by date or status</li>
                <li>• Look up schedules by name or department</li>
                <li>• Use <kbd>↑</kbd> <kbd>↓</kbd> to navigate, <kbd>Enter</kbd> to select</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal backdrop -->
  <div v-if="isVisible" class="modal-backdrop fade show" @click="close"></div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Props
const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  }
})

// Emits
const emit = defineEmits(['close'])

// State
const searchQuery = ref('')
const isSearching = ref(false)
const selectedIndex = ref(-1)
const searchInput = ref(null)

// Sample data for search
const mockData = {
  employees: [
    { id: 1, name: 'John Doe', employee_id: 'EMP001', department: 'Mathematics', avatar: null },
    { id: 2, name: 'Jane Smith', employee_id: 'EMP002', department: 'Science', avatar: null },
    { id: 3, name: 'Ahmad Rahman', employee_id: 'EMP003', department: 'Administration', avatar: null }
  ],
  attendance: [
    { id: 1, employee: { name: 'John Doe' }, date: '2024-01-15', status: 'Present' },
    { id: 2, employee: { name: 'Jane Smith' }, date: '2024-01-15', status: 'Late' }
  ],
  schedules: [
    { id: 1, name: 'Regular Teaching Schedule', employee: { name: 'John Doe' }, department: 'Mathematics' },
    { id: 2, name: 'Part-time Schedule', employee: { name: 'Jane Smith' }, department: 'Science' }
  ]
}

// Search results
const results = ref({
  employees: [],
  attendance: [],
  schedules: []
})

// Computed
const hasResults = computed(() => {
  return results.value.employees.length > 0 || 
         results.value.attendance.length > 0 || 
         results.value.schedules.length > 0
})

const totalResults = computed(() => {
  return results.value.employees.length + results.value.attendance.length + results.value.schedules.length
})

// Methods
const performSearch = async () => {
  if (searchQuery.value.length < 2) {
    results.value = { employees: [], attendance: [], schedules: [] }
    return
  }

  isSearching.value = true
  selectedIndex.value = -1

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300))

  const query = searchQuery.value.toLowerCase()

  // Search employees
  results.value.employees = mockData.employees.filter(emp =>
    emp.name.toLowerCase().includes(query) ||
    emp.employee_id.toLowerCase().includes(query) ||
    emp.department.toLowerCase().includes(query)
  ).slice(0, 5)

  // Search attendance
  results.value.attendance = mockData.attendance.filter(record =>
    record.employee.name.toLowerCase().includes(query) ||
    record.status.toLowerCase().includes(query)
  ).slice(0, 5)

  // Search schedules
  results.value.schedules = mockData.schedules.filter(schedule =>
    schedule.name.toLowerCase().includes(query) ||
    schedule.employee.name.toLowerCase().includes(query) ||
    schedule.department.toLowerCase().includes(query)
  ).slice(0, 5)

  isSearching.value = false
}

const highlightMatch = (text, query) => {
  if (!query) return text
  const regex = new RegExp(`(${query})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getGlobalIndex = (category, index) => {
  let globalIndex = 0
  if (category === 'employees') return globalIndex + index
  globalIndex += results.value.employees.length
  if (category === 'attendance') return globalIndex + index
  globalIndex += results.value.attendance.length
  if (category === 'schedules') return globalIndex + index
  return -1
}

const navigateDown = () => {
  if (selectedIndex.value < totalResults.value - 1) {
    selectedIndex.value++
  }
}

const navigateUp = () => {
  if (selectedIndex.value > 0) {
    selectedIndex.value--
  }
}

const selectFirstResult = () => {
  if (hasResults.value) {
    selectedIndex.value = 0
    executeSelection()
  }
}

const executeSelection = () => {
  if (selectedIndex.value === -1) return

  let currentIndex = 0
  
  // Check employees
  if (selectedIndex.value < results.value.employees.length) {
    const employee = results.value.employees[selectedIndex.value]
    navigateToEmployee(employee)
    return
  }
  currentIndex += results.value.employees.length

  // Check attendance
  if (selectedIndex.value < currentIndex + results.value.attendance.length) {
    const record = results.value.attendance[selectedIndex.value - currentIndex]
    navigateToAttendance(record)
    return
  }
  currentIndex += results.value.attendance.length

  // Check schedules
  if (selectedIndex.value < currentIndex + results.value.schedules.length) {
    const schedule = results.value.schedules[selectedIndex.value - currentIndex]
    navigateToSchedule(schedule)
    return
  }
}

const navigateToEmployee = (employee) => {
  close()
  router.push(`/employees/${employee.id}`)
}

const navigateToAttendance = (record) => {
  close()
  router.push('/attendance')
}

const navigateToSchedule = (schedule) => {
  close()
  router.push(`/schedules/${schedule.id}`)
}

const close = () => {
  searchQuery.value = ''
  results.value = { employees: [], attendance: [], schedules: [] }
  selectedIndex.value = -1
  emit('close')
}

// Focus search input when modal opens
const focusInput = async () => {
  if (props.isVisible) {
    await nextTick()
    searchInput.value?.focus()
  }
}

// Keyboard event handler
const handleKeydown = (e) => {
  if (!props.isVisible) return
  
  if (e.key === 'Escape') {
    close()
  } else if (e.ctrlKey && e.key === 'k') {
    e.preventDefault()
    focusInput()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  focusInput()
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Watch for visibility changes
import { watch } from 'vue'
watch(() => props.isVisible, focusInput)
</script>

<style scoped>
/* Exact Tabler.io Modal Styling */
.modal-backdrop {
  background-color: rgba(var(--tblr-body-color-rgb), 0.32);
}

.search-results-container {
  max-height: 400px;
  overflow-y: auto;
}

.search-category:last-child {
  margin-bottom: 0 !important;
}

.list-group-item {
  border: none;
  border-radius: var(--tblr-border-radius);
  margin-bottom: 0.25rem;
}

.list-group-item:hover,
.list-group-item.active {
  background-color: rgba(var(--tblr-primary-rgb), 0.08);
  border-color: transparent;
}

.list-group-item.active {
  color: var(--tblr-primary);
  background-color: rgba(var(--tblr-primary-rgb), 0.12);
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

.font-weight-medium {
  font-weight: 500;
}

.empty {
  text-align: center;
  padding: 2rem 1rem;
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-icon svg {
  width: 2rem;
  height: 2rem;
  color: var(--tblr-text-muted);
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  margin-bottom: 0;
}

.search-tips {
  padding: 1rem;
  background-color: var(--tblr-bg-surface-secondary);
  border-radius: var(--tblr-border-radius);
}

/* Highlight matches */
:deep(mark) {
  background-color: rgba(var(--tblr-primary-rgb), 0.2);
  color: var(--tblr-primary);
  padding: 0;
}

/* Keyboard shortcuts */
kbd {
  padding: 0.125rem 0.25rem;
  font-size: 0.75rem;
  color: var(--tblr-body-color);
  background-color: var(--tblr-bg-surface-secondary);
  border-radius: 0.25rem;
  border: 1px solid var(--tblr-border-color);
}

/* Scrollbar */
.search-results-container::-webkit-scrollbar {
  width: 6px;
}

.search-results-container::-webkit-scrollbar-track {
  background: var(--tblr-bg-surface);
}

.search-results-container::-webkit-scrollbar-thumb {
  background: var(--tblr-border-color);
  border-radius: 3px;
}

.search-results-container::-webkit-scrollbar-thumb:hover {
  background: var(--tblr-text-muted);
}
</style>