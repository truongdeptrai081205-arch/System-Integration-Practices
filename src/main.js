import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/bootstrap.min.css';
import './assets/css/app.css';

import LayoutAdmin from './layout/wrapper/Admin/layoutAdmin.vue'
import Blank from './layout/wrapper/blank.vue';
import Toaster from "@meforma/vue-toaster";

const app = createApp(App)
app.use(router);
app.use(Toaster, {
  position: "top-right",
});
app.component("admin-layout", LayoutAdmin);
app.component("blank-layout", Blank);
app.mount('#app')
