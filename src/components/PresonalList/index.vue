<template>
  <div class="container">
    <div v-if="!isCreating">
      <h3>Personals - <span class="link" @click="isCreating = true">Create New</span></h3>

      <div class="top-bar">
        <div>
          Show
          <select v-model="pageSize">
            <option v-for="size in pageSizes" :key="size" :value="size">
              {{ size }}
            </option>
          </select>
          entries
        </div>

        <div>
          Search:
          <input 
            type="text" 
            :value="searchText" 
            @input="searchText = $event.target.value" 
            placeholder="Nhập để tìm..." 
          />
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
          </tr>
        </thead>

        <tbody>
          <tr v-if="loading">
            <td colspan="6">Loading...</td>
          </tr>

          <tr v-else-if="paginatedData.length === 0">
            <td colspan="6">No data available in table</td>
          </tr>

          <tr v-else v-for="(p, index) in paginatedData" :key="index">
            <td>{{ p.fullName }}</td>
            <td>{{ p.city }}</td>
            <td>{{ p.email }}</td>
            <td>{{ p.phone }}</td>
            <td>{{ p.gender }}</td>
            <td>{{ p.shareholder }}</td>
          </tr>
        </tbody>
      </table>

      <div class="bottom-bar">
        <div>
          Showing {{ startIndex }} to {{ endIndex }} of {{ filteredData.length }} entries
        </div>

        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">❮</button>
          <span> Page {{ currentPage }} / {{ totalPages }} </span>
          <button @click="nextPage" :disabled="currentPage === totalPages">❯</button>
        </div>
      </div>
    </div>

    <div v-else>
      <h3>Create Personal</h3>
      
      <div class="form-container">
        <div class="form-group">
          <label>Employee ID</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>First Name</label>
          <input type="text" v-model="formData.firstName" />
        </div>
        <div class="form-group">
          <label>Last_Name</label>
          <input type="text" v-model="formData.lastName" />
        </div>
        <div class="form-group">
          <label>Middle_Initial</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>Address1</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>Address2</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>City</label>
          <input type="text" v-model="formData.city" />
        </div>
        <div class="form-group">
          <label>State</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>Zip</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>Email</label>
          <input type="text" v-model="formData.email" />
        </div>
        <div class="form-group">
          <label>Phone_Number</label>
          <input type="text" v-model="formData.phone" />
        </div>
        <div class="form-group">
          <label>Social_Security_Number</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>Drivers_License</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>Marital_Status</label>
          <input type="text" />
        </div>
        <div class="form-group">
          <label>Gender</label>
          <select v-model="formData.gender">
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div class="form-group">
          <label>Shareholder_Status</label>
          <div class="checkbox-wrapper">
            <input type="checkbox" v-model="formData.shareholder" />
          </div>
        </div>
        <div class="form-group">
          <label>Benefit_Plans</label>
          <select>
            <option value=""></option>
          </select>
        </div>
        <div class="form-group">
          <label>Ethnicity</label>
          <input type="text" />
        </div>
        
        <div class="form-actions">
          <button class="btn-create" @click="createPersonal">Create</button>
          <button class="btn-back" @click="isCreating = false">Back to List</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue"

const isCreating = ref(false)

const personals = ref([
  ...Array.from({ length: 120 }, (_, i) => ({
    fullName: `User ${i + 1}`,
    city: ["Hà Nội", "Đà Nẵng", "HCM"][i % 3],
    email: `user${i + 1}@gmail.com`,
    phone: `09${10000000 + i}`,
    gender: i % 2 === 0 ? "Male" : "Female",
    shareholder: i % 3 === 0 ? "Yes" : "No"
  }))
])

const loading = ref(false)

const formData = ref({
  firstName: "",
  lastName: "",
  city: "",
  email: "",
  phone: "",
  gender: "Female",
  shareholder: false
})

const createPersonal = () => {
  personals.value.unshift({
    fullName: `${formData.value.firstName} ${formData.value.lastName}`.trim() || "New User",
    city: formData.value.city || "N/A",
    email: formData.value.email || "N/A",
    phone: formData.value.phone || "N/A",
    gender: formData.value.gender,
    shareholder: formData.value.shareholder ? "Yes" : "No"
  })
  
  isCreating.value = false
  
  formData.value = {
    firstName: "",
    lastName: "",
    city: "",
    email: "",
    phone: "",
    gender: "Female",
    shareholder: false
  }
}


const pageSizes = [10, 25, 50, 100]
const pageSize = ref(10)
const currentPage = ref(1)
const searchText = ref("")


const filteredData = computed(() => {
  return personals.value.filter(p =>
    Object.values(p).some(val =>
      val.toString().toLowerCase().includes(searchText.value.toLowerCase())
    )
  )
})


watch(searchText, () => {
  currentPage.value = 1
})

watch(pageSize, () => {
  currentPage.value = 1
})


const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / pageSize.value) || 1
)

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredData.value.slice(start, start + pageSize.value)
})

const startIndex = computed(() =>
  filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
)

const endIndex = computed(() =>
  Math.min(currentPage.value * pageSize.value, filteredData.value.length)
)


const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<style scoped>
.container {
  padding: 20px;
  font-family: sans-serif;
  color: #333;
}

h3 {
  background-color: #fcfcfc;
  padding: 15px;
  margin-top: 0;
  border: 1px solid #e0e0e0;
  border-bottom: none;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-bottom: none;
  background-color: #fff;
}

.top-bar input, .top-bar select {
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 3px;
}

table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #e0e0e0;
  background-color: #fff;
}

th, td {
  border: 1px solid #e0e0e0;
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #333;
}

td[colspan="6"] {
  text-align: center;
  padding: 20px;
  color: #888;
  background-color: #fff !important;
}

.bottom-bar {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-top: none;
  background-color: #fff;
}

.pagination {
  display: flex;
  align-items: center;
}

.pagination button {
  margin: 0 5px;
  padding: 5px 10px;
  cursor: pointer;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 3px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.link {
  color: #008cba;
  cursor: pointer;
}

/* Form Styles */
.form-container {
  max-width: 800px;
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

.form-group input[type="text"],
.form-group select {
  width: 400px;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}

.form-group select {
  width: 250px;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
  height: 30px;
}

.form-actions {
  margin-top: 20px;
  padding-left: 220px;
}

.btn-create, .btn-back {
  padding: 6px 12px;
  border: 1px solid #ccc;
  background-color: #fff;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
  color: #333;
}

.btn-create:hover, .btn-back:hover {
  background-color: #f8f9fa;
}
</style>