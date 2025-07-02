<template>
  <TablerIcon
    :name="iconName"
    :size="size"
    :class="iconClasses"
    :aria-label="ariaLabel"
    v-bind="$attrs"
  />
</template>

<script setup>
import { computed } from 'vue'
import TablerIcon from './TablerIcon.vue'

const props = defineProps({
  action: {
    type: String,
    required: true,
    validator: value =>
      [
        'face_recognition',
        'camera',
        'scanning',
        'nod',
        'shake',
        'smile',
        'blink',
        'detect',
        'capture',
        'processing',
        'success',
        'failed',
        'timeout'
      ].includes(value)
  },
  state: {
    type: String,
    default: 'idle',
    validator: value => ['idle', 'active', 'processing', 'success', 'error'].includes(value)
  },
  size: {
    type: [String, Number],
    default: 24
  },
  animated: {
    type: Boolean,
    default: true
  }
})

defineOptions({
  inheritAttrs: false
})

// Face detection action to icon mapping
const actionIconMap = {
  face_recognition: 'face-id',
  camera: 'camera',
  scanning: 'scan',
  nod: 'arrow-up',
  shake: 'arrows-horizontal',
  smile: 'mood-smile',
  blink: 'eye',
  detect: 'face-id',
  capture: 'camera-plus',
  processing: 'loader-2',
  success: 'face-id-check',
  failed: 'face-id-error',
  timeout: 'clock-x'
}

// State to color class mapping
const stateColorMap = {
  idle: 'text-muted',
  active: 'text-primary',
  processing: 'text-info',
  success: 'text-success',
  error: 'text-danger'
}

// Action labels for accessibility
const actionLabels = {
  face_recognition: 'Face Recognition',
  camera: 'Camera',
  scanning: 'Scanning Face',
  nod: 'Nod Detection',
  shake: 'Head Shake Detection',
  smile: 'Smile Detection',
  blink: 'Blink Detection',
  detect: 'Detecting Face',
  capture: 'Capturing Image',
  processing: 'Processing',
  success: 'Recognition Success',
  failed: 'Recognition Failed',
  timeout: 'Recognition Timeout'
}

// Action descriptions for better UX
const actionDescriptions = {
  face_recognition: 'Face recognition system',
  camera: 'Camera for face capture',
  scanning: 'Scanning for face patterns',
  nod: 'Please nod your head',
  shake: 'Please shake your head',
  smile: 'Please smile for the camera',
  blink: 'Please blink your eyes',
  detect: 'Detecting face in frame',
  capture: 'Capturing face image',
  processing: 'Processing face data',
  success: 'Face recognized successfully',
  failed: 'Face recognition failed',
  timeout: 'Recognition timed out'
}

const iconName = computed(() => {
  // Handle fallback icons for missing ones
  const baseIcon = actionIconMap[props.action] || 'face-id'

  // Special handling for processing state
  if (props.state === 'processing') {
    return 'loader-2'
  }

  // Special handling for success/error states
  if (props.state === 'success' && props.action === 'face_recognition') {
    return 'circle-check'
  }

  if (props.state === 'error') {
    return 'circle-x'
  }

  return baseIcon
})

const iconClasses = computed(() => {
  const classes = [stateColorMap[props.state] || 'text-muted']

  // Add action-specific classes
  classes.push(`face-detection-${props.action.replace('_', '-')}`)

  // Add state-specific classes
  classes.push(`face-detection-state-${props.state}`)

  // Add animation classes
  if (props.animated) {
    if (props.state === 'processing') {
      classes.push('face-detection-processing')
    } else if (props.state === 'active') {
      classes.push('face-detection-active')
    }
  }

  return classes
})

const ariaLabel = computed(() => {
  const actionLabel = actionLabels[props.action] || props.action
  const stateText = props.state !== 'idle' ? ` - ${props.state}` : ''
  return `${actionLabel}${stateText}`
})
</script>

<style scoped>
/* Face detection specific styling */
.face-detection-face-recognition {
  --icon-color: var(--tblr-primary);
}

.face-detection-camera {
  --icon-color: var(--tblr-info);
}

.face-detection-scanning {
  --icon-color: var(--tblr-warning);
}

.face-detection-nod,
.face-detection-shake,
.face-detection-smile,
.face-detection-blink {
  --icon-color: var(--tblr-success);
}

/* State-based styling */
.face-detection-state-idle {
  opacity: 0.7;
}

.face-detection-state-active {
  opacity: 1;
}

.face-detection-state-processing {
  opacity: 1;
}

.face-detection-state-success {
  --icon-color: var(--tblr-success) !important;
}

.face-detection-state-error {
  --icon-color: var(--tblr-danger) !important;
}

/* Animations */
.tabler-icon {
  transition: all 0.3s ease;
}

/* Processing animation */
.face-detection-processing .tabler-icon {
  animation: spin 1s linear infinite;
}

/* Active state pulse animation */
.face-detection-active .tabler-icon {
  animation: pulse-glow 2s ease-in-out infinite;
}

/* Scanning animation */
.face-detection-scanning .tabler-icon {
  animation: scan-pulse 1.5s ease-in-out infinite;
}

/* Success state animation */
.face-detection-state-success .tabler-icon {
  animation: success-bounce 0.6s ease-in-out;
}

/* Error state animation */
.face-detection-state-error .tabler-icon {
  animation: error-shake 0.5s ease-in-out;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse-glow {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

@keyframes scan-pulse {
  0%,
  100% {
    opacity: 0.8;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}

@keyframes success-bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-4px);
  }
  60% {
    transform: translateY(-2px);
  }
}

@keyframes error-shake {
  0%,
  100% {
    transform: translateX(0);
  }
  10%,
  30%,
  50%,
  70%,
  90% {
    transform: translateX(-2px);
  }
  20%,
  40%,
  60%,
  80% {
    transform: translateX(2px);
  }
}

/* Hover effects */
.tabler-icon:hover {
  transform: scale(1.1);
  filter: brightness(1.2);
}

/* Special styling for biometric actions */
.face-detection-nod .tabler-icon {
  animation: nod-hint 3s ease-in-out infinite;
}

.face-detection-shake .tabler-icon {
  animation: shake-hint 3s ease-in-out infinite;
}

.face-detection-smile .tabler-icon {
  animation: smile-hint 3s ease-in-out infinite;
}

.face-detection-blink .tabler-icon {
  animation: blink-hint 3s ease-in-out infinite;
}

@keyframes nod-hint {
  0%,
  90%,
  100% {
    transform: translateY(0);
  }
  5%,
  15% {
    transform: translateY(-2px);
  }
  10% {
    transform: translateY(2px);
  }
}

@keyframes shake-hint {
  0%,
  90%,
  100% {
    transform: translateX(0);
  }
  5%,
  15% {
    transform: translateX(-2px);
  }
  10% {
    transform: translateX(2px);
  }
}

@keyframes smile-hint {
  0%,
  90%,
  100% {
    transform: scale(1);
  }
  5% {
    transform: scale(1.1);
  }
}

@keyframes blink-hint {
  0%,
  90%,
  95%,
  100% {
    opacity: 1;
  }
  92.5% {
    opacity: 0.3;
  }
}
</style>
