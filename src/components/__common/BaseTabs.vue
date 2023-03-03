<template>
  <TabGroup
    :selected-index="selectedOptionIndex"
    @change="handleChange"
  >
    <TabList>
      <Tab
        v-for="(option, index) in options"
        :key="option.value"
        class="tab"
        :class="{ selected: index === selectedOptionIndex }"
      >
        {{ option.label }}
      </Tab>
    </TabList>
  </TabGroup>
</template>

<script setup lang="ts">
import { TabGroup, TabList, Tab } from '@headlessui/vue';
import { computed } from 'vue';

const props = defineProps<{
  options: Option[];
  modelValue: string;
}>();

const emit = defineEmits<{
  (event: 'update:modelValue', value: string): void;
}>();

const selectedOptionIndex = computed(() =>
  props.options.findIndex((option) => option.value === props.modelValue),
);

function handleChange(newIndex: number): void {
  const newSelected = props.options[newIndex];
  emit('update:modelValue', newSelected.value);
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
.tab {
  border: none;
  background: #eee;
  cursor: pointer;
}

.tab.selected {
  border: 1px solid black;
  background: #eee;
}
</style>
