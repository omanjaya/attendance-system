<template>
  <div class="page page-center">
    <div class="container container-tight py-4">
      <div class="text-center mb-4">
        <div class="navbar-brand">Attendance System</div>
      </div>

      <div class="card card-md">
        <div class="card-body">
          <h2 class="h2 text-center mb-4">Create new account</h2>

          <form autocomplete="off" novalidate @submit.prevent="handleRegister">
            <!-- Name -->
            <div class="mb-3">
              <label class="form-label">Full Name</label>
              <input
                v-model="form.name"
                type="text"
                class="form-control"
                :class="{ 'is-invalid': errors.name }"
                placeholder="Enter your full name"
                required
              />
              <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
            </div>

            <!-- Email -->
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input
                v-model="form.email"
                type="email"
                class="form-control"
                :class="{ 'is-invalid': errors.email }"
                placeholder="your@email.com"
                required
              />
              <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
            </div>

            <!-- Password -->
            <div class="mb-3">
              <label class="form-label">Password</label>
              <input
                v-model="form.password"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.password }"
                placeholder="Your password"
                required
              />
              <div v-if="errors.password" class="invalid-feedback">{{ errors.password }}</div>
            </div>

            <!-- Confirm Password -->
            <div class="mb-3">
              <label class="form-label">Confirm Password</label>
              <input
                v-model="form.password_confirmation"
                type="password"
                class="form-control"
                :class="{ 'is-invalid': errors.password_confirmation }"
                placeholder="Confirm your password"
                required
              />
              <div v-if="errors.password_confirmation" class="invalid-feedback">
                {{ errors.password_confirmation }}
              </div>
            </div>

            <!-- Terms -->
            <div class="mb-3">
              <label class="form-check">
                <input v-model="form.terms" type="checkbox" class="form-check-input" required />
                <span class="form-check-label">
                  I agree to the <a href="#" tabindex="-1">Terms of Service</a> and
                  <a href="#" tabindex="-1">Privacy Policy</a>.
                </span>
              </label>
            </div>

            <!-- Submit Button -->
            <div class="form-footer">
              <button type="submit" class="btn btn-primary w-100" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                Create account
              </button>
            </div>
          </form>
        </div>

        <!-- Error Alert -->
        <div v-if="error" class="alert alert-danger m-3">
          {{ error }}
        </div>
      </div>

      <div class="text-center text-muted mt-3">
        Already have account?
        <router-link to="/auth/login">Sign in</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
  terms: false
})

const errors = reactive({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const handleRegister = async () => {
  // Clear previous errors
  Object.keys(errors).forEach(key => (errors[key] = ''))
  error.value = ''

  // Basic validation
  if (!form.name) {
    errors.name = 'Name is required'
    return
  }

  if (!form.email) {
    errors.email = 'Email is required'
    return
  }

  if (!form.password) {
    errors.password = 'Password is required'
    return
  }

  if (form.password !== form.password_confirmation) {
    errors.password_confirmation = 'Passwords do not match'
    return
  }

  if (!form.terms) {
    error.value = 'You must agree to the terms and conditions'
    return
  }

  loading.value = true

  try {
    const result = await authStore.register({
      name: form.name,
      email: form.email,
      password: form.password,
      password_confirmation: form.password_confirmation
    })

    if (result.success) {
      router.push('/')
    } else {
      error.value = result.message || 'Registration failed'
    }
  } catch (err) {
    error.value = 'An unexpected error occurred'
  } finally {
    loading.value = false
  }
}
</script>
