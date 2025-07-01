import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  
  // Define global constants untuk Vue feature flags
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  },
  
  resolve: {
    alias: {
      // Vue alias untuk mendukung template compilation
      'vue': 'vue/dist/vue.esm-bundler.js',
      
      // Path aliases
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@composables': resolve(__dirname, 'src/composables'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@stores': resolve(__dirname, 'src/stores'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@services': resolve(__dirname, 'src/services'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@layouts': resolve(__dirname, 'src/layouts'),
      '@common': resolve(__dirname, 'src/components/common'),
      '@modules': resolve(__dirname, 'src/components/modules')
    }
  },
  
  publicDir: 'public',
  
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg'],
  
  build: {
    target: 'esnext',
    minify: 'terser',
    
    rollupOptions: {
      output: {
        manualChunks: {
          // Core Vue ecosystem
          'vendor-vue': ['vue', 'vue-router', 'pinia'],
          
          // UI framework and icons
          'vendor-ui': ['@tabler/core', '@tabler/icons-vue'],
          
          // Charts and visualization (separate from utils)
          'vendor-charts': ['chart.js'],
          
          // HTTP client and utilities
          'vendor-utils': ['axios'],
          
          // Layout components (loaded on every page)
          'layout': [
            './src/layouts/TablerLayout.vue',
            './src/layouts/AuthLayout.vue'
          ]
        },
        
        // Asset file naming
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        }
      }
    },
    
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    
    chunkSizeWarningLimit: 300,
    
    // Enable source maps for better debugging
    sourcemap: process.env.NODE_ENV === 'development'
  },
  
  optimizeDeps: {
    include: [
      'vue',
      'vue-router',
      'pinia',
      'axios',
      'chart.js',
      '@tabler/icons-vue'
    ],
    exclude: ['@tabler/core']
  },
  
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: process.env.VITE_USE_POLLING === 'true'
    }
  },
  
  preview: {
    port: 4173,
    host: true
  },
  
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/variables.scss";`
      }
    }
  }
})
