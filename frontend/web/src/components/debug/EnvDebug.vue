<template>
  <div class="card mb-3" style="background: #f8f9fa; border: 1px solid #dee2e6;">
    <div class="card-header">
      <h6 class="card-title mb-0">🐛 Debug Information</h6>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="col-md-6">
          <h6>Environment Variables:</h6>
          <pre class="text-sm">{{ JSON.stringify(envVars, null, 2) }}</pre>
        </div>
        <div class="col-md-6">
          <h6>Axios Configuration:</h6>
          <pre class="text-sm">{{ JSON.stringify(axiosConfig, null, 2) }}</pre>
        </div>
      </div>
      <div class="mt-3">
        <button class="btn btn-sm btn-outline-primary" @click="testApiCall">
          Test API Call
        </button>
        <button class="btn btn-sm btn-outline-secondary ms-2" @click="logCurrentConfig">
          Log Current Config
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import axios from 'axios'

const envVars = ref({})
const axiosConfig = ref({})

onMounted(() => {
  // Capture environment variables
  envVars.value = {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD,
    BASE_URL: import.meta.env.BASE_URL
  }
  
  // Capture axios configuration
  axiosConfig.value = {
    api_baseURL: api.defaults.baseURL,
    global_axios_baseURL: axios.defaults.baseURL,
    api_headers: Object.keys(api.defaults.headers || {}),
    global_axios_headers: Object.keys(axios.defaults.headers || {})
  }
})

const testApiCall = async () => {
  try {
    console.log('🧪 Testing API call...')
    const response = await api.get('/health')
    console.log('✅ Test API call successful:', response.data)
  } catch (error) {
    console.error('❌ Test API call failed:', error)
  }
}

const logCurrentConfig = () => {
  console.log('📊 Current Configuration:')
  console.log('Environment:', envVars.value)
  console.log('Axios Config:', axiosConfig.value)
  console.log('API Instance:', api)
  console.log('Global Axios:', axios)
}
</script>

<style scoped>
.text-sm {
  font-size: 0.875rem;
}
pre {
  max-height: 200px;
  overflow-y: auto;
  padding: 0.5rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 0.25rem;
}
</style>