/**
 * Mobile Optimization Composable
 * Handles mobile-specific features and optimizations
 */

import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUIStore } from '@/stores/modules/ui'

export function useMobileOptimization() {
  const uiStore = useUIStore()
  
  // State
  const isMobile = ref(false)
  const isTablet = ref(false)
  const isDesktop = ref(false)
  const screenWidth = ref(window.innerWidth)
  const screenHeight = ref(window.innerHeight)
  const orientation = ref(getOrientation())
  const isTouchDevice = ref(false)
  const isOnline = ref(navigator.onLine)
  const isStandalone = ref(false)
  
  // Viewport breakpoints
  const breakpoints = {
    mobile: 768,
    tablet: 1024,
    desktop: 1280
  }
  
  // Computed
  const deviceType = computed(() => {
    if (isMobile.value) return 'mobile'
    if (isTablet.value) return 'tablet'
    return 'desktop'
  })
  
  const isPortrait = computed(() => orientation.value === 'portrait')
  const isLandscape = computed(() => orientation.value === 'landscape')
  
  const viewportMeta = computed(() => ({
    width: screenWidth.value,
    height: screenHeight.value,
    deviceType: deviceType.value,
    orientation: orientation.value,
    isTouchDevice: isTouchDevice.value
  }))
  
  // Methods
  function getOrientation() {
    return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  }
  
  function updateDeviceInfo() {
    screenWidth.value = window.innerWidth
    screenHeight.value = window.innerHeight
    orientation.value = getOrientation()
    
    // Update device type
    isMobile.value = screenWidth.value < breakpoints.mobile
    isTablet.value = screenWidth.value >= breakpoints.mobile && screenWidth.value < breakpoints.tablet
    isDesktop.value = screenWidth.value >= breakpoints.tablet
    
    // Update UI store
    uiStore.setDeviceType(deviceType.value)
  }
  
  function detectTouchDevice() {
    isTouchDevice.value = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0
    )
  }
  
  function detectStandaloneMode() {
    // Check if app is running as PWA
    isStandalone.value = (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone ||
      document.referrer.includes('android-app://')
    )
  }
  
  // Touch gesture handling
  let touchStartX = 0
  let touchStartY = 0
  let touchEndX = 0
  let touchEndY = 0
  
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX
    touchStartY = e.changedTouches[0].screenY
  }
  
  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX
    touchEndY = e.changedTouches[0].screenY
    handleGesture()
  }
  
  function handleGesture() {
    const swipeThreshold = 50
    const verticalSwipeThreshold = 100
    
    // Horizontal swipe
    if (Math.abs(touchEndX - touchStartX) > swipeThreshold) {
      if (touchEndX < touchStartX) {
        // Swipe left
        document.dispatchEvent(new CustomEvent('mobile:swipe-left'))
      } else {
        // Swipe right
        document.dispatchEvent(new CustomEvent('mobile:swipe-right'))
      }
    }
    
    // Vertical swipe
    if (Math.abs(touchEndY - touchStartY) > verticalSwipeThreshold) {
      if (touchEndY < touchStartY) {
        // Swipe up
        document.dispatchEvent(new CustomEvent('mobile:swipe-up'))
      } else {
        // Swipe down
        document.dispatchEvent(new CustomEvent('mobile:swipe-down'))
      }
    }
  }
  
  // Viewport utilities
  function lockOrientation(orientationType = 'portrait') {
    if (screen.orientation && screen.orientation.lock) {
      screen.orientation.lock(orientationType).catch(() => {
        // Orientation lock not supported
      })
    }
  }
  
  function unlockOrientation() {
    if (screen.orientation && screen.orientation.unlock) {
      screen.orientation.unlock()
    }
  }
  
  function vibrate(pattern = 50) {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern)
    }
  }
  
  // Network status
  function handleOnline() {
    isOnline.value = true
    document.dispatchEvent(new CustomEvent('mobile:online'))
  }
  
  function handleOffline() {
    isOnline.value = false
    document.dispatchEvent(new CustomEvent('mobile:offline'))
  }
  
  // Mobile-specific optimizations
  function enableMobileOptimizations() {
    if (!isMobile.value) return
    
    // Disable hover effects on touch devices
    if (isTouchDevice.value) {
      document.documentElement.classList.add('touch-device')
    }
    
    // Add mobile class for specific styling
    document.documentElement.classList.add('mobile-device')
    
    // Optimize animations for mobile
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.documentElement.classList.add('reduce-motion')
    }
    
    // Enable fast click for iOS
    if ('addEventListener' in document) {
      document.addEventListener('DOMContentLoaded', () => {
        // FastClick implementation
      }, false)
    }
  }
  
  // PWA features
  function installPWA() {
    if (window.deferredPrompt) {
      window.deferredPrompt.prompt()
      window.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted PWA installation')
        }
        window.deferredPrompt = null
      })
    }
  }
  
  function shareContent(data) {
    if (navigator.share) {
      return navigator.share(data)
    } else {
      // Fallback to clipboard
      const text = `${data.title}\n${data.text}\n${data.url}`
      return navigator.clipboard.writeText(text)
    }
  }
  
  // Pull to refresh
  let pullStartY = 0
  let isPulling = false
  
  function handlePullStart(e) {
    if (window.scrollY === 0) {
      pullStartY = e.touches[0].clientY
      isPulling = true
    }
  }
  
  function handlePullMove(e) {
    if (!isPulling) return
    
    const pullDistance = e.touches[0].clientY - pullStartY
    if (pullDistance > 0 && pullDistance < 150) {
      e.preventDefault()
      document.dispatchEvent(new CustomEvent('mobile:pull-refresh', {
        detail: { distance: pullDistance }
      }))
    }
  }
  
  function handlePullEnd(e) {
    if (!isPulling) return
    
    const pullDistance = e.changedTouches[0].clientY - pullStartY
    if (pullDistance > 80) {
      document.dispatchEvent(new CustomEvent('mobile:refresh'))
    }
    isPulling = false
  }
  
  // Lifecycle
  onMounted(() => {
    // Initial setup
    updateDeviceInfo()
    detectTouchDevice()
    detectStandaloneMode()
    enableMobileOptimizations()
    
    // Event listeners
    window.addEventListener('resize', updateDeviceInfo)
    window.addEventListener('orientationchange', updateDeviceInfo)
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Touch gestures
    if (isTouchDevice.value) {
      document.addEventListener('touchstart', handleTouchStart)
      document.addEventListener('touchend', handleTouchEnd)
      
      // Pull to refresh
      document.addEventListener('touchstart', handlePullStart, { passive: false })
      document.addEventListener('touchmove', handlePullMove, { passive: false })
      document.addEventListener('touchend', handlePullEnd)
    }
    
    // PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      window.deferredPrompt = e
    })
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', updateDeviceInfo)
    window.removeEventListener('orientationchange', updateDeviceInfo)
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
    
    if (isTouchDevice.value) {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchstart', handlePullStart)
      document.removeEventListener('touchmove', handlePullMove)
      document.removeEventListener('touchend', handlePullEnd)
    }
  })
  
  return {
    // State
    isMobile,
    isTablet,
    isDesktop,
    screenWidth,
    screenHeight,
    orientation,
    isTouchDevice,
    isOnline,
    isStandalone,
    
    // Computed
    deviceType,
    isPortrait,
    isLandscape,
    viewportMeta,
    
    // Methods
    lockOrientation,
    unlockOrientation,
    vibrate,
    installPWA,
    shareContent
  }
}