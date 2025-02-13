import './assets/main.css'

import { createWebHistory, createRouter } from 'vue-router'
import { createPinia } from 'pinia';
import { createApp } from 'vue'
import App from './App.vue'

import InventoryList from '@/pages/InventoryList.vue';
import InventoryForm from '@/pages/InventoryForm.vue';
import InventoryDetails from '@/pages/InventoryDetails.vue';

const routes = [
    {
      path: '/',
      name: 'InventoryList',
      component: InventoryList,
    },
    {
      path: '/add',
      name: 'AddInventory',
      component: InventoryForm,
    },
    {
      path: '/edit/:id',
      name: 'EditInventory',
      component: InventoryForm,
    },
    {
      path: '/item/:id',
      name: 'InventoryDetails',
      component: InventoryDetails,
    },
  ];

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const app = createApp(App)
const pinia = createPinia();

app.use(router)
app.use(pinia);
app.mount('#app')
