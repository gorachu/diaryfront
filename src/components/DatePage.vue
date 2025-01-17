<template>
  <div>
    <h1>Страница даты</h1>
    <p>Вы выбрали дату: {{ date }}</p>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const date = route.params.date
</script>

<style scoped>
/* Стили для страницы даты */
</style> 