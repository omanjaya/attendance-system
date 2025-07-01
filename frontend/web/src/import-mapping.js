/**
 * Import Path Mapping
 * Reference for updating import paths after migration
 */

export const importMappings = {
  // Base components moved to common
  '@/components/common/BaseButton.vue': '@/components/common/BaseButton.vue',
  '@/components/common/BaseCard.vue': '@/components/common/BaseCard.vue',
  '@/components/common/BaseInput.vue': '@/components/common/BaseInput.vue',
  
  // UI components moved to common
  '@/components/common/': '@/components/common/',
  
  // Charts moved to common
  '@/components/common/': '@/components/common/',
  
  // New service imports
  '@/services/api.js': '@/services/api.js',
  '@/services/authService.js': '@/services/authService.js',
  '@/services/employeeService.js': '@/services/employeeService.js',
  
  // Store imports
  '@/stores/auth.js': '@/stores/auth.js',
  '@/stores/modules/employee.js': '@/stores/modules/employee.js',
  '@/stores/modules/attendance.js': '@/stores/modules/attendance.js',
  
  // Utility imports
  '@/utils/helpers.js': '@/utils/helpers.js',
  '@/utils/formatters.js': '@/utils/formatters.js',
  '@/utils/validators.js': '@/utils/validators.js'
}

// Commands to run for updating imports:
// find src -name "*.vue" -o -name "*.js" | xargs sed -i 's|@/components/common/|@/components/common/|g'
// find src -name "*.vue" -o -name "*.js" | xargs sed -i 's|@/components/common/|@/components/common/|g'
// find src -name "*.vue" -o -name "*.js" | xargs sed -i 's|@/components/common/|@/components/common/|g'
