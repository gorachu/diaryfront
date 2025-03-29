<template>
    <ul ref="sortableList">
      <li v-for="item in items" :key="item.id" draggable="true" @dragstart="dragStart($event, item)" @dragend="dragEnd">
        {{ item.text }}
      </li>
    </ul>
  </template>
  
  <script setup>
  import { ref, onMounted } from "vue";
  
  const sortableList = ref(null);
  const draggedItem = ref(null);
  const items = ref([
    { id: 1, text: "Элемент 1" },
    { id: 2, text: "Элемент 2" },
    { id: 3, text: "Элемент 3" },
    { id: 4, text: "Элемент 4" },
  ]);
  
  const dragStart = (event, item) => {
    draggedItem.value = item;
    event.target.style.opacity = "0.5";
  };
  
  const dragEnd = (event) => {
    event.target.style.opacity = "1";
  };
  
  const dragOver = (event) => {
    event.preventDefault();
    const hoveredItem = event.target;
    if (hoveredItem.tagName === "LI" && draggedItem.value) {
      const bounding = hoveredItem.getBoundingClientRect();
      const offset = event.clientY - bounding.top;
      const draggedIndex = items.value.findIndex((i) => i.id === draggedItem.value.id);
      const hoveredIndex = items.value.findIndex((i) => i.text === hoveredItem.textContent.trim());
  
      if (draggedIndex !== -1 && hoveredIndex !== -1 && draggedIndex !== hoveredIndex) {
        const movedItem = items.value.splice(draggedIndex, 1)[0];
        items.value.splice(hoveredIndex, 0, movedItem);
      }
    }
  };
  
  onMounted(() => {
    if (sortableList.value) {
      sortableList.value.addEventListener("dragover", dragOver);
    }
  });
  </script>