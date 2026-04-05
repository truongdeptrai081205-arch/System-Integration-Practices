<template>
  <div class="container">
    <div v-if="!isCreating" class="card table-card">
      <div class="card-header">
        Index - <a href="#" class="create-link" @click.prevent="isCreating = true">Create New</a>
      </div>
      
      <div class="card-body">
        <div class="table-controls-wrapper">
          <div class="show-entries">
            Show 
            <select v-model="perPage">
              <option :value="10">10</option>
              <option :value="25">25</option>
              <option :value="50">50</option>
            </select>
            entries
          </div>

          <div class="search-box">
            Search: <input type="text" v-model="searchQuery" placeholder="Tìm kiếm ngay..." />
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Department</th>
                <th>Division</th>
                <th>Start_Date</th>
                <th>End_Date</th>
                <th>Job_Category</th>
                <th>Location</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in paginatedData" :key="i">
                <td>{{ row.fullName }}</td>
                <td>{{ row.department }}</td>
                <td>{{ row.division }}</td>
                <td>{{ row.startDate }}</td>
                <td>{{ row.endDate }}</td>
                <td>{{ row.jobCategory }}</td>
                <td>{{ row.location }}</td>
              </tr>
              <tr v-if="filteredData.length === 0">
                <td colspan="7" class="no-data">No data available in table</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="table-footer-wrapper">
          <div class="info-text">
            Showing {{ startIdx }} to {{ endIdx }} of {{ filteredData.length }} entries
          </div>
          <div class="pagination-container">
            <button class="nav-btn" @click="currentPage--" :disabled="currentPage === 1">‹</button>
            <div class="page-numbers">
              <button v-for="p in totalPages" :key="p" @click="currentPage = p" :class="['page-num-btn', { active: currentPage === p }]">
                {{ p }}
              </button>
            </div>
            <button class="nav-btn" @click="currentPage++" :disabled="currentPage >= totalPages">›</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="card form-card">
      <div class="form-header">
        <h1>Create</h1>
        <p class="subtitle">Job_History</p>
      </div>

      <div class="form-body">
        <div class="form-group-row">
          <label>Employee_ID</label>
          <select v-model="form.employeeId">
            <option value=""></option>
            <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
          </select>
        </div>

        <div class="form-group-row">
          <label>Department</label>
          <input type="text" v-model="form.department" />
        </div>

        <div class="form-group-row">
          <label>Division</label>
          <input type="text" v-model="form.division" />
        </div>

        <div class="form-group-row">
          <label>Start_Date</label>
          <input type="date" v-model="form.startDate" class="datepicker-input" />
        </div>

        <div class="form-group-row">
          <label>End_Date</label>
          <input type="date" v-model="form.endDate" class="datepicker-input" />
        </div>

        <div class="form-group-row">
          <label>Job_Title</label>
          <input type="text" v-model="form.jobTitle" />
        </div>

        <div class="form-group-row">
          <label>Supervisor</label>
          <input type="text" v-model="form.supervisor" />
        </div>

        <div class="form-group-row">
          <label>Job_Category</label>
          <input type="text" v-model="form.jobCategory" />
        </div>

        <div class="form-group-row">
          <label>Location</label>
          <input type="text" v-model="form.location" />
        </div>

        <div class="form-group-row">
          <label>Departmen_Code</label>
          <input type="text" v-model="form.deptCode" />
        </div>

        <div class="form-group-row">
          <label>Salary_Type</label>
          <input type="text" v-model="form.salaryType" />
        </div>

        <div class="form-group-row">
          <label>Pay_Period</label>
          <input type="text" v-model="form.payPeriod" />
        </div>

        <div class="form-group-row">
          <label>Hours_per_Week</label>
          <input type="text" v-model="form.hours" />
        </div>

        <div class="form-group-row">
          <label>Hazardous_Training</label>
          <select v-model="form.hazardous">
            <option value="Not Set">Not Set</option>
            <option value="True">True</option>
            <option value="False">False</option>
          </select>
        </div>

        <div class="form-actions">
          <button class="btn-submit" @click="saveData">Create</button>
          <div class="back-link-wrapper">
            <a href="#" class="back-link" @click.prevent="isCreating = false">Back to List</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const isCreating = ref(false);
const perPage = ref(10);
const currentPage = ref(1);
const searchQuery = ref('');

const jobHistoryList = ref(Array.from({ length: 20 }, (_, i) => ({
  fullName: `Employee ${i + 1}`,
  department: i % 2 === 0 ? "IT" : "HR",
  division: "General",
  startDate: "2024-01-01",
  endDate: "2025-01-01",
  jobCategory: "Full-time",
  location: "Vietnam"
})));

const form = ref({
  employeeId: '',
  department: '',
  division: '',
  startDate: '', 
  endDate: '',
  jobTitle: '',
  supervisor: '',
  jobCategory: '',
  location: '',
  deptCode: '',
  salaryType: '',
  payPeriod: '',
  hours: '',
  hazardous: 'Not Set'
});

// Real-time filtering logic
const filteredData = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return jobHistoryList.value;
  
  return jobHistoryList.value.filter(item => 
    Object.values(item).some(val => 
      String(val).toLowerCase().includes(query)
    )
  );
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage.value) || 1);
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredData.value.slice(start, start + perPage.value);
});
const startIdx = computed(() => filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const endIdx = computed(() => Math.min(currentPage.value * perPage.value, filteredData.value.length));

watch(searchQuery, () => {
  currentPage.value = 1;
});

const saveData = () => {
  jobHistoryList.value.unshift({
    fullName: "User Input",
    department: form.value.department,
    division: form.value.division,
    startDate: form.value.startDate,
    endDate: form.value.endDate,
    jobCategory: form.value.jobCategory,
    location: form.value.location
  });
  isCreating.value = false;
  form.value = { hazardous: 'Not Set' };
};
</script>

<style scoped>
.container { padding: 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #fdfdfd; min-height: 100vh; color: #333; }
.card { background: #fff; border-radius: 4px; }

.card-header { font-size: 20px; margin-bottom: 20px; color: #333; }
.create-link { color: #00afea; text-decoration: none; font-size: 14px; }
.table-controls-wrapper { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; font-size: 14px; }
.search-box input { border: 1px solid #ccc; padding: 4px 8px; border-radius: 3px; outline: none; }

.data-table { width: 100%; border-collapse: collapse; }
.data-table th { text-align: left; padding: 12px; border: 1px solid #dee2e6; background: #fff; font-weight: 600; }
.data-table td { padding: 12px; border: 1px solid #dee2e6; color: #444; }

.table-footer-wrapper { display: flex; justify-content: space-between; align-items: center; margin-top: 15px; font-size: 14px; }
.pagination-container { display: flex; border: 1px solid #dee2e6; }
.nav-btn, .page-num-btn { background: #fff; border: none; border-left: 1px solid #dee2e6; padding: 5px 12px; cursor: pointer; color: #007bff; }
.nav-btn:first-child { border-left: none; }
.page-num-btn.active { background: #007bff; color: #fff; }

.form-header h1 { font-size: 36px; font-weight: 400; margin-bottom: 0; }
.subtitle { font-size: 20px; font-weight: 600; margin-top: 5px; margin-bottom: 40px; color: #333; }

.form-body { display: flex; flex-direction: column; gap: 4px; }
.form-group-row { display: flex; align-items: center; }
.form-group-row label { width: 160px; text-align: right; margin-right: 15px; font-size: 14px; color: #555; }
.form-group-row input, .form-group-row select { width: 400px; padding: 5px; border: 1px solid #aaa; border-radius: 2px; height: 30px; box-sizing: border-box; }

.datepicker-input { font-family: inherit; }

.form-actions { margin-left: 175px; margin-top: 20px; }
.btn-submit { background-color: #f4f4f4; border: 1px solid #ccc; padding: 5px 15px; font-size: 14px; border-radius: 3px; cursor: pointer; color: #333; }
.btn-submit:hover { background-color: #e8e8e8; }
.back-link-wrapper { margin-top: 10px; }
.back-link { color: #00afea; text-decoration: none; font-size: 14px; }
</style>```