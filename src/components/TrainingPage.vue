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
        <button class="circle-button" @click="isModalOpen = true">
          <img src="/src/assets/icons/add_button.svg" alt="Добавить" />
        </button>
        <vue-final-modal
          v-model="isModalOpen"
          classes="modal-container"
          content-class="modal-content"
        >
          <h2 class="add-exercise-header">Добавление упражнения</h2>
          <div class="column custom-hight">
            <div class="row justify-center">
              <span class="title-choose-exercise"> Выбранное упражнение:</span>
              <vue3-select
                v-model="selectedOption"
                :options="dropdownOptions"
                label="name"
                placeholder="Выберите вариант"
                :clearable="false"
                class="selected-options"
              />
            </div>
            <div class="add-sets-holder">
              <div class="sets-container">
                <div class="scrolable-container sets-holder">
                  <ul class="sets-list sets-list-additional">
                    <li 
                      v-for="(set, setIndex) in currentExerciseSets" 
                      :key="setIndex" 
                      class="set-item set-item-addition"
                    >
                      <span class="set-item-number">{{ setIndex + 1 }}.</span>
                      <span class="set-details">{{ set.weight }} кг x {{ set.repetitions }} раз</span>
                      <button class="set-deletion" @click=deleteSetFromCurrent(setIndex) title="Удалить этот подход"> x</button>
                    </li>
                  </ul>
                </div>
              </div>
              <div v-if="selectedOption"class="rep-adder-holder">
                <RepAdder 
                  :handleAddButton="addSet"
                  v-model:weightTotal="weightTotal"
                  v-model:amountTotal="amountTotal"
                  :showWeight="true"
                  :showAmount="true"
                  :dropdownOptions="jsonExercises.listOfExercises"
                  />
              </div>
            </div>
          </div>
          <button class="modal-close" @click="isModalOpen = false">
            x
          </button>
          <div class="modal__action">
            <button class="vfm-btn" @click="confirmSets">Сохранить</button>
            <button class="vfm-btn" @click="cancel">Отменить</button>
          </div>
        </vue-final-modal>
      </div>
    </div>
  </div>
</template>
<script setup>
import '../assets/styles/Exercise.css';
import {ref, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import Vue3Select from 'vue3-select';
import 'vue3-select/dist/vue3-select.css';
import RepAdder from './SetAdder.vue';
const route = useRoute();
const jsonExercises = ref([]);
const weightTotal = ref(0);
const amountTotal = ref(0);
const selectedOption = ref(null);
const dropdownOptions = ref([]);
const isModalOpen = ref(false); 
const currentExerciseSets = ref([])
const expandedIndex = ref(null);
const toggleSet = (index) => {
  if (expandedIndex.value === index) {
    expandedIndex.value = null;
  } else {
    expandedIndex.value = index;
  }
};
onMounted(async () => {
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
})
function addSet(){
  if(!selectedOption.value){
    console.error("exercise is not selected");
    return
  } else if (amountTotal.value <= 0 || weightTotal.value <= 0){
    console.error("amount and weight must be positive")
    return
  }
  currentExerciseSets.value.push({
    weight: weightTotal.value,
    repetitions: amountTotal.value
  });
}
function countSetsAmount(sets){
  if(sets){
    return sets.length;
  } else {
    return 0;
  }
}
function deleteSetFromCurrent(setIndex) {
  if (setIndex >= 0 && setIndex < currentExerciseSets.value.length) {
    currentExerciseSets.value.splice(setIndex, 1);
  } else {
    console.error("Invalid index");
  }
}
async function confirmSets(){
  console.log("sending data", JSON.stringify({
          allowedExercise: selectedOption.value,
          sets: currentExerciseSets.value
      }))
  try {
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
      isModalOpen.value = false;
    }
  } catch (error) {
    console.error('Ошибка:', error)
  }
}
function cancel(){
  if (currentExerciseSets.value.length > 0) {
    alert("Data will be lost");
  } else {
    isModalOpen.value = false;
  }
}
</script>