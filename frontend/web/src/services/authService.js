/**
 * Authentication Service
 * Handles user authentication and authorization
 */

import { apiUtils } from './api.js'

export const authService = {
  // Login user
  async login(credentials) {
    const response = await apiUtils.post('/auth/login', credentials)
    return response.data
  },

  // Logout user
  async logout() {
    const response = await apiUtils.post('/auth/logout')
    return response.data
  },

  // Register new user
  async register(userData) {
    const response = await apiUtils.post('/auth/register', userData)
    return response.data
  },

  // Get current user
  async getCurrentUser() {
    const response = await apiUtils.get('/auth/user')
    return response.data
  },

  // Update profile
  async updateProfile(profileData) {
    const response = await apiUtils.put('/auth/profile', profileData)
    return response.data
  },

  // Change password
  async changePassword(passwords) {
    const response = await apiUtils.put('/auth/password', passwords)
    return response.data
  },

  // Refresh token
  async refreshToken() {
    const response = await apiUtils.post('/auth/refresh')
    return response.data
  },

  // Verify email
  async verifyEmail(token) {
    const response = await apiUtils.post('/auth/verify-email', { token })
    return response.data
  },

  // Reset password request
  async requestPasswordReset(email) {
    const response = await apiUtils.post('/auth/password/reset', { email })
    return response.data
  },

  // Reset password
  async resetPassword(resetData) {
    const response = await apiUtils.post('/auth/password/update', resetData)
    return response.data
  }
}

export default authService
