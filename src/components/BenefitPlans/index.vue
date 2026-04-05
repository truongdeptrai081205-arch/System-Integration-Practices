<template>
  <div class="card table-card">
    <div class="card-header">
      Benefit Plans - <a href="#" class="create-link">Create New</a>
    </div>
    
    <div class="card-body">
      <div class="table-controls-wrapper">
        <div class="show-entries">
          Show 
          <select v-model="perPage" @change="currentPage = 1">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          entries
        </div>
        <div class="search-box">
          Search: <input v-model="searchQuery" @input="currentPage = 1" placeholder="Filter plans..." />
        </div>
      </div>

      <div class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Plan Name</th>
              <th>Deductable</th>
              <th>Percentage CoPay</th>
              <th></th> 
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in paginatedData" :key="i">
              <td>{{ row.planName }}</td>
              <td>{{ row.deductable }}</td>
              <td>{{ row.coPay }}</td>
              <td class="actions">
                <a href="#">Edit</a> | <a href="#">Details</a> | <a href="#">Delete</a>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td colspan="4" style="text-align: center; padding: 20px;">No data found</td>
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
</template>

<script setup>
import { ref, computed } from 'vue';

// Dữ liệu mẫu
const rawData = ref([
  { planName: "Standard Plan", deductable: "$500", coPay: "20%" },
  { planName: "Premium Plan", deductable: "$0", coPay: "10%" },
  { planName: "Basic Plan", deductable: "$1000", coPay: "30%" },
  { planName: "Gold Care Plus", deductable: "$250", coPay: "15%" },
  { planName: "Silver Economy", deductable: "$750", coPay: "25%" },
  { planName: "Platinum Executive", deductable: "$0", coPay: "5%" },
  { planName: "Family Starter", deductable: "$1200", coPay: "35%" },
  { planName: "Student Health", deductable: "$100", coPay: "10%" },
  { planName: "Senior Support", deductable: "$300", coPay: "20%" },
  { planName: "Corporate Elite", deductable: "$0", coPay: "12%" },
  { planName: "Small Biz Basic", deductable: "$600", coPay: "20%" },
  { planName: "Global Traveler", deductable: "$450", coPay: "15%" },
  { planName: "Dental & Vision Lite", deductable: "$50", coPay: "50%" },
  { planName: "High Deductible Saver", deductable: "$3000", coPay: "0%" },
  { planName: "Mid-Range Wellness", deductable: "$800", coPay: "20%" },
  { planName: "Ultimate Protection", deductable: "$150", coPay: "10%" },
  //data table
]);

const searchQuery = ref("");
const perPage = ref(10);
const currentPage = ref(1);

// Xử lý Search
const filteredData = computed(() => {
  return rawData.value.filter(item => 
    item.planName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Tính tổng số trang
const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage.value) || 1);

// Dữ liệu cắt theo trang
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredData.value.slice(start, end);
});

// Tính toán chỉ số hiển thị (Ví dụ: 1 to 10)
const startIdx = computed(() => filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const endIdx = computed(() => {
  const end = currentPage.value * perPage.value;
  return end > filteredData.value.length ? filteredData.value.length : end;
});
</script>

<style scoped>
/* Main Card */
.table-card { border: 1px solid #ddd; border-radius: 4px; margin: 20px; background: #fff; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
.card-header { padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa; color: #333; }
.create-link { color: #58c9f3; text-decoration: none; font-weight: normal; font-size: 13px; margin-left: 5px; }
.card-body { padding: 0 15px 15px 15px; }

/* Top Controls (Show entries & Search) */
.table-controls-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 20px 0; font-size: 13px; color: #666; }
.search-box input { border: 1px solid #ddd; padding: 6px 10px; border-radius: 4px; outline: none; margin-left: 5px; }
.search-box input:focus { border-color: #58c9f3; }

/* Table Style */
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { background-color: #f9f9f9; text-align: left; padding: 12px; border: 1px solid #eee; color: #444; font-size: 14px; }
.data-table td { padding: 12px; border: 1px solid #eee; color: #666; font-size: 13px; }
.actions a { color: #58c9f3; text-decoration: none; font-size: 12px; }

/* Pagination Professional UI */
.table-footer-wrapper { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; font-size: 13px; color: #777; }

.pagination-container { display: flex; border: 1px solid #ddd; border-radius: 4px; overflow: hidden; }

.nav-btn, .page-num-btn {
  border: none;
  background: white;
  padding: 8px 14px;
  cursor: pointer;
  color: #337ab7;
  font-size: 14px;
  border-right: 1px solid #ddd;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
}

.nav-btn:last-child { border-right: none; }

.page-numbers { display: flex; }

.page-num-btn.active {
  background-color: #337ab7;
  color: white;
  border-color: #337ab7;
  cursor: default;
}

.page-num-btn:hover:not(.active), .nav-btn:hover:not(:disabled) {
  background-color: #eeeeee;
}

.nav-btn:disabled { color: #bbb; cursor: not-allowed; background: #fafafa; }
</style>