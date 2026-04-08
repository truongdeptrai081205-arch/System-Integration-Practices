<template>
  <div class="container">
    <span class="link" @click="openCreateModal">Create New</span>

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
          <th>Actions</th> 
        </tr>
      </thead>

      <tbody>
        <!-- Loading -->
        <tr v-if="loading">
          <td colspan="7" class="text-center">Loading...</td>
        </tr>

        <!-- No data -->
        <tr v-else-if="paginatedData.length === 0">
          <td colspan="7">No data available in table</td>
        </tr>

        <!-- Data -->
        <tr v-else v-for="(p, index) in paginatedData" :key="index">
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
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";

// DATA
const personals = ref([]);
const loading = ref(false);

const isModalOpen = ref(false);
const isEditing = ref(false);

const formData = ref({
  id: null,
  firstName: "",
  lastName: "",
  city: "",
  email: "",
  phone: "",
  gender: "Male",
  shareholder: false,
});

const openCreateModal = () => {
  isModalOpen.value = true;
  isEditing.value = false;

  formData.value = {
    id: null,
    firstName: "",
    lastName: "",
    city: "",
    email: "",
    phone: "",
    gender: "Male",
    shareholder: false,
  };
};
const openEditModal = (p) => {
  isModalOpen.value = true;
  isEditing.value = true;

  const name = p.fullName.split(" ");

  formData.value = {
    id: p.id,
    firstName: name[0],
    lastName: name.slice(1).join(" "),
    city: p.city,
    email: p.email,
    phone: p.phone,
    gender: p.gender,
    shareholder: p.shareholder === "Yes",
  };
};
const closeModal = () => {
  isModalOpen.value = false;
};

const savePersonal = async () => {
  try {
    const payload = {
      First_Name: formData.value.firstName,
      Last_Name: formData.value.lastName,
      Email: formData.value.email,
      Phone_Number: formData.value.phone,
      City: formData.value.city,
      State: "VN",
      Shareholder_Status: formData.value.shareholder ? 1 : 0,
      Gender: formData.value.gender,
    };

    if (isEditing.value) {
      await axios.put(
        `http://localhost:4000/api/editPersonalList/update/${formData.value.id}`,
        payload
      );
    } else {
      await axios.post(
        "http://localhost:4000/api/appPersonalList",
        payload
      );
    }

    closeModal();
    fetchPersonals();
  } catch (err) {
    console.error(err);
  }
};

// DELETE
const deletePersonal = async (id) => {
  try {
    await axios.delete(
      `http://localhost:4000/api/deletePersonal/delete/${id}`
    );
    fetchPersonals();
  } catch (err) {
    console.error(err);
  }
};

// CONFIG
const pageSizes = [10, 25, 50, 100];
const pageSize = ref(10);
const currentPage = ref(1);
const searchText = ref("");

// FETCH DATA
const fetchPersonals = async () => {
  try {
    loading.value = true;
    const res = await axios.get("http://localhost:4000/api/personal", {
      params: {
        limit: pageSize.value,
        page: currentPage.value,
      },
    });

    // API trả về { personal: [...] }
    personals.value = res.data.personal.map(p => ({
      id: p.Employee_ID,
      fullName: p.FullName,
      city: p.City,
      email: p.Email,
      phone: p.Phone,
      gender: p.Gender , // nếu API không có
      shareholder: p.Shareholder_Status ? "Yes" : "No",
    }));
  } catch (err) {
    console.error(err);
  } finally {
    loading.value = false;
  }
};

// LIFECYCLE
onMounted(() => {
  fetchPersonals();
});

// WATCHERS
watch([pageSize, currentPage], () => {
  fetchPersonals();
});

watch(searchText, () => {
  currentPage.value = 1;
});

// COMPUTED
const filteredData = computed(() =>
  personals.value.filter(p =>
    Object.values(p).some(val =>
      val.toString().toLowerCase().includes(searchText.value.toLowerCase())
    )
  )
);

const totalPages = computed(() =>
  Math.ceil(filteredData.value.length / pageSize.value) || 1
);

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredData.value.slice(start, start + pageSize.value);
});

const startIndex = computed(() =>
  filteredData.value.length === 0 ? 0 : (currentPage.value - 1) * pageSize.value + 1
);

const endIndex = computed(() =>
  Math.min(currentPage.value * pageSize.value, filteredData.value.length)
);

// ACTION
const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++;
};

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--;
};
</script>

<style scoped>
.container { padding: 20px; }
.top-bar { display: flex; justify-content: space-between; margin-bottom: 10px; }
table { width: 100%; border-collapse: collapse; }
th, td { border: 1px solid #ccc; padding: 8px; }
td[colspan="6"] { text-align: center; padding: 20px; color: #888; }
.bottom-bar { display: flex; justify-content: space-between; margin-top: 10px; }
.pagination button { margin-left: 5px; cursor: pointer; }
.pagination button:disabled { opacity: 0.5; cursor: not-allowed; }
.link { color: blue; cursor: pointer; }

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal-content {
  background: white;
  padding: 20px;
  width: 500px;
  border-radius: 8px;
}
</style>