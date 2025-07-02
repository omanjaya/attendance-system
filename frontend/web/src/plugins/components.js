/**
 * Global Component Registration Plugin
 * Registers commonly used components globally to reduce import statements
 */

import { BaseButton, BaseCard, BaseInput } from '@/components/base'

import SkeletonLoader from '@/components/common/SkeletonLoader.vue'
import LoadingState from '@/components/common/LoadingState.vue'
import AnimatedNumber from '@/components/common/AnimatedNumber.vue'

// Icon components
import StatusIcon from '@/components/common/StatusIcon.vue'
import EmployeeTypeIcon from '@/components/common/EmployeeTypeIcon.vue'
import FaceDetectionIcon from '@/components/common/FaceDetectionIcon.vue'

export default {
  install(app) {
    // Register base components globally
    app.component('BaseButton', BaseButton)
    app.component('BaseCard', BaseCard)
    app.component('BaseInput', BaseInput)

    // Register UI components globally
    app.component('SkeletonLoader', SkeletonLoader)
    app.component('LoadingState', LoadingState)
    app.component('AnimatedNumber', AnimatedNumber)

    // Register specialized icon components globally
    app.component('StatusIcon', StatusIcon)
    app.component('EmployeeTypeIcon', EmployeeTypeIcon)
    app.component('FaceDetectionIcon', FaceDetectionIcon)

    // Alternative naming conventions
    app.component('VButton', BaseButton)
    app.component('VCard', BaseCard)
    app.component('VInput', BaseInput)
  }
}
