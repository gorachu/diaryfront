<template>
<vue-final-modal
    :model-value="isVisible"
    @closed="afterClose"
    @click-outside="handleCancel"
    :click-to-close="false"
    classes="modal-container"
    content-class="modal-content"
>
    <h2 class="add-exercise-header">Изменить данные о тренировке</h2>
    <div class="form-fields">
      <div class="form-group">
        <label for="training-date">Дата:</label>
        <input
          id="training-date"
          type="date"
          v-model="localTrainingDay"
          required
        />
        <span v-if="!isDateValid" class="error-message">Неверный формат даты (YYYY-MM-DD)</span>
      </div>
      <div class="form-group">
        <label for="end-time">Время окончания:</label>
        <input
          id="end-time"
          type="time"
          v-model="localEndTime"
          step="1"
        />
      </div>
    </div>
    <div class="modal__action">
    <button  @click="handleConfirm">Сохранить</button>
    <button  @click="handleCancel">Отменить</button>
    <button  @click="handleDelete">Удалить</button>
    </div>
    <button class="modal-close" @click="handleCancel">x</button>
</vue-final-modal>
</template>

<script setup>
import { defineProps, defineExpose, ref} from 'vue'; 
import 'vue3-select/dist/vue3-select.css';

const isVisible = ref(false);
const localTrainingDay = ref("");
const localEndTime = ref("");

const training = defineModel('training');
const handleDelete = defineModel('handleDelete');
const handleConfirm = defineModel('handleConfirm');
const handleCancel = defineModel('handleCancel');

const isDateValid = ref(true);
const isEndTimeValid = ref(true); 

defineProps({
training: Object,
handleDelete: Function,
handleConfirm: Function,
handleCancel: Function
});
function afterClose(){
  training.value = null;
  localTrainingDay.value = "";
  localEndTime.value = "";
}
const openModal = () => {
  isVisible.value = true;
};

const closeModal = () => {
  isVisible.value = false;
};

const getLocalTrainingDay = () => {
  return localTrainingDay.value;
};
const getLocalEndTime = () => {
  return localEndTime.value;
};
defineExpose({
    openModal,
    closeModal,
    getLocalTrainingDay,
    getLocalEndTime,
});
function validateDate() {
  //TODO
}
</script>