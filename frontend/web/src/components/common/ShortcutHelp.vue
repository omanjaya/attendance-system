<template>
  <Teleport to="body">
    <div v-if="visible" class="shortcut-help-overlay" @click="close">
      <div
        class="shortcut-help-modal"
        role="dialog"
        aria-labelledby="shortcut-help-title"
        aria-modal="true"
        @click.stop
      >
        <div class="shortcut-help-header">
          <h2 id="shortcut-help-title" class="shortcut-help-title">Keyboard Shortcuts</h2>
          <button class="shortcut-help-close" aria-label="Close shortcuts help" @click="close">
            <svg class="shortcut-help-close-icon">
              <use href="#tabler-x"></use>
            </svg>
          </button>
        </div>

        <div class="shortcut-help-content">
          <div class="shortcut-help-search">
            <input
              v-model="searchQuery"
              type="text"
              class="shortcut-search-input"
              placeholder="Search shortcuts..."
              @keydown.esc="searchQuery = ''"
            />
          </div>

          <div class="shortcut-help-body">
            <div
              v-for="category in filteredCategories"
              :key="category.name"
              class="shortcut-category"
            >
              <h3 class="shortcut-category-title">{{ category.name }}</h3>
              <div class="shortcut-list">
                <div
                  v-for="shortcut in category.shortcuts"
                  :key="shortcut.keys"
                  class="shortcut-item"
                >
                  <div class="shortcut-keys">
                    <kbd
                      v-for="(key, index) in parseKeys(shortcut.keys)"
                      :key="index"
                      class="shortcut-key"
                    >
                      {{ formatKey(key) }}
                    </kbd>
                  </div>
                  <div class="shortcut-description">
                    {{ shortcut.description }}
                  </div>
                </div>
              </div>
            </div>

            <div v-if="filteredCategories.length === 0" class="shortcut-no-results">
              <div class="shortcut-no-results-icon">
                <svg class="shortcut-icon">
                  <use href="#tabler-search-off"></use>
                </svg>
              </div>
              <div class="shortcut-no-results-text">No shortcuts found for "{{ searchQuery }}"</div>
            </div>
          </div>
        </div>

        <div class="shortcut-help-footer">
          <div class="shortcut-help-tip">
            <svg class="shortcut-tip-icon">
              <use href="#tabler-info-circle"></use>
            </svg>
            <span>Press <kbd class="shortcut-key">?</kbd> anytime to open this help</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useGlobalShortcuts } from '@/composables/useKeyboardShortcuts'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },

  customShortcuts: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['close'])

// State
const searchQuery = ref('')
const { getGlobalShortcuts } = useGlobalShortcuts()

// Computed
const allShortcuts = computed(() => {
  const global = getGlobalShortcuts()
  const custom = props.customShortcuts

  return [...global, ...custom]
})

const categorizedShortcuts = computed(() => {
  const categories = {
    Navigation: [],
    'Search & Actions': [],
    'Data Management': [],
    'UI Controls': [],
    General: []
  }

  allShortcuts.value.forEach(shortcut => {
    const category = categorizeShortcut(shortcut)
    if (categories[category]) {
      categories[category].push(shortcut)
    }
  })

  // Convert to array format and filter out empty categories
  return Object.entries(categories)
    .filter(([_, shortcuts]) => shortcuts.length > 0)
    .map(([name, shortcuts]) => ({
      name,
      shortcuts: shortcuts.sort((a, b) => a.description.localeCompare(b.description))
    }))
})

const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categorizedShortcuts.value
  }

  const query = searchQuery.value.toLowerCase()

  return categorizedShortcuts.value
    .map(category => ({
      ...category,
      shortcuts: category.shortcuts.filter(
        shortcut =>
          shortcut.description.toLowerCase().includes(query) ||
          shortcut.keys.toLowerCase().includes(query)
      )
    }))
    .filter(category => category.shortcuts.length > 0)
})

// Methods
const close = () => {
  emit('close')
}

const categorizeShortcut = shortcut => {
  const { keys, description } = shortcut
  const desc = description.toLowerCase()

  if (desc.includes('go to') || desc.includes('navigate') || keys.startsWith('g ')) {
    return 'Navigation'
  }

  if (
    desc.includes('search') ||
    desc.includes('quick actions') ||
    keys.includes('ctrl+k') ||
    keys === 'q'
  ) {
    return 'Search & Actions'
  }

  if (
    desc.includes('save') ||
    desc.includes('delete') ||
    desc.includes('create') ||
    desc.includes('edit')
  ) {
    return 'Data Management'
  }

  if (
    desc.includes('close') ||
    desc.includes('modal') ||
    desc.includes('toggle') ||
    desc.includes('sidebar')
  ) {
    return 'UI Controls'
  }

  return 'General'
}

const parseKeys = keys => {
  return keys.split('+').map(key => key.trim())
}

const formatKey = key => {
  const keyMap = {
    ctrl: isMac() ? '⌘' : 'Ctrl',
    alt: isMac() ? '⌥' : 'Alt',
    shift: isMac() ? '⇧' : 'Shift',
    meta: '⌘',
    cmd: '⌘',
    space: 'Space',
    enter: 'Enter',
    esc: 'Esc',
    tab: 'Tab',
    del: 'Del',
    backspace: '⌫',
    up: '↑',
    down: '↓',
    left: '←',
    right: '→',
    f1: 'F1',
    f2: 'F2',
    f3: 'F3',
    f4: 'F4',
    f5: 'F5',
    f6: 'F6',
    f7: 'F7',
    f8: 'F8',
    f9: 'F9',
    f10: 'F10',
    f11: 'F11',
    f12: 'F12'
  }

  return keyMap[key.toLowerCase()] || key.charAt(0).toUpperCase() + key.slice(1)
}

const isMac = () => {
  return navigator.platform.toUpperCase().indexOf('MAC') >= 0
}

const handleKeydown = event => {
  if (event.key === 'Escape' && props.visible) {
    close()
  }
}

// Lifecycle
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Focus search input when opened
watch(
  () => props.visible,
  visible => {
    if (visible) {
      setTimeout(() => {
        const searchInput = document.querySelector('.shortcut-search-input')
        if (searchInput) {
          searchInput.focus()
        }
      }, 100)
    }
  }
)
</script>

<style scoped>
/* Overlay */
.shortcut-help-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--bg-overlay);
  backdrop-filter: blur(4px);
  z-index: var(--z-modal);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-4);
}

/* Modal */
.shortcut-help-modal {
  background: var(--bg-surface);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow-2xl);
  width: 100%;
  max-width: 48rem;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.shortcut-help-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-6) var(--space-6) 0;
  border-bottom: 1px solid var(--border-light);
  padding-bottom: var(--space-4);
}

.shortcut-help-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--text-primary);
  margin: 0;
}

.shortcut-help-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-md);
  color: var(--text-muted);
  cursor: pointer;
  transition: var(--transition-fast);
}

.shortcut-help-close:hover {
  background: var(--color-gray-100);
  color: var(--text-primary);
}

.shortcut-help-close-icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Content */
.shortcut-help-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.shortcut-help-search {
  padding: var(--space-4) var(--space-6);
  border-bottom: 1px solid var(--border-light);
}

.shortcut-search-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border-medium);
  border-radius: var(--radius-lg);
  background: var(--bg-surface);
  color: var(--text-primary);
  font-size: var(--font-size-sm);
  outline: none;
  transition: var(--transition-fast);
}

.shortcut-search-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.shortcut-search-input::placeholder {
  color: var(--text-muted);
}

.shortcut-help-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--space-4) var(--space-6);
}

/* Categories */
.shortcut-category {
  margin-bottom: var(--space-6);
}

.shortcut-category:last-child {
  margin-bottom: 0;
}

.shortcut-category-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--text-primary);
  margin: 0 0 var(--space-3);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--border-light);
}

/* Shortcut List */
.shortcut-list {
  display: grid;
  gap: var(--space-3);
}

.shortcut-item {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  transition: var(--transition-fast);
}

.shortcut-item:hover {
  background: var(--color-gray-50);
}

.shortcut-keys {
  display: flex;
  gap: var(--space-1);
  align-items: center;
  min-width: 8rem;
}

.shortcut-key {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 var(--space-2);
  background: var(--color-gray-100);
  border: 1px solid var(--border-medium);
  border-bottom: 2px solid var(--border-dark);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-mono);
  color: var(--text-primary);
  line-height: 1;
}

.shortcut-keys .shortcut-key + .shortcut-key::before {
  content: '+';
  margin: 0 var(--space-1);
  color: var(--text-muted);
  font-weight: normal;
}

.shortcut-description {
  color: var(--text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-normal);
}

/* No Results */
.shortcut-no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8);
  text-align: center;
}

.shortcut-no-results-icon {
  width: 3rem;
  height: 3rem;
  color: var(--text-muted);
  opacity: 0.5;
  margin-bottom: var(--space-4);
}

.shortcut-icon {
  width: 100%;
  height: 100%;
}

.shortcut-no-results-text {
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

/* Footer */
.shortcut-help-footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--border-light);
  background: var(--color-gray-50);
}

.shortcut-help-tip {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--text-muted);
  font-size: var(--font-size-sm);
}

.shortcut-tip-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-info);
}

/* Responsive Design */
@media (max-width: 768px) {
  .shortcut-help-overlay {
    padding: var(--space-2);
  }

  .shortcut-help-modal {
    max-height: 95vh;
  }

  .shortcut-help-header {
    padding: var(--space-4) var(--space-4) 0;
  }

  .shortcut-help-search {
    padding: var(--space-3) var(--space-4);
  }

  .shortcut-help-body {
    padding: var(--space-3) var(--space-4);
  }

  .shortcut-help-footer {
    padding: var(--space-3) var(--space-4);
  }

  .shortcut-item {
    grid-template-columns: 1fr;
    gap: var(--space-2);
    text-align: left;
  }

  .shortcut-keys {
    min-width: auto;
    justify-content: flex-start;
  }
}

@media (max-width: 480px) {
  .shortcut-help-title {
    font-size: var(--font-size-lg);
  }

  .shortcut-category-title {
    font-size: var(--font-size-base);
  }

  .shortcut-key {
    min-width: 1.25rem;
    height: 1.25rem;
    font-size: 0.625rem;
  }
}

/* Dark theme adjustments */
[data-theme='dark'] .shortcut-item:hover {
  background: var(--color-gray-800);
}

[data-theme='dark'] .shortcut-key {
  background: var(--color-gray-800);
  border-color: var(--border-dark);
  border-bottom-color: var(--color-gray-600);
}

[data-theme='dark'] .shortcut-help-footer {
  background: var(--color-gray-900);
}

[data-theme='dark'] .shortcut-help-close:hover {
  background: var(--color-gray-800);
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .shortcut-key {
    border-width: 2px;
    border-bottom-width: 3px;
  }

  .shortcut-help-modal {
    border-width: 2px;
  }
}

/* Reduce motion */
@media (prefers-reduced-motion: reduce) {
  .shortcut-item,
  .shortcut-help-close,
  .shortcut-search-input {
    transition: none;
  }
}

/* Print styles */
@media print {
  .shortcut-help-overlay {
    position: static;
    background: none;
    backdrop-filter: none;
  }

  .shortcut-help-modal {
    box-shadow: none;
    border: 1px solid #000;
    max-height: none;
  }

  .shortcut-help-search,
  .shortcut-help-footer {
    display: none;
  }
}
</style>
