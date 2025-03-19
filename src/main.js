import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import VCalendar from 'v-calendar';
import 'v-calendar/style.css';
import Calendar from './components/Calendar.vue';
import VueFinalModal from 'vue-final-modal';

createApp(App)
  .use(router)
  .use(VCalendar, {})
  .use(VueFinalModal())
  .component('Vcalendar', Calendar)
  .mount('#app')