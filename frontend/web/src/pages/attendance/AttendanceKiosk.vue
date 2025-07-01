<template>
  <div class="container-xl">
    <div class="page-header d-print-none">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="page-title">Attendance Kiosk</h2>
          <div class="text-muted mt-1">{{ currentTime }}</div>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- Current Status Card -->
      <div class="row mb-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12,6 12,12 16,14"/>
                </svg>
                Today's Attendance Status
              </h3>
            </div>
            <div class="card-body">
              <div v-if="todayStatus" class="row">
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Clock In Time</label>
                    <div class="form-control-plaintext">
                      {{ todayStatus.clock_in ? formatTime(todayStatus.clock_in) : 'Not clocked in' }}
                    </div>
                  </div>
                </div>
                <div class="col-md-6">
                  <div class="mb-3">
                    <label class="form-label">Clock Out Time</label>
                    <div class="form-control-plaintext">
                      {{ todayStatus.clock_out ? formatTime(todayStatus.clock_out) : 'Not clocked out' }}
                    </div>
                  </div>
                </div>
              </div>
              <div v-else class="text-muted">
                No attendance record for today
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Clock In/Out Actions -->
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title text-success">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                  <path d="M9 12l2 2 4-4"/>
                  <circle cx="12" cy="12" r="10"/>
                </svg>
                Clock In
              </h3>
            </div>
            <div class="card-body text-center">
              <p class="text-muted mb-3">Start your workday</p>
              <div class="btn-list">
                <button 
                  class="btn btn-success btn-lg"
                  :disabled="isLoading || (todayStatus && todayStatus.clock_in && !todayStatus.clock_out)"
                  @click="clockIn"
                >
                  <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                  {{ todayStatus && todayStatus.clock_in && !todayStatus.clock_out ? 'Already Clocked In' : 'Clock In' }}
                </button>
                <button 
                  class="btn btn-outline-success"
                  :disabled="isLoading || (todayStatus && todayStatus.clock_in && !todayStatus.clock_out)"
                  @click="showFaceClockIn = true"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                  </svg>
                  Face Clock In
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title text-danger">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M15 9l-6 6"/>
                  <path d="M9 9l6 6"/>
                </svg>
                Clock Out
              </h3>
            </div>
            <div class="card-body text-center">
              <p class="text-muted mb-3">End your workday</p>
              <button 
                class="btn btn-danger btn-lg"
                :disabled="isLoading || !todayStatus || !todayStatus.clock_in || todayStatus.clock_out"
                @click="clockOut"
              >
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                {{ !todayStatus || !todayStatus.clock_in ? 'Clock In First' : 
                   todayStatus.clock_out ? 'Already Clocked Out' : 'Clock Out' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Attendance History -->
      <div class="row mt-4">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                  <path d="M3 3h18v18H3zM21 9H3"/>
                </svg>
                Recent Attendance
              </h3>
            </div>
            <div class="card-body">
              <div v-if="recentAttendance.length > 0" class="table-responsive">
                <table class="table table-vcenter">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Clock In</th>
                      <th>Clock Out</th>
                      <th>Total Hours</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="record in recentAttendance" :key="record.id">
                      <td>{{ formatDate(record.date) }}</td>
                      <td>{{ record.clock_in ? formatTime(record.clock_in) : '-' }}</td>
                      <td>{{ record.clock_out ? formatTime(record.clock_out) : '-' }}</td>
                      <td>{{ record.total_hours || '0' }} hours</td>
                      <td>
                        <span class="badge" :class="{
                          'bg-success': record.status === 'present',
                          'bg-warning': record.status === 'late',
                          'bg-danger': record.status === 'absent'
                        }">
                          {{ record.status }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-else class="text-muted text-center py-4">
                No attendance records found
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Face Recognition Modal -->
    <div v-if="showFaceClockIn" class="modal modal-blur fade show" style="display: block;" tabindex="-1">
      <div class="modal-dialog modal-lg modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Face Recognition Clock In</h5>
            <button type="button" class="btn-close" @click="closeFaceModal"></button>
          </div>
          <div class="modal-body">
            <div class="row">
              <div class="col-md-8">
                <div class="text-center">
                  <div v-if="!cameraActive" class="mb-3">
                    <button class="btn btn-primary" @click="startCamera">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      Start Camera
                    </button>
                  </div>
                  <div v-else class="position-relative">
                    <video ref="videoElement" autoplay muted class="img-fluid rounded" style="max-height: 300px;"></video>
                    <div class="position-absolute top-0 end-0 p-2">
                      <button class="btn btn-sm btn-danger" @click="stopCamera">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
                          <path d="m9 9 6 6"/>
                          <path d="m15 9-6 6"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div v-if="cameraActive" class="mb-3">
                    <button 
                      class="btn btn-success" 
                      @click="captureAndVerify"
                      :disabled="faceVerifying"
                    >
                      <span v-if="faceVerifying" class="spinner-border spinner-border-sm me-2"></span>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                        <circle cx="12" cy="13" r="4"/>
                      </svg>
                      {{ faceVerifying ? 'Verifying...' : 'Capture & Verify' }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="col-md-4">
                <div class="card">
                  <div class="card-header">
                    <h4 class="card-title">Recognition Status</h4>
                  </div>
                  <div class="card-body">
                    <div v-if="!faceResult" class="text-muted">
                      Position your face in front of the camera and click capture
                    </div>
                    <div v-else-if="faceResult.success" class="text-success">
                      <div class="d-flex align-items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                        <strong>Recognized!</strong>
                      </div>
                      <div class="mb-2">
                        <strong>Employee:</strong> {{ faceResult.employee_name }}
                      </div>
                      <div class="mb-2">
                        <strong>ID:</strong> {{ faceResult.employee_id }}
                      </div>
                      <div class="mb-2">
                        <strong>Confidence:</strong> {{ Math.round(faceResult.confidence * 100) }}%
                      </div>
                    </div>
                    <div v-else class="text-danger">
                      <div class="d-flex align-items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon me-2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="m15 9-6 6"/>
                          <path d="m9 9 6 6"/>
                        </svg>
                        <strong>Not Recognized</strong>
                      </div>
                      <div class="text-muted">{{ faceResult.message }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeFaceModal">Cancel</button>
            <button 
              type="button" 
              class="btn btn-success" 
              @click="faceClockIn"
              :disabled="!faceResult || !faceResult.success || isLoading"
            >
              <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
              Clock In with Face ID
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal backdrop -->
    <div v-if="showFaceClockIn" class="modal-backdrop fade show" @click="closeFaceModal"></div>

    <!-- Success/Error Alerts -->
    <div v-if="alertMessage" class="position-fixed bottom-0 end-0 p-3" style="z-index: 1050">
      <div class="alert" :class="{
        'alert-success': alertType === 'success',
        'alert-danger': alertType === 'error'
      }" role="alert">
        <div class="d-flex">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
              <path v-if="alertType === 'success'" d="M9 12l2 2 4-4"/>
              <path v-else d="M18 6L6 18M6 6l12 12"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
          </div>
          <div>
            <h4 class="alert-title">{{ alertType === 'success' ? 'Success!' : 'Error!' }}</h4>
            <div class="text-muted">{{ alertMessage }}</div>
          </div>
          <button type="button" class="btn-close" @click="clearAlert"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { attendanceService } from '@/services/attendanceService'
import { faceRecognitionService } from '@/services/faceRecognitionService'
import { locationService } from '@/services/locationService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// State
const currentTime = ref('')
const todayStatus = ref(null)
const recentAttendance = ref([])
const isLoading = ref(false)
const alertMessage = ref('')
const alertType = ref('')
const timeInterval = ref(null)

// Face recognition state
const showFaceClockIn = ref(false)
const cameraActive = ref(false)
const faceVerifying = ref(false)
const faceResult = ref(null)
const videoElement = ref(null)
const cameraStream = ref(null)

// Location state
const currentLocation = ref(null)
const locationValid = ref(null)
const locationLoading = ref(false)
const allowedLocations = ref(locationService.getDefaultSchoolLocations())

// Methods
const updateCurrentTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const formatTime = (datetime) => {
  if (!datetime) return '-'
  return new Date(datetime).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const showAlert = (message, type = 'success') => {
  alertMessage.value = message
  alertType.value = type
  setTimeout(() => {
    clearAlert()
  }, 5000)
}

const clearAlert = () => {
  alertMessage.value = ''
  alertType.value = ''
}

const fetchTodayStatus = async () => {
  try {
    const response = await attendanceService.getStatus()
    if (response.success) {
      todayStatus.value = response.data
    }
  } catch (error) {
    console.error('Error fetching today status:', error)
  }
}

const fetchRecentAttendance = async () => {
  try {
    const response = await attendanceService.getHistory({ limit: 7 })
    if (response.success) {
      recentAttendance.value = response.data
    }
  } catch (error) {
    console.error('Error fetching recent attendance:', error)
  }
}

const clockIn = async () => {
  // Validate location first
  if (!await validateCurrentLocation()) {
    return
  }

  isLoading.value = true
  try {
    const locationData = currentLocation.value ? {
      latitude: currentLocation.value.latitude,
      longitude: currentLocation.value.longitude,
      accuracy: currentLocation.value.accuracy,
      location_name: locationValid.value?.location || 'Office'
    } : { location_name: 'Office' }

    const response = await attendanceService.clockIn({
      ...locationData,
      notes: 'Clocked in from kiosk with location validation'
    })
    
    if (response.success) {
      showAlert('Successfully clocked in!', 'success')
      await fetchTodayStatus()
      await fetchRecentAttendance()
    } else {
      showAlert(response.message || 'Failed to clock in', 'error')
    }
  } catch (error) {
    console.error('Clock in error:', error)
    showAlert('Failed to clock in. Please try again.', 'error')
  } finally {
    isLoading.value = false
  }
}

const clockOut = async () => {
  isLoading.value = true
  try {
    const response = await attendanceService.clockOut({
      location: 'Office',
      notes: 'Clocked out from kiosk'
    })
    
    if (response.success) {
      showAlert('Successfully clocked out!', 'success')
      await fetchTodayStatus()
      await fetchRecentAttendance()
    } else {
      showAlert(response.message || 'Failed to clock out', 'error')
    }
  } catch (error) {
    console.error('Clock out error:', error)
    showAlert('Failed to clock out. Please try again.', 'error')
  } finally {
    isLoading.value = false
  }
}

// Face recognition methods
const startCamera = async () => {
  try {
    cameraStream.value = await navigator.mediaDevices.getUserMedia({ 
      video: { 
        width: 640, 
        height: 480,
        facingMode: 'user' 
      } 
    })
    
    if (videoElement.value) {
      videoElement.value.srcObject = cameraStream.value
      cameraActive.value = true
    }
  } catch (error) {
    console.error('Camera access error:', error)
    showAlert('Camera access denied or not available', 'error')
  }
}

const stopCamera = () => {
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
    cameraStream.value = null
  }
  cameraActive.value = false
  faceResult.value = null
}

const captureAndVerify = async () => {
  if (!videoElement.value) {
    showAlert('Camera not active', 'error')
    return
  }

  faceVerifying.value = true
  try {
    // Capture frame from video
    const canvas = document.createElement('canvas')
    canvas.width = videoElement.value.videoWidth
    canvas.height = videoElement.value.videoHeight
    
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoElement.value, 0, 0)
    
    // Convert to base64
    const base64Image = canvas.toDataURL('image/jpeg', 0.8)
    
    // Verify with face recognition service
    const result = await faceRecognitionService.verifyFace(base64Image)
    faceResult.value = result
    
    if (result.success) {
      showAlert(`Face recognized: ${result.employee_name}`, 'success')
    } else {
      showAlert(result.message || 'Face not recognized', 'error')
    }
  } catch (error) {
    console.error('Face verification error:', error)
    showAlert('Face verification failed. Please try again.', 'error')
  } finally {
    faceVerifying.value = false
  }
}

const faceClockIn = async () => {
  if (!faceResult.value || !faceResult.value.success) {
    showAlert('Face verification required first', 'error')
    return
  }

  isLoading.value = true
  try {
    const response = await attendanceService.clockIn({
      location: 'Office',
      notes: `Face recognition clock in - ${faceResult.value.employee_name} (${Math.round(faceResult.value.confidence * 100)}% confidence)`,
      verification_method: 'face_recognition',
      employee_id: faceResult.value.employee_id,
      confidence: faceResult.value.confidence
    })
    
    if (response.success) {
      showAlert(`Successfully clocked in with face recognition: ${faceResult.value.employee_name}`, 'success')
      closeFaceModal()
      await fetchTodayStatus()
      await fetchRecentAttendance()
    } else {
      showAlert(response.message || 'Failed to clock in', 'error')
    }
  } catch (error) {
    console.error('Face clock in error:', error)
    showAlert('Failed to clock in. Please try again.', 'error')
  } finally {
    isLoading.value = false
  }
}

const closeFaceModal = () => {
  stopCamera()
  showFaceClockIn.value = false
  faceResult.value = null
}

// Location validation methods
const getCurrentLocation = async () => {
  locationLoading.value = true
  try {
    const position = await locationService.getCurrentPosition()
    currentLocation.value = position
    
    // Validate against allowed locations
    const validation = locationService.validateLocation(
      position.latitude,
      position.longitude,
      allowedLocations.value
    )
    
    locationValid.value = validation
    
    if (validation.valid) {
      showAlert(`Location verified: ${validation.location}`, 'success')
    } else {
      showAlert(validation.message || 'Location not within allowed area', 'error')
    }
    
    return validation.valid
  } catch (error) {
    console.error('Location error:', error)
    showAlert(error.message || 'Failed to get location', 'error')
    return false
  } finally {
    locationLoading.value = false
  }
}

const validateCurrentLocation = async () => {
  if (!locationService.isGeolocationSupported()) {
    showAlert('Location services not supported', 'warning')
    return true // Allow attendance without location if not supported
  }

  if (!currentLocation.value) {
    return await getCurrentLocation()
  }

  // Check if location is still valid (within 5 minutes)
  const now = Date.now()
  const locationAge = now - (currentLocation.value.timestamp || 0)
  const maxAge = 5 * 60 * 1000 // 5 minutes

  if (locationAge > maxAge) {
    return await getCurrentLocation()
  }

  return locationValid.value?.valid || false
}

// Lifecycle
onMounted(async () => {
  updateCurrentTime()
  timeInterval.value = setInterval(updateCurrentTime, 1000)
  
  // Fetch initial data
  await Promise.all([
    fetchTodayStatus(),
    fetchRecentAttendance(),
    getCurrentLocation() // Initialize location
  ])
})

onUnmounted(() => {
  if (timeInterval.value) {
    clearInterval(timeInterval.value)
  }
  
  // Clean up camera stream
  if (cameraStream.value) {
    cameraStream.value.getTracks().forEach(track => track.stop())
  }
})
</script>