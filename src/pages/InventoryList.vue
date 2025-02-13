<script setup>
import { ref, computed, onMounted } from 'vue'
import { useInventoryStore } from '@/stores/inventory'

const inventoryStore = useInventoryStore()

const currentPage = ref(1)
const itemsPerPage = 10

const totalPages = computed(() => Math.ceil(inventoryStore.items.length / itemsPerPage))

const displayedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return inventoryStore.items.slice(start, end)
})

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

onMounted(async () => {
  await inventoryStore.fetchItems()
})
</script>

<template>
  <div>
    <h2 class="text-xl font-semibold mb-4">Список предметов</h2>
    <table class="w-full border-collapse border border-gray-300">
      <thead>
        <tr class="bg-gray-100">
          <th class="border p-2">Название</th>
          <th class="border p-2">Категория</th>
          <th class="border p-2">Цена</th>
          <th class="border p-2">Количество</th>
          <th class="border p-2">Фото</th>
          <th class="border p-2">Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in displayedItems" :key="item.id" class="border-b">
          <td class="border p-2">{{ item.name }}</td>
          <td class="border p-2">{{ item.category.name }}</td>
          <td class="border p-2">{{ item.price.toFixed(2) }}₽</td>
          <td class="border p-2">{{ item.quantity }}</td>
          <td class="border p-2 w-20">
            <img :src="item.avatar" alt="Item photo" class="w-16 h-16 object-cover" />
          </td>
          <td class="border p-2">
            <router-link :to="`/edit/${item.id}`" class="text-blue-500 hover:text-blue-700 mr-2"
              >Изменить</router-link
            >
            <router-link :to="`/item/${item.id}`" class="text-green-500 hover:text-green-700"
              >Посмотреть</router-link
            >
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-4 flex justify-center">
      <button
        @click="prevPage"
        :disabled="currentPage === 1"
        class="px-4 py-2 bg-blue-500 text-white rounded mr-2 cursor-pointer transition hover:bg-blue-600"
      >
        Назад
      </button>
      <span class="px-4 py-2">Страница {{ currentPage }} из {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="px-4 py-2 bg-blue-500 text-white rounded ml-2 cursor-pointer transition hover:bg-blue-600"
      >
        Вперёд
      </button>
    </div>
  </div>
</template>
