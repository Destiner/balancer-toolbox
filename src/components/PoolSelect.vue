<template>
  <BaseButton @click="openDialog"> {{ label }} ▼ </BaseButton>
  <BaseDialog
    :is-open="isDialogOpen"
    @close="closeDialog"
  >
    <div class="items">
      <div>
        <div
          v-for="option in options"
          :key="option.value"
          class="item"
          @click="toggleOption(option)"
        >
          <span v-if="isSelected(option)">✓</span>
          {{ option.label }}
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import BaseButton from './BaseButton.vue';
import BaseDialog from './BaseDialog.vue';

const props = defineProps<{
  options: Option[];
  modelValue: string[];
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string[]): void;
}>();

function toggleOption(option: Option): void {
  if (isSelected(option)) {
    emit(
      'update:modelValue',
      props.modelValue.filter((value) => value !== option.value),
    );
  } else {
    emit('update:modelValue', [...props.modelValue, option.value]);
  }
}

const selectedOptions = computed(() =>
  props.options.filter((option) => props.modelValue.includes(option.value)),
);
function isSelected(option: Option): boolean {
  return selectedOptions.value.some(
    (selectedOption) => selectedOption.value === option.value,
  );
}

const label = computed(() => {
  const count = selectedOptions.value.length;
  if (count === 0) {
    return 'Select pool(s)';
  } else {
    return `${count} pools selected`;
  }
});

const isDialogOpen = ref(false);
function openDialog(): void {
  isDialogOpen.value = true;
}
function closeDialog(): void {
  isDialogOpen.value = false;
}
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
.items {
  display: flex;
  flex-direction: column;
  width: calc(100vw - 32px);
  max-height: 80vh;
  padding: 16px;
  overflow-y: auto;
  border: 1px solid black;
  border-radius: 8px;
  background: #f2f2f2;
  box-shadow: #ffffff20 0 16px 64px;
}

@media (min-width: 768px) {
  .items {
    width: 450px;
  }
}

.item {
  padding: 4px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.item:hover {
  background: #eaeaea;
}
</style>
