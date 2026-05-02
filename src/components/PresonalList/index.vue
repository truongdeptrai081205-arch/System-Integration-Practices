<template>
  <div class="container">
    <div class="list-section">
      <h3>
        Personals - 
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
          <input type="text" v-model="searchText" placeholder="Nhập để tìm..." />
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Full Name</th>
            <th>City</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Shareholder</th>
            <th>Actions</th> </tr>
        </thead>

        <tbody>
          <tr v-if="loading"><td colspan="7" class="text-center">Loading...</td></tr>
          <tr v-else-if="paginatedData.length === 0"><td colspan="7" class="text-center">No data available</td></tr>
          
          <tr v-else v-for="(p, index) in paginatedData" :key="p.id">
            <td>{{ p.fullName }}</td>
            <td>{{ p.city }}</td>
            <td>{{ p.email }}</td>
            <td>{{ p.phone }}</td>
            <td>{{ p.gender }}</td>
            <td>{{ p.shareholder }}</td>
            <td>
              <div class="action-buttons">
                <button class="btn-edit" @click="openEditModal(p)">Edit</button>
                <button class="btn-delete" @click="deletePersonal(p.id)">Delete</button>
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
          <h3>{{ isEditing ? 'Edit Personal' : 'Create Personal' }}</h3>
          <span class="close-btn" @click="closeModal">&times;</span>
        </div>
        
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label>First Name</label>
              <input type="text" v-model="formData.firstName" />
            </div>
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" v-model="formData.lastName" />
            </div>
            <div class="form-group">
              <label>City</label>
              <input type="text" v-model="formData.city" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="text" v-model="formData.email" />
            </div>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" v-model="formData.phone" />
            </div>
            <div class="form-group">
              <label>Gender</label>
              <select v-model="formData.gender">
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <div class="form-group">
              <label>Shareholder</label>
              <div class="checkbox-wrapper">
                <input type="checkbox" v-model="formData.shareholder" />
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-back" @click="closeModal">Cancel</button>
          <button class="btn-create-submit" @click="savePersonal">
            {{ isEditing ? 'Update' : 'Create Now' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"

// States
const isModalOpen = ref(false)
const isEditing = ref(false)
const currentEditId = ref(null)
const loading = ref(false)


const personals = ref([
  ...Array.from({ length: 15 }, (_, i) => ({
    id: Date.now() + i,
    fullName: `User ${i + 1}`,
    firstName: "User",
    lastName: `${i + 1}`,
    city: ["Hà Nội", "Đà Nẵng", "HCM"][i % 3],
    email: `user${i + 1}@gmail.com`,
    phone: `09${10000000 + i}`,
    gender: i % 2 === 0 ? "Male" : "Female",
    shareholder: i % 3 === 0 ? "Yes" : "No"
  }))
])

const formData = ref({
  firstName: "",
  lastName: "",
  city: "",
  email: "",
  phone: "",
  gender: "Female",
  shareholder: false
})
// modal
const openCreateModal = () => {
  isEditing.value = false;
  resetForm();
  isModalOpen.value = true;
}

const openEditModal = (item) => {
  isEditing.value = true;
  currentEditId.value = item.id;
  formData.value = {
    firstName: item.firstName || item.fullName.split(' ')[0],
    lastName: item.lastName || item.fullName.split(' ')[1] || "",
    city: item.city,
    email: item.email,
    phone: item.phone,
    gender: item.gender,
    shareholder: item.shareholder === "Yes"
  };
  isModalOpen.value = true;
}

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
}

const resetForm = () => {
  formData.value = { firstName: "", lastName: "", city: "", email: "", phone: "", gender: "Female", shareholder: false };
}

const savePersonal = () => {
  const newEntry = {
    id: isEditing.value ? currentEditId.value : Date.now(),
    fullName: `${formData.value.firstName} ${formData.value.lastName}`.trim(),
    firstName: formData.value.firstName,
    lastName: formData.value.lastName,
    city: formData.value.city || "N/A",
    email: formData.value.email || "N/A",
    phone: formData.value.phone || "N/A",
    gender: formData.value.gender,
    shareholder: formData.value.shareholder ? "Yes" : "No"
  };

  if (isEditing.value) {
    const index = personals.value.findIndex(p => p.id === currentEditId.value);
    if (index !== -1) personals.value[index] = newEntry;
  } else {
    personals.value.unshift(newEntry);
  }
  closeModal();
}

const deletePersonal = (id) => {
  if (confirm("Are you sure you want to delete this record?")) {
    personals.value = personals.value.filter(p => p.id !== id);
  }
}


const pageSizes = [10, 25, 50, 100]
const pageSize = ref(10)
const currentPage = ref(1)
const searchText = ref("")

const filteredData = computed(() => {
  return personals.value.filter(p =>
    Object.values(p).some(val => val?.toString().toLowerCase().includes(searchText.value.toLowerCase()))
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
.btn-create-submit { background: #28a745; color: #fff; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }

.pagination button { margin: 0 5px; cursor: pointer; }
</style>