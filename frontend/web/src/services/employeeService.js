/**
 * Employee Service
 * Handles employee-related API operations
 */

import { apiUtils } from './api.js'

export const employeeService = {
  // Get all employees
  async getAll(params = {}) {
    const response = await apiUtils.get('/employees', { params })
    return response.data
  },
  
  // Get employee by ID
  async getById(id) {
    const response = await apiUtils.get(`/employees/${id}`)
    return response.data
  },
  
  // Create new employee
  async create(employeeData) {
    const response = await apiUtils.post('/employees', employeeData)
    return response.data
  },
  
  // Update employee
  async update(id, employeeData) {
    const response = await apiUtils.put(`/employees/${id}`, employeeData)
    return response.data
  },
  
  // Delete employee
  async delete(id) {
    const response = await apiUtils.delete(`/employees/${id}`)
    return response.data
  },
  
  // Bulk operations
  async bulkUpdate(ids, updateData) {
    const response = await apiUtils.put('/employees/bulk', { ids, ...updateData })
    return response.data
  },
  
  async bulkDelete(ids) {
    const response = await apiUtils.delete('/employees/bulk', { data: { ids } })
    return response.data
  },
  
  // Employee types
  async getTypes() {
    const response = await apiUtils.get('/employees/types')
    return response.data
  },
  
  // Employee statistics
  async getStatistics() {
    const response = await apiUtils.get('/employees/statistics')
    return response.data
  },
  
  // Export employees
  async export(format = 'excel', filters = {}) {
    return apiUtils.download('/employees/export', `employees.${format}`, {
      params: { format, ...filters }
    })
  },
  
  // Import employees
  async import(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await apiUtils.upload('/employees/import', formData)
    return response.data
  },
  
  // Upload employee photo
  async uploadPhoto(id, photo) {
    const formData = new FormData()
    formData.append('photo', photo)
    const response = await apiUtils.upload(`/employees/${id}/photo`, formData)
    return response.data
  }
}

export default employeeService
