<template>
  <div class="global-search" :class="{ 'is-expanded': isExpanded }">
    <div class="search-input-wrapper">
      <button v-if="!isExpanded" class="search-trigger" :title="searchHint" @click="expandSearch">
        <svg class="search-icon">
          <use href="#tabler-search"></use>
        </svg>
      </button>

      <div v-else class="search-input-container">
        <input
          ref="searchInput"
          v-model="searchQuery"
          type="search"
          class="search-input"
          :placeholder="placeholder"
          autocomplete="off"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @keydown="handleKeydown"
        />

        <div class="search-actions">
          <button v-if="searchQuery" class="search-clear" title="Clear search" @click="clearSearch">
            <svg class="search-icon">
              <use href="#tabler-x"></use>
            </svg>
          </button>

          <button class="search-close" title="Close search" @click="collapseSearch">
            <svg class="search-icon">
              <use href="#tabler-x"></use>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Search Results Dropdown -->
    <div v-if="isExpanded && (isLoading || results.length > 0 || showNoResults)" class="search-results">
      <!-- Loading State -->
      <div v-if="isLoading" class="search-loading">
        <div class="search-spinner">
          <div class="spinner-border spinner-border-sm text-primary" role="status"></div>
        </div>
        <span class="search-loading-text">Searching...</span>
      </div>

      <!-- Results -->
      <div v-else-if="results.length > 0" class="search-results-list">
        <div v-for="(category, categoryName) in groupedResults" :key="categoryName" class="search-category">
          <div class="search-category-header">
            <svg class="search-category-icon">
              <use :href="`#tabler-${getCategoryIcon(categoryName)}`"></use>
            </svg>
            <span class="search-category-title">{{ getCategoryLabel(categoryName) }}</span>
            <span class="search-category-count">{{ category.length }}</span>
          </div>

          <div class="search-category-items">
            <a
              v-for="(result, index) in category.slice(0, maxResultsPerCategory)"
              :key="result.id"
              :href="result.url"
              class="search-result-item"
              :class="{
                'is-highlighted': highlightedIndex === getGlobalIndex(categoryName, index)
              }"
              @click="selectResult(result)"
              @mouseenter="highlightedIndex = getGlobalIndex(categoryName, index)"
            >
              <div class="search-result-icon">
                <svg class="search-icon">
                  <use :href="`#tabler-${result.icon || getCategoryIcon(categoryName)}`"></use>
                </svg>
              </div>

              <div class="search-result-content">
                <div class="search-result-title" v-html="highlightMatch(result.title)"></div>
                <div
                  v-if="result.subtitle"
                  class="search-result-subtitle"
                  v-html="highlightMatch(result.subtitle)"
                ></div>
              </div>

              <div v-if="result.badge" class="search-result-badge">
                <span class="badge" :class="`bg-${result.badgeColor || 'secondary'}`">
                  {{ result.badge }}
                </span>
              </div>
            </a>

            <div v-if="category.length > maxResultsPerCategory" class="search-see-more">
              <router-link :to="getCategoryUrl(categoryName)" class="search-see-more-link">
                See all {{ category.length }} {{ getCategoryLabel(categoryName).toLowerCase() }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="showNoResults" class="search-no-results">
        <div class="search-no-results-icon">
          <svg class="search-icon">
            <use href="#tabler-search-off"></use>
          </svg>
        </div>
        <div class="search-no-results-text">
          <div class="search-no-results-title">No results found</div>
          <div class="search-no-results-subtitle">Try adjusting your search terms or browse our sections</div>
        </div>
      </div>

      <!-- Quick Links -->
      <div v-if="searchQuery && quickLinks.length > 0" class="search-quick-links">
        <div class="search-category-header">
          <svg class="search-category-icon">
            <use href="#tabler-bolt"></use>
          </svg>
          <span class="search-category-title">Quick Actions</span>
        </div>
        <div class="search-category-items">
          <router-link
            v-for="link in quickLinks"
            :key="link.to"
            :to="link.to"
            class="search-result-item"
            @click="collapseSearch"
          >
            <div class="search-result-icon">
              <svg class="search-icon">
                <use :href="`#tabler-${link.icon}`"></use>
              </svg>
            </div>
            <div class="search-result-content">
              <div class="search-result-title">{{ link.label }}</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Backdrop -->
    <div v-if="isExpanded" class="search-backdrop" @click="collapseSearch"></div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search employees, schedules, reports...'
  },

  searchHint: {
    type: String,
    default: 'Search (Ctrl+K)'
  },

  maxResultsPerCategory: {
    type: Number,
    default: 3
  },

  debounceMs: {
    type: Number,
    default: 300
  }
})

const emit = defineEmits(['search', 'select'])

const router = useRouter()

// State
const searchQuery = ref('')
const isExpanded = ref(false)
const isLoading = ref(false)
const results = ref([])
const highlightedIndex = ref(-1)
const searchInput = ref(null)
let debounceTimer = null

// Computed
const showNoResults = computed(() => {
  return searchQuery.value && !isLoading.value && results.value.length === 0
})

const groupedResults = computed(() => {
  const grouped = {}
  results.value.forEach(result => {
    if (!grouped[result.category]) {
      grouped[result.category] = []
    }
    grouped[result.category].push(result)
  })
  return grouped
})

const quickLinks = computed(() => {
  if (!searchQuery.value) return []

  return [
    {
      label: 'Add new employee',
      to: '/employees/create',
      icon: 'user-plus'
    },
    {
      label: 'Search in reports',
      to: `/reports?search=${searchQuery.value}`,
      icon: 'chart-bar'
    },
    {
      label: `View attendance for "${searchQuery.value}"`,
      to: `/attendance?search=${searchQuery.value}`,
      icon: 'calendar'
    }
  ]
})

// Methods
const expandSearch = () => {
  isExpanded.value = true
  nextTick(() => {
    searchInput.value?.focus()
  })
}

const collapseSearch = () => {
  isExpanded.value = false
  searchQuery.value = ''
  results.value = []
  highlightedIndex.value = -1
}

const handleInput = () => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    performSearch()
  }, props.debounceMs)
}

const handleFocus = () => {
  if (searchQuery.value) {
    performSearch()
  }
}

const handleBlur = event => {
  // Don't close if clicking on results
  if (event.relatedTarget?.closest('.search-results')) {
    return
  }
  setTimeout(() => {
    if (!document.activeElement?.closest('.search-results')) {
      collapseSearch()
    }
  }, 150)
}

const handleKeydown = event => {
  const totalResults = results.value.length

  switch (event.key) {
    case 'Escape':
      collapseSearch()
      break

    case 'ArrowDown':
      event.preventDefault()
      highlightedIndex.value = Math.min(highlightedIndex.value + 1, totalResults - 1)
      break

    case 'ArrowUp':
      event.preventDefault()
      highlightedIndex.value = Math.max(highlightedIndex.value - 1, -1)
      break

    case 'Enter':
      event.preventDefault()
      if (highlightedIndex.value >= 0 && results.value[highlightedIndex.value]) {
        selectResult(results.value[highlightedIndex.value])
      }
      break
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  results.value = []
  highlightedIndex.value = -1
  searchInput.value?.focus()
}

const performSearch = async () => {
  const query = searchQuery.value.trim()

  if (!query) {
    results.value = []
    return
  }

  isLoading.value = true

  try {
    // Mock search results - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 200))

    results.value = mockSearch(query)
    emit('search', { query, results: results.value })
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  } finally {
    isLoading.value = false
  }
}

const selectResult = result => {
  emit('select', result)

  if (result.url) {
    router.push(result.url)
  }

  collapseSearch()
}

// Helper methods
const getCategoryIcon = category => {
  const icons = {
    employees: 'users',
    attendance: 'calendar',
    schedules: 'clock',
    reports: 'chart-bar',
    settings: 'settings'
  }
  return icons[category] || 'file'
}

const getCategoryLabel = category => {
  const labels = {
    employees: 'Employees',
    attendance: 'Attendance',
    schedules: 'Schedules',
    reports: 'Reports',
    settings: 'Settings'
  }
  return labels[category] || category
}

const getCategoryUrl = category => {
  const urls = {
    employees: '/employees',
    attendance: '/attendance',
    schedules: '/schedules',
    reports: '/reports',
    settings: '/settings'
  }
  return urls[category] || '/'
}

const getGlobalIndex = (categoryName, localIndex) => {
  let globalIndex = 0
  for (const [name, items] of Object.entries(groupedResults.value)) {
    if (name === categoryName) {
      return globalIndex + localIndex
    }
    globalIndex += Math.min(items.length, props.maxResultsPerCategory)
  }
  return globalIndex
}

const highlightMatch = text => {
  if (!searchQuery.value || !text) return text

  const regex = new RegExp(`(${searchQuery.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Mock search function - replace with actual search API
const mockSearch = query => {
  const mockData = [
    // Employees
    {
      id: 1,
      category: 'employees',
      title: 'John Doe',
      subtitle: 'Mathematics Teacher',
      url: '/employees/1',
      icon: 'user',
      badge: 'Active',
      badgeColor: 'success'
    },
    {
      id: 2,
      category: 'employees',
      title: 'Jane Smith',
      subtitle: 'English Teacher',
      url: '/employees/2',
      icon: 'user',
      badge: 'Active',
      badgeColor: 'success'
    },
    {
      id: 3,
      category: 'employees',
      title: 'Ahmad Rahman',
      subtitle: 'IT Staff',
      url: '/employees/3',
      icon: 'user',
      badge: 'Inactive',
      badgeColor: 'secondary'
    },

    // Attendance
    {
      id: 4,
      category: 'attendance',
      title: "Today's Attendance",
      subtitle: '85 present, 10 absent',
      url: '/attendance/today',
      icon: 'calendar-check'
    },
    {
      id: 5,
      category: 'attendance',
      title: 'Monthly Report',
      subtitle: 'December 2024',
      url: '/attendance/monthly',
      icon: 'calendar-stats'
    },

    // Reports
    {
      id: 6,
      category: 'reports',
      title: 'Payroll Report',
      subtitle: 'December 2024',
      url: '/reports/payroll',
      icon: 'receipt'
    },
    {
      id: 7,
      category: 'reports',
      title: 'Attendance Summary',
      subtitle: 'Year-end report',
      url: '/reports/attendance',
      icon: 'chart-line'
    }
  ]

  return mockData.filter(
    item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle?.toLowerCase().includes(query.toLowerCase())
  )
}

// Keyboard shortcuts
const handleGlobalKeydown = event => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
    event.preventDefault()
    if (!isExpanded.value) {
      expandSearch()
    }
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleGlobalKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleGlobalKeydown)
  clearTimeout(debounceTimer)
})

// Watch for route changes to close search
watch(
  () => router.currentRoute.value,
  () => {
    if (isExpanded.value) {
      collapseSearch()
    }
  }
)
</script>

<style scoped>
/* Global Search Container */
.global-search {
  position: relative;
  z-index: var(--z-dropdown);
}

.global-search.is-expanded {
  z-index: var(--z-modal);
}

/* Search Input */
.search-input-wrapper {
  position: relative;
}

.search-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  padding: 0;
  background: transparent;
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-trigger:hover {
  background-color: var(--color-gray-50);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.search-input-container {
  display: flex;
  align-items: center;
  width: 20rem;
  max-width: 90vw;
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
}

.search-input {
  flex: 1;
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  background: transparent;
  border: none;
  outline: none;
  color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-actions {
  display: flex;
  align-items: center;
  padding-right: var(--space-2);
  gap: var(--space-1);
}

.search-clear,
.search-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition-fast);
}

.search-clear:hover,
.search-close:hover {
  background-color: var(--color-gray-100);
  color: var(--text-primary);
}

/* Search Results */
.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: var(--space-2);
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-xl);
  max-height: 70vh;
  overflow-y: auto;
  z-index: var(--z-dropdown);
}

/* Loading State */
.search-loading {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  color: var(--text-muted);
}

.search-loading-text {
  font-size: var(--font-size-sm);
}

/* Results List */
.search-results-list {
  padding: var(--space-2);
}

.search-category:not(:last-child) {
  border-bottom: 1px solid var(--border-light);
  margin-bottom: var(--space-2);
  padding-bottom: var(--space-2);
}

.search-category-header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-semibold);
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.search-category-icon {
  width: 0.875rem;
  height: 0.875rem;
}

.search-category-count {
  margin-left: auto;
  padding: var(--space-1) var(--space-2);
  background-color: var(--color-gray-100);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
}

/* Result Items */
.search-result-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  text-decoration: none;
  color: var(--text-primary);
  transition: var(--transition-fast);
}

.search-result-item:hover,
.search-result-item.is-highlighted {
  background-color: var(--color-primary-light);
  color: var(--color-primary-dark);
  text-decoration: none;
}

.search-result-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background-color: var(--color-gray-100);
  border-radius: var(--radius-md);
  color: var(--text-muted);
}

.search-result-item:hover .search-result-icon,
.search-result-item.is-highlighted .search-result-icon {
  background-color: var(--color-primary);
  color: var(--color-white);
}

.search-result-content {
  flex: 1;
  min-width: 0;
}

.search-result-title {
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
}

.search-result-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
  margin-top: var(--space-1);
}

.search-result-badge {
  margin-left: auto;
}

/* See More Link */
.search-see-more {
  padding: var(--space-2) var(--space-3);
}

.search-see-more-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
  font-weight: var(--font-weight-medium);
}

.search-see-more-link:hover {
  text-decoration: underline;
}

/* No Results */
.search-no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-8) var(--space-4);
  text-align: center;
}

.search-no-results-icon {
  width: 3rem;
  height: 3rem;
  margin-bottom: var(--space-4);
  color: var(--text-muted);
  opacity: 0.6;
}

.search-no-results-title {
  font-weight: var(--font-weight-medium);
  margin-bottom: var(--space-2);
}

.search-no-results-subtitle {
  font-size: var(--font-size-sm);
  color: var(--text-muted);
}

/* Quick Links */
.search-quick-links {
  border-top: 1px solid var(--border-light);
  padding-top: var(--space-2);
  margin-top: var(--space-2);
}

/* Search Icons */
.search-icon {
  width: 1rem;
  height: 1rem;
  stroke-width: 1.5;
}

/* Backdrop */
.search-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--bg-overlay);
  z-index: -1;
}

/* Highlight */
mark {
  background-color: var(--color-warning-light);
  color: var(--color-warning-dark);
  padding: 0;
  border-radius: var(--radius-sm);
}

/* Responsive */
@media (max-width: 768px) {
  .search-input-container {
    width: 100%;
    max-width: none;
  }

  .search-results {
    left: -1rem;
    right: -1rem;
    max-height: 60vh;
  }

  .search-category-header {
    padding: var(--space-2);
  }

  .search-result-item {
    padding: var(--space-3) var(--space-2);
  }
}

/* Dark theme adjustments */
[data-theme='dark'] .search-trigger:hover {
  background-color: var(--color-gray-800);
}

[data-theme='dark'] .search-clear:hover,
[data-theme='dark'] .search-close:hover {
  background-color: var(--color-gray-700);
}

[data-theme='dark'] .search-result-icon {
  background-color: var(--color-gray-800);
}

[data-theme='dark'] .search-category-count {
  background-color: var(--color-gray-800);
  color: var(--color-gray-300);
}
</style>
