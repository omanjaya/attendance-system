import { describe, it, expect, beforeEach, vi, computed, defineAsyncComponent } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEmployeeStore } from '@/stores/employees'
import { useAuth } from '@/composables/useAuth'
import AppLayout from '@/layouts/AppLayout.vue'
import Sidebar from '@/layouts/Sidebar.vue'
import Header from '@/layouts/Header.vue'
import UserDropdown from '@/layouts/UserDropdown.vue'

// Mock router routes
const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', name: 'dashboard', component: { template: '<div>Dashboard</div>' }, meta: { requiresAuth: true } },
  { path: '/employees', name: 'employees', component: { template: '<div>Employees</div>' }, meta: { requiresAuth: true } },
  { path: '/auth/login', name: 'login', component: { template: '<div>Login</div>' } }
]

const createTestRouter = () => {
  return createRouter({
    history: createWebHistory(),
    routes
  })
}

// Mock notifications
const mockShowNotification = vi.fn()
vi.mock('@/composables/useNotifications', () => ({
  useNotifications: () => ({
    showNotification: mockShowNotification
  })
}))

describe('Application Integration Tests', () => {
  let authStore
  let employeeStore
  let router
  let pinia

  beforeEach(async () => {
    pinia = createPinia()
    setActivePinia(pinia)
    authStore = useAuthStore()
    employeeStore = useEmployeeStore()
    router = createTestRouter()
    
    vi.clearAllMocks()
    mockShowNotification.mockClear()
  })

  describe('Application Layout Integration', () => {
    it('integrates authenticated layout with all components', async () => {
      // Set up authenticated user
      authStore.user = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        roles: [{ name: 'admin' }],
        permissions: [{ name: 'employees.view' }]
      }
      authStore.token = 'test-token'

      const wrapper = mount(AppLayout, {
        global: {
          plugins: [pinia, router],
          stubs: {
            RouterView: {
              template: '<div class="router-content">Dashboard Content</div>'
            },
            TablerIcon: true,
            LoadingSpinner: true
          }
        }
      })

      // Verify layout structure
      expect(wrapper.find('.sidebar').exists()).toBe(true)
      expect(wrapper.find('.header').exists()).toBe(true)
      expect(wrapper.find('.main-content').exists()).toBe(true)
      
      // Verify user information is displayed
      expect(wrapper.text()).toContain('Test User')
    })

    it('handles unauthenticated state across layout', async () => {
      // No authenticated user
      authStore.user = null
      authStore.token = null

      const wrapper = mount(AppLayout, {
        global: {
          plugins: [pinia, router],
          stubs: {
            RouterView: {
              template: '<div class="router-content">Login Content</div>'
            },
            TablerIcon: true
          }
        }
      })

      // Should not show authenticated layout elements
      expect(wrapper.find('.sidebar').exists()).toBe(false)
      expect(wrapper.find('.header').exists()).toBe(false)
    })
  })

  describe('Navigation Integration', () => {
    it('integrates sidebar navigation with routing and permissions', async () => {
      authStore.user = {
        id: 1,
        name: 'Admin User',
        roles: [{ name: 'admin' }],
        permissions: [
          { name: 'dashboard.view' },
          { name: 'employees.view' },
          { name: 'reports.view' }
        ]
      }
      authStore.token = 'admin-token'

      const wrapper = mount(Sidebar, {
        global: {
          plugins: [pinia, router],
          stubs: {
            RouterLink: {
              template: '<a :href="to" class="nav-link"><slot /></a>',
              props: ['to']
            },
            TablerIcon: true,
            RoleGuard: {
              template: '<div v-if="hasAccess"><slot /></div>',
              props: ['permissions'],
              setup(props) {
                const { hasPermission } = useAuth()
                const hasAccess = computed(() => {
                  if (!props.permissions?.length) return true
                  return props.permissions.some(permission => hasPermission(permission))
                })
                return { hasAccess }
              }
            }
          }
        }
      })

      // Should show navigation items based on permissions
      expect(wrapper.text()).toContain('Dashboard')
      expect(wrapper.text()).toContain('Employees')
      
      // Test navigation
      const employeesLink = wrapper.find('a[href="/employees"]')
      expect(employeesLink.exists()).toBe(true)
    })

    it('integrates breadcrumb navigation', async () => {
      authStore.user = { id: 1, name: 'User' }
      authStore.token = 'token'

      // Navigate to employees page
      await router.push('/employees')
      
      const wrapper = mount(Header, {
        global: {
          plugins: [pinia, router],
          stubs: {
            TablerIcon: true,
            UserDropdown: true
          }
        }
      })

      // Should show current page breadcrumb
      expect(wrapper.text()).toContain('Employees')
    })
  })

  describe('State Management Integration', () => {
    it('integrates multiple stores working together', async () => {
      // Set up auth state
      authStore.user = {
        id: 1,
        name: 'Manager',
        roles: [{ name: 'manager' }],
        permissions: [{ name: 'employees.view' }]
      }
      authStore.token = 'manager-token'

      // Set up employee state
      employeeStore.employees = [
        { id: 1, name: 'Employee 1', status: 'active' },
        { id: 2, name: 'Employee 2', status: 'inactive' }
      ]

      const TestComponent = {
        template: `
          <div>
            <div class="user-info">{{ authUser?.name }}</div>
            <div class="employee-count">{{ employeeCount }}</div>
            <div class="active-employees">{{ activeEmployees }}</div>
          </div>
        `,
        setup() {
          const { user: authUser } = useAuth()
          const { employees } = useEmployeeStore()
          
          const employeeCount = computed(() => employees.length)
          const activeEmployees = computed(() => 
            employees.filter(emp => emp.status === 'active').length
          )
          
          return {
            authUser,
            employeeCount,
            activeEmployees
          }
        }
      }

      const wrapper = mount(TestComponent, {
        global: {
          plugins: [pinia, router]
        }
      })

      expect(wrapper.find('.user-info').text()).toBe('Manager')
      expect(wrapper.find('.employee-count').text()).toBe('2')
      expect(wrapper.find('.active-employees').text()).toBe('1')
    })
  })

  describe('Error Handling Integration', () => {
    it('integrates global error handling across the application', async () => {
      authStore.user = { id: 1, name: 'User' }
      authStore.token = 'token'

      // Mock a component that triggers an error
      const ErrorComponent = {
        template: '<div>{{ data.nonexistent.property }}</div>',
        setup() {
          return { data: {} }
        }
      }

      // Create wrapper with error handling
      const wrapper = mount({
        template: '<Suspense><ErrorComponent /></Suspense>',
        components: { ErrorComponent },
        errorCaptured(err) {
          mockShowNotification({
            type: 'error',
            title: 'Application Error',
            message: 'An unexpected error occurred'
          })
          return false
        }
      }, {
        global: {
          plugins: [pinia, router]
        }
      })

      await wrapper.vm.$nextTick()

      // Verify error notification was shown
      expect(mockShowNotification).toHaveBeenCalledWith({
        type: 'error',
        title: 'Application Error',
        message: 'An unexpected error occurred'
      })
    })
  })

  describe('Route Protection Integration', () => {
    it('integrates route guards with authentication state', async () => {
      let routeGuardCalled = false
      let redirectedTo = null

      // Mock router with navigation guards
      const testRouter = createRouter({
        history: createWebHistory(),
        routes: [
          {
            path: '/protected',
            name: 'protected',
            component: { template: '<div>Protected Content</div>' },
            meta: { requiresAuth: true },
            beforeEnter: (to, from, next) => {
              routeGuardCalled = true
              const { isAuthenticated } = useAuth()
              
              if (!isAuthenticated.value) {
                redirectedTo = '/auth/login'
                next({ path: '/auth/login', query: { redirect: to.fullPath } })
              } else {
                next()
              }
            }
          },
          { path: '/auth/login', name: 'login', component: { template: '<div>Login</div>' } }
        ]
      })

      const wrapper = mount({
        template: '<router-view />',
        global: {
          plugins: [pinia, testRouter]
        }
      })

      // Try to navigate to protected route without authentication
      await testRouter.push('/protected')
      await wrapper.vm.$nextTick()

      expect(routeGuardCalled).toBe(true)
      expect(redirectedTo).toBe('/auth/login')
      expect(testRouter.currentRoute.value.path).toBe('/auth/login')
      expect(testRouter.currentRoute.value.query.redirect).toBe('/protected')
    })

    it('allows access to protected routes when authenticated', async () => {
      // Set up authentication
      authStore.user = { id: 1, name: 'User' }
      authStore.token = 'token'

      let accessGranted = false

      const testRouter = createRouter({
        history: createWebHistory(),
        routes: [
          {
            path: '/protected',
            name: 'protected',
            component: { template: '<div>Protected Content</div>' },
            meta: { requiresAuth: true },
            beforeEnter: (to, from, next) => {
              const { isAuthenticated } = useAuth()
              
              if (isAuthenticated.value) {
                accessGranted = true
                next()
              } else {
                next('/auth/login')
              }
            }
          }
        ]
      })

      const wrapper = mount({
        template: '<router-view />',
        global: {
          plugins: [pinia, testRouter]
        }
      })

      await testRouter.push('/protected')
      await wrapper.vm.$nextTick()

      expect(accessGranted).toBe(true)
      expect(testRouter.currentRoute.value.path).toBe('/protected')
      expect(wrapper.text()).toContain('Protected Content')
    })
  })

  describe('Real-time Features Integration', () => {
    it('integrates reactive state updates across components', async () => {
      authStore.user = { id: 1, name: 'User' }
      authStore.token = 'token'

      const ParentComponent = {
        template: `
          <div>
            <div class="employee-count">Total: {{ employeeStore.total }}</div>
            <button @click="addEmployee" class="add-btn">Add Employee</button>
            <ChildComponent />
          </div>
        `,
        setup() {
          const employeeStore = useEmployeeStore()
          
          const addEmployee = () => {
            employeeStore.employees.push({
              id: Date.now(),
              name: 'New Employee',
              status: 'active'
            })
          }
          
          return { employeeStore, addEmployee }
        }
      }

      const ChildComponent = {
        template: '<div class="child-count">Child sees: {{ employeeStore.employees.length }}</div>',
        setup() {
          const employeeStore = useEmployeeStore()
          return { employeeStore }
        }
      }

      const wrapper = mount(ParentComponent, {
        components: { ChildComponent },
        global: {
          plugins: [pinia, router]
        }
      })

      // Initial state
      expect(wrapper.find('.employee-count').text()).toBe('Total: 0')
      expect(wrapper.find('.child-count').text()).toBe('Child sees: 0')

      // Add employee and verify reactivity
      await wrapper.find('.add-btn').trigger('click')
      await wrapper.vm.$nextTick()

      expect(wrapper.find('.child-count').text()).toBe('Child sees: 1')
    })
  })

  describe('Performance Integration', () => {
    it('integrates lazy loading and code splitting', async () => {
      let componentLoaded = false

      const LazyComponent = defineAsyncComponent(() => {
        componentLoaded = true
        return Promise.resolve({
          template: '<div>Lazy Loaded Component</div>'
        })
      })

      const wrapper = mount({
        template: '<Suspense><LazyComponent v-if="showLazy" /></Suspense>',
        components: { LazyComponent },
        data() {
          return { showLazy: false }
        }
      }, {
        global: {
          plugins: [pinia, router]
        }
      })

      expect(componentLoaded).toBe(false)

      // Trigger lazy loading
      await wrapper.setData({ showLazy: true })
      await wrapper.vm.$nextTick()
      await new Promise(resolve => setTimeout(resolve, 100))

      expect(componentLoaded).toBe(true)
      expect(wrapper.text()).toContain('Lazy Loaded Component')
    })
  })
})