<template>
  <div class="card table-card">
    <div class="card-header">
      Birthday Management - 
      <a href="javascript:void(0)" class="create-link" @click="openCreateModal">
        Add New Record
      </a>
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
              <th>Person Name</th>
              <th>Birth Date</th>
              <th>Relationship</th>
              <th>Status</th>
              <th>Note</th>
              <th style="width: 120px;">Actions</th> 
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row) in paginatedData" :key="row.id">
              <td class="font-bold">{{ row.name }}</td>
              <td>{{ formatDate(row.date) }}</td>
              <td>{{ row.relation }}</td>
              <td>
                <span :class="['status-tag', row.status.toLowerCase()]">
                  {{ row.status }}
                </span>
              </td>
              <td>{{ row.note }}</td>
              <td class="actions">
                <a href="javascript:void(0)" @click="openEditModal(row)">Edit</a> | 
                <a href="javascript:void(0)" @click="deleteRecord(row.id)" class="text-danger">Delete</a>
              </td>
            </tr>
            <tr v-if="paginatedData.length === 0">
              <td colspan="6" class="no-data">
                No records found for this selection.
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
              v-for="p in totalPages" :key="p" 
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

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Birthday Record' : 'Add New Birthday Record' }}</h3>
          <span class="close-x" @click="closeModal">&times;</span>
        </div>

        <div class="modal-body">
          <div class="form-container-modal">
            <div class="form-group-modal">
              <label>Full Name</label>
              <input type="text" v-model="formData.name" placeholder="Enter name" />
            </div>
            <div class="form-group-modal">
              <label>Birth Date</label>
              <input type="date" v-model="formData.date" />
            </div>
            <div class="form-group-modal">
              <label>Relationship</label>
              <select v-model="formData.relation">
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Work">Work</option>
              </select>
            </div>
            <div class="form-group-modal">
              <label>Status</label>
              <select v-model="formData.status">
                <option value="Done">Done</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
            <div class="form-group-modal">
              <label>Note</label>
              <textarea v-model="formData.note" placeholder="Extra details..."></textarea>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-modal-back" @click="closeModal">Cancel</button>
          <button class="btn-modal-save" @click="saveRecord">
            {{ isEditing ? 'Update Record' : 'Save Record' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';


const isModalOpen = ref(false);
const isEditing = ref(false);
const currentEditId = ref(null);

const searchDate = ref("");
const perPage = ref(10);
const currentPage = ref(1);


const rawData = ref([
  { id: 1, name: "Nguyen Van A", date: "1995-04-10", relation: "Friend", status: "Done", note: "Likes books" },
  { id: 2, name: "Tran Thi B", date: "1992-05-15", relation: "Family", status: "Pending", note: "Buy flowers" },
  { id: 3, name: "Le Van C", date: "1988-04-10", relation: "Work", status: "Done", note: "Team leader" },
]);

const formData = ref({ name: "", date: "", relation: "Friend", status: "Pending", note: "" });

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split('-');
  return `${d}/${m}/${y}`;
};

const openCreateModal = () => {
  isEditing.value = false;
  resetForm();
  isModalOpen.value = true;
};

const openEditModal = (item) => {
  isEditing.value = true;
  currentEditId.value = item.id;
  formData.value = { ...item }; // Sao chép dữ liệu vào form
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const resetForm = () => {
  formData.value = { name: "", date: "", relation: "Friend", status: "Pending", note: "" };
};

const saveRecord = () => {
  if (!formData.value.name || !formData.value.date) {
    return alert("Please fill in Name and Date.");
  }

  if (isEditing.value) {
    const index = rawData.value.findIndex(item => item.id === currentEditId.value);
    if (index !== -1) {
      rawData.value[index] = { ...formData.value };
    }
  } else {
    rawData.value.unshift({
      ...formData.value,
      id: Date.now() 
    });
  }

  closeModal();
  currentPage.value = 1;
};

const deleteRecord = (id) => {
  if (confirm("Are you sure you want to delete this record?")) {
    rawData.value = rawData.value.filter(item => item.id !== id);
  }
};


const filteredData = computed(() => {
  return rawData.value.filter(item => {
    if (!searchDate.value) return true;
    return item.date === searchDate.value;
  });
});

const totalPages = computed(() => Math.ceil(filteredData.value.length / perPage.value) || 1);
const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * perPage.value;
  return filteredData.value.slice(start, start + perPage.value);
});

const startIdx = computed(() => filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * perPage.value + 1);
const endIdx = computed(() => Math.min(currentPage.value * perPage.value, filteredData.value.length));

const resetFilters = () => {
  searchDate.value = "";
  currentPage.value = 1;
};

watch([searchDate, perPage], () => currentPage.value = 1);
</script>

<style scoped>
.table-card { border: 1px solid #ddd; border-radius: 4px; margin: 20px; background: #fff; font-family: sans-serif; box-shadow: 0 1px 1px rgba(0,0,0,.05); }
.card-header { padding: 12px 15px; border-bottom: 1px solid #eee; font-weight: bold; background: #f8f9fa; color: #333; }
.create-link { color: #58c9f3; text-decoration: none; font-size: 13px; margin-left: 5px; cursor: pointer; }
.card-body { padding: 15px; }

/* Controls */
.table-controls-wrapper { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; font-size: 13px; color: #666; }
.date-filter-box { display: flex; align-items: center; gap: 10px; }
.filter-item { display: flex; align-items: center; gap: 8px; }
.filter-item input { border: 1px solid #ddd; padding: 5px 8px; border-radius: 4px; outline: none; }
.btn-reset { background: #f5f5f5; border: 1px solid #ddd; padding: 5px 12px; border-radius: 4px; cursor: pointer; }


.data-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
.data-table th { background-color: #f9f9f9; text-align: left; padding: 12px; border: 1px solid #eee; color: #444; font-size: 13px; }
.data-table td { padding: 12px; border: 1px solid #eee; color: #666; font-size: 13px; }
.font-bold { font-weight: bold; color: #333; }
.no-data { text-align: center; padding: 30px !important; color: #999; }


.status-tag { padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: bold; text-transform: uppercase; }
.done { background: #e6f4ea; color: #1e7e34; }
.pending { background: #fff3cd; color: #856404; }

/* Actions */
.actions a { color: #58c9f3; text-decoration: none; cursor: pointer; font-size: 12px; }
.text-danger { color: #ff5c5c !important; }


.table-footer-wrapper { display: flex; justify-content: space-between; align-items: center; padding-top: 20px; font-size: 13px; color: #777; }
.pagination-container { display: flex; border: 1px solid #ddd; border-radius: 4px; }
.nav-btn, .page-num-btn { border: none; background: white; padding: 6px 12px; cursor: pointer; color: #337ab7; border-right: 1px solid #ddd; }
.page-num-btn.active { background-color: #337ab7; color: white; }


.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000;
}
.modal-content {
  background: #fff; width: 500px; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.3);
  display: flex; flex-direction: column;
}
.modal-header {
  padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;
}
.modal-header h3 { margin: 0; font-size: 16px; color: #333; }
.close-x { cursor: pointer; font-size: 22px; color: #aaa; }

.modal-body { padding: 20px; }
.form-group-modal { display: flex; flex-direction: column; margin-bottom: 15px; }
.form-group-modal label { margin-bottom: 5px; font-size: 13px; font-weight: bold; color: #555; }
.form-group-modal input, .form-group-modal select, .form-group-modal textarea {
  padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 13px;
}
.form-group-modal textarea { height: 60px; resize: none; }

.modal-footer { padding: 15px; border-top: 1px solid #eee; text-align: right; }
.btn-modal-save { background: #58c9f3; color: white; border: none; padding: 8px 20px; border-radius: 4px; cursor: pointer; }
.btn-modal-back { background: #f5f5f5; border: 1px solid #ddd; padding: 8px 20px; border-radius: 4px; margin-right: 10px; cursor: pointer; }
</style>