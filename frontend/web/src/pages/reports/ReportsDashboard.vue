<template>
  <div class="container-xl">
    <!-- Page Header -->
    <div class="page-header d-print-none">
      <div class="row align-items-center">
        <div class="col">
          <h2 class="page-title">Reports & Analytics Dashboard</h2>
          <div class="text-muted mt-1">Comprehensive insights into attendance, payroll, and performance</div>
        </div>
        <div class="col-auto ms-auto d-print-none">
          <div class="btn-list">
            <div class="dropdown">
              <button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="icon me-2"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Export Reports
              </button>
              <div class="dropdown-menu">
                <a class="dropdown-item" href="#" @click.prevent="exportReport('attendance', 'excel')">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon me-2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Attendance Report (Excel)
                </a>
                <a class="dropdown-item" href="#" @click.prevent="exportReport('payroll', 'excel')">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon me-2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Payroll Report (Excel)
                </a>
                <a class="dropdown-item" href="#" @click.prevent="exportReport('performance', 'pdf')">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="icon me-2"
                  >
                    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  Performance Report (PDF)
                </a>
              </div>
            </div>
            <button class="btn btn-primary" @click="refreshDashboard">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="icon me-2"
              >
                <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
                <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                <path d="M3 21v-5h5" />
              </svg>
              Refresh Data
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="page-body">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary mb-3"></div>
        <div>Loading analytics data...</div>
      </div>

      <!-- Dashboard Content -->
      <div v-else>
        <!-- Key Metrics Cards -->
        <div class="row row-cards mb-4">
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <span class="bg-primary text-white avatar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                      </svg>
                    </span>
                  </div>
                  <div class="col">
                    <div class="font-weight-medium">
                      {{ metrics.totalEmployees }}
                    </div>
                    <div class="text-muted">Total Employees</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <span class="bg-success text-white avatar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon"
                      >
                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
                      </svg>
                    </span>
                  </div>
                  <div class="col">
                    <div class="font-weight-medium">
                      {{ formatPercentage(metrics.attendanceRate) }}
                    </div>
                    <div class="text-muted">Attendance Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <span class="bg-warning text-white avatar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </span>
                  </div>
                  <div class="col">
                    <div class="font-weight-medium">
                      {{ formatPercentage(metrics.punctualityRate) }}
                    </div>
                    <div class="text-muted">Punctuality Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-lg-3">
            <div class="card">
              <div class="card-body">
                <div class="row align-items-center">
                  <div class="col-auto">
                    <span class="bg-info text-white avatar">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        class="icon"
                      >
                        <line x1="12" y1="1" x2="12" y2="23" />
                        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                      </svg>
                    </span>
                  </div>
                  <div class="col">
                    <div class="font-weight-medium">
                      {{ formatCurrency(metrics.totalPayroll) }}
                    </div>
                    <div class="text-muted">Total Payroll</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Charts Row -->
        <div class="row row-cards mb-4">
          <!-- Attendance Trend Chart -->
          <div class="col-lg-8">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Attendance Trends</h3>
                <div class="card-actions">
                  <div class="dropdown">
                    <button class="btn btn-outline-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown">
                      {{ selectedPeriod.charAt(0).toUpperCase() + selectedPeriod.slice(1) }}
                    </button>
                    <div class="dropdown-menu">
                      <a class="dropdown-item" href="#" @click.prevent="changePeriod('daily')">Daily</a>
                      <a class="dropdown-item" href="#" @click.prevent="changePeriod('weekly')">Weekly</a>
                      <a class="dropdown-item" href="#" @click.prevent="changePeriod('monthly')">Monthly</a>
                    </div>
                  </div>
                </div>
              </div>
              <div class="card-body">
                <div class="chart-container" style="height: 300px">
                  <canvas ref="attendanceChart"></canvas>
                </div>
              </div>
            </div>
          </div>

          <!-- Employee Type Distribution -->
          <div class="col-lg-4">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Employee Distribution</h3>
              </div>
              <div class="card-body">
                <div class="chart-container" style="height: 300px">
                  <canvas ref="employeeTypeChart"></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Department Statistics -->
        <div class="row row-cards mb-4">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Department Performance</h3>
              </div>
              <div class="card-body">
                <div class="table-responsive">
                  <table class="table table-vcenter">
                    <thead>
                      <tr>
                        <th>Department</th>
                        <th>Employees</th>
                        <th>Attendance Rate</th>
                        <th>Punctuality Rate</th>
                        <th>Avg Hours/Day</th>
                        <th>Total Payroll</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="dept in departmentStats" :key="dept.name">
                        <td>
                          <div class="font-weight-medium">{{ dept.name }}</div>
                        </td>
                        <td>{{ dept.employee_count }}</td>
                        <td>
                          <div class="d-flex align-items-center">
                            <span class="me-2">{{ formatPercentage(dept.attendance_rate) }}</span>
                            <div class="progress progress-sm w-50">
                              <div
                                class="progress-bar"
                                :style="`width: ${dept.attendance_rate}%`"
                                :class="{
                                  'bg-success': dept.attendance_rate >= 90,
                                  'bg-warning': dept.attendance_rate >= 75 && dept.attendance_rate < 90,
                                  'bg-danger': dept.attendance_rate < 75
                                }"
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td>{{ formatPercentage(dept.punctuality_rate) }}</td>
                        <td>{{ dept.avg_work_hours.toFixed(1) }}h</td>
                        <td>{{ formatCurrency(dept.total_payroll) }}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top Performers -->
        <div class="row row-cards">
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Top Performers</h3>
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  <div
                    v-for="(performer, index) in topPerformers"
                    :key="performer.employee_id"
                    class="list-group-item d-flex align-items-center"
                  >
                    <span
                      class="avatar avatar-sm me-3"
                      :class="`bg-${index < 3 ? ['yellow', 'gray', 'orange'][index] : 'secondary'}-lt`"
                    >
                      {{ index + 1 }}
                    </span>
                    <div class="flex-fill">
                      <div class="font-weight-medium">{{ performer.employee_name }}</div>
                      <div class="text-muted small">{{ performer.department }}</div>
                    </div>
                    <div class="text-end">
                      <div class="font-weight-medium">{{ performer.performance_score }}%</div>
                      <div class="text-muted small">{{ formatPercentage(performer.attendance_rate) }} attendance</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Insights -->
          <div class="col-lg-6">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Key Insights</h3>
              </div>
              <div class="card-body">
                <div class="list-group list-group-flush">
                  <div v-for="insight in insights" :key="insight.id" class="list-group-item">
                    <div class="d-flex align-items-center">
                      <span class="avatar avatar-sm me-3" :class="`bg-${insight.type}-lt`">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          class="icon"
                        >
                          <path v-if="insight.type === 'success'" d="M9 12l2 2 4-4" />
                          <path v-else-if="insight.type === 'warning'" d="M12 9v2m0 4v.01" />
                          <path v-else d="M12 8v4m0 4h.01" />
                          <circle cx="12" cy="12" r="10" />
                        </svg>
                      </span>
                      <div class="flex-fill">
                        <div class="font-weight-medium">{{ insight.title }}</div>
                        <div class="text-muted small">{{ insight.description }}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue'
import { reportingService } from '@/services/reportingService'
import { attendanceService } from '@/services/attendanceService'
import { employeeService } from '@/services/employeeService'
import { payrollService } from '@/services/payrollService'
import Chart from 'chart.js/auto'

// Refs
const loading = ref(true)
const selectedPeriod = ref('weekly')
const attendanceChart = ref(null)
const employeeTypeChart = ref(null)

// Data
const metrics = ref({
  totalEmployees: 0,
  attendanceRate: 0,
  punctualityRate: 0,
  totalPayroll: 0
})

const departmentStats = ref([])
const topPerformers = ref([])
const insights = ref([])

// Chart instances
let attendanceChartInstance = null
let employeeTypeChartInstance = null

// Methods
const refreshDashboard = async () => {
  loading.value = true
  try {
    await Promise.all([loadMetrics(), loadDepartmentStats(), loadTopPerformers(), generateInsights()])

    await nextTick()
    renderCharts()
  } catch (error) {
    console.error('Error refreshing dashboard:', error)
  } finally {
    loading.value = false
  }
}

const loadMetrics = async () => {
  try {
    // Mock data - replace with actual API calls
    const employees = await employeeService.getAll()
    const attendance = await attendanceService.getRecords({ limit: 1000 })
    const payroll = await payrollService.getAll()

    if (employees.success) {
      metrics.value.totalEmployees = employees.data.length || employees.data.data?.length || 0
    }

    // Calculate attendance metrics from sample data
    metrics.value.attendanceRate = 85.4
    metrics.value.punctualityRate = 78.2
    metrics.value.totalPayroll = 1250000000 // 1.25B IDR
  } catch (error) {
    console.error('Error loading metrics:', error)
  }
}

const loadDepartmentStats = async () => {
  // Mock department statistics
  departmentStats.value = [
    {
      name: 'Mathematics',
      employee_count: 12,
      attendance_rate: 92.5,
      punctuality_rate: 85.3,
      avg_work_hours: 8.2,
      total_payroll: 180000000
    },
    {
      name: 'Science',
      employee_count: 10,
      attendance_rate: 88.7,
      punctuality_rate: 82.1,
      avg_work_hours: 7.9,
      total_payroll: 165000000
    },
    {
      name: 'English',
      employee_count: 8,
      attendance_rate: 94.2,
      punctuality_rate: 89.6,
      avg_work_hours: 8.1,
      total_payroll: 140000000
    },
    {
      name: 'Administration',
      employee_count: 6,
      attendance_rate: 86.4,
      punctuality_rate: 75.8,
      avg_work_hours: 8.0,
      total_payroll: 120000000
    }
  ]
}

const loadTopPerformers = async () => {
  // Mock top performers
  topPerformers.value = [
    {
      employee_id: 1,
      employee_name: 'Sarah Johnson',
      department: 'Mathematics',
      performance_score: 96,
      attendance_rate: 98.5
    },
    {
      employee_id: 2,
      employee_name: 'Ahmad Rahman',
      department: 'Science',
      performance_score: 94,
      attendance_rate: 96.2
    },
    {
      employee_id: 3,
      employee_name: 'Maria Santos',
      department: 'English',
      performance_score: 92,
      attendance_rate: 94.8
    },
    {
      employee_id: 4,
      employee_name: 'David Chen',
      department: 'Mathematics',
      performance_score: 90,
      attendance_rate: 93.1
    },
    {
      employee_id: 5,
      employee_name: 'Lisa Anderson',
      department: 'Administration',
      performance_score: 88,
      attendance_rate: 91.7
    }
  ]
}

const generateInsights = async () => {
  insights.value = [
    {
      id: 1,
      type: 'success',
      title: 'Excellent Attendance',
      description: 'Mathematics department achieved 92.5% attendance rate this month'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Late Arrivals Increasing',
      description: 'Admin staff punctuality dropped by 5% compared to last month'
    },
    {
      id: 3,
      type: 'info',
      title: 'Payroll Optimization',
      description: 'Honorary teachers worked 15% more efficiently this period'
    },
    {
      id: 4,
      type: 'success',
      title: 'Zero Absences',
      description: '5 employees achieved perfect attendance this month'
    }
  ]
}

const renderCharts = () => {
  renderAttendanceChart()
  renderEmployeeTypeChart()
}

const renderAttendanceChart = () => {
  if (!attendanceChart.value) return

  // Destroy existing chart
  if (attendanceChartInstance) {
    attendanceChartInstance.destroy()
  }

  // Mock attendance trend data
  const mockData = reportingService.generateAttendanceChartData(
    {
      weekly: {
        '2024-W01': { present: 45, absent: 3, late: 7 },
        '2024-W02': { present: 48, absent: 2, late: 5 },
        '2024-W03': { present: 46, absent: 4, late: 6 },
        '2024-W04': { present: 50, absent: 1, late: 4 }
      }
    },
    selectedPeriod.value
  )

  attendanceChartInstance = new Chart(attendanceChart.value, {
    type: 'line',
    data: mockData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  })
}

const renderEmployeeTypeChart = () => {
  if (!employeeTypeChart.value) return

  // Destroy existing chart
  if (employeeTypeChartInstance) {
    employeeTypeChartInstance.destroy()
  }

  const mockData = reportingService.generatePieChartData({
    'Permanent Teachers': 20,
    'Honorary Teachers': 15,
    'Permanent Staff': 8,
    'Honorary Staff': 7
  })

  employeeTypeChartInstance = new Chart(employeeTypeChart.value, {
    type: 'doughnut',
    data: mockData,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

const changePeriod = period => {
  selectedPeriod.value = period
  renderAttendanceChart()
}

const exportReport = async (type, format) => {
  try {
    await reportingService.exportReport(type, format)
  } catch (error) {
    console.error('Export error:', error)
  }
}

const formatCurrency = amount => {
  return reportingService.formatCurrency(amount)
}

const formatPercentage = value => {
  return reportingService.formatPercentage(value)
}

// Lifecycle
onMounted(async () => {
  await refreshDashboard()
})
</script>
