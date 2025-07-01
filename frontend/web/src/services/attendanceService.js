/**
 * Attendance Service
 * Handles attendance-related API operations
 */

import { apiUtils } from './api.js'

export const attendanceService = {
  // Get attendance records
  async getRecords(params = {}) {
    const response = await apiUtils.get('/attendance', { params })
    return response.data
  },
  
  // Get attendance by employee
  async getByEmployee(employeeId, params = {}) {
    const response = await apiUtils.get(`/attendance/employee/${employeeId}`, { params })
    return response.data
  },
  
  // Clock in
  async clockIn(data) {
    const response = await apiUtils.post('/attendance/clock-in', data)
    return response.data
  },
  
  // Clock out
  async clockOut(data) {
    const response = await apiUtils.post('/attendance/clock-out', data)
    return response.data
  },

  // Get today's attendance status
  async getStatus() {
    const response = await apiUtils.get('/attendance/status')
    return response.data
  },

  // Get attendance history
  async getHistory(params = {}) {
    const response = await apiUtils.get('/attendance/history', { params })
    return response.data
  },
  
  // Manual attendance entry
  async createRecord(attendanceData) {
    const response = await apiUtils.post('/attendance/manual', attendanceData)
    return response.data
  },
  
  // Update attendance record
  async updateRecord(id, attendanceData) {
    const response = await apiUtils.put(`/attendance/${id}`, attendanceData)
    return response.data
  },
  
  // Delete attendance record
  async deleteRecord(id) {
    const response = await apiUtils.delete(`/attendance/${id}`)
    return response.data
  },
  
  // Get attendance summary
  async getSummary(params = {}) {
    const response = await apiUtils.get('/attendance/summary', { params })
    return response.data
  },
  
  // Get attendance statistics
  async getStatistics(params = {}) {
    const response = await apiUtils.get('/attendance/statistics', { params })
    return response.data
  },
  
  // Export attendance data
  async export(format = 'excel', filters = {}) {
    return apiUtils.download('/attendance/export', `attendance.${format}`, {
      params: { format, ...filters }
    })
  },
  
  // Get attendance settings
  async getSettings() {
    const response = await apiUtils.get('/attendance/settings')
    return response.data
  },
  
  // Update attendance settings
  async updateSettings(settings) {
    const response = await apiUtils.put('/attendance/settings', settings)
    return response.data
  }
}

export default attendanceService
