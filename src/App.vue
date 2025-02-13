<script setup>

</script>

<template>
  <div class="container mx-auto p-4">
    <header class="mb-4">
      <h1 class="text-2xl font-bold">Спортивный инвентарь</h1>
      <nav class="mt-2">
        <RouterLink to="/" class="mr-4 text-blue-500 hover:text-blue-700">Главная</RouterLink>
        <RouterLink to="/add" class="text-blue-500 hover:text-blue-700">Добавить предмет</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>

</style>
