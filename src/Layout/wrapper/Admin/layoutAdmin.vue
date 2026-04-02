<template>
  <div class="admin-layout dark-theme">
    <div class="wrapper d-flex">
      <MenuRocker class="sidebar" />
      <div class="main-content flex-grow-1">
        <TopRocker class="topbar" />
        <div class="page-wrapper">
          <div class="page-content">
            <router-view></router-view>
          </div>
        </div>
        <BotRocker />
      </div>
    </div>
  </div>
</template>


<script>
import "../../../assets/js/bootstrap.bundle.min.js";
import "../../../assets/js/jquery.min.js";
import "../../../assets/plugins/simplebar/js/simplebar.min.js";
import "../../../assets/plugins/metismenu/js/metisMenu.min.js";
import "../../../assets/plugins/perfect-scrollbar/js/perfect-scrollbar.js";
import "../../../assets/js/index.js";
import "../../../assets/js/app.js";
import "../../../assets/js/pace.min.js";


import BotRocker from "../../components/Admin/BotRocker.vue";
import MenuRocker from "../../components/Admin/MenuRocker.vue";
import TopRocker from "../../components/Admin/TopRocker.vue";
export default {
  name: "AdminLayout",
  components: {
    TopRocker,
    MenuRocker,
    BotRocker,
  },
  
  
};
</script>

<style>
@import "../../../assets/plugins/vectormap/jquery-jvectormap-2.0.2.css";
@import "../../../assets/plugins/simplebar/css/simplebar.css";
@import "../../../assets/plugins/perfect-scrollbar/css/perfect-scrollbar.css";
@import "../../../assets/plugins/metismenu/css/metisMenu.min.css";
@import "../../../assets/css/pace.min.css";
@import "../../../assets/css/bootstrap.min.css";
@import "../../../assets/css/bootstrap-extended.css";
@import "../../../assets/css/app.css";
@import "../../../assets/css/icons.css";
@import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap");
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css");

.admin-layout .wrapper {
  display: flex;
  min-height: 100vh;
  background: #fff; 
}

.admin-layout .sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  background: linear-gradient(to bottom, #654d33, #7f5b32);
  border-right: 2px solid rgba(0, 0, 0, 0.3);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.3);
  z-index: 100;
}

.admin-layout .main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: F8F8FF;
}
 .card.bg-dark,
.chart-container {
  background-color: #eaebed !important;
  color: #ab5555;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0,0,0,0.1);
}

/* .admin-layout .page-wrapper {
  flex: 1;
  padding: 20px;
  background-color: F8F8FF;
} */
</style>
<!-- <style src="../../../assets/css/admin-dark.css"></style> -->



