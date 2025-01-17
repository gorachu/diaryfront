<template>
  <div class="user-table-container">
    <h1>Список пользователей</h1>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Имя пользователя</th>
          <th>Email</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.UserID">
          <td>{{ user.UserID }}</td>
          <td>{{ user.Username }}</td>
          <td>{{ user.Email }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const users = ref([])

onMounted(async () => {
  try {
    const response = await fetch('https://localhost:8443/users', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Ошибка загрузки пользователей')
    }

    users.value = await response.json()
  } catch (error) {
    console.error('Ошибка:', error)
  }
})
</script>

<style scoped>
.user-table-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 10px;
  border: 1px solid #ddd;
}

th {
  background-color: #f4f4f4;
}
</style> 