<template>
  <div class="employee-form">
    <form novalidate @submit.prevent="handleSubmit">
      <!-- Basic Information -->
      <div class="card mb-3">
        <div class="card-header">
          <h4 class="card-title">
            <TablerIcon name="user" class="me-2" />
            Basic Information
          </h4>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- Photo Upload -->
            <div class="col-12 col-md-3 mb-3">
              <div class="text-center">
                <div class="avatar avatar-xl mb-3 mx-auto position-relative">
                  <img
                    v-if="photoPreview || form.photo"
                    :src="photoPreview || form.photo"
                    alt="Employee photo"
                    class="avatar-img"
                  />
                  <span v-else class="avatar-placeholder">
                    {{ getInitials(form.name) }}
                  </span>

                  <!-- Photo Upload Button -->
                  <button type="button" class="avatar-upload-btn" @click="$refs.photoInput.click()">
                    <TablerIcon name="camera" size="sm" />
                  </button>
                </div>

                <input
                  ref="photoInput"
                  type="file"
                  accept="image/*"
                  class="d-none"
                  @change="handlePhotoUpload"
                />

                <div class="small text-muted">
                  Click to upload photo<br />
                  (Max 2MB, JPG/PNG)
                </div>
              </div>
            </div>

            <div class="col-12 col-md-9">
              <div class="row">
                <!-- Full Name -->
                <div class="col-md-6">
                  <FormField
                    v-model="form.name"
                    label="Full Name"
                    type="text"
                    placeholder="Enter full name"
                    required
                    :error="errors.name"
                    @blur="validateField('name')"
                  />
                </div>

                <!-- Employee ID -->
                <div class="col-md-6">
                  <FormField
                    v-model="form.employee_id"
                    label="Employee ID"
                    type="text"
                    placeholder="Enter employee ID"
                    required
                    :error="errors.employee_id"
                    @blur="validateField('employee_id')"
                  />
                </div>

                <!-- Email -->
                <div class="col-md-6">
                  <FormField
                    v-model="form.email"
                    label="Email Address"
                    type="email"
                    placeholder="Enter email address"
                    required
                    :error="errors.email"
                    @blur="validateField('email')"
                  />
                </div>

                <!-- Phone -->
                <div class="col-md-6">
                  <FormField
                    v-model="form.phone"
                    label="Phone Number"
                    type="tel"
                    placeholder="Enter phone number"
                    :error="errors.phone"
                    @blur="validateField('phone')"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Employment Details -->
      <div class="card mb-3">
        <div class="card-header">
          <h4 class="card-title">
            <TablerIcon name="briefcase" class="me-2" />
            Employment Details
          </h4>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- Employee Type -->
            <div class="col-md-6">
              <FormField
                v-model="form.employee_type"
                label="Employee Type"
                type="select"
                :options="employeeTypes"
                placeholder="Select employee type"
                required
                :error="errors.employee_type"
                @change="validateField('employee_type')"
              />
            </div>

            <!-- Department -->
            <div class="col-md-6">
              <FormField
                v-model="form.department_id"
                label="Department"
                type="select"
                :options="departments"
                placeholder="Select department"
                required
                :error="errors.department_id"
                @change="validateField('department_id')"
              />
            </div>

            <!-- Position -->
            <div class="col-md-6">
              <FormField
                v-model="form.position"
                label="Position/Job Title"
                type="text"
                placeholder="Enter position"
                required
                :error="errors.position"
                @blur="validateField('position')"
              />
            </div>

            <!-- Hire Date -->
            <div class="col-md-6">
              <FormField
                v-model="form.hire_date"
                label="Hire Date"
                type="date"
                required
                :error="errors.hire_date"
                @change="validateField('hire_date')"
              />
            </div>

            <!-- Salary -->
            <div class="col-md-6">
              <FormField
                v-model="form.salary"
                label="Basic Salary"
                type="number"
                placeholder="Enter basic salary"
                :min="0"
                step="0.01"
                :error="errors.salary"
                @blur="validateField('salary')"
              />
            </div>

            <!-- Status -->
            <div class="col-md-6">
              <FormField
                v-model="form.is_active"
                label="Employment Status"
                type="select"
                :options="statusOptions"
                required
                :error="errors.is_active"
                @change="validateField('is_active')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Personal Information -->
      <div class="card mb-3">
        <div class="card-header">
          <h4 class="card-title">
            <TablerIcon name="id" class="me-2" />
            Personal Information
          </h4>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- Date of Birth -->
            <div class="col-md-6">
              <FormField
                v-model="form.date_of_birth"
                label="Date of Birth"
                type="date"
                :error="errors.date_of_birth"
                @change="validateField('date_of_birth')"
              />
            </div>

            <!-- Gender -->
            <div class="col-md-6">
              <FormField
                v-model="form.gender"
                label="Gender"
                type="select"
                :options="genderOptions"
                placeholder="Select gender"
                :error="errors.gender"
                @change="validateField('gender')"
              />
            </div>

            <!-- Address -->
            <div class="col-12">
              <FormField
                v-model="form.address"
                label="Address"
                type="textarea"
                placeholder="Enter full address"
                :rows="3"
                :error="errors.address"
                @blur="validateField('address')"
              />
            </div>

            <!-- Emergency Contact -->
            <div class="col-md-6">
              <FormField
                v-model="form.emergency_contact_name"
                label="Emergency Contact Name"
                type="text"
                placeholder="Enter emergency contact name"
                :error="errors.emergency_contact_name"
                @blur="validateField('emergency_contact_name')"
              />
            </div>

            <div class="col-md-6">
              <FormField
                v-model="form.emergency_contact_phone"
                label="Emergency Contact Phone"
                type="tel"
                placeholder="Enter emergency contact phone"
                :error="errors.emergency_contact_phone"
                @blur="validateField('emergency_contact_phone')"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Account Settings (only for create mode) -->
      <div v-if="mode === 'create'" class="card mb-3">
        <div class="card-header">
          <h4 class="card-title">
            <TablerIcon name="key" class="me-2" />
            Account Settings
          </h4>
        </div>
        <div class="card-body">
          <div class="row">
            <!-- Password -->
            <div class="col-md-6">
              <FormField
                v-model="form.password"
                label="Password"
                type="password"
                placeholder="Enter password"
                :required="mode === 'create'"
                :error="errors.password"
                help-text="Minimum 8 characters with at least one letter and one number"
                @blur="validateField('password')"
              />
            </div>

            <!-- Confirm Password -->
            <div class="col-md-6">
              <FormField
                v-model="form.password_confirmation"
                label="Confirm Password"
                type="password"
                placeholder="Confirm password"
                :required="mode === 'create'"
                :error="errors.password_confirmation"
                @blur="validateField('password_confirmation')"
              />
            </div>

            <!-- Send Welcome Email -->
            <div class="col-12">
              <FormField
                v-model="form.send_welcome_email"
                type="checkbox"
                checkbox-label="Send welcome email with login credentials"
                help-text="Employee will receive an email with their login information"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Form Actions -->
      <div class="card">
        <div class="card-body">
          <div class="row">
            <div class="col-12">
              <div class="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  class="btn btn-outline-secondary"
                  :disabled="loading"
                  @click="handleCancel"
                >
                  Cancel
                </button>

                <button type="submit" class="btn btn-primary" :disabled="loading || !isFormValid">
                  <LoadingSpinner v-if="loading" size="sm" class="me-2" />
                  <TablerIcon v-else :name="mode === 'create' ? 'plus' : 'check'" class="me-2" />
                  {{ mode === 'create' ? 'Create Employee' : 'Update Employee' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useEmployeeStore } from '@/stores/modules/employee'
import { useNotifications } from '@/composables/useNotifications'
import FormField from '@/components/common/FormField.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import TablerIcon from '@/components/common/TablerIcon.vue'

const props = defineProps({
  employee: {
    type: Object,
    default: null
  },
  mode: {
    type: String,
    default: 'create',
    validator: value => ['create', 'edit'].includes(value)
  }
})

const emit = defineEmits(['success', 'cancel'])

// Composables
const employeeStore = useEmployeeStore()
const { showNotification } = useNotifications()

// State
const loading = ref(false)
const photoPreview = ref('')
const photoFile = ref(null)

// Form data
const form = reactive({
  name: '',
  employee_id: '',
  email: '',
  phone: '',
  employee_type: '',
  department_id: '',
  position: '',
  hire_date: '',
  salary: '',
  is_active: true,
  date_of_birth: '',
  gender: '',
  address: '',
  emergency_contact_name: '',
  emergency_contact_phone: '',
  password: '',
  password_confirmation: '',
  send_welcome_email: true,
  photo: ''
})

// Validation errors
const errors = reactive({})

// Options
const employeeTypes = ref([
  { label: 'Full Time', value: 'full_time' },
  { label: 'Part Time', value: 'part_time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Intern', value: 'intern' },
  { label: 'Temporary', value: 'temporary' }
])

const statusOptions = ref([
  { label: 'Active', value: true },
  { label: 'Inactive', value: false }
])

const genderOptions = ref([
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not to say', value: 'not_specified' }
])

const departments = ref([
  { label: 'Human Resources', value: 1 },
  { label: 'Information Technology', value: 2 },
  { label: 'Finance', value: 3 },
  { label: 'Operations', value: 4 },
  { label: 'Marketing', value: 5 },
  { label: 'Sales', value: 6 }
])

// Computed
const isFormValid = computed(() => {
  const requiredFields = [
    'name',
    'employee_id',
    'email',
    'employee_type',
    'department_id',
    'position',
    'hire_date'
  ]

  if (props.mode === 'create') {
    requiredFields.push('password', 'password_confirmation')
  }

  return requiredFields.every(field => {
    return form[field] && form[field] !== '' && !errors[field]
  })
})

// Methods
const initializeForm = () => {
  if (props.employee && props.mode === 'edit') {
    Object.keys(form).forEach(key => {
      if (props.employee[key] !== undefined) {
        form[key] = props.employee[key]
      }
    })

    // Handle department
    if (props.employee.department) {
      form.department_id = props.employee.department.id
    }
  } else {
    // Generate employee ID for new employees
    form.employee_id = generateEmployeeId()
  }
}

const generateEmployeeId = () => {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')
  return `EMP${year}${random}`
}

const validateField = fieldName => {
  const value = form[fieldName]
  let error = ''

  switch (fieldName) {
  case 'name':
    if (!value || value.trim().length < 2) {
      error = 'Name must be at least 2 characters long'
    }
    break

  case 'employee_id':
    if (!value || value.trim().length < 3) {
      error = 'Employee ID must be at least 3 characters long'
    }
    break

  case 'email':
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      error = 'Email is required'
    } else if (!emailRegex.test(value)) {
      error = 'Please enter a valid email address'
    }
    break

  case 'phone':
    if (value && !/^[\d\s\-\+\(\)]{10,}$/.test(value)) {
      error = 'Please enter a valid phone number'
    }
    break

  case 'password':
    if (props.mode === 'create') {
      if (!value) {
        error = 'Password is required'
      } else if (value.length < 8) {
        error = 'Password must be at least 8 characters long'
      } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(value)) {
        error = 'Password must contain at least one letter and one number'
      }
    }
    break

  case 'password_confirmation':
    if (props.mode === 'create') {
      if (!value) {
        error = 'Please confirm your password'
      } else if (value !== form.password) {
        error = 'Passwords do not match'
      }
    }
    break

  case 'hire_date':
    if (!value) {
      error = 'Hire date is required'
    } else if (new Date(value) > new Date()) {
      error = 'Hire date cannot be in the future'
    }
    break

  case 'date_of_birth':
    if (value) {
      const birthDate = new Date(value)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()

      if (birthDate > today) {
        error = 'Date of birth cannot be in the future'
      } else if (age < 16) {
        error = 'Employee must be at least 16 years old'
      } else if (age > 100) {
        error = 'Please enter a valid date of birth'
      }
    }
    break

  case 'salary':
    if (value && (isNaN(value) || parseFloat(value) < 0)) {
      error = 'Salary must be a positive number'
    }
    break
  }

  if (error) {
    errors[fieldName] = error
  } else {
    delete errors[fieldName]
  }
}

const validateForm = () => {
  const fieldsToValidate = Object.keys(form)
  fieldsToValidate.forEach(field => validateField(field))
  return Object.keys(errors).length === 0
}

const handlePhotoUpload = event => {
  const file = event.target.files[0]
  if (!file) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    showNotification({
      type: 'error',
      title: 'Invalid File',
      message: 'Please select an image file (JPG, PNG, etc.)'
    })
    return
  }

  // Validate file size (2MB)
  if (file.size > 2 * 1024 * 1024) {
    showNotification({
      type: 'error',
      title: 'File Too Large',
      message: 'Please select an image smaller than 2MB'
    })
    return
  }

  photoFile.value = file

  // Create preview
  const reader = new FileReader()
  reader.onload = e => {
    photoPreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const handleSubmit = async () => {
  if (!validateForm()) {
    showNotification({
      type: 'error',
      title: 'Validation Error',
      message: 'Please fix the errors in the form'
    })
    return
  }

  loading.value = true

  try {
    let employee

    if (props.mode === 'create') {
      employee = await employeeStore.create(form)
    } else {
      employee = await employeeStore.update(props.employee.id, form)
    }

    // Upload photo if provided
    if (photoFile.value) {
      await employeeStore.uploadPhoto(employee.id, photoFile.value)
    }

    emit('success', employee)
  } catch (error) {
    console.error('Form submission error:', error)

    // Handle validation errors from server
    if (error.response?.data?.errors) {
      Object.keys(error.response.data.errors).forEach(field => {
        errors[field] = error.response.data.errors[field][0]
      })
    }

    showNotification({
      type: 'error',
      title: 'Submission Failed',
      message: error.response?.data?.message || 'Failed to save employee data'
    })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  emit('cancel')
}

const getInitials = name => {
  if (!name) return 'NA'
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Watchers
watch(
  () => form.password,
  () => {
    if (form.password_confirmation) {
      validateField('password_confirmation')
    }
  }
)

// Lifecycle
onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
.employee-form {
  max-width: 100%;
}

.avatar {
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

.avatar-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: var(--tblr-primary);
  color: white;
  font-weight: 600;
  font-size: 1.5rem;
}

.avatar-upload-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  border: 2px solid white;
  background-color: var(--tblr-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.avatar-upload-btn:hover {
  background-color: var(--tblr-primary-hover);
  transform: scale(1.1);
}

.card-title {
  display: flex;
  align-items: center;
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

/* Form validation styles */
.is-invalid {
  border-color: var(--tblr-danger);
}

.invalid-feedback {
  display: block;
  color: var(--tblr-danger);
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Responsive design */
@media (max-width: 768px) {
  .card-body {
    padding: 1rem;
  }

  .avatar {
    margin-bottom: 1rem;
  }

  .d-flex.justify-content-end {
    flex-direction: column;
    gap: 0.5rem;
  }

  .d-flex.justify-content-end .btn {
    width: 100%;
  }
}

/* Dark mode support */
:root.dark .avatar-upload-btn {
  border-color: var(--tblr-dark-mode-bg);
}

:root.dark .avatar-placeholder {
  background-color: var(--tblr-primary-dark);
}
</style>
