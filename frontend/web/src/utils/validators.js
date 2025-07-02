/**
 * Validation Functions
 * Form validation utilities
 */

// Basic validators
export const required = value => {
  if (Array.isArray(value)) return value.length > 0
  return value !== null && value !== undefined && value !== ''
}

export const minLength = min => value => {
  return value && value.length >= min
}

export const maxLength = max => value => {
  return !value || value.length <= max
}

export const email = value => {
  if (!value) return true
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(value)
}

export const phone = value => {
  if (!value) return true
  const phoneRegex = /^[+]?[1-9]?[0-9]{7,15}$/
  return phoneRegex.test(value.replace(/\s/g, ''))
}

export const numeric = value => {
  if (!value) return true
  return !isNaN(value) && !isNaN(parseFloat(value))
}

export const integer = value => {
  if (!value) return true
  return Number.isInteger(Number(value))
}

export const positive = value => {
  if (!value) return true
  return Number(value) > 0
}

export const min = minValue => value => {
  if (!value) return true
  return Number(value) >= minValue
}

export const max = maxValue => value => {
  if (!value) return true
  return Number(value) <= maxValue
}

export const between = (minValue, maxValue) => value => {
  if (!value) return true
  const num = Number(value)
  return num >= minValue && num <= maxValue
}

// Date validators
export const date = value => {
  if (!value) return true
  return !isNaN(Date.parse(value))
}

export const dateAfter = afterDate => value => {
  if (!value) return true
  return new Date(value) > new Date(afterDate)
}

export const dateBefore = beforeDate => value => {
  if (!value) return true
  return new Date(value) < new Date(beforeDate)
}

export const dateRange = (startDate, endDate) => value => {
  if (!value) return true
  const date = new Date(value)
  return date >= new Date(startDate) && date <= new Date(endDate)
}

// Custom validators
export const employeeId = value => {
  if (!value) return true
  const regex = /^[A-Z]{2}\d{6}$/
  return regex.test(value)
}

export const password = value => {
  if (!value) return true

  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const minLength = value.length >= 8
  const hasUpper = /[A-Z]/.test(value)
  const hasLower = /[a-z]/.test(value)
  const hasNumber = /\d/.test(value)

  return minLength && hasUpper && hasLower && hasNumber
}

export const confirmPassword = originalPassword => value => {
  return value === originalPassword
}

export const fileSize = maxSizeInBytes => file => {
  if (!file) return true
  return file.size <= maxSizeInBytes
}

export const fileType = allowedTypes => file => {
  if (!file) return true
  return allowedTypes.includes(file.type)
}

// Validation utilities
export const createValidator = rules => {
  return value => {
    for (const rule of rules) {
      if (typeof rule === 'function') {
        if (!rule(value)) return false
      } else if (typeof rule === 'object' && rule.validator) {
        if (!rule.validator(value)) {
          return rule.message || false
        }
      }
    }
    return true
  }
}

export const validateForm = (formData, validationRules) => {
  const errors = {}

  Object.keys(validationRules).forEach(field => {
    const value = formData[field]
    const rules = validationRules[field]
    const result = createValidator(rules)(value)

    if (result !== true) {
      errors[field] = typeof result === 'string' ? result : `${field} is invalid`
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Common validation rule sets
export const commonRules = {
  email: [required, email],
  password: [required, password],
  name: [required, minLength(2), maxLength(100)],
  phone: [phone],
  employeeId: [required, employeeId],
  salary: [required, numeric, positive],
  date: [required, date]
}

// Error messages
export const errorMessages = {
  required: 'This field is required',
  email: 'Please enter a valid email address',
  phone: 'Please enter a valid phone number',
  password: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  employeeId: 'Employee ID must be in format: XX123456',
  numeric: 'This field must be a number',
  positive: 'This field must be a positive number',
  date: 'Please enter a valid date'
}
