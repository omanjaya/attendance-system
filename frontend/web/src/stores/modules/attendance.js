/**
 * Attendance Store
 * State management for attendance records
 */

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { attendanceService } from '@/services/attendanceService.js'

export const useAttendanceStore = defineStore('attendance', () => {
  // State
  const records = ref({})
  const recordIds = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentRecord = ref(null)
  const settings = ref({})

  // Getters
  const allRecords = computed(() => recordIds.value.map(id => records.value[id]))
  const recordById = computed(() => id => records.value[id])
  const todayRecords = computed(() => {
    const today = new Date().toISOString().split('T')[0]
    return allRecords.value.filter(record => record.date === today)
  })

  // Actions
  const fetchRecords = async (params = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await attendanceService.getRecords(params)

      // Normalize records
      const normalized = {}
      const newIds = []

      response.data.forEach(record => {
        normalized[record.id] = record
        newIds.push(record.id)
      })

      records.value = normalized
      recordIds.value = newIds

      return response
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clockIn = async data => {
    loading.value = true
    try {
      const response = await attendanceService.clockIn(data)
      const record = response.data

      records.value[record.id] = record
      if (!recordIds.value.includes(record.id)) {
        recordIds.value.push(record.id)
      }
      currentRecord.value = record

      return record
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const clockOut = async data => {
    loading.value = true
    try {
      const response = await attendanceService.clockOut(data)
      const record = response.data

      records.value[record.id] = record
      currentRecord.value = record

      return record
    } catch (err) {
      error.value = err.message
      throw err
    } finally {
      loading.value = false
    }
  }

  const reset = () => {
    records.value = {}
    recordIds.value = []
    error.value = null
    currentRecord.value = null
  }

  return {
    // State
    records,
    recordIds,
    loading,
    error,
    currentRecord,
    settings,

    // Getters
    allRecords,
    recordById,
    todayRecords,

    // Actions
    fetchRecords,
    clockIn,
    clockOut,
    reset
  }
})
