<template>
  <div class="swiper-container">
    <div class="card-holder">
      <div
        v-for="(card, index) in visibleCards"
        :key="card.id"
        class="card"
        :style="cardStyle(index)"
        @mousedown="startDrag"
        @touchstart="startDrag"
      >
        <div class="card-content">
          <div class="image-holder">
            <img :src="card.img" alt="Card image" class="card-image" draggable="false"/>
          </div>
          <h2 class="username-on-card">Gymdestroer20</h2>
          <h3 class="training-describer">Описание тренировки:</h3>
          <p class="card-text">Тренировки являются неотъемлемой частью поддержания физической формы и здоровья. Они помогают улучшить выносливость, силу и гибкость, а также поддерживать оптимальный вес тела. Важной составляющей успешного режима тренировок является правильное питание, и одним из полезных продуктов в этом контексте является кукуруза. Кукуруза — это отличный источник углеводов, который дает организму необходимую энергию для интенсивных физических нагрузок. Она также богата клетчаткой, витаминами группы B и минералами, такими как магний и калий, которые способствуют нормализации обмена веществ и восстановлению после тренировок. Включение кукурузы в рацион помогает обеспечить стабильный уровень энергии, поддерживает работу мышц и способствует общему</p>
          <h3 class="training-describer">Состав тренировки:</h3>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import '../assets/styles/Card.css';
import { ref, computed, onUnmounted } from 'vue';
import bigangrygymbro from '../assets/images/photo.jpg';
import longpic from '../assets/images/longpic.jpg';
import widepic from '../assets/images/bolshie-fotografii.jpg';
import buffedMan1 from '../assets/images/buffedMan1.jpg';
const cards = ref([
  { id: 1, title: 'Карточка 1', description: 'Описание карточки 1', img: bigangrygymbro},
  { id: 2, title: 'Карточка 2', description: 'Описание карточки 2', img: buffedMan1 },
  { id: 3, title: 'Карточка 3', description: 'Описание карточки 3', img: widepic },
//  { id: 4, title: 'Карточка 4', description: 'Описание карточки 4' },
//  { id: 5, title: 'Карточка 5', description: 'Описание карточки 5' },
//  { id: 6, title: 'Карточка 6', description: 'Описание карточки 6' },
//  { id: 7, title: 'Карточка 7', description: 'Описание карточки 7' },
//  { id: 8, title: 'Карточка 8', description: 'Описание карточки 8' },
//  { id: 9, title: 'Карточка 9', description: 'Описание карточки 9' },
//  { id: 10, title: 'Карточка 10', description: 'Описание карточки 10' },
]);

const dragging = ref(false);
const startX = ref(0);
const currentX = ref(0);

const visibleCards = computed(() => cards.value.slice(0, 2));

const startDrag = (event) => {
  dragging.value = true;
  if (event.touches ) {
    startX.value = event.touches[0].clientX;
  } else {
    startX.value = event.clientX;
  }

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('touchend', endDrag);
};

const onDrag = (event) => {
  if (!dragging.value) return;
  if (event.touches) {
    currentX.value = event.touches[0].clientX - startX.value;
  } else {
    currentX.value = event.clientX - startX.value;
  }
};

const endDrag = (event) => {
  dragging.value = false;
  if (Math.abs(currentX.value) > 100) {
    cards.value.shift();
  }
  currentX.value = 0;
  console.log(event);
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);
};

const cardStyle = (index) => {
  if (index === 1) {
    return {
      transform: `scale(0.95) translateY(10px)`,
      zIndex: 1,
      opacity: 0.8,
    };
  }

  const rotation = Math.max(-15, Math.min(15, currentX.value / 10));
  let backgroundColor;
  if (currentX.value > 50) {
    backgroundColor = '#d4edda';
  } else if (currentX.value < -50) {
      backgroundColor = '#f8d7da';
  } else {
      backgroundColor = '#fff';
  }
  return {
    transform: `translateX(${currentX.value}px) rotate(${rotation}deg)`,
    transition: dragging.value ? 'none' : 'transform 0.3s ease',
    zIndex: 2,
    backgroundColor,
  };
};

onUnmounted(() => {
  document.removeEventListener('mousemove', onDrag);
  document.removeEventListener('mouseup', endDrag);
  document.removeEventListener('touchmove', onDrag);
  document.removeEventListener('touchend', endDrag);
});
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
const toggleSet = (index) => {
  if (expandedIndex.value === index) {
    expandedIndex.value = null;
  } else {
    expandedIndex.value = index;
  }
};
const expandedIndex = ref(null);
    
</script>