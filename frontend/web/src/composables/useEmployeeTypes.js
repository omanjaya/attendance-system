import { computed, ref } from 'vue'

/**
 * Employee Types Composable
 * Handles the 4 employee types with their specific business logic
 */
export function useEmployeeTypes() {
  // Employee Type Constants (matching backend enum)
  const EMPLOYEE_TYPES = {
    TENAGA_KEPENDIDIKAN: 'tenaga_kependidikan',
    GURU_TETAP: 'guru_tetap',
    GURU_HONORER: 'guru_honorer',
    TENAGA_HONORER: 'tenaga_honorer'
  }

  // Employee Type Definitions with UI properties
  const employeeTypeDefinitions = ref({
    [EMPLOYEE_TYPES.TENAGA_KEPENDIDIKAN]: {
      label: 'Tenaga Kependidikan',
      description: 'Staff administrasi dan pendukung sekolah',
      color: 'blue',
      icon: 'briefcase',
      attendanceRules: {
        requiresSchedule: true,
        fixedHours: true,
        overtimeAllowed: true,
        hourlyPayment: false
      },
      payrollConfig: {
        salaryBased: true,
        monthlyPayment: true,
        allowances: ['transport', 'meal', 'performance']
      }
    },

    [EMPLOYEE_TYPES.GURU_TETAP]: {
      label: 'Guru Tetap',
      description: 'Guru dengan status kepegawaian tetap',
      color: 'green',
      icon: 'school',
      attendanceRules: {
        requiresSchedule: true,
        fixedHours: true,
        overtimeAllowed: true,
        hourlyPayment: false
      },
      payrollConfig: {
        salaryBased: true,
        monthlyPayment: true,
        allowances: ['transport', 'meal', 'teaching', 'performance']
      }
    },

    [EMPLOYEE_TYPES.GURU_HONORER]: {
      label: 'Guru Honorer',
      description: 'Guru dengan sistem pembayaran per jam mengajar',
      color: 'orange',
      icon: 'clock',
      attendanceRules: {
        requiresSchedule: true,
        fixedHours: false,
        overtimeAllowed: false,
        hourlyPayment: true
      },
      payrollConfig: {
        salaryBased: false,
        hourlyBased: true,
        monthlyPayment: true,
        allowances: ['transport']
      }
    },

    [EMPLOYEE_TYPES.TENAGA_HONORER]: {
      label: 'Tenaga Honorer',
      description: 'Tenaga kependidikan dengan sistem pembayaran per jam',
      color: 'purple',
      icon: 'users',
      attendanceRules: {
        requiresSchedule: true,
        fixedHours: false,
        overtimeAllowed: false,
        hourlyPayment: true
      },
      payrollConfig: {
        salaryBased: false,
        hourlyBased: true,
        monthlyPayment: true,
        allowances: ['transport']
      }
    }
  })

  // Computed properties for easy access
  const employeeTypeOptions = computed(() => {
    return Object.entries(employeeTypeDefinitions.value).map(([value, config]) => ({
      value,
      label: config.label,
      description: config.description,
      color: config.color,
      icon: config.icon
    }))
  })

  const hourlyPaymentTypes = computed(() => {
    return Object.entries(employeeTypeDefinitions.value)
      .filter(([_, config]) => config.payrollConfig.hourlyBased)
      .map(([value, config]) => ({
        value,
        label: config.label
      }))
  })

  const salaryBasedTypes = computed(() => {
    return Object.entries(employeeTypeDefinitions.value)
      .filter(([_, config]) => config.payrollConfig.salaryBased)
      .map(([value, config]) => ({
        value,
        label: config.label
      }))
  })

  // Helper functions
  const getEmployeeTypeConfig = type => {
    return employeeTypeDefinitions.value[type] || null
  }

  const getEmployeeTypeLabel = type => {
    const config = getEmployeeTypeConfig(type)
    return config ? config.label : 'Unknown Type'
  }

  const getEmployeeTypeColor = type => {
    const config = getEmployeeTypeConfig(type)
    return config ? config.color : 'gray'
  }

  const isHourlyPayment = type => {
    const config = getEmployeeTypeConfig(type)
    return config ? config.payrollConfig.hourlyBased : false
  }

  const isSalaryBased = type => {
    const config = getEmployeeTypeConfig(type)
    return config ? config.payrollConfig.salaryBased : false
  }

  const requiresFixedSchedule = type => {
    const config = getEmployeeTypeConfig(type)
    return config ? config.attendanceRules.fixedHours : true
  }

  const allowsOvertime = type => {
    const config = getEmployeeTypeConfig(type)
    return config ? config.attendanceRules.overtimeAllowed : false
  }

  const getAllowances = type => {
    const config = getEmployeeTypeConfig(type)
    return config ? config.payrollConfig.allowances : []
  }

  // Business logic validation
  const validateEmployeeType = type => {
    return Object.values(EMPLOYEE_TYPES).includes(type)
  }

  const getPayrollCalculationMethod = type => {
    const config = getEmployeeTypeConfig(type)
    if (!config) return 'unknown'

    if (config.payrollConfig.hourlyBased) {
      return 'hourly'
    } else if (config.payrollConfig.salaryBased) {
      return 'monthly'
    }
    return 'unknown'
  }

  // Form field configurations based on employee type
  const getFormFields = type => {
    const config = getEmployeeTypeConfig(type)
    if (!config) return []

    const baseFields = ['employee_id', 'name', 'email', 'phone', 'address', 'hire_date']

    const conditionalFields = []

    // Add salary field for salary-based types
    if (config.payrollConfig.salaryBased) {
      conditionalFields.push('monthly_salary')
    }

    // Add hourly rate for hourly-based types
    if (config.payrollConfig.hourlyBased) {
      conditionalFields.push('hourly_rate')
    }

    // Add subject for teachers
    if (type === EMPLOYEE_TYPES.GURU_TETAP || type === EMPLOYEE_TYPES.GURU_HONORER) {
      conditionalFields.push('subject', 'grade_level')
    }

    // Add department for non-teaching staff
    if (type === EMPLOYEE_TYPES.TENAGA_KEPENDIDIKAN || type === EMPLOYEE_TYPES.TENAGA_HONORER) {
      conditionalFields.push('department')
    }

    return [...baseFields, ...conditionalFields]
  }

  return {
    // Constants
    EMPLOYEE_TYPES,

    // Reactive data
    employeeTypeDefinitions,

    // Computed properties
    employeeTypeOptions,
    hourlyPaymentTypes,
    salaryBasedTypes,

    // Helper functions
    getEmployeeTypeConfig,
    getEmployeeTypeLabel,
    getEmployeeTypeColor,
    isHourlyPayment,
    isSalaryBased,
    requiresFixedSchedule,
    allowsOvertime,
    getAllowances,
    validateEmployeeType,
    getPayrollCalculationMethod,
    getFormFields
  }
}
