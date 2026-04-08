<template>
  <header class="topbar">
    <!-- Left -->
    <div class="left">
      <h2 class="logo">Admin</h2>
    </div>

    <!-- Center -->
    <div class="center">
      <input type="text" placeholder="Search..." />
    </div>

    <!-- Right -->
    <div class="right">
      <div class="icons">
        <span>📧</span>
        <span>👁️</span>
        <span>📊</span>
      </div>

      <!-- Avatar + dropdown -->
      <div class="profile" @click="toggleMenu">
        <img
          src="https://i.pravatar.cc/40"
          alt="avatar"
          class="avatar"
        />
        <span>▼</span>

        <div v-if="showMenu" class="dropdown">
          <p>Your Profile</p>
          <p>Edit Profile</p>
          <p>Account Settings</p>
          <hr />
          <p>Logout</p>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from "vue";

const showMenu = ref(false);

const toggleMenu = () => {
  showMenu.value = !showMenu.value;
};
</script>

<style scoped>
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background: #f5f5f5;
}

/* Left */
.logo {
  margin: 0;
}

/* Center */
.center input {
  padding: 6px 10px;
  width: 250px;
}

/* Right */
.right {
  display: flex;
  align-items: center;
  gap: 20px;
}

.icons span {
  margin: 0 5px;
  cursor: pointer;
}

/* Profile */
.profile {
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
}

.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
}

/* Dropdown */
.dropdown {
  position: absolute;
  right: 0;
  top: 45px;
  background: white;
  border: 1px solid #ddd;
  width: 180px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.dropdown p {
  padding: 10px;
  margin: 0;
  cursor: pointer;
}

.dropdown p:hover {
  background: #f0f0f0;
}
</style>