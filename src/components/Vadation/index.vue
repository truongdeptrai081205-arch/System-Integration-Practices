<template>
  <div class="container">
    <div class="list-section">
      <h3>
        Vacation List - 
        <span class="link" @click="openCreateModal">Create New</span>
      </h3>

      <div class="top-bar">
        <div>
          Show
          <select v-model="pageSize">
            <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
          </select>
          entries
        </div>
        <div>
          Search:
          <input type="text" v-model="searchText" placeholder="Tìm tên hoặc mức độ..." />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>Vacation Days</th> 
            <th>Level</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading"><td colspan="4" class="text-center">Loading...</td></tr>
          <tr v-else-if="paginatedData.length === 0"><td colspan="4" class="text-center">No data available</td></tr>
          
          <tr v-else v-for="(p, index) in paginatedData" :key="p.id">
            <td>{{ p.FullName }}</td>
            <td>{{ p.Vacation_Days }}</td>
            <td>
              <span class="badge" :class="getLevelClass(p.Level)">
                <span class="dot"></span>
                <span class="text-label">{{ p.Level }}</span>
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button class="btn-edit" @click="openEditModal(p)">Edit</button>
                <button class="btn-delete" @click="deleteRecord(p.id)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="bottom-bar">
        <div>Showing {{ startIndex }} to {{ endIndex }} of {{ filteredData.length }} entries</div>
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">❮</button>
          <span> Page {{ currentPage }} / {{ totalPages }} </span>
          <button @click="nextPage" :disabled="currentPage === totalPages">❯</button>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h3>{{ isEditing ? 'Edit Entry' : 'Create New Entry' }}</h3>
          <span class="close-btn" @click="closeModal">&times;</span>
        </div>
        
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="formData.FullName" placeholder="Last279 First279" />
            </div>
            <div class="form-group">
              <label>Vacation Days</label>
              <input type="number" v-model.number="formData.Vacation_Days" />
            </div>
            <div class="form-group">
              <label>Level</label>
              <select v-model="formData.Level">
                <option value="CRITICAL">CRITICAL</option>
                <option value="WARNING">WARNING</option>
                <option value="NORMAL">NORMAL</option>
              </select>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-back" @click="closeModal">Cancel</button>
          <button class="btn-create-submit" @click="saveRecord">
            {{ isEditing ? 'Update' : 'Create Now' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"

const isModalOpen = ref(false)
const isEditing = ref(false)
const currentEditId = ref(null)
const loading = ref(false)

const records = ref([
  ...Array.from({ length: 15 }, (_, i) => ({
    id: Date.now() + i,
    FullName: `Last${279 + i} First${279 + i}`,
    Vacation_Days: 19,
    Level: i % 3 === 0 ? "CRITICAL" : i % 3 === 1 ? "WARNING" : "NORMAL"
  }))
])

const formData = ref({
  FullName: "",
  Vacation_Days: 0,
  Level: "NORMAL"
})

const openCreateModal = () => {
  isEditing.value = false;
  resetForm();
  isModalOpen.value = true;
}

const openEditModal = (item) => {
  isEditing.value = true;
  currentEditId.value = item.id;
  formData.value = {
    FullName: item.FullName,
    Vacation_Days: item.Vacation_Days,
    Level: item.Level
  };
  isModalOpen.value = true;
}

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
}

const resetForm = () => {
  formData.value = { 
    FullName: "", 
    Vacation_Days: 0, 
    Level: "NORMAL"
  };
}

const saveRecord = () => {
  const newEntry = {
    id: isEditing.value ? currentEditId.value : Date.now(),
    FullName: formData.value.FullName || "N/A",
    Vacation_Days: formData.value.Vacation_Days,
    Level: formData.value.Level
  };

  if (isEditing.value) {
    const index = records.value.findIndex(r => r.id === currentEditId.value);
    if (index !== -1) records.value[index] = newEntry;
  } else {
    records.value.unshift(newEntry);
  }
  closeModal();
}

const deleteRecord = (id) => {
  if (confirm("Are you sure you want to delete this record?")) {
    records.value = records.value.filter(r => r.id !== id);
  }
}

// Cấu hình phân trang và tìm kiếm
const pageSizes = [10, 50, 100]
const pageSize = ref(10)
const currentPage = ref(1)
const searchText = ref("")

const getLevelClass = (level) => {
  return {
    'level-critical': level === 'CRITICAL',
    'level-warning': level === 'WARNING',
    'level-normal': level === 'NORMAL'
  };
}

const filteredData = computed(() => {
  return records.value.filter(r =>
    Object.values(r).some(val => val?.toString().toLowerCase().includes(searchText.value.toLowerCase()))
  )
})

watch([searchText, pageSize], () => currentPage.value = 1)

const totalPages = computed(() => Math.ceil(filteredData.value.length / pageSize.value) || 1)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const startIndex = computed(() => filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1)
const endIndex = computed(() => Math.min(currentPage.value * pageSize.value, filteredData.value.length))

const nextPage = () => { if (currentPage.value < totalPages.value) currentPage.value++ }
const prevPage = () => { if (currentPage.value > 1) currentPage.value-- }
</script>

<style scoped>
.container { padding: 20px; font-family: sans-serif; color: #333; }
h3 { background-color: #fcfcfc; padding: 15px; margin: 0; border: 1px solid #e0e0e0; }
.link { color: #007bff; cursor: pointer; text-decoration: underline; margin-left: 10px; font-size: 0.8em; }
.top-bar, .bottom-bar { display: flex; justify-content: space-between; padding: 15px; border: 1px solid #e0e0e0; background: #fff; }
table { width: 100%; border-collapse: collapse; border: 1px solid #e0e0e0; }
th, td { border: 1px solid #e0e0e0; padding: 10px; text-align: left; }
th { background: #f8f9fa; }
.action-buttons { display: flex; gap: 5px; }
.btn-edit { background: #ffc107; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; color: #000; }
.btn-delete { background: #dc3545; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; color: #fff; }
.modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.modal-content { background: #fff; width: 500px; border-radius: 8px; display: flex; flex-direction: column; max-height: 90vh; }
.modal-header { padding: 15px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; }
.modal-body { padding: 20px; overflow-y: auto; }
.form-grid { display: grid; gap: 15px; }
.form-group { display: flex; flex-direction: column; }
.form-group label { font-weight: bold; margin-bottom: 5px; font-size: 13px; }
.form-group input, .form-group select { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
.modal-footer { padding: 15px; border-top: 1px solid #eee; display: flex; justify-content: flex-end; gap: 10px; }
.btn-create-submit { background: #28a745; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
.pagination button { margin: 0 5px; cursor: pointer; }

/* Các định dạng cho mức độ (Level) */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 13px;
  color: #333; /* Chữ luôn hiển thị màu đen */
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.level-critical .dot {
  background-color: #dc3545; /* Đỏ */
}
.level-warning .dot {
  background-color: #ffc107; /* Vàng */
}
.level-normal .dot {
  background-color: #28a745; /* Xanh lá */
}
</style>