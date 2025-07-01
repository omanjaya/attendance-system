<template>
  <!-- Exact Tabler.io Page Structure -->
  <div class="page">
    <!-- Tabler Header -->
    <TablerHeader 
      :user="currentUser"
      @logout="logout"
    />
    
    <!-- Page Wrapper - Exact Tabler Structure -->
    <div class="page-wrapper">
      <!-- Page Header -->
      <div class="page-header d-print-none" v-if="showPageHeader">
        <div class="container-xl">
          <div class="row g-2 align-items-center">
            <div class="col">
              <!-- Breadcrumbs -->
              <nav aria-label="breadcrumb" v-if="breadcrumbs && breadcrumbs.length > 0">
                <ol class="breadcrumb breadcrumb-arrows">
                  <li class="breadcrumb-item">
                    <router-link to="/">Home</router-link>
                  </li>
                  <li 
                    v-for="(crumb, index) in breadcrumbs" 
                    :key="index"
                    class="breadcrumb-item"
                    :class="{ 'active': index === breadcrumbs.length - 1 }"
                  >
                    <router-link v-if="crumb.to && index !== breadcrumbs.length - 1" :to="crumb.to">
                      {{ crumb.label }}
                    </router-link>
                    <span v-else>{{ crumb.label }}</span>
                  </li>
                </ol>
              </nav>
              <!-- Page pretitle and title exactly like Tabler -->
              <div class="page-pretitle" v-if="pageSubtitle">{{ pageSubtitle }}</div>
              <h2 class="page-title">{{ pageTitle }}</h2>
            </div>
            <!-- Page actions -->
            <div class="col-12 col-md-auto ms-auto d-print-none" v-if="$slots.actions">
              <div class="btn-list">
                <slot name="actions"></slot>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Page Body -->
      <div class="page-body">
        <div class="container-xl">
          
          <!-- Main content with enhanced error handling -->
          <main id="main-content" tabindex="-1" ref="mainContent">
            <ErrorBoundary>
              <template #default>
                <router-view v-slot="{ Component, route }">
                  <transition 
                    name="page" 
                    mode="out-in"
                    @before-leave="onBeforeLeave"
                    @enter="onEnter"
                    @after-enter="onAfterEnter"
                  >
                    <Suspense
                      :timeout="suspenseTimeout"
                      @pending="onPending"
                      @resolve="onResolve"
                      @fallback="onFallback"
                    >
                      <template #default>
                        <KeepAlive :include="keepAliveComponents">
                          <component 
                            :is="Component" 
                            :key="route.fullPath"
                            class="page-component"
                            @vue:mounted="onComponentMounted"
                            @vue:unmounted="onComponentUnmounted"
                          />
                        </KeepAlive>
                      </template>
                      
                      <template #fallback>
                        <LoadingSpinner 
                          :title="loadingTitle"
                          :subtitle="loadingSubtitle"
                          size="large"
                          :timeout="8000"
                          @timeout="onLoadingTimeout"
                        />
                      </template>
                    </Suspense>
                  </transition>
                </router-view>
              </template>
              
              <template #fallback="{ error, retry }">
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
                      <p class="empty-title">Component Error</p>
                      <p class="empty-subtitle text-muted">
                        {{ error?.message || 'There was an error loading this page component.' }}
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
              </template>
            </ErrorBoundary>
          </main>
        </div>
      </div>
      
      <!-- Footer -->
      <TablerFooter />
    </div>
    
    <!-- Toast Notification Container -->
    <ToastNotification />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import TablerHeader from '@/components/layout/TablerHeader.vue'
import TablerFooter from '@/components/layout/TablerFooter.vue'
import ToastNotification from '@/components/common/ToastNotification.vue'
import ErrorBoundary from '@/components/common/ErrorBoundary.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const mainContent = ref(null)
const currentYear = new Date().getFullYear()

// Enhanced loading state management
const suspenseTimeout = ref(10000) // 10 seconds
const isLoading = ref(false)
const loadingStartTime = ref(null)

// KeepAlive components for better performance
const keepAliveComponents = ['Dashboard', 'EmployeeList', 'AttendanceList', 'ReportsDashboard']

// User data
const currentUser = computed(() => ({
  name: authStore.userName || 'Administrator',
  email: authStore.userEmail || 'admin@school.edu',
  initials: (authStore.userName || 'Administrator').split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
  avatar: authStore.userAvatar,
  role: 'Administrator'
}))

// Page metadata - using exact Tabler conventions
const pageTitle = computed(() => {
  const routeTitle = route.meta?.title
  if (routeTitle) return routeTitle
  
  // Default titles based on path
  const path = route.path
  if (path === '/') return 'Dashboard'
  if (path.startsWith('/employees')) return 'Employees'
  if (path.startsWith('/attendance')) return 'Attendance'
  if (path.startsWith('/schedules')) return 'Schedules'
  if (path.startsWith('/payroll')) return 'Payroll'
  if (path.startsWith('/reports')) return 'Reports'
  if (path.startsWith('/settings')) return 'Settings'
  
  return 'Dashboard'
})

const pageSubtitle = computed(() => {
  const routeSubtitle = route.meta?.subtitle
  if (routeSubtitle) return routeSubtitle
  
  // Default subtitles based on path
  const path = route.path
  if (path === '/') return 'Overview'
  if (path.startsWith('/employees')) return 'Management'
  if (path.startsWith('/attendance')) return 'Tracking'
  if (path.startsWith('/schedules')) return 'Planning'
  if (path.startsWith('/payroll')) return 'Finance'
  if (path.startsWith('/reports')) return 'Analytics'
  if (path.startsWith('/settings')) return 'Configuration'
  
  return null
})

const breadcrumbs = computed(() => {
  return route.meta?.breadcrumbs || []
})

const showPageHeader = computed(() => route.meta?.showHeader !== false)

// Dynamic loading messages based on route
const loadingTitle = computed(() => {
  const routeMessages = {
    'EmployeeList': 'Loading Employee Data',
    'EmployeeCreate': 'Preparing Employee Form',
    'AttendanceList': 'Loading Attendance Records',
    'AttendanceManage': 'Loading Attendance Management',
    'PayrollList': 'Loading Payroll Information',
    'ReportsDashboard': 'Loading Reports Dashboard',
    'SettingsGeneral': 'Loading Settings',
    'default': 'Loading Page'
  }
  
  return routeMessages[route.name] || routeMessages.default
})

const loadingSubtitle = computed(() => {
  const subtitles = {
    'EmployeeList': 'Fetching employee database and profiles...',
    'AttendanceList': 'Retrieving attendance records and statistics...',
    'PayrollList': 'Loading salary calculations and payroll data...',
    'ReportsDashboard': 'Preparing analytics and report data...',
    'default': 'Please wait while we prepare the content...'
  }
  
  return subtitles[route.name] || subtitles.default
})

// Enhanced event handlers for loading and transitions
const onPending = () => {
  console.log('⏳ Suspense: Component loading started')
  isLoading.value = true
  loadingStartTime.value = Date.now()
}

const onResolve = () => {
  const loadTime = Date.now() - (loadingStartTime.value || 0)
  console.log(`✅ Suspense: Component loaded successfully in ${loadTime}ms`)
  isLoading.value = false
}

const onFallback = () => {
  console.log('🔄 Suspense: Fallback component displayed')
}

const onLoadingTimeout = () => {
  console.log('⏰ Loading timeout reached')
  // Could implement additional timeout handling here
}

// Transition event handlers
const onBeforeLeave = () => {
  console.log('🔄 Transition: Starting page transition')
}

const onEnter = () => {
  console.log('✅ Transition: Page transition entering')
}

const onAfterEnter = async () => {
  console.log('🎯 Transition: Page transition completed')
  
  // Ensure DOM is updated
  await nextTick()
  
  // Focus management for accessibility - but without visible outline
  if (mainContent.value) {
    // Remove any existing focus
    document.activeElement?.blur()
    
    // Set focus without visible outline
    mainContent.value.focus({ preventScroll: true })
    
    // Remove focus immediately to prevent blue border but maintain accessibility
    setTimeout(() => {
      if (document.activeElement === mainContent.value) {
        mainContent.value.blur()
      }
    }, 100)
  }
  
  // Log successful navigation
  const loadTime = Date.now() - (loadingStartTime.value || 0)
  console.log(`📊 Total navigation time: ${loadTime}ms`)
}

// Component lifecycle handlers
const onComponentMounted = () => {
  console.log(`🎉 Component mounted: ${route.name}`)
  
  // Track component mount time
  const mountTime = Date.now() - (loadingStartTime.value || 0)
  if (mountTime > 0) {
    console.log(`⚡ Component mount time: ${mountTime}ms`)
  }
}

const onComponentUnmounted = () => {
  console.log(`🔄 Component unmounted: ${route.name}`)
}

// Methods
const logout = async () => {
  await authStore.logout()
  router.push('/login')
}

// Route change handling
watch(() => route.path, async (newPath, oldPath) => {
  if (newPath !== oldPath) {
    // Focus main content on route change for accessibility
    await nextTick()
    if (mainContent.value) {
      mainContent.value.focus()
    }
  }
})

// Lifecycle
onMounted(() => {
  // Apply any saved theme preferences
  const savedTheme = localStorage.getItem('tabler-theme')
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-bs-theme', 'dark')
  }
})
</script>

<style scoped>
/* Exact Tabler.io Layout Styles */
.page-wrapper {
  /* No left margin - full width layout with top navigation */
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Page body should grow to fill available space */
.page-body {
  flex: 1;
}

/* Enhanced page transition effects */
.page-enter-active,
.page-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.page-component {
  width: 100%;
  min-height: 100px;
}

/* Loading state styles */
.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
}

[data-bs-theme="dark"] .loading-overlay {
  background-color: rgba(26, 32, 44, 0.9);
}

/* Focus styles for accessibility - hidden by default */
#main-content {
  outline: none;
}

#main-content:focus {
  outline: none;
}

/* Only show focus outline when navigating with keyboard */
#main-content:focus-visible {
  outline: 2px solid var(--tblr-primary);
  outline-offset: -2px;
}

/* Ensure page components don't show focus outline */
.page-component {
  outline: none;
}

.page-component:focus {
  outline: none;
}

/* Footer styling exactly like Tabler */
.footer {
  padding: 1.5rem 0;
  margin-top: 2rem;
  border-top: 1px solid var(--tblr-border-color);
}

.footer.footer-transparent {
  background: transparent;
  border-top: 1px solid var(--tblr-border-color-translucent);
}

/* List inline dots */
.list-inline-dots .list-inline-item:not(:last-child)::after {
  content: '·';
  margin-left: 0.5rem;
  margin-right: 0.5rem;
  color: var(--tblr-text-muted);
}

/* Dark mode support - styles moved to App.vue for global coverage */

/* Loading overlay */
.position-fixed {
  z-index: 1050;
}
</style>