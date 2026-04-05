<template>
  <div class="card table-card">
    <div v-if="!isCreating">
      <div class="card-header">
        Validation - <a href="javascript:void(0)" class="create-link" @click="isCreating = true">Add New Record</a>
      </div>
      
      <div class="card-body">
        <div class="table-controls-wrapper">
          <div class="show-entries">
            Show 
            <select v-model="perPage" @change="currentPage = 1">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
            entries
          </div>

          <div class="date-filter-box">
            <div class="filter-item">
              <label>From:</label>
              <input type="date" v-model="startDate" @change="currentPage = 1" />
            </div>
            <div class="filter-item">
              <label>To:</label>
              <input type="date" v-model="endDate" @change="currentPage = 1" />
            </div>
            <button class="btn-reset" @click="resetDate">Reset</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Work Date</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Status</th>
                <th></th> 
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in paginatedData" :key="i">
                <td class="font-bold">{{ row.empName }}</td>
                <td>{{ row.date }}</td>
                <td>{{ row.startTime }}</td>
                <td>{{ row.endTime }}</td>
                <td>
                  <span :class="['status-tag', row.status.toLowerCase()]">
                    {{ row.status }}
                  </span>
                </td>
                <td class="actions">
                  <a href="#">Verify</a> | <a href="#">Edit</a>
                </td>
              </tr>
              <tr v-if="paginatedData.length === 0">
                <td colspan="6" style="text-align: center; padding: 30px; color: #999;">
                  No validation records found for this period.
                </td>
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
              <button 
                v-for="p in totalPages" 
                :key="p" 
                @click="currentPage = p" 
                :class="['page-num-btn', { active: currentPage === p }]"
              >
                {{ p }}
              </button>
            </div>
            <button class="nav-btn" @click="currentPage++" :disabled="currentPage >= totalPages">›</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="card-header">Add New Validation Record</div>
      <div class="card-body">
        <div class="form-container">
          <div class="form-group">
            <label>Employee Name</label>
            <input type="text" v-model="formData.empName" placeholder="Enter full name" />
          </div>
          <div class="form-group">
            <label>Work Date</label>
            <input type="date" v-model="formData.date" />
          </div>
          <div class="form-group">
            <label>Start Time</label>
            <input type="time" v-model="formData.startTime" />
          </div>
          <div class="form-group">
            <label>End Time</label>
            <input type="time" v-model="formData.endTime" />
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="formData.status">
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div class="form-actions">
            <button class="btn-create" @click="addRecord">Create Record</button>
            <button class="btn-back" @click="isCreating = false">Back to List</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const isCreating = ref(false);

const rawData = ref([
  { empName: "Nguyen Van A", date: "2026-04-01", startTime: "08:00", endTime: "17:00", status: "Approved" },
  { empName: "Tran Thi B", date: "2026-04-02", startTime: "08:30", endTime: "17:30", status: "Pending" },
  { empName: "Le Van C", date: "2026-04-03", startTime: "09:00", endTime: "18:00", status: "Approved" },
  { empName: "Pham Minh D", date: "2026-04-05", startTime: "08:00", endTime: "12:00", status: "Rejected" },
  { empName: "Nguyen Van A", date: "2026-03-25", startTime: "08:00", endTime: "17:00", status: "Approved" },
  { empName: "Tran Thi B", date: "2026-03-20", startTime: "08:00", endTime: "17:00", status: "Approved" },
  { empName: "Hoang E", date: "2026-04-05", startTime: "10:00", endTime: "19:00", status: "Pending" },
]);

const formData = ref({
  empName: "",
  date: "",
  startTime: "",
  endTime: "",
  status: "Pending"
});

const perPage = ref(10);
const currentPage = ref(1);
const startDate = ref("");
const endDate = ref("");

const addRecord = () => {
  if (formData.value.empName && formData.value.date) {
    rawData.value.unshift({ ...formData.value });
    isCreating.value = false;
    // Reset form
    formData.value = { empName: "", date: "", startTime: "", endTime: "", status: "Pending" };
    currentPage.value = 1;
  } else {
    alert("Please fill in Employee Name and Date.");
  }
};

const filteredData = computed(() => {
  return rawData.value.filter(item => {
    const itemDate = new Date(item.date);
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;
    if (start && itemDate < start) return false;
    if (end && itemDate > end) return false;
    return true;
  });
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage.value) || 1);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredData.value.slice(start, start + perPage.value);
});

const startIdx = computed(() => filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const endIdx = computed(() => Math.min(currentPage.value * perPage.value, filteredData.value.length));

const resetDate = () => {
  startDate.value = "";
  endDate.value = "";
  currentPage.value = 1;
};
</script>

<style scoped>
/* Card & Header */
.table-card { border: 1px solid #ddd; border-radius: 4px; margin: 20px; background: #fff; box-shadow: 0 1px 1px rgba(0,0,0,.05); font-family: sans-serif; }
.card-header { padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa; color: #333; }
.create-link { color: #58c9f3; text-decoration: none; font-weight: normal; font-size: 13px; cursor: pointer; }
.card-body { padding: 15px; }

/* Controls */
.table-controls-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 13px; color: #666; }
.date-filter-box { display: flex; align-items: center; gap: 10px; }
.filter-item { display: flex; align-items: center; gap: 5px; }
.filter-item input { border: 1px solid #ddd; padding: 4px 8px; border-radius: 4px; outline: none; }
.btn-reset { background: #f5f5f5; border: 1px solid #ddd; padding: 4px 12px; border-radius: 4px; cursor: pointer; }

/* Table */
.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.data-table th { background-color: #f9f9f9; text-align: left; padding: 12px; border: 1px solid #eee; color: #444; font-size: 13px; }
.data-table td { padding: 12px; border: 1px solid #eee; color: #666; font-size: 13px; }
.font-bold { font-weight: bold; color: #333; }

/* Status Tags */
.status-tag { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; }
.approved { background: #e6f4ea; color: #1e7e34; }
.pending { background: #fff3cd; color: #856404; }
.rejected { background: #f8d7da; color: #721c24; }
.actions a { color: #58c9f3; text-decoration: none; }

/* Pagination */
.table-footer-wrapper { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; font-size: 13px; color: #777; }
.pagination-container { display: flex; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
.nav-btn, .page-num-btn { border: none; background: white; padding: 6px 12px; cursor: pointer; color: #337ab7; border-right: 1px solid #ddd; }
.page-num-btn.active { background-color: #337ab7; color: white; }
.nav-btn:disabled { color: #bbb; cursor: not-allowed; background: #fafafa; }

/* Form Styles */
.form-container { padding-top: 10px; }
.form-group { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.form-group label { flex: 0 0 180px; text-align: right; padding-right: 20px; color: #666; font-size: 14px; }
.form-group input, .form-group select { width: 350px; padding: 8px 12px; border: 1px solid #ddd; border-radius: 4px; outline: none; }
.form-actions { margin-top: 25px; padding-left: 200px; }
.btn-create { background: #58c9f3; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; font-weight: bold; margin-right: 10px; }
.btn-back { background: #f5f5f5; border: 1px solid #ddd; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
</style>