<template>
  <teleport to="body">
    <div 
      v-if="visible"
      class="modal fade show"
      :class="modalClass"
      tabindex="-1"
      :aria-labelledby="titleId"
      :aria-describedby="bodyId"
      aria-modal="true"
      role="dialog"
      @click="handleBackdropClick"
      @keydown.esc="handleEscape"
    >
      <div 
        class="modal-dialog"
        :class="dialogClass"
        role="document"
        @click.stop
      >
        <div class="modal-content">
          <!-- Modal Header -->
          <div v-if="$slots.header || title" class="modal-header">
            <slot name="header">
              <h5 class="modal-title" :id="titleId">{{ title }}</h5>
              <button 
                v-if="closable"
                type="button"
                class="btn-close"
                :aria-label="closeLabel"
                @click="close"
              ></button>
            </slot>
          </div>
          
          <!-- Modal Body -->
          <div class="modal-body" :id="bodyId">
            <slot>
              <p v-if="message">{{ message }}</p>
            </slot>
          </div>
          
          <!-- Modal Footer -->
          <div v-if="$slots.footer || showDefaultActions" class="modal-footer">
            <slot name="footer">
              <button 
                v-if="showCancel"
                type="button"
                class="btn"
                :class="cancelButtonClass"
                @click="cancel"
              >
                {{ cancelText }}
              </button>
              <button 
                v-if="showConfirm"
                type="button"
                class="btn"
                :class="confirmButtonClass"
                :disabled="confirmDisabled || loading"
                @click="confirm"
              >
                <LoadingSpinner v-if="loading" size="sm" class="me-2" />
                {{ confirmText }}
              </button>
            </slot>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Backdrop -->
    <div 
      v-if="visible"
      class="modal-backdrop fade show"
      @click="handleBackdropClick"
    ></div>
  </teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { generateId } from '@/utils/helpers'
import LoadingSpinner from './LoadingSpinner.vue'

const props = defineProps({
  // Display
  visible: {
    type: Boolean,
    default: false
  },
  title: String,
  message: String,
  
  // Size
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg', 'xl', 'fullscreen'].includes(value)
  },
  
  // Behavior
  closable: {
    type: Boolean,
    default: true
  },
  closeOnBackdrop: {
    type: Boolean,
    default: true
  },
  closeOnEscape: {
    type: Boolean,
    default: true
  },
  persistent: {
    type: Boolean,
    default: false
  },
  
  // Actions
  showDefaultActions: {
    type: Boolean,
    default: false
  },
  showCancel: {
    type: Boolean,
    default: true
  },
  showConfirm: {
    type: Boolean,
    default: true
  },
  cancelText: {
    type: String,
    default: 'Cancel'
  },
  confirmText: {
    type: String,
    default: 'Confirm'
  },
  confirmDisabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  
  // Styling
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'danger', 'warning', 'success', 'info'].includes(value)
  },
  centered: {
    type: Boolean,
    default: false
  },
  scrollable: {
    type: Boolean,
    default: false
  },
  
  // Accessibility
  closeLabel: {
    type: String,
    default: 'Close'
  }
})

const emit = defineEmits([
  'update:visible',
  'show',
  'shown',
  'hide',
  'hidden',
  'confirm',
  'cancel'
])

// State
const titleId = ref(`modal-title-${generateId()}`)
const bodyId = ref(`modal-body-${generateId()}`)
const previousActiveElement = ref(null)

// Computed
const modalClass = computed(() => ({
  [`modal-${props.variant}`]: props.variant !== 'default',
  'modal-blur': props.persistent
}))

const dialogClass = computed(() => ({
  [`modal-${props.size}`]: props.size !== 'md',
  'modal-dialog-centered': props.centered,
  'modal-dialog-scrollable': props.scrollable,
  'modal-fullscreen': props.size === 'fullscreen'
}))

const cancelButtonClass = computed(() => {
  const baseClass = 'btn-outline-secondary'
  return props.variant === 'danger' ? 'btn-outline-danger' : baseClass
})

const confirmButtonClass = computed(() => {
  const variantMap = {
    danger: 'btn-danger',
    warning: 'btn-warning',
    success: 'btn-success',
    info: 'btn-info',
    default: 'btn-primary'
  }
  return variantMap[props.variant] || 'btn-primary'
})

// Methods
const show = () => {
  if (props.visible) return
  
  // Store the currently focused element
  previousActiveElement.value = document.activeElement
  
  emit('update:visible', true)
  emit('show')
  
  nextTick(() => {
    // Focus management
    focusModal()
    
    // Prevent body scroll
    document.body.classList.add('modal-open')
    
    emit('shown')
  })
}

const hide = () => {
  if (!props.visible) return
  
  emit('hide')
  emit('update:visible', false)
  
  nextTick(() => {
    // Restore focus
    if (previousActiveElement.value) {
      previousActiveElement.value.focus()
      previousActiveElement.value = null
    }
    
    // Restore body scroll
    document.body.classList.remove('modal-open')
    
    emit('hidden')
  })
}

const close = () => {
  if (!props.closable && !props.persistent) return
  hide()
}

const confirm = () => {
  emit('confirm')
  if (!props.persistent) {
    hide()
  }
}

const cancel = () => {
  emit('cancel')
  hide()
}

const handleBackdropClick = () => {
  if (props.closeOnBackdrop && !props.persistent) {
    close()
  }
}

const handleEscape = () => {
  if (props.closeOnEscape && !props.persistent) {
    close()
  }
}

const focusModal = () => {
  const modal = document.querySelector('.modal.show')
  if (modal) {
    // Try to focus the first focusable element
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    
    if (focusableElements.length > 0) {
      focusableElements[0].focus()
    } else {
      // Focus the modal itself
      modal.focus()
    }
  }
}

// Trap focus within modal
const trapFocus = (e) => {
  if (!props.visible) return
  
  const modal = document.querySelector('.modal.show')
  if (!modal) return
  
  const focusableElements = modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  )
  
  const firstElement = focusableElements[0]
  const lastElement = focusableElements[focusableElements.length - 1]
  
  if (e.key === 'Tab') {
    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        e.preventDefault()
        lastElement.focus()
      }
    } else {
      if (document.activeElement === lastElement) {
        e.preventDefault()
        firstElement.focus()
      }
    }
  }
}

// Watchers
watch(() => props.visible, (newVal) => {
  if (newVal) {
    show()
  } else {
    hide()
  }
})

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', trapFocus)
  
  if (props.visible) {
    show()
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
  
  // Cleanup on unmount
  if (props.visible) {
    document.body.classList.remove('modal-open')
  }
})

// Expose methods
defineExpose({
  show,
  hide,
  close,
  confirm,
  cancel
})
</script>

<style scoped>
/* Modal animations */
.modal.fade {
  transition: opacity 0.15s linear;
}

.modal.show {
  display: block;
}

.modal-dialog {
  transition: transform 0.3s ease-out;
  transform: translate(0, -50px);
}

.modal.show .modal-dialog {
  transform: none;
}

/* Modal variants */
.modal-danger .modal-header {
  background-color: var(--tblr-danger);
  color: white;
  border-bottom-color: var(--tblr-danger);
}

.modal-danger .btn-close {
  filter: invert(1) grayscale(100%) brightness(200%);
}

.modal-warning .modal-header {
  background-color: var(--tblr-warning);
  color: white;
  border-bottom-color: var(--tblr-warning);
}

.modal-success .modal-header {
  background-color: var(--tblr-success);
  color: white;
  border-bottom-color: var(--tblr-success);
}

.modal-info .modal-header {
  background-color: var(--tblr-info);
  color: white;
  border-bottom-color: var(--tblr-info);
}

/* Persistent modal blur effect */
.modal-blur .modal-backdrop {
  backdrop-filter: blur(3px);
}

/* Fullscreen modal */
.modal-fullscreen {
  width: 100vw;
  max-width: none;
  height: 100%;
  margin: 0;
}

.modal-fullscreen .modal-content {
  height: 100%;
  border: 0;
  border-radius: 0;
}

/* Dark mode support */
:root.dark .modal-content {
  background-color: var(--tblr-dark-mode-bg);
  color: var(--tblr-light);
}

:root.dark .modal-header {
  border-bottom-color: var(--tblr-border-color-dark);
}

:root.dark .modal-footer {
  border-top-color: var(--tblr-border-color-dark);
}

/* Mobile optimizations */
@media (max-width: 576px) {
  .modal-dialog:not(.modal-fullscreen) {
    margin: 0.5rem;
    max-width: calc(100% - 1rem);
  }
  
  .modal-sm {
    max-width: calc(100% - 1rem);
  }
}
</style>