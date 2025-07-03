<template>
  <div class="data-table-wrapper">
    <!-- Table Header -->
    <div v-if="showHeader" class="table-header">
      <div class="row align-items-center">
        <div class="col">
          <h3 v-if="title" class="table-title">{{ title }}</h3>
          <p v-if="description" class="table-description text-muted">{{ description }}</p>
        </div>
        <div class="col-auto">
          <div class="btn-list">
            <!-- Search -->
            <div v-if="searchable" class="input-group input-group-sm">
              <input
                v-model="searchQuery"
                type="search"
                class="form-control"
                :placeholder="searchPlaceholder"
                @input="handleSearch"
              />
              <button class="btn btn-outline-secondary" type="button">
                <TablerIcon name="search" size="sm" />
              </button>
            </div>

            <!-- Export -->
            <div v-if="exportable" class="dropdown">
              <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                <TablerIcon name="download" size="sm" />
                Export
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" @click="exportData('csv')">CSV</a></li>
                <li><a class="dropdown-item" href="#" @click="exportData('excel')">Excel</a></li>
                <li><a class="dropdown-item" href="#" @click="exportData('pdf')">PDF</a></li>
              </ul>
            </div>

            <!-- Refresh -->
            <button v-if="refreshable" class="btn btn-outline-secondary btn-sm" :disabled="loading" @click="refresh">
              <TablerIcon name="refresh" size="sm" :class="{ spin: loading }" />
            </button>

            <!-- Custom Actions -->
            <slot name="actions" />
          </div>
        </div>
      </div>
    </div>

    <!-- Table Controls -->
    <div v-if="showControls" class="table-controls">
      <div class="row align-items-center">
        <div class="col-sm-auto">
          <label class="form-label"
            >Show
            <select v-model="pageSize" class="form-select form-select-sm d-inline-block w-auto">
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
            </select>
            entries
          </label>
        </div>
        <div class="col-sm-auto ms-auto">
          <div class="btn-group btn-group-sm" role="group">
            <input
              id="table-view"
              type="radio"
              class="btn-check"
              name="view-mode"
              :checked="viewMode === 'table'"
              @change="viewMode = 'table'"
            />
            <label class="btn btn-outline-secondary" for="table-view">
              <TablerIcon name="table" size="sm" />
            </label>

            <input
              id="card-view"
              type="radio"
              class="btn-check"
              name="view-mode"
              :checked="viewMode === 'card'"
              @change="viewMode = 'card'"
            />
            <label class="btn btn-outline-secondary" for="card-view">
              <TablerIcon name="layout-grid" size="sm" />
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <LoadingState v-if="loading && !data.length" />

    <!-- Empty State -->
    <div v-else-if="!loading && !data.length" class="empty-state text-center py-5">
      <TablerIcon name="database" size="lg" class="text-muted mb-3" />
      <h4 class="text-muted">{{ emptyTitle }}</h4>
      <p class="text-muted">{{ emptyMessage }}</p>
      <slot name="empty-actions" />
    </div>

    <!-- Table View -->
    <div v-else-if="viewMode === 'table'" class="table-responsive">
      <table class="table table-vcenter" :class="tableClass">
        <thead>
          <tr>
            <!-- Select All -->
            <th v-if="selectable" style="width: 1rem">
              <input
                type="checkbox"
                class="form-check-input"
                :checked="isAllSelected"
                :indeterminate="isPartiallySelected"
                @change="toggleSelectAll"
              />
            </th>

            <!-- Columns -->
            <th
              v-for="column in columns"
              :key="column.key"
              :style="{ width: column.width }"
              :class="{
                sortable: column.sortable,
                sorted: sortColumn === column.key,
                [`text-${column.align || 'start'}`]: column.align
              }"
              @click="column.sortable && handleSort(column.key)"
            >
              {{ column.label }}
              <TablerIcon v-if="column.sortable" :name="getSortIcon(column.key)" size="sm" class="sort-icon" />
            </th>

            <!-- Actions -->
            <th v-if="$slots.actions || actionsColumn" class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(item, index) in paginatedData"
            :key="getRowKey(item, index)"
            :class="getRowClass(item, index)"
            @click="handleRowClick(item, index)"
          >
            <!-- Select -->
            <td v-if="selectable">
              <input
                type="checkbox"
                class="form-check-input"
                :checked="selectedItems.includes(getRowKey(item, index))"
                @change="toggleSelect(item, index)"
                @click.stop
              />
            </td>

            <!-- Data Cells -->
            <td
              v-for="column in columns"
              :key="column.key"
              :class="[`text-${column.align || 'start'}`, column.cellClass]"
            >
              <slot :name="`cell-${column.key}`" :item="item" :value="getCellValue(item, column.key)" :index="index">
                <component
                  :is="column.component"
                  v-if="column.component"
                  :value="getCellValue(item, column.key)"
                  :item="item"
                  v-bind="column.componentProps"
                />
                <span v-else :class="column.textClass">
                  {{ formatCellValue(item, column) }}
                </span>
              </slot>
            </td>

            <!-- Actions -->
            <td v-if="$slots.actions || actionsColumn" class="text-end">
              <slot name="actions" :item="item" :index="index">
                <div class="btn-group btn-group-sm" role="group">
                  <button
                    v-for="action in actionsColumn"
                    :key="action.key"
                    class="btn"
                    :class="action.class || 'btn-outline-secondary'"
                    :title="action.title"
                    @click="handleAction(action.key, item, index)"
                  >
                    <TablerIcon :name="action.icon" size="sm" />
                  </button>
                </div>
              </slot>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Card View -->
    <div v-else class="row row-cards">
      <div v-for="(item, index) in paginatedData" :key="getRowKey(item, index)" class="col-sm-6 col-lg-4">
        <slot name="card" :item="item" :index="index">
          <div class="card card-sm">
            <div class="card-body">
              <div v-for="column in visibleColumns" :key="column.key" class="mb-2">
                <strong>{{ column.label }}:</strong>
                {{ formatCellValue(item, column) }}
              </div>
            </div>
          </div>
        </slot>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="paginated && totalPages > 1" class="d-flex align-items-center justify-content-between mt-3">
      <div class="text-muted">
        Showing {{ (currentPage - 1) * pageSize + 1 }} to {{ Math.min(currentPage * pageSize, total) }} of
        {{ total }} entries
      </div>

      <nav>
        <ul class="pagination pagination-sm">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" :disabled="currentPage === 1" @click="goToPage(currentPage - 1)">
              <TablerIcon name="chevron-left" size="sm" />
            </button>
          </li>

          <li v-for="page in visiblePages" :key="page" class="page-item" :class="{ active: page === currentPage }">
            <button class="page-link" @click="goToPage(page)">{{ page }}</button>
          </li>

          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" :disabled="currentPage === totalPages" @click="goToPage(currentPage + 1)">
              <TablerIcon name="chevron-right" size="sm" />
            </button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { debounce } from '@/utils/helpers'
import { formatters } from '@/utils/formatters'
import TablerIcon from './TablerIcon.vue'
import LoadingState from './LoadingState.vue'

const props = defineProps({
  // Data
  data: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Array,
    required: true
  },

  // Configuration
  title: String,
  description: String,
  emptyTitle: {
    type: String,
    default: 'No data available'
  },
  emptyMessage: {
    type: String,
    default: 'There are no records to display'
  },

  // Features
  searchable: {
    type: Boolean,
    default: true
  },
  sortable: {
    type: Boolean,
    default: true
  },
  selectable: {
    type: Boolean,
    default: false
  },
  paginated: {
    type: Boolean,
    default: true
  },
  exportable: {
    type: Boolean,
    default: true
  },
  refreshable: {
    type: Boolean,
    default: true
  },

  // Display
  showHeader: {
    type: Boolean,
    default: true
  },
  showControls: {
    type: Boolean,
    default: true
  },
  tableClass: {
    type: String,
    default: 'table-hover'
  },

  // Pagination
  defaultPageSize: {
    type: Number,
    default: 10
  },
  pageSizes: {
    type: Array,
    default: () => [5, 10, 25, 50, 100]
  },

  // Search
  searchPlaceholder: {
    type: String,
    default: 'Search...'
  },

  // Actions
  actionsColumn: Array,

  // Server-side processing
  serverSide: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  },

  // Row configuration
  rowKey: {
    type: [String, Function],
    default: 'id'
  }
})

const emit = defineEmits([
  'search',
  'sort',
  'page-change',
  'page-size-change',
  'select',
  'select-all',
  'row-click',
  'action',
  'refresh',
  'export'
])

// State
const searchQuery = ref('')
const sortColumn = ref('')
const sortDirection = ref('asc')
const currentPage = ref(1)
const pageSize = ref(props.defaultPageSize)
const selectedItems = ref([])
const viewMode = ref('table')

// Computed
const visibleColumns = computed(() => props.columns.filter(col => !col.hidden))

const filteredData = computed(() => {
  if (props.serverSide || !searchQuery.value) return props.data

  const query = searchQuery.value.toLowerCase()
  return props.data.filter(item =>
    props.columns.some(column => {
      const value = getCellValue(item, column.key)
      return String(value).toLowerCase().includes(query)
    })
  )
})

const sortedData = computed(() => {
  if (props.serverSide || !sortColumn.value) return filteredData.value

  const column = props.columns.find(col => col.key === sortColumn.value)
  if (!column || !column.sortable) return filteredData.value

  return [...filteredData.value].sort((a, b) => {
    const aVal = getCellValue(a, column.key)
    const bVal = getCellValue(b, column.key)

    let result = 0
    if (aVal < bVal) result = -1
    else if (aVal > bVal) result = 1

    return sortDirection.value === 'desc' ? -result : result
  })
})

const paginatedData = computed(() => {
  if (props.serverSide || !props.paginated) return sortedData.value

  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return sortedData.value.slice(start, end)
})

const totalRecords = computed(() => (props.serverSide ? props.total : filteredData.value.length))

const totalPages = computed(() => Math.ceil(totalRecords.value / pageSize.value))

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, currentPage.value + 2)

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

const isAllSelected = computed(
  () => selectedItems.value.length === paginatedData.value.length && paginatedData.value.length > 0
)

const isPartiallySelected = computed(
  () => selectedItems.value.length > 0 && selectedItems.value.length < paginatedData.value.length
)

// Methods
const getCellValue = (item, key) => {
  return key.split('.').reduce((obj, k) => obj?.[k], item)
}

const formatCellValue = (item, column) => {
  const value = getCellValue(item, column.key)

  if (column.formatter && typeof column.formatter === 'function') {
    return column.formatter(value, item)
  }

  if (column.format) {
    switch (column.format) {
      case 'date':
        return formatters.date(value)
      case 'datetime':
        return formatters.dateTime(value)
      case 'currency':
        return formatters.currency(value)
      case 'number':
        return formatters.number(value)
      case 'percentage':
        return formatters.percentage(value)
      default:
        return value
    }
  }

  return value
}

const getRowKey = (item, index) => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(item, index)
  }
  return getCellValue(item, props.rowKey) || index
}

const getRowClass = (item, index) => {
  const classes = []

  if (selectedItems.value.includes(getRowKey(item, index))) {
    classes.push('table-active')
  }

  return classes
}

const handleSearch = debounce(event => {
  const query = event.target.value

  if (props.serverSide) {
    emit('search', query)
  }

  currentPage.value = 1
}, 300)

const handleSort = columnKey => {
  if (sortColumn.value === columnKey) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortColumn.value = columnKey
    sortDirection.value = 'asc'
  }

  if (props.serverSide) {
    emit('sort', { column: columnKey, direction: sortDirection.value })
  }
}

const getSortIcon = columnKey => {
  if (sortColumn.value !== columnKey) return 'selector'
  return sortDirection.value === 'asc' ? 'chevron-up' : 'chevron-down'
}

const goToPage = page => {
  if (page < 1 || page > totalPages.value) return

  currentPage.value = page

  if (props.serverSide) {
    emit('page-change', page)
  }
}

const toggleSelect = (item, index) => {
  const key = getRowKey(item, index)
  const selectedIndex = selectedItems.value.indexOf(key)

  if (selectedIndex > -1) {
    selectedItems.value.splice(selectedIndex, 1)
  } else {
    selectedItems.value.push(key)
  }

  emit('select', {
    item,
    selected: selectedIndex === -1,
    selectedItems: selectedItems.value
  })
}

const toggleSelectAll = () => {
  if (isAllSelected.value) {
    selectedItems.value = []
  } else {
    selectedItems.value = paginatedData.value.map((item, index) => getRowKey(item, index))
  }

  emit('select-all', {
    selected: !isAllSelected.value,
    selectedItems: selectedItems.value
  })
}

const handleRowClick = (item, index) => {
  emit('row-click', { item, index })
}

const handleAction = (actionKey, item, index) => {
  emit('action', { action: actionKey, item, index })
}

const refresh = () => {
  emit('refresh')
}

const exportData = format => {
  emit('export', { format, data: filteredData.value })
}

// Watchers
watch(
  () => pageSize.value,
  newSize => {
    currentPage.value = 1
    if (props.serverSide) {
      emit('page-size-change', newSize)
    }
  }
)

// Lifecycle
onMounted(() => {
  if (props.serverSide) {
    emit('refresh')
  }
})
</script>

<style scoped>
.data-table-wrapper {
  background: var(--tblr-bg-surface);
  border-radius: var(--tblr-border-radius);
  overflow: hidden;
}

.table-header {
  padding: 1rem;
  border-bottom: 1px solid var(--tblr-border-color);
  background: var(--tblr-bg-surface-secondary);
}

.table-title {
  margin: 0;
  font-size: 1.125rem;
  font-weight: 600;
}

.table-description {
  margin: 0;
  font-size: 0.875rem;
}

.table-controls {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--tblr-border-color);
  background: var(--tblr-bg-surface);
}

.table th.sortable {
  cursor: pointer;
  user-select: none;
}

.table th.sortable:hover {
  background-color: var(--tblr-bg-surface-secondary);
}

.sort-icon {
  margin-left: 0.25rem;
  opacity: 0.5;
}

.table th.sorted .sort-icon {
  opacity: 1;
}

.empty-state {
  padding: 3rem 1rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Dark mode support */
:root.dark .table-header,
:root.dark .table-controls {
  background-color: var(--tblr-dark-mode-bg);
  border-color: var(--tblr-border-color-dark);
}

:root.dark .data-table-wrapper {
  background-color: var(--tblr-dark-mode-bg);
}
</style>
