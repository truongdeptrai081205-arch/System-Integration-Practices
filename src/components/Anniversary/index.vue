<template>
  <div class="card table-card">
    <div v-if="!isCreating">
      <div class="card-header">
        Anniversary - <a href="javascript:void(0)" class="create-link" @click="isCreating = true">Add New Record</a>
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
          <input type="date" v-model="tempStartDate" />
        </div>
        <div class="filter-item">
          <label>To:</label>
          <input type="date" v-model="tempEndDate" />
        </div>
        <button class="btn-reset" @click="resetDate">Reset</button>
        <button class="btn-apply" @click="applyDateFilter">Apply Filter</button>
</div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Employee_ID</th>
                <th>Hire_Date</th>
                <th>RowNum</th>
               
              </tr>
            </thead>
            <tbody>
             <tr v-for="(row, i) in paginatedData" :key="i">
              <td class="font-bold">{{ row.empName }}</td> <!-- Employee_ID -->
              <td>{{ row.date }}</td> <!-- Hire_Date -->
              <td>{{ row.rowNum }}</td> <!-- RowNum -->
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
            Showing {{ startIdx }} to {{ endIdx }} of {{ totalRecords }} entries
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
import { ref, computed, watch } from 'vue';
import axios from 'axios';
import { onMounted } from 'vue';

onMounted(() => {
  fetchData();
});

const isCreating = ref(false);

// Dữ liệu sẽ lấy từ BE
const rawData = ref([]);

const formData = ref({
  empName: "",
  date: "",
  startTime: "",
  endTime: "",
  status: "Pending"
});

const tempStartDate = ref("");
const tempEndDate = ref("");
const startDate = ref("");
const endDate = ref("");

const perPage = ref(50); // mặc định BE limit 50
const currentPage = ref(1);
const totalRecords = ref(0); // tổng số bản ghi từ BE

// Fetch dữ liệu từ BE
const fetchData = async () => {
  try {
    const params = {
      startDate: startDate.value || "",
      endDate: endDate.value || "",
      limit: perPage.value,
      page: currentPage.value
    };
    const res = await axios.get("http://localhost:4000/api/alerts/anniversary", { params });
    
    // Chuyển đổi dữ liệu BE về format giống rawData
    rawData.value = res.data.data.map(item => ({
      empName: item.Employee_ID, // bạn có thể đổi sang tên nếu API trả name
      date: item.Hire_Date.split("T")[0], // chỉ lấy ngày
      startTime: "", // BE chưa có startTime, giữ trống
      endTime: "",   // BE chưa có endTime
      rowNum: item.RowNum
    }));

    totalRecords.value = res.data.total || res.data.data.length; // nếu BE trả total
  } catch (err) {
    console.error(err);
    rawData.value = [];
  }
};

// Áp dụng filter ngày và reset
const applyDateFilter = () => {
  startDate.value = tempStartDate.value;
  endDate.value = tempEndDate.value;
  currentPage.value = 1;
  fetchData();
};

const resetDate = () => {
  tempStartDate.value = "";
  tempEndDate.value = "";
  startDate.value = "";
  endDate.value = "";
  currentPage.value = 1;
  fetchData();
};

// Khi đổi page hoặc perPage, tự động gọi BE
watch([currentPage, perPage], () => {
  fetchData();
});

// Hàm thêm record (chỉ local, nếu muốn gửi lên BE cần axios.post)
const addRecord = () => {
  if (formData.value.empName && formData.value.date) {
    rawData.value.unshift({ ...formData.value });
    isCreating.value = false;
    formData.value = { empName: "", date: "", startTime: "", endTime: "", status: "Pending" };
    currentPage.value = 1;
  } else {
    alert("Please fill in Employee Name and Date.");
  }
};

// Tổng trang dựa vào BE limit và total
const totalPages = computed(() => Math.ceil(totalRecords.value / perPage.value) || 1);

// Dữ liệu hiện thị trên bảng
const paginatedData = computed(() => rawData.value);

const startIdx = computed(() => rawData.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const endIdx = computed(() => Math.min(currentPage.value * perPage.value, totalRecords.value));

// Lần đầu mở trang fetch dữ liệu
fetchData();
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