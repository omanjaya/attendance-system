<template>
  <div class="employee-table-wrapper">
    <DataTable
      :data="employees"
      :columns="tableColumns"
      :loading="loading"
      :server-side="true"
      :total="pagination.total"
      title="Employee Management"
      description="Manage employee records, view details, and perform bulk operations"
      :searchable="true"
      :exportable="true"
      :selectable="hasPermission('employees.bulk_update')"
      :actions-column="tableActions"
      @search="handleSearch"
      @sort="handleSort"
      @page-change="handlePageChange"
      @page-size-change="handlePageSizeChange"
      @select="handleSelect"
      @select-all="handleSelectAll"
      @action="handleAction"
      @export="handleExport"
      @refresh="refreshData"
    >
      <!-- Custom header actions -->
      <template #actions>
        <RoleGuard permissions="employees.create">
          <button class="btn btn-primary btn-sm" @click="showCreateModal = true">
            <TablerIcon name="plus" size="sm" class="me-1" />
            Add Employee
          </button>
        </RoleGuard>

        <div v-if="selectedEmployees.length > 0" class="dropdown">
          <button
            class="btn btn-outline-secondary btn-sm dropdown-toggle"
            type="button"
            data-bs-toggle="dropdown"
          >
            <TablerIcon name="settings" size="sm" class="me-1" />
            Bulk Actions ({{ selectedEmployees.length }})
          </button>
          <ul class="dropdown-menu">
            <li>
              <a class="dropdown-item" href="#" @click.prevent="handleBulkAction('activate')">
                <TablerIcon name="check" size="sm" class="me-2" />
                Activate Selected
              </a>
            </li>
            <li>
              <a class="dropdown-item" href="#" @click.prevent="handleBulkAction('deactivate')">
                <TablerIcon name="x" size="sm" class="me-2" />
                Deactivate Selected
              </a>
            </li>
            <li><hr class="dropdown-divider" /></li>
            <li>
              <a
                class="dropdown-item text-danger"
                href="#"
                @click.prevent="handleBulkAction('delete')"
              >
                <TablerIcon name="trash" size="sm" class="me-2" />
                Delete Selected
              </a>
            </li>
          </ul>
        </div>
      </template>

      <!-- Custom cell renderers -->
      <template #cell-avatar="{ item }">
        <div class="d-flex align-items-center">
          <span
            class="avatar avatar-sm me-3"
            :style="item.photo ? `background-image: url(${item.photo})` : ''"
          >
            {{ !item.photo ? getInitials(item.name) : '' }}
          </span>
          <div>
            <div class="font-weight-medium">{{ item.name }}</div>
            <div class="text-muted small">{{ item.employee_id }}</div>
          </div>
        </div>
      </template>

      <template #cell-status="{ item }">
        <span class="badge" :class="item.is_active ? 'bg-success' : 'bg-secondary'">
          {{ item.is_active ? 'Active' : 'Inactive' }}
        </span>
      </template>

      <template #cell-employee_type="{ item }">
        <span class="badge bg-primary-lt">
          {{ formatEmployeeType(item.employee_type) }}
        </span>
      </template>

      <template #cell-hire_date="{ item }">
        <div>
          <div>{{ formatDate(item.hire_date) }}</div>
          <div class="text-muted small">
            {{ getEmploymentDuration(item.hire_date) }}
          </div>
        </div>
      </template>

      <template #cell-contact="{ item }">
        <div>
          <div class="small">
            <TablerIcon name="mail" size="xs" class="me-1" />
            {{ item.email }}
          </div>
          <div v-if="item.phone" class="text-muted small">
            <TablerIcon name="phone" size="xs" class="me-1" />
            {{ item.phone }}
          </div>
        </div>
      </template>

      <template #cell-department="{ item }">
        <div>
          <div>{{ item.department?.name || 'N/A' }}</div>
          <div v-if="item.position" class="text-muted small">
            {{ item.position }}
          </div>
        </div>
      </template>

      <!-- Empty state -->
      <template #empty-actions>
        <RoleGuard permissions="employees.create">
          <button class="btn btn-primary" @click="showCreateModal = true">
            <TablerIcon name="plus" class="me-2" />
            Add First Employee
          </button>
        </RoleGuard>
      </template>
    </DataTable>

    <!-- Employee Form Modal -->
    <Modal v-model:visible="showCreateModal" title="Add New Employee" size="lg" scrollable>
      <EmployeeForm @success="handleEmployeeCreated" @cancel="showCreateModal = false" />
    </Modal>

    <Modal v-model:visible="showEditModal" title="Edit Employee" size="lg" scrollable>
      <EmployeeForm
        :employee="selectedEmployee"
        mode="edit"
        @success="handleEmployeeUpdated"
        @cancel="showEditModal = false"
      />
    </Modal>

    <!-- Employee Details Modal -->
    <Modal v-model:visible="showDetailsModal" title="Employee Details" size="xl">
      <EmployeeCard
        v-if="selectedEmployee"
        :employee="selectedEmployee"
        :detailed="true"
        @edit="handleEdit"
        @close="showDetailsModal = false"
      />
    </Modal>

    <!-- Bulk Action Confirmation -->
    <Modal
      v-model:visible="showBulkConfirmModal"
      :title="bulkAction.title"
      :variant="bulkAction.variant"
      show-default-actions
      :loading="bulkActionLoading"
      @confirm="confirmBulkAction"
      @cancel="showBulkConfirmModal = false"
    >
      <p>{{ bulkAction.message }}</p>
      <div v-if="selectedEmployees.length > 0" class="mt-3">
        <strong>Selected employees:</strong>
        <ul class="list-unstyled mt-2">
          <li
            v-for="employee in selectedEmployeesList"
            :key="employee.id"
            class="d-flex align-items-center mb-1"
          >
            <span
              class="avatar avatar-xs me-2"
              :style="employee.photo ? `background-image: url(${employee.photo})` : ''"
            >
              {{ !employee.photo ? getInitials(employee.name) : '' }}
            </span>
            <span>{{ employee.name }} ({{ employee.employee_id }})</span>
          </li>
        </ul>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useEmployeeStore } from '@/stores/modules/employee'
import { useAuth } from '@/composables/useAuth'
import { useNotifications } from '@/composables/useNotifications'
import { formatters } from '@/utils/formatters'
import DataTable from '@/components/common/DataTable.vue'
import Modal from '@/components/common/Modal.vue'
import RoleGuard from '@/components/common/RoleGuard.vue'
import TablerIcon from '@/components/common/TablerIcon.vue'
import EmployeeForm from './EmployeeForm.vue'
import EmployeeCard from './EmployeeCard.vue'

// Composables
const employeeStore = useEmployeeStore()
const { hasPermission } = useAuth()
const { showNotification } = useNotifications()

// State
const showCreateModal = ref(false)
const showEditModal = ref(false)
const showDetailsModal = ref(false)
const showBulkConfirmModal = ref(false)
const selectedEmployee = ref(null)
const selectedEmployees = ref([])
const bulkActionLoading = ref(false)
const searchQuery = ref('')
const currentSort = ref({ column: '', direction: 'asc' })

// Computed
const employees = computed(() => employeeStore.filtered)
const loading = computed(() => employeeStore.loading)
const pagination = computed(() => employeeStore.pagination)

const selectedEmployeesList = computed(() => {
  return selectedEmployees.value.map(id => employeeStore.byId(id)).filter(Boolean)
})

// Table configuration
const tableColumns = computed(() => [
  {
    key: 'avatar',
    label: 'Employee',
    sortable: false,
    width: '250px'
  },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    width: '100px',
    align: 'center'
  },
  {
    key: 'employee_type',
    label: 'Type',
    sortable: true,
    width: '120px'
  },
  {
    key: 'department',
    label: 'Department',
    sortable: true,
    width: '180px'
  },
  {
    key: 'hire_date',
    label: 'Hire Date',
    sortable: true,
    width: '140px'
  },
  {
    key: 'contact',
    label: 'Contact',
    sortable: false,
    width: '200px'
  }
])

const tableActions = computed(() => {
  const actions = []

  if (hasPermission('employees.view')) {
    actions.push({
      key: 'view',
      icon: 'eye',
      title: 'View Details',
      class: 'btn-outline-primary'
    })
  }

  if (hasPermission('employees.edit')) {
    actions.push({
      key: 'edit',
      icon: 'edit',
      title: 'Edit Employee',
      class: 'btn-outline-secondary'
    })
  }

  if (hasPermission('employees.delete')) {
    actions.push({
      key: 'delete',
      icon: 'trash',
      title: 'Delete Employee',
      class: 'btn-outline-danger'
    })
  }

  return actions
})

const bulkAction = ref({
  type: '',
  title: '',
  message: '',
  variant: 'warning'
})

// Methods
const refreshData = async () => {
  try {
    await employeeStore.fetchAll({
      page: pagination.value.page,
      per_page: pagination.value.perPage,
      search: searchQuery.value,
      sort_by: currentSort.value.column,
      sort_direction: currentSort.value.direction
    })
  } catch (error) {
    console.error('Failed to fetch employees:', error)
    showNotification({
      type: 'error',
      title: 'Error',
      message: 'Failed to load employees'
    })
  }
}

const handleSearch = query => {
  searchQuery.value = query
  pagination.value.page = 1
  refreshData()
}

const handleSort = ({ column, direction }) => {
  currentSort.value = { column, direction }
  refreshData()
}

const handlePageChange = page => {
  pagination.value.page = page
  refreshData()
}

const handlePageSizeChange = pageSize => {
  pagination.value.perPage = pageSize
  pagination.value.page = 1
  refreshData()
}

const handleSelect = ({ selectedItems }) => {
  selectedEmployees.value = selectedItems
}

const handleSelectAll = ({ selectedItems }) => {
  selectedEmployees.value = selectedItems
}

const handleAction = ({ action, item }) => {
  selectedEmployee.value = item

  switch (action) {
  case 'view':
    showDetailsModal.value = true
    break
  case 'edit':
    showEditModal.value = true
    break
  case 'delete':
    handleDelete(item)
    break
  }
}

const handleEdit = employee => {
  selectedEmployee.value = employee
  showDetailsModal.value = false
  showEditModal.value = true
}

const handleDelete = async employee => {
  if (!confirm(`Are you sure you want to delete ${employee.name}?`)) {
    return
  }

  try {
    await employeeStore.remove(employee.id)
    showNotification({
      type: 'success',
      title: 'Employee Deleted',
      message: `${employee.name} has been deleted successfully`
    })
    refreshData()
  } catch (error) {
    console.error('Failed to delete employee:', error)
    showNotification({
      type: 'error',
      title: 'Delete Failed',
      message: 'Failed to delete employee'
    })
  }
}

const handleBulkAction = actionType => {
  if (selectedEmployees.value.length === 0) return

  const count = selectedEmployees.value.length

  switch (actionType) {
  case 'activate':
    bulkAction.value = {
      type: 'activate',
      title: 'Activate Employees',
      message: `Are you sure you want to activate ${count} employee(s)?`,
      variant: 'success'
    }
    break
  case 'deactivate':
    bulkAction.value = {
      type: 'deactivate',
      title: 'Deactivate Employees',
      message: `Are you sure you want to deactivate ${count} employee(s)?`,
      variant: 'warning'
    }
    break
  case 'delete':
    bulkAction.value = {
      type: 'delete',
      title: 'Delete Employees',
      message: `Are you sure you want to delete ${count} employee(s)? This action cannot be undone.`,
      variant: 'danger'
    }
    break
  }

  showBulkConfirmModal.value = true
}

const confirmBulkAction = async () => {
  bulkActionLoading.value = true

  try {
    const ids = selectedEmployees.value
    const actionType = bulkAction.value.type

    switch (actionType) {
    case 'activate':
      await employeeStore.bulkUpdate(ids, { is_active: true })
      showNotification({
        type: 'success',
        title: 'Employees Activated',
        message: `${ids.length} employee(s) have been activated`
      })
      break
    case 'deactivate':
      await employeeStore.bulkUpdate(ids, { is_active: false })
      showNotification({
        type: 'success',
        title: 'Employees Deactivated',
        message: `${ids.length} employee(s) have been deactivated`
      })
      break
    case 'delete':
      await employeeStore.bulkDelete(ids)
      showNotification({
        type: 'success',
        title: 'Employees Deleted',
        message: `${ids.length} employee(s) have been deleted`
      })
      break
    }

    selectedEmployees.value = []
    showBulkConfirmModal.value = false
    refreshData()
  } catch (error) {
    console.error('Bulk action failed:', error)
    showNotification({
      type: 'error',
      title: 'Action Failed',
      message: 'Failed to perform bulk action'
    })
  } finally {
    bulkActionLoading.value = false
  }
}

const handleExport = ({ format }) => {
  try {
    employeeStore.export(format, {
      search: searchQuery.value,
      sort_by: currentSort.value.column,
      sort_direction: currentSort.value.direction
    })

    showNotification({
      type: 'success',
      title: 'Export Started',
      message: 'Employee data export has been initiated'
    })
  } catch (error) {
    console.error('Export failed:', error)
    showNotification({
      type: 'error',
      title: 'Export Failed',
      message: 'Failed to export employee data'
    })
  }
}

const handleEmployeeCreated = employee => {
  showCreateModal.value = false
  showNotification({
    type: 'success',
    title: 'Employee Created',
    message: `${employee.name} has been added successfully`
  })
  refreshData()
}

const handleEmployeeUpdated = employee => {
  showEditModal.value = false
  showNotification({
    type: 'success',
    title: 'Employee Updated',
    message: `${employee.name} has been updated successfully`
  })
  refreshData()
}

// Utility functions
const getInitials = name => {
  return (
    name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'NA'
  )
}

const formatEmployeeType = type => {
  return type?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'N/A'
}

const formatDate = date => {
  return formatters.date(date)
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

// Lifecycle
onMounted(() => {
  refreshData()
})

// Watchers
watch(
  () => employeeStore.error,
  error => {
    if (error) {
      showNotification({
        type: 'error',
        title: 'Error',
        message: error
      })
    }
  }
)
</script>

<style scoped>
.employee-table-wrapper {
  background: var(--tblr-bg-surface);
}

.avatar {
  background-color: var(--tblr-primary);
  color: white;
  font-weight: 500;
}

.badge {
  font-size: 0.75rem;
}

.dropdown-item {
  cursor: pointer;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .btn-list .btn {
    margin-bottom: 0.5rem;
  }
}
</style>
