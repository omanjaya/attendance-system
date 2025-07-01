/**
 * Schedule Service
 * Handles schedule-related API operations
 */

import { apiUtils } from './api.js'

export const scheduleService = {
  // Get schedules
  async getAll(params = {}) {
    const response = await apiUtils.get('/schedules', { params })
    return response.data
  },
  
  // Get schedule by ID
  async getById(id) {
    const response = await apiUtils.get(`/schedules/${id}`)
    return response.data
  },
  
  // Create schedule
  async create(scheduleData) {
    const response = await apiUtils.post('/schedules', scheduleData)
    return response.data
  },
  
  // Update schedule
  async update(id, scheduleData) {
    const response = await apiUtils.put(`/schedules/${id}`, scheduleData)
    return response.data
  },
  
  // Delete schedule
  async delete(id) {
    const response = await apiUtils.delete(`/schedules/${id}`)
    return response.data
  },
  
  // Get employee schedules
  async getByEmployee(employeeId, params = {}) {
    const response = await apiUtils.get(`/schedules/employee/${employeeId}`, { params })
    return response.data
  },
  
  // Assign schedule to employee
  async assignToEmployee(scheduleId, employeeId) {
    const response = await apiUtils.post(`/schedules/${scheduleId}/assign`, { employeeId })
    return response.data
  },
  
  // Bulk assign schedules
  async bulkAssign(scheduleId, employeeIds) {
    const response = await apiUtils.post(`/schedules/${scheduleId}/bulk-assign`, { employeeIds })
    return response.data
  }
}

export default scheduleService
