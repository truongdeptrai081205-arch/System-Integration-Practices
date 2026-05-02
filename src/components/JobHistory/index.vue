<template>
  <div class="container">
    <div class="list-section">
      <h3>
        Index - 
        <span class="link" @click="openAddModal">Create New</span>
      </h3>

      <div class="top-bar">
        <div>
          Show
          <select v-model="perPage">
            <option :value="10">10</option>
            <option :value="25">25</option>
            <option :value="50">50</option>
          </select>
          entries
        </div>
        <div>
          Search:
          <input type="text" v-model="searchQuery" placeholder="Tìm kiếm ngay..." />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Department</th>
            <th>Division</th>
            <th>Start_Date</th>
            <th>End_Date</th>
            <th>Job_Category</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="filteredData.length === 0"><td colspan="8" class="text-center">No data available</td></tr>
          
          <tr v-else v-for="(row, index) in paginatedData" :key="row.id">
            <td>{{ row.fullName }}</td>
            <td>{{ row.department }}</td>
            <td>{{ row.division }}</td>
            <td>{{ row.startDate }}</td>
            <td>{{ row.endDate }}</td>
            <td>{{ row.jobCategory }}</td>
            <td>{{ row.location }}</td>
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
          <button @click="prevPage" :disabled="currentPage === 1">❮</button>
          <span> Page {{ currentPage }} / {{ totalPages }} </span>
          <button @click="nextPage" :disabled="currentPage === totalPages">❯</button>
        </div>
      </div>
    </div>

    <div v-if="showUserModal" class="modal-overlay" @click.self="showUserModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ modalMode === 'add' ? 'Thêm Người Dùng' : 'Thông Tin Người Dùng' }}</h3>
          <span class="close-btn" @click="showUserModal = false">&times;</span>
        </div>
        
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="userModalForm.fullName" />
            </div>
            <div class="form-group">
              <label>Department</label>
              <input type="text" v-model="userModalForm.department" />
            </div>
            <div class="form-group">
              <label>Division</label>
              <input type="text" v-model="userModalForm.division" />
            </div>
            <div class="form-group">
              <label>Start Date</label>
              <input type="date" v-model="userModalForm.startDate" />
            </div>
            <div class="form-group">
              <label>End Date</label>
              <input type="date" v-model="userModalForm.endDate" />
            </div>
            <div class="form-group">
              <label>Job Category</label>
              <select v-model="userModalForm.jobCategory">
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" v-model="userModalForm.location" />
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-back" @click="showUserModal = false">Cancel</button>
          <button class="btn-create-submit" @click="saveUser">
            {{ modalMode === 'add' ? 'Create Now' : 'Update' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const perPage = ref(10);
const currentPage = ref(1);
const searchQuery = ref('');

const showUserModal = ref(false);
const modalMode = ref('add');

const userModalForm = ref({
  id: null,
  fullName: '',
  department: '',
  division: '',
  startDate: '',
  endDate: '',
  jobCategory: 'Full-time',
  location: ''
});

const jobHistoryList = ref(Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  fullName: `Employee ${i + 1}`,
  department: i % 2 === 0 ? "IT" : "HR",
  division: "General",
  startDate: "2024-01-01",
  endDate: "2025-01-01",
  jobCategory: "Full-time",
  location: "Vietnam"
})));

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

watch([searchQuery, perPage], () => {
  currentPage.value = 1;
});

const prevPage = () => { if (currentPage.value > 1) currentPage.value--; };
const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++; };

const openAddModal = () => {
  modalMode.value = 'add';
  userModalForm.value = { 
    id: Date.now(), 
    fullName: '', 
    department: '', 
    division: '', 
    startDate: '', 
    endDate: '', 
    jobCategory: 'Full-time', 
    location: '' 
  };
  showUserModal.value = true;
};

const openEditModal = (row) => {
  modalMode.value = 'edit';
  userModalForm.value = { ...row };
  showUserModal.value = true;
};

const deleteRow = (id) => {
  if (confirm("Are you sure you want to delete this record?")) {
    jobHistoryList.value = jobHistoryList.value.filter(item => item.id !== id);
  }
};

const saveUser = () => {
  if (modalMode.value === 'add') {
    jobHistoryList.value.unshift({ ...userModalForm.value });
  } else {
    const idx = jobHistoryList.value.findIndex(item => item.id === userModalForm.value.id);
    if (idx !== -1) {
      jobHistoryList.value[idx] = { ...userModalForm.value };
    }
  }
  showUserModal.value = false;
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
.text-center { text-align: center; }

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
.modal-footer { padding: 15px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; }
.btn-back { background: #6c757d; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
.btn-back:hover { background: #5a6268; }
.btn-create-submit { background: #28a745; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }

.pagination button { margin: 0 5px; cursor: pointer; }
</style>