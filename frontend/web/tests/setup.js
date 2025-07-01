import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'
import { createPinia } from 'pinia'

// Mock global objects
global.CSS = {
  supports: () => false
}

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock URL.createObjectURL
Object.defineProperty(window.URL, 'createObjectURL', {
  writable: true,
  value: () => 'mock-url'
})

Object.defineProperty(window.URL, 'revokeObjectURL', {
  writable: true,
  value: () => {}
})

// Mock localStorage
const localStorageMock = {
  getItem: (key) => localStorageMock.store[key] || null,
  setItem: (key, value) => {
    localStorageMock.store[key] = value.toString()
  },
  removeItem: (key) => {
    delete localStorageMock.store[key]
  },
  clear: () => {
    localStorageMock.store = {}
  },
  store: {}
}

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Configure Vue Test Utils global plugins
config.global.plugins = [createPinia()]

// Mock router
const mockRouter = {
  push: () => Promise.resolve(),
  replace: () => Promise.resolve(),
  go: () => {},
  back: () => {},
  forward: () => {},
  currentRoute: {
    value: {
      fullPath: '/',
      path: '/',
      query: {},
      params: {},
      meta: {}
    }
  }
}

config.global.mocks = {
  $router: mockRouter,
  $route: mockRouter.currentRoute.value
}

// Mock Tabler Icons
config.global.stubs = {
  TablerIcon: {
    template: '<i class="tabler-icon" :data-name="name"></i>',
    props: ['name', 'size', 'class']
  }
}