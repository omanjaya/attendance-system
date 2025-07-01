<template>
  <div class="form-group" :class="groupClasses">
    <!-- Label -->
    <label v-if="label || required" :for="inputId" class="form-label" :class="labelClasses">
      {{ label }}
      <span v-if="required" class="text-danger ms-1">*</span>
      <span v-if="optional" class="text-muted ms-1">(optional)</span>
    </label>
    
    <!-- Input wrapper -->
    <div class="input-wrapper" :class="wrapperClasses">
      <!-- Prefix icon/content -->
      <div v-if="$slots.prefix || prefixIcon" class="input-prefix">
        <slot name="prefix">
          <svg v-if="prefixIcon" class="icon input-icon">
            <use :href="`#tabler-${prefixIcon}`"></use>
          </svg>
        </slot>
      </div>
      
      <!-- Input element -->
      <component
        :is="inputComponent"
        :id="inputId"
        :name="name"
        :type="type"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :autocomplete="autocomplete"
        :rows="rows"
        :cols="cols"
        :min="min"
        :max="max"
        :step="step"
        :pattern="pattern"
        :maxlength="maxlength"
        :minlength="minlength"
        :class="inputClasses"
        :value="modelValue"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
        v-bind="$attrs"
      >
        <!-- Select options -->
        <template v-if="type === 'select'">
          <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
          <option v-for="option in options" :key="getOptionValue(option)" :value="getOptionValue(option)">
            {{ getOptionLabel(option) }}
          </option>
        </template>
      </component>
      
      <!-- Suffix icon/content -->
      <div v-if="$slots.suffix || suffixIcon || clearable || type === 'password'" class="input-suffix">
        <!-- Clear button -->
        <button
          v-if="clearable && modelValue && !disabled && !readonly"
          type="button"
          class="input-clear"
          @click="clearValue"
        >
          <svg class="icon">
            <use href="#tabler-x"></use>
          </svg>
        </button>
        
        <!-- Password toggle -->
        <button
          v-if="type === 'password'"
          type="button"
          class="input-password-toggle"
          @click="togglePassword"
        >
          <svg class="icon">
            <use :href="showPassword ? '#tabler-eye-off' : '#tabler-eye'"></use>
          </svg>
        </button>
        
        <!-- Custom suffix -->
        <slot name="suffix">
          <svg v-if="suffixIcon" class="icon input-icon">
            <use :href="`#tabler-${suffixIcon}`"></use>
          </svg>
        </slot>
      </div>
    </div>
    
    <!-- Help text -->
    <div v-if="helpText && !error" class="form-help">
      {{ helpText }}
    </div>
    
    <!-- Error message -->
    <div v-if="error" class="form-error">
      {{ error }}
    </div>
    
    <!-- Character count -->
    <div v-if="showCharCount && maxlength" class="form-char-count" :class="{ 'text-danger': isCharLimitExceeded }">
      {{ characterCount }}/{{ maxlength }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'

const props = defineProps({
  // v-model
  modelValue: {
    type: [String, Number, Boolean, Array],
    default: ''
  },
  
  // Input attributes
  type: {
    type: String,
    default: 'text',
    validator: (value) => [
      'text', 'email', 'password', 'number', 'tel', 'url', 'search',
      'textarea', 'select', 'date', 'datetime-local', 'time'
    ].includes(value)
  },
  
  name: String,
  placeholder: String,
  autocomplete: String,
  
  // Validation
  required: {
    type: Boolean,
    default: false
  },
  
  optional: {
    type: Boolean,
    default: false
  },
  
  disabled: {
    type: Boolean,
    default: false
  },
  
  readonly: {
    type: Boolean,
    default: false
  },
  
  // Labels and help
  label: String,
  helpText: String,
  error: String,
  
  // Input constraints
  min: [String, Number],
  max: [String, Number],
  step: [String, Number],
  pattern: String,
  maxlength: [String, Number],
  minlength: [String, Number],
  
  // Textarea specific
  rows: {
    type: [String, Number],
    default: 3
  },
  cols: [String, Number],
  
  // Select specific
  options: {
    type: Array,
    default: () => []
  },
  
  optionLabel: {
    type: String,
    default: 'label'
  },
  
  optionValue: {
    type: String,
    default: 'value'
  },
  
  // Input styling
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'filled', 'underlined'].includes(value)
  },
  
  // Icons
  prefixIcon: String,
  suffixIcon: String,
  
  // Features
  clearable: {
    type: Boolean,
    default: false
  },
  
  showCharCount: {
    type: Boolean,
    default: false
  },
  
  // Auto-resize for textarea
  autoResize: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'keydown', 'clear'])

// Internal state
const inputId = computed(() => props.name || `input-${Math.random().toString(36).substr(2, 9)}`)
const showPassword = ref(false)
const isFocused = ref(false)

// Input component type
const inputComponent = computed(() => {
  if (props.type === 'textarea') return 'textarea'
  if (props.type === 'select') return 'select'
  return 'input'
})

// Input type (handle password toggle)
const inputType = computed(() => {
  if (props.type === 'password') {
    return showPassword.value ? 'text' : 'password'
  }
  return props.type
})

// Character count
const characterCount = computed(() => {
  return String(props.modelValue || '').length
})

const isCharLimitExceeded = computed(() => {
  return props.maxlength && characterCount.value > props.maxlength
})

// Classes
const groupClasses = computed(() => {
  const classes = []
  
  if (props.error) {
    classes.push('has-error')
  }
  
  if (isFocused.value) {
    classes.push('is-focused')
  }
  
  if (props.disabled) {
    classes.push('is-disabled')
  }
  
  return classes
})

const labelClasses = computed(() => {
  const classes = []
  
  if (props.required) {
    classes.push('required')
  }
  
  return classes
})

const wrapperClasses = computed(() => {
  const classes = ['input-group']
  
  if (props.variant !== 'default') {
    classes.push(`input-group-${props.variant}`)
  }
  
  if (props.size !== 'md') {
    classes.push(`input-group-${props.size}`)
  }
  
  if (props.error) {
    classes.push('is-invalid')
  }
  
  if (isFocused.value) {
    classes.push('is-focused')
  }
  
  return classes
})

const inputClasses = computed(() => {
  const classes = ['form-control']
  
  if (props.size !== 'md') {
    classes.push(`form-control-${props.size}`)
  }
  
  if (props.error) {
    classes.push('is-invalid')
  }
  
  return classes
})

// Event handlers
const handleInput = (event) => {
  const value = event.target.value
  emit('update:modelValue', value)
  
  if (props.autoResize && props.type === 'textarea') {
    nextTick(() => {
      autoResize(event.target)
    })
  }
}

const handleChange = (event) => {
  emit('change', event)
}

const handleFocus = (event) => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = (event) => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = (event) => {
  emit('keydown', event)
}

const clearValue = () => {
  emit('update:modelValue', '')
  emit('clear')
}

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

// Auto-resize textarea
const autoResize = (textarea) => {
  textarea.style.height = 'auto'
  // Cap textarea height at 500px to prevent excessive growth
  const newHeight = Math.min(textarea.scrollHeight, 500)
  textarea.style.height = newHeight + 'px'
}

// Option helpers for select
const getOptionValue = (option) => {
  if (typeof option === 'object') {
    return option[props.optionValue]
  }
  return option
}

const getOptionLabel = (option) => {
  if (typeof option === 'object') {
    return option[props.optionLabel]
  }
  return option
}

// Watch for auto-resize
watch(() => props.modelValue, () => {
  if (props.autoResize && props.type === 'textarea') {
    nextTick(() => {
      const textarea = document.getElementById(inputId.value)
      if (textarea) {
        autoResize(textarea)
      }
    })
  }
})
</script>

<style scoped>
/* Form Group */
.form-group {
  margin-bottom: var(--space-4);
}

.form-group.has-error .form-label {
  color: var(--color-danger);
}

.form-group.is-disabled {
  opacity: 0.6;
}

/* Form Label */
.form-label {
  display: block;
  margin-bottom: var(--space-2);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--text-primary);
  line-height: var(--line-height-normal);
}

/* Input Wrapper */
.input-group {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  border: var(--input-border-width) solid var(--border-medium);
  border-radius: var(--input-border-radius);
  transition: var(--input-transition);
  background-color: var(--bg-surface);
}

.input-group:focus-within,
.input-group.is-focused {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 0.2rem rgba(32, 107, 196, 0.15);
}

.input-group.is-invalid {
  border-color: var(--color-danger);
}

.input-group.is-invalid:focus-within {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 0.2rem rgba(214, 51, 132, 0.15);
}

/* Input Group Variants */
.input-group-filled {
  background-color: var(--color-gray-50);
  border: none;
}

.input-group-underlined {
  border: none;
  border-bottom: 2px solid var(--border-medium);
  border-radius: 0;
}

/* Input Group Sizes */
.input-group-sm {
  font-size: var(--font-size-sm);
}

.input-group-lg {
  font-size: var(--font-size-lg);
}

/* Form Control */
.form-control {
  flex: 1;
  min-width: 0;
  padding: var(--input-padding-y) var(--input-padding-x);
  font-family: var(--font-family-base);
  font-size: var(--input-font-size);
  font-weight: var(--font-weight-normal);
  line-height: var(--input-line-height);
  color: var(--text-primary);
  background-color: transparent;
  border: none;
  outline: none;
  transition: var(--input-transition);
}

.form-control::placeholder {
  color: var(--text-muted);
  opacity: 1;
}

.form-control:disabled {
  background-color: var(--bg-disabled);
  color: var(--text-muted);
  cursor: not-allowed;
}

/* Form Control Sizes */
.form-control-sm {
  padding: var(--space-1) var(--space-2);
  font-size: var(--font-size-sm);
}

.form-control-lg {
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-lg);
}

/* Textarea */
textarea.form-control {
  resize: vertical;
  min-height: calc(1.5em + var(--input-padding-y) * 2 + var(--input-border-width) * 2);
}

/* Select */
select.form-control {
  cursor: pointer;
}

/* Input Prefix/Suffix */
.input-prefix,
.input-suffix {
  display: flex;
  align-items: center;
  padding: 0 var(--space-2);
  color: var(--text-muted);
}

.input-prefix {
  border-right: 1px solid var(--border-light);
}

.input-suffix {
  border-left: 1px solid var(--border-light);
}

.input-icon {
  width: 1rem;
  height: 1rem;
}

/* Input Actions */
.input-clear,
.input-password-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  margin: 0 var(--space-1);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition-fast);
}

.input-clear:hover,
.input-password-toggle:hover {
  background-color: var(--color-gray-100);
  color: var(--text-primary);
}

/* Form Help */
.form-help {
  margin-top: var(--space-1);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
}

/* Form Error */
.form-error {
  margin-top: var(--space-1);
  font-size: var(--font-size-xs);
  color: var(--color-danger);
}

/* Character Count */
.form-char-count {
  margin-top: var(--space-1);
  font-size: var(--font-size-xs);
  color: var(--text-muted);
  text-align: right;
}

/* Responsive */
@media (max-width: 576px) {
  .form-control {
    font-size: 16px; /* Prevent zoom on iOS */
  }
}

/* Dark theme adjustments */
[data-theme="dark"] .input-group-filled {
  background-color: var(--color-gray-800);
}

[data-theme="dark"] .input-clear:hover,
[data-theme="dark"] .input-password-toggle:hover {
  background-color: var(--color-gray-700);
}
</style>