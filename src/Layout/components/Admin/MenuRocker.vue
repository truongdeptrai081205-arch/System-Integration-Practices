<template>
  <div class="sidebar">
    <nav class="sidebar-nav">
      <div class="menu-card">
        <ul class="nav-list">

          <li class="nav-item">
            <router-link to="/" class="nav-link">
              <i class="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/personal-list" class="nav-link">
              <i class="fas fa-user"></i>
              <span>Personal List</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/benefit-plans" class="nav-link">
              <i class="fas fa-gift"></i>
              <span>Benefit Plans</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/birthday" class="nav-link">
              <i class="fas fa-birthday-cake"></i>
              <span>Birthday</span>
            </router-link>
          </li>

          <li class="nav-item">
            <router-link to="/anniversary" class="nav-link">
              <i class="fas fa-gift"></i>
              <span>Anniversary</span>
            </router-link>
          </li>
        </ul>
      </div>

      <div class="menu-card">
        <ul class="nav-list">
          <li class="nav-item">
            <div
              class="nav-link dropdown-toggle"
              @click="toggleDropdown"
              :class="{ active: dropdownOpen }"
            >
              <i class="fas fa-cog"></i>
              <span>More Pages</span>
              <i class="fas fa-chevron-down arrow" :class="{ open: dropdownOpen }"></i>
            </div>

            <ul class="dropdown" v-show="dropdownOpen">
              <li>
                <router-link to="/admin/login" class="dropdown-item">
                  <i class="fas fa-sign-in-alt"></i>
                  <span>Login</span>
                </router-link>
              </li>

              <li>
                <router-link to="/admin/profile" class="dropdown-item">
                  <i class="fas fa-user-circle"></i>
                  <span>Profile</span>
                </router-link>
              </li>

              <li>
                <router-link to="/admin/all-users" class="dropdown-item">
                  <i class="fas fa-users"></i>
                  <span>All Users</span>
                </router-link>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </nav>

    <!-- LOGOUT -->
    <div class="menu-card logout-card">
      <button class="nav-link logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        <span>Logout</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const dropdownOpen = ref(true); // mở sẵn giống UI bạn gửi

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

</script>

<style scoped>

.sidebar {
  width: 300px;
  min-height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #0d1224 0%, #121a33 100%);
  border: 1px solid rgba(255, 255, 255, 0.04);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.25);
}

.sidebar-nav {
  width: 100%;
}

.menu-card {
  background: linear-gradient(180deg, #131a2b 0%, #19223d 100%);
  border-radius: 20px;
  padding: 0;
  margin-bottom: 18px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  margin: 0;
}

.nav-item:not(:last-child) .nav-link {
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  color: #cbd5e1;
  font-size: 15px;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.nav-link i {
  width: 36px;
  height: 36px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #94a3b8;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #f8fafc;
}

.router-link-active,
.nav-link.active {
  background: #2f3650;
  color: #f8fafc;
}

.router-link-active i,
.nav-link.active i {
  color: #a5b4fc;
}

.dropdown-toggle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dropdown-toggle span {
  flex: 1;
}

.arrow {
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: transform 0.3s ease, background 0.25s ease, color 0.25s ease;
}

.arrow.open {
  transform: rotate(180deg);
  color: #f8fafc;
  background: rgba(255, 255, 255, 0.08);
}

.dropdown {
  margin-top: 0;
  background: #19202b;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  color: #cbd5e1;
  text-decoration: none;
  transition: background 0.2s ease, color 0.2s ease;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #f8fafc;
}

.logout-card {
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  border-radius: 18px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: #222736;
  color: #cbd5e1;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.2s ease;
}

.logout-btn:hover {
  background: #2c3546;
  transform: translateY(-1px);
}
</style>