/**
 * Employee Store
 * Normalized state management for employees
 */

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { employeeService } from '@/services/employeeService.js'

export const useEmployeeStore = defineStore('employee', () => {
  // State
  const entities = ref({})
  const ids = ref([])
  const loading = ref(false)
  const error = ref(null)
  const filters = ref({})
  const pagination = ref({
    page: 1,
    perPage: 10,
    total: 0
  })

  // Getters
  const all = computed(() => ids.value.map(id => entities.value[id]))
  const byId = computed(() => (id) => entities.value[id])
  const filtered = computed(() => {
    let employees = all.value
    
    // Apply filters
    if (filters.value.type) {
      employees = employees.filter(emp => emp.employee_type === filters.value.type)
    }
    if (filters.value.status !== undefined) {
      employees = employees.filter(emp => emp.is_active === filters.value.status)
    }
    if (filters.value.search) {
      const search = filters.value.search.toLowerCase()
      employees = employees.filter(emp => 
        emp.name.toLowerCase().includes(search) ||
        emp.email.toLowerCase().includes(search) ||
        emp.employee_id.toLowerCase().includes(search)
      )
    }
    
    return employees
  })

  const statistics = computed(() => {
    const stats = {
      total: all.value.length,
      active: 0,
      inactive: 0,
      byType: {}
    }
    
    all.value.forEach(employee => {
      if (employee.is_active) stats.active++
      else stats.inactive++
      
      const type = employee.employee_type
      stats.byType[type] = (stats.byType[type] || 0) + 1
    })
    
    return stats
  })

  // Actions
  const fetchAll = async (params = {}) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await employeeService.getAll(params)
      
      // Normalize data
      const normalized = {}
      const newIds = []
      
      response.data.forEach(employee => {
        normalized[employee.id] = employee
        newIds.push(employee.id)
      })
      
      entities.value = normalized
      ids.value = newIds
      
      if (response.pagination) {
        pagination.value = response.pagination
      }
      
      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const fetchById = async (id) => {
    if (entities.value[id]) {
      return entities.value[id]
    }
    
    loading.value = true
    try {
      const response = await employeeService.getById(id)
      entities.value[id] = response.data
      if (!ids.value.includes(id)) {
        ids.value.push(id)
      }
      return response.data
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const create = async (employeeData) => {
    loading.value = true
    try {
      const response = await employeeService.create(employeeData)
      const employee = response.data
      
      entities.value[employee.id] = employee
      ids.value.push(employee.id)
      
      return employee
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const update = async (id, employeeData) => {
    loading.value = true
    try {
      const response = await employeeService.update(id, employeeData)
      const employee = response.data
      
      entities.value[id] = employee
      
      return employee
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const remove = async (id) => {
    loading.value = true
    try {
      await employeeService.delete(id)
      
      delete entities.value[id]
      ids.value = ids.value.filter(existingId => existingId !== id)
      
      return true
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const setFilters = (newFilters) => {
    filters.value = { ...filters.value, ...newFilters }
  }

  const clearFilters = () => {
    filters.value = {}
  }

  const reset = () => {
    entities.value = {}
    ids.value = []
    error.value = null
    filters.value = {}
    pagination.value = { page: 1, perPage: 10, total: 0 }
  }

  return {
    // State
    entities,
    ids,
    loading,
    error,
    filters,
    pagination,
    
    // Getters
    all,
    byId,
    filtered,
    statistics,
    
    // Actions
    fetchAll,
    fetchById,
    create,
    update,
    remove,
    setFilters,
    clearFilters,
    reset
  }
})
