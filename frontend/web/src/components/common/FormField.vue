<template>
  <div class="form-field" :class="fieldWrapperClass">
    <!-- Label -->
    <label v-if="label || $slots.label" :for="fieldId" class="form-label" :class="labelClass">
      <slot name="label">
        {{ label }}
        <span v-if="required" class="text-danger">*</span>
        <span v-if="optional" class="text-muted">(optional)</span>
      </slot>
    </label>

    <!-- Help Text (before field) -->
    <div v-if="helpText && helpPosition === 'before'" class="form-text mb-2">
      {{ helpText }}
    </div>

    <!-- Field Wrapper -->
    <div class="field-wrapper" :class="wrapperClass">
      <!-- Prefix -->
      <div v-if="$slots.prefix || prefix" class="input-group-text">
        <slot name="prefix">
          <TablerIcon v-if="prefix" :name="prefix" size="sm" />
        </slot>
      </div>

      <!-- Input Field -->
      <input
        v-if="isInputType"
        :id="fieldId"
        ref="fieldRef"
        :type="type"
        :name="name || fieldId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :min="min"
        :max="max"
        :step="step"
        :pattern="pattern"
        :autocomplete="autocomplete"
        :class="fieldClass"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="hasError ? 'true' : 'false'"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @keydown="handleKeydown"
      />

      <!-- Textarea -->
      <textarea
        v-else-if="type === 'textarea'"
        :id="fieldId"
        ref="fieldRef"
        :name="name || fieldId"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :rows="rows"
        :cols="cols"
        :class="fieldClass"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="hasError ? 'true' : 'false'"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
      ></textarea>

      <!-- Select -->
      <select
        v-else-if="type === 'select'"
        :id="fieldId"
        ref="fieldRef"
        :name="name || fieldId"
        :value="modelValue"
        :disabled="disabled"
        :required="required"
        :multiple="multiple"
        :class="fieldClass"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="hasError ? 'true' : 'false'"
        @change="handleSelectChange"
        @focus="handleFocus"
        @blur="handleBlur"
      >
        <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
        <option
          v-for="option in normalizedOptions"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>

      <!-- Checkbox -->
      <div v-else-if="type === 'checkbox'" class="form-check" :class="checkClass">
        <input
          :id="fieldId"
          ref="fieldRef"
          type="checkbox"
          class="form-check-input"
          :name="name || fieldId"
          :checked="modelValue"
          :disabled="disabled"
          :required="required"
          :value="checkboxValue"
          :aria-describedby="ariaDescribedBy"
          :aria-invalid="hasError ? 'true' : 'false'"
          @change="handleCheckboxChange"
          @focus="handleFocus"
          @blur="handleBlur"
        />
        <label :for="fieldId" class="form-check-label">
          {{ checkboxLabel || label }}
        </label>
      </div>

      <!-- Radio Group -->
      <fieldset v-else-if="type === 'radio'" class="radio-group">
        <legend v-if="label" class="sr-only">{{ label }}</legend>
        <div v-for="option in normalizedOptions" :key="option.value" class="form-check" :class="checkClass">
          <input
            :id="`${fieldId}-${option.value}`"
            ref="fieldRef"
            type="radio"
            class="form-check-input"
            :name="name || fieldId"
            :value="option.value"
            :checked="modelValue === option.value"
            :disabled="disabled || option.disabled"
            :required="required"
            :aria-describedby="ariaDescribedBy"
            @change="handleRadioChange"
            @focus="handleFocus"
            @blur="handleBlur"
          />
          <label :for="`${fieldId}-${option.value}`" class="form-check-label">
            {{ option.label }}
          </label>
        </div>
      </fieldset>

      <!-- File Input -->
      <input
        v-else-if="type === 'file'"
        :id="fieldId"
        ref="fieldRef"
        type="file"
        :name="name || fieldId"
        :disabled="disabled"
        :required="required"
        :accept="accept"
        :multiple="multiple"
        :class="fieldClass"
        :aria-describedby="ariaDescribedBy"
        :aria-invalid="hasError ? 'true' : 'false'"
        @change="handleFileChange"
        @focus="handleFocus"
        @blur="handleBlur"
      />

      <!-- Custom Slot -->
      <slot
        v-else-if="type === 'custom'"
        name="field"
        :field-id="fieldId"
        :value="modelValue"
        :has-error="hasError"
        :disabled="disabled"
        :readonly="readonly"
        :required="required"
        :handle-input="handleInput"
        :handle-change="handleChange"
        :handle-focus="handleFocus"
        :handle-blur="handleBlur"
      />

      <!-- Suffix -->
      <div v-if="$slots.suffix || suffix" class="input-group-text">
        <slot name="suffix">
          <TablerIcon v-if="suffix" :name="suffix" size="sm" />
        </slot>
      </div>

      <!-- Clear Button -->
      <button
        v-if="clearable && modelValue && !disabled && !readonly"
        type="button"
        class="btn btn-link btn-sm field-clear"
        @click="clearField"
      >
        <TablerIcon name="x" size="sm" />
      </button>

      <!-- Loading Indicator -->
      <div v-if="loading" class="input-loading">
        <LoadingSpinner size="sm" />
      </div>
    </div>

    <!-- Help Text (after field) -->
    <div v-if="helpText && helpPosition === 'after'" class="form-text">
      {{ helpText }}
    </div>

    <!-- Error Message -->
    <div v-if="hasError" class="invalid-feedback d-block">
      {{ errorMessage }}
    </div>

    <!-- Success Message -->
    <div v-if="hasSuccess" class="valid-feedback d-block">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { generateId } from '@/utils/helpers'
import TablerIcon from './TablerIcon.vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  // v-model
  modelValue: {
    type: [String, Number, Boolean, Array, File],
    default: ''
  },

  // Field configuration
  type: {
    type: String,
    default: 'text',
    validator: value =>
      [
        'text',
        'email',
        'password',
        'number',
        'tel',
        'url',
        'search',
        'textarea',
        'select',
        'checkbox',
        'radio',
        'file',
        'date',
        'datetime-local',
        'time',
        'month',
        'week',
        'color',
        'range',
        'custom'
      ].includes(value)
  },
  name: String,
  label: String,
  placeholder: String,

  // Field attributes
  required: Boolean,
  optional: Boolean,
  disabled: Boolean,
  readonly: Boolean,
  clearable: Boolean,
  loading: Boolean,

  // Validation
  error: [String, Boolean],
  success: [String, Boolean],

  // Help text
  helpText: String,
  helpPosition: {
    type: String,
    default: 'after',
    validator: value => ['before', 'after'].includes(value)
  },

  // Input constraints
  min: [String, Number],
  max: [String, Number],
  step: [String, Number],
  pattern: String,
  accept: String,
  autocomplete: String,

  // Textarea specific
  rows: {
    type: Number,
    default: 3
  },
  cols: Number,

  // Select/Radio options
  options: Array,
  multiple: Boolean,

  // Checkbox specific
  checkboxValue: {
    type: [String, Number, Boolean],
    default: true
  },
  checkboxLabel: String,

  // Styling
  size: {
    type: String,
    default: 'md',
    validator: value => ['sm', 'md', 'lg'].includes(value)
  },
  variant: {
    type: String,
    default: 'default'
  },

  // Layout
  inline: Boolean,
  switch: Boolean, // For checkbox styling

  // Icons
  prefix: String,
  suffix: String
})

const emit = defineEmits(['update:modelValue', 'change', 'focus', 'blur', 'clear', 'keydown'])

// State
const fieldRef = ref(null)
const fieldId = ref(generateId())
const isFocused = ref(false)

// Computed
const isInputType = computed(() => {
  const inputTypes = [
    'text',
    'email',
    'password',
    'number',
    'tel',
    'url',
    'search',
    'date',
    'datetime-local',
    'time',
    'month',
    'week',
    'color',
    'range'
  ]
  return inputTypes.includes(props.type)
})

const hasError = computed(() => Boolean(props.error))
const hasSuccess = computed(() => Boolean(props.success))

const errorMessage = computed(() => {
  if (typeof props.error === 'string') return props.error
  return hasError.value ? 'This field has an error' : ''
})

const successMessage = computed(() => {
  if (typeof props.success === 'string') return props.success
  return hasSuccess.value ? 'This field is valid' : ''
})

const fieldWrapperClass = computed(() => ({
  'form-field-inline': props.inline,
  'form-field-error': hasError.value,
  'form-field-success': hasSuccess.value,
  'form-field-disabled': props.disabled,
  'form-field-readonly': props.readonly,
  'form-field-focused': isFocused.value
}))

const labelClass = computed(() => ({
  'form-label-required': props.required,
  [`form-label-${props.size}`]: props.size !== 'md'
}))

const wrapperClass = computed(() => {
  const classes = []

  if (props.prefix || props.suffix || props.$slots.prefix || props.$slots.suffix) {
    classes.push('input-group')
  }

  if (props.size !== 'md') {
    classes.push(`input-group-${props.size}`)
  }

  return classes
})

const fieldClass = computed(() => {
  const baseClass = props.type === 'select' ? 'form-select' : 'form-control'
  const classes = [baseClass]

  if (props.size !== 'md') {
    classes.push(`${baseClass}-${props.size}`)
  }

  if (hasError.value) {
    classes.push('is-invalid')
  } else if (hasSuccess.value) {
    classes.push('is-valid')
  }

  return classes
})

const checkClass = computed(() => ({
  'form-check-inline': props.inline,
  'form-switch': props.switch && props.type === 'checkbox'
}))

const normalizedOptions = computed(() => {
  if (!props.options) return []

  return props.options.map(option => {
    if (typeof option === 'string' || typeof option === 'number') {
      return { label: option, value: option }
    }
    return {
      label: option.label || option.text || option.name,
      value: option.value,
      disabled: option.disabled || false
    }
  })
})

const ariaDescribedBy = computed(() => {
  const ids = []

  if (props.helpText) {
    ids.push(`${fieldId.value}-help`)
  }

  if (hasError.value) {
    ids.push(`${fieldId.value}-error`)
  }

  if (hasSuccess.value) {
    ids.push(`${fieldId.value}-success`)
  }

  return ids.length > 0 ? ids.join(' ') : undefined
})

// Methods
const handleInput = event => {
  const value = event.target.value
  emit('update:modelValue', value)
}

const handleChange = event => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleSelectChange = event => {
  const value = props.multiple ? Array.from(event.target.selectedOptions, option => option.value) : event.target.value

  emit('update:modelValue', value)
  emit('change', value)
}

const handleCheckboxChange = event => {
  const value = event.target.checked ? props.checkboxValue : false
  emit('update:modelValue', value)
  emit('change', value)
}

const handleRadioChange = event => {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('change', value)
}

const handleFileChange = event => {
  const files = event.target.files
  const value = props.multiple ? Array.from(files) : files[0]
  emit('update:modelValue', value)
  emit('change', value)
}

const handleFocus = event => {
  isFocused.value = true
  emit('focus', event)
}

const handleBlur = event => {
  isFocused.value = false
  emit('blur', event)
}

const handleKeydown = event => {
  emit('keydown', event)
}

const clearField = () => {
  emit('update:modelValue', '')
  emit('clear')

  nextTick(() => {
    if (fieldRef.value) {
      fieldRef.value.focus()
    }
  })
}

const focus = () => {
  if (fieldRef.value) {
    fieldRef.value.focus()
  }
}

const blur = () => {
  if (fieldRef.value) {
    fieldRef.value.blur()
  }
}

// Watch for external value changes
watch(
  () => props.modelValue,
  newValue => {
    if (fieldRef.value && fieldRef.value.value !== newValue) {
      fieldRef.value.value = newValue || ''
    }
  }
)

// Expose methods
defineExpose({
  focus,
  blur,
  fieldRef
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

.form-field-inline {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.form-field-inline .form-label {
  margin-bottom: 0;
  white-space: nowrap;
}

.field-wrapper {
  position: relative;
}

.field-clear {
  position: absolute;
  right: 0.5rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
  padding: 0.25rem;
  color: var(--tblr-muted);
}

.field-clear:hover {
  color: var(--tblr-danger);
}

.input-loading {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 3;
}

.radio-group {
  border: none;
  padding: 0;
  margin: 0;
}

.radio-group legend {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}

/* Form validation states */
.form-field-error .form-control,
.form-field-error .form-select {
  border-color: var(--tblr-danger);
}

.form-field-success .form-control,
.form-field-success .form-select {
  border-color: var(--tblr-success);
}

.form-field-focused .form-control,
.form-field-focused .form-select {
  box-shadow: 0 0 0 0.25rem rgba(var(--tblr-primary-rgb), 0.25);
}

/* Disabled state */
.form-field-disabled {
  opacity: 0.6;
}

.form-field-readonly .form-control {
  background-color: var(--tblr-bg-surface-secondary);
}

/* Size variants */
.form-label-sm {
  font-size: 0.875rem;
}

.form-label-lg {
  font-size: 1.125rem;
}

/* Dark mode support */
:root.dark .form-field-readonly .form-control {
  background-color: var(--tblr-dark-mode-bg);
}
</style>
