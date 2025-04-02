<template>
  <div class="trainings-holder">
    <h2 class="trainings-header">Тренировки за: {{ formattedDate }}</h2>
      <div class="single-training-holder" v-for="training in jTrainings.trainingsInDay">
        <div class="header-button-container">  
          <h4 class="training-time-header">{{ training.timeStart }} - {{ training.timeEnd }}</h4>
          <button class="edit-button" @click="editClick(training.workoutId)">К упражнениям</button>
          <button class="edit-workout-button" @click.stop="openWorkoutEditModal(training)">
            <img src="/src/assets/icons/edit_button.svg" alt="edit button">
          </button>
        </div>
        <div class="training-info column">
          <p class="training-info-row">⏳ Длительность: {{calculateDuration(training.timeStart, training.timeEnd)}}</p>
          <p class="training-info-row">Количество упражнений: {{training.workoutExercises?.length}}</p>
          <label class="training-info-row">Описание проведенной тренировки:</label>
          <div class="training-info-row column training-text-area">
            <textarea 
              v-model="training.notes" 
              placeholder="Напишите, как прошла тренировка..." 
              class="training-textarea" 
              maxlength="800"
              @change="onInputFinished(training)"></textarea>
            <p class="char-count" v-if="training.notes?.length">{{ training.notes.length }} / 800</p>
          </div>
        </div>
      </div>
      <div class="add-button-container">
        <button class="circle-button" @click="createNewTraining()">
          <img src="/src/assets/icons/add_button.svg" alt="Добавить" />
        </button>
      </div>
      <WorkoutChangeModal
        ref="exerciseModal"
        :training="selectedTraining"
        :handleConfirm="handleConfirm"
        :handleCancel="handleCancel"
        :handleDelete="handleDelete"
      />
  </div>
</template>

<script setup>
import { useRouter, useRoute} from 'vue-router'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { onMounted, ref } from 'vue'
import '../assets/styles/DatePage.css'
import WorkoutChangeModal from './WorkoutChangeModal.vue';
const jTrainings = ref([]);
const router = useRouter();

const exerciseModal = ref(null);
const selectedTraining = ref(null);

onMounted(loadTrainings)
async function loadTrainings() {
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
}
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
function calculateDuration(start, end) {
  const startTime = new Date(`1970-01-01T${start}Z`);
  let endTime = new Date(`1970-01-01T${end}Z`);
  if (startTime > endTime) {
    endTime = new Date(`1970-01-02T${end}Z`);
  }
  const durationInMs = endTime - startTime;
  const hours = Math.floor(durationInMs / (1000 * 60 * 60));
  const minutes = Math.floor((durationInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((durationInMs % (1000 * 60)) / 1000);

  return `${hours} ч ${minutes} мин ${seconds} сек`;
}
async function onInputFinished(training){
  console.log("Input finished:", JSON.stringify({
          notes: training.notes,
      }),);
  try {
    const response = await fetch(`https://localhost:8443/calendar/workouts/${selectedTraining.workoutId}`,  {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({
          notes: training.notes,
      }),
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Ошибка загрузки тренировок')
    } else {
      loadTrainings();
    }
  } catch (error){
    console.error('Ошибка:', error)
  }
}
async function createNewTraining() {
  try {
    const response = await fetch(`https://localhost:8443/calendar/${route.params.date}/new`,  {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        date: new Date(route.params.date).toISOString().split("T")[0],
        startTime: new Date().toTimeString().split(" ")[0],
      }),
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Ошибка загрузки тренировок')
    } else {
      loadTrainings();
      const res = await response.json()
      console.log(res);
    }
  } catch (error){
    console.error('Ошибка:', error)
  }
}
function openWorkoutEditModal(training){
  exerciseModal.value?.openModal();
  selectedTraining.value = training;
  console.log("training:", selectedTraining.value);
}
async function updateTraining() {
  console.log("Json: ",);

  console.log("Json: ", JSON.stringify({
        date: exerciseModal.value?.getLocalTrainingDay(),
        notes: "",
        endTime: exerciseModal.value?.getLocalEndTime(),
        startTime: "",
        workoutId: selectedTraining.value.workoutId
      }),);
  try {
    const response = await fetch(`https://localhost:8443/calendar/workouts/${selectedTraining.value.workoutId}`,  {
      method: 'PATCH',
      headers: {
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        date: exerciseModal.value?.getLocalTrainingDay(),
        notes: "",
        endTime: exerciseModal.value?.getLocalEndTime(),
        startTime: "",
        workoutId: selectedTraining.value.workoutId
      }),
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Ошибка загрузки тренировок')
    } else {
      loadTrainings();
      const res = await response.json()
      console.log(res);
    }
  } catch (error){
    console.error('Ошибка:', error)
  }
}
async function deleteTraining(){
  try {
    const response = await fetch(`https://localhost:8443/calendar/workouts/${selectedTraining.value.workoutId}`,  {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Ошибка загрузки тренировок')
    } else {
      loadTrainings();
      const res = await response.json()
      console.log(res);
    }
  } catch (error){
    console.error('Ошибка:', error)
  }
}

async function handleConfirm(){
  updateTraining();
  exerciseModal.value?.closeModal();
}

function handleCancel(){
  exerciseModal.value?.closeModal();
}
function handleDelete(){
  deleteTraining();
  exerciseModal.value?.closeModal();
}
</script>