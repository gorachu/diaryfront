<template>
    <div class="round-box">
        <div v-if="showWeight" class="column">
          <div class="row justify-center">
            <p class="title">Вес:</p>
            <div class="column">      
              <input type="number" v-model="weightTotal" placeholder="Edit integer" class="box" min="0" @input="validateWeight"/>
              <button class="outline-scale" @click="resetWeight()"> Сброс</button>
            </div>
            <div class="column">
              <button class="outline-scale" @click="addWeight(weightDelta)">+</button>
              <button class="outline-scale" @click="addWeight(weightDelta * -1)">-</button>
            </div>
  
            <vue3-select
              v-model="weightDelta"
              :options="weightOptions"
              label="Выберите значение"
              placeholder="Выберите вес"
              :clearable="false"
              class="custom-width"
            />
          </div>
        </div>
  
        <div v-if="showAmount" class="column">
          <div class="row justify-center">
            <p class="title">Повторения:</p>      
            <div class="column">
              <input type="number" v-model="amountTotal" placeholder="Edit integer" class="box" min="0" @input="validateAmount"/>
              <button class="outline-scale" @click="resetAmount"> Сброс</button>
            </div>
  
            <div class="column">
              <button class="outline-scale" @click="addAmount(amountDelta)">+</button>
              <button class="outline-scale" @click="addAmount(amountDelta * -1)">-</button>
            </div>
  
            <vue3-select
              v-model="amountDelta"
              :options="amountOptions"
              label="Выберите значение"
              placeholder="Выберите количество повторений"
              :clearable="false"
              class="custom-width"
            />
          </div>
        </div>
        <button class="align-to-front center outline-scale" @click="handleAddButton">Добавить</button>
      </div>
</template>
<script setup>
import {ref} from 'vue';
import Vue3Select from 'vue3-select';
import 'vue3-select/dist/vue3-select.css';
import { defineProps} from 'vue';
const weightTotal = defineModel('weightTotal')
const amountTotal = defineModel('amountTotal')

const props = defineProps({
    showWeight: {
      type: Boolean,
      default: true,
    },
    showAmount: {
      type: Boolean,
      default: true,
    },
    handleAddButton: {
      type: Function,
      default: () => {
        alert("Переопределите это действие! props: handleAddButton");
      }
    }
});

const weightDelta = ref(2.5);
const amountDelta = ref(1);
const weightOptions = [1.25, 2.5, 5, 10, 15, 20, 25];
const amountOptions = [1, 5, 10, 20, 50, 100];

function addWeight(weight){
  if(weightTotal.value + weight > 0){
    weightTotal.value += weight;
  } else {
    weightTotal.value = 0;
  }
}
function addAmount(amount){
  if(amountTotal.value + amount > 0){
  amountTotal.value += amount;
  } else {
  amountTotal.value = 0;
  }
}
function resetWeight(){
  weightTotal.value = 0;
}
function resetAmount(){
  amountTotal.value = 0;
}
function validateWeight() {
  if (weightTotal.value < 0 || typeof weightTotal.value != "number") {
    weightTotal.value = 0;
  }
}
function validateAmount() {
  if (amountTotal.value < 0 || typeof amountTotal.value != "number") {
      amountTotal.value = 0;
  }
}
</script>