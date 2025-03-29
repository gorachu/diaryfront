<template>
  <div class="column justify-center"> 
    <div class="training-holder">
      <h2 class="trainings-header">Тренировка:</h2>
      <div class="scrolable-container">
        <ul>
          <li v-for="(exercise, index) in jsonExercises.workoutExercises" :key="index" class="exercise-item" @click="toggleSet(index)">
            <div class="exercise-info">
              <span class="exercise-number">{{ index + 1 }}.</span>
              <span class="exercise-name">{{ exercise.exerciseName }}</span>
              <span class="exercise-details">{{ countSetsAmount(exercise.sets) }} подходов</span>
              <button class="edit-workout-exercise-button" @click.stop="editWorkoutExercise(exercise)">
                <img src="/src/assets/icons/edit_button.svg" alt="edit button">
              </button>
            </div>
            <ul v-if="expandedIndex === index" class="sets-list">
              <li 
                v-for="(set, setIndex) in exercise.sets" 
                :key="setIndex" 
                class="set-item"
              >
                <span class="set-item-number">{{ setIndex + 1 }}.</span>
                <span class="set-details">{{ set.weight }} кг x {{ set.repetitions }} раз</span>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <div class="add-button-container">
        <button class="circle-button" @click="openModal('Добавить  упражнения', 'Сохранить', 'Отменить')">
          <img src="/src/assets/icons/add_button.svg" alt="Добавить" />
        </button>
        <ExerciseModal
          v-model:modelValue="isModalOpen"
          v-model:selectedOption="selectedOption"
          :modalTitle="modalTitle"
          :confirmText="confirmText"
          :cancelText="cancelText"
          v-model:dropdownOptions="dropdownOptions"
          v-model:currentExerciseSets="currentExerciseSets"
          :handleConfirm="confirmSets"
          :handleCancel="cancel"
          v-model:showDeleteButton="showDeleteButton"
          :handleDeleteButton="deleteExerciseFromWorkout"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import '../assets/styles/Exercise.css';
import {ref, onMounted, watch} from 'vue';
import { useRoute } from 'vue-router';
import 'vue3-select/dist/vue3-select.css';
import ExerciseModal from './ExerciseModal.vue';
const route = useRoute();
const jsonExercises = ref([]);
const selectedOption = ref(null);
const dropdownOptions = ref([]);
const isModalOpen = ref(false);
const currentExerciseSets = ref([])
const expandedIndex = ref(null);
const modalTitle = ref('');
const confirmText = ref('');
const cancelText = ref('');
const showDeleteButton = ref(false);
const exerciseRef = ref(null);
const toggleSet = (index) => {
  if (expandedIndex.value === index) {
    expandedIndex.value = null;
  } else {
    expandedIndex.value = index;
  }
};

onMounted(async () =>{
  loadTrainings();
})

async function loadTrainings() {
  try {
    const response = await fetch(`https://localhost:8443/calendar/${route.params.date}/${route.params.workoutId}`,  {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      credentials: 'include',
    })
    if (!response.ok) {
      throw new Error('Ошибка загрузки тренировок')
    }
    jsonExercises.value = await response.json();
    console.log("data from JSON:", jsonExercises.value);
    dropdownOptions.value = jsonExercises.value?.listOfExercises || [];
  } catch (error){
    console.error('Ошибка:', error);
  }
}
function countSetsAmount(sets){
  if(sets){
    return sets.length;
  } else {
    return 0;
  }
}
async function confirmSets(){
  console.log("sending data", JSON.stringify({
          allowedExercise: selectedOption.value,
          sets: currentExerciseSets.value
      }))
  try {
    if (currentExerciseSets.value.length  <= 0) {
      throw new Error('Ошибка при отправки подхода');
    }
    const response = await fetch(`https://localhost:8443/calendar/${route.params.date}/${route.params.workoutId}/new`,  {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          allowedExercise: selectedOption.value,
          sets: currentExerciseSets.value
      }),
      credentials: 'include' // Обязательно для работы с куками
    })
    if (!response.ok) {
      throw new Error('Ошибка при отправки подхода')
    } else {
      loadTrainings();
      isModalOpen.value = false;
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
}
function cancel(){
  if (currentExerciseSets.value.length > 0) {
    const userConfirmed = confirm("Data will be lost. Continue?");
    if (!userConfirmed) {
      return;
    }
  }
  isModalOpen.value = false;
}
async function deleteExerciseFromWorkout(){
  const userConfirmed = confirm("Are u sure? Continue?");
  if (!userConfirmed) {
    return;
  }
  console.log("sending data to delete(raw)", exerciseRef.value)
  console.log("sending data to delete", JSON.stringify({
    sets: exerciseRef.value.sets,
    workoutExerciseId: exerciseRef.value.workoutExerciseId,
}))
  try {
    const response = await fetch(`https://localhost:8443/calendar/${route.params.date}/${route.params.workoutId}/exercise`,  {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
          sets: exerciseRef.value.sets,
          workoutExerciseId: exerciseRef.value.workoutExerciseId,
      }),
      credentials: 'include' // Обязательно для работы с куками
    })
    if (!response.ok) {
      throw new Error('Ошибка при отправки подхода')
    } else {
      console.log("response:", await response.json());
      loadTrainings();
      isModalOpen.value = false;
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
}
function editWorkoutExercise(exercise){
  isModalOpen.value = true;
  selectedOption.value =dropdownOptions.value.find(option => option.name === exercise.exerciseName) || null;
  console.log("selected option",selectedOption.value);
  currentExerciseSets.value = exercise.sets;
  openModal( 'Редактирование', 'Сохранить', 'Отменить');
  showDeleteButton.value = true;
  console.log("selected exercise",exercise);
  exerciseRef.value = exercise;
};
function openModal(modalTitleStr, confirmTextStr, cancelTextStr){
  modalTitle.value = modalTitleStr;
  confirmText.value = confirmTextStr;
  cancelText.value = cancelTextStr;
  isModalOpen.value = true;
}

</script>