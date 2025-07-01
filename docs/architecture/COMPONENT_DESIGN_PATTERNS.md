# Component Design Patterns & Standards

## 🎯 Design Philosophy

### Consistency First
Every component should follow the same patterns for props, events, slots, and lifecycle management. This ensures predictability and maintainability across the entire codebase.

### Composition Over Inheritance
Use Vue 3's Composition API consistently. Components should be composable, reusable, and testable in isolation.

## 📋 Component Structure Template

```vue
<template>
  <!-- Always use semantic HTML -->
  <div 
    :class="componentClasses"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  >
    <!-- Named slots with fallbacks -->
    <slot name="header" v-if="$slots.header || title">
      <h3 v-if="title" class="component-title">{{ title }}</h3>
    </slot>
    
    <!-- Main content -->
    <div class="component-content">
      <slot>
        <!-- Default fallback content -->
        <p class="text-muted">No content provided</p>
      </slot>
    </div>
    
    <!-- Footer slot -->
    <slot name="footer" v-if="$slots.footer" />
    
    <!-- Loading overlay -->
    <LoadingState v-if="loading" overlay />
  </div>
</template>

<script setup>
/**
 * ComponentName
 * 
 * Brief description of component purpose and usage
 * 
 * @example
 * <ComponentName
 *   :prop="value"
 *   @event="handler"
 * >
 *   Content here
 * </ComponentName>
 */

import { computed, useAttrs, useSlots } from 'vue'

// Define props with types, defaults, and validation
const props = defineProps({
  // Always define type and default
  title: {
    type: String,
    default: ''
  },
  
  // Use validators for complex props
  variant: {
    type: String,
    default: 'default',
    validator: (value) => [
      'default', 'primary', 'secondary', 'success', 'warning', 'danger'
    ].includes(value)
  },
  
  // Boolean props
  loading: {
    type: Boolean,
    default: false
  },
  
  // Object/Array props with factory defaults
  config: {
    type: Object,
    default: () => ({})
  }
})

// Explicit emit definitions
const emit = defineEmits({
  // Event with validation
  'update:modelValue': (value) => value !== undefined,
  
  // Event with payload structure
  'change': (payload) => {
    return payload && typeof payload === 'object' && 'value' in payload
  },
  
  // Simple events
  'click': null,
  'submit': null
})

// Composables and reactive state
const attrs = useAttrs()
const slots = useSlots()

// Computed properties
const componentClasses = computed(() => [
  'component-base',
  `component--${props.variant}`,
  {
    'component--loading': props.loading,
    'component--has-header': slots.header || props.title,
    'component--has-footer': slots.footer
  }
])

const ariaLabel = computed(() => {
  return attrs['aria-label'] || props.title || 'Component'
})

// Methods
const handleClick = (event) => {
  if (props.loading) return
  emit('click', event)
}

const handleSubmit = (data) => {
  emit('submit', {
    data,
    timestamp: new Date(),
    source: 'component'
  })
}

// Expose public methods if needed
defineExpose({
  focus: () => {
    // Implementation
  },
  reset: () => {
    // Implementation
  }
})
</script>

<style scoped>
/* Component-specific styles */
.component-base {
  /* Base styles */
}

.component--primary {
  /* Variant styles */
}

.component--loading {
  /* Loading state styles */
}

/* Responsive design */
@media (max-width: 768px) {
  .component-base {
    /* Mobile styles */
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .component-base {
    /* Dark mode styles */
  }
}
</style>
```

## 🏗️ Architecture Patterns

### 1. Component Categories

#### Base Components (Foundational)
```javascript
// Located in: components/common/
const baseComponents = {
  'BaseButton': 'Primary button component',
  'BaseInput': 'Form input with validation',
  'BaseCard': 'Container component',
  'BaseModal': 'Modal dialog component',
  'BaseTable': 'Data table component'
}

// Characteristics:
// - No business logic
// - Highly reusable
// - Consistent API
// - Full accessibility support
// - Comprehensive prop validation
```

#### Layout Components (Structural)
```javascript
// Located in: components/layout/
const layoutComponents = {
  'AppLayout': 'Main application layout',
  'AuthLayout': 'Authentication layout', 
  'KioskLayout': 'Kiosk mode layout',
  'Sidebar': 'Navigation sidebar',
  'Header': 'Page header',
  'Breadcrumbs': 'Navigation breadcrumbs'
}

// Characteristics:
// - Structural components
// - Router integration
// - State management integration
// - Responsive design
// - Theme support
```

#### Module Components (Feature-specific)
```javascript
// Located in: components/modules/[feature]/
const moduleComponents = {
  'employee/': 'Employee management components',
  'attendance/': 'Attendance tracking components',
  'schedule/': 'Schedule management components',
  'payroll/': 'Payroll processing components'
}

// Characteristics:
// - Business logic integration
// - Service layer consumption
// - Store integration
// - Feature-specific validation
// - Complex interactions
```

### 2. Props Pattern Standards

#### Prop Definition Standards
```javascript
const propPatterns = {
  // Basic props
  basicProp: {
    type: String,
    default: '',
    required: false
  },
  
  // Required props
  requiredProp: {
    type: Object,
    required: true
  },
  
  // Validated props
  validatedProp: {
    type: String,
    default: 'default',
    validator: (value) => ['option1', 'option2', 'option3'].includes(value)
  },
  
  // Complex props
  complexProp: {
    type: [String, Number, Object],
    default: () => ({}),
    validator: (value) => {
      // Complex validation logic
      return true
    }
  },
  
  // Model props (for v-model)
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: undefined
  }
}
```

#### Prop Naming Conventions
```javascript
const propNaming = {
  // Boolean props - use 'is', 'has', 'can', 'should'
  'isLoading': Boolean,
  'hasError': Boolean,
  'canEdit': Boolean,
  'shouldShow': Boolean,
  
  // Event handlers - use 'on' prefix for function props
  'onSubmit': Function,
  'onCancel': Function,
  
  // Configuration objects
  'config': Object,
  'options': Object,
  'settings': Object,
  
  // Data arrays
  'items': Array,
  'data': Array,
  'list': Array
}
```

### 3. Event Patterns

#### Event Naming Standards
```javascript
// Emit definitions with validation
const emit = defineEmits({
  // Update events (for v-model)
  'update:modelValue': (value) => true,
  'update:config': (config) => typeof config === 'object',
  
  // Action events
  'submit': (data) => data && typeof data === 'object',
  'cancel': () => true,
  'save': (item) => item && item.id,
  'delete': (id) => typeof id === 'string' || typeof id === 'number',
  
  // State change events
  'loading': (isLoading) => typeof isLoading === 'boolean',
  'error': (error) => error instanceof Error || typeof error === 'string',
  'success': (message) => typeof message === 'string',
  
  // User interaction events
  'click': (event) => event instanceof Event,
  'focus': (event) => event instanceof Event,
  'blur': (event) => event instanceof Event,
  
  // Custom business events
  'employee:created': (employee) => employee && employee.id,
  'attendance:checked-in': (record) => record && record.timestamp
})
```

#### Event Payload Standards
```javascript
// Standard event payload structure
const eventPayload = {
  // Include relevant data
  data: {}, // The main payload
  
  // Include metadata
  timestamp: new Date(),
  source: 'component-name',
  type: 'event-type',
  
  // Include context when needed
  context: {
    userId: 'current-user-id',
    route: 'current-route'
  }
}

// Example usage
emit('employee:created', {
  data: newEmployee,
  timestamp: new Date(),
  source: 'EmployeeCreateForm',
  type: 'create'
})
```

### 4. Slot Patterns

#### Named Slots with Fallbacks
```vue
<template>
  <!-- Header slot with fallback -->
  <header v-if="$slots.header || title" class="component-header">
    <slot name="header">
      <h2>{{ title }}</h2>
    </slot>
  </header>
  
  <!-- Default slot with fallback -->
  <main class="component-content">
    <slot>
      <div class="empty-state">
        <p>No content provided</p>
      </div>
    </slot>
  </main>
  
  <!-- Actions slot -->
  <footer v-if="$slots.actions" class="component-actions">
    <slot name="actions" :data="componentData" :methods="componentMethods" />
  </footer>
  
  <!-- Scoped slots for complex data -->
  <div v-if="items.length > 0" class="items-list">
    <div v-for="item in items" :key="item.id">
      <slot name="item" :item="item" :index="index" :methods="itemMethods">
        <!-- Default item rendering -->
        <div class="default-item">{{ item.name }}</div>
      </slot>
    </div>
  </div>
</template>
```

### 5. Lifecycle Patterns

#### Composition API Lifecycle
```javascript
import { onMounted, onUnmounted, onBeforeMount, watch } from 'vue'

// Component setup
export default {
  setup(props, { emit }) {
    // Reactive state
    const state = reactive({
      loading: false,
      data: null,
      error: null
    })
    
    // Before mount - prepare data
    onBeforeMount(() => {
      // Initialize configuration
      // Setup event listeners
      // Validate props
    })
    
    // Mounted - DOM ready
    onMounted(() => {
      // API calls
      // DOM manipulation
      // Third-party library initialization
      fetchData()
    })
    
    // Cleanup
    onUnmounted(() => {
      // Remove event listeners
      // Cancel API requests
      // Cleanup timers
      cleanup()
    })
    
    // Watchers
    watch(() => props.config, (newConfig) => {
      // React to prop changes
      updateConfiguration(newConfig)
    }, { deep: true })
    
    // Methods
    const fetchData = async () => {
      state.loading = true
      try {
        state.data = await api.getData()
      } catch (error) {
        state.error = error
        emit('error', error)
      } finally {
        state.loading = false
      }
    }
    
    const cleanup = () => {
      // Cleanup logic
    }
    
    return {
      state,
      fetchData
    }
  }
}
```

### 6. State Management Patterns

#### Local vs Global State
```javascript
// Local state - component-specific
const localState = reactive({
  formData: {},
  validation: {},
  ui: {
    loading: false,
    error: null
  }
})

// Global state - via stores
import { useEmployeeStore } from '@/stores/modules/employee'
import { useUIStore } from '@/stores/modules/ui'

const employeeStore = useEmployeeStore()
const uiStore = useUIStore()

// Computed from stores
const employees = computed(() => employeeStore.all)
const loading = computed(() => employeeStore.loading)
```

### 7. Error Handling Patterns

#### Component Error Boundaries
```javascript
import { onErrorCaptured } from 'vue'

// Error handling in component
const error = ref(null)
const hasError = computed(() => !!error.value)

onErrorCaptured((err, instance, info) => {
  error.value = {
    message: err.message,
    info,
    timestamp: new Date()
  }
  
  // Log to error service
  console.error('Component error:', err)
  
  // Emit error event
  emit('error', error.value)
  
  // Prevent error propagation
  return false
})

// Error recovery
const clearError = () => {
  error.value = null
}

const retry = () => {
  clearError()
  // Retry failed operation
}
```

### 8. Accessibility Patterns

#### ARIA and Semantic HTML
```vue
<template>
  <!-- Semantic structure -->
  <article 
    class="component"
    :aria-label="ariaLabel"
    :aria-describedby="hasDescription ? 'component-description' : null"
    role="region"
  >
    <!-- Skip links -->
    <a 
      href="#main-content" 
      class="skip-link"
      @click="focusMainContent"
    >
      Skip to main content
    </a>
    
    <!-- Accessible form -->
    <form @submit.prevent="handleSubmit" novalidate>
      <fieldset>
        <legend>{{ formTitle }}</legend>
        
        <div class="form-group">
          <label for="input-field" class="required">
            Field Label
          </label>
          <input
            id="input-field"
            v-model="formData.field"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.field }"
            :aria-describedby="errors.field ? 'field-error' : 'field-help'"
            :aria-invalid="errors.field ? 'true' : 'false'"
            required
          >
          <div id="field-help" class="form-text">
            Help text for the field
          </div>
          <div 
            v-if="errors.field"
            id="field-error" 
            class="invalid-feedback"
            role="alert"
          >
            {{ errors.field }}
          </div>
        </div>
      </fieldset>
    </form>
    
    <!-- Accessible data table -->
    <table 
      role="table" 
      aria-label="Data table"
      :aria-rowcount="data.length + 1"
    >
      <caption>{{ tableCaption }}</caption>
      <thead>
        <tr role="row">
          <th 
            v-for="column in columns" 
            :key="column.key"
            role="columnheader"
            :aria-sort="getSortDirection(column.key)"
            @click="sort(column.key)"
            @keydown.enter="sort(column.key)"
            @keydown.space="sort(column.key)"
            tabindex="0"
          >
            {{ column.label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="(item, index) in data" 
          :key="item.id"
          role="row"
          :aria-rowindex="index + 2"
        >
          <td 
            v-for="column in columns"
            :key="column.key"
            role="gridcell"
          >
            {{ item[column.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </article>
</template>
```

## 📚 Implementation Guidelines

### 1. Component Creation Checklist
- [ ] Follow naming conventions (PascalCase)
- [ ] Define props with types and defaults
- [ ] Implement explicit emit definitions
- [ ] Add comprehensive prop validation
- [ ] Include accessibility attributes
- [ ] Write component documentation
- [ ] Add TypeScript support
- [ ] Include unit tests
- [ ] Ensure responsive design
- [ ] Test with screen readers

### 2. Code Quality Standards
- [ ] Use Composition API consistently
- [ ] Implement proper error handling
- [ ] Add loading states
- [ ] Include empty states
- [ ] Optimize for performance
- [ ] Follow WCAG 2.1 AA guidelines
- [ ] Support dark mode
- [ ] Mobile-first responsive design
- [ ] Cross-browser compatibility

### 3. Documentation Requirements
- [ ] Component purpose and usage
- [ ] Props documentation with examples
- [ ] Events documentation with payloads
- [ ] Slots documentation with scoped data
- [ ] Usage examples
- [ ] Accessibility notes
- [ ] Browser support information
- [ ] Migration guides for breaking changes

This comprehensive pattern guide ensures consistency, maintainability, and accessibility across all Vue components in the application.