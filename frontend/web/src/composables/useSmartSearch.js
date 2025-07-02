import { computed, ref, watch } from 'vue'

/**
 * Smart search composable with advanced features
 */
export const useSmartSearch = (options = {}) => {
  const {
    searchFields = ['name'], // Fields to search in
    fuzzySearch = true, // Enable fuzzy matching
    debounceMs = 300, // Debounce delay
    minSearchLength = 2, // Minimum search length
    maxResults = 50, // Maximum results to return
    highlightMatches = true, // Highlight matching text
    trackHistory = true, // Track search history
    smartSuggestions = true // Provide smart suggestions
  } = options

  // State
  const searchQuery = ref('')
  const searchResults = ref([])
  const searchHistory = ref([])
  const searchSuggestions = ref([])
  const isSearching = ref(false)
  const lastSearchTime = ref(0)

  let debounceTimer = null
  const searchIndex = null // For better search performance

  /**
   * Perform search with debouncing
   */
  const search = async (data, query = searchQuery.value) => {
    clearTimeout(debounceTimer)

    return new Promise(resolve => {
      debounceTimer = setTimeout(async () => {
        const results = await performSearch(data, query)
        resolve(results)
      }, debounceMs)
    })
  }

  /**
   * Immediate search without debouncing
   */
  const searchImmediate = async (data, query = searchQuery.value) => {
    return await performSearch(data, query)
  }

  /**
   * Core search logic
   */
  const performSearch = async (data, query) => {
    if (!query || query.length < minSearchLength) {
      searchResults.value = data.slice(0, maxResults)
      return searchResults.value
    }

    isSearching.value = true
    lastSearchTime.value = Date.now()

    try {
      let results = []

      if (fuzzySearch) {
        results = fuzzySearchItems(data, query)
      } else {
        results = exactSearchItems(data, query)
      }

      // Sort by relevance
      results = sortByRelevance(results, query)

      // Limit results
      results = results.slice(0, maxResults)

      // Highlight matches if enabled
      if (highlightMatches) {
        results = results.map(item => highlightMatches(item, query))
      }

      searchResults.value = results

      // Update search history
      if (trackHistory && query.length >= minSearchLength) {
        updateSearchHistory(query)
      }

      // Generate suggestions
      if (smartSuggestions) {
        generateSuggestions(data, query)
      }

      return results
    } finally {
      isSearching.value = false
    }
  }

  /**
   * Fuzzy search implementation
   */
  const fuzzySearchItems = (data, query) => {
    const queryLower = query.toLowerCase()
    const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0)

    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = getNestedValue(item, field)
        if (!fieldValue) return false

        const fieldValueLower = fieldValue.toLowerCase()

        // Exact match gets highest priority
        if (fieldValueLower.includes(queryLower)) {
          item._searchScore = (item._searchScore || 0) + 100
          return true
        }

        // Word-based fuzzy matching
        const matchingWords = queryWords.filter(word => {
          return (
            fieldValueLower.includes(word) ||
            fuzzyMatch(fieldValueLower, word) ||
            soundexMatch(fieldValueLower, word)
          )
        })

        if (matchingWords.length > 0) {
          const score = (matchingWords.length / queryWords.length) * 50
          item._searchScore = (item._searchScore || 0) + score
          return true
        }

        return false
      })
    })
  }

  /**
   * Exact search implementation
   */
  const exactSearchItems = (data, query) => {
    const queryLower = query.toLowerCase()

    return data.filter(item => {
      return searchFields.some(field => {
        const fieldValue = getNestedValue(item, field)
        if (!fieldValue) return false

        const fieldValueLower = fieldValue.toLowerCase()
        const matches = fieldValueLower.includes(queryLower)

        if (matches) {
          // Score based on match position (earlier matches score higher)
          const matchIndex = fieldValueLower.indexOf(queryLower)
          const score = 100 - (matchIndex / fieldValueLower.length) * 50
          item._searchScore = (item._searchScore || 0) + score
        }

        return matches
      })
    })
  }

  /**
   * Sort results by relevance score
   */
  const sortByRelevance = (results, query) => {
    return results.sort((a, b) => {
      const scoreA = a._searchScore || 0
      const scoreB = b._searchScore || 0

      if (scoreA !== scoreB) {
        return scoreB - scoreA
      }

      // If scores are equal, sort alphabetically
      const nameA = getNestedValue(a, searchFields[0]) || ''
      const nameB = getNestedValue(b, searchFields[0]) || ''
      return nameA.localeCompare(nameB)
    })
  }

  /**
   * Highlight matching text in results
   */
  const highlightMatchesInItem = (item, query) => {
    const highlightedItem = { ...item }
    const queryLower = query.toLowerCase()

    searchFields.forEach(field => {
      const fieldValue = getNestedValue(item, field)
      if (fieldValue && typeof fieldValue === 'string') {
        const highlighted = highlightText(fieldValue, query)
        setNestedValue(highlightedItem, field, highlighted)
      }
    })

    return highlightedItem
  }

  /**
   * Highlight text with HTML marks
   */
  const highlightText = (text, query) => {
    if (!query || !text) return text

    const queryWords = query.split(/\s+/).filter(word => word.length > 0)
    let highlightedText = text

    queryWords.forEach(word => {
      const regex = new RegExp(`(${escapeRegExp(word)})`, 'gi')
      highlightedText = highlightedText.replace(regex, '<mark>$1</mark>')
    })

    return highlightedText
  }

  /**
   * Update search history
   */
  const updateSearchHistory = query => {
    const history = searchHistory.value
    const existingIndex = history.indexOf(query)

    if (existingIndex > -1) {
      history.splice(existingIndex, 1)
    }

    history.unshift(query)

    // Keep only recent searches
    if (history.length > 10) {
      history.splice(10)
    }
  }

  /**
   * Generate smart suggestions
   */
  const generateSuggestions = (data, query) => {
    const suggestions = new Set()
    const queryLower = query.toLowerCase()

    // Find similar terms from data
    data.forEach(item => {
      searchFields.forEach(field => {
        const fieldValue = getNestedValue(item, field)
        if (fieldValue && typeof fieldValue === 'string') {
          const words = fieldValue.toLowerCase().split(/\s+/)
          words.forEach(word => {
            if (word.startsWith(queryLower) && word !== queryLower) {
              suggestions.add(word)
            }
          })
        }
      })
    })

    // Add from search history
    searchHistory.value.forEach(historyItem => {
      if (historyItem.toLowerCase().startsWith(queryLower) && historyItem !== query) {
        suggestions.add(historyItem)
      }
    })

    searchSuggestions.value = Array.from(suggestions).slice(0, 5)
  }

  /**
   * Clear search
   */
  const clearSearch = () => {
    searchQuery.value = ''
    searchResults.value = []
    searchSuggestions.value = []
    clearTimeout(debounceTimer)
  }

  /**
   * Reset search state
   */
  const resetSearch = () => {
    clearSearch()
    searchHistory.value = []
    isSearching.value = false
  }

  /**
   * Advanced search with filters
   */
  const advancedSearch = (data, filters = {}) => {
    let results = data

    // Apply text search
    if (searchQuery.value) {
      results = performSearch(results, searchQuery.value)
    }

    // Apply additional filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        results = results.filter(item => {
          const itemValue = getNestedValue(item, key)

          if (Array.isArray(value)) {
            return value.includes(itemValue)
          } else if (
            typeof value === 'object' &&
            value.min !== undefined &&
            value.max !== undefined
          ) {
            return itemValue >= value.min && itemValue <= value.max
          } else {
            return itemValue === value
          }
        })
      }
    })

    return results
  }

  // Computed properties
  const hasResults = computed(() => searchResults.value.length > 0)
  const hasQuery = computed(() => searchQuery.value.length >= minSearchLength)
  const hasHistory = computed(() => searchHistory.value.length > 0)
  const hasSuggestions = computed(() => searchSuggestions.value.length > 0)

  return {
    // State
    searchQuery,
    searchResults,
    searchHistory,
    searchSuggestions,
    isSearching,

    // Computed
    hasResults,
    hasQuery,
    hasHistory,
    hasSuggestions,

    // Methods
    search,
    searchImmediate,
    clearSearch,
    resetSearch,
    advancedSearch,
    updateSearchHistory,

    // Utilities
    highlightText
  }
}

/**
 * Utility functions
 */

// Get nested object value
const getNestedValue = (obj, path) => {
  return path.split('.').reduce((current, key) => current && current[key], obj)
}

// Set nested object value
const setNestedValue = (obj, path, value) => {
  const keys = path.split('.')
  const lastKey = keys.pop()
  const target = keys.reduce((current, key) => {
    if (!current[key]) current[key] = {}
    return current[key]
  }, obj)
  target[lastKey] = value
}

// Escape regex special characters
const escapeRegExp = string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

// Simple fuzzy matching
const fuzzyMatch = (text, pattern) => {
  const patternLength = pattern.length
  const textLength = text.length

  if (patternLength > textLength) return false
  if (patternLength === textLength) return pattern === text

  let patternIndex = 0
  let textIndex = 0

  while (patternIndex < patternLength && textIndex < textLength) {
    if (pattern[patternIndex] === text[textIndex]) {
      patternIndex++
    }
    textIndex++
  }

  return patternIndex === patternLength
}

// Simple soundex algorithm for phonetic matching
const soundexMatch = (text, pattern) => {
  const soundex = str => {
    const code = str.toUpperCase().charAt(0)
    const phonetic = str
      .toUpperCase()
      .replace(/[AEIOUYHW]/g, '0')
      .replace(/[BFPV]/g, '1')
      .replace(/[CGJKQSXZ]/g, '2')
      .replace(/[DT]/g, '3')
      .replace(/[L]/g, '4')
      .replace(/[MN]/g, '5')
      .replace(/[R]/g, '6')
      .replace(/0+/g, '0')
      .replace(/(.)\1+/g, '$1')
      .replace(/0/g, '')

    return `${code + phonetic}000`.substring(0, 4)
  }

  return soundex(text) === soundex(pattern)
}

/**
 * Specialized search composables
 */

// Employee search
export const useEmployeeSearch = () => {
  return useSmartSearch({
    searchFields: ['name', 'employee_id', 'email', 'department', 'subject'],
    fuzzySearch: true,
    minSearchLength: 2,
    maxResults: 25
  })
}

// Global search across multiple entities
export const useGlobalSearch = () => {
  return useSmartSearch({
    searchFields: ['title', 'description', 'content', 'name'],
    fuzzySearch: true,
    minSearchLength: 1,
    maxResults: 10,
    smartSuggestions: true
  })
}

export default useSmartSearch
