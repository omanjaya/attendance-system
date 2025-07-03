<template>
  <div class="page-body">
    <div class="container-xl">
      <div class="page-header d-print-none">
        <div class="row g-2 align-items-center">
          <div class="col">
            <h2 class="page-title">Edit Employee</h2>
            <div class="page-subtitle">Update employee information and settings</div>
          </div>
          <div class="col-auto ms-auto d-print-none">
            <div class="btn-list">
              <router-link :to="`/employees/${employeeId}`" class="btn btn-outline-primary">
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
                  <path d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                  <path d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6" />
                </svg>
                View
              </router-link>
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

      <div class="row row-deck row-cards">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">Employee Information</h3>
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="card-body">
              <div class="text-center py-5">
                <div class="spinner-border text-primary" role="status"></div>
                <div class="mt-2">Loading employee data...</div>
              </div>
            </div>

            <!-- Employee Not Found -->
            <div v-else-if="!employee" class="card-body">
              <div class="empty">
                <div class="empty-icon">
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
                    <circle cx="10" cy="10" r="7" />
                    <path d="m21 21l-6 -6" />
                  </svg>
                </div>
                <p class="empty-title">Employee not found</p>
                <p class="empty-subtitle text-muted">
                  The employee you're looking for doesn't exist or has been deleted.
                </p>
                <div class="empty-action">
                  <router-link to="/employees" class="btn btn-primary">
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
                      <path d="m9 14l-4 -4l4 -4" />
                      <path d="M5 10h11a4 4 0 1 1 0 8h-1" />
                    </svg>
                    Go back
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Employee Form -->
            <div v-else class="card-body">
              <form @submit.prevent="submitForm">
                <!-- Employee Type Selection -->
                <div class="row">
                  <div class="col-12">
                    <div class="mb-3">
                      <label class="form-label required">Employee Type</label>
                      <select
                        v-model="form.employee_type"
                        class="form-select"
                        :class="{ 'is-invalid': errors.employee_type }"
                        required
                        @change="handleTypeChange"
                      >
                        <option value="">Select Employee Type</option>
                        <option v-for="type in employeeTypeOptions" :key="type.value" :value="type.value">
                          {{ type.label }}
                        </option>
                      </select>
                      <div v-if="errors.employee_type" class="invalid-feedback">
                        {{ errors.employee_type }}
                      </div>
                      <small v-if="selectedTypeConfig" class="form-hint">
                        {{ selectedTypeConfig.description }}
                      </small>
                    </div>
                  </div>
                </div>

                <!-- Basic Information -->
                <h3 class="card-title mt-4">Basic Information</h3>
                <div class="row">
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label required">Employee ID</label>
                      <input
                        v-model="form.employee_id"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.employee_id }"
                        placeholder="Enter employee ID"
                        required
                      />
                      <div v-if="errors.employee_id" class="invalid-feedback">
                        {{ errors.employee_id }}
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="mb-3">
                      <label class="form-label required">Full Name</label>
                      <input
                        v-model="form.name"
                        type="text"
                        class="form-control"
                        :class="{ 'is-invalid': errors.name }"
                        placeholder="Enter full name"
                        required
                      />
                      <div v-if="errors.name" class="invalid-feedback">
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

                <div class="card-footer text-end">
                  <div class="d-flex">
                    <router-link to="/employees" class="btn btn-link">Cancel</router-link>
                    <button type="submit" class="btn btn-primary ms-auto" :disabled="saving">
                      <span v-if="saving" class="spinner-border spinner-border-sm me-2" role="status"></span>
                      <svg
                        v-else
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
                        <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1" />
                        <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z" />
                        <path d="M16 5l3 3" />
                      </svg>
                      {{ saving ? 'Saving...' : 'Update Employee' }}
                    </button>
                  </div>
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
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useEmployeeTypes } from '@/composables/useEmployeeTypes'
import axios from 'axios'

const route = useRoute()
const router = useRouter()

// Get employee ID from route params
const employeeId = computed(() => route.params.id)

// Employee Types Composable
const { EMPLOYEE_TYPES, employeeTypeOptions, getEmployeeTypeConfig, isSalaryBased, isHourlyPayment } =
  useEmployeeTypes()

// State
const loading = ref(false)
const saving = ref(false)
const employee = ref(null)
const errors = ref({})

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
  return form.employee_type === EMPLOYEE_TYPES.GURU_TETAP || form.employee_type === EMPLOYEE_TYPES.GURU_HONORER
})

const isStaff = computed(() => {
  return (
    form.employee_type === EMPLOYEE_TYPES.TENAGA_KEPENDIDIKAN || form.employee_type === EMPLOYEE_TYPES.TENAGA_HONORER
  )
})

const isSalaryBasedType = computed(() => {
  return form.employee_type ? isSalaryBased(form.employee_type) : false
})

const isHourlyBased = computed(() => {
  return form.employee_type ? isHourlyPayment(form.employee_type) : false
})

// Methods
const loadEmployee = async () => {
  loading.value = true

  try {
    // TODO: Replace with actual API call
    // For now, generate dummy data based on ID
    await new Promise(resolve => setTimeout(resolve, 1000))

    const dummyEmployee = {
      id: parseInt(employeeId.value),
      name: 'John Doe',
      employee_id: `EMP${String(employeeId.value).padStart(3, '0')}`,
      email: `employee${employeeId.value}@school.edu`,
      phone: `+62812345${String(employeeId.value).padStart(4, '0')}`,
      employee_type: 'guru_tetap',
      department: 'Mathematics',
      subject: 'Mathematics',
      grade_level: 'Grade 10',
      hire_date: '2023-01-15',
      is_active: true,
      address: 'Jl. Contoh No. 123, Jakarta',
      monthly_salary: 5000000,
      hourly_rate: null
    }

    employee.value = dummyEmployee

    // Populate form with employee data
    Object.keys(form).forEach(key => {
      if (dummyEmployee[key] !== undefined) {
        form[key] = dummyEmployee[key]
      }
    })

    // Actual API call would be:
    // const response = await axios.get(`/api/v1/employees/${employeeId.value}`)
    // if (response.data.success) {
    //   employee.value = response.data.data
    //   // Populate form
    // }
  } catch (error) {
    console.error('Error loading employee:', error)
    employee.value = null
  } finally {
    loading.value = false
  }
}

const handleTypeChange = () => {
  // Clear type-specific fields when type changes but preserve if same type
  const previousType = employee.value?.employee_type
  if (form.employee_type !== previousType) {
    form.subject = ''
    form.grade_level = ''
    form.department = ''
    form.monthly_salary = null
    form.hourly_rate = null
  }

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
  return Object.keys(newErrors).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  saving.value = true

  try {
    // TODO: Replace with actual API call
    console.log('Updating employee:', form)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Show success message (you can use a toast library)
    alert('Employee updated successfully!')

    // Redirect to employee view or list
    router.push(`/employees/${employeeId.value}`)

    // Actual API call would be:
    // const response = await axios.put(`/api/v1/employees/${employeeId.value}`, form)
    // if (response.data.success) {
    //   router.push(`/employees/${employeeId.value}`)
    // }
  } catch (error) {
    console.error('Error updating employee:', error)

    // Handle validation errors from server
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      alert('Error updating employee. Please try again.')
    }
  } finally {
    saving.value = false
  }
}

// Load employee data on component mount
onMounted(() => {
  if (employeeId.value) {
    loadEmployee()
  }
})

// Watch for route changes
watch(
  () => route.params.id,
  newId => {
    if (newId) {
      loadEmployee()
    }
  }
)
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

.empty {
  text-align: center;
  padding: 2rem;
}

.empty-icon {
  margin-bottom: 1rem;
}

.empty-icon svg {
  width: 3rem;
  height: 3rem;
  opacity: 0.5;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  margin-bottom: 1.5rem;
}
</style>
