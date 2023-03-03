<template>
  <BaseButton @click="openDialog"> {{ selectedOption?.label }} ▼ </BaseButton>
  <BaseDialog
    :is-open="isDialogOpen"
    @close="closeDialog"
  >
    <div class="panel">
      <BaseInput v-model="search" />
      <div class="items">
        <div
          v-for="option in availableOptions"
          :key="option.value"
          class="item"
          @click="selectOption(option)"
        >
          {{ option.label }}
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import BaseButton from '@/components/__common/BaseButton.vue';
import BaseDialog from '@/components/__common/BaseDialog.vue';
import BaseInput from '@/components/__common/BaseInput.vue';

const props = defineProps<{
  options: Option[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const selectedOption = computed(() =>
  props.options.find((option) => option.value === props.modelValue),
);

function selectOption(option: Option): void {
  emit('update:modelValue', option.value);
  closeDialog();
}

const isDialogOpen = ref(false);
function openDialog(): void {
  isDialogOpen.value = true;
}
function closeDialog(): void {
  search.value = '';
  isDialogOpen.value = false;
}

const search = ref('');
const availableOptions = computed(() => {
  const searchValue = search.value.toLowerCase();
  return props.options.filter((option) =>
    option.label.toLowerCase().includes(searchValue),
  );
});
</script>

<script lang="ts">
interface Option {
  value: string;
  label: string;
}

// eslint-disable-next-line import/prefer-default-export
export { Option };
</script>

<style scoped>
.panel {
  border: 1px solid black;
  border-radius: 8px;
  background: #f2f2f2;
  box-shadow: #ffffff20 0 16px 64px;
}

.items {
  display: flex;
  flex-direction: column;
  width: calc(100vw - 32px);
  height: 80vh;
  padding: 8px;
  overflow-y: auto;
}

@media (min-width: 768px) {
  .items {
    width: 450px;
  }
}

.item {
  padding: 4px;
  cursor: pointer;
}

.item:hover {
  background: #eaeaea;
}
</style>
