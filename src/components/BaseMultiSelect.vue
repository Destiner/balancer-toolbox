<template>
  <Listbox
    :model-value="selectedOptions"
    multiple
    @update:model-value="handleUpdate"
  >
    <ListboxButton>{{ label }}</ListboxButton>
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
  modelValue: string[];
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string[]): void;
}>();

const selectedOptions = computed(() =>
  props.options.filter((option) => props.modelValue.includes(option.value)),
);

const label = computed(() => {
  const count = selectedOptions.value.length;
  if (count === 0) {
    return 'Select pool(s)';
  } else {
    return `${count} pools selected`;
  }
});

function handleUpdate(options: Option[]): void {
  const values = options.map((option) => option.value);
  emit('update:modelValue', values);
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
