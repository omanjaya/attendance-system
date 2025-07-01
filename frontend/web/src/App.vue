<template>
  <div id="app">
    <div v-if="isInitializing" class="app-loading">
      <div class="loading-container">
        <div class="loading-spinner"></div>
        <p>Initializing application...</p>
      </div>
    </div>
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const isInitializing = ref(true)

onMounted(async () => {
  try {
    // Initialize theme with proper detection
    const savedTheme = localStorage.getItem('theme') || 
                     (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    
    // Apply theme to document
    document.documentElement.setAttribute('data-bs-theme', savedTheme)
    document.body.setAttribute('data-bs-theme', savedTheme)
    document.body.classList.remove('theme-light', 'theme-dark')
    document.body.classList.add(`theme-${savedTheme}`)
    
    // Store the theme for consistency
    localStorage.setItem('theme', savedTheme)
    
    // Initialize authentication state - this will restore from localStorage
    // and validate the token if it exists
    await authStore.initAuth()
  } catch (error) {
    console.error('Failed to initialize app:', error)
  } finally {
    // Always mark initialization as complete
    isInitializing.value = false
  }
})
</script>

<style>
/* Global styles are imported in main.js */
#app {
  min-height: 100vh;
}

/* Remove unwanted focus outlines while maintaining accessibility */
*:focus {
  outline: none;
}

/* Only show focus outline for keyboard navigation */
*:focus-visible {
  outline: 2px solid var(--tblr-primary, #206bc4);
  outline-offset: 2px;
}

/* Specific focus management for router-link and buttons */
.nav-link:focus,
.btn:focus,
.dropdown-toggle:focus {
  outline: none;
  box-shadow: none;
}

.nav-link:focus-visible,
.btn:focus-visible,
.dropdown-toggle:focus-visible {
  outline: 2px solid var(--tblr-primary, #206bc4);
  outline-offset: 2px;
}

/* Prevent container focus styles */
.container,
.container-xl,
.page-wrapper,
.page-body {
  outline: none !important;
}

.container:focus,
.container-xl:focus,
.page-wrapper:focus,
.page-body:focus {
  outline: none !important;
  box-shadow: none !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f3f4;
}

::-webkit-scrollbar-thumb {
  background: #d4d9df;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #8a949e;
}

/* App loading screen */
.app-loading {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-container p {
  margin: 0;
  color: #6c757d;
  font-size: 0.875rem;
}

/* Loading spinner */
.loading-spinner {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid #e9ecef;
  border-top: 3px solid #0d6efd;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Face recognition specific styles */
.face-camera-container {
  position: relative;
  width: 100%;
  max-width: 640px;
  margin: 0 auto;
}

.face-camera-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.face-detection-box {
  position: absolute;
  border: 2px solid #00ff00;
  border-radius: 4px;
  background: rgba(0, 255, 0, 0.1);
}

.attendance-status-success {
  background-color: #d4edda;
  border-color: #c3e6cb;
  color: #155724;
}

.attendance-status-error {
  background-color: #f8d7da;
  border-color: #f5c6cb;
  color: #721c24;
}

.attendance-status-warning {
  background-color: #fff3cd;
  border-color: #ffeaa7;
  color: #856404;
}

/* Theme transition */
* {
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;
}
</style>