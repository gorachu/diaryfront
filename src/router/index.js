import { createRouter, createWebHistory } from 'vue-router'
import Home from '../components/Home.vue'
import Calendar from '../components/Calendar.vue'
import DatePage from '../components/DatePage.vue'
import Login from '../components/Login.vue'
import Register from '../components/Register.vue'
import UserTable from '../components/UserTable.vue'
import TrainingPage from '../components/TrainingPage.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/calendar',
    name: 'Calendar',
    component: Calendar
  },
  {
    path: '/calendar/:date',
    name: 'DatePage',
    component: DatePage
  },
  {
    path: '/calendar/:date/:workoutId',
    name: 'TrainingPage',
    component: TrainingPage
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/users',
    name: 'UserTable',
    component: UserTable
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 