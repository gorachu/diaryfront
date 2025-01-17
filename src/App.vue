<template>
  <div class="container">
    <nav>
      <router-link to="/">Главная</router-link> |
      <router-link to="/calendar">Календарь</router-link> |
      <router-link to="/login">Вход</router-link> |
      <router-link to="/register">Регистрация</router-link> |
      <router-link to="/users">Пользователи</router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup>
// Здесь можно добавить логику компонента
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
}

nav {
  margin-bottom: 20px;
}

nav a {
  margin: 0 10px;
  text-decoration: none;
  color: #42b983;
}

nav a.router-link-exact-active {
  font-weight: bold;
}
</style>
