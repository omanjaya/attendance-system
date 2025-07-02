<template>
  <aside
    class="navbar navbar-vertical navbar-expand-lg"
    :class="{
      'navbar-dark': !isDarkMode,
      'navbar-light': isDarkMode,
      'navbar-collapsed': isCollapsed
    }"
  >
    <div class="container-fluid">
      <!-- Brand -->
      <button
        class="navbar-toggler"
        type="button"
        aria-label="Toggle navigation"
        @click="$emit('toggle-mobile')"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <h1 class="navbar-brand navbar-brand-autodark">
        <router-link to="/" class="text-decoration-none d-flex align-items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="icon icon-md me-2"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke-width="2"
            stroke="currentColor"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <circle cx="12" cy="12" r="9" />
            <polyline points="12 7 12 12 15 15" />
          </svg>
          <span class="d-none d-lg-inline">{{ appName }}</span>
          <span class="d-lg-none">{{ appShortName }}</span>
        </router-link>
      </h1>

      <!-- Mobile user menu -->
      <div class="navbar-nav flex-row d-lg-none">
        <UserDropdown :user="user" :compact="true" />
      </div>

      <!-- Sidebar Navigation -->
      <div id="sidebar-menu" class="collapse navbar-collapse">
        <ul class="navbar-nav pt-lg-3">
          <li
            v-for="item in navigation"
            :key="item.id"
            class="nav-item"
            :class="{
              dropdown: item.children,
              active: isActiveGroup(item)
            }"
          >
            <!-- Single Link -->
            <router-link
              v-if="!item.children"
              class="nav-link"
              :to="item.to"
              :class="{ active: isActiveGroup(item) }"
            >
              <span class="nav-link-icon d-md-none d-lg-inline-block">
                <TablerIcon :name="item.icon" />
              </span>
              <span class="nav-link-title">{{ item.title }}</span>
            </router-link>

            <!-- Dropdown Group -->
            <template v-else>
              <a
                class="nav-link dropdown-toggle"
                :href="`#navbar-${item.id}`"
                data-bs-toggle="dropdown"
                role="button"
                :aria-expanded="isActiveGroup(item) ? 'true' : 'false'"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <TablerIcon :name="item.icon" />
                </span>
                <span class="nav-link-title">{{ item.title }}</span>
              </a>
              <div class="dropdown-menu" :class="{ show: isActiveGroup(item) }">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <router-link
                      v-for="child in item.children"
                      :key="child.to"
                      class="dropdown-item"
                      :to="child.to"
                      :target="child.target"
                      :class="{ active: $route.path === child.to }"
                    >
                      <span v-if="child.icon" class="nav-link-icon d-md-none d-lg-inline-block">
                        <TablerIcon :name="child.icon" size="sm" />
                      </span>
                      {{ child.title }}
                    </router-link>
                  </div>
                </div>
              </div>
            </template>
          </li>
        </ul>

        <!-- Sidebar Footer -->
        <div class="navbar-footer d-none d-lg-flex">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a href="#" class="nav-link" title="Collapse sidebar" @click.prevent="toggleCollapse">
                <span class="nav-link-icon">
                  <TablerIcon :name="isCollapsed ? 'chevron-right' : 'chevron-left'" />
                </span>
                <span class="nav-link-title">Collapse</span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useUIStore } from '@/stores/modules/ui'
import UserDropdown from './UserDropdown.vue'
import TablerIcon from '@/components/common/TablerIcon.vue'

const props = defineProps({
  navigation: {
    type: Array,
    required: true
  },
  isActiveGroup: {
    type: Function,
    required: true
  },
  user: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['toggle-mobile'])

const route = useRoute()
const uiStore = useUIStore()

// State
const appName = 'Presensiari'
const appShortName = 'PA'
const isCollapsed = ref(false)

// Computed
const isDarkMode = computed(() => uiStore.theme === 'dark')

// Methods
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
  // Save preference
  localStorage.setItem('sidebar-collapsed', isCollapsed.value)
}
</script>

<style scoped>
/* Sidebar base styles */
.navbar-vertical {
  position: fixed;
  top: 0;
  left: 0;
  height: 100vh;
  width: 15rem;
  overflow-y: auto;
  z-index: 1030;
  transition: width 0.3s ease-in-out;
}

/* Collapsed state */
.navbar-vertical.navbar-collapsed {
  width: 4rem;
}

.navbar-collapsed .nav-link-title,
.navbar-collapsed .navbar-brand-autodark span,
.navbar-collapsed .navbar-footer {
  display: none;
}

.navbar-collapsed .nav-link {
  justify-content: center;
}

.navbar-collapsed .dropdown-menu {
  position: absolute;
  left: 100%;
  top: 0;
  margin-left: 0.5rem;
}

/* Mobile responsive */
@media (max-width: 991.98px) {
  .navbar-vertical {
    position: static;
    width: 100%;
    height: auto;
  }

  .navbar-vertical.navbar-collapsed {
    width: 100%;
  }
}

/* Active states */
.nav-item.active > .nav-link,
.nav-link.active {
  background-color: rgba(32, 107, 196, 0.06);
  color: var(--tblr-primary);
}

/* Dropdown improvements */
.dropdown-menu {
  animation: fadeIn 0.2s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-0.5rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Dark mode support */
:root.dark .navbar-vertical {
  background-color: var(--tblr-dark-mode-bg);
  border-right: 1px solid var(--tblr-border-color-dark);
}

:root.dark .nav-item.active > .nav-link,
:root.dark .nav-link.active {
  background-color: rgba(255, 255, 255, 0.06);
  color: var(--tblr-light);
}

/* Scrollbar styling */
.navbar-vertical::-webkit-scrollbar {
  width: 0.5rem;
}

.navbar-vertical::-webkit-scrollbar-track {
  background: transparent;
}

.navbar-vertical::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
}

.navbar-vertical:hover::-webkit-scrollbar-thumb {
  background: rgba(0, 0, 0, 0.2);
}

/* Navbar footer */
.navbar-footer {
  margin-top: auto;
  padding: 1rem 0;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
}
</style>
