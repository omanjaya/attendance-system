<template>
  <div class="page-body">
    <div class="container-xl">
      <!-- Page header -->
      <div class="page-header d-print-none">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">Add New Employee</h2>
            <div class="page-subtitle">
              Create a new employee record with type-specific information
            </div>
          </div>
          <div class="col-auto ms-auto d-print-none">
            <div class="btn-list">
              <router-link to="/employees" class="btn btn-outline-secondary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path d="M5 12l14 0" />
                  <path d="M5 12l6 6" />
                  <path d="M5 12l6 -6" />
                </svg>
                Back to List
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Page content -->
      <div class="row row-deck row-cards">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Employee Information</h3>
            </div>
            <div class="card-body">
              <form id="employee-form" @submit.prevent="submitForm">
                <!-- Employee Type Selection -->
                <div class="row">
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="form-label required" for="employee-type">Employee Type</label>
                      <select
                        id="employee-type"
                        v-model="form.employee_type"
                        class="form-select"
                        :class="{ 'is-invalid': errors.employee_type }"
                        required
                        @change="handleTypeChange"
                      >
                        <option value="">Select Employee Type</option>
                        <option
                          v-for="option in employeeTypeOptions"
                          :key="option.value"
                          :value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                      <div v-if="selectedTypeConfig?.description" class="form-hint">
                        {{ selectedTypeConfig.description }}
                      </div>
                      <div v-if="errors.employee_type" class="invalid-feedback" role="alert">
                        {{ errors.employee_type }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Basic Information -->
                <h3 class="card-title mt-4">Basic Information</h3>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label required" for="employee-id">Employee ID</label>
                      <input
                        id="employee-id"
                        v-model="form.employee_id"
                        v-a11y.label="{ label: 'Employee ID (required)' }"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.employee_id }"
                        placeholder="Enter employee ID"
                        required
                        :aria-describedby="errors.employee_id ? 'employee-id-error' : null"
                      />
                      <div
                        v-if="errors.employee_id"
                        id="employee-id-error"
                        class="invalid-feedback"
                        role="alert"
                      >
                        {{ errors.employee_id }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label required" for="employee-name">Full Name</label>
                      <input
                        id="employee-name"
                        v-model="form.name"
                        v-a11y.label="{ label: 'Full Name (required)' }"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.name }"
                        placeholder="Enter full name"
                        required
                        :aria-describedby="errors.name ? 'employee-name-error' : null"
                      />
                      <div
                        v-if="errors.name"
                        id="employee-name-error"
                        class="invalid-feedback"
                        role="alert"
                      >
                        {{ errors.name }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label required">Email</label>
                      <input
                        v-model="form.email"
                        type="email"
                        class="form-control"
                        :class="{ 'is-invalid': errors.email }"
                        placeholder="Enter email address"
                        required
                      />
                      <div v-if="errors.email" class="invalid-feedback">
                        {{ errors.email }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Phone Number</label>
                      <input
                        v-model="form.phone"
                        type="tel"
                        class="form-control"
                        :class="{ 'is-invalid': errors.phone }"
                        placeholder="Enter phone number"
                      />
                      <div v-if="errors.phone" class="invalid-feedback">
                        {{ errors.phone }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label required">Hire Date</label>
                      <input
                        v-model="form.hire_date"
                        type="date"
                        class="form-control"
                        :class="{ 'is-invalid': errors.hire_date }"
                        required
                      />
                      <div v-if="errors.hire_date" class="invalid-feedback">
                        {{ errors.hire_date }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label">Status</label>
                      <select v-model="form.is_active" class="form-select">
                        <option :value="true">Active</option>
                        <option :value="false">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="row">
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="form-label">Address</label>
                      <textarea
                        v-model="form.address"
                        class="form-control"
                        :class="{ 'is-invalid': errors.address }"
                        rows="3"
                        placeholder="Enter full address"
                      ></textarea>
                      <div v-if="errors.address" class="invalid-feedback">
                        {{ errors.address }}
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Type-specific fields -->
                <template v-if="form.employee_type">
                  <!-- Teacher Fields -->
                  <template v-if="isTeacher">
                    <h3 class="card-title mt-4">Teaching Information</h3>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label required">Subject</label>
                          <input
                            v-model="form.subject"
                            type="text"
                            class="form-control"
                            :class="{ 'is-invalid': errors.subject }"
                            placeholder="Enter teaching subject"
                            required
                          />
                          <div v-if="errors.subject" class="invalid-feedback">
                            {{ errors.subject }}
                          </div>
                        </div>
                      </div>
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label">Grade Level</label>
                          <select v-model="form.grade_level" class="form-select">
                            <option value="">Select Grade</option>
                            <option v-for="grade in gradeOptions" :key="grade" :value="grade">
                              {{ grade }}
                            </option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Staff Fields -->
                  <template v-if="isStaff">
                    <h3 class="card-title mt-4">Department Information</h3>
                    <div class="row">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label required">Department</label>
                          <select
                            v-model="form.department"
                            class="form-select"
                            :class="{ 'is-invalid': errors.department }"
                            required
                          >
                            <option value="">Select Department</option>
                            <option v-for="dept in departmentOptions" :key="dept" :value="dept">
                              {{ dept }}
                            </option>
                          </select>
                          <div v-if="errors.department" class="invalid-feedback">
                            {{ errors.department }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </template>

                  <!-- Salary Information -->
                  <h3 class="card-title mt-4">Compensation</h3>
                  <div class="row">
                    <template v-if="isSalaryBasedType">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label required">Monthly Salary</label>
                          <div class="input-group">
                            <span class="input-group-text">Rp</span>
                            <input
                              v-model="form.monthly_salary"
                              type="number"
                              class="form-control"
                              :class="{ 'is-invalid': errors.monthly_salary }"
                              placeholder="0"
                              min="0"
                              step="1000"
                              required
                            />
                          </div>
                          <div v-if="errors.monthly_salary" class="invalid-feedback">
                            {{ errors.monthly_salary }}
                          </div>
                        </div>
                      </div>
                    </template>

                    <template v-if="isHourlyBased">
                      <div class="col-md-6">
                        <div class="mb-3">
                          <label class="form-label required">Hourly Rate</label>
                          <div class="input-group">
                            <span class="input-group-text">Rp</span>
                            <input
                              v-model="form.hourly_rate"
                              type="number"
                              class="form-control"
                              :class="{ 'is-invalid': errors.hourly_rate }"
                              placeholder="0"
                              min="0"
                              step="1000"
                              required
                            />
                            <span class="input-group-text">/hour</span>
                          </div>
                          <div v-if="errors.hourly_rate" class="invalid-feedback">
                            {{ errors.hourly_rate }}
                          </div>
                        </div>
                      </div>
                    </template>
                  </div>
                </template>

                <!-- Form Actions -->
                <div class="mt-4 d-flex justify-content-between">
                  <router-link to="/employees" class="btn btn-link"> Cancel </router-link>
                  <button type="submit" class="btn btn-primary" :disabled="loading">
                    <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm me-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <svg
                      v-else
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon me-2"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path d="M12 5l0 14" />
                      <path d="M5 12l14 0" />
                    </svg>
                    {{ loading ? 'Creating...' : 'Create Employee' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeTypes } from '@/composables/useEmployeeTypes'
import { useNotifications } from '@/composables/useNotifications'
import { useFormLoading } from '@/composables/useLoading'
import { useFormShortcuts } from '@/composables/useKeyboardShortcuts'
import { useAccessibility } from '@/composables/useAccessibility'
import { usePerformance } from '@/composables/usePerformance'
import axios from 'axios'

const router = useRouter()

// Composables
const { showSuccess, showError, showLoading, dismissNotification } = useNotifications()
const { submitForm: submitWithLoading, isLoading } = useFormLoading()
const { announce, detectPreferences, skipLinks } = useAccessibility()
const { init: initPerformance, cleanup: cleanupPerformance, monitoring } = usePerformance()

// Employee Types Composable
const {
  EMPLOYEE_TYPES,
  employeeTypeOptions,
  getEmployeeTypeConfig,
  isSalaryBased,
  isHourlyPayment,
  getFormFields
} = useEmployeeTypes()

// Form data
const form = reactive({
  employee_type: '',
  employee_id: '',
  name: '',
  email: '',
  phone: '',
  address: '',
  hire_date: '',
  is_active: true,
  // Teacher fields
  subject: '',
  grade_level: '',
  // Staff fields
  department: '',
  // Salary fields
  monthly_salary: null,
  hourly_rate: null
})

// Form state
const errors = ref({})
const loading = computed(() => isLoading('create-employee'))

// Options
const gradeOptions = ref([
  'Grade 1',
  'Grade 2',
  'Grade 3',
  'Grade 4',
  'Grade 5',
  'Grade 6',
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12'
])

const departmentOptions = ref([
  'Administration',
  'IT Support',
  'Library',
  'Facilities',
  'Security',
  'Cafeteria',
  'Health Office'
])

// Computed properties
const selectedTypeConfig = computed(() => {
  return form.employee_type ? getEmployeeTypeConfig(form.employee_type) : null
})

const isTeacher = computed(() => {
  return (
    form.employee_type === EMPLOYEE_TYPES.GURU_TETAP ||
    form.employee_type === EMPLOYEE_TYPES.GURU_HONORER
  )
})

const isStaff = computed(() => {
  return (
    form.employee_type === EMPLOYEE_TYPES.TENAGA_KEPENDIDIKAN ||
    form.employee_type === EMPLOYEE_TYPES.TENAGA_HONORER
  )
})

const isSalaryBasedType = computed(() => {
  return form.employee_type ? isSalaryBased(form.employee_type) : false
})

const isHourlyBased = computed(() => {
  return form.employee_type ? isHourlyPayment(form.employee_type) : false
})

// Methods
const handleTypeChange = () => {
  // Clear type-specific fields when type changes
  form.subject = ''
  form.grade_level = ''
  form.department = ''
  form.monthly_salary = null
  form.hourly_rate = null

  // Clear errors
  errors.value = {}
}

const validateForm = () => {
  const newErrors = {}

  // Basic validation
  if (!form.employee_type) newErrors.employee_type = 'Employee type is required'
  if (!form.employee_id) newErrors.employee_id = 'Employee ID is required'
  if (!form.name) newErrors.name = 'Name is required'
  if (!form.email) newErrors.email = 'Email is required'
  if (!form.hire_date) newErrors.hire_date = 'Hire date is required'

  // Type-specific validation
  if (isTeacher.value && !form.subject) {
    newErrors.subject = 'Subject is required for teachers'
  }

  if (isStaff.value && !form.department) {
    newErrors.department = 'Department is required for staff'
  }

  if (isSalaryBasedType.value && !form.monthly_salary) {
    newErrors.monthly_salary = 'Monthly salary is required'
  }

  if (isHourlyBased.value && !form.hourly_rate) {
    newErrors.hourly_rate = 'Hourly rate is required'
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (form.email && !emailRegex.test(form.email)) {
    newErrors.email = 'Please enter a valid email address'
  }

  errors.value = newErrors

  // Announce validation errors to screen readers
  if (Object.keys(newErrors).length > 0) {
    const errorCount = Object.keys(newErrors).length
    announce(
      `Form has ${errorCount} error${errorCount > 1 ? 's' : ''}. Please review and correct.`,
      'assertive'
    )
  }

  return Object.keys(newErrors).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    showError('Please check the form for errors and try again.', {
      title: 'Validation Error'
    })
    return
  }

  const result = await submitWithLoading(
    'create-employee',
    async () => {
      // TODO: Replace with actual API call
      console.log('Creating employee:', form)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Simulate success response
      return {
        success: true,
        data: {
          id: Math.floor(Math.random() * 1000),
          name: form.name
        }
      }

      // Actual API call would be:
      // const response = await axios.post('/api/v1/employees', form)
      // return response.data
    },
    { overlay: true }
  )

  if (result?.success) {
    const employee = result.data

    // Announce success to screen readers
    announce(`Employee ${employee.name} has been created successfully`, 'polite')

    // Show success message
    showSuccess(`Employee "${employee.name}" has been created successfully!`, {
      title: 'Employee Created',
      actions: [
        {
          key: 'view',
          label: 'View Employee',
          variant: 'primary'
        }
      ],
      onAction: action => {
        if (action.key === 'view') {
          // Navigate to employee details (would use actual ID from API response)
          router.push(`/employees/${employee.id}`)
        }
      }
    })

    // Redirect to employee list
    setTimeout(() => {
      router.push('/employees')
    }, 2000)
  }
}

// Setup form shortcuts
useFormShortcuts({
  save: () => submitForm(),
  cancel: () => router.push('/employees'),
  reset: () => {
    // Reset form to initial state
    Object.keys(form).forEach(key => {
      if (typeof form[key] === 'string') form[key] = ''
      else if (typeof form[key] === 'number') form[key] = null
      else if (typeof form[key] === 'boolean') form[key] = key === 'is_active'
    })
    errors.value = {}
  }
})

// Auto-generate employee ID based on type
watch(
  () => form.employee_type,
  newType => {
    if (newType && !form.employee_id) {
      const typeMap = {
        [EMPLOYEE_TYPES.TENAGA_KEPENDIDIKAN]: 'TK',
        [EMPLOYEE_TYPES.GURU_TETAP]: 'GT',
        [EMPLOYEE_TYPES.GURU_HONORER]: 'GH',
        [EMPLOYEE_TYPES.TENAGA_HONORER]: 'TH'
      }

      const prefix = typeMap[newType] || 'EMP'
      const timestamp = Date.now().toString().slice(-6)
      form.employee_id = `${prefix}${timestamp}`
    }
  }
)

// Initialize accessibility and performance
onMounted(() => {
  detectPreferences()
  initPerformance()

  // Add skip links
  skipLinks.addToPage([{ target: 'employee-form', text: 'Skip to employee form' }])

  // Mark performance measurement start
  monitoring.mark('employee-create-page-start')
})

onUnmounted(() => {
  cleanupPerformance()
  monitoring.mark('employee-create-page-end')
  monitoring.measure(
    'employee-create-page-duration',
    'employee-create-page-start',
    'employee-create-page-end'
  )
})
</script>

<style scoped>
.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #354052;
}

.form-label.required::after {
  content: ' *';
  color: #d63384;
}

.input-group-text {
  background-color: #f8f9fa;
  border-color: #dee2e6;
  color: #6c757d;
}

.form-hint {
  color: #6c757d;
  font-size: 0.875rem;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}
</style>
