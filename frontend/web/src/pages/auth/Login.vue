<template>
  <!-- Exact Tabler.io Login Page -->
  <div class="page page-center">
    <div class="container container-tight py-4">
      <div class="text-center mb-4">
        <a href="." class="navbar-brand navbar-brand-autodark">
          <img src="/logo.svg" width="110" height="32" alt="Attendance System" class="navbar-brand-image">
        </a>
      </div>
      
      <div class="card card-md">
        <div class="card-body">
          <h2 class="h2 text-center mb-4">Login to your account</h2>
          
          <!-- Display error message -->
          <div v-if="errorMessage" class="alert alert-danger" role="alert">
            <div class="d-flex">
              <div>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <circle cx="12" cy="12" r="9"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h4 class="alert-title">Login failed!</h4>
                <div class="text-muted">{{ errorMessage }}</div>
              </div>
            </div>
          </div>
          
          <!-- Login form -->
          <form @submit.prevent="handleLogin" autocomplete="off" novalidate>
            <div class="mb-3">
              <label class="form-label">Email address</label>
              <input 
                type="email" 
                class="form-control" 
                :class="{ 'is-invalid': errors.email }"
                placeholder="your@email.com"
                autocomplete="off"
                v-model="form.email"
                :disabled="isLoading"
                required
              >
              <div v-if="errors.email" class="invalid-feedback">
                {{ errors.email }}
              </div>
            </div>
            
            <div class="mb-2">
              <label class="form-label">
                Password
                <span class="form-label-description">
                  <a href="#" @click.prevent="showForgotPassword = true">I forgot password</a>
                </span>
              </label>
              <div class="input-group input-group-flat">
                <input 
                  :type="showPassword ? 'text' : 'password'" 
                  class="form-control"  
                  :class="{ 'is-invalid': errors.password }"
                  placeholder="Your password"
                  autocomplete="off"
                  v-model="form.password"
                  :disabled="isLoading"
                  required
                >
                <span class="input-group-text">
                  <a href="#" class="link-secondary" @click.prevent="showPassword = !showPassword" title="Show password">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <path v-if="!showPassword" d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0"/>
                      <path v-if="!showPassword" d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/>
                      <path v-if="showPassword" d="M21 9c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"/>
                      <path v-if="showPassword" d="M3 3l18 18"/>
                    </svg>
                  </a>
                </span>
              </div>
              <div v-if="errors.password" class="invalid-feedback">
                {{ errors.password }}
              </div>
            </div>
            
            <div class="mb-2">
              <label class="form-check">
                <input type="checkbox" class="form-check-input" v-model="form.remember" :disabled="isLoading"/>
                <span class="form-check-label">Remember me on this device</span>
              </label>
            </div>
            
            <!-- Rate limit warning -->
            <div v-if="rateLimitMessage" class="alert alert-warning mb-3" role="alert">
              <div class="d-flex">
                <div>
                  <svg xmlns="http://www.w3.org/2000/svg" class="icon alert-icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                    <path d="M12 9v2m0 4v.01"/>
                    <path d="M5.07 19.07a10 10 0 1 1 13.86 0"/>
                  </svg>
                </div>
                <div>
                  <h4 class="alert-title">Too many attempts!</h4>
                  <div class="text-muted">{{ rateLimitMessage }}</div>
                </div>
              </div>
            </div>
            
            <div class="form-footer">
              <button type="submit" class="btn btn-primary w-100" :disabled="isLoading || remainingTime > 0">
                <span v-if="isLoading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                <span v-if="remainingTime > 0">
                  Try again in {{ remainingTime }} seconds
                </span>
                <span v-else-if="isLoading">
                  Signing in...
                </span>
                <span v-else>
                  Sign in
                </span>
              </button>
            </div>
          </form>
        </div>
        
        <div class="hr-text">or</div>
        
        <div class="card-body">
          <div class="row">
            <div class="col">
              <a href="#" class="btn btn-white w-100" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon text-github" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.2 5.5 -5.5c0 -1.2 -.4 -2.3 -1.1 -3.1c.1 -.6 .1 -1.2 -.1 -1.8c0 0 -1.1 -.4 -3.5 1.3c-2.1 -.6 -4.3 -.6 -6.4 0c-2.4 -1.7 -3.5 -1.3 -3.5 -1.3c-.2 .6 -.2 1.2 -.1 1.8c-.7 .8 -1.1 1.9 -1.1 3.1c0 4.3 2.7 5.2 5.5 5.5c-.6 .6 -.6 1 -.5 2v3.5"/>
                </svg>
                Login with Github
              </a>
            </div>
            <div class="col">
              <a href="#" class="btn btn-white w-100" disabled>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon text-twitter" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M22 4.01c-1 .49 -1.98 .689 -3 .99c-1.121 -1.265 -2.783 -1.335 -4.38 -.737s-2.643 2.06 -2.62 3.737v1c-3.245 .083 -6.135 -1.395 -8 -4c0 0 -4.182 7.433 4 11c-1.872 1.247 -3.739 2.088 -6 2c3.308 1.803 6.913 2.423 10.034 1.517c3.58 -1.04 6.522 -3.723 7.651 -7.742a13.84 13.84 0 0 0 .497 -3.753c-.002 -.249 1.51 -2.772 1.818 -4.013z"/>
                </svg>
                Login with Twitter
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-center text-muted mt-3">
        Don't have account yet? <router-link to="/auth/register">Sign up</router-link>
      </div>
      
      <!-- Forgot Password Modal -->
      <div v-if="showForgotPassword" class="modal modal-blur fade show" style="display: block;" tabindex="-1">
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content">
            <button type="button" class="btn-close" @click="showForgotPassword = false"></button>
            <div class="modal-status bg-danger"></div>
            <div class="modal-body text-center py-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon mb-2 text-danger icon-lg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"/>
                <path d="M3 7l9 6l9 -6"/>
              </svg>
              <h3>Forgot your password?</h3>
              <div class="text-muted">Enter your email address and we'll send you a link to reset your password.</div>
            </div>
            <div class="modal-body">
              <div class="input-group input-group-flat">
                <input type="email" class="form-control" placeholder="your@email.com" autocomplete="off">
                <span class="input-group-text">
                  <a href="#" class="link-secondary" title="Send password reset email">
                    <svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                      <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                      <line x1="10" y1="14" x2="21" y2="3"/>
                      <path d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"/>
                    </svg>
                  </a>
                </span>
              </div>
            </div>
            <div class="modal-footer">
              <div class="w-100">
                <div class="row">
                  <div class="col">
                    <a href="#" class="btn w-100" @click="showForgotPassword = false">
                      Cancel
                    </a>
                  </div>
                  <div class="col">
                    <a href="#" class="btn btn-danger w-100">
                      Send Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Modal backdrop -->
      <div v-if="showForgotPassword" class="modal-backdrop fade show" @click="showForgotPassword = false"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Form data
const form = ref({
  email: 'superadmin@school.edu',
  password: 'password123',
  remember: false
})

// State
const isLoading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const showPassword = ref(false)
const showForgotPassword = ref(false)
const remainingTime = ref(0)
const countdownInterval = ref(null)

// Rate limiting
const rateLimitMessage = computed(() => {
  if (remainingTime.value > 0) {
    return `Please wait ${remainingTime.value} seconds before trying again.`
  }
  return ''
})

// Methods
const validateForm = () => {
  errors.value = {}
  
  if (!form.value.email) {
    errors.value.email = 'Email is required'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (!form.value.password) {
    errors.value.password = 'Password is required'
  } else if (form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleLogin = async () => {
  // Clear previous errors
  errorMessage.value = ''
  
  if (!validateForm()) {
    return
  }
  
  // Check if still in rate limit period
  if (remainingTime.value > 0) {
    return
  }
  
  isLoading.value = true
  
  try {
    const result = await authStore.login(form.value)
    
    if (result.success) {
      // Redirect to intended page or dashboard
      const redirect = router.currentRoute.value.query.redirect || '/'
      router.push(redirect)
    } else {
      errorMessage.value = result.message || 'Login failed. Please check your credentials.'
      
      // Handle rate limiting
      if (result.rateLimited && result.remainingTime) {
        remainingTime.value = result.remainingTime
        startCountdown()
      }
      
      // Clear form password on failed login
      if (result.attempts >= 3) {
        form.value.password = ''
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'An unexpected error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  
  countdownInterval.value = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value <= 0) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
    }
  }, 1000)
}

// Check for existing rate limit on mount
const checkRateLimit = () => {
  const canLoginAgain = authStore.canLoginAgain
  if (canLoginAgain > Date.now()) {
    remainingTime.value = Math.max(0, Math.ceil((canLoginAgain - Date.now()) / 1000))
    if (remainingTime.value > 0) {
      startCountdown()
    }
  }
}

// Lifecycle
onMounted(() => {
  checkRateLimit()
  
  // Clear any previous auth state
  errorMessage.value = ''
  
  // Focus email input
  const emailInput = document.querySelector('input[type="email"]')
  if (emailInput) {
    emailInput.focus()
  }
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})
</script>

<style scoped>
/* Exact Tabler.io Login Page Styling */
.page-center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--tblr-bg-surface-secondary);
}

.container-tight {
  max-width: 25rem;
}

.card-md {
  max-width: 25rem;
}

.navbar-brand-image {
  height: 2rem;
  width: auto;
}

.form-footer {
  margin-top: 2rem;
}

.hr-text {
  position: relative;
  height: 1px;
  background: var(--tblr-border-color);
  margin: 2rem 0;
  text-align: center;
}

.hr-text::before {
  content: "or";
  position: absolute;
  top: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tblr-bg-surface);
  padding: 0 1rem;
  color: var(--tblr-text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.alert-icon {
  margin-right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.text-github {
  color: #333 !important;
}

.text-twitter {
  color: #1da1f2 !important;
}

.form-label-description {
  float: right;
  font-weight: 400;
}

.input-group-flat .form-control {
  border-right: 0;
}

.input-group-flat .input-group-text {
  background: transparent;
  border-left: 0;
}

/* Modal styling */
.modal-backdrop {
  background-color: rgba(var(--tblr-body-color-rgb), 0.32);
}

.modal-status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--tblr-danger);
  border-radius: var(--tblr-border-radius) var(--tblr-border-radius) 0 0;
}

.icon-lg {
  width: 3rem;
  height: 3rem;
}

/* Button states */
.btn:disabled {
  opacity: 0.65;
  pointer-events: none;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .container-tight {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Focus styles */
.form-control:focus {
  border-color: var(--tblr-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--tblr-primary-rgb), 0.25);
}

/* Dark mode support */
[data-bs-theme="dark"] .page-center {
  background: var(--tblr-dark);
}

[data-bs-theme="dark"] .hr-text::before {
  background: var(--tblr-dark);
}
</style>