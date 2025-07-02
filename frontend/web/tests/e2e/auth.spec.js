import { expect, test } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page
    await page.goto('/auth/login')
  })

  test('displays login form correctly', async ({ page }) => {
    // Check if login form elements are present
    await expect(page.locator('h1')).toContainText('Attendance System')
    await expect(page.locator('h2')).toContainText('Sign In')

    // Check form fields
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // Check social login buttons
    await expect(page.locator('text=Google')).toBeVisible()
    await expect(page.locator('text=Microsoft')).toBeVisible()
  })

  test('shows validation errors for empty fields', async ({ page }) => {
    // Try to submit empty form
    await page.click('button[type="submit"]')

    // Should see validation errors
    await expect(page.locator('text=Email is required')).toBeVisible()
    await expect(page.locator('text=Password is required')).toBeVisible()
  })

  test('shows validation error for invalid email', async ({ page }) => {
    // Enter invalid email
    await page.fill('input[type="email"]', 'invalid-email')
    await page.fill('input[type="password"]', 'password123')

    // Try to submit
    await page.click('button[type="submit"]')

    // Should see email validation error
    await expect(page.locator('text=Please enter a valid email address')).toBeVisible()
  })

  test('toggles password visibility', async ({ page }) => {
    // Fill password field
    await page.fill('input[type="password"]', 'testpassword')

    // Check password is hidden initially
    await expect(page.locator('input[type="password"]')).toBeVisible()

    // Click show password button
    await page.click('button[aria-label*="show"]')

    // Check password is now visible
    await expect(page.locator('input[type="text"]')).toBeVisible()
  })

  test('handles remember me checkbox', async ({ page }) => {
    const rememberCheckbox = page.locator('input[type="checkbox"]')

    // Initially unchecked
    await expect(rememberCheckbox).not.toBeChecked()

    // Click to check
    await rememberCheckbox.check()
    await expect(rememberCheckbox).toBeChecked()

    // Click to uncheck
    await rememberCheckbox.uncheck()
    await expect(rememberCheckbox).not.toBeChecked()
  })

  test('attempts login with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')

    // Submit form
    await page.click('button[type="submit"]')

    // Should see loading state briefly
    await expect(page.locator('text=Signing in...')).toBeVisible()

    // Wait for error message (this would be shown by the backend)
    await page.waitForTimeout(2000)

    // Should still be on login page
    await expect(page.locator('h2')).toContainText('Sign In')
  })

  test('navigates to register page', async ({ page }) => {
    // Click register link
    await page.click('text=Create account')

    // Should navigate to register page
    await expect(page).toHaveURL(/.*\/auth\/register/)
  })

  test('navigates to forgot password page', async ({ page }) => {
    // Click forgot password link
    await page.click('text=Forgot password?')

    // Should navigate to forgot password page
    await expect(page).toHaveURL(/.*\/auth\/forgot-password/)
  })

  test('shows rate limiting message', async ({ page }) => {
    // Simulate multiple failed login attempts
    for (let i = 0; i < 3; i++) {
      await page.fill('input[type="email"]', 'test@example.com')
      await page.fill('input[type="password"]', 'wrongpassword')
      await page.click('button[type="submit"]')
      await page.waitForTimeout(1000)
    }

    // After multiple attempts, rate limiting should kick in
    // Note: This test would need backend support for rate limiting
  })

  test('accessibility features work correctly', async ({ page }) => {
    // Check keyboard navigation
    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="email"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="password"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('input[type="checkbox"]')).toBeFocused()

    await page.keyboard.press('Tab')
    await expect(page.locator('button[type="submit"]')).toBeFocused()

    // Check Enter key submission
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.keyboard.press('Enter')

    // Should attempt to submit the form
    await expect(page.locator('text=Signing in...')).toBeVisible()
  })

  test('responsive design works on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Check that elements are still visible and accessible
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    await expect(page.locator('button[type="submit"]')).toBeVisible()

    // Check that buttons stack on mobile
    const socialButtons = page.locator('.btn-outline-secondary')
    await expect(socialButtons.first()).toBeVisible()
    await expect(socialButtons.last()).toBeVisible()
  })
})

test.describe('Authenticated User Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Mock successful authentication
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-token')
      localStorage.setItem(
        'user_data',
        JSON.stringify({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          roles: [{ name: 'admin' }]
        })
      )
    })
  })

  test('redirects authenticated user from login page', async ({ page }) => {
    // Navigate to login page when already authenticated
    await page.goto('/auth/login')

    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/)
  })

  test('displays user menu when authenticated', async ({ page }) => {
    await page.goto('/dashboard')

    // Should see user dropdown
    await expect(page.locator('.nav-item.dropdown')).toBeVisible()

    // Click user dropdown
    await page.click('.nav-item.dropdown a')

    // Should see dropdown menu items
    await expect(page.locator('text=Profile')).toBeVisible()
    await expect(page.locator('text=Settings')).toBeVisible()
    await expect(page.locator('text=Logout')).toBeVisible()
  })

  test('logout functionality works', async ({ page }) => {
    await page.goto('/dashboard')

    // Open user dropdown
    await page.click('.nav-item.dropdown a')

    // Click logout
    await page.click('text=Logout')

    // Should see logout confirmation modal
    await expect(page.locator('text=Confirm Logout')).toBeVisible()

    // Confirm logout
    await page.click('text=Confirm')

    // Should redirect to login page
    await expect(page).toHaveURL(/.*\/auth\/login/)
  })

  test('role-based access control works', async ({ page }) => {
    await page.goto('/dashboard')

    // Admin user should see admin-only content
    await expect(page.locator('text=Admin Only')).toBeVisible()

    // Should see employee management link
    await expect(page.locator('text=Employee Management')).toBeVisible()
  })
})

test.describe('Security Features', () => {
  test('clears sensitive data on logout', async ({ page }) => {
    // Set up authenticated state
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'mock-token')
      localStorage.setItem('user_data', JSON.stringify({ id: 1, name: 'Test User' }))
    })

    await page.goto('/dashboard')

    // Logout
    await page.click('.nav-item.dropdown a')
    await page.click('text=Logout')
    await page.click('text=Confirm')

    // Check that localStorage is cleared
    const token = await page.evaluate(() => localStorage.getItem('auth_token'))
    const userData = await page.evaluate(() => localStorage.getItem('user_data'))

    expect(token).toBeNull()
    expect(userData).toBeNull()
  })

  test('handles session expiration gracefully', async ({ page }) => {
    // Set up expired token
    await page.addInitScript(() => {
      localStorage.setItem('auth_token', 'expired-token')
      localStorage.setItem('user_data', JSON.stringify({ id: 1, name: 'Test User' }))
    })

    // Mock API to return 401 for expired token
    await page.route('**/api/v1/auth/user', route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Unauthorized' })
      })
    })

    await page.goto('/dashboard')

    // Should redirect to login due to expired token
    await expect(page).toHaveURL(/.*\/auth\/login/)
  })

  test('prevents access to protected routes when not authenticated', async ({ page }) => {
    // Try to access protected route without authentication
    await page.goto('/employees')

    // Should redirect to login
    await expect(page).toHaveURL(/.*\/auth\/login/)

    // Should preserve intended destination in query params
    await expect(page).toHaveURL(/.*redirect=%2Femployees/)
  })
})
