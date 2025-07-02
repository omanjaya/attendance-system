<template>
  <!-- Exact Tabler.io Header Structure from https://preview.tabler.io/ -->
  <!-- Top Navigation Header -->
  <header class="navbar navbar-expand-md navbar-light d-print-none">
    <div class="container-xl">
      <!-- Brand/Logo -->
      <h1 class="navbar-brand navbar-brand-autodark d-none-navbar-horizontal pe-0 pe-md-3">
        <router-link to="/">
          <img
            src="/logo.svg"
            width="110"
            height="32"
            alt="Attendance System"
            class="navbar-brand-image"
          />
        </router-link>
      </h1>

      <!-- Right side navigation items -->
      <div class="navbar-nav flex-row order-md-last">
        <!-- Search -->
        <div class="nav-item d-none d-md-flex me-3">
          <div class="btn-list">
            <a href="#" class="btn" aria-label="Search" @click.prevent="showSearchModal = true">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
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
                <circle cx="10" cy="10" r="7" />
                <path d="M21 21l-6-6" />
              </svg>
            </a>
          </div>
        </div>

        <!-- Dark Mode Toggle -->
        <div class="nav-item d-none d-md-flex me-3">
          <div class="btn-list">
            <a
              href="#"
              class="nav-link px-0 hide-theme-dark"
              title="Enable dark mode"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              @click.prevent="toggleDarkMode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
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
                <path
                  d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"
                />
              </svg>
            </a>
            <a
              href="#"
              class="nav-link px-0 hide-theme-light"
              title="Enable light mode"
              data-bs-toggle="tooltip"
              data-bs-placement="bottom"
              @click.prevent="toggleDarkMode"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon"
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
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Notifications -->
        <div class="nav-item d-none d-md-flex me-3">
          <NotificationCenter />
        </div>

        <!-- User Dropdown -->
        <div class="nav-item dropdown">
          <a
            href="#"
            class="nav-link d-flex lh-1 text-reset p-0"
            data-bs-toggle="dropdown"
            aria-label="Open user menu"
          >
            <span
              class="avatar avatar-sm"
              :style="user.avatar ? `background-image: url(${user.avatar})` : ''"
            >
              {{ user.avatar ? '' : user.initials }}
            </span>
            <div class="d-none d-xl-block ps-2">
              <div>{{ user.name }}</div>
              <div class="mt-1 small text-muted">{{ user.role || 'Administrator' }}</div>
            </div>
          </a>
          <div class="dropdown-menu dropdown-menu-end dropdown-menu-arrow">
            <router-link to="/profile" class="dropdown-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                <circle cx="12" cy="7" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
              Profile
            </router-link>
            <router-link to="/settings" class="dropdown-item">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                <path
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <circle cx="12" cy="12" r="3" />
              </svg>
              Settings
            </router-link>
            <div class="dropdown-divider"></div>
            <a href="#" class="dropdown-item" @click.prevent="logout">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="icon dropdown-item-icon"
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
                <path
                  d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"
                />
                <path d="M7 12h14l-3 -3m0 6l3 -3" />
              </svg>
              Logout
            </a>
          </div>
        </div>
      </div>

      <!-- Mobile Menu Toggle -->
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbar-menu"
        aria-controls="navbar-menu"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- Mobile Search & User -->
      <div class="navbar-nav flex-row order-md-last d-md-none">
        <div class="nav-item">
          <a
            href="#"
            class="nav-link d-flex lh-1 text-reset p-0"
            @click.prevent="showSearchModal = true"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon"
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
              <circle cx="10" cy="10" r="7" />
              <path d="M21 21l-6-6" />
            </svg>
          </a>
        </div>
        <div class="nav-item ms-3">
          <a href="#" class="nav-link d-flex lh-1 text-reset p-0" data-bs-toggle="dropdown">
            <span
              class="avatar avatar-sm"
              :style="user.avatar ? `background-image: url(${user.avatar})` : ''"
            >
              {{ user.avatar ? '' : user.initials }}
            </span>
          </a>
        </div>
      </div>
    </div>
  </header>

  <!-- Horizontal Navigation Menu -->
  <header class="navbar-expand-md">
    <div id="navbar-menu" class="collapse navbar-collapse">
      <div class="navbar">
        <div class="container-xl">
          <ul class="navbar-nav">
            <!-- Dashboard -->
            <li class="nav-item">
              <router-link class="nav-link" to="/" exact-active-class="active">
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
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
                    <polyline points="5 12 3 12 12 3 21 12 19 12" />
                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                    <path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" />
                  </svg>
                </span>
                <span class="nav-link-title">Dashboard</span>
              </router-link>
            </li>

            <!-- Employees Dropdown -->
            <li class="nav-item dropdown" :class="{ active: isActiveGroup('employees') }">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-employees"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="button"
                aria-expanded="false"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
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
                    <circle cx="9" cy="7" r="4" />
                    <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
                  </svg>
                </span>
                <span class="nav-link-title">Employees</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <router-link class="dropdown-item" to="/employees">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path d="M9 11h6l2 2v6a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-6l2 -2z" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      All Employees
                      <small class="text-muted">Manage staff members</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/employees/create">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <circle cx="9" cy="7" r="4" />
                        <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
                        <path d="M16 11h6m-3 -3v6" />
                      </svg>
                      Add Employee
                      <small class="text-muted">Register new staff</small>
                    </router-link>
                  </div>
                </div>
              </div>
            </li>

            <!-- Attendance Dropdown -->
            <li class="nav-item dropdown" :class="{ active: isActiveGroup('attendance') }">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-attendance"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="button"
                aria-expanded="false"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
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
                </span>
                <span class="nav-link-title">Attendance</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <router-link class="dropdown-item" to="/attendance">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="4" y="5" width="16" height="16" rx="2" />
                        <line x1="16" y1="3" x2="16" y2="7" />
                        <line x1="8" y1="3" x2="8" y2="7" />
                        <line x1="4" y1="11" x2="20" y2="11" />
                      </svg>
                      Today's Attendance
                      <small class="text-muted">Current day overview</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/attendance/manage">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path d="M9 12l2 2l4 -4" />
                        <path d="M21 12c-1 0 -3 0 -3 3s2 3 3 3s3 0 3 -3s-2 -3 -3 -3" />
                        <path
                          d="M10 12h-6a2 2 0 0 1 -2 -2v-4a2 2 0 0 1 2 -2h16a2 2 0 0 1 2 2v4a2 2 0 0 1 -2 2h-6"
                        />
                      </svg>
                      Record Attendance
                      <small class="text-muted">Manual entry</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/attendance/history">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path d="M3 12a9 9 0 1 0 9 -9a9.75 9.75 0 0 0 -6.74 2.74l-2.26 2.26" />
                        <path d="M12 7v5l4 2" />
                      </svg>
                      History
                      <small class="text-muted">Past records</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/attendance/calendar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="4" y="5" width="16" height="16" rx="2" />
                        <line x1="16" y1="3" x2="16" y2="7" />
                        <line x1="8" y1="3" x2="8" y2="7" />
                        <line x1="4" y1="11" x2="20" y2="11" />
                        <path d="M8 15h2v2h-2z" />
                      </svg>
                      Calendar View
                      <small class="text-muted">Monthly overview</small>
                    </router-link>
                  </div>
                  <div class="dropdown-menu-column">
                    <router-link class="dropdown-item" to="/face-recognition/setup">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <circle cx="9" cy="10" r="1" />
                        <circle cx="15" cy="10" r="1" />
                        <path d="M9.5 15a3.5 3.5 0 0 0 5 0" />
                      </svg>
                      Face Recognition
                      <small class="text-muted">AI-powered tracking</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/face-recognition/manage">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path d="M12 12c2 0 4 -1 4 -3s-2 -3 -4 -3s-4 1 -4 3s2 3 4 3" />
                        <path d="M12 12v9" />
                        <path d="M12 21c-1.5 0 -3 -1 -3 -3s1.5 -3 3 -3s3 1 3 3s-1.5 3 -3 3" />
                      </svg>
                      Manage Recognition
                      <small class="text-muted">Employee face data</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/attendance/kiosk">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="3" y="4" width="18" height="12" rx="1" />
                        <line x1="7" y1="20" x2="17" y2="20" />
                        <line x1="9" y1="16" x2="15" y2="16" />
                      </svg>
                      Kiosk Mode
                      <small class="text-muted">Self-service terminal</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/reports/attendance">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                      Reports
                      <small class="text-muted">Analytics & insights</small>
                    </router-link>
                  </div>
                </div>
              </div>
            </li>

            <!-- Schedule Dropdown -->
            <li class="nav-item dropdown" :class="{ active: isActiveGroup('schedules') }">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-schedules"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="button"
                aria-expanded="false"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
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
                    <rect x="4" y="5" width="16" height="16" rx="2" />
                    <line x1="16" y1="3" x2="16" y2="7" />
                    <line x1="8" y1="3" x2="8" y2="7" />
                    <line x1="4" y1="11" x2="20" y2="11" />
                    <rect x="8" y="15" width="2" height="2" />
                  </svg>
                </span>
                <span class="nav-link-title">Schedule</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <router-link class="dropdown-item" to="/schedules">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path d="M9 11h6l2 2v6a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-6l2 -2z" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      All Schedules
                      <small class="text-muted">Employee work schedules</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/schedules/create">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="4" y="5" width="16" height="16" rx="2" />
                        <line x1="16" y1="3" x2="16" y2="7" />
                        <line x1="8" y1="3" x2="8" y2="7" />
                        <line x1="4" y1="11" x2="20" y2="11" />
                        <path d="M10 16h4" />
                        <path d="M12 14v4" />
                      </svg>
                      Create Schedule
                      <small class="text-muted">New work schedule</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/schedules/calendar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="4" y="5" width="16" height="16" rx="2" />
                        <line x1="16" y1="3" x2="16" y2="7" />
                        <line x1="8" y1="3" x2="8" y2="7" />
                        <line x1="4" y1="11" x2="20" y2="11" />
                        <path d="M8 15h2v2h-2z" />
                      </svg>
                      Calendar View
                      <small class="text-muted">Schedule calendar</small>
                    </router-link>
                  </div>
                </div>
              </div>
            </li>

            <!-- Leave Management Dropdown -->
            <li class="nav-item dropdown" :class="{ active: isActiveGroup('leaves') }">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-leaves"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="button"
                aria-expanded="false"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
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
                    <rect x="4" y="5" width="16" height="16" rx="2" />
                    <line x1="16" y1="3" x2="16" y2="7" />
                    <line x1="8" y1="3" x2="8" y2="7" />
                    <line x1="4" y1="11" x2="20" y2="11" />
                    <path d="M18 6l-12 12" />
                    <path d="M6 6l12 12" />
                  </svg>
                </span>
                <span class="nav-link-title">Leave</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <router-link class="dropdown-item" to="/leaves">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path d="M9 11h6l2 2v6a1 1 0 0 1 -1 1h-10a1 1 0 0 1 -1 -1v-6l2 -2z" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      All Leave Requests
                      <small class="text-muted">View all requests</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/leaves/create">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="4" y="5" width="16" height="16" rx="2" />
                        <line x1="16" y1="3" x2="16" y2="7" />
                        <line x1="8" y1="3" x2="8" y2="7" />
                        <line x1="4" y1="11" x2="20" y2="11" />
                        <path d="M10 16h4" />
                        <path d="M12 14v4" />
                      </svg>
                      Request Leave
                      <small class="text-muted">Submit new request</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/leaves/manage">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path
                          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      Manage Requests
                      <small class="text-muted">Approve/reject</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/leaves/calendar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="4" y="5" width="16" height="16" rx="2" />
                        <line x1="16" y1="3" x2="16" y2="7" />
                        <line x1="8" y1="3" x2="8" y2="7" />
                        <line x1="4" y1="11" x2="20" y2="11" />
                        <path d="M8 15h2v2h-2z" />
                      </svg>
                      Calendar View
                      <small class="text-muted">Leave calendar</small>
                    </router-link>
                  </div>
                </div>
              </div>
            </li>

            <!-- Payroll Dropdown -->
            <li class="nav-item dropdown" :class="{ active: isActiveGroup('payroll') }">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-payroll"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="button"
                aria-expanded="false"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
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
                    <path
                      d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"
                    />
                    <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                  </svg>
                </span>
                <span class="nav-link-title">Payroll</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <router-link class="dropdown-item" to="/payroll">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="7" y="9" width="14" height="10" rx="2" />
                        <circle cx="14" cy="14" r="2" />
                        <path d="M17 9v-2a2 2 0 0 0 -2 -2h-10a2 2 0 0 0 -2 2v6a2 2 0 0 0 2 2h2" />
                      </svg>
                      Overview
                      <small class="text-muted">Payroll dashboard</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/payroll/create">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path d="M16 12h4m-2 -2v4" />
                        <path d="M12 21h-7a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h14a2 2 0 0 1 2 2v7" />
                        <line x1="16" y1="5" x2="16" y2="7" />
                        <line x1="8" y1="5" x2="8" y2="7" />
                        <line x1="4" y1="11" x2="20" y2="11" />
                      </svg>
                      Calculate
                      <small class="text-muted">Process payroll</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/payroll/summary">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                      Summary
                      <small class="text-muted">Payroll overview</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/reports/payroll">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <line x1="18" y1="20" x2="18" y2="10" />
                        <line x1="12" y1="20" x2="12" y2="4" />
                        <line x1="6" y1="20" x2="6" y2="14" />
                      </svg>
                      Reports
                      <small class="text-muted">Financial reports</small>
                    </router-link>
                  </div>
                </div>
              </div>
            </li>

            <!-- Reports Dropdown -->
            <li class="nav-item dropdown" :class="{ active: isActiveGroup('reports') }">
              <a
                class="nav-link dropdown-toggle"
                href="#navbar-reports"
                data-bs-toggle="dropdown"
                data-bs-auto-close="outside"
                role="button"
                aria-expanded="false"
              >
                <span class="nav-link-icon d-md-none d-lg-inline-block">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon"
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
                    <line x1="18" y1="20" x2="18" y2="10" />
                    <line x1="12" y1="20" x2="12" y2="4" />
                    <line x1="6" y1="20" x2="6" y2="14" />
                  </svg>
                </span>
                <span class="nav-link-title">Reports</span>
              </a>
              <div class="dropdown-menu">
                <div class="dropdown-menu-columns">
                  <div class="dropdown-menu-column">
                    <router-link class="dropdown-item" to="/reports">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="4" y="4" width="6" height="6" rx="1" />
                        <rect x="14" y="4" width="6" height="6" rx="1" />
                        <rect x="4" y="14" width="6" height="6" rx="1" />
                        <rect x="14" y="14" width="6" height="6" rx="1" />
                      </svg>
                      Dashboard
                      <small class="text-muted">Reports overview</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/reports/attendance">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                      Attendance Reports
                      <small class="text-muted">Daily & monthly data</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/reports/payroll">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <path
                          d="M17 8v-3a1 1 0 0 0 -1 -1h-10a2 2 0 0 0 0 4h12a1 1 0 0 1 1 1v3m0 4v3a1 1 0 0 1 -1 1h-12a2 2 0 0 1 -2 -2v-12"
                        />
                        <path d="M20 12v4h-4a2 2 0 0 1 0 -4h4" />
                      </svg>
                      Payroll Reports
                      <small class="text-muted">Financial analytics</small>
                    </router-link>
                    <router-link class="dropdown-item" to="/reports/leave">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="icon dropdown-item-icon"
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
                        <rect x="4" y="5" width="16" height="16" rx="2" />
                        <line x1="16" y1="3" x2="16" y2="7" />
                        <line x1="8" y1="3" x2="8" y2="7" />
                        <line x1="4" y1="11" x2="20" y2="11" />
                        <path d="M18 6l-12 12" />
                        <path d="M6 6l12 12" />
                      </svg>
                      Leave Reports
                      <small class="text-muted">Leave usage analytics</small>
                    </router-link>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </header>

  <!-- Search Modal -->
  <SearchModal :is-visible="showSearchModal" @close="showSearchModal = false" />
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SearchModal from '@/components/modals/SearchModal.vue'
import NotificationCenter from '@/components/common/NotificationCenter.vue'

const route = useRoute()

// State
const showSearchModal = ref(false)

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['logout'])

// Methods
const isActiveGroup = groupName => {
  return route.path.startsWith(`/${groupName}`)
}

const logout = () => {
  emit('logout')
}

const toggleDarkMode = () => {
  const currentTheme = document.documentElement.getAttribute('data-bs-theme') || 'light'
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark'

  // Apply to both documentElement and body for consistency
  document.documentElement.setAttribute('data-bs-theme', newTheme)
  document.body.setAttribute('data-bs-theme', newTheme)

  // Update classes
  document.body.classList.remove('theme-light', 'theme-dark')
  document.body.classList.add(`theme-${newTheme}`)

  // Save preference
  localStorage.setItem('theme', newTheme)

  // Dispatch custom event for any components that need to react
  window.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: newTheme } }))
}

// Function to close all open dropdowns
const closeAllDropdowns = () => {
  // Close Bootstrap dropdowns
  const dropdownElements = document.querySelectorAll('.dropdown-menu.show')
  dropdownElements.forEach(dropdown => {
    dropdown.classList.remove('show')

    // Also remove show class from dropdown toggle
    const toggle = dropdown.previousElementSibling
    if (toggle && toggle.classList.contains('dropdown-toggle')) {
      toggle.classList.remove('show')
      toggle.setAttribute('aria-expanded', 'false')
    }
  })

  // Close navbar collapse on mobile
  const navbarCollapse = document.querySelector('.navbar-collapse.show')
  if (navbarCollapse) {
    navbarCollapse.classList.remove('show')
  }

  // Close search modal
  showSearchModal.value = false
}

// Watch for route changes to close dropdowns
watch(
  () => route.path,
  (newPath, oldPath) => {
    if (newPath !== oldPath) {
      console.log('🔄 Route changed - closing dropdowns')
      closeAllDropdowns()
    }
  }
)

// Close dropdowns when clicking outside (for better UX)
const handleClickOutside = event => {
  // Check if click is outside dropdown areas
  const isDropdownClick =
    event.target.closest('.dropdown') ||
    event.target.closest('.dropdown-menu') ||
    event.target.closest('[data-bs-toggle="dropdown"]')

  if (!isDropdownClick) {
    closeAllDropdowns()
  }
}

// Add event listeners for click outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
/* Exact Tabler.io Header Styling */
.navbar-brand-image {
  height: 2rem;
  width: auto;
}

.dropdown-menu-columns {
  display: flex;
  min-width: 25rem;
}

.dropdown-menu-column {
  flex: 1;
  padding: 0.5rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
}

.dropdown-item-icon {
  margin-right: 0.5rem;
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

.dropdown-item small {
  display: block;
  margin-left: 1.75rem;
  margin-top: 0.125rem;
}

.nav-item.active > .nav-link {
  color: var(--tblr-primary);
  background-color: var(--tblr-primary-lt);
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.status-dot-animated {
  animation: status-dot-pulse 2s infinite;
}

@keyframes status-dot-pulse {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}

/* Dark mode toggle visibility */
[data-bs-theme='light'] .hide-theme-light,
.theme-light .hide-theme-light {
  display: none !important;
}

[data-bs-theme='dark'] .hide-theme-dark,
.theme-dark .hide-theme-dark {
  display: none !important;
}
</style>
