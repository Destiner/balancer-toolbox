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
    <div class="panel">
      <BaseInput v-model="search" />
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
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import BaseButton from '@/components/__common/BaseButton.vue';
import BaseDialog from '@/components/__common/BaseDialog.vue';
import BaseInput from '@/components/__common/BaseInput.vue';
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
  props.modelValue
    .map((value) => {
      const option = props.options.find((opt) => opt.value === value);
      return option;
    })
    .filter((option): option is Option => option !== undefined),
);

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
  return props.options.filter(
    (option) =>
      option.label.toLowerCase().includes(searchValue) &&
      !props.modelValue.includes(option.value),
  );
});

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

.panel {
  border: 1px solid black;
  border-radius: 8px;
  background: #f2f2f2;
  box-shadow: #ffffff20 0 16px 64px;
}

.options {
  display: flex;
  flex-direction: column;
  width: calc(100vw - 32px);
  height: 80vh;
  padding: 8px;
  overflow-y: auto;
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
