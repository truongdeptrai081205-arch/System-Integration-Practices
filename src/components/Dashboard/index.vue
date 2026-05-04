<template>
  <div class="p-8 mt-[-32px]">
    <div class="max-w-[1600px] mx-auto">
      <div class="filter-header">
        <i class="fas fa-filter mr-2"></i>
        BỘ LỌC
      </div>
      <div class="filter-body shadow-lg">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
          <div>
            <label class="filter-label">Dân tộc</label>
            <select id="filterEthnicity" class="filter-select">
              <option value="">[Tất cả dân tộc]</option>
              <option>Asian</option>
              <option>Black</option>
              <option>Hispanic</option>
              <option>Other</option>
              <option>White</option>
            </select>
          </div>
          <div>
            <label class="filter-label">Giới tính</label>
            <select id="filterGender" class="filter-select">
              <option value="">[Tất cả giới tính]</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
          <div>
            <label class="filter-label">Đối tượng</label>
            <select id="filterShareholder" class="filter-select">
              <option value="">[Tất cả đối tượng]</option>
              <option value="Yes">Yes (Cổ đông)</option>
              <option value="No">No (Nhân viên)</option>
            </select>
          </div>
          <div>
            <label class="filter-label">Hình thức làm việc</label>
            <select id="filterJobType" class="filter-select">
              <option value="">[Tất cả hình thức]</option>
              <option>Full-time</option>
              <option>Part-time</option>
            </select>
          </div>
          <div>
            <label class="filter-label">Phòng ban</label>
            <select id="filterDepartment" class="filter-select">
              <option value="">[Tất cả phòng ban]</option>
              <option>IT</option>
              <option>HR</option>
              <option>Marketing</option>
              <option>Sales</option>
              <option>Finance</option>
            </select>
          </div>
          <div>
            <button @click="applyFilter" class="apply-btn uppercase">
              <i class="fas fa-sync-alt mr-2"></i> Apply Filter
            </button>
          </div>
        </div>
      </div>

      <div class="card p-6 mb-8 mt-[-16px] bg-slate-50 border border-slate-200">
        <h3 class="text-sm font-bold text-slate-800 uppercase mb-4 border-b pb-2">Thông tin & Cảnh báo</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-700 leading-relaxed">
          <div>
            <h4 class="font-bold text-slate-800 mb-2">Thông tin chung:</h4>
            <ul class="list-disc pl-5 space-y-1">
              <li>Tổng thu nhập theo cổ đông, giới tính, dân tộc, nhân viên bán thời gian và toàn thời gian.</li>
              <li>Tổng số ngày nghỉ phép của cổ đông, theo giới tính, dân tộc, hình thức làm việc và thời gian làm việc.</li>
              <li>Mức phúc lợi trung bình đã chi trả cho cổ đông và người không phải cổ đông tính đến nay theo từng kế hoạch phúc lợi.</li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-slate-800 mb-2">Cảnh báo theo điều kiện:</h4>
            <ul id="alertList" class="space-y-2 text-emerald-600 font-medium">
            </ul>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <div class="card p-6 border-l-4 border-blue-500">
          <p class="text-[11px] text-gray-400 font-bold uppercase mb-1">Số lượng nhân sự</p>
          <h2 id="kpiTotalEmployees" class="text-2xl font-bold text-slate-700">0</h2>
        </div>
        <div class="card p-6 border-l-4 border-emerald-500">
          <p class="text-[11px] text-gray-400 font-bold uppercase mb-1">Tổng thu nhập năm nay</p>
          <h2 id="kpiAnnualRevenue" class="text-2xl font-bold text-slate-700">$0</h2>
        </div>
        <div class="card p-6 border-l-4 border-teal-500">
          <p class="text-[11px] text-gray-400 font-bold uppercase mb-1">Tổng thu nhập năm trước</p>
          <h2 id="kpiPrevAnnualRevenue" class="text-2xl font-bold text-slate-700">$0</h2>
        </div>
        <div class="card p-6 border-l-4 border-amber-500">
          <p class="text-[11px] text-gray-400 font-bold uppercase mb-1">Số ngày nghỉ phép</p>
          <h2 id="kpiTotalVacation" class="text-2xl font-bold text-slate-700">0 ngày</h2>
        </div>
        <div class="card p-6 border-l-4 border-rose-500">
          <p class="text-[11px] text-gray-400 font-bold uppercase mb-1">Thu nhập trung bình</p>
          <h2 id="kpiAvgIncome" class="text-2xl font-bold text-slate-700">$0</h2>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2 card p-6">
          <h3 class="text-xs font-bold text-gray-500 uppercase mb-6 border-b pb-4">So sánh thu nhập (Cổ đông vs Nhân viên)</h3>
          <div class="h-[350px]">
            <canvas id="incomeChart"></canvas>
          </div>
        </div>

        <div class="card p-6">
          <h3 class="text-xs font-bold text-gray-500 uppercase mb-6 border-b pb-4">Tỷ lệ hình thức làm việc</h3>
          <div class="space-y-6">
            <div>
              <div class="flex justify-between text-xs mb-2"><span>Full-time</span><span id="fullTimePercent" class="font-bold">0%</span></div>
              <div class="w-full bg-gray-100 h-2 rounded-full"><div id="fullTimeBar" class="bg-blue-500 h-2 rounded-full" style="width: 0%"></div></div>
            </div>
            <div>
              <div class="flex justify-between text-xs mb-2"><span>Part-time</span><span id="partTimePercent" class="font-bold">0%</span></div>
              <div class="w-full bg-gray-100 h-2 rounded-full"><div id="partTimeBar" class="bg-amber-500 h-2 rounded-full" style="width: 0%"></div></div>
            </div>
            <div class="pt-4 h-[200px]">
              <canvas id="vacationPieChart"></canvas>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-6 mb-8">
        <div class="card p-6">
          <h3 class="text-xs font-bold text-gray-500 uppercase mb-6 border-b pb-4">Tổng Lương (Năm trước và Năm nay)</h3>
          <div class="h-[350px]">
            <canvas id="salaryComparisonChart"></canvas>
          </div>
        </div>
      </div>

      <div class="card overflow-hidden mb-8">
        <div class="p-5 border-b flex justify-between items-center bg-white">
          <h3 class="text-sm font-bold text-slate-700 uppercase">Bảng chi tiết nhân viên</h3>
          <div class="relative">
            <i class="fas fa-search absolute left-3 top-3 text-gray-400 text-xs"></i>
            <input
              type="text"
              id="searchInput"
              @input="searchTable"
              placeholder="Search employee..."
              class="pl-8 pr-4 py-2 border rounded-full text-xs outline-none focus:ring-2 ring-blue-100 w-72"
            />
          </div>
        </div>
        <div class="overflow-x-auto">
          <table id="employeeTable">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Ethnicity</th>
                <th>Gender</th>
                <th>Shareholder</th>
                <th>Job Type</th>
                <th>Department</th>
                <th>Salary (YTD)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody></tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'
import axios from 'axios' 

const employees = ref([])
const summary = ref({})
const dashboardData = ref({})



const fetchEmployees = async () => {
  try {
    const res = await axios.get('http://localhost:4000/api/earnings')

    const apiData = res.data

    // Lưu raw data
    summary.value = apiData.summary
    dashboardData.value = apiData.dashboard

    // Map lại cho phù hợp UI
    employees.value = apiData.data.map(e => ({
      name: 'Emp ' + e.EmployeeId, // vì API không có tên
      ethnicity: e.Ethnicity,
      gender: e.Gender ? 'Male' : 'Female',
      shareholder: e.Shareholder_Status ? 'Yes' : 'No',
      jobType: e.Employment_Type,
      department: e.Department,
      salary: Number(e.PaidToDate),
      prevSalary: Number(e.PaidLastYear),
      status: e.EmploymentStatus,
      daysTaken: 0, // API chưa có thì set tạm
      hireDate: '2024-01-01',
      birthMonth: 1
    }))

    renderDashboardFromAPI()

  } catch (err) {
    console.error('Lỗi API:', err)
  }
}

const router = useRouter()

let incomeChartInstance = null
let vacationChartInstance = null
let salaryComparisonChartInstance = null

const masterData = [
  { name: 'Nguyen Van A', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 62000, status: 'Active', daysTaken: 12, department: 'IT', hireDate: '2025-05-05', birthMonth: 5 },
  { name: 'Nguyen Thi B', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 40000, status: 'Active', daysTaken: 6, department: 'HR', hireDate: '2024-04-15', birthMonth: 12 },
  { name: 'Tran Van C', ethnicity: 'Khác', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 68000, status: 'Inactive', daysTaken: 18, department: 'IT', hireDate: '2022-05-02', birthMonth: 9 }
]

const getMonthFromDate = (dateString) => {
  return new Date(dateString).getMonth() + 1
}

const fetchAlerts = async () => {
  try {
    const [vacationRes, anniversaryRes, birthdayRes] = await Promise.all([
      axios.get('http://localhost:4000/api/alerts/vacation?page=1&limit=5'),
      axios.get('http://localhost:4000/api/alerts/anniversary'),
      axios.get('http://localhost:4000/api/alerts/birthday?page=1&pageSize=5')
    ])

    const alerts = []

    // Vacation alert
    if (vacationRes.data?.message) {
      alerts.push(vacationRes.data.message)
    }

    // Anniversary alert
    if (anniversaryRes.data?.message) {
      alerts.push(anniversaryRes.data.message)
    }

    // Birthday alert
    if (birthdayRes.data?.message) {
      alerts.push(birthdayRes.data.message)
    }

    renderAlerts(alerts)

  } catch (err) {
    console.error('Lỗi alert API:', err)
  }
}

const renderAlerts = (alerts) => {
  const alertList = document.getElementById('alertList')
  if (!alertList) return

  alertList.innerHTML = ''

  alerts.forEach(msg => {
    alertList.innerHTML += `
      <li class="flex items-start gap-2">
        <span>⚠️</span>
        <span>${msg}</span>
      </li>
    `
  })
}

const renderDashboardFromAPI = () => {

  // ===== KPI =====
  document.getElementById('kpiTotalEmployees').innerText =
    Number(summary.value.totalEmployees).toLocaleString()

  document.getElementById('kpiAnnualRevenue').innerText =
    '$' + Number(summary.value.incomeThisYear).toLocaleString()

  document.getElementById('kpiPrevAnnualRevenue').innerText =
    '$' + Number(summary.value.incomeLastYear).toLocaleString()

  document.getElementById('kpiAvgIncome').innerText =
    '$' + Math.round(summary.value.avgIncome).toLocaleString()

  document.getElementById('kpiTotalVacation').innerText =
    Number(summary.value.totalVacationDays).toLocaleString() + ' ngày'


  // ===== JOB TYPE % =====
  const fullTime = dashboardData.value.employmentType.find(e => e.Employment_Type === 'Full-time')
  const partTime = dashboardData.value.employmentType.find(e => e.Employment_Type === 'Part-time')

  const fullPct = fullTime ? fullTime.Percentage : 0
  const partPct = partTime ? partTime.Percentage : 0

  document.getElementById('fullTimePercent').innerText = fullPct + '%'
  document.getElementById('fullTimeBar').style.width = fullPct + '%'

  document.getElementById('partTimePercent').innerText = partPct + '%'
  document.getElementById('partTimeBar').style.width = partPct + '%'


  // ===== TABLE =====
  const tableBody = document.querySelector('#employeeTable tbody')
  tableBody.innerHTML = ''

  employees.value.forEach(item => {
    const color = item.shareholder === 'Yes' ? 'text-blue-600' : 'text-slate-600'
    const statusColor = item.status === 'Active'
      ? 'bg-green-100 text-green-700'
      : 'bg-red-100 text-red-700'

    tableBody.innerHTML += `
      <tr>
        <td>${item.name}</td>
        <td>${item.ethnicity}</td>
        <td>${item.gender}</td>
        <td><span class="${color} font-semibold">${item.shareholder}</span></td>
        <td>${item.jobType}</td>
        <td>${item.department}</td>
        <td>$${item.salary.toLocaleString()}</td>
        <td><span class="status-pill ${statusColor}">${item.status}</span></td>
      </tr>`
  })
  // ===== INCOME CHART =====
if (incomeChartInstance) incomeChartInstance.destroy()

const ctx = document.getElementById('incomeChart')

if (!ctx) return

const yesGroup = employees.value.filter(e => e.shareholder === 'Yes')
const noGroup = employees.value.filter(e => e.shareholder === 'No')

const yesAvg = yesGroup.length
  ? yesGroup.reduce((s, e) => s + e.salary, 0) / yesGroup.length
  : 0

const noAvg = noGroup.length
  ? noGroup.reduce((s, e) => s + e.salary, 0) / noGroup.length
  : 0

incomeChartInstance = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ['Cổ đông', 'Nhân viên'],
    datasets: [{
      label: 'Thu nhập trung bình ($)',
      data: [Math.round(yesAvg), Math.round(noAvg)],
      backgroundColor: ['#6366f1', '#10b981']
    }]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true }
    }
  }
})
// ===== VACATION PIE CHART =====
if (vacationChartInstance) vacationChartInstance.destroy()

const ctxPie = document.getElementById('vacationPieChart')
if (!ctxPie) return

const retiredData = dashboardData.value.retiredGroup || []

// tách label + data
const labels = retiredData.map(item => item.Type)
const data = retiredData.map(item => item.Total)

vacationChartInstance = new Chart(ctxPie, {
  type: 'doughnut',
  data: {
    labels: labels,
    datasets: [{
      data: data,
      backgroundColor: ['#6366f1', '#f59e0b'],
      borderWidth: 0
    }]
  },
  options: {
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  }
})
// ===== SALARY COMPARISON CHART =====
if (salaryComparisonChartInstance) salaryComparisonChartInstance.destroy()

const ctxSalary = document.getElementById('salaryComparisonChart')
if (!ctxSalary) return

const totalThisYear = Number(summary.value.incomeThisYear || 0)
const totalLastYear = Number(summary.value.incomeLastYear || 0)

// chia đều 4 quý (vì API chưa có theo quý)
const thisYearData = [
  totalThisYear * 0.25,
  totalThisYear * 0.25,
  totalThisYear * 0.25,
  totalThisYear * 0.25
]

const lastYearData = [
  totalLastYear * 0.25,
  totalLastYear * 0.25,
  totalLastYear * 0.25,
  totalLastYear * 0.25
]

salaryComparisonChartInstance = new Chart(ctxSalary, {
  type: 'bar',
  data: {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Năm trước',
        data: lastYearData,
        backgroundColor: '#94a3b8'
      },
      {
        label: 'Năm nay',
        data: thisYearData,
        backgroundColor: '#4ade80'
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }
})
}

const applyFilter = async () => {
  try {
    const params = {
      ethnicity: document.getElementById('filterEthnicity').value,
      gender: document.getElementById('filterGender').value,
      shareholder: document.getElementById('filterShareholder').value,
      jobType: document.getElementById('filterJobType').value,
      department: document.getElementById('filterDepartment').value
    }

    const res = await axios.get('http://localhost:4000/api/earnings', { params })

    const apiData = res.data

    summary.value = apiData.summary
    dashboardData.value = apiData.dashboard

    employees.value = apiData.data.map(e => ({
      name: 'Emp ' + e.EmployeeId,
      ethnicity: e.Ethnicity,
      gender: e.Gender ? 'Male' : 'Female',
      shareholder: e.Shareholder_Status ? 'Yes' : 'No',
      jobType: e.Employment_Type,
      department: e.Department,
      salary: Number(e.PaidToDate),
      prevSalary: Number(e.PaidLastYear),
      status: e.EmploymentStatus,
      daysTaken: 0,
      hireDate: '2024-01-01',
      birthMonth: 1
    }))

    renderDashboardFromAPI()

  } catch (err) {
    console.error(err)
  }
}

onMounted(() => {
  fetchEmployees()
  fetchAlerts()
})
</script>

<style scoped>
.card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  border: 1px solid #e1e4e8;
}
.filter-header {
  background: #3f51b5;
  color: white;
  padding: 12px 20px;
  border-radius: 8px 8px 0 0;
  font-size: 11px;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.filter-body {
  background: #5c6bc0;
  color: white;
  padding: 20px;
  border-radius: 0 0 8px 8px;
  margin-bottom: 24px;
}
.filter-label {
  display: block;
  font-size: 11px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #e8eaf6;
  text-transform: uppercase;
}
.filter-select {
  width: 100%;
  background: white;
  color: #2c3e50;
  padding: 10px;
  border-radius: 4px;
  font-size: 13px;
  border: none;
  outline: none;
}
.apply-btn {
  background: #009688;
  color: white;
  font-weight: bold;
  font-size: 13px;
  padding: 10px 20px;
  border-radius: 4px;
  transition: 0.3s;
  border: none;
  cursor: pointer;
  width: 100%;
}
.apply-btn:hover {
  background: #00796b;
}
table {
  width: 100%;
  border-collapse: collapse;
}
table th {
  background: #f8fafc;
  color: #64748b;
  font-size: 11px;
  text-transform: uppercase;
  padding: 15px;
  text-align: left;
  border-bottom: 2px solid #edf2f7;
}
table td {
  padding: 15px;
  font-size: 13px;
  color: #334155;
  border-bottom: 1px solid #edf2f7;
}
.status-pill {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: bold;
}
</style>