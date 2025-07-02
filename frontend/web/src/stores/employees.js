import { defineStore } from 'pinia'
import { employeeService } from '@/services/employeeService'

export const useEmployeeStore = defineStore('employees', {
  state: () => ({
    employees: [],
    total: 0,
    loading: false,
    filters: {
      search: '',
      department: '',
      status: '',
      position: ''
    },
    pagination: {
      page: 1,
      perPage: 10,
      sortBy: 'name',
      sortOrder: 'asc'
    }
  }),

  getters: {
    activeEmployees: state => state.employees.filter(emp => emp.status === 'active'),
    employeeById: state => id => state.employees.find(emp => emp.id === id),
    departmentOptions: state => {
      const departments = [...new Set(state.employees.map(emp => emp.department))]
      return departments.filter(Boolean).sort()
    },
    positionOptions: state => {
      const positions = [...new Set(state.employees.map(emp => emp.position))]
      return positions.filter(Boolean).sort()
    }
  },

  actions: {
    async fetchEmployees(params = {}) {
      this.loading = true
      try {
        const response = await employeeService.getAll({
          ...this.filters,
          ...this.pagination,
          ...params
        })

        this.employees = response.data || response
        this.total = response.meta?.total || (response.data || response).length

        return response
      } catch (error) {
        console.error('Failed to fetch employees:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async createEmployee(employeeData) {
      try {
        const response = await employeeService.create(employeeData)
        if (response.success || response.data) {
          this.employees.push(response.data || response)
          this.total++
        }
        return response
      } catch (error) {
        console.error('Failed to create employee:', error)
        throw error
      }
    },

    async updateEmployee(id, employeeData) {
      try {
        const response = await employeeService.update(id, employeeData)
        if (response.success || response.data) {
          const index = this.employees.findIndex(emp => emp.id === id)
          if (index !== -1) {
            this.employees[index] = { ...this.employees[index], ...(response.data || response) }
          }
        }
        return response
      } catch (error) {
        console.error('Failed to update employee:', error)
        throw error
      }
    },

    async deleteEmployee(id) {
      try {
        const response = await employeeService.delete(id)
        if (response.success !== false) {
          const index = this.employees.findIndex(emp => emp.id === id)
          if (index !== -1) {
            this.employees.splice(index, 1)
            this.total--
          }
        }
        return response
      } catch (error) {
        console.error('Failed to delete employee:', error)
        throw error
      }
    },

    async bulkDelete(ids) {
      try {
        const response = await employeeService.bulkDelete(ids)
        if (response.success !== false) {
          this.employees = this.employees.filter(emp => !ids.includes(emp.id))
          this.total -= ids.length
        }
        return response
      } catch (error) {
        console.error('Failed to bulk delete employees:', error)
        throw error
      }
    },

    setFilters(filters) {
      this.filters = { ...this.filters, ...filters }
    },

    setPagination(pagination) {
      this.pagination = { ...this.pagination, ...pagination }
    },

    resetFilters() {
      this.filters = {
        search: '',
        department: '',
        status: '',
        position: ''
      }
    }
  }
})
