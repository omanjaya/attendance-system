<template>
  <div class="container-xl">
    <div class="page-header d-print-none">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="page-title">Face Recognition Setup</h2>
          <div class="text-muted mt-1">Register and manage employee face recognition</div>
        </div>
        <div class="col-auto ms-auto d-print-none">
          <div class="btn-list">
            <button class="btn btn-outline-secondary" @click="refreshEmployeeList">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
                <path d="M21 3v5h-5"/>
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
                <path d="M3 21v-5h5"/>
              </svg>
              Refresh
            </button>
            <button class="btn btn-primary" @click="showRegisterModal = true">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                <path d="M12 5v14"/>
                <path d="M5 12h14"/>
              </svg>
              Register New Face
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- Service Status Card -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Face Recognition Service Status
              </h3>
            </div>
            <div class="card-body">
              <div v-if="serviceLoading" class="d-flex align-items-center">
                <div class="spinner-border spinner-border-sm me-2"></div>
                <span>Checking service status...</span>
              </div>
              <div v-else-if="serviceStatus" class="row">
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label">Service Status</label>
                    <div>
                      <span class="badge bg-success">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-1">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        {{ serviceStatus.status }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label">Face Recognition</label>
                    <div>
                      <span class="badge" :class="serviceStatus.services?.face_recognition === 'operational' ? 'bg-success' : 'bg-danger'">
                        {{ serviceStatus.services?.face_recognition || 'unknown' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label">MediaPipe</label>
                    <div>
                      <span class="badge" :class="serviceStatus.services?.mediapipe === 'operational' ? 'bg-success' : 'bg-danger'">
                        {{ serviceStatus.services?.mediapipe || 'unknown' }}
                      </span>
                    </div>
                  </div>
                </div>
                <div class="col-md-3">
                  <div class="mb-3">
                    <label class="form-label">Last Check</label>
                    <div class="text-muted">{{ formatTimestamp(serviceStatus.timestamp) }}</div>
                  </div>
                </div>
              </div>
              <div v-else class="alert alert-danger">
                <h4 class="alert-title">Service Unavailable</h4>
                <div class="text-muted">Face recognition service is not responding. Please check if the service is running.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Registered Employees -->
      <div class="row">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Registered Employees ({{ registeredEmployees.length }})
              </h3>
            </div>
            <div class="card-body">
              <div v-if="employeesLoading" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
                <div class="mt-2">Loading registered employees...</div>
              </div>
              <div v-else-if="registeredEmployees.length === 0" class="empty">
                <div class="empty-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <p class="empty-title">No employees registered</p>
                <p class="empty-subtitle text-muted">Start by registering your first employee for face recognition</p>
                <div class="empty-action">
                  <button class="btn btn-primary" @click="showRegisterModal = true">
                    Register First Employee
                  </button>
                </div>
              </div>
              <div v-else class="row">
                <div v-for="employee in registeredEmployees" :key="employee.employee_id" class="col-md-6 col-lg-4 mb-3">
                  <div class="card card-sm">
                    <div class="card-body">
                      <div class="row align-items-center">
                        <div class="col-auto">
                          <span class="avatar avatar-md bg-primary-lt">
                            {{ getInitials(employee.employee_name) }}
                          </span>
                        </div>
                        <div class="col">
                          <div class="font-weight-medium">{{ employee.employee_name }}</div>
                          <div class="text-muted">ID: {{ employee.employee_id }}</div>
                          <div class="mt-1">
                            <span v-if="employee.has_photo" class="badge bg-success-lt">
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-1">
                                <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                                <circle cx="9" cy="9" r="2"/>
                                <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                              </svg>
                              Photo Available
                            </span>
                            <span v-else class="badge bg-warning-lt">No Photo</span>
                          </div>
                        </div>
                        <div class="col-auto">
                          <div class="dropdown">
                            <button class="btn btn-white btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                              Actions
                            </button>
                            <div class="dropdown-menu dropdown-menu-end">
                              <a class="dropdown-item" href="#" @click.prevent="testRecognition(employee)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                                  <circle cx="12" cy="12" r="3"/>
                                </svg>
                                Test Recognition
                              </a>
                              <div class="dropdown-divider"></div>
                              <a class="dropdown-item text-danger" href="#" @click.prevent="removeEmployee(employee)">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                                  <polyline points="3 6 5 6 21 6"/>
                                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                                </svg>
                                Remove
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Register Face Modal -->
    <div v-if="showRegisterModal" class="modal modal-blur fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Register Employee Face</h5>
            <button type="button" class="btn-close" @click="closeRegisterModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-6">
                <div class="mb-3">
                  <label class="form-label">Select Employee</label>
                  <select v-model="selectedEmployee" class="form-select" :disabled="registerLoading">
                    <option value="">Choose an employee...</option>
                    <option v-for="emp in availableEmployees" :key="emp.id" :value="emp">
                      {{ emp.name }} ({{ emp.employee_id }})
                    </option>
                  </select>
                </div>
                <div class="mb-3">
                  <label class="form-label">Upload Photo</label>
                  <input 
                    type="file" 
                    class="form-control" 
                    accept="image/*" 
                    @change="handleFileUpload"
                    :disabled="registerLoading"
                  >
                  <div class="form-hint">Upload a clear photo showing the employee's face</div>
                </div>
                <div v-if="imagePreview" class="mb-3">
                  <label class="form-label">Preview</label>
                  <div class="text-center">
                    <img :src="imagePreview" alt="Preview" class="img-thumbnail" style="max-width: 200px; max-height: 200px;">
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="card">
                  <div class="card-header">
                    <h4 class="card-title">Requirements</h4>
                  </div>
                  <div class="card-body">
                    <ul class="list-unstyled">
                      <li class="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon text-success me-2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Clear, well-lit photo
                      </li>
                      <li class="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon text-success me-2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Face looking directly at camera
                      </li>
                      <li class="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon text-success me-2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        No sunglasses or face covering
                      </li>
                      <li class="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon text-success me-2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Only one person in photo
                      </li>
                      <li class="mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon text-success me-2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        Minimum 200x200 pixels
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeRegisterModal" :disabled="registerLoading">
              Cancel
            </button>
            <button 
              type="button" 
              class="btn btn-primary" 
              @click="registerFace"
              :disabled="!selectedEmployee || !selectedFile || registerLoading"
            >
              <span v-if="registerLoading" class="spinner-border spinner-border-sm me-2"></span>
              {{ registerLoading ? 'Registering...' : 'Register Face' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
    <div v-if="showRegisterModal" class="modal-backdrop fade show" @click="closeRegisterModal"></div>

    <!-- Alerts -->
    <div v-if="alertMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
      <div class="alert" :class="{
        'alert-success': alertType === 'success',
        'alert-danger': alertType === 'error',
        'alert-warning': alertType === 'warning'
      }" role="alert">
        <div class="d-flex">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path v-if="alertType === 'success'" d="M9 12l2 2 4-4"/>
              <path v-else-if="alertType === 'warning'" d="M12 9v2m0 4v.01"/>
              <path v-else d="M18 6L6 18M6 6l12 12"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div>
            <h4 class="alert-title">{{ alertType === 'success' ? 'Success!' : alertType === 'warning' ? 'Warning!' : 'Error!' }}</h4>
            <div class="text-muted">{{ alertMessage }}</div>
          </div>
          <button type="button" class="btn-close" @click="clearAlert"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { faceRecognitionService } from '@/services/faceRecognitionService'
import { employeeService } from '@/services/employeeService'

// State
const serviceStatus = ref(null)
const serviceLoading = ref(false)
const registeredEmployees = ref([])
const employeesLoading = ref(false)
const allEmployees = ref([])
const showRegisterModal = ref(false)
const selectedEmployee = ref('')
const selectedFile = ref(null)
const imagePreview = ref('')
const registerLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('')

// Computed
const availableEmployees = computed(() => {
  const registeredIds = registeredEmployees.value.map(emp => emp.employee_id)
  return allEmployees.value.filter(emp => !registeredIds.includes(emp.employee_id))
})

// Methods
const checkServiceStatus = async () => {
  serviceLoading.value = true
  try {
    serviceStatus.value = await faceRecognitionService.healthCheck()
  } catch (error) {
    console.error('Service status check failed:', error)
    serviceStatus.value = null
  } finally {
    serviceLoading.value = false
  }
}

const loadRegisteredEmployees = async () => {
  employeesLoading.value = true
  try {
    const response = await faceRecognitionService.listRegisteredEmployees()
    if (response.success) {
      registeredEmployees.value = response.employees
    }
  } catch (error) {
    console.error('Failed to load registered employees:', error)
    showAlert('Failed to load registered employees', 'error')
  } finally {
    employeesLoading.value = false
  }
}

const loadAllEmployees = async () => {
  try {
    const response = await employeeService.getAll()
    if (response.success) {
      allEmployees.value = response.data.data || response.data
    }
  } catch (error) {
    console.error('Failed to load employees:', error)
  }
}

const refreshEmployeeList = async () => {
  await Promise.all([
    loadRegisteredEmployees(),
    loadAllEmployees()
  ])
}

const handleFileUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    
    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      imagePreview.value = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

const registerFace = async () => {
  if (!selectedEmployee.value || !selectedFile.value) {
    showAlert('Please select an employee and upload a photo', 'warning')
    return
  }

  registerLoading.value = true
  try {
    const response = await faceRecognitionService.registerFace(
      selectedEmployee.value.employee_id,
      selectedEmployee.value.name,
      selectedFile.value
    )

    if (response.success) {
      showAlert(`Face registered successfully for ${response.employee_name}`, 'success')
      closeRegisterModal()
      await loadRegisteredEmployees()
    } else {
      showAlert(response.message || 'Failed to register face', 'error')
    }
  } catch (error) {
    console.error('Face registration failed:', error)
    let message = 'Failed to register face'
    
    if (error.response?.status === 400) {
      message = error.response.data?.detail || 'Invalid image or no face detected'
    } else if (error.response?.status === 500) {
      message = 'Server error during face registration'
    }
    
    showAlert(message, 'error')
  } finally {
    registerLoading.value = false
  }
}

const removeEmployee = async (employee) => {
  if (confirm(`Are you sure you want to remove face data for ${employee.employee_name}?`)) {
    try {
      const response = await faceRecognitionService.removeFace(employee.employee_id)
      if (response.success) {
        showAlert(`Face data removed for ${employee.employee_name}`, 'success')
        await loadRegisteredEmployees()
      }
    } catch (error) {
      console.error('Failed to remove face data:', error)
      showAlert('Failed to remove face data', 'error')
    }
  }
}

const testRecognition = async (employee) => {
  showAlert('Test recognition feature coming soon!', 'warning')
  // TODO: Implement test recognition
}

const closeRegisterModal = () => {
  showRegisterModal.value = false
  selectedEmployee.value = ''
  selectedFile.value = null
  imagePreview.value = ''
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown'
  return new Date(timestamp).toLocaleString()
}

const showAlert = (message, type = 'success') => {
  alertMessage.value = message
  alertType.value = type
  setTimeout(clearAlert, 5000)
}

const clearAlert = () => {
  alertMessage.value = ''
  alertType.value = ''
}

// Lifecycle
onMounted(async () => {
  await Promise.all([
    checkServiceStatus(),
    loadRegisteredEmployees(),
    loadAllEmployees()
  ])
})
</script>

<style scoped>
.modal-backdrop {
  background-color: rgba(var(--tblr-body-color-rgb), 0.32);
}

.alert-icon {
  margin-right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.img-thumbnail {
  border-radius: var(--tblr-border-radius);
}

.avatar-md {
  width: 3rem;
  height: 3rem;
  font-size: 1rem;
}

.empty-icon svg {
  width: 3rem;
  height: 3rem;
  color: var(--tblr-text-muted);
}
</style>