<template>
  <div class="container">
    <h3>Personals - <span class="link">Create New</span></h3>

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
        <input type="text" v-model="searchText" placeholder="Nhập để tìm..." />
      </div>
    </div>

    <!-- Table -->
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
        <!-- Loading -->
        <tr v-if="loading">
          <td colspan="6">Loading...</td>
        </tr>

        <!-- No data -->
        <tr v-else-if="paginatedData.length === 0">
          <td colspan="6">No data available in table</td>
        </tr>

        <!-- Data -->
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

    <!-- Bottom -->
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
</template>

<script setup>
import { ref, computed, watch } from "vue"

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


// CONFIG
const pageSizes = [10, 25, 50, 100]
const pageSize = ref(10)
const currentPage = ref(1)
const searchText = ref("")

// FILTER
const filteredData = computed(() => {
  return personals.value.filter(p =>
    Object.values(p).some(val =>
      val.toString().toLowerCase().includes(searchText.value.toLowerCase())
    )
  )
})

// RESET PAGE
watch(searchText, () => {
  currentPage.value = 1
})

watch(pageSize, () => {
  currentPage.value = 1
})

// PAGINATION
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

// ACTION
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
}

.top-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  border: 1px solid #ccc;
  padding: 8px;
}


td[colspan="6"] {
  text-align: center;
  padding: 20px;
  color: #888;
}

.bottom-bar {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
}

.pagination {
  display: flex;
  align-items: center;
}

.pagination button {
  margin-left: 5px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.link {
  color: blue;
  cursor: pointer;
}
</style>