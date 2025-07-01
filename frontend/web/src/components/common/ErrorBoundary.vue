<template>
  <div>
    <!-- Normal content when no error -->
    <slot v-if="!hasError" />
    
    <!-- Error fallback content -->
    <slot v-else name="fallback" :error="error" :retry="retry">
      <!-- Default error fallback if no custom fallback provided -->
      <div class="card">
        <div class="card-body text-center">
          <div class="empty">
            <div class="empty-img">
              <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-lg text-danger" width="48" height="48" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 9v2m0 4v.01"/>
                <path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"/>
              </svg>
            </div>
            <p class="empty-title">Something went wrong</p>
            <p class="empty-subtitle text-muted">
              {{ error?.message || 'An unexpected error occurred while loading this component.' }}
            </p>
            <div class="empty-action">
              <button class="btn btn-primary" @click="retry">
                <svg xmlns="http://www.w3.org/2000/svg" class="icon me-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                  <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                  <path d="M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4"/>
                  <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4"/>
                </svg>
                Try Again
              </button>
              <router-link to="/" class="btn btn-link">
                Go to Dashboard
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </slot>
  </div>
</template>

<script setup>
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const error = ref(null)

onErrorCaptured((err, instance, info) => {
  console.error('🚨 Error boundary caught error:', err)
  console.error('📍 Component instance:', instance)
  console.error('ℹ️ Error info:', info)
  
  hasError.value = true
  error.value = {
    message: err.message,
    stack: err.stack,
    info,
    componentStack: instance?.$options.name || 'Unknown Component'
  }
  
  // Prevent error from bubbling up further
  return false
})

const retry = () => {
  console.log('🔄 Error boundary retry triggered')
  hasError.value = false
  error.value = null
}

// Expose retry function for parent components
defineExpose({
  retry,
  hasError,
  error
})
</script>

<style scoped>
.empty {
  padding: 2rem 1rem;
}

.empty-img {
  margin-bottom: 1rem;
}

.empty-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.empty-subtitle {
  margin-bottom: 1.5rem;
}

.empty-action .btn + .btn {
  margin-left: 0.5rem;
}
</style>