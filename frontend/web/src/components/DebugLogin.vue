<template>
  <div class="card">
    <div class="card-header">
      <h3>Authentication Debug</h3>
    </div>
    <div class="card-body">
      <div class="mb-3">
        <label class="form-label">Email</label>
        <input
          v-model="email"
          type="email"
          class="form-control"
          placeholder="superadmin@school.edu"
        />
      </div>

      <div class="mb-3">
        <label class="form-label">Password</label>
        <input v-model="password" type="password" class="form-control" placeholder="password123" />
      </div>

      <div class="mb-3">
        <button class="btn btn-secondary me-2" :disabled="loading" @click="testCsrf">
          Test CSRF
        </button>
        <button class="btn btn-primary" :disabled="loading" @click="testLogin">Test Login</button>
      </div>

      <div v-if="loading" class="mb-3">
        <div class="text-info">Loading...</div>
      </div>

      <div v-if="result" class="mb-3">
        <div class="alert" :class="result.success ? 'alert-success' : 'alert-danger'">
          <strong>Result:</strong> {{ result.message }}
          <pre v-if="result.data">{{ JSON.stringify(result.data, null, 2) }}</pre>
        </div>
      </div>

      <div class="mb-3">
        <h5>Debug Info:</h5>
        <ul class="list-unstyled">
          <li><strong>API URL:</strong> {{ apiUrl }}</li>
          <li><strong>WithCredentials:</strong> {{ withCredentials }}</li>
          <li><strong>CSRF Token:</strong> {{ csrfToken ? 'Present' : 'Missing' }}</li>
          <li><strong>Cookies:</strong> {{ cookies }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import axios from 'axios'

const email = ref('superadmin@school.edu')
const password = ref('password123')
const loading = ref(false)
const result = ref(null)

const apiUrl = computed(() => axios.defaults.baseURL)
const withCredentials = computed(() => axios.defaults.withCredentials)

const csrfToken = computed(() => {
  const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('XSRF-TOKEN='))
    ?.split('=')[1]
  return token ? decodeURIComponent(token) : null
})

const cookies = computed(() => {
  return document.cookie
    .split('; ')
    .filter(c => c.includes('XSRF') || c.includes('session'))
    .join('; ')
})

const testCsrf = async () => {
  loading.value = true
  result.value = null

  try {
    await axios.get('/sanctum/csrf-cookie')
    result.value = {
      success: true,
      message: 'CSRF token obtained successfully',
      data: {
        token: csrfToken.value,
        cookies: cookies.value
      }
    }
  } catch (error) {
    result.value = {
      success: false,
      message: `CSRF request failed: ${error.message}`,
      data: error.response?.data
    }
  } finally {
    loading.value = false
  }
}

const testLogin = async () => {
  loading.value = true
  result.value = null

  try {
    // First get CSRF token
    await axios.get('/sanctum/csrf-cookie')

    // Then login
    const response = await axios.post('/api/v1/auth/login', {
      email: email.value,
      password: password.value
    })

    result.value = {
      success: true,
      message: 'Login successful!',
      data: response.data
    }
  } catch (error) {
    result.value = {
      success: false,
      message: `Login failed: ${error.response?.data?.message || error.message}`,
      data: error.response?.data
    }
  } finally {
    loading.value = false
  }
}
</script>
