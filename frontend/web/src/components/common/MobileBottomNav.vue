<template>
  <nav 
    v-if="isMobile"
    class="mobile-bottom-nav"
    :class="{ 'nav-hidden': isHidden }"
  >
    <div class="nav-items">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item.to) }"
        @click="handleNavClick(item)"
      >
        <TablerIcon :name="item.icon" size="sm" />
        <span class="nav-label">{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMobileOptimization } from '@/composables/useMobileOptimization'
import TablerIcon from './TablerIcon.vue'

const route = useRoute()
const router = useRouter()
const { isMobile, vibrate } = useMobileOptimization()

// State
const isHidden = ref(false)
let lastScrollY = 0

// Navigation items
const navItems = [
  { to: '/', icon: 'dashboard', label: 'Home' },
  { to: '/attendance', icon: 'clock', label: 'Check In' },
  { to: '/employees', icon: 'users', label: 'Employees' },
  { to: '/schedules', icon: 'calendar', label: 'Schedule' },
  { to: '/profile', icon: 'user', label: 'Profile' }
]

// Methods
const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const handleNavClick = (item) => {
  // Haptic feedback
  vibrate(10)
  
  // Emit navigation event
  document.dispatchEvent(new CustomEvent('mobile:nav-click', {
    detail: { path: item.to }
  }))
}

// Auto-hide on scroll
const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  if (currentScrollY > lastScrollY && currentScrollY > 50) {
    // Scrolling down
    isHidden.value = true
  } else {
    // Scrolling up
    isHidden.value = false
  }
  
  lastScrollY = currentScrollY
}

// Lifecycle
onMounted(() => {
  if (isMobile.value) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--tblr-bg-surface);
  border-top: 1px solid var(--tblr-border-color);
  z-index: 1040;
  transform: translateY(0);
  transition: transform 0.3s ease-in-out;
  padding-bottom: env(safe-area-inset-bottom);
}

.mobile-bottom-nav.nav-hidden {
  transform: translateY(100%);
}

.nav-items {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 56px;
  padding: 0 0.5rem;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: var(--tblr-muted);
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;
  -webkit-tap-highlight-color: transparent;
}

.nav-item:active {
  transform: scale(0.95);
}

.nav-item.active {
  color: var(--tblr-primary);
}

.nav-item.active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 32px;
  height: 3px;
  background-color: var(--tblr-primary);
  border-radius: 0 0 3px 3px;
}

.nav-item .icon {
  margin-bottom: 0.25rem;
}

.nav-label {
  font-size: 0.625rem;
  font-weight: 500;
}

/* Dark mode support */
:root.dark .mobile-bottom-nav {
  background-color: var(--tblr-dark-mode-bg);
  border-top-color: var(--tblr-border-color-dark);
}

/* Safe area padding for devices with home indicator */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .mobile-bottom-nav {
    padding-bottom: env(safe-area-inset-bottom);
  }
  
  .nav-items {
    padding-bottom: env(safe-area-inset-bottom);
  }
}

/* Landscape mode adjustments */
@media (orientation: landscape) and (max-height: 500px) {
  .mobile-bottom-nav {
    height: 48px;
  }
  
  .nav-items {
    height: 48px;
  }
  
  .nav-label {
    display: none;
  }
}
</style>