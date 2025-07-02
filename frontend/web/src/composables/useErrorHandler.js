import { ref } from 'vue'
import { useNotifications } from './useNotifications'

export function useErrorHandler() {
  const { showError, showWarning } = useNotifications()
  const isLoading = ref(false)
  const error = ref('')

  const handleApiError = (error, context = 'Operation') => {
    console.error(`${context} error:`, error)

    let message = `${context} failed. Please try again.`

    if (error.response?.status === 400) {
      message = error.response.data?.message || 'Bad request. Please check your input.'
    } else if (error.response?.status === 401) {
      message = 'Unauthorized. Please login again.'
      // Could trigger logout here
    } else if (error.response?.status === 403) {
      message = "Access denied. You don't have permission to perform this action."
    } else if (error.response?.status === 404) {
      message = 'Resource not found.'
    } else if (error.response?.status === 422) {
      // Validation errors
      const errors = error.response.data.errors
      if (errors) {
        message = Object.values(errors).flat().join(', ')
      } else {
        message = error.response.data.message || 'Validation failed.'
      }
    } else if (error.response?.status === 429) {
      message = 'Too many requests. Please wait before trying again.'
    } else if (error.response?.status >= 500) {
      message = 'Server error. Please try again later.'
    } else if (error.code === 'NETWORK_ERROR' || !error.response) {
      message = 'Network error. Please check your connection.'
    } else if (error.response?.data?.message) {
      message = error.response.data.message
    }

    error.value = message
    showError(message)

    return message
  }

  const handleAsyncOperation = async (operation, context = 'Operation') => {
    isLoading.value = true
    error.value = ''

    try {
      const result = await operation()
      return result
    } catch (err) {
      handleApiError(err, context)
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = ''
  }

  const showValidationErrors = errors => {
    if (typeof errors === 'object') {
      const messages = Object.values(errors).flat()
      messages.forEach(message => showError(message))
    } else {
      showError(errors)
    }
  }

  const handleSuccess = (message, result = null) => {
    error.value = ''
    const { showSuccess } = useNotifications()
    showSuccess(message)
    return result
  }

  return {
    isLoading,
    error,
    handleApiError,
    handleAsyncOperation,
    clearError,
    showValidationErrors,
    handleSuccess
  }
}
