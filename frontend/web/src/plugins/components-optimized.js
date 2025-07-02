/**
 * Optimized Component Registration
 * Only registers components that are frequently used globally
 */

// Import only essential base components globally
import BaseButton from '@/components/common/BaseButton.vue'
import BaseCard from '@/components/common/BaseCard.vue'
import BaseInput from '@/components/common/BaseInput.vue'
import LoadingState from '@/components/common/LoadingState.vue'

// Lazy load heavy components
const LazyImage = () => import('@/components/common/LazyImage.vue')
const VirtualScroll = () => import('@/components/common/VirtualScroll.vue')
const BaseChart = () => import('@/components/common/BaseChart.vue')

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
