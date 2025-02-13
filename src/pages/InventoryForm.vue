<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useInventoryStore } from '@/stores/inventory';

const route = useRoute();
const router = useRouter();
const inventoryStore = useInventoryStore();

const isEditing = computed(() => route.params.id !== undefined);

const form = ref({
  name: '',
  category: '',
  price: 0,
  quantity: 1,
  description: '',
  photos: [''],
  avatarIndex: 0
});

const errors = ref({});
const categories = ref([]);

onMounted(async () => {
  categories.value = await inventoryStore.fetchCategories();
  if (isEditing.value) {
    const item = await inventoryStore.fetchItem(route.params.id);
    if (item) {
      form.value = { ...item, avatarIndex: item.photos.indexOf(item.avatar) };
    }
  }
});

const validateForm = () => {
  errors.value = {};
  if (form.value.name.length < 3) {
    errors.value.name = 'Имя должно быть длиной не менее 3 символов';
  }
  if (/^\d+$/.test(form.value.name)) {
    errors.value.name = 'Имя не может состоять только из цифр';
  }
  if (form.value.price <= 0) {
    errors.value.price = 'Цена должна быть больше 0';
  }
  if (form.value.quantity < 1) {
    errors.value.quantity = 'Количество должно быть не менее 1';
  }
  if (form.value.description.length > 255) {
    errors.value.description = 'Описание не должно превышать 255 символов';
  }
  return Object.keys(errors.value).length === 0;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  const itemData = {
    ...form.value,
    avatar: form.value.photos[form.value.avatarIndex]
  };

  if (isEditing.value) {
    await inventoryStore.updateItem(route.params.id, itemData);
  } else {
    await inventoryStore.createItem(itemData);
  }

  router.push('/');
};

const handleDelete = async () => {
  if (confirm('Вы уверены, что хотите удалить этот предмет?')) {
    await inventoryStore.deleteItem(route.params.id);
    router.push('/');
  }
};

const addPhoto = () => {
  form.value.photos.push('');
};

const removePhoto = (index) => {
  form.value.photos.splice(index, 1);
  if (form.value.avatarIndex >= form.value.photos.length) {
    form.value.avatarIndex = form.value.photos.length - 1;
  }
};
</script>

<template>
    <div>
      <h2 class="text-xl font-semibold mb-4">{{ isEditing ? 'Изменить' : 'Добавить' }} предмет</h2>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="name" class="block mb-1">Название *</label>
          <input v-model="form.name" id="name" type="text" required class="w-full p-2 border rounded" :class="{ 'border-red-500': errors.name }">
          <p v-if="errors.name" class="text-red-500 text-sm mt-1">{{ errors.name }}</p>
        </div>
        
        <div>
          <label for="category" class="block mb-1">Категория *</label>
          <select v-model="form.category" id="category" required class="w-full p-2 border rounded cursor-pointer">
            <option class="cursor-pointer" v-for="category in categories" :key="category" :value="category">{{ category.name }}</option>
          </select>
        </div>
        
        <div>
          <label for="price" class="block mb-1">Цена *</label>
          <input v-model.number="form.price" id="price" type="number" step="0.01" required class="w-full p-2 border rounded" :class="{ 'border-red-500': errors.price }">
          <p v-if="errors.price" class="text-red-500 text-sm mt-1">{{ errors.price }}</p>
        </div>
        
        <div>
          <label for="quantity" class="block mb-1">Количество *</label>
          <input v-model.number="form.quantity" id="quantity" type="number" required class="w-full p-2 border rounded" :class="{ 'border-red-500': errors.quantity }">
          <p v-if="errors.quantity" class="text-red-500 text-sm mt-1">{{ errors.quantity }}</p>
        </div>
        
        <div>
          <label for="description" class="block mb-1">Описание</label>
          <textarea v-model="form.description" id="description" rows="3" class="w-full p-2 border rounded" :class="{ 'border-red-500': errors.description }"></textarea>
          <p v-if="errors.description" class="text-red-500 text-sm mt-1">{{ errors.description }}</p>
        </div>
        
        <div>
          <label class="block mb-1">Фото</label>
          <div v-for="(photo, index) in form.photos" :key="index" class="flex items-center mb-2">
            <input v-model="form.photos[index]" type="text" placeholder="Photo URL" class="flex-grow p-2 border rounded mr-2">
            <button @click="removePhoto(index)" type="button" class="px-2 py-1 bg-red-500 text-white rounded cursor-pointer transition hover:bg-red-400">Удалить</button>
            <label class="ml-2 cursor-pointer">
              <input class="cursor-pointer" type="radio" :value="index" v-model="form.avatarIndex"> Обложка
            </label>
          </div>
          <button @click="addPhoto" type="button" class="px-4 py-2 bg-green-500 text-white rounded cursor-pointer transition hover:bg-green-600">Добавить фото</button>
        </div>
        
        <div>
          <button type="submit" class="px-4 py-2 bg-blue-500 text-white rounded cursor-pointer transition hover:bg-blue-600">{{ isEditing ? 'Обновить' : 'Добавить' }} предмет</button>
          <button v-if="isEditing" @click="handleDelete" type="button" class="px-4 py-2 bg-red-500 text-white rounded ml-2 cursor-pointer transition hover:bg-red-400">Удалить предмет</button>
        </div>
      </form>
    </div>
  </template>