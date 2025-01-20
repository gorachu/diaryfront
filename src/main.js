import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import Calendar from './components/Calendar.vue';

// Use calendar defaults (optional)
createApp(App)
  .use(router)
  .use(VCalendar, {})
  .component('Vcalendar', Calendar)
  .mount('#app')