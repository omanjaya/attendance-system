/**
 * Face Recognition Service
 * Handles face recognition API operations
 */

import axios from 'axios'

// Create a separate axios instance for face recognition service
const faceApi = axios.create({
  baseURL: import.meta.env.VITE_FACE_API_URL || 'http://localhost:8001',
  timeout: 30000, // Longer timeout for image processing
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
})

export const faceRecognitionService = {
  // Health check
  async healthCheck() {
    const response = await faceApi.get('/health')
    return response.data
  },

  // Register employee face
  async registerFace(employeeId, employeeName, imageFile) {
    const formData = new FormData()
    formData.append('employee_id', employeeId)
    formData.append('employee_name', employeeName)
    formData.append('file', imageFile)

    const response = await faceApi.post('/api/v1/register-face', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    return response.data
  },

  // Verify face from base64 image
  async verifyFace(imageBase64, requireGestures = false) {
    const response = await faceApi.post('/api/v1/verify-face', {
      image_data: imageBase64,
      require_gestures: requireGestures
    })
    return response.data
  },

  // Remove employee face data
  async removeFace(employeeId) {
    const response = await faceApi.delete(`/api/v1/remove-face/${employeeId}`)
    return response.data
  },

  // List registered employees
  async listRegisteredEmployees() {
    const response = await faceApi.get('/api/v1/employees')
    return response.data
  },

  // Capture image from camera and convert to base64
  async captureFromCamera() {
    return new Promise((resolve, reject) => {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            width: 640,
            height: 480,
            facingMode: 'user'
          }
        })
        .then(stream => {
          const video = document.createElement('video')
          video.srcObject = stream
          video.play()

          video.onloadedmetadata = () => {
            const canvas = document.createElement('canvas')
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight

            const ctx = canvas.getContext('2d')
            ctx.drawImage(video, 0, 0)

            // Stop the stream
            stream.getTracks().forEach(track => track.stop())

            // Convert to base64
            const base64 = canvas.toDataURL('image/jpeg', 0.8)
            resolve(base64)
          }
        })
        .catch(error => {
          reject(new Error(`Camera access denied or not available: ${error.message}`))
        })
    })
  },

  // Convert file to base64
  async fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  },

  // Validate image quality for face recognition
  async validateImageQuality(imageBase64) {
    try {
      // Basic validation - could be enhanced with actual image analysis
      const img = new Image()

      return new Promise(resolve => {
        img.onload = () => {
          const warnings = []

          // Check image dimensions
          if (img.width < 200 || img.height < 200) {
            warnings.push('Image resolution is too low (minimum 200x200)')
          }

          if (img.width > 2000 || img.height > 2000) {
            warnings.push('Image resolution is very high (may slow processing)')
          }

          // Check aspect ratio
          const aspectRatio = img.width / img.height
          if (aspectRatio < 0.7 || aspectRatio > 1.5) {
            warnings.push('Image aspect ratio seems unusual for face recognition')
          }

          resolve({
            valid: warnings.length === 0,
            warnings,
            dimensions: { width: img.width, height: img.height }
          })
        }

        img.onerror = () => {
          resolve({
            valid: false,
            warnings: ['Invalid image format'],
            dimensions: null
          })
        }

        img.src = imageBase64
      })
    } catch (error) {
      return {
        valid: false,
        warnings: [`Error validating image: ${error.message}`],
        dimensions: null
      }
    }
  }
}

export default faceRecognitionService
