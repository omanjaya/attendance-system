/**
 * Formatter Functions
 * Data formatting utilities
 */

// Date formatters
export const formatDate = (date, format = 'MMM DD, YYYY') => {
  if (!date) return ''

  const d = new Date(date)
  const options = {}

  switch (format) {
    case 'MMM DD, YYYY':
      options.year = 'numeric'
      options.month = 'short'
      options.day = '2-digit'
      break
    case 'DD/MM/YYYY':
      return d.toLocaleDateString('en-GB')
    case 'YYYY-MM-DD':
      return d.toISOString().split('T')[0]
    case 'relative':
      return formatRelativeTime(d)
    default:
      return d.toLocaleDateString()
  }

  return d.toLocaleDateString('en-US', options)
}

export const formatTime = (time, format24h = true) => {
  if (!time) return ''

  const d = new Date(`1970-01-01T${time}`)
  return d.toLocaleTimeString('en-US', {
    hour12: !format24h,
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const formatDateTime = datetime => {
  if (!datetime) return ''

  const d = new Date(datetime)
  return `${formatDate(d)} ${formatTime(d.toTimeString().slice(0, 5))}`
}

export const formatRelativeTime = date => {
  if (!date) return ''

  const now = new Date()
  const diffMs = now - new Date(date)
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`

  return formatDate(date)
}

// Number formatters
export const formatCurrency = (amount, currency = 'IDR') => {
  if (amount === null || amount === undefined) return ''

  const formatter = new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  })

  return formatter.format(amount)
}

export const formatNumber = (number, options = {}) => {
  if (number === null || number === undefined) return ''

  const formatter = new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options
  })

  return formatter.format(number)
}

export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return ''

  return `${(value * 100).toFixed(decimals)}%`
}

// Text formatters
export const formatName = name => {
  if (!name) return ''

  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const formatInitials = name => {
  if (!name) return ''

  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .join('')
    .slice(0, 2)
}

export const formatPhone = phone => {
  if (!phone) return ''

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // Format Indonesian phone number
  if (cleaned.startsWith('62')) {
    return `+${cleaned.slice(0, 2)} ${cleaned.slice(2, 5)} ${cleaned.slice(5, 9)} ${cleaned.slice(9)}`
  } else if (cleaned.startsWith('0')) {
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 8)} ${cleaned.slice(8)}`
  }

  return phone
}

export const formatEmployeeId = id => {
  if (!id) return ''
  return id.toUpperCase()
}

// Duration formatters
export const formatDuration = minutes => {
  if (!minutes) return '0m'

  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) return `${mins}m`
  if (mins === 0) return `${hours}h`
  return `${hours}h ${mins}m`
}

export const formatWorkingHours = (startTime, endTime) => {
  if (!startTime || !endTime) return ''

  return `${formatTime(startTime)} - ${formatTime(endTime)}`
}

// File size formatter
export const formatFileSize = bytes => {
  if (!bytes) return '0 B'

  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))

  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

// Status formatters
export const formatStatus = status => {
  if (!status) return ''

  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

export const formatBadgeClass = status => {
  const statusMap = {
    active: 'bg-success',
    inactive: 'bg-danger',
    pending: 'bg-warning',
    approved: 'bg-success',
    rejected: 'bg-danger',
    present: 'bg-success',
    absent: 'bg-danger',
    late: 'bg-warning'
  }

  return statusMap[status] || 'bg-secondary'
}

// Export all formatters as an object for convenience
export const formatters = {
  date: formatDate,
  time: formatTime,
  dateTime: formatDateTime,
  relativeTime: formatRelativeTime,
  currency: formatCurrency,
  number: formatNumber,
  percentage: formatPercentage,
  name: formatName,
  initials: formatInitials,
  phone: formatPhone,
  employeeId: formatEmployeeId,
  duration: formatDuration,
  workingHours: formatWorkingHours,
  fileSize: formatFileSize,
  status: formatStatus,
  badgeClass: formatBadgeClass
}
