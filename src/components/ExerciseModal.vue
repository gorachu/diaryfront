<template>
    <vue-final-modal
      :model-value="isVisible"
      @closed="afterClose"
      @click-outside="handleCancel"
      :click-to-close="false"
      classes="modal-container"
      content-class="modal-content"
    >
      <h2 class="add-exercise-header">{{ modalTitle }}</h2>
  
      <div class="column custom-hight">
        <div class="row justify-center">
          <span class="title-choose-exercise">Выбранное упражнение:</span>
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
              <ul class="sets-list sets-list-additional" ref="sortableList">
                <li 
                  v-for="(set, setIndex) in currentExerciseSets" 
                  :key="setIndex" 
                  draggable="true"
                  :data-index="setIndex"
                  @dragstart="dragStart($event, set, setIndex)" 
                  @dragend="dragEnd"
                >
                  <div v-if="setIndex === 0 && targetedSpot === -1" class="separator"></div>
                  <div class="set-item set-item-addition">
                    <span class="set-item-number">{{ setIndex + 1 }}.</span>
                    <span class="set-details">{{ set.weight }} кг x {{ set.repetitions }} раз</span>
                    <button class="set-deletion" @click="deleteSetFromCurrent(setIndex)" title="Удалить этот подход">x</button>
                  </div>
                  <div v-if="setIndex === targetedSpot" class="separator"></div>
                </li>
              </ul>
            </div>
          </div>
          
          <div v-if="selectedOption" class="rep-adder-holder">
            <RepAdder 
              :handleAddButton="addSet"
              v-model:weightTotal="weightTotal"
              v-model:amountTotal="amountTotal"
              :showWeight="true"
              :showAmount="true"
              :dropdownOptions="dropdownOptions"
            />
          </div>
        </div>
        <div class="modal__action">
        <button  @click="handleConfirm">{{ confirmText }}</button>
        <button  @click="handleCancel">{{ cancelText }}</button>
        <div v-if="showDeleteButton === true">
            <button  @click="handleDelete">{{'Удалить'}}</button>
        </div>
      </div>
      </div>
  
      <button class="modal-close" @click="handleCancel">x</button>
  
      
    </vue-final-modal>
  </template>
  
  <script setup>
  import { defineProps, defineExpose, ref, onMounted } from 'vue'; 
  import Vue3Select from 'vue3-select';
  import 'vue3-select/dist/vue3-select.css';
  import RepAdder from './SetAdder.vue';

  const isVisible = ref(false);

  const weightTotal = ref(0);
  const amountTotal = ref(0);

  const selectedOption = defineModel('selectedOption');
  const dropdownOptions = defineModel('dropdownOptions');
  const currentExerciseSets = defineModel('currentExerciseSets');
  const showDeleteButton = defineModel('showDeleteButton');
  const handleDelete = defineModel('handleDeleteButton');

  const sortableList = ref(null);
  const draggedItem = ref(null);
  const targetedSpot = ref(-2);

  defineProps({
  modalTitle: String,
  confirmText: String,    
  cancelText: String,     
  dropdownOptions: Array, 
  selectedOption: Object,
  currentExerciseSets: Array,
  showDeleteButton: Boolean,
  handleDeleteButton: Function,
  handleConfirm: Function,
  handleCancel: Function
  });
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
  console.log("selected option",selectedOption.value);
}
function deleteSetFromCurrent(setIndex) {
  if (setIndex >= 0 && setIndex < currentExerciseSets.value.length) {
    currentExerciseSets.value.splice(setIndex, 1);
  } else {
    console.error("Invalid index");
  }
}
function afterClose(){
  currentExerciseSets.value = [];
  showDeleteButton.value = false;
}
const dragStart = (event, item, itemIndex) => {
  draggedItem.value = { item, index: itemIndex };
  event.target.style.opacity = "0.5";
};

const dragEnd = (event) => {
  event.target.style.opacity = "1";
  targetedSpot.value = -2;
};
const dragOver = (event) => {
  event.preventDefault();
  const hoveredItem = event.target.closest("li");
  if (!hoveredItem || !draggedItem.value) return; 
  if (hoveredItem.tagName === "LI" && draggedItem.value) {
    const hoveredIndex = parseInt(hoveredItem.dataset.index, 10);
    const bounding = hoveredItem.getBoundingClientRect();
    const offset = event.clientY - bounding.top;
    if (offset > bounding.height / 2) {
      targetedSpot.value = hoveredIndex;
    } else {
      targetedSpot.value = hoveredIndex - 1;
    }
  }
}
const drop = (event) => {
  event.preventDefault();
  const hoveredItem = event.target.closest("li");
  if (hoveredItem.tagName === "LI" && draggedItem.value) {
    const hoveredIndex = parseInt(hoveredItem.dataset.index, 10);
    const bounding = hoveredItem.getBoundingClientRect();
    const offset = event.clientY - bounding.top;
    if (offset > bounding.height / 2) {
      changeOrder(draggedItem.value.index, hoveredIndex, true);
    } else {
      changeOrder(draggedItem.value.index, hoveredIndex, false);
    }
  }
};
function changeOrder(draggedIndex, hoveredIndex, putAfterTargeted) {
  if (draggedIndex === hoveredIndex) return;
  if(putAfterTargeted && draggedIndex > hoveredIndex) {
    hoveredIndex = hoveredIndex + 1;
  };
  if(!putAfterTargeted && draggedIndex < hoveredIndex) {
    hoveredIndex = hoveredIndex - 1;
  };
  const draggedItem = currentExerciseSets.value[draggedIndex];
  currentExerciseSets.value.splice(draggedIndex, 1);
  currentExerciseSets.value.splice(hoveredIndex, 0, draggedItem);
};
onMounted(() => {
  if (sortableList.value) {
    sortableList.value.addEventListener("dragover", dragOver);
    sortableList.value.addEventListener("drop", drop);
  }
});
const openModal = () => {
  isVisible.value = true;
};

const closeModal = () => {
  isVisible.value = false;
};
defineExpose({
    openModal,
    closeModal,
  });
</script>