/**
 * Session Persistence Testing Utility
 * Test and verify that authentication state persists across page reloads
 */

import { useAuthStore } from '@/stores/auth'

export class SessionPersistenceTest {
  constructor() {
    this.testResults = []
    this.authStore = null
  }

  async runTests() {
    console.log('🧪 Running Session Persistence Tests...')
    this.authStore = useAuthStore()

    // Test 1: Token Storage and Retrieval
    await this.testTokenPersistence()

    // Test 2: User Data Storage and Retrieval
    await this.testUserDataPersistence()

    // Test 3: Auth State Initialization
    await this.testAuthStateInitialization()

    // Test 4: Router Guard Behavior
    await this.testRouterGuardBehavior()

    // Test 5: Token Validation on Reload
    await this.testTokenValidationOnReload()

    this.printResults()
    return this.testResults
  }

  async testTokenPersistence() {
    try {
      console.log('🔑 Testing token persistence...')

      // Simulate token storage
      const testToken = 'test-token-123'
      localStorage.setItem('auth_token', testToken)

      // Restore auth state
      this.authStore.restoreAuth()

      const isTokenRestored = this.authStore.token === testToken

      this.addTestResult(
        'Token Persistence',
        isTokenRestored,
        isTokenRestored
          ? 'Token successfully restored from localStorage'
          : 'Token restoration failed'
      )

      // Cleanup
      localStorage.removeItem('auth_token')
      this.authStore.token = null
    } catch (error) {
      this.addTestResult('Token Persistence', false, `Error: ${error.message}`)
    }
  }

  async testUserDataPersistence() {
    try {
      console.log('👤 Testing user data persistence...')

      // Simulate user data storage
      const testUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        roles: ['employee']
      }
      localStorage.setItem('user_data', JSON.stringify(testUser))

      // Restore auth state
      this.authStore.restoreAuth()

      const isUserRestored =
        this.authStore.user &&
        this.authStore.user.name === testUser.name &&
        this.authStore.user.email === testUser.email

      this.addTestResult(
        'User Data Persistence',
        isUserRestored,
        isUserRestored
          ? 'User data successfully restored from localStorage'
          : 'User data restoration failed'
      )

      // Cleanup
      localStorage.removeItem('user_data')
      this.authStore.user = null
    } catch (error) {
      this.addTestResult('User Data Persistence', false, `Error: ${error.message}`)
    }
  }

  async testAuthStateInitialization() {
    try {
      console.log('🚀 Testing auth state initialization...')

      // Reset initialization state
      this.authStore.initialized = false

      // Simulate stored auth data
      const testToken = 'test-token-456'
      const testUser = { id: 2, name: 'Init Test User', email: 'init@example.com' }
      localStorage.setItem('auth_token', testToken)
      localStorage.setItem('user_data', JSON.stringify(testUser))

      // Test initialization
      const _initResult = await this.authStore.initAuth()

      const isInitialized = this.authStore.initialized
      const hasToken = this.authStore.token === testToken

      this.addTestResult(
        'Auth State Initialization',
        isInitialized && hasToken,
        `Initialized: ${isInitialized}, Token restored: ${hasToken}`
      )

      // Cleanup
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
      this.authStore.clearAuth()
    } catch (error) {
      this.addTestResult('Auth State Initialization', false, `Error: ${error.message}`)
    }
  }

  async testRouterGuardBehavior() {
    try {
      console.log('🛡️ Testing router guard behavior...')

      // Test authenticated state
      this.authStore.user = { id: 3, name: 'Guard Test User' }
      this.authStore.token = 'guard-test-token'
      this.authStore.initialized = true

      const isAuthenticated = this.authStore.isAuthenticated

      // Test unauthenticated state
      this.authStore.clearAuth()
      const isUnauthenticated = !this.authStore.isAuthenticated

      this.addTestResult(
        'Router Guard Behavior',
        isAuthenticated && isUnauthenticated,
        `Authenticated check: ${isAuthenticated}, Unauthenticated check: ${isUnauthenticated}`
      )
    } catch (error) {
      this.addTestResult('Router Guard Behavior', false, `Error: ${error.message}`)
    }
  }

  async testTokenValidationOnReload() {
    try {
      console.log('✅ Testing token validation on reload...')

      // Simulate page reload scenario
      const testToken = 'validation-test-token'
      localStorage.setItem('auth_token', testToken)
      this.authStore.restoreAuth()

      // Check if auth header is set
      const authHeaderSet = this.authStore.token === testToken

      if (authHeaderSet) {
        this.authStore.setAuthHeader()
      }

      // Check axios header
      const axiosHeaderSet =
        axios.defaults.headers.common['Authorization'] === `Bearer ${testToken}`

      this.addTestResult(
        'Token Validation on Reload',
        authHeaderSet && axiosHeaderSet,
        `Token restored: ${authHeaderSet}, Axios header set: ${axiosHeaderSet}`
      )

      // Cleanup
      localStorage.removeItem('auth_token')
      this.authStore.clearAuth()
    } catch (error) {
      this.addTestResult('Token Validation on Reload', false, `Error: ${error.message}`)
    }
  }

  addTestResult(testName, passed, message) {
    const result = {
      test: testName,
      passed,
      message,
      timestamp: new Date().toISOString()
    }
    this.testResults.push(result)

    const emoji = passed ? '✅' : '❌'
    console.log(`${emoji} ${testName}: ${message}`)
  }

  printResults() {
    console.log('\n📊 Session Persistence Test Results:')
    console.log('=====================================')

    const passedTests = this.testResults.filter(r => r.passed).length
    const totalTests = this.testResults.length

    console.log(`Passed: ${passedTests}/${totalTests}`)
    console.log(`Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`)

    console.log('\nDetailed Results:')
    this.testResults.forEach(result => {
      const emoji = result.passed ? '✅' : '❌'
      console.log(`${emoji} ${result.test}: ${result.message}`)
    })

    if (passedTests === totalTests) {
      console.log('\n🎉 All session persistence tests passed!')
      console.log('✅ Session state should persist across page reloads')
    } else {
      console.log('\n⚠️ Some tests failed. Please review the implementation.')
    }

    console.log('=====================================\n')
  }

  // Utility method to simulate page reload
  simulatePageReload() {
    console.log('🔄 Simulating page reload...')

    // Save current state
    const currentToken = this.authStore.token
    const currentUser = this.authStore.user

    if (currentToken) {
      localStorage.setItem('auth_token', currentToken)
    }
    if (currentUser) {
      localStorage.setItem('user_data', JSON.stringify(currentUser))
    }

    // Clear current state (simulating page reload)
    this.authStore.user = null
    this.authStore.token = null
    this.authStore.initialized = false

    // Restore state (simulating app initialization)
    this.authStore.restoreAuth()
    if (this.authStore.token) {
      this.authStore.setAuthHeader()
    }

    console.log('🔄 Page reload simulation complete')
    return {
      tokenRestored: !!this.authStore.token,
      userRestored: !!this.authStore.user,
      isAuthenticated: this.authStore.isAuthenticated
    }
  }
}

// Export singleton instance
export const sessionPersistenceTest = new SessionPersistenceTest()

// Development helper
if (process.env.NODE_ENV === 'development') {
  window.sessionPersistenceTest = sessionPersistenceTest
}

export default sessionPersistenceTest
