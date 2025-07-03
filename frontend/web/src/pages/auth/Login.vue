<template>
  <!-- Enhanced Tabler.io Login Page - Maximized Features -->
  <div class="page page-center">
    <div class="container container-tight py-4">
      <!-- Enhanced Brand Section -->
      <div class="text-center mb-4">
        <a href="." class="navbar-brand navbar-brand-autodark">
          <img
            src="/logo.svg"
            width="110"
            height="32"
            alt="Presensiari Attendance System"
            class="navbar-brand-image"
          />
        </a>
        <div class="text-muted mt-2">Presensiari Attendance Management</div>
      </div>

      <!-- Enhanced Card with Tabler Styling -->
      <div class="card card-md shadow-sm">
        <div class="card-body">
          <!-- Enhanced Header with Icon -->
          <div class="text-center mb-4">
            <div class="mb-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-lg text-primary"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                />
                <path d="M7 12h14l-3 -3m0 6l3 -3" />
              </svg>
            </div>
            <h2 class="h2 mb-1">Sign in to your account</h2>
            <p class="text-muted">Enter your credentials to access your dashboard</p>
          </div>

          <!-- Enhanced Success Message -->
          <div v-if="successMessage" class="alert alert-success alert-dismissible" role="alert">
            <div class="d-flex">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon alert-icon"
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
                  <path d="M5 12l5 5l10 -10" />
                </svg>
              </div>
              <div>
                <h4 class="alert-title">Success!</h4>
                <div class="text-muted">{{ successMessage }}</div>
              </div>
            </div>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="successMessage = ''"
            ></button>
          </div>

          <!-- Enhanced Error Message with Animation -->
          <div v-if="errorMessage" class="alert alert-danger alert-dismissible" role="alert">
            <div class="d-flex">
              <div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon alert-icon"
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
                  <path d="M10.29 3.86l1.42 1.42" />
                  <path d="M13.71 20.14l-1.42 -1.42" />
                  <path d="M9.17 9.17l-4.24 -4.24" />
                  <path d="M14.83 14.83l4.24 4.24" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              </div>
              <div>
                <h4 class="alert-title">Authentication Failed</h4>
                <div class="text-muted">{{ errorMessage }}</div>
              </div>
            </div>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              @click="errorMessage = ''"
            ></button>
          </div>

          <!-- Enhanced Login Form with Progressive Enhancement -->
          <form autocomplete="on" novalidate class="login-form" @submit.prevent="handleLogin">
            <!-- Email Field with Enhanced Styling -->
            <div class="mb-3">
              <label class="form-label required" for="email">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-sm me-1"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <polyline points="3,7 12,13 21,7" />
                </svg>
                Email address
              </label>
              <div class="input-group input-group-flat">
                <input
                  id="email"
                  ref="emailInput"
                  v-model="form.email"
                  type="email"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.email,
                    'is-valid': !errors.email && form.email && emailValid
                  }"
                  placeholder="your@email.com"
                  autocomplete="email"
                  :disabled="isLoading"
                  required
                  @blur="validateEmail"
                  @input="clearEmailError"
                />
                <span class="input-group-text">
                  <svg
                    v-if="emailValid && form.email"
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon text-success"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M5 12l5 5l10 -10" />
                  </svg>
                  <svg
                    v-else
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon text-muted"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <polyline points="3,7 12,13 21,7" />
                  </svg>
                </span>
              </div>
              <div v-if="errors.email" class="invalid-feedback d-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-sm me-1"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ errors.email }}
              </div>
              <div v-else-if="emailHint" class="form-hint text-muted">
                {{ emailHint }}
              </div>
            </div>

            <!-- Enhanced Password Field with Strength Indicator -->
            <div class="mb-2">
              <label class="form-label required" for="password">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-sm me-1"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <rect x="5" y="11" width="14" height="10" rx="2" />
                  <circle cx="12" cy="16" r="1" />
                  <path d="M8 11v-4a4 4 0 0 1 8 0v4" />
                </svg>
                Password
                <span class="form-label-description">
                  <a href="#" class="text-primary" @click.prevent="showForgotPassword = true">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon icon-sm me-1"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path
                        d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"
                      />
                      <path d="M3 7l9 6l9 -6" />
                    </svg>
                    Forgot password?
                  </a>
                </span>
              </label>
              <div class="input-group input-group-flat">
                <input
                  id="password"
                  ref="passwordInput"
                  v-model="form.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-control"
                  :class="{
                    'is-invalid': errors.password,
                    'is-valid': !errors.password && form.password && passwordValid
                  }"
                  placeholder="Enter your password"
                  autocomplete="current-password"
                  :disabled="isLoading"
                  required
                  @blur="validatePassword"
                  @input="clearPasswordError"
                />
                <span class="input-group-text">
                  <a
                    href="#"
                    class="link-secondary"
                    :title="showPassword ? 'Hide password' : 'Show password'"
                    @click.prevent="togglePasswordVisibility"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <path v-if="!showPassword" d="M10 12a2 2 0 1 0 4 0a2 2 0 0 0 -4 0" />
                      <path
                        v-if="!showPassword"
                        d="M21 12c-2.4 4 -5.4 6 -9 6c-3.6 0 -6.6 -2 -9 -6c2.4 -4 5.4 -6 9 -6c3.6 0 6.6 2 9 6"
                      />
                      <path v-if="showPassword" d="M10.585 10.585a2 2 0 0 0 2.829 2.829" />
                      <path
                        v-if="showPassword"
                        d="M16.681 16.673a8.717 8.717 0 0 1 -4.681 1.327c-3.6 0 -6.6 -2 -9 -6c1.272 -2.12 2.712 -3.678 4.32 -4.674m2.86 -1.146a9.055 9.055 0 0 1 1.82 -.18c3.6 0 6.6 2 9 6c-.666 1.11 -1.379 2.067 -2.138 2.87"
                      />
                      <path v-if="showPassword" d="M3 3l18 18" />
                    </svg>
                  </a>
                </span>
              </div>
              <div v-if="errors.password" class="invalid-feedback d-block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon icon-sm me-1"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <circle cx="12" cy="12" r="9" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {{ errors.password }}
              </div>
              <div v-else-if="passwordHint" class="form-hint text-muted">
                {{ passwordHint }}
              </div>
            </div>

            <!-- Enhanced Remember Me with Better Styling -->
            <div class="mb-3">
              <label class="form-check form-switch">
                <input
                  v-model="form.remember"
                  type="checkbox"
                  class="form-check-input"
                  :disabled="isLoading"
                />
                <span class="form-check-label">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-sm me-1"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                    stroke="currentColor"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M9 7m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
                    <path d="M3 7h6m-6 10h6" />
                    <path d="M21 11a1 1 0 0 1 -1 1h-6l3 -3m0 6l-3 -3" />
                  </svg>
                  Keep me signed in
                  <small class="text-muted d-block">You'll stay logged in for 30 days</small>
                </span>
              </label>
            </div>

            <!-- Enhanced Rate Limit Warning with Countdown -->
            <div
              v-if="rateLimitMessage"
              class="alert alert-warning alert-dismissible mb-3"
              role="alert"
            >
              <div class="d-flex">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon alert-icon"
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
                    <polyline points="12,7 12,12 16,16" />
                  </svg>
                </div>
                <div>
                  <h4 class="alert-title">Rate Limit Exceeded</h4>
                  <div class="text-muted">{{ rateLimitMessage }}</div>
                  <div v-if="remainingTime > 0" class="progress progress-sm mt-2">
                    <div
                      class="progress-bar bg-warning"
                      :style="{ width: progressPercent + '%' }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Submit Button with Better States -->
            <div class="form-footer">
              <button
                type="submit"
                class="btn btn-primary w-100 btn-lg"
                :disabled="isLoading || remainingTime > 0 || !formValid"
              >
                <span
                  v-if="isLoading"
                  class="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                <svg
                  v-else-if="remainingTime > 0"
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon me-2"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <circle cx="12" cy="12" r="9" />
                  <polyline points="12,7 12,12 16,16" />
                </svg>
                <svg
                  v-else
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon me-2"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                  />
                  <path d="M7 12h14l-3 -3m0 6l3 -3" />
                </svg>
                <span v-if="remainingTime > 0"> Wait {{ remainingTime }}s </span>
                <span v-else-if="isLoading"> Authenticating... </span>
                <span v-else> Sign In </span>
              </button>

              <!-- Additional Help Links -->
              <div class="text-center mt-3">
                <div class="row">
                  <div class="col">
                    <a
                      href="#"
                      class="btn btn-ghost-secondary btn-sm"
                      @click.prevent="showForgotPassword = true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-sm me-1"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 8a4 4 0 0 1 4 4" />
                      </svg>
                      Need Help?
                    </a>
                  </div>
                  <div class="col">
                    <a
                      href="#"
                      class="btn btn-ghost-secondary btn-sm"
                      @click.prevent="showLoginDemo = true"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-sm me-1"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <circle cx="12" cy="12" r="9" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                      </svg>
                      Demo Account
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <!-- Enhanced Divider -->
        <div class="hr-text hr-text-center hr-text-spacious">
          <span class="hr-text-content">Alternative Sign In</span>
        </div>

        <!-- Enhanced Social Login Options -->
        <div class="card-body pt-2">
          <div class="row g-2">
            <div class="col-12 col-md-6">
              <button type="button" class="btn btn-outline-dark w-100" disabled title="Coming Soon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon me-2"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.2 5.5 -5.5c0 -1.2 -.4 -2.3 -1.1 -3.1c.1 -.6 .1 -1.2 -.1 -1.8c0 0 -1.1 -.4 -3.5 1.3c-2.1 -.6 -4.3 -.6 -6.4 0c-2.4 -1.7 -3.5 -1.3 -3.5 -1.3c-.2 .6 -.2 1.2 -.1 1.8c-.7 .8 -1.1 1.9 -1.1 3.1c0 4.3 2.7 5.2 5.5 5.5c-.6 .6 -.6 1 -.5 2v3.5"
                  />
                </svg>
                GitHub
                <span class="badge bg-secondary ms-auto">Soon</span>
              </button>
            </div>
            <div class="col-12 col-md-6">
              <button
                type="button"
                class="btn btn-outline-primary w-100"
                disabled
                title="Coming Soon"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="icon me-2"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  fill="none"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <path
                    d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
                  />
                </svg>
                Google
                <span class="badge bg-secondary ms-auto">Soon</span>
              </button>
            </div>
          </div>

          <!-- QR Code Option -->
          <div class="text-center mt-3">
            <button
              type="button"
              class="btn btn-ghost-secondary btn-sm"
              @click="showQRLogin = true"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon icon-sm me-1"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                stroke-width="2"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <line x1="7" y1="17" x2="7" y2="17.01" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <line x1="7" y1="7" x2="7" y2="7.01" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <line x1="17" y1="7" x2="17" y2="7.01" />
                <line x1="14" y1="14" x2="17" y2="14" />
                <line x1="20" y1="14" x2="20" y2="14.01" />
                <line x1="14" y1="14" x2="14" y2="17" />
                <line x1="14" y1="20" x2="17" y2="20" />
                <line x1="17" y1="17" x2="20" y2="17" />
                <line x1="20" y1="17" x2="20" y2="20" />
              </svg>
              Sign in with QR Code
            </button>
          </div>
        </div>
      </div>

      <div class="text-center text-muted mt-3">
        Don't have account yet? <router-link to="/auth/register">Sign up</router-link>
      </div>

      <!-- Enhanced Forgot Password Modal -->
      <div
        v-if="showForgotPassword"
        class="modal modal-blur fade show"
        style="display: block"
        tabindex="-1"
      >
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content">
            <button type="button" class="btn-close" @click="showForgotPassword = false"></button>
            <div class="modal-status bg-primary"></div>
            <div class="modal-body text-center py-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon mb-2 text-primary icon-lg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M3 7a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v10a2 2 0 0 1 -2 2h-14a2 2 0 0 1 -2 -2v-10z"
                />
                <path d="M3 7l9 6l9 -6" />
              </svg>
              <h3>Reset Your Password</h3>
              <div class="text-muted">
                Enter your email address and we'll send you a secure link to reset your password.
              </div>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label class="form-label">Email address</label>
                <div class="input-group input-group-flat">
                  <input
                    v-model="resetEmail"
                    type="email"
                    class="form-control"
                    placeholder="your@email.com"
                    autocomplete="email"
                    :disabled="isResetLoading"
                  />
                  <span class="input-group-text">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon text-muted"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                      stroke="currentColor"
                      fill="none"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                      <rect x="3" y="5" width="18" height="14" rx="2" />
                      <polyline points="3,7 12,13 21,7" />
                    </svg>
                  </span>
                </div>
                <div class="form-hint">We'll send reset instructions to this email</div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="w-100">
                <div class="row">
                  <div class="col">
                    <button
                      type="button"
                      class="btn w-100"
                      :disabled="isResetLoading"
                      @click="showForgotPassword = false"
                    >
                      Cancel
                    </button>
                  </div>
                  <div class="col">
                    <button
                      type="button"
                      class="btn btn-primary w-100"
                      :disabled="isResetLoading || !resetEmail"
                      @click="handlePasswordReset"
                    >
                      <span
                        v-if="isResetLoading"
                        class="spinner-border spinner-border-sm me-2"
                      ></span>
                      <svg
                        v-else
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon me-2"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                        <path
                          d="M21 3l-6.5 18a.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a.55 .55 0 0 1 0 -1l18 -6.5"
                        />
                      </svg>
                      Send Reset Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Demo Login Modal -->
      <div
        v-if="showLoginDemo"
        class="modal modal-blur fade show"
        style="display: block"
        tabindex="-1"
      >
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content">
            <button type="button" class="btn-close" @click="showLoginDemo = false"></button>
            <div class="modal-status bg-success"></div>
            <div class="modal-body text-center py-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon mb-2 text-success icon-lg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 3a3 3 0 0 0 -3 3v12a3 3 0 0 0 3 3" />
                <path d="M6 3a3 3 0 0 1 3 3v12a3 3 0 0 1 -3 3" />
                <path d="M13 7h7a1 1 0 0 1 1 1v8a1 1 0 0 1 -1 1h-7" />
                <path d="M5 7h-.5a2.5 2.5 0 0 0 0 5h.5" />
                <path d="M12 12l0 .01" />
                <path d="M18 12l0 .01" />
                <path d="M15 12l0 .01" />
              </svg>
              <h3>Demo Account</h3>
              <div class="text-muted mb-3">Try our system with pre-configured demo credentials</div>

              <div class="card">
                <div class="card-body">
                  <div class="row">
                    <div class="col-12 mb-2">
                      <strong>Email:</strong> <code>superadmin@school.edu</code>
                    </div>
                    <div class="col-12 mb-2">
                      <strong>Password:</strong> <code>password123</code>
                    </div>
                    <div class="col-12">
                      <strong>Role:</strong>
                      <span class="badge bg-primary">Super Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="w-100">
                <div class="row">
                  <div class="col">
                    <button type="button" class="btn w-100" @click="showLoginDemo = false">
                      Cancel
                    </button>
                  </div>
                  <div class="col">
                    <button
                      type="button"
                      class="btn btn-success w-100"
                      @click="fillDemoCredentials"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon me-2"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <polyline points="20,6 9,17 4,12" />
                      </svg>
                      Use Demo
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- QR Code Login Modal -->
      <div
        v-if="showQRLogin"
        class="modal modal-blur fade show"
        style="display: block"
        tabindex="-1"
      >
        <div class="modal-dialog modal-sm modal-dialog-centered">
          <div class="modal-content">
            <button type="button" class="btn-close" @click="showQRLogin = false"></button>
            <div class="modal-status bg-info"></div>
            <div class="modal-body text-center py-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon mb-2 text-info icon-lg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <rect x="4" y="4" width="6" height="6" rx="1" />
                <line x1="7" y1="17" x2="7" y2="17.01" />
                <rect x="14" y="4" width="6" height="6" rx="1" />
                <line x1="7" y1="7" x2="7" y2="7.01" />
                <rect x="4" y="14" width="6" height="6" rx="1" />
                <line x1="17" y1="7" x2="17" y2="7.01" />
                <line x1="14" y1="14" x2="17" y2="14" />
                <line x1="20" y1="14" x2="20" y2="14.01" />
                <line x1="14" y1="14" x2="14" y2="17" />
                <line x1="14" y1="20" x2="17" y2="20" />
                <line x1="17" y1="17" x2="20" y2="17" />
                <line x1="20" y1="17" x2="20" y2="20" />
              </svg>
              <h3>QR Code Login</h3>
              <div class="text-muted mb-3">Scan the QR code with your mobile device to sign in</div>

              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-center mb-3">
                    <div
                      class="bg-light p-3 rounded"
                      style="
                        width: 150px;
                        height: 150px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon icon-lg text-muted"
                        width="64"
                        height="64"
                        viewBox="0 0 24 24"
                        stroke-width="1"
                        stroke="currentColor"
                        fill="none"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <rect x="4" y="4" width="6" height="6" rx="1" />
                        <line x1="7" y1="17" x2="7" y2="17.01" />
                        <rect x="14" y="4" width="6" height="6" rx="1" />
                        <line x1="7" y1="7" x2="7" y2="7.01" />
                        <rect x="4" y="14" width="6" height="6" rx="1" />
                        <line x1="17" y1="7" x2="17" y2="7.01" />
                        <line x1="14" y1="14" x2="17" y2="14" />
                        <line x1="20" y1="14" x2="20" y2="14.01" />
                        <line x1="14" y1="14" x2="14" y2="17" />
                        <line x1="14" y1="20" x2="17" y2="20" />
                        <line x1="17" y1="17" x2="20" y2="17" />
                        <line x1="20" y1="17" x2="20" y2="20" />
                      </svg>
                    </div>
                  </div>
                  <div class="text-muted small">
                    <div class="d-flex align-items-center justify-content-center">
                      <div class="spinner-border spinner-border-sm me-2" role="status"></div>
                      Generating QR code...
                    </div>
                  </div>
                </div>
              </div>

              <div class="alert alert-info mt-3">
                <div class="d-flex">
                  <div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon alert-icon"
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
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                  </div>
                  <div>
                    <small
                      >QR code login is coming soon! For now, please use the standard email and
                      password login.</small
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <div class="w-100">
                <button type="button" class="btn btn-secondary w-100" @click="showQRLogin = false">
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Enhanced Modal Backdrops -->
      <div
        v-if="showForgotPassword"
        class="modal-backdrop fade show"
        @click="showForgotPassword = false"
      ></div>
      <div
        v-if="showLoginDemo"
        class="modal-backdrop fade show"
        @click="showLoginDemo = false"
      ></div>
      <div v-if="showQRLogin" class="modal-backdrop fade show" @click="showQRLogin = false"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Enhanced Form Data
const form = ref({
  email: 'superadmin@school.edu',
  password: 'password123',
  remember: false
})

// Enhanced State Management
const isLoading = ref(false)
const errors = ref({})
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showForgotPassword = ref(false)
const showLoginDemo = ref(false)
const showQRLogin = ref(false)
const remainingTime = ref(0)
const countdownInterval = ref(null)
const initialRemainingTime = ref(0)

// Form validation states
const emailValid = ref(false)
const passwordValid = ref(false)
const emailHint = ref('')
const passwordHint = ref('')

// Component refs
const emailInput = ref(null)
const passwordInput = ref(null)

// Reset password state
const resetEmail = ref('')
const isResetLoading = ref(false)

// Enhanced Rate Limiting
const rateLimitMessage = computed(() => {
  if (remainingTime.value > 0) {
    return `Too many login attempts. Please wait ${remainingTime.value} seconds before trying again.`
  }
  return ''
})

// Progress for rate limiting
const progressPercent = computed(() => {
  if (initialRemainingTime.value === 0) return 0
  return ((initialRemainingTime.value - remainingTime.value) / initialRemainingTime.value) * 100
})

// Form validation
const formValid = computed(() => {
  return emailValid.value && passwordValid.value && form.value.email && form.value.password
})

// Enhanced Validation Methods
const validateEmail = () => {
  const email = form.value.email.trim()

  if (!email) {
    errors.value.email = 'Email address is required'
    emailValid.value = false
    emailHint.value = ''
    return false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    errors.value.email = 'Please enter a valid email address'
    emailValid.value = false
    emailHint.value = 'Example: user@example.com'
    return false
  }

  // Additional email domain validation
  const commonDomains = ['gmail.com', 'yahoo.com', 'outlook.com', 'school.edu', 'company.com']
  const domain = email.split('@')[1]

  delete errors.value.email
  emailValid.value = true

  if (commonDomains.includes(domain)) {
    emailHint.value = `✓ Valid ${domain} email address`
  } else {
    emailHint.value = '✓ Email format is valid'
  }

  return true
}

const validatePassword = () => {
  const password = form.value.password

  if (!password) {
    errors.value.password = 'Password is required'
    passwordValid.value = false
    passwordHint.value = ''
    return false
  }

  if (password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters long'
    passwordValid.value = false
    passwordHint.value = `${password.length}/6 characters minimum`
    return false
  }

  delete errors.value.password
  passwordValid.value = true
  passwordHint.value = '✓ Password meets requirements'

  return true
}

const validateForm = () => {
  const emailIsValid = validateEmail()
  const passwordIsValid = validatePassword()

  return emailIsValid && passwordIsValid
}

// Clear error methods
const clearEmailError = () => {
  if (errors.value.email) {
    delete errors.value.email
    emailHint.value = ''
  }
}

const clearPasswordError = () => {
  if (errors.value.password) {
    delete errors.value.password
    passwordHint.value = ''
  }
}

// Enhanced password visibility toggle
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value

  // Maintain focus on password input
  if (passwordInput.value) {
    passwordInput.value.focus()
  }
}

const handleLogin = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''

  if (!validateForm()) {
    // Focus on first invalid field
    if (errors.value.email && emailInput.value) {
      emailInput.value.focus()
    } else if (errors.value.password && passwordInput.value) {
      passwordInput.value.focus()
    }
    return
  }

  // Check if still in rate limit period
  if (remainingTime.value > 0) {
    return
  }

  isLoading.value = true

  try {
    const result = await authStore.login(form.value)

    if (result.success) {
      // Show success message briefly
      successMessage.value = 'Login successful! Redirecting to dashboard...'

      // Small delay to show success message
      setTimeout(() => {
        const redirect = router.currentRoute.value.query.redirect || '/'
        router.push(redirect)
      }, 1000)
    } else {
      errorMessage.value =
        result.message || 'Authentication failed. Please check your credentials and try again.'

      // Handle rate limiting
      if (result.rateLimited && result.remainingTime) {
        remainingTime.value = result.remainingTime
        initialRemainingTime.value = result.remainingTime
        startCountdown()
      }

      // Clear form password on failed login after multiple attempts
      if (result.attempts >= 3) {
        form.value.password = ''
        passwordValid.value = false
        passwordHint.value = ''

        // Focus back to password field
        setTimeout(() => {
          if (passwordInput.value) {
            passwordInput.value.focus()
          }
        }, 100)
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Network error occurred. Please check your connection and try again.'
  } finally {
    isLoading.value = false
  }
}

const startCountdown = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }

  countdownInterval.value = setInterval(() => {
    remainingTime.value -= 1
    if (remainingTime.value <= 0) {
      clearInterval(countdownInterval.value)
      countdownInterval.value = null
      initialRemainingTime.value = 0
    }
  }, 1000)
}

// Demo and help methods
const fillDemoCredentials = () => {
  form.value.email = 'superadmin@school.edu'
  form.value.password = 'password123'
  form.value.remember = true

  // Validate the demo credentials
  validateEmail()
  validatePassword()

  // Close modal
  showLoginDemo.value = false

  successMessage.value = 'Demo credentials filled! You can now sign in.'

  // Clear success message after a few seconds
  setTimeout(() => {
    successMessage.value = ''
  }, 3000)

  // Focus on login button since form is now valid
  setTimeout(() => {
    const loginButton = document.querySelector('button[type="submit"]')
    if (loginButton) {
      loginButton.focus()
    }
  }, 100)
}

// Password reset handler
const handlePasswordReset = async () => {
  if (!resetEmail.value) {
    return
  }

  isResetLoading.value = true

  try {
    // Simulate API call for demo
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Show success message
    successMessage.value = `Password reset instructions sent to ${resetEmail.value}`

    // Close modal
    showForgotPassword.value = false
    resetEmail.value = ''

    // Clear success message after some time
    setTimeout(() => {
      successMessage.value = ''
    }, 5000)
  } catch (error) {
    errorMessage.value = 'Failed to send reset email. Please try again.'
  } finally {
    isResetLoading.value = false
  }
}

// Check for existing rate limit on mount
const checkRateLimit = () => {
  const canLoginAgain = authStore.canLoginAgain
  if (canLoginAgain > Date.now()) {
    remainingTime.value = Math.max(0, Math.ceil((canLoginAgain - Date.now()) / 1000))
    if (remainingTime.value > 0) {
      startCountdown()
    }
  }
}

// Enhanced lifecycle
onMounted(() => {
  checkRateLimit()

  // Clear any previous auth state
  errorMessage.value = ''
  successMessage.value = ''

  // Validate existing form values
  if (form.value.email) {
    validateEmail()
  }
  if (form.value.password) {
    validatePassword()
  }

  // Focus email input with slight delay for better UX
  setTimeout(() => {
    if (emailInput.value) {
      emailInput.value.focus()
    }
  }, 100)

  // Check for demo mode in URL
  const urlParams = new URLSearchParams(window.location.search)
  if (urlParams.get('demo') === 'true') {
    showLoginDemo.value = true
  }

  // Pre-fill reset email with current form email if available
  if (form.value.email) {
    resetEmail.value = form.value.email
  }
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})

// Watch for form changes to provide real-time validation
watch(
  () => form.value.email,
  () => {
    if (form.value.email && errors.value.email) {
      clearEmailError()
    }
  }
)

watch(
  () => form.value.password,
  () => {
    if (form.value.password && errors.value.password) {
      clearPasswordError()
    }
  }
)
</script>

<style scoped>
/* Exact Tabler.io Login Page Styling */
.page-center {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--tblr-bg-surface-secondary);
}

.container-tight {
  max-width: 25rem;
}

.card-md {
  max-width: 25rem;
}

.navbar-brand-image {
  height: 2rem;
  width: auto;
}

.form-footer {
  margin-top: 2rem;
}

.hr-text {
  position: relative;
  height: 1px;
  background: var(--tblr-border-color);
  margin: 2rem 0;
  text-align: center;
}

.hr-text::before {
  content: 'or';
  position: absolute;
  top: -0.5rem;
  left: 50%;
  transform: translateX(-50%);
  background: var(--tblr-bg-surface);
  padding: 0 1rem;
  color: var(--tblr-text-muted);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.alert-icon {
  margin-right: 0.5rem;
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.text-github {
  color: #333 !important;
}

.text-twitter {
  color: #1da1f2 !important;
}

.form-label-description {
  float: right;
  font-weight: 400;
}

.input-group-flat .form-control {
  border-right: 0;
}

.input-group-flat .input-group-text {
  background: transparent;
  border-left: 0;
}

/* Modal styling */
.modal-backdrop {
  background-color: rgba(var(--tblr-body-color-rgb), 0.32);
}

.modal-status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--tblr-danger);
  border-radius: var(--tblr-border-radius) var(--tblr-border-radius) 0 0;
}

.icon-lg {
  width: 3rem;
  height: 3rem;
}

/* Button states */
.btn:disabled {
  opacity: 0.65;
  pointer-events: none;
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .container-tight {
    padding-left: 1rem;
    padding-right: 1rem;
  }
}

/* Focus styles */
.form-control:focus {
  border-color: var(--tblr-primary);
  box-shadow: 0 0 0 0.25rem rgba(var(--tblr-primary-rgb), 0.25);
}

/* Dark mode support */
[data-bs-theme='dark'] .page-center {
  background: var(--tblr-dark);
}

[data-bs-theme='dark'] .hr-text::before {
  background: var(--tblr-dark);
}

/* Enhanced Dark Mode Support */
[data-bs-theme='dark'] .page-center {
  background: linear-gradient(135deg, var(--tblr-dark) 0%, #0f172a 100%);
}

[data-bs-theme='dark'] .page-center::before {
  background-image:
    radial-gradient(circle at 25% 25%, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(16, 185, 129, 0.15) 0%, transparent 50%);
}

[data-bs-theme='dark'] .hr-text-content {
  background: var(--tblr-dark);
}

[data-bs-theme='dark'] .modal-content {
  background: var(--tblr-dark);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
}

/* Enhanced Form Styling */
.login-form {
  position: relative;
}

.form-label.required::after {
  content: '*';
  color: var(--tblr-danger);
  margin-left: 0.25rem;
}

.input-group-flat .form-control {
  border-right: 0;
  transition: all 0.2s ease-in-out;
}

.input-group-flat .form-control:focus {
  box-shadow: none;
  border-color: var(--tblr-primary);
}

.input-group-flat .form-control:focus + .input-group-text {
  border-color: var(--tblr-primary);
  background: rgba(var(--tblr-primary-rgb), 0.05);
}

.input-group-flat .input-group-text {
  background: transparent;
  border-left: 0;
  transition: all 0.2s ease-in-out;
}

.form-hint {
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: var(--tblr-text-muted);
}

/* Enhanced Alert Styling */
.alert {
  border: none;
  border-radius: var(--tblr-border-radius-lg);
  padding: 1rem;
}

.alert-dismissible .btn-close {
  padding: 0.5rem;
  margin: -0.5rem -0.5rem -0.5rem auto;
}

/* Progress Bar in Alert */
.progress-sm {
  height: 0.25rem;
}

/* Modal Enhancements */
.modal-content {
  border: none;
  border-radius: var(--tblr-border-radius-xl);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-status {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  border-radius: var(--tblr-border-radius-xl) var(--tblr-border-radius-xl) 0 0;
}

/* Animation for form validation states */
.form-control.is-valid,
.form-control.is-invalid {
  animation: inputValidation 0.3s ease-in-out;
}

@keyframes inputValidation {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
  100% {
    transform: scale(1);
  }
}

/* Enhanced Button States */
.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  border-radius: var(--tblr-border-radius-lg);
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}

.btn-primary:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(var(--tblr-primary-rgb), 0.3);
}

.btn-ghost-secondary {
  color: var(--tblr-secondary);
  background: transparent;
  border: 1px solid transparent;
}

.btn-ghost-secondary:hover {
  background: rgba(var(--tblr-secondary-rgb), 0.1);
  border-color: var(--tblr-secondary);
}

/* High Contrast Mode */
@media (prefers-contrast: high) {
  .card-md {
    border: 2px solid var(--tblr-border-color);
  }

  .form-control {
    border-width: 2px;
  }

  .btn {
    border-width: 2px;
    font-weight: 600;
  }
}

/* Reduced Motion */
@media (prefers-reduced-motion: reduce) {
  .page-center::before {
    animation: none;
  }

  .btn {
    transition: none;
  }

  .form-control {
    transition: none;
  }
}
</style>
