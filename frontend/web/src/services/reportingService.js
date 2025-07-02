/**
 * Reporting Service
 * Handles analytics and reporting operations
 */

import { apiUtils } from './api.js'

export const reportingService = {
  // Get dashboard analytics
  async getDashboardAnalytics(period = 'month') {
    const response = await apiUtils.get('/reports/dashboard', {
      params: { period }
    })
    return response.data
  },

  // Get attendance reports
  async getAttendanceReport(params = {}) {
    const response = await apiUtils.get('/reports/attendance', { params })
    return response.data
  },

  // Get payroll reports
  async getPayrollReport(params = {}) {
    const response = await apiUtils.get('/reports/payroll', { params })
    return response.data
  },

  // Get employee performance report
  async getEmployeePerformanceReport(params = {}) {
    const response = await apiUtils.get('/reports/employee-performance', { params })
    return response.data
  },

  // Get leave reports
  async getLeaveReport(params = {}) {
    const response = await apiUtils.get('/reports/leave', { params })
    return response.data
  },

  // Export reports
  async exportReport(reportType, format = 'excel', params = {}) {
    return apiUtils.download(`/reports/${reportType}/export`, `${reportType}-report.${format}`, {
      params: { format, ...params }
    })
  },

  // Generate attendance analytics
  generateAttendanceAnalytics(attendanceData) {
    const analytics = {
      totalRecords: attendanceData.length,
      presentDays: 0,
      absentDays: 0,
      lateDays: 0,
      earlyLeaveDays: 0,
      overtimeDays: 0,
      averageWorkHours: 0,
      attendanceRate: 0,
      punctualityRate: 0,
      trends: {
        daily: {},
        weekly: {},
        monthly: {}
      },
      departmentStats: {},
      employeeTypeStats: {}
    }

    let totalWorkHours = 0
    let punctualDays = 0

    attendanceData.forEach(record => {
      const date = new Date(record.date)
      const dayKey = date.toISOString().split('T')[0]
      const weekKey = this.getWeekKey(date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`

      // Basic counts
      if (record.status === 'present') {
        analytics.presentDays++
        if (record.work_hours) {
          totalWorkHours += record.work_hours
        }
        if (record.overtime_hours > 0) {
          analytics.overtimeDays++
        }
        if (!record.late_minutes || record.late_minutes === 0) {
          punctualDays++
        }
      } else if (record.status === 'absent') {
        analytics.absentDays++
      }

      if (record.late_minutes > 0) {
        analytics.lateDays++
      }

      if (record.early_leave_minutes > 0) {
        analytics.earlyLeaveDays++
      }

      // Trend analysis
      if (!analytics.trends.daily[dayKey]) {
        analytics.trends.daily[dayKey] = { present: 0, absent: 0, late: 0 }
      }
      if (!analytics.trends.weekly[weekKey]) {
        analytics.trends.weekly[weekKey] = { present: 0, absent: 0, late: 0 }
      }
      if (!analytics.trends.monthly[monthKey]) {
        analytics.trends.monthly[monthKey] = { present: 0, absent: 0, late: 0 }
      }

      analytics.trends.daily[dayKey][record.status]++
      analytics.trends.weekly[weekKey][record.status]++
      analytics.trends.monthly[monthKey][record.status]++

      if (record.late_minutes > 0) {
        analytics.trends.daily[dayKey].late++
        analytics.trends.weekly[weekKey].late++
        analytics.trends.monthly[monthKey].late++
      }

      // Department stats
      if (record.department) {
        if (!analytics.departmentStats[record.department]) {
          analytics.departmentStats[record.department] = {
            present: 0,
            absent: 0,
            late: 0,
            total: 0
          }
        }
        analytics.departmentStats[record.department][record.status]++
        analytics.departmentStats[record.department].total++
      }

      // Employee type stats
      if (record.employee_type) {
        if (!analytics.employeeTypeStats[record.employee_type]) {
          analytics.employeeTypeStats[record.employee_type] = {
            present: 0,
            absent: 0,
            late: 0,
            total: 0
          }
        }
        analytics.employeeTypeStats[record.employee_type][record.status]++
        analytics.employeeTypeStats[record.employee_type].total++
      }
    })

    // Calculate rates
    const workingDays = analytics.presentDays + analytics.absentDays
    analytics.attendanceRate = workingDays > 0 ? (analytics.presentDays / workingDays) * 100 : 0
    analytics.punctualityRate =
      analytics.presentDays > 0 ? (punctualDays / analytics.presentDays) * 100 : 0
    analytics.averageWorkHours =
      analytics.presentDays > 0 ? totalWorkHours / analytics.presentDays : 0

    return analytics
  },

  // Generate payroll analytics
  generatePayrollAnalytics(payrollData) {
    const analytics = {
      totalEmployees: payrollData.length,
      totalGrossPay: 0,
      totalNetPay: 0,
      totalDeductions: 0,
      totalAllowances: 0,
      averageSalary: 0,
      employeeTypeBreakdown: {},
      departmentBreakdown: {},
      salaryDistribution: {
        ranges: {
          below_2M: 0,
          '2M_5M': 0,
          '5M_10M': 0,
          '10M_above': 0
        }
      },
      topEarners: [],
      deductionBreakdown: {},
      allowanceBreakdown: {}
    }

    payrollData.forEach(payroll => {
      analytics.totalGrossPay += payroll.gross_pay || 0
      analytics.totalNetPay += payroll.net_pay || 0

      // Calculate total deductions and allowances
      if (payroll.deductions) {
        const empDeductions = Object.values(payroll.deductions).reduce(
          (sum, amount) => sum + amount,
          0
        )
        analytics.totalDeductions += empDeductions

        // Deduction breakdown
        Object.entries(payroll.deductions).forEach(([type, amount]) => {
          analytics.deductionBreakdown[type] = (analytics.deductionBreakdown[type] || 0) + amount
        })
      }

      if (payroll.allowances) {
        const empAllowances = Object.values(payroll.allowances).reduce(
          (sum, amount) => sum + amount,
          0
        )
        analytics.totalAllowances += empAllowances

        // Allowance breakdown
        Object.entries(payroll.allowances).forEach(([type, amount]) => {
          analytics.allowanceBreakdown[type] = (analytics.allowanceBreakdown[type] || 0) + amount
        })
      }

      // Employee type breakdown
      const empType = payroll.employee_type || 'unknown'
      if (!analytics.employeeTypeBreakdown[empType]) {
        analytics.employeeTypeBreakdown[empType] = {
          count: 0,
          totalPay: 0,
          averagePay: 0
        }
      }
      analytics.employeeTypeBreakdown[empType].count++
      analytics.employeeTypeBreakdown[empType].totalPay += payroll.net_pay || 0

      // Department breakdown
      const dept = payroll.department || 'unknown'
      if (!analytics.departmentBreakdown[dept]) {
        analytics.departmentBreakdown[dept] = {
          count: 0,
          totalPay: 0,
          averagePay: 0
        }
      }
      analytics.departmentBreakdown[dept].count++
      analytics.departmentBreakdown[dept].totalPay += payroll.net_pay || 0

      // Salary distribution
      const netPay = payroll.net_pay || 0
      if (netPay < 2000000) {
        analytics.salaryDistribution.ranges.below_2M++
      } else if (netPay < 5000000) {
        analytics.salaryDistribution.ranges['2M_5M']++
      } else if (netPay < 10000000) {
        analytics.salaryDistribution.ranges['5M_10M']++
      } else {
        analytics.salaryDistribution.ranges['10M_above']++
      }

      // Top earners
      analytics.topEarners.push({
        name: payroll.employee_name,
        net_pay: payroll.net_pay || 0,
        employee_type: payroll.employee_type
      })
    })

    // Calculate averages
    analytics.averageSalary =
      analytics.totalEmployees > 0 ? analytics.totalNetPay / analytics.totalEmployees : 0

    Object.keys(analytics.employeeTypeBreakdown).forEach(type => {
      const data = analytics.employeeTypeBreakdown[type]
      data.averagePay = data.count > 0 ? data.totalPay / data.count : 0
    })

    Object.keys(analytics.departmentBreakdown).forEach(dept => {
      const data = analytics.departmentBreakdown[dept]
      data.averagePay = data.count > 0 ? data.totalPay / data.count : 0
    })

    // Sort top earners
    analytics.topEarners.sort((a, b) => b.net_pay - a.net_pay)
    analytics.topEarners = analytics.topEarners.slice(0, 10) // Top 10

    return analytics
  },

  // Generate employee performance metrics
  generateEmployeePerformance(employeeData, attendanceData, payrollData) {
    const performance = {}

    employeeData.forEach(employee => {
      const empAttendance = attendanceData.filter(a => a.employee_id === employee.id)
      const empPayroll = payrollData.find(p => p.employee_id === employee.id)

      const attendanceAnalytics = this.generateAttendanceAnalytics(empAttendance)

      performance[employee.id] = {
        employee_id: employee.id,
        employee_name: employee.name,
        department: employee.department,
        employee_type: employee.type,
        attendance_rate: attendanceAnalytics.attendanceRate,
        punctuality_rate: attendanceAnalytics.punctualityRate,
        average_work_hours: attendanceAnalytics.averageWorkHours,
        total_present_days: attendanceAnalytics.presentDays,
        total_late_days: attendanceAnalytics.lateDays,
        total_overtime_days: attendanceAnalytics.overtimeDays,
        net_pay: empPayroll?.net_pay || 0,
        performance_score: this.calculatePerformanceScore(attendanceAnalytics, empPayroll),
        trends: attendanceAnalytics.trends
      }
    })

    return performance
  },

  // Calculate performance score
  calculatePerformanceScore(attendanceAnalytics, payrollData) {
    let score = 0

    // Attendance rate (40% weight)
    score += (attendanceAnalytics.attendanceRate / 100) * 40

    // Punctuality rate (30% weight)
    score += (attendanceAnalytics.punctualityRate / 100) * 30

    // Work hours consistency (20% weight)
    const targetHours = 8
    const hoursScore = Math.max(
      0,
      1 - Math.abs(attendanceAnalytics.averageWorkHours - targetHours) / targetHours
    )
    score += hoursScore * 20

    // Overtime contribution (10% weight)
    const overtimeScore = attendanceAnalytics.overtimeDays > 0 ? 1 : 0.5
    score += overtimeScore * 10

    return Math.round(score)
  },

  // Get week key for grouping
  getWeekKey(date) {
    const year = date.getFullYear()
    const week = this.getWeekNumber(date)
    return `${year}-W${String(week).padStart(2, '0')}`
  },

  // Get week number
  getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
    const dayNum = d.getUTCDay() || 7
    d.setUTCDate(d.getUTCDate() + 4 - dayNum)
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1))
    return Math.ceil(((d - yearStart) / 86400000 + 1) / 7)
  },

  // Format currency
  formatCurrency(amount, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  },

  // Format percentage
  formatPercentage(value, decimals = 1) {
    return `${value.toFixed(decimals)}%`
  },

  // Generate chart data for attendance trends
  generateAttendanceChartData(trends, period = 'daily') {
    const data = trends[period]
    const labels = Object.keys(data).sort()

    return {
      labels,
      datasets: [
        {
          label: 'Present',
          data: labels.map(key => data[key].present || 0),
          backgroundColor: 'rgba(34, 197, 94, 0.8)',
          borderColor: 'rgb(34, 197, 94)',
          tension: 0.1
        },
        {
          label: 'Absent',
          data: labels.map(key => data[key].absent || 0),
          backgroundColor: 'rgba(239, 68, 68, 0.8)',
          borderColor: 'rgb(239, 68, 68)',
          tension: 0.1
        },
        {
          label: 'Late',
          data: labels.map(key => data[key].late || 0),
          backgroundColor: 'rgba(245, 158, 11, 0.8)',
          borderColor: 'rgb(245, 158, 11)',
          tension: 0.1
        }
      ]
    }
  },

  // Generate pie chart data
  generatePieChartData(data, colors = []) {
    const defaultColors = [
      '#3b82f6',
      '#ef4444',
      '#10b981',
      '#f59e0b',
      '#8b5cf6',
      '#06b6d4',
      '#84cc16',
      '#f97316'
    ]

    const labels = Object.keys(data)
    const values = Object.values(data)

    return {
      labels,
      datasets: [
        {
          data: values,
          backgroundColor:
            colors.length >= labels.length ? colors : defaultColors.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }
      ]
    }
  }
}

export default reportingService
