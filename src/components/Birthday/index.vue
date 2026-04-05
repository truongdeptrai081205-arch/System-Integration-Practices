<template>
  <div class="summary-card">
      <div class="summary-item">
        <div class="summary-value">{{ totalRecords  }}</div>
        <div class="summary-label">Total Records</div>
      </div>
    </div>
  <div class="card table-card">
    <div v-if="!isCreating">
      <div class="card-header">
        Birthday Management - <a href="javascript:void(0)" class="create-link" @click="isCreating = true">Add New Record</a>
      </div>
      
      <div class="card-body">
        <div class="table-controls-wrapper">
          <div class="show-entries">
            Show 
            <select v-model="perPage" @change="currentPage = 1">
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
            </select>
            entries
          </div>

          <div class="date-filter-box">
            <div class="filter-item">
              <label>Search Birth Date:</label>
              <input type="date" v-model="searchDate" @change="currentPage = 1" />
            </div>
            <button class="btn-reset" @click="resetFilters">Reset</button>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Employee_ID</th>
                <th>First_Name</th>
                <th>Last_Name</th>
                <th>Birth_Date</th>
               
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, i) in paginatedData" :key="i">
                <td class="font-bold">{{ row.Employee_ID }}</td>
                <td>{{ row.First_Name }}</td>
                <td>{{ row.Last_Name }}</td>
                <td>{{ formatDate(row.Birth_Date) }}</td>
              </tr>
              <tr v-if="paginatedData.length === 0">
                <td colspan="6" style="text-align: center; padding: 30px; color: #999;">
                  No records found for this date.
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
      <div class="card-header">Add New Birthday Record</div>
      <div class="card-body">
        <div class="form-container">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" v-model="formData.name" placeholder="Enter name" />
          </div>
          <div class="form-group">
            <label>Birth Date</label>
            <input type="date" v-model="formData.date" />
          </div>
          <div class="form-group">
            <label>Relationship</label>
            <select v-model="formData.relation">
              <option value="Family">Family</option>
              <option value="Friend">Friend</option>
              <option value="Work">Work</option>
            </select>
          </div>
          <div class="form-group">
            <label>Status</label>
            <select v-model="formData.status">
              <option value="Done">Done</option>
              <option value="Pending">Pending</option>
            </select>
          </div>
          <div class="form-actions">
            <button class="btn-create" @click="addRecord">Save Record</button>
            <button class="btn-back" @click="isCreating = false">Back to List</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';

const isCreating = ref(false);
const searchDate = ref("");

const rawData = ref([]);
const totalRecords = ref(0);

const perPage = ref(10);
const currentPage = ref(1);

const fetchBirthdays = async () => {
  try {
    let day = "";
    let month = "";
    if (searchDate.value) {
      const d = new Date(searchDate.value);
      day = d.getDate();
      month = d.getMonth() + 1;
    }

    const response = await axios.get("http://localhost:4000/api/alerts/birthday", {
      params: {
        day,
        month,
        page: currentPage.value,
        pageSize: perPage.value
      }
    });
     rawData.value = response.data.data.map(item => ({
      First_Name: item.First_Name,
      Last_Name: item.Last_Name,
      Birth_Date: item.Birth_Date,
      Employee_ID: item.Employee_ID
    }));

    totalRecords.value = response.data.total;

  } catch (err) {
    console.error("Error fetching birthdays:", err);
  }
};
watch([currentPage, perPage, searchDate], () => {
  fetchBirthdays();
});
onMounted(() => {
  fetchBirthdays();
});

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return `${d.getDate()}/${d.getMonth()+1}/${d.getFullYear()}`;
};

const totalPages = computed(() => Math.ceil(totalRecords.value / perPage.value) || 1);
const paginatedData = computed(() => rawData.value);

const startIdx = computed(() => rawData.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const endIdx = computed(() => Math.min(currentPage.value * perPage.value, totalRecords.value));

const resetFilters = () => {
  searchDate.value = "";
  currentPage.value = 1;
};

const filteredData = computed(() => {
  if (!searchDate.value) return true;
  const d = new Date(item.Birth_Date);
  const formatted = d.toISOString().split('T')[0]; // 'YYYY-MM-DD'
  return formatted === searchDate.value;
});

</script>

<style scoped>

.summary-card { display: flex; justify-content: space-around; background: #f0f8ff; border-radius: 6px; padding: 15px; margin: 20px 0; box-shadow: 0 1px 3px rgba(0,0,0,0.1); font-family: sans-serif; }
.summary-item { text-align: center; }
.summary-value { font-size: 24px; font-weight: bold; color: #337ab7; }
.summary-label { font-size: 13px; color: #555; margin-top: 4px; }
.table-card { border: 1px solid #ddd; border-radius: 4px; margin: 20px; background: #fff; box-shadow: 0 1px 1px rgba(0,0,0,.05); font-family: sans-serif; }
.card-header { padding: 10px 15px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa; color: #333; }
.create-link { color: #58c9f3; text-decoration: none; font-size: 13px; cursor: pointer; }
.card-body { padding: 15px; }

.table-controls-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 13px; color: #666; }
.date-filter-box { display: flex; align-items: center; gap: 10px; }
.filter-item { display: flex; align-items: center; gap: 8px; }
.filter-item input { border: 1px solid #ddd; padding: 5px 8px; border-radius: 4px; outline: none; }

.btn-reset { background: #f5f5f5; border: 1px solid #ddd; padding: 5px 12px; border-radius: 4px; cursor: pointer; }

.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.data-table th { background-color: #f9f9f9; text-align: left; padding: 12px; border: 1px solid #eee; color: #444; font-size: 13px; }
.data-table td { padding: 12px; border: 1px solid #eee; color: #666; font-size: 13px; }
.font-bold { font-weight: bold; color: #333; }

.status-tag { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; }
.done { background: #e6f4ea; color: #1e7e34; }
.pending { background: #fff3cd; color: #856404; }

.actions a { color: #58c9f3; text-decoration: none; }
.table-footer-wrapper { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; font-size: 13px; color: #777; }
.pagination-container { display: flex; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }
.nav-btn, .page-num-btn { border: none; background: white; padding: 6px 12px; cursor: pointer; color: #337ab7; border-right: 1px solid #ddd; }
.page-num-btn.active { background-color: #337ab7; color: white; }

.form-group { display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #f0f0f0; }
.form-group label { flex: 0 0 150px; text-align: right; padding-right: 20px; color: #666; }
.form-group input, .form-group select { width: 300px; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
.form-actions { margin-top: 20px; padding-left: 170px; }
.btn-create { background: #58c9f3; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; margin-right: 10px; }
.btn-back { background: #f5f5f5; border: 1px solid #ddd; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
</style>