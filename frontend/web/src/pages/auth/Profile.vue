<template>
  <div class="container-xl">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">Profile Settings</h3>
          </div>

          <div class="card-body">
            <form @submit.prevent="updateProfile">
              <!-- Avatar -->
              <div class="row align-items-center mb-3">
                <div class="col-auto">
                  <span
                    class="avatar avatar-xl"
                    :style="`background-image: url(${userAvatar})`"
                  ></span>
                </div>
                <div class="col">
                  <div class="mb-2">
                    <strong>{{ user?.name }}</strong>
                  </div>
                  <div class="text-muted">{{ user?.email }}</div>
                  <div v-if="user?.employee_id" class="text-muted small">
                    Employee ID: {{ user.employee_id }}
                  </div>
                </div>
              </div>

              <!-- Name -->
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input
                  v-model="form.name"
                  type="text"
                  class="form-control"
                  :class="{ 'is-invalid': errors.name }"
                  required
                />
                <div v-if="errors.name" class="invalid-feedback">{{ errors.name }}</div>
              </div>

              <!-- Email -->
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': errors.email }"
                  required
                />
                <div v-if="errors.email" class="invalid-feedback">{{ errors.email }}</div>
              </div>

              <!-- Phone -->
              <div class="mb-3">
                <label class="form-label">Phone Number</label>
                <input
                  v-model="form.phone"
                  type="tel"
                  class="form-control"
                  placeholder="Enter phone number"
                />
              </div>

              <!-- Submit -->
              <div class="form-footer">
                <button type="submit" class="btn btn-primary" :disabled="loading">
                  <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Change Password -->
        <div class="card mt-4">
          <div class="card-header">
            <h3 class="card-title">Change Password</h3>
          </div>

          <div class="card-body">
            <form @submit.prevent="changePassword">
              <!-- Current Password -->
              <div class="mb-3">
                <label class="form-label">Current Password</label>
                <input
                  v-model="passwordForm.current_password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': passwordErrors.current_password }"
                  required
                />
                <div v-if="passwordErrors.current_password" class="invalid-feedback">
                  {{ passwordErrors.current_password }}
                </div>
              </div>

              <!-- New Password -->
              <div class="mb-3">
                <label class="form-label">New Password</label>
                <input
                  v-model="passwordForm.password"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': passwordErrors.password }"
                  required
                />
                <div v-if="passwordErrors.password" class="invalid-feedback">
                  {{ passwordErrors.password }}
                </div>
              </div>

              <!-- Confirm Password -->
              <div class="mb-3">
                <label class="form-label">Confirm New Password</label>
                <input
                  v-model="passwordForm.password_confirmation"
                  type="password"
                  class="form-control"
                  :class="{ 'is-invalid': passwordErrors.password_confirmation }"
                  required
                />
                <div v-if="passwordErrors.password_confirmation" class="invalid-feedback">
                  {{ passwordErrors.password_confirmation }}
                </div>
              </div>

              <!-- Submit -->
              <div class="form-footer">
                <button type="submit" class="btn btn-warning" :disabled="passwordLoading">
                  <span v-if="passwordLoading" class="spinner-border spinner-border-sm me-2"></span>
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const loading = ref(false)
const passwordLoading = ref(false)

const user = computed(() => authStore.user)
const userAvatar = computed(() => authStore.userAvatar)

const form = reactive({
  name: '',
  email: '',
  phone: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: ''
})

const passwordForm = reactive({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const passwordErrors = reactive({
  current_password: '',
  password: '',
  password_confirmation: ''
})

const updateProfile = async () => {
  // Clear errors
  Object.keys(errors).forEach(key => (errors[key] = ''))

  loading.value = true

  try {
    const result = await authStore.updateProfile({
      name: form.name,
      email: form.email,
      phone: form.phone
    })

    if (result.success) {
      // Success notification would go here
      console.log('Profile updated successfully')
    } else {
      // Handle validation errors
      if (result.errors) {
        Object.assign(errors, result.errors)
      }
    }
  } catch (error) {
    console.error('Error updating profile:', error)
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  // Clear errors
  Object.keys(passwordErrors).forEach(key => (passwordErrors[key] = ''))

  // Validate passwords match
  if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Passwords do not match'
    return
  }

  passwordLoading.value = true

  try {
    const result = await authStore.changePassword({
      current_password: passwordForm.current_password,
      password: passwordForm.password,
      password_confirmation: passwordForm.password_confirmation
    })

    if (result.success) {
      // Clear form
      Object.keys(passwordForm).forEach(key => (passwordForm[key] = ''))
      console.log('Password changed successfully')
    } else {
      // Handle validation errors
      if (result.errors) {
        Object.assign(passwordErrors, result.errors)
      }
    }
  } catch (error) {
    console.error('Error changing password:', error)
  } finally {
    passwordLoading.value = false
  }
}

onMounted(() => {
  // Populate form with current user data
  if (user.value) {
    form.name = user.value.name || ''
    form.email = user.value.email || ''
    form.phone = user.value.phone || ''
  }
})
</script>
