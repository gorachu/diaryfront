<template>
  <VCalendar ref="calendar"
    :first-day-of-week="2"
    color="green"
    :view="calendarView"
    :max-date="new Date()"
    :attributes="attrs"
    @dayclick="onDateSelected"
  >
    <template #footer>
        <div class="w-full px-4 pb-3">
          <button
            class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md"
            @click="moveToday"
            > Сегодня 
        </button>
          <button class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md" 
            @click="changeCalendarView"
            >Изменить режим
          </button>
        </div>
    </template>
    <template #day-popover="{day, attributes}">
      <div class="popover-content">
        <div v-if="attributes.length > 0">
          <div v-for="data in attributes[0].customData" :key="data.key">
            <div v-if="data.key === formatDate(day.date)">
              <h4>Тренировки за {{ data.key }}:</h4>
              <ul>
                <li v-for="(training, index) in data.trainings" :key="index">{{ training }}</li>
              </ul>
            </div>
          </div>
        </div>    
        <button 
                class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold w-full px-3 py-1 rounded-md"
                @click="goToTrainingPage(day)"
                >Просмотр тренировок
              </button>
      </div>
    </template>
  </VCalendar>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import '../assets/styles/Calendar.css';
import { useRouter } from 'vue-router'

const selectedDate = ref(new Date());
const router = useRouter()
const calendarView = ref("monthly");
const calendar = ref(null);
const jsontrainings = ref([]);
onMounted(async () => {
  try {
    const response = await fetch('https://localhost:8443/calendar', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    })

    if (!response.ok) {
      throw new Error('Ошибка загрузки пользователей')
    }

    jsontrainings.value = await response.json()
    console.log(jsontrainings.value);
  } catch (error) {
    console.error('Ошибка:', error)
  }
})
const attrs = ref([
  {
    key: 'training-days',
    dot: {
      key: 'training-dot',
      color: 'green',
      class: 'row-spacing',
    },
    highlight:{
      key: 'training-highlight',
      color: 'blue',
      fillMode: 'light',
    },
    popover:{
      visibility: 'hover-focus',
      isInteractive: true,
      hideIndicator: true,
    },
    dates: jsontrainings.data,
    customData: jsontrainings.customData,
  },
  {
    key: 'selectedDate',
    highlight:{
      key: 'training-highlight',
      color: 'blue',
      fillMode: 'outline',
    },
    dates: [
      new Date(selectedDate.value),
    ]
  },
  {
    key: 'todayDate',
    highlight:{
      key: 'training-highlight',
      color: 'green',
      fillMode: 'light',
    },
    dates: [
      new Date(),
    ]
  },
]);
watch(selectedDate, (newDate) => {
  const selectedDateAttr = attrs.value.find(attr => attr.key === 'selectedDate');
  if (selectedDateAttr) {
    selectedDateAttr.dates = [new Date(newDate)];
  }
});
watch(jsontrainings, (newJsontrainings) => {
  const jsontrainingsAttr = attrs.value.find(attr => attr.key === 'training-days');
  if (jsontrainingsAttr) {
    jsontrainingsAttr.dates = newJsontrainings.data;
    jsontrainingsAttr.customData = newJsontrainings.customData;
  }
});
function changeCalendarView(){
  if (calendarView.value === "weekly") {
    calendarView.value = "monthly";
  } else {
    calendarView.value = "weekly"
  }
  setTimeout(() => {
    if (selectedDate.value) {
      moveToDate(selectedDate.value);
    }
  }, 0);
}
async function moveToday() {
  await calendar.value.move(new Date());
}
async function moveToDate(date) {
  await calendar.value.move(date);
}
function formatDate(date) {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
function goToTrainingPage(date){
  router.push(`/date/${date.year}-${date.month}-${date.day}`)
}
function onDateSelected(day) {
  selectedDate.value = day.date;
  console.log('Выбранная дата:', day.date);
}
</script>