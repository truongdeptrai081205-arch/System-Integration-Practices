<template>
  <div class="card table-card">

    <div v-if="!isCreating">
      <div class="card-header">
        Benefit Plans - 
        <a href="javascript:void(0)" class="create-link" @click="isCreating = true">
          Create New
        </a>
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
            Search: 
            <input 
              v-model="searchQuery" 
              @input="currentPage = 1" 
              placeholder="Filter plans..." 
            />
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
                  <a href="#">Edit</a> | 
                  <a href="#">Details</a> | 
                  <a href="#">Delete</a>
                </td>
              </tr>

              <tr v-if="paginatedData.length === 0">
                <td colspan="4" style="text-align: center; padding: 20px;">
                  No data found
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
            <button 
              class="nav-btn" 
              @click="currentPage--" 
              :disabled="currentPage === 1"
            >
              ‹
            </button>
            
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

            <button 
              class="nav-btn" 
              @click="currentPage++" 
              :disabled="currentPage >= totalPages"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else>
      <div class="card-header">Create Benefit Plan</div>

      <div class="card-body">
        <div class="form-container">
          <div class="form-group">
            <label>Plan Name</label>
            <input 
              type="text" 
              v-model="formData.planName" 
              placeholder="e.g. Health Plus" 
            />
          </div>

          <div class="form-group">
            <label>Deductable ($)</label>
            <input 
              type="text" 
              v-model="formData.deductable" 
              placeholder="e.g. $500" 
            />
          </div>

          <div class="form-group">
            <label>Percentage CoPay (%)</label>
            <input 
              type="text" 
              v-model="formData.coPay" 
              placeholder="e.g. 20%" 
            />
          </div>

          <div class="form-actions">
            <button class="btn-create" @click="createBenefitPlan">
              Create
            </button>
            <button class="btn-back" @click="isCreating = false">
              Back to List
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>


<script setup>
import { ref, computed } from 'vue';

// --- TRẠNG THÁI (STATE) ---
const isCreating = ref(false);

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
]);

const formData = ref({
  planName: "",
  deductable: "",
  coPay: ""
});

const searchQuery = ref("");
const perPage = ref(10);
const currentPage = ref(1);


// --- XỬ LÝ DỮ LIỆU (LOGIC) ---

const createBenefitPlan = () => {
  if (formData.value.planName) {
    // Thêm ký tự $ hoặc % nếu người dùng quên nhập
    const finalDeductable = formData.value.deductable.startsWith('$') 
      ? formData.value.deductable 
      : `$${formData.value.deductable}`;
      
    const finalCoPay = formData.value.coPay.endsWith('%') 
      ? formData.value.coPay 
      : `${formData.value.coPay}%`;

    rawData.value.unshift({
      planName: formData.value.planName,
      deductable: finalDeductable,
      coPay: finalCoPay
    });
    
    // Reset form và quay lại table
    isCreating.value = false;
    formData.value = { planName: "", deductable: "", coPay: "" };
    currentPage.value = 1;
  } else {
    alert("Please enter Plan Name");
  }
};


// --- TÍNH TOÁN (COMPUTED) ---

const filteredData = computed(() => {
  return rawData.value.filter(item => 
    item.planName.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredData.value.length / perPage.value) || 1;
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredData.value.slice(start, start + perPage.value);
});

const startIdx = computed(() => {
  return filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1;
});

const endIdx = computed(() => {
  return Math.min(currentPage.value * perPage.value, filteredData.value.length);
});
</script>


<style scoped>
/* KHUNG CHÍNH */
.table-card { 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  margin: 20px; 
  background: #fff; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.1); 
  font-family: sans-serif; 
}

.card-header { 
  padding: 12px 15px; 
  border-bottom: 1px solid #eee; 
  font-weight: bold; 
  background: #f8f9fa; 
  color: #333; 
}

.create-link { 
  color: #58c9f3; 
  text-decoration: none; 
  font-weight: normal; 
  font-size: 13px; 
  margin-left: 5px; 
  cursor: pointer; 
}

.card-body { 
  padding: 0 15px 15px 15px; 
}

/* ĐIỀU KHIỂN VÀ SEARCH */
.table-controls-wrapper { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding: 20px 0; 
  font-size: 13px; 
  color: #666; 
}

.search-box input { 
  border: 1px solid #ddd; 
  padding: 6px 10px; 
  border-radius: 4px; 
  outline: none; 
  margin-left: 5px; 
}

/* BẢNG */
.data-table { 
  width: 100%; 
  border-collapse: collapse; 
}

.data-table th { 
  background-color: #f9f9f9; 
  text-align: left; 
  padding: 12px; 
  border: 1px solid #eee; 
  color: #444; 
  font-size: 14px; 
}

.data-table td { 
  padding: 12px; 
  border: 1px solid #eee; 
  color: #666; 
  font-size: 13px; 
}

.actions a { 
  color: #58c9f3; 
  text-decoration: none; 
  font-size: 12px; 
}

/* FOOTER VÀ PHÂN TRANG */
.table-footer-wrapper { 
  display: flex; 
  justify-content: space-between; 
  align-items: center; 
  padding-top: 20px; 
  font-size: 13px; 
  color: #777; 
}

.pagination-container { 
  display: flex; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
  overflow: hidden; 
}

.nav-btn, .page-num-btn { 
  border: none; 
  background: white; 
  padding: 8px 14px; 
  cursor: pointer; 
  color: #337ab7; 
  border-right: 1px solid #ddd; 
  font-size: 14px; 
}

.page-num-btn.active { 
  background-color: #337ab7; 
  color: white; 
}

.nav-btn:disabled { 
  color: #bbb; 
  cursor: not-allowed; 
  background: #fafafa; 
}

/* FORM TẠO MỚI */
.form-container { 
  padding-top: 20px; 
}

.form-group { 
  display: flex; 
  align-items: center; 
  padding: 12px 0; 
  border-bottom: 1px solid #f0f0f0; 
}

.form-group label { 
  flex: 0 0 200px; 
  text-align: right; 
  padding-right: 20px; 
  color: #666; 
  font-size: 14px; 
}

.form-group input { 
  width: 400px; 
  padding: 8px 12px; 
  border: 1px solid #ddd; 
  border-radius: 4px; 
}

.form-actions { 
  margin-top: 20px; 
  padding-left: 220px; 
}

.btn-create, .btn-back { 
  padding: 8px 20px; 
  border: 1px solid #ccc; 
  background-color: #fff; 
  border-radius: 4px; 
  cursor: pointer; 
  margin-right: 10px; 
}

.btn-create { 
  background-color: #58c9f3; 
  color: white; 
  border-color: #58c9f3; 
}

.btn-create:hover { 
  background-color: #45b1db; 
}
</style>