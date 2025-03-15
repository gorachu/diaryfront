<template>
  <div class="training-holder">
    <h2 class="trainings-header">Тренировка:</h2>
    <div class="scrolable-container">
      <ul>
        <li v-for="(exercise, index) in jsonExercises" :key="index" class="exercise-item" @click="toggleSet(index)">
          <div class="exercise-info">
            <span class="exercise-number">{{ index + 1 }}.</span>
          <span class="exercise-name">{{ exercise.name }}</span>
          <span class="exercise-details">{{ exercise.sets.length }} подходов</span>
          </div>
          <ul v-if="expandedIndex === index" class="sets-list">
            <li 
              v-for="(set, setIndex) in exercise.sets" 
              :key="setIndex" 
              class="set-item"
            >
              <span class="set-item-number">{{ setIndex + 1 }}.</span>
              <span class="set-details">{{ set.weight }} кг x {{ set.reps }} раз</span>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <RepAdder 
  :handleAddButton="addSet"
  v-model:weightTotal="weightTotal"
  v-model:amountTotal="amountTotal" 
  :showWeight="true"
  :showAmount="true"
  />
  </div>
  
</template>
<script setup>
import '../assets/styles/Exercise.css';
import {ref, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import RepAdder from './SetAdder.vue';
const route = useRoute();
const jsonExercises = ref([
      { 
        name: 'Присед со штангой', 
        sets: [
          {weight: 50, reps: 10},
          {weight: 60, reps: 8},
          {weight: 80, reps: 8},
          {weight: 80, reps: 8},
          {weight: 90, reps: 5},
          {weight: 100, reps: 2}         
        ],     
      }, 
      { 
        name: 'Жим лежа', 
        sets: [
          {weight: 20, reps: 10},
          {weight: 40, reps: 8},
          {weight: 60, reps: 8},
          {weight: 60, reps: 8},
          {weight: 70, reps: 5},
          {weight: 80, reps: 2},
          {weight: 85, reps: 1},                   
        ],     
      }, 
    ]);
const weightTotal = ref(0);
const amountTotal = ref(0);
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
    jsonExercises.value = await response.json();
    console.log(jsonExercises.value);
  } catch (error){
    console.error('Ошибка:', error)
  }
})
function addSet(){
  alert(`weight is ${weightTotal.value} /n amount is ${amountTotal.value}`)
}
</script>