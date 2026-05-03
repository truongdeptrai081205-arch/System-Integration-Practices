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
              <option>Kinh</option>
              <option>Khác</option>
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
            <ul id="alertList" class="space-y-2 text-emerald-600 font-medium max-h-[250px] overflow-y-auto pr-2">
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
        <div class="p-5 border-b flex justify-between items-center bg-white flex-wrap gap-4">
          <h3 class="text-sm font-bold text-slate-700 uppercase">Bảng chi tiết nhân viên</h3>
          
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <span class="text-xs text-slate-600">Hiển thị:</span>
              <select id="rowsPerPage" @change="applyFilter" class="border rounded px-2 py-1 text-xs outline-none focus:ring-1 ring-blue-200">
                <option value="10">10</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            <div class="relative">
              <i class="fas fa-search absolute left-3 top-3 text-gray-400 text-xs"></i>
              <input
                type="text"
                id="searchInput"
                @input="searchTable"
                placeholder="Search employee..."
                class="pl-8 pr-4 py-2 border rounded-full text-xs outline-none focus:ring-2 ring-blue-100 w-64"
              />
            </div>
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import Chart from 'chart.js/auto'

const router = useRouter()

let incomeChartInstance = null
let vacationChartInstance = null
let salaryComparisonChartInstance = null

const masterData = [
  { name: 'Nguyen Van A', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 62000, status: 'Active', daysTaken: 12, department: 'IT', hireDate: '2025-05-05', birthMonth: 5 },
  { name: 'Nguyen Thi B', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 40000, status: 'Active', daysTaken: 6, department: 'HR', hireDate: '2024-04-15', birthMonth: 12 },
  { name: 'Tran Van C', ethnicity: 'Khác', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 68000, status: 'Inactive', daysTaken: 18, department: 'IT', hireDate: '2022-05-02', birthMonth: 9 },
  { name: 'Le Thi D', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Full-time', salary: 55000, status: 'Active', daysTaken: 4, department: 'IT', hireDate: '2023-08-10', birthMonth: 2 },
  { name: 'Pham Van E', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Part-time', salary: 32000, status: 'Active', daysTaken: 2, department: 'Finance', hireDate: '2025-01-20', birthMonth: 4 },
  { name: 'Hoang Thi F', ethnicity: 'Khác', gender: 'Female', shareholder: 'No', jobType: 'Full-time', salary: 48000, status: 'Active', daysTaken: 8, department: 'HR', hireDate: '2023-11-12', birthMonth: 6 },
  { name: 'Vo Van G', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 72000, status: 'Active', daysTaken: 11, department: 'IT', hireDate: '2021-03-05', birthMonth: 3 },
  { name: 'Dang Thi H', ethnicity: 'Kinh', gender: 'Female', shareholder: 'Yes', jobType: 'Part-time', salary: 45000, status: 'Active', daysTaken: 5, department: 'Finance', hireDate: '2024-02-18', birthMonth: 8 },
  { name: 'Bui Van I', ethnicity: 'Khác', gender: 'Male', shareholder: 'No', jobType: 'Full-time', salary: 52000, status: 'Inactive', daysTaken: 15, department: 'HR', hireDate: '2020-07-25', birthMonth: 1 },
  { name: 'Vu Thi K', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Full-time', salary: 58000, status: 'Active', daysTaken: 7, department: 'IT', hireDate: '2022-09-30', birthMonth: 7 },
  { name: 'Ngo Van L', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 60000, status: 'Active', daysTaken: 10, department: 'Finance', hireDate: '2022-10-01', birthMonth: 11 },
  { name: 'Do Thi M', ethnicity: 'Khác', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 38000, status: 'Active', daysTaken: 3, department: 'HR', hireDate: '2024-05-14', birthMonth: 10 },
  { name: 'Duong Van N', ethnicity: 'Kinh', gender: 'Male', shareholder: 'No', jobType: 'Full-time', salary: 49000, status: 'Active', daysTaken: 9, department: 'IT', hireDate: '2023-01-11', birthMonth: 4 },
  { name: 'Dinh Thi O', ethnicity: 'Kinh', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 65000, status: 'Active', daysTaken: 6, department: 'IT', hireDate: '2021-06-22', birthMonth: 9 },
  { name: 'Truong Van P', ethnicity: 'Khác', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 70000, status: 'Active', daysTaken: 12, department: 'Finance', hireDate: '2020-12-05', birthMonth: 3 },
  { name: 'Ho Thi Q', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 41000, status: 'Active', daysTaken: 4, department: 'HR', hireDate: '2024-08-08', birthMonth: 5 },
  { name: 'Cao Van R', ethnicity: 'Kinh', gender: 'Male', shareholder: 'No', jobType: 'Full-time', salary: 53000, status: 'Active', daysTaken: 7, department: 'IT', hireDate: '2022-04-19', birthMonth: 12 },
  { name: 'Phan Thi S', ethnicity: 'Khác', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 64000, status: 'Active', daysTaken: 8, department: 'Finance', hireDate: '2022-02-27', birthMonth: 6 },
  { name: 'To Van T', ethnicity: 'Kinh', gender: 'Male', shareholder: 'No', jobType: 'Part-time', salary: 35000, status: 'Inactive', daysTaken: 11, department: 'HR', hireDate: '2021-09-17', birthMonth: 8 },
  { name: 'Mai Thi U', ethnicity: 'Kinh', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 67000, status: 'Active', daysTaken: 9, department: 'IT', hireDate: '2021-04-14', birthMonth: 1 },
  { name: 'Thai Van V', ethnicity: 'Khác', gender: 'Male', shareholder: 'No', jobType: 'Full-time', salary: 50000, status: 'Active', daysTaken: 6, department: 'Finance', hireDate: '2023-07-21', birthMonth: 7 },
  { name: 'Ta Thi W', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 43000, status: 'Active', daysTaken: 5, department: 'HR', hireDate: '2024-06-25', birthMonth: 10 },
  { name: 'Nguyen Van X', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 61000, status: 'Active', daysTaken: 10, department: 'IT', hireDate: '2022-05-18', birthMonth: 11 },
  { name: 'Nguyen Thi Y', ethnicity: 'Khác', gender: 'Female', shareholder: 'No', jobType: 'Full-time', salary: 56000, status: 'Active', daysTaken: 7, department: 'Finance', hireDate: '2023-03-03', birthMonth: 2 },
  { name: 'Tran Van Z', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Part-time', salary: 39000, status: 'Active', daysTaken: 4, department: 'HR', hireDate: '2024-10-10', birthMonth: 9 },
  { name: 'Ly Thi AA', ethnicity: 'Kinh', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 69000, status: 'Active', daysTaken: 13, department: 'IT', hireDate: '2020-08-18', birthMonth: 4 },
  { name: 'Ha Van BB', ethnicity: 'Khác', gender: 'Male', shareholder: 'No', jobType: 'Full-time', salary: 47000, status: 'Active', daysTaken: 6, department: 'Finance', hireDate: '2023-10-09', birthMonth: 12 },
  { name: 'Trieu Thi CC', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 34000, status: 'Active', daysTaken: 2, department: 'HR', hireDate: '2025-02-14', birthMonth: 6 },
  { name: 'Bui Van DD', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 73000, status: 'Inactive', daysTaken: 14, department: 'IT', hireDate: '2019-11-21', birthMonth: 5 },
  { name: 'Chu Thi EE', ethnicity: 'Khác', gender: 'Female', shareholder: 'No', jobType: 'Full-time', salary: 53000, status: 'Active', daysTaken: 8, department: 'Finance', hireDate: '2022-06-16', birthMonth: 3 },
  { name: 'Vuong Van FF', ethnicity: 'Kinh', gender: 'Male', shareholder: 'No', jobType: 'Part-time', salary: 37000, status: 'Active', daysTaken: 5, department: 'HR', hireDate: '2024-11-20', birthMonth: 1 },
  { name: 'Quach Thi GG', ethnicity: 'Kinh', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 66000, status: 'Active', daysTaken: 9, department: 'IT', hireDate: '2021-07-07', birthMonth: 8 },
  { name: 'Nghiem Van HH', ethnicity: 'Khác', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 71000, status: 'Active', daysTaken: 11, department: 'Finance', hireDate: '2020-05-05', birthMonth: 2 },
  { name: 'Bach Thi II', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 42000, status: 'Active', daysTaken: 4, department: 'HR', hireDate: '2024-09-02', birthMonth: 7 },
  { name: 'Kieu Van KK', ethnicity: 'Kinh', gender: 'Male', shareholder: 'No', jobType: 'Full-time', salary: 51000, status: 'Active', daysTaken: 6, department: 'IT', hireDate: '2023-04-20', birthMonth: 10 },
  { name: 'Nhan Thi LL', ethnicity: 'Khác', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 62000, status: 'Active', daysTaken: 10, department: 'Finance', hireDate: '2022-12-12', birthMonth: 12 },
  { name: 'Luu Van MM', ethnicity: 'Kinh', gender: 'Male', shareholder: 'No', jobType: 'Part-time', salary: 36000, status: 'Inactive', daysTaken: 3, department: 'HR', hireDate: '2024-12-01', birthMonth: 6 },
  { name: 'Phung Thi NN', ethnicity: 'Kinh', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 68000, status: 'Active', daysTaken: 12, department: 'IT', hireDate: '2020-09-09', birthMonth: 9 },
  { name: 'Ta Van OO', ethnicity: 'Khác', gender: 'Male', shareholder: 'No', jobType: 'Full-time', salary: 49000, status: 'Active', daysTaken: 7, department: 'Finance', hireDate: '2023-05-13', birthMonth: 5 },
  { name: 'Lao Thi PP', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 44000, status: 'Active', daysTaken: 5, department: 'HR', hireDate: '2024-07-17', birthMonth: 11 },
  { name: 'Tieu Van QQ', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 59000, status: 'Active', daysTaken: 8, department: 'IT', hireDate: '2022-08-08', birthMonth: 4 },
  { name: 'Dao Thi RR', ethnicity: 'Khác', gender: 'Female', shareholder: 'No', jobType: 'Full-time', salary: 54000, status: 'Active', daysTaken: 6, department: 'Finance', hireDate: '2022-11-22', birthMonth: 3 },
  { name: 'Chau Van SS', ethnicity: 'Kinh', gender: 'Male', shareholder: 'No', jobType: 'Part-time', salary: 38000, status: 'Active', daysTaken: 4, department: 'HR', hireDate: '2024-03-03', birthMonth: 8 },
  { name: 'Bao Thi TT', ethnicity: 'Kinh', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 63000, status: 'Active', daysTaken: 9, department: 'IT', hireDate: '2022-01-28', birthMonth: 1 },
  { name: 'Chung Van UU', ethnicity: 'Khác', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 74000, status: 'Active', daysTaken: 15, department: 'Finance', hireDate: '2019-10-15', birthMonth: 2 },
  { name: 'Khang Thi VV', ethnicity: 'Kinh', gender: 'Female', shareholder: 'No', jobType: 'Part-time', salary: 41000, status: 'Active', daysTaken: 3, department: 'HR', hireDate: '2024-01-30', birthMonth: 12 },
  { name: 'Thiều Văn WW', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Yes', jobType: 'Full-time', salary: 60000, status: 'Active', daysTaken: 10, department: 'IT', hireDate: '2022-10-25', birthMonth: 7 },
  { name: 'Trác Thị XX', ethnicity: 'Khác', gender: 'Female', shareholder: 'No', jobType: 'Full-time', salary: 55000, status: 'Active', daysTaken: 7, department: 'Finance', hireDate: '2023-02-15', birthMonth: 6 },
  { name: 'Mạch Văn YY', ethnicity: 'Kinh', gender: 'Male', shareholder: 'Part-time', salary: 35000, status: 'Inactive', daysTaken: 2, department: 'HR', hireDate: '2025-03-08', birthMonth: 5 },
  { name: 'Nghiêm Thị ZZ', ethnicity: 'Kinh', gender: 'Female', shareholder: 'Yes', jobType: 'Full-time', salary: 67000, status: 'Active', daysTaken: 12, department: 'IT', hireDate: '2021-01-15', birthMonth: 11 }
]

const getMonthFromDate = (dateString) => {
  return new Date(dateString).getMonth() + 1
}

const renderDashboard = (dataToUse) => {
  const totalEmployees = dataToUse.length
  const totalSalary = dataToUse.reduce((sum, item) => sum + item.salary, 0)
  const avgIncome = totalEmployees > 0 ? totalSalary / totalEmployees : 0
  const totalVacation = dataToUse.reduce((sum, item) => sum + item.daysTaken, 0)

  const totalPrevSalary = Math.round(totalSalary * 0.8)

  document.getElementById('kpiTotalEmployees').innerText = totalEmployees.toLocaleString()
  document.getElementById('kpiAnnualRevenue').innerText = '$' + totalSalary.toLocaleString()
  document.getElementById('kpiPrevAnnualRevenue').innerText = '$' + totalPrevSalary.toLocaleString()
  document.getElementById('kpiAvgIncome').innerText = '$' + Math.round(avgIncome).toLocaleString()
  document.getElementById('kpiTotalVacation').innerText = totalVacation.toLocaleString() + ' ngày'

  const fullTimeCount = dataToUse.filter(item => item.jobType === 'Full-time').length
  const partTimeCount = dataToUse.filter(item => item.jobType === 'Part-time').length
  const fullTimePct = totalEmployees > 0 ? Math.round((fullTimeCount / totalEmployees) * 100) : 0
  const partTimePct = totalEmployees > 0 ? Math.round((partTimeCount / totalEmployees) * 100) : 0

  document.getElementById('fullTimePercent').innerText = fullTimePct + '%'
  document.getElementById('fullTimeBar').style.width = fullTimePct + '%'
  document.getElementById('partTimePercent').innerText = partTimePct + '%'
  document.getElementById('partTimeBar').style.width = partTimePct + '%'

  const yesGroup = dataToUse.filter(item => item.shareholder === 'Yes')
  const noGroup = dataToUse.filter(item => item.shareholder === 'No')
  const yesIncome = yesGroup.reduce((sum, item) => sum + item.salary, 0)
  const noIncome = noGroup.reduce((sum, item) => sum + item.salary, 0)
  const yesDays = yesGroup.reduce((sum, item) => sum + item.daysTaken, 0)
  const noDays = noGroup.reduce((sum, item) => sum + item.daysTaken, 0)

  if (incomeChartInstance) incomeChartInstance.destroy()
  if (vacationChartInstance) vacationChartInstance.destroy()
  if (salaryComparisonChartInstance) salaryComparisonChartInstance.destroy()

  const ctxIncome = document.getElementById('incomeChart').getContext('2d')
  incomeChartInstance = new Chart(ctxIncome, {
    type: 'bar',
    data: {
      labels: ['Cổ đông', 'Nhân viên'],
      datasets: [{
        label: 'Thu nhập trung bình ($)',
        data: [
          yesGroup.length ? Math.round(yesIncome / yesGroup.length) : 0,
          noGroup.length ? Math.round(noIncome / noGroup.length) : 0
        ],
        backgroundColor: ['#6366f1', '#10b981'],
        borderRadius: 4
      }]
    },
    options: {
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } }
    }
  })

  const ctxVacation = document.getElementById('vacationPieChart').getContext('2d')
  vacationChartInstance = new Chart(ctxVacation, {
    type: 'doughnut',
    data: {
      labels: ['Cổ đông (đã nghỉ)', 'Nhân viên (đã nghỉ)'],
      datasets: [{
        data: [yesDays, noDays],
        backgroundColor: ['#6366f1', '#f59e0b'],
        borderWidth: 0
      }]
    },
    options: {
      maintainAspectRatio: false,
      cutout: '75%',
      plugins: { legend: { position: 'bottom' } }
    }
  })

  const ctxSalaryComparison = document.getElementById('salaryComparisonChart').getContext('2d')
  salaryComparisonChartInstance = new Chart(ctxSalaryComparison, {
    type: 'bar',
    data: {
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          label: 'Năm trước',
          data: [totalPrevSalary * 0.25, totalPrevSalary * 0.25, totalPrevSalary * 0.25, totalPrevSalary * 0.25],
          backgroundColor: '#829cf9',
          borderRadius: 4
        },
        {
          label: 'Năm nay',
          data: [totalSalary * 0.25, totalSalary * 0.25, totalSalary * 0.25, totalSalary * 0.25],
          backgroundColor: '#4ade80',
          borderRadius: 4
        }
      ]
    },
    options: {
      maintainAspectRatio: false,
      scales: { y: { beginAtZero: true } }
    }
  })

  // ---- Cảnh báo gộp nhóm thông minh ----
  const alertList = document.getElementById('alertList')
  alertList.innerHTML = ''

  let anniversaries = []
  let vacations = []
  let birthdays = []
  const currentMonth = 5;

  dataToUse.forEach(item => {
    const hireDateThisYear = new Date(new Date().getFullYear(), new Date(item.hireDate).getMonth(), new Date(item.hireDate).getDate())
    const diffTime = hireDateThisYear.getTime() - new Date().getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays >= 0 && diffDays <= 7) {
      anniversaries.push(item.name)
    }

    if (item.daysTaken > 10) {
      vacations.push(item.name)
    }

    if (item.birthMonth === currentMonth) {
      birthdays.push(item.name)
    }
  })

  let listElements = []

  if (anniversaries.length > 0) {
    listElements.push({
      text: `Kỷ niệm tuyển dụng (${anniversaries.length} người): ${anniversaries.join(', ')}`
    })
  }

  if (vacations.length > 0) {
    listElements.push({
      text: `Nghỉ phép vượt quá quy định (${vacations.length} người): ${vacations.join(', ')}`
    })
  }

  if (birthdays.length > 0) {
    listElements.push({
      text: `Sinh nhật trong tháng (${birthdays.length} người): ${birthdays.join(', ')}`,
      hasBtn: true
    })
  }

  if (listElements.length === 0) {
    alertList.innerHTML = `<li class="text-gray-400">Không có cảnh báo nào cho điều kiện này.</li>`
  } else {
    listElements.forEach(itemObj => {
      let li = document.createElement('li');
      li.className = 'flex justify-between items-center bg-emerald-50 px-3 py-2 rounded-md border border-emerald-100';

      let textSpan = document.createElement('span');
      textSpan.textContent = itemObj.text;
      li.appendChild(textSpan);

      if (itemObj.hasBtn) {
        let viewBtn = document.createElement('button');
        viewBtn.textContent = 'Xem';
        viewBtn.className = 'ml-4 bg-emerald-600 text-white text-[10px] font-bold py-1 px-3 rounded uppercase hover:bg-emerald-700 transition';
        viewBtn.onclick = (e) => {
          e.preventDefault();
          router.push('/Brithday-list');
        };
        li.appendChild(viewBtn);
      }
      alertList.appendChild(li);
    })
  }

  const tableBody = document.querySelector('#employeeTable tbody')
  tableBody.innerHTML = ''

  if (dataToUse.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="8" class="text-center p-4">Không có dữ liệu phù hợp.</td></tr>`
    return
  }

  const rowsPerPageSelect = document.getElementById('rowsPerPage');
  let displayLimit = rowsPerPageSelect ? rowsPerPageSelect.value : '10';

  let itemsToDisplay = dataToUse.slice(0, parseInt(displayLimit, 10));

  itemsToDisplay.forEach(item => {
    const color = item.shareholder === 'Yes' ? 'text-blue-600' : 'text-slate-600'
    const statusColor = item.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
    tableBody.innerHTML += `
      <tr>
        <td class="font-medium">${item.name}</td>
        <td>${item.ethnicity}</td>
        <td>${item.gender}</td>
        <td><span class="${color} font-semibold">${item.shareholder}</span></td>
        <td>${item.jobType}</td>
        <td>${item.department}</td>
        <td class="font-mono">$${item.salary.toLocaleString()}</td>
        <td><span class="status-pill ${statusColor}">${item.status}</span></td>
      </tr>`
  })
}

const applyFilter = () => {
  const eth = document.getElementById('filterEthnicity').value
  const gen = document.getElementById('filterGender').value
  const sh = document.getElementById('filterShareholder').value
  const job = document.getElementById('filterJobType').value
  const dept = document.getElementById('filterDepartment').value

  const filteredData = masterData.filter(item => {
    return (!eth || item.ethnicity === eth) &&
           (!gen || item.gender === gen) &&
           (!sh || item.shareholder === sh) &&
           (!job || item.jobType === job) &&
           (!dept || item.department === dept)
  })

  renderDashboard(filteredData)
}

const searchTable = () => {
  const input = document.getElementById('searchInput').value.toLowerCase()
  const rows = document.querySelectorAll('#employeeTable tbody tr')
  rows.forEach(row => {
    row.style.display = row.innerText.toLowerCase().includes(input) ? '' : 'none'
  })
}

onMounted(() => {
  renderDashboard(masterData)
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