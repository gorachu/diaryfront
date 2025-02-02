<template>
  <div class="swiper-container">
    <div
      v-for="(card, index) in visibleCards"
      :key="card.id"
      class="card"
      :style="cardStyle(index)"
      @mousedown="startDrag"
      @touchstart="startDrag"
    >
      <h3>{{ card.title }}</h3>
      <p>{{ card.description }}</p>
    </div>
  </div>
</template>

<script setup>
import '../assets/styles/Card.css';
import { ref, computed, onUnmounted } from 'vue';

const cards = ref([
  { id: 1, title: 'Карточка 1', description: 'Описание карточки 1' },
  { id: 2, title: 'Карточка 2', description: 'Описание карточки 2' },
  { id: 3, title: 'Карточка 3', description: 'Описание карточки 3' },
  { id: 4, title: 'Карточка 4', description: 'Описание карточки 4' },
  { id: 5, title: 'Карточка 5', description: 'Описание карточки 5' },
  { id: 6, title: 'Карточка 6', description: 'Описание карточки 6' },
  { id: 7, title: 'Карточка 7', description: 'Описание карточки 7' },
  { id: 8, title: 'Карточка 8', description: 'Описание карточки 8' },
  { id: 9, title: 'Карточка 9', description: 'Описание карточки 9' },
  { id: 10, title: 'Карточка 10', description: 'Описание карточки 10' },
]);

const dragging = ref(false);
const startX = ref(0);
const currentX = ref(0);

const visibleCards = computed(() => cards.value.slice(0, 2));

const startDrag = (event) => {
  dragging.value = true;
  startX.value = event.touches ? event.touches[0].clientX : event.clientX;

  document.addEventListener('mousemove', onDrag);
  document.addEventListener('mouseup', endDrag);
  document.addEventListener('touchmove', onDrag);
  document.addEventListener('touchend', endDrag);
};

const onDrag = (event) => {
  if (!dragging.value) return;
  currentX.value = (event.touches ? event.touches[0].clientX : event.clientX) - startX.value;
  console.log(currentX.value)
};

const endDrag = () => {
  dragging.value = false;
  if (Math.abs(currentX.value) > 100) {
    cards.value.shift();
  }
  currentX.value = 0;

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
  const backgroundColor = currentX.value > 50 ? '#d4edda' : currentX.value < -50 ? '#f8d7da' : '#fff';
  console.log("Change")
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
</script>