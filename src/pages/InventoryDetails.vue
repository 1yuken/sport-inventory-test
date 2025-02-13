<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useInventoryStore } from '@/stores/inventory';

const route = useRoute();
const inventoryStore = useInventoryStore();
const item = ref(null);
const selectedImage = ref(null);
const showModal = ref(false);

onMounted(async () => {
  item.value = await inventoryStore.fetchItem(route.params.id);
});

const openImage = (photo) => {
  selectedImage.value = photo;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
};
</script>

<template>
  <div v-if="item">
    <h2 class="text-xl font-semibold mb-4">{{ item.name }}</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p><strong>Категория:</strong> {{ item.category.name }}</p>
        <p><strong>Цена:</strong> {{ item.price.toFixed(2) }}₽</p>
        <p><strong>Количество:</strong> {{ item.quantity }}</p>
        <p><strong>Описание:</strong></p>
        <p class="whitespace-pre-wrap">{{ item.description }}</p>
      </div>
      <div>
        <h3 class="text-lg font-semibold mb-2">Все фото</h3>
        <div class="grid grid-cols-2 gap-2">
          <div v-for="(photo, index) in item.photos" :key="index" class="relative">
            <img 
              :src="photo" 
              :alt="`${item.name} - Photo ${index + 1}`" 
              class="w-full h-40 object-cover rounded cursor-pointer"
              @click="openImage(photo)"
            >
            <span v-if="photo === item.avatar" class="absolute top-0 right-0 bg-green-500 text-white px-2 py-1 text-xs rounded">Обложка</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-4">
      <router-link :to="`/edit/${item.id}`" class="px-4 py-2 bg-blue-500 text-white rounded mr-2 transition hover:bg-blue-600">Изменить</router-link>
      <router-link to="/" class="px-4 py-2 bg-gray-500 text-white rounded transition hover:bg-gray-600">Вернуться к списку предметов</router-link>
    </div>

    <!-- Модальное окно для полноразмерного изображения -->
    <div v-if="showModal" @click="closeModal" class="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div class="max-w-4xl max-h-full p-4">
        <img :src="selectedImage" :alt="item.name" class="max-w-full max-h-full object-contain">
      </div>
    </div>
  </div>
  <div v-else>
    <p>Загрузка...</p>
  </div>
</template>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>