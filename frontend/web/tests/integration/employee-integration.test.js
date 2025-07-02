import { beforeEach, computed, describe, expect, it, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { useEmployeeStore } from '@/stores/employees'
import { useAuthStore } from '@/stores/auth'
import EmployeeTable from '@/components/employees/EmployeeTable.vue'
import EmployeeForm from '@/components/employees/EmployeeForm.vue'
import EmployeeCard from '@/components/employees/EmployeeCard.vue'
import axios from 'axios'

// Mock axios
vi.mock('axios')
const mockedAxios = vi.mocked(axios)

// Mock notifications
const mockShowNotification = vi.fn()
vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({
    showNotification: mockShowNotification
  })
}))

// Mock employee service
vi.mock('@/services/employeeService', () => ({
  employeeService: {
    getAll: vi.fn(),
    getById: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    bulkDelete: vi.fn(),
    export: vi.fn()
  }
}))

import { employeeService } from '@/services/employeeService'

const createTestRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/employees', name: 'employees', component: { template: '<div>Employees</div>' } },
      {
        path: '/employees/create',
        name: 'employee-create',
        component: { template: '<div>Create Employee</div>' }
      },
      {
        path: '/employees/:id/edit',
        name: 'employee-edit',
        component: { template: '<div>Edit Employee</div>' }
      }
    ]
  })
}

describe('Employee Integration Tests', () => {
  let employeeStore
  let authStore
  let router
  let pinia

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    employeeStore = useEmployeeStore()
    authStore = useAuthStore()
    router = createTestRouter()

    vi.clearAllMocks()
    mockShowNotification.mockClear()

    // Set up authenticated admin user
    authStore.user = {
      id: 1,
      name: 'Admin User',
      email: 'admin@example.com',
      roles: [{ name: 'admin' }],
      permissions: [
        { name: 'employees.view' },
        { name: 'employees.create' },
        { name: 'employees.edit' },
        { name: 'employees.delete' }
      ]
    }
    authStore.token = 'admin-token'
  })

  describe('Employee Data Loading Integration', () => {
    it('integrates employee fetching across store and table component', async () => {
      const mockEmployeesResponse = {
        data: [
          {
            id: 1,
            employee_id: 'EMP001',
            name: 'John Doe',
            email: 'john@company.com',
            position: 'Developer',
            department: 'IT',
            status: 'active',
            avatar: null
          },
          {
            id: 2,
            employee_id: 'EMP002',
            name: 'Jane Smith',
            email: 'jane@company.com',
            position: 'Designer',
            department: 'Design',
            status: 'active',
            avatar: null
          }
        ],
        meta: {
          total: 2,
          current_page: 1,
          last_page: 1,
          per_page: 10
        }
      }

      // Mock API response
      employeeService.getAll.mockResolvedValueOnce(mockEmployeesResponse)

      // Mount table component
      const wrapper = mount(EmployeeTable, {
        global: {
          plugins: [pinia, router],
          stubs: {
            DataTable: {
              template: `<div class="data-table">
                <div v-for="employee in employees" :key="employee.id" class="employee-row">
                  {{ employee.name }} - {{ employee.position }}
                </div>
              </div>`,
              props: ['data', 'columns', 'loading'],
              setup(props) {
                return { employees: props.data }
              }
            },
            TablerIcon: true,
            LoadingSpinner: true
          }
        }
      })

      // Trigger data loading
      await wrapper.vm.loadEmployees()
      await wrapper.vm.$nextTick()

      // Verify store was updated
      expect(employeeStore.employees).toHaveLength(2)
      expect(employeeStore.employees[0]).toEqual(mockEmployeesResponse.data[0])
      expect(employeeStore.total).toBe(2)

      // Verify component displays data
      expect(wrapper.text()).toContain('John Doe - Developer')
      expect(wrapper.text()).toContain('Jane Smith - Designer')
    })

    it('handles employee loading errors gracefully', async () => {
      const errorMessage = 'Failed to load employees'
      employeeService.getAll.mockRejectedValueOnce(new Error(errorMessage))

      const wrapper = mount(EmployeeTable, {
        global: {
          plugins: [pinia, router],
          stubs: {
            DataTable: true,
            TablerIcon: true,
            LoadingSpinner: true
          }
        }
      })

      await wrapper.vm.loadEmployees()
      await wrapper.vm.$nextTick()

      // Verify error handling
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Error Loading Employees',
        message: errorMessage
      })

      expect(employeeStore.employees).toHaveLength(0)
    })
  })

  describe('Employee CRUD Operations Integration', () => {
    it('integrates employee creation from form to store', async () => {
      const newEmployeeData = {
        name: 'New Employee',
        email: 'new@company.com',
        position: 'Analyst',
        department: 'Finance',
        phone: '1234567890',
        address: '123 Main St'
      }

      const createdEmployee = {
        id: 3,
        employee_id: 'EMP003',
        ...newEmployeeData,
        status: 'active',
        created_at: '2024-01-01T00:00:00Z'
      }

      employeeService.create.mockResolvedValueOnce({
        success: true,
        data: createdEmployee
      })

      const wrapper = mount(EmployeeForm, {
        props: {
          mode: 'create'
        },
        global: {
          plugins: [pinia, router],
          stubs: {
            FormField: {
              template: `<div class="form-field">
                <input v-bind="$attrs" @input="$emit('update:modelValue', $event.target.value)" />
              </div>`,
              emits: ['update:modelValue']
            },
            Modal: {
              template: '<div class="modal"><slot /></div>',
              props: ['visible']
            },
            TablerIcon: true
          }
        }
      })

      // Fill form data
      await wrapper.setData({ form: newEmployeeData })

      // Submit form
      await wrapper.vm.handleSubmit()
      await wrapper.vm.$nextTick()

      // Verify API was called
      expect(employeeService.create).toHaveBeenCalledWith(newEmployeeData)

      // Verify store was updated
      expect(employeeStore.employees).toContain(createdEmployee)

      // Verify success notification
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Employee Created',
        message: 'Employee has been successfully created'
      })
    })

    it('integrates employee update operations', async () => {
      const existingEmployee = {
        id: 1,
        employee_id: 'EMP001',
        name: 'John Doe',
        email: 'john@company.com',
        position: 'Developer',
        department: 'IT'
      }

      const updatedData = {
        ...existingEmployee,
        position: 'Senior Developer',
        department: 'Engineering'
      }

      // Set up existing employee in store
      employeeStore.employees = [existingEmployee]

      employeeService.update.mockResolvedValueOnce({
        success: true,
        data: updatedData
      })

      const wrapper = mount(EmployeeForm, {
        props: {
          mode: 'edit',
          employeeId: 1
        },
        global: {
          plugins: [pinia, router],
          stubs: {
            FormField: {
              template:
                '<div class="form-field"><input v-bind="$attrs" @input="$emit(\'update:modelValue\', $event.target.value)" /></div>',
              emits: ['update:modelValue']
            },
            Modal: true,
            TablerIcon: true
          }
        }
      })

      // Update form data
      await wrapper.setData({
        form: {
          position: 'Senior Developer',
          department: 'Engineering'
        }
      })

      // Submit update
      await wrapper.vm.handleSubmit()
      await wrapper.vm.$nextTick()

      // Verify API was called
      expect(employeeService.update).toHaveBeenCalledWith(1, {
        position: 'Senior Developer',
        department: 'Engineering'
      })

      // Verify store was updated
      const updatedEmployee = employeeStore.employees.find(e => e.id === 1)
      expect(updatedEmployee.position).toBe('Senior Developer')
      expect(updatedEmployee.department).toBe('Engineering')

      // Verify notification
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Employee Updated',
        message: 'Employee has been successfully updated'
      })
    })

    it('integrates employee deletion with confirmation', async () => {
      const employeeToDelete = {
        id: 1,
        employee_id: 'EMP001',
        name: 'John Doe',
        email: 'john@company.com'
      }

      // Set up employee in store
      employeeStore.employees = [employeeToDelete]

      employeeService.delete.mockResolvedValueOnce({
        success: true
      })

      const wrapper = mount(EmployeeTable, {
        global: {
          plugins: [pinia, router],
          stubs: {
            DataTable: {
              template:
                '<div><button @click="$emit(\'delete\', 1)" class="delete-btn">Delete</button></div>',
              emits: ['delete']
            },
            Modal: {
              template: `<div v-if="visible" class="modal">
                <button @click="$emit('confirm')" class="confirm-btn">Confirm</button>
                <button @click="$emit('cancel')" class="cancel-btn">Cancel</button>
              </div>`,
              props: ['visible'],
              emits: ['confirm', 'cancel']
            },
            TablerIcon: true
          }
        }
      })

      // Trigger delete action
      await wrapper.find('.delete-btn').trigger('click')
      await wrapper.vm.$nextTick()

      // Confirm deletion
      await wrapper.find('.confirm-btn').trigger('click')
      await wrapper.vm.$nextTick()

      // Verify API was called
      expect(employeeService.delete).toHaveBeenCalledWith(1)

      // Verify employee was removed from store
      expect(employeeStore.employees).toHaveLength(0)

      // Verify notification
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Employee Deleted',
        message: 'Employee has been successfully deleted'
      })
    })
  })

  describe('Employee Display Integration', () => {
    it('integrates employee card with different view modes', async () => {
      const employee = {
        id: 1,
        employee_id: 'EMP001',
        name: 'John Doe',
        email: 'john@company.com',
        position: 'Senior Developer',
        department: 'Engineering',
        phone: '+1234567890',
        address: '123 Main St, City, State',
        status: 'active',
        avatar: 'avatar.jpg',
        hire_date: '2023-01-15',
        skills: ['JavaScript', 'Vue.js', 'Node.js'],
        emergency_contact: {
          name: 'Jane Doe',
          phone: '+1234567891',
          relationship: 'Spouse'
        }
      }

      const wrapper = mount(EmployeeCard, {
        props: {
          employee,
          detailed: false
        },
        global: {
          plugins: [pinia, router],
          stubs: {
            TablerIcon: true
          }
        }
      })

      // Verify basic card view
      expect(wrapper.text()).toContain('John Doe')
      expect(wrapper.text()).toContain('Senior Developer')
      expect(wrapper.text()).toContain('EMP001')

      // Switch to detailed view
      await wrapper.setProps({ detailed: true })

      // Verify detailed information is shown
      expect(wrapper.text()).toContain('john@company.com')
      expect(wrapper.text()).toContain('+1234567890')
      expect(wrapper.text()).toContain('Engineering')
      expect(wrapper.text()).toContain('JavaScript')
    })
  })

  describe('Employee Search and Filter Integration', () => {
    it('integrates search functionality across table and store', async () => {
      const searchResults = {
        data: [
          {
            id: 1,
            employee_id: 'EMP001',
            name: 'John Developer',
            email: 'john@company.com',
            position: 'Developer'
          }
        ],
        meta: {
          total: 1,
          current_page: 1,
          last_page: 1,
          per_page: 10
        }
      }

      employeeService.getEmployees.mockResolvedValueOnce(searchResults)

      const wrapper = mount(EmployeeTable, {
        global: {
          plugins: [pinia, router],
          stubs: {
            DataTable: {
              template: `<div>
                <input @input="$emit('search', $event.target.value)" class="search-input" />
                <div v-for="employee in data" :key="employee.id" class="employee-item">
                  {{ employee.name }}
                </div>
              </div>`,
              props: ['data'],
              emits: ['search']
            },
            TablerIcon: true
          }
        }
      })

      // Trigger search
      const searchInput = wrapper.find('.search-input')
      await searchInput.setValue('Developer')
      await searchInput.trigger('input')
      await wrapper.vm.$nextTick()

      // Verify search was performed
      expect(employeeService.getAll).toHaveBeenCalledWith(
        expect.objectContaining({
          search: 'Developer'
        })
      )

      // Verify filtered results
      expect(wrapper.text()).toContain('John Developer')
    })
  })

  describe('Employee Bulk Operations Integration', () => {
    it('integrates bulk delete operations', async () => {
      const employees = [
        { id: 1, name: 'Employee 1' },
        { id: 2, name: 'Employee 2' },
        { id: 3, name: 'Employee 3' }
      ]

      employeeStore.employees = employees
      employeeService.bulkDelete.mockResolvedValueOnce({
        success: true,
        deleted_count: 2
      })

      const wrapper = mount(EmployeeTable, {
        global: {
          plugins: [pinia, router],
          stubs: {
            DataTable: {
              template: `<div>
                <button @click="$emit('bulk-delete', [1, 2])" class="bulk-delete-btn">
                  Delete Selected
                </button>
              </div>`,
              emits: ['bulk-delete']
            },
            Modal: {
              template: `<div v-if="visible" class="modal">
                <button @click="$emit('confirm')" class="confirm-btn">Confirm</button>
              </div>`,
              props: ['visible'],
              emits: ['confirm']
            },
            TablerIcon: true
          }
        }
      })

      // Trigger bulk delete
      await wrapper.find('.bulk-delete-btn').trigger('click')
      await wrapper.vm.$nextTick()

      // Confirm bulk delete
      await wrapper.find('.confirm-btn').trigger('click')
      await wrapper.vm.$nextTick()

      // Verify API was called
      expect(employeeService.bulkDelete).toHaveBeenCalledWith([1, 2])

      // Verify employees were removed from store
      expect(employeeStore.employees).toHaveLength(1)
      expect(employeeStore.employees[0].id).toBe(3)

      // Verify notification
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'success',
        title: 'Bulk Delete Successful',
        message: '2 employees have been deleted'
      })
    })
  })

  describe('Employee Export Integration', () => {
    it('integrates export functionality', async () => {
      const exportData = new Blob(['CSV data'], { type: 'text/csv' })

      employeeService.export.mockResolvedValueOnce(exportData)

      const wrapper = mount(EmployeeTable, {
        global: {
          plugins: [pinia, router],
          stubs: {
            DataTable: {
              template:
                '<div><button @click="$emit(\'export\', \'csv\')" class="export-btn">Export CSV</button></div>',
              emits: ['export']
            },
            TablerIcon: true
          }
        }
      })

      // Mock URL.createObjectURL and link click
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url')
      global.URL.revokeObjectURL = vi.fn()

      const mockLink = {
        click: vi.fn(),
        href: '',
        download: ''
      }
      vi.spyOn(document, 'createElement').mockReturnValue(mockLink)

      // Trigger export
      await wrapper.find('.export-btn').trigger('click')
      await wrapper.vm.$nextTick()

      // Verify export service was called
      expect(employeeService.export).toHaveBeenCalledWith('csv', {})

      // Verify download was triggered
      expect(document.createElement).toHaveBeenCalledWith('a')
      expect(mockLink.click).toHaveBeenCalled()
    })
  })
})
