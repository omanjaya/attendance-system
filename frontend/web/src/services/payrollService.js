/**
 * Payroll Service
 * Handles advanced payroll calculations for different employee types
 */

import { apiUtils } from './api.js'

export const payrollService = {
  // Get payroll records
  async getAll(params = {}) {
    const response = await apiUtils.get('/payroll', { params })
    return response.data
  },

  // Get payroll by ID
  async getById(id) {
    const response = await apiUtils.get(`/payroll/${id}`)
    return response.data
  },

  // Calculate payroll
  async calculate(params) {
    const response = await apiUtils.post('/payroll/calculate', params)
    return response.data
  },

  // Generate payroll
  async generate(periodId) {
    const response = await apiUtils.post('/payroll/generate', { periodId })
    return response.data
  },

  // Approve payroll
  async approve(id) {
    const response = await apiUtils.put(`/payroll/${id}/approve`)
    return response.data
  },

  // Export payroll
  async export(format = 'excel', filters = {}) {
    return apiUtils.download('/payroll/export', `payroll.${format}`, {
      params: { format, ...filters }
    })
  },

  // Bulk payroll calculation
  async bulkCalculatePayroll(period, employeeIds = []) {
    const response = await apiUtils.post('/payroll/bulk-calculate', {
      period_start: period.start,
      period_end: period.end,
      employee_ids: employeeIds
    })
    return response.data
  },

  // Get payroll summary
  async getPayrollSummary(params = {}) {
    const response = await apiUtils.get('/payroll/summary', { params })
    return response.data
  },

  // Client-side payroll calculations for preview
  calculateEmployeePayroll(employee, attendanceData, period) {
    const calculation = {
      employee_id: employee.id,
      employee_name: employee.name,
      employee_type: employee.type,
      period,
      base_salary: parseFloat(employee.base_salary || 0),
      hourly_rate: parseFloat(employee.hourly_rate || 0),
      overtime_rate: parseFloat(employee.overtime_rate || employee.hourly_rate * 1.5 || 0),
      total_hours: 0,
      regular_hours: 0,
      overtime_hours: 0,
      scheduled_hours: 0,
      payable_hours: 0,
      gross_pay: 0,
      deductions: {},
      allowances: {},
      net_pay: 0,
      attendance_summary: {
        present_days: 0,
        absent_days: 0,
        late_days: 0,
        early_leave_days: 0
      }
    }

    // Calculate attendance metrics
    attendanceData.forEach(record => {
      if (record.status === 'present') {
        calculation.attendance_summary.present_days++

        const workHours = this.calculateWorkHours(record)
        calculation.total_hours += workHours.total
        calculation.regular_hours += workHours.regular
        calculation.overtime_hours += workHours.overtime

        if (record.scheduled_hours) {
          calculation.scheduled_hours += record.scheduled_hours
        }
      } else if (record.status === 'absent') {
        calculation.attendance_summary.absent_days++
      }

      if (record.late_minutes > 0) {
        calculation.attendance_summary.late_days++
      }

      if (record.early_leave_minutes > 0) {
        calculation.attendance_summary.early_leave_days++
      }
    })

    // Calculate payable hours based on employee type
    switch (employee.type) {
      case 'honorary_teacher':
      case 'honorary_staff':
        // Honorary employees: paid only for scheduled teaching hours
        calculation.payable_hours = Math.min(calculation.total_hours, calculation.scheduled_hours)
        break

      case 'permanent_teacher':
      case 'permanent_staff':
        // Permanent employees: salary + overtime
        calculation.payable_hours = calculation.total_hours
        break

      default:
        calculation.payable_hours = calculation.total_hours
    }

    // Calculate gross pay
    if (employee.type.includes('permanent')) {
      // Salary-based calculation
      const dailyRate = calculation.base_salary / 22 // Assuming 22 working days per month
      calculation.gross_pay = calculation.attendance_summary.present_days * dailyRate

      // Add overtime pay
      calculation.gross_pay += calculation.overtime_hours * calculation.overtime_rate
    } else {
      // Hourly-based calculation for honorary employees
      calculation.gross_pay = calculation.payable_hours * calculation.hourly_rate
    }

    // Calculate deductions
    calculation.deductions = this.calculateDeductions(calculation, employee)

    // Calculate allowances
    calculation.allowances = this.calculateAllowances(calculation, employee)

    // Calculate net pay
    const totalDeductions = Object.values(calculation.deductions).reduce((sum, amount) => sum + amount, 0)
    const totalAllowances = Object.values(calculation.allowances).reduce((sum, amount) => sum + amount, 0)

    calculation.net_pay = calculation.gross_pay + totalAllowances - totalDeductions

    return calculation
  },

  // Calculate work hours from attendance record
  calculateWorkHours(attendanceRecord) {
    if (!attendanceRecord.clock_in || !attendanceRecord.clock_out) {
      return { total: 0, regular: 0, overtime: 0 }
    }

    const clockIn = new Date(attendanceRecord.clock_in)
    const clockOut = new Date(attendanceRecord.clock_out)
    const totalMinutes = (clockOut - clockIn) / (1000 * 60)

    // Subtract break time (default 1 hour)
    const breakMinutes = attendanceRecord.break_minutes || 60
    const workMinutes = Math.max(0, totalMinutes - breakMinutes)
    const workHours = workMinutes / 60

    // Calculate regular and overtime hours
    const standardHours = 8 // Standard work day
    const regularHours = Math.min(workHours, standardHours)
    const overtimeHours = Math.max(0, workHours - standardHours)

    return {
      total: workHours,
      regular: regularHours,
      overtime: overtimeHours
    }
  },

  // Calculate deductions
  calculateDeductions(calculation, employee) {
    const deductions = {}

    // Tax calculation (simplified Indonesian tax)
    if (calculation.gross_pay > 4500000) {
      // Indonesian tax threshold
      deductions.income_tax = calculation.gross_pay * 0.05 // 5% tax rate
    }

    // Social security (BPJS)
    if (employee.type.includes('permanent')) {
      deductions.bpjs_health = calculation.gross_pay * 0.01 // 1%
      deductions.bpjs_employment = calculation.gross_pay * 0.02 // 2%
    }

    // Late penalty
    if (calculation.attendance_summary.late_days > 3) {
      deductions.late_penalty = (calculation.attendance_summary.late_days - 3) * 50000 // 50k per day
    }

    // Absence deduction for permanent employees
    if (employee.type.includes('permanent') && calculation.attendance_summary.absent_days > 0) {
      const dailyRate = calculation.base_salary / 22
      deductions.absence_deduction = calculation.attendance_summary.absent_days * dailyRate
    }

    return deductions
  },

  // Calculate allowances
  calculateAllowances(calculation, employee) {
    const allowances = {}

    // Transport allowance
    if (calculation.attendance_summary.present_days > 0) {
      allowances.transport = calculation.attendance_summary.present_days * 25000 // 25k per day
    }

    // Meal allowance
    if (calculation.attendance_summary.present_days > 0) {
      allowances.meal = calculation.attendance_summary.present_days * 20000 // 20k per day
    }

    // Performance bonus for teachers
    if (employee.type.includes('teacher') && calculation.attendance_summary.present_days >= 20) {
      allowances.performance_bonus = calculation.base_salary * 0.1 // 10% bonus
    }

    // Perfect attendance bonus
    if (calculation.attendance_summary.absent_days === 0 && calculation.attendance_summary.late_days === 0) {
      allowances.perfect_attendance = 100000 // 100k bonus
    }

    return allowances
  },

  // Generate payroll report
  generatePayrollReport(payrollData, period) {
    const summary = {
      period,
      total_employees: payrollData.length,
      total_gross_pay: 0,
      total_net_pay: 0,
      total_deductions: 0,
      total_allowances: 0,
      employee_types: {},
      payment_summary: {
        permanent_employees: { count: 0, total_pay: 0 },
        honorary_employees: { count: 0, total_pay: 0 }
      }
    }

    payrollData.forEach(payroll => {
      summary.total_gross_pay += payroll.gross_pay
      summary.total_net_pay += payroll.net_pay

      const totalDeductions = Object.values(payroll.deductions).reduce((sum, amount) => sum + amount, 0)
      const totalAllowances = Object.values(payroll.allowances).reduce((sum, amount) => sum + amount, 0)

      summary.total_deductions += totalDeductions
      summary.total_allowances += totalAllowances

      // Group by employee type
      if (!summary.employee_types[payroll.employee_type]) {
        summary.employee_types[payroll.employee_type] = {
          count: 0,
          total_pay: 0,
          avg_pay: 0
        }
      }

      summary.employee_types[payroll.employee_type].count++
      summary.employee_types[payroll.employee_type].total_pay += payroll.net_pay

      // Payment summary
      if (payroll.employee_type.includes('permanent')) {
        summary.payment_summary.permanent_employees.count++
        summary.payment_summary.permanent_employees.total_pay += payroll.net_pay
      } else {
        summary.payment_summary.honorary_employees.count++
        summary.payment_summary.honorary_employees.total_pay += payroll.net_pay
      }
    })

    // Calculate averages
    Object.keys(summary.employee_types).forEach(type => {
      const typeData = summary.employee_types[type]
      typeData.avg_pay = typeData.total_pay / typeData.count
    })

    return summary
  },

  // Format currency for display
  formatCurrency(amount, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  },

  // Validate payroll data
  validatePayrollData(payrollData) {
    const errors = []

    if (!payrollData.employee_id) {
      errors.push('Employee ID is required')
    }

    if (!payrollData.period_start || !payrollData.period_end) {
      errors.push('Payroll period is required')
    }

    if (payrollData.gross_pay < 0) {
      errors.push('Gross pay cannot be negative')
    }

    if (payrollData.net_pay < 0) {
      errors.push('Net pay cannot be negative')
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

export default payrollService
