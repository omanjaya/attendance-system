#!/usr/bin/env node

/**
 * Bundle Optimization Script
 * Implements automatic optimizations based on analysis results
 */

const fs = require('fs')
const path = require('path')

class BundleOptimizer {
  constructor() {
    this.projectRoot = path.join(__dirname, '..')
    this.srcPath = path.join(this.projectRoot, 'src')
    this.optimizations = []
  }

  async optimize() {
    console.log('🚀 Starting Bundle Optimization...\n')
    
    await this.optimizeViteConfig()
    await this.implementDynamicImports()
    await this.optimizeComponentImports()
    await this.createLazyRoutes()
    await this.optimizeAssets()
    
    this.printSummary()
  }

  async optimizeViteConfig() {
    console.log('⚙️ Optimizing Vite Configuration...')
    
    const viteConfigPath = path.join(this.projectRoot, 'vite.config.js')
    
    const optimizedConfig = `import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  build: {
    target: 'esnext',
    minify: 'terser',
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Core Vue ecosystem
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          
          // UI Framework
          'vendor-ui': ['@tabler/core'],
          
          // Charts and visualization
          'vendor-charts': ['chart.js'],
          
          // Utilities and helpers
          'vendor-utils': ['axios', 'date-fns'],
          
          // Large composables
          'composables-heavy': [
            './src/composables/useAccessibility.js',
            './src/composables/usePerformance.js',
            './src/composables/useSmartSearch.js'
          ]
        }
      }
    },
    
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    chunkSizeWarningLimit: 300
  },
  
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'chart.js'
    ]
  }
})
`

    fs.writeFileSync(viteConfigPath, optimizedConfig)
    this.optimizations.push('✅ Enhanced Vite configuration with manual chunks')
  }

  async implementDynamicImports() {
    console.log('📦 Implementing Dynamic Imports...')
    
    // Update router to use dynamic imports
    const routerPath = path.join(this.srcPath, 'router/index.js')
    
    if (fs.existsSync(routerPath)) {
      let routerContent = fs.readFileSync(routerPath, 'utf8')
      
      // Replace static imports with dynamic imports
      const routeUpdates = [
        {
          static: "import Dashboard from '../pages/Dashboard.vue'",
          dynamic: "() => import('../pages/Dashboard.vue')"
        },
        {
          static: "import EmployeeList from '../pages/employees/EmployeeList.vue'",
          dynamic: "() => import('../pages/employees/EmployeeList.vue')"
        },
        {
          static: "import EmployeeCreate from '../pages/employees/EmployeeCreate.vue'",
          dynamic: "() => import('../pages/employees/EmployeeCreate.vue')"
        }
      ]
      
      routeUpdates.forEach(update => {
        if (routerContent.includes(update.static)) {
          routerContent = routerContent.replace(update.static, '')
          routerContent = routerContent.replace(/component:\s*\w+/, `component: ${update.dynamic}`)
        }
      })
      
      fs.writeFileSync(routerPath, routerContent)
      this.optimizations.push('✅ Converted static imports to dynamic imports in router')
    }
  }

  async optimizeComponentImports() {
    console.log('🔧 Optimizing Component Imports...')
    
    // Create optimized component plugin
    const pluginPath = path.join(this.srcPath, 'plugins/components-optimized.js')
    
    const optimizedPlugin = `/**
 * Optimized Component Registration
 * Only registers components that are frequently used globally
 */

// Import only essential base components globally
import BaseButton from '@/components/base/BaseButton.vue'
import BaseCard from '@/components/base/BaseCard.vue'
import BaseInput from '@/components/base/BaseInput.vue'
import LoadingState from '@/components/ui/LoadingState.vue'

// Lazy load heavy components
const LazyImage = () => import('@/components/ui/LazyImage.vue')
const VirtualScroll = () => import('@/components/ui/VirtualScroll.vue')
const BaseChart = () => import('@/components/charts/BaseChart.vue')

export default {
  install(app) {
    // Register essential components globally
    app.component('BaseButton', BaseButton)
    app.component('BaseCard', BaseCard)
    app.component('BaseInput', BaseInput)
    app.component('LoadingState', LoadingState)
    
    // Register lazy components
    app.component('LazyImage', LazyImage)
    app.component('VirtualScroll', VirtualScroll)
    app.component('BaseChart', BaseChart)
  }
}
`

    fs.writeFileSync(pluginPath, optimizedPlugin)
    this.optimizations.push('✅ Created optimized component registration plugin')
  }

  async createLazyRoutes() {
    console.log('🛣️ Creating Lazy Route Structure...')
    
    const lazyRoutesContent = `/**
 * Lazy Route Definitions
 * All routes use dynamic imports for optimal code splitting
 */

export const lazyRoutes = [
  {
    path: '/',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { 
      title: 'Dashboard',
      preload: true // Preload this critical route
    }
  },
  
  // Authentication routes
  {
    path: '/auth',
    component: () => import('@/layouts/AuthLayout.vue'),
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/pages/auth/Login.vue'),
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'Register', 
        component: () => import('@/pages/auth/Register.vue'),
        meta: { title: 'Register' }
      }
    ]
  },
  
  // Employee management routes
  {
    path: '/employees',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'EmployeeList',
        component: () => import('@/pages/employees/EmployeeList.vue'),
        meta: { title: 'Employees' }
      },
      {
        path: 'create',
        name: 'EmployeeCreate',
        component: () => import('@/pages/employees/EmployeeCreate.vue'),
        meta: { title: 'Add Employee' }
      },
      {
        path: ':id',
        name: 'EmployeeView',
        component: () => import('@/pages/employees/EmployeeView.vue'),
        meta: { title: 'Employee Details' }
      },
      {
        path: ':id/edit',
        name: 'EmployeeEdit',
        component: () => import('@/pages/employees/EmployeeEdit.vue'),
        meta: { title: 'Edit Employee' }
      }
    ]
  },
  
  // Attendance routes
  {
    path: '/attendance',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'AttendanceCalendar',
        component: () => import('@/pages/attendance/AttendanceCalendar.vue'),
        meta: { title: 'Attendance Calendar' }
      },
      {
        path: 'history',
        name: 'AttendanceHistory',
        component: () => import('@/pages/attendance/AttendanceHistory.vue'),
        meta: { title: 'Attendance History' }
      },
      {
        path: 'kiosk',
        name: 'AttendanceKiosk',
        component: () => import('@/pages/attendance/AttendanceKiosk.vue'),
        meta: { 
          title: 'Attendance Kiosk',
          layout: 'KioskLayout'
        }
      }
    ]
  },
  
  // Reports routes (heavy components)
  {
    path: '/reports',
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'ReportsDashboard',
        component: () => import('@/pages/reports/ReportsDashboard.vue'),
        meta: { title: 'Reports' }
      },
      {
        path: 'attendance',
        name: 'AttendanceReports',
        component: () => import('@/pages/reports/AttendanceReports.vue'),
        meta: { title: 'Attendance Reports' }
      },
      {
        path: 'payroll',
        name: 'PayrollReports',
        component: () => import('@/pages/reports/PayrollReports.vue'),
        meta: { title: 'Payroll Reports' }
      }
    ]
  }
]

// Route preloading utility
export const preloadRoutes = (routes = []) => {
  routes.forEach(routeName => {
    const route = lazyRoutes.find(r => r.name === routeName)
    if (route && typeof route.component === 'function') {
      route.component()
    }
  })
}

// Critical routes that should be preloaded
export const criticalRoutes = ['Dashboard', 'Login', 'EmployeeList']
`

    const lazyRoutesPath = path.join(this.srcPath, 'router/lazy-routes.js')
    fs.writeFileSync(lazyRoutesPath, lazyRoutesContent)
    
    this.optimizations.push('✅ Created lazy route structure with preloading')
  }

  async optimizeAssets() {
    console.log('🎨 Optimizing Assets...')
    
    // Create optimized asset imports
    const assetOptimizationContent = `/**
 * Asset Optimization Utilities
 */

// Lazy load CSS for non-critical components
export const loadComponentStyles = async (componentName) => {
  try {
    await import(\`@/assets/css/components/\${componentName}.css\`)
  } catch (error) {
    console.warn(\`No specific styles for component: \${componentName}\`)
  }
}

// Image optimization utilities
export const optimizeImage = (src, options = {}) => {
  const {
    width = 'auto',
    height = 'auto',
    quality = 85,
    format = 'webp'
  } = options
  
  // In production, this would integrate with an image CDN
  return src
}

// CSS purging for production
export const purgeCSSConfig = {
  content: [
    './src/**/*.vue',
    './src/**/*.js',
    './src/**/*.ts'
  ],
  safelist: [
    // Tabler classes that might be used dynamically
    /^btn-/,
    /^card-/,
    /^alert-/,
    /^badge-/,
    /^text-/,
    /^bg-/
  ]
}
`

    const assetUtilsPath = path.join(this.srcPath, 'utils/asset-optimization.js')
    fs.writeFileSync(assetUtilsPath, assetOptimizationContent)
    
    this.optimizations.push('✅ Created asset optimization utilities')
  }

  printSummary() {
    console.log('\n🎉 OPTIMIZATION COMPLETE!\n')
    console.log('Applied Optimizations:')
    console.log('=' + '='.repeat(40))
    
    this.optimizations.forEach((optimization, index) => {
      console.log(`${index + 1}. ${optimization}`)
    })
    
    console.log('\n📋 Next Steps:')
    console.log('-'.repeat(20))
    console.log('1. Run: npm run build:analyze')
    console.log('2. Test: npm run dev')
    console.log('3. Verify: npm run build')
    console.log('4. Deploy: npm run preview')
    
    console.log('\n💡 Additional Recommendations:')
    console.log('-'.repeat(30))
    console.log('• Update main.js to use optimized component plugin')
    console.log('• Implement route preloading in App.vue')
    console.log('• Add bundle analysis to CI/CD pipeline')
    console.log('• Monitor bundle size in production')
  }
}

// Run optimization
if (require.main === module) {
  const optimizer = new BundleOptimizer()
  optimizer.optimize().catch(console.error)
}

module.exports = BundleOptimizer