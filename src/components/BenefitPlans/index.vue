<template>
  <div class="container">
    <div class="list-section">
      <h3>
        Benefit Plans - 
        <span class="link" @click="openAddModal">Create New</span>
      </h3>

      <div class="top-bar">
        <div>
          Show
          <select v-model="perPage" @change="currentPage = 1">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
            <option :value="100">100</option>
          </select>
          entries
        </div>
        <div>
          Search:
          <input type="text" v-model="searchQuery" @input="currentPage = 1" placeholder="Filter plans..." />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Plan Name</th>
            <th>Deductable</th>
            <th>Percentage CoPay</th>
            <th>Actions</th> 
          </tr>
        </thead>

        <tbody>
          <tr v-if="paginatedData.length === 0">
            <td colspan="4" class="text-center">No data found</td>
          </tr>
          
          <tr v-else v-for="(row, index) in paginatedData" :key="row.id">
            <td>{{ row.planName }}</td>
            <td>{{ row.deductable }}</td>
            <td>{{ row.coPay }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-edit" @click="openEditModal(row)">Edit</button>
                <button class="btn-delete" @click="deleteRow(row.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="bottom-bar">
        <div>Showing {{ startIdx }} to {{ endIdx }} of {{ filteredData.length }} entries</div>
        <div class="pagination">
          <button @click="currentPage--" :disabled="currentPage === 1">❮</button>
          <span> Page {{ currentPage }} / {{ totalPages }} </span>
          <button @click="currentPage++" :disabled="currentPage >= totalPages">❯</button>
        </div>
      </div>
    </div>

    <!-- Modal cho Add / Edit -->
    <div v-if="showPlanModal" class="modal-overlay" @click.self="showPlanModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalMode === 'add' ? 'Create Benefit Plan' : 'Edit Benefit Plan' }}</h3>
          <span class="close-btn" @click="showPlanModal = false">&times;</span>
        </div>
        
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Plan Name</label>
              <input type="text" v-model="planForm.planName" />
            </div>
            <div class="form-group">
              <label>Deductable</label>
              <input type="text" v-model="planForm.deductable" />
            </div>
            <div class="form-group">
              <label>Percentage CoPay</label>
              <input type="text" v-model="planForm.coPay" />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-back" @click="showPlanModal = false">Cancel</button>
          <button class="btn-create-submit" @click="savePlan">
            {{ modalMode === 'add' ? 'Create' : 'Update' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const rawData = ref([
  { id: 1, planName: "Standard Plan", deductable: "$500", coPay: "20%" },
  { id: 2, planName: "Premium Plan", deductable: "$0", coPay: "10%" },
  { id: 3, planName: "Basic Plan", deductable: "$1000", coPay: "30%" },
  { id: 4, planName: "Gold Care Plus", deductable: "$250", coPay: "15%" },
  { id: 5, planName: "Silver Economy", deductable: "$750", coPay: "25%" },
  { id: 6, planName: "Platinum Executive", deductable: "$0", coPay: "5%" },
  { id: 7, planName: "Family Starter", deductable: "$1200", coPay: "35%" },
  { id: 8, planName: "Student Health", deductable: "$100", coPay: "10%" },
  { id: 9, planName: "Senior Support", deductable: "$300", coPay: "20%" },
  { id: 10, planName: "Corporate Elite", deductable: "$0", coPay: "12%" },
  { id: 11, planName: "Small Biz Basic", deductable: "$600", coPay: "20%" },
  { id: 12, planName: "Global Traveler", deductable: "$450", coPay: "15%" },
  { id: 13, planName: "Dental & Vision Lite", deductable: "$50", coPay: "50%" },
  { id: 14, planName: "High Deductible Saver", deductable: "$3000", coPay: "0%" },
  { id: 15, planName: "Mid-Range Wellness", deductable: "$800", coPay: "20%" },
  { id: 16, planName: "Ultimate Protection", deductable: "$150", coPay: "10%" }
]);

const searchQuery = ref("");
const perPage = ref(10);
const currentPage = ref(1);

const showPlanModal = ref(false);
const modalMode = ref('add');

const planForm = ref({
  id: null,
  planName: '',
  deductable: '',
  coPay: ''
});

const filteredData = computed(() => {
  if (!searchQuery.value) return rawData.value;
  return rawData.value.filter(item => 
    item.planName.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.deductable.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
    item.coPay.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage.value) || 1);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  const end = start + perPage.value;
  return filteredData.value.slice(start, end);
});

const startIdx = computed(() => filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const endIdx = computed(() => {
  const end = currentPage.value * perPage.value;
  return end > filteredData.value.length ? filteredData.value.length : end;
});

const openAddModal = () => {
  modalMode.value = 'add';
  planForm.value = {
    id: Date.now(),
    planName: '',
    deductable: '',
    coPay: ''
  };
  showPlanModal.value = true;
};

const openEditModal = (row) => {
  modalMode.value = 'edit';
  planForm.value = { ...row };
  showPlanModal.value = true;
};

const deleteRow = (id) => {
  if (confirm('Are you sure you want to delete this plan?')) {
    rawData.value = rawData.value.filter(item => item.id !== id);
  }
};

const savePlan = () => {
  if (modalMode.value === 'add') {
    rawData.value.unshift({ ...planForm.value });
  } else {
    const idx = rawData.value.findIndex(item => item.id === planForm.value.id);
    if (idx !== -1) {
      rawData.value[idx] = { ...planForm.value };
    }
  }
  showPlanModal.value = false;
};
</script>

<style scoped>
.container { padding: 20px; font-family: sans-serif; color: #333; }
h3 { background-color: #fcfcfc; padding: 15px; margin: 0; border: 1px solid #e0e0e0; }
.link { color: #007bff; cursor: pointer; text-decoration: underline; margin-left: 10px; font-size: 0.8em; }

.top-bar, .bottom-bar { display: flex; justify-content: space-between; padding: 15px; border: 1px solid #e0e0e0; background: #fff; }
table { width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; }
th, td { border: 1px solid #e0e0e0; padding: 10px; text-align: left; }
th { background: #f8f9fa; }
.text-center { text-align: center; padding: 20px; }

.action-buttons { display: flex; gap: 5px; }
.btn-edit { background: #ffc107; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; color: #000; }
.btn-delete { background: #dc3545; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; color: #fff; }
.btn-edit:hover { background: #e0a800; }
.btn-delete:hover { background: #c82333; }

.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #fff; width: 500px; border-radius: 8px; display: flex; flex-direction: column; max-height: 90vh; }
.modal-header { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.modal-header h3 { border: none; padding: 0; background: none; }
.close-btn { cursor: pointer; font-size: 20px; }
.modal-body { padding: 20px; overflow-y: auto; }
.form-grid { display: grid; gap: 15px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-weight: bold; margin-bottom: 5px; font-size: 13px; }
.form-group input, .form-group select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.modal-group input:focus { border-color: #58c9f3; outline: none; }
.modal-footer { padding: 15px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; }
.btn-back { background: #6c757d; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
.btn-back:hover { background: #5a6268; }
.btn-create-submit { background: #28a745; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }

.pagination button { margin: 0 5px; cursor: pointer; }
</style>