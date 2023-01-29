<template>
  <Listbox
    :model-value="selectedOption"
    @update:model-value="handleUpdate"
  >
    <ListboxButton>{{ selectedOption.label }}</ListboxButton>
    <ListboxOptions>
      <ListboxOption
        v-for="option in options"
        :key="option.value"
        :value="option"
      >
        {{ option.label }}
      </ListboxOption>
    </ListboxOptions>
  </Listbox>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { computed } from 'vue';

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

function handleUpdate(option: Option): void {
  emit('update:modelValue', option.value);
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
