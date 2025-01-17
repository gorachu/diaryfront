<template>
  <div class="calendar">
    <div class="calendar-header">
      <button 
        class="month-button" 
        @click="previousMonth"
      >
        ←
      </button>
      <h2>{{ currentMonthYear }}</h2>
      <button 
        class="month-button" 
        @click="nextMonth" 
        :disabled="isCurrentMonth"
      >
        →
      </button>
    </div>
    <div class="weekdays">
      <div v-for="day in weekDays" :key="day" class="weekday">{{ day }}</div>
    </div>
    <div class="days">
      <div v-for="day in calendarDays" 
           :key="day.date" 
           class="day"
           :class="{ 'empty': !day.date, 'today': day.isToday }"
           @click="goToDate(day.date)">
        {{ day.date }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const currentDate = new Date()
const selectedDate = ref(new Date())

const isCurrentMonth = computed(() => {
  const today = new Date()
  return selectedDate.value.getMonth() === today.getMonth() &&
         selectedDate.value.getFullYear() === today.getFullYear()
})

const currentMonthYear = computed(() => {
  const months = [
    'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
    'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ]
  return `${months[selectedDate.value.getMonth()]} ${selectedDate.value.getFullYear()}`
})

const calendarDays = computed(() => {
  const year = selectedDate.value.getFullYear()
  const month = selectedDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  let firstDayOfWeek = firstDay.getDay() || 7
  firstDayOfWeek = firstDayOfWeek - 1
  
  const days = []
  
  for (let i = 0; i < firstDayOfWeek; i++) {
    days.push({ date: null })
  }
  
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = i === currentDate.getDate() &&
                    month === currentDate.getMonth() &&
                    year === currentDate.getFullYear()
    days.push({ 
      date: i,
      isToday
    })
  }
  
  return days
})

function previousMonth() {
  selectedDate.value = new Date(
    selectedDate.value.getFullYear(),
    selectedDate.value.getMonth() - 1,
    1
  )
}

function nextMonth() {
  if (!isCurrentMonth.value) {
    selectedDate.value = new Date(
      selectedDate.value.getFullYear(),
      selectedDate.value.getMonth() + 1,
      1
    )
  }
}

function goToDate(date) {
  if (date) {
    const year = selectedDate.value.getFullYear()
    const month = selectedDate.value.getMonth() + 1
    router.push(`/date/${year}-${month}-${date}`)
  }
}
</script>

<style scoped>
.calendar {
  margin-top: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
}

.calendar-header {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.month-button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.month-button:hover:not(:disabled) {
  background-color: #f0f0f0;
}

.month-button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 10px;
}

.weekday {
  font-weight: bold;
  padding: 10px;
  background-color: #f5f5f5;
  user-select: none;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day {
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  user-select: none;
}

.day:hover {
  background-color: #f0f0f0;
}

.empty:hover {
  background-color: #f9f9f9;
  cursor: default;
}

.empty {
  background-color: #f9f9f9;
}

.today {
  background-color: #e6f4ff;
  border-color: #1890ff;
  font-weight: bold;
}
</style> 