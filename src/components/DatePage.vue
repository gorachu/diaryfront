<template>
  <div class="trainings-holder">
    <h2 class="trainings-header">Тренировки за: {{ formattedDate }}</h2>
      <div class="single-training-holder" v-for="data in jTrainings.trainingsInDay">
        <div class="header-button-container">  
          <h4 class="training-time-header">{{ data.timeStart }} - {{ data.timeEnd }}</h4>
          <button class="edit-button" @click="editClick(data.workoutId)">Редактировать</button>
        </div>
        <ul class="exercise-holder">
          <li class="exercsise-info" v-for="training in data.workoutExercises">
            <span class="custom-marker"></span>{{ training.exerciseName }}
          </li>
        </ul>
      </div>
  </div>
</template>

<script setup>
import { useRouter, useRoute} from 'vue-router'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { onMounted, ref } from 'vue'
const jTrainings = ref([]);
const router = useRouter();
onMounted(async () => {
  try {
    const response = await fetch(`https://localhost:8443/calendar/${route.params.date}`,  {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Ошибка загрузки тренировок')
    }
    jTrainings.value = await response.json()
    console.log(jTrainings.value);
  } catch (error){
    console.error('Ошибка:', error)
  }
})
const route = useRoute()
const currentYear = new Date().getFullYear()
const date = new Date(route.params.date)
let formattedDate
if (date.getFullYear() === currentYear) {
  formattedDate = format(date, 'd MMMM', { locale: ru })
} else {
  formattedDate = format(date, 'd MMMM yyyy', { locale: ru })
}
function editClick(workoutId) {
  router.push(`${route.fullPath}/${workoutId}`);
}
</script>