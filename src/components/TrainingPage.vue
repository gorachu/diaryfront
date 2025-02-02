<template>
  <div class="training-holder">
    <h2 class="trainings-header">Тренировка:</h2>
    <div>
      <ul>
        
      </ul>
    </div>
  </div>
  <RepAdder 
  :handleAddButton="addSet"
  v-model:weightTotal="weightTotal"
  v-model:amountTotal="amountTotal" 
  :showWeight="true"
  :showAmount="true"
  />
</template>
<script setup>
import {ref, onMounted} from 'vue';
import { useRoute } from 'vue-router';
import RepAdder from './SetAdder.vue';
const route = useRoute();
const jsonExercises = ref([]);
const weightTotal = ref(0);
const amountTotal = ref(0);
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