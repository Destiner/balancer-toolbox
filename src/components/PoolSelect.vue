<template>
  <div class="selected">
    <div
      v-for="(opt, index) in selectedOptions"
      :key="opt.value"
      class="item"
    >
      <span>{{ index + 1 }}</span> {{ opt.label }}
      <CrossIcon
        class="icon"
        @click="deleteOption(opt)"
      />
    </div>
  </div>
  <BaseButton
    class="button"
    @click="openDialog"
  >
    Add pool
  </BaseButton>
  <BaseDialog
    :is-open="isDialogOpen"
    @close="closeDialog"
  >
    <div class="options">
      <div>
        <div
          v-for="option in availableOptions"
          :key="option.value"
          class="item"
          @click="select(option)"
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
import CrossIcon from '@/components/__common/icon/Cross.vue';

const props = defineProps<{
  options: Option[];
  modelValue: string[];
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string[]): void;
}>();

function select(option: Option): void {
  emit('update:modelValue', [...props.modelValue, option.value]);
  closeDialog();
}

const selectedOptions = computed(() =>
  props.options.filter((option) => props.modelValue.includes(option.value)),
);

const isDialogOpen = ref(false);
function openDialog(): void {
  isDialogOpen.value = true;
}
function closeDialog(): void {
  isDialogOpen.value = false;
}

const availableOptions = computed(() =>
  props.options.filter((option) => !props.modelValue.includes(option.value)),
);

function deleteOption(option: Option): void {
  emit(
    'update:modelValue',
    props.modelValue.filter((value) => value !== option.value),
  );
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
.selected .item {
  display: flex;
  align-items: center;
  gap: var(--spacing-small);
}

.selected .item .icon {
  width: 16px;
  height: 16px;
  opacity: 0.6;
  cursor: pointer;
}

.selected .item .icon:hover {
  opacity: 1;
}

.button {
  width: 100px;
}

.options {
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
  .options {
    width: 450px;
  }
}

.options .item {
  padding: 4px;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.options .item:hover {
  background: #eaeaea;
}
</style>
