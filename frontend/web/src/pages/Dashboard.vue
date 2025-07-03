<template>
  <!-- Dashboard with Exact Tabler.io Structure -->
  <div class="row row-deck row-cards">
    <!-- Stats Cards Row - Attendance System with Tabler.io Visual Style -->
    <div class="col-12">
      <div class="row row-cards">
        <!-- Total Employees Card -->
        <div class="col-sm-6 col-lg-3">
          <div class="card card-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-primary text-white avatar">
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
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ stats.totalEmployees }} Total Employees</div>
                  <div class="text-muted">{{ stats.activeToday }} active today</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Present Today Card -->
        <div class="col-sm-6 col-lg-3">
          <div class="card card-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-green text-white avatar">
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
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ stats.present }} Present Today</div>
                  <div class="text-muted">{{ stats.presentPercentage }}% attendance rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Late Arrivals Card -->
        <div class="col-sm-6 col-lg-3">
          <div class="card card-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-yellow text-white avatar">
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
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ stats.late }} Late Arrivals</div>
                  <div class="text-muted">{{ stats.latePercentage }}% of present employees</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Absent Card -->
        <div class="col-sm-6 col-lg-3">
          <div class="card card-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto">
                  <span class="bg-red text-white avatar">
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
                      <path d="M18 6l-12 12" />
                      <path d="M6 6l12 12" />
                    </svg>
                  </span>
                </div>
                <div class="col">
                  <div class="font-weight-medium">{{ stats.absent }} Absent</div>
                  <div class="text-muted">{{ stats.absentPercentage }}% not present</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Attendance Activity Card - Tabler Structure -->
    <div class="col-lg-8">
      <div class="card dashboard-card h-100">
        <div class="card-header">
          <h3 class="card-title">Recent Attendance Activity</h3>
        </div>
        <div class="card-body card-body-scrollable card-body-scrollable-shadow">
          <div class="divide-y">
            <div v-for="activity in recentActivity" :key="activity.id" class="row">
              <div class="col-auto">
                <span class="avatar" :style="{ backgroundImage: activity.avatar ? `url(${activity.avatar})` : '' }">
                  {{ activity.avatar ? '' : activity.initials }}
                </span>
              </div>
              <div class="col">
                <div class="text-truncate">
                  <strong>{{ activity.employeeName }}</strong> {{ activity.action }}
                </div>
                <div class="text-muted">{{ activity.time }}</div>
              </div>
              <div class="col-auto align-self-center">
                <div class="badge" :class="getBadgeClass(activity.status)">
                  {{ activity.status }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card-footer">
          <router-link to="/attendance" class="btn btn-link">
            View all activity
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon ms-1"
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
              <polyline points="9 6 15 12 9 18" />
            </svg>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Quick Actions Card -->
    <div class="col-lg-4">
      <div class="card dashboard-card h-100">
        <div class="card-header">
          <h3 class="card-title">Quick Actions</h3>
        </div>
        <div class="card-body">
          <div class="divide-y">
            <div class="row">
              <div class="col">
                <router-link to="/employees/create" class="btn btn-outline-primary w-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon me-2"
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
                </router-link>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <router-link to="/schedules/create" class="btn btn-outline-success w-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon me-2"
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
                  Create Schedule
                </router-link>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <router-link to="/reports/attendance" class="btn btn-outline-info w-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon me-2"
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
                  View Reports
                </router-link>
              </div>
            </div>
            <div class="row">
              <div class="col">
                <router-link to="/face-recognition/setup" class="btn btn-outline-warning w-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon me-2"
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
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Today's Summary Card -->
      <div class="card dashboard-card mt-3 h-100">
        <div class="card-header">
          <h3 class="card-title">Today's Summary</h3>
          <div class="card-actions">
            <a href="#" class="btn-action">
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
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </a>
          </div>
        </div>
        <div class="card-body d-flex flex-column">
          <div class="d-flex align-items-center py-2">
            <div class="me-3">
              <span class="status-dot bg-success d-block"></span>
            </div>
            <div class="flex-fill">
              <div class="h6 mb-1">On Time: {{ stats.onTime }}</div>
              <div class="text-muted">{{ Math.round((stats.onTime / stats.totalEmployees) * 100) }}% of staff</div>
            </div>
          </div>
          <div class="d-flex align-items-center py-2">
            <div class="me-3">
              <span class="status-dot bg-warning d-block"></span>
            </div>
            <div class="flex-fill">
              <div class="h6 mb-1">Late: {{ stats.late }}</div>
              <div class="text-muted">{{ Math.round((stats.late / stats.totalEmployees) * 100) }}% of staff</div>
            </div>
          </div>
          <div class="d-flex align-items-center py-2">
            <div class="me-3">
              <span class="status-dot bg-danger d-block"></span>
            </div>
            <div class="flex-fill">
              <div class="h6 mb-1">Absent: {{ stats.absent }}</div>
              <div class="text-muted">{{ Math.round((stats.absent / stats.totalEmployees) * 100) }}% of staff</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Attendance Chart Row -->
    <div class="col-lg-8">
      <div class="row row-cards">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex">
                <h3 class="card-title">Weekly Attendance Overview</h3>
                <div class="ms-auto">
                  <div class="dropdown">
                    <a
                      class="dropdown-toggle text-muted"
                      href="#"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                      >Last 7 days</a
                    >
                    <div class="dropdown-menu dropdown-menu-end">
                      <a class="dropdown-item active" href="#">Last 7 days</a>
                      <a class="dropdown-item" href="#">Last 30 days</a>
                      <a class="dropdown-item" href="#">Last 3 months</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="subheader">Attendance summary</div>
              <div style="height: 300px">
                <canvas ref="attendanceChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="col-lg-4">
      <div class="row row-cards">
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="subheader">Attendance Rate</div>
                <div class="ms-auto">
                  <div class="chart-sparkline chart-sparkline-square" style="height: 20px; width: 60px">
                    <canvas ref="sparklineChart" width="60" height="20"></canvas>
                  </div>
                </div>
              </div>
              <div class="h1 mb-3">{{ stats.presentPercentage }}%</div>
              <div class="d-flex mb-2">
                <div>Weekly average</div>
                <div class="ms-auto">
                  <span class="text-green d-inline-flex align-items-center lh-1">
                    +3%
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon ms-1"
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
                      <polyline points="3 17 9 11 13 15 21 7" />
                      <polyline points="14 7 21 7 21 14" />
                    </svg>
                  </span>
                </div>
              </div>
              <div class="progress progress-sm">
                <div
                  class="progress-bar bg-primary"
                  :style="{ width: stats.presentPercentage + '%' }"
                  role="progressbar"
                  :aria-valuenow="stats.presentPercentage"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <span class="visually-hidden">{{ stats.presentPercentage }}% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-12">
          <div class="card">
            <div class="card-body">
              <div class="d-flex align-items-center">
                <div class="subheader">This Month</div>
              </div>
              <div class="d-flex align-items-baseline">
                <div class="h1 mb-0 me-2">{{ stats.totalEmployees }}</div>
                <div class="me-auto">
                  <span class="text-green d-inline-flex align-items-center lh-1">
                    +5%
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="icon ms-1"
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
                      <polyline points="3 17 9 11 13 15 21 7" />
                      <polyline points="14 7 21 7 21 14" />
                    </svg>
                  </span>
                </div>
              </div>
              <div class="text-muted">Total employees</div>
            </div>
            <div style="height: 80px">
              <canvas ref="monthlyChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Weekly Attendance Table -->
    <div class="col-12">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Weekly Attendance Report</h3>
        </div>
        <div class="card-body border-bottom py-3">
          <div class="d-flex">
            <div class="text-muted">
              Show
              <div class="mx-2 d-inline-block">
                <input type="text" class="form-control form-control-sm" value="7" size="3" aria-label="Days count" />
              </div>
              days
            </div>
            <div class="ms-auto text-muted">
              Search:
              <div class="ms-2 d-inline-block">
                <input type="text" class="form-control form-control-sm" aria-label="Search day" />
              </div>
            </div>
          </div>
        </div>
        <div class="table-responsive">
          <table class="table card-table table-vcenter text-nowrap datatable">
            <thead>
              <tr>
                <th class="w-1">
                  <input class="form-check-input m-0 align-middle" type="checkbox" aria-label="Select all days" />
                </th>
                <th class="w-1">
                  Day
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-sm text-dark icon-thick"
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
                    <polyline points="6 15 12 9 18 15" />
                  </svg>
                </th>
                <th>Date</th>
                <th>Present</th>
                <th>Late</th>
                <th>Absent</th>
                <th>Rate</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="day in weeklyData" :key="day.id">
                <td>
                  <input class="form-check-input m-0 align-middle" type="checkbox" aria-label="Select day" />
                </td>
                <td>
                  <span class="text-muted">{{ day.day }}</span>
                </td>
                <td>
                  <div class="font-weight-medium">{{ day.date }}</div>
                </td>
                <td>
                  <span class="badge bg-success-lt">{{ day.present }}</span>
                </td>
                <td>
                  <span class="badge bg-warning-lt">{{ day.late }}</span>
                </td>
                <td>
                  <span class="badge bg-danger-lt">{{ day.absent }}</span>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <span class="me-2">{{ day.rate }}%</span>
                    <div class="progress progress-sm flex-fill">
                      <div class="progress-bar" :style="{ width: day.rate + '%' }" role="progressbar"></div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="badge me-1" :class="getDayStatusClass(day.rate)"></span>
                  {{ getDayStatus(day.rate) }}
                </td>
                <td class="text-end">
                  <span class="dropdown">
                    <button
                      class="btn dropdown-toggle align-text-top"
                      data-bs-boundary="viewport"
                      data-bs-toggle="dropdown"
                    >
                      Actions
                    </button>
                    <div class="dropdown-menu dropdown-menu-end">
                      <a class="dropdown-item" href="#"> View Details </a>
                      <a class="dropdown-item" href="#"> Export Report </a>
                    </div>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="card-footer d-flex align-items-center">
          <p class="m-0 text-muted">Showing <span>1</span> to <span>7</span> of <span>7</span> days</p>
          <ul class="pagination m-0 ms-auto">
            <li class="page-item disabled">
              <a class="page-link" href="#" tabindex="-1" aria-disabled="true">
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
                  <polyline points="15 6 9 12 15 18" />
                </svg>
                prev
              </a>
            </li>
            <li class="page-item active"><a class="page-link" href="#">1</a></li>
            <li class="page-item">
              <a class="page-link" href="#">
                next
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
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref } from 'vue'
// Tree-shaking friendly Chart.js imports
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

// Chart refs
const attendanceChart = ref(null)
const sparklineChart = ref(null)
const monthlyChart = ref(null)

// Sample attendance data
const stats = ref({
  totalEmployees: 156,
  activeToday: 142,
  present: 132,
  late: 10,
  absent: 14,
  onTime: 122
})

const recentActivity = ref([
  {
    id: 1,
    employeeName: 'John Doe',
    action: 'clocked in',
    time: '2 minutes ago',
    status: 'On Time',
    initials: 'JD',
    avatar: null
  },
  {
    id: 2,
    employeeName: 'Jane Smith',
    action: 'clocked in',
    time: '5 minutes ago',
    status: 'Late',
    initials: 'JS',
    avatar: null
  },
  {
    id: 3,
    employeeName: 'Mike Johnson',
    action: 'clocked out',
    time: '1 hour ago',
    status: 'On Time',
    initials: 'MJ',
    avatar: null
  },
  {
    id: 4,
    employeeName: 'Sarah Wilson',
    action: 'clocked in',
    time: '2 hours ago',
    status: 'On Time',
    initials: 'SW',
    avatar: null
  }
])

const weeklyData = ref([
  { id: 1, day: 'Monday', date: 'Dec 25', present: 145, late: 8, absent: 3, rate: 92 },
  { id: 2, day: 'Tuesday', date: 'Dec 26', present: 142, late: 10, absent: 4, rate: 89 },
  { id: 3, day: 'Wednesday', date: 'Dec 27', present: 138, late: 12, absent: 6, rate: 87 },
  { id: 4, day: 'Thursday', date: 'Dec 28', present: 144, late: 7, absent: 5, rate: 91 },
  { id: 5, day: 'Friday', date: 'Dec 29', present: 132, late: 10, absent: 14, rate: 85 },
  { id: 6, day: 'Saturday', date: 'Dec 30', present: 89, late: 5, absent: 62, rate: 57 },
  { id: 7, day: 'Sunday', date: 'Dec 31', present: 12, late: 2, absent: 142, rate: 8 }
])

// Computed properties
const computedStats = computed(() => ({
  ...stats.value,
  presentPercentage: Math.round((stats.value.present / stats.value.totalEmployees) * 100),
  latePercentage: Math.round((stats.value.late / stats.value.present) * 100),
  absentPercentage: Math.round((stats.value.absent / stats.value.totalEmployees) * 100)
}))

// Methods
const getBadgeClass = status => {
  switch (status) {
    case 'On Time':
      return 'bg-success'
    case 'Late':
      return 'bg-warning'
    case 'Absent':
      return 'bg-danger'
    default:
      return 'bg-secondary'
  }
}

const getDayStatusClass = rate => {
  if (rate >= 90) return 'bg-success'
  if (rate >= 75) return 'bg-warning'
  return 'bg-danger'
}

const getDayStatus = rate => {
  if (rate >= 90) return 'Excellent'
  if (rate >= 75) return 'Good'
  return 'Poor'
}

// Update stats reference
stats.value = computedStats.value

onMounted(async () => {
  await nextTick()

  // Initialize Attendance Chart
  if (attendanceChart.value) {
    new ChartJS(attendanceChart.value, {
      type: 'line',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [
          {
            label: 'Attendance Rate',
            data: [92, 89, 87, 91, 85, 57, 8],
            borderColor: '#206bc4',
            backgroundColor: 'rgba(32, 107, 196, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            max: 100,
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          },
          x: {
            grid: {
              color: 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    })
  }

  // Initialize Sparkline Chart
  if (sparklineChart.value) {
    new ChartJS(sparklineChart.value, {
      type: 'line',
      data: {
        labels: ['1', '2', '3', '4', '5', '6', '7'],
        datasets: [
          {
            data: [82, 85, 87, 91, 85, 89, 92],
            borderColor: '#28a745',
            backgroundColor: 'transparent',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    })
  }

  // Initialize Monthly Employee Chart
  if (monthlyChart.value) {
    new ChartJS(monthlyChart.value, {
      type: 'line',
      data: {
        labels: Array.from({ length: 30 }, (_, i) => i + 1),
        datasets: [
          {
            data: Array.from({ length: 30 }, () => Math.floor(Math.random() * 20) + 140),
            borderColor: '#206bc4',
            backgroundColor: 'transparent',
            borderWidth: 1,
            pointRadius: 0,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { display: false }
        },
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false }
        }
      }
    })
  }

  console.log('Attendance Dashboard with Tabler.io styling loaded')
})
</script>

<style scoped>
/* Exact Tabler.io Dashboard Styling */
.card-body-scrollable {
  max-height: 20rem;
  overflow-y: auto;
}

.card-body-scrollable-shadow {
  position: relative;
}

.card-body-scrollable-shadow::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1rem;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 1), transparent);
  z-index: 1;
  pointer-events: none;
}

.card-body-scrollable-shadow::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1rem;
  background: linear-gradient(to top, rgba(255, 255, 255, 1), transparent);
  z-index: 1;
  pointer-events: none;
}

.divide-y > * + * {
  border-top: 1px solid var(--tblr-border-color);
  padding-top: 1rem;
  margin-top: 1rem;
}

.avatar {
  width: 2.25rem;
  height: 2.25rem;
  font-size: 0.875rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background-color: var(--tblr-secondary);
  border-radius: 50%;
}

.status-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.progress-sm {
  height: 0.375rem;
}

.btn-action {
  color: var(--tblr-text-muted);
  text-decoration: none;
  padding: 0.25rem;
  border-radius: var(--tblr-border-radius);
}

.btn-action:hover {
  color: var(--tblr-body-color);
  background-color: var(--tblr-active-bg);
}

/* Card spacing */
.row-cards .card {
  margin-bottom: 1.5rem;
}

.card-sm .card-body {
  padding: 1.25rem;
}

/* Font weights */
.font-weight-medium {
  font-weight: 500;
}

/* Badge light variants */
.bg-success-lt {
  background-color: rgba(var(--tblr-success-rgb), 0.1) !important;
  color: var(--tblr-success) !important;
}

.bg-warning-lt {
  background-color: rgba(var(--tblr-warning-rgb), 0.1) !important;
  color: var(--tblr-warning) !important;
}

.bg-danger-lt {
  background-color: rgba(var(--tblr-danger-rgb), 0.1) !important;
  color: var(--tblr-danger) !important;
}
</style>
