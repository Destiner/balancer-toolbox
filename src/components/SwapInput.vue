<template>
  <div>
    <BaseInput
      :model-value="amountIn"
      @update:model-value="handleAmountInInput"
    />
    <TokenSelect
      :model-value="tokenIn"
      :options="tokenOptions"
      @update:model-value="handleTokenInUpdate"
    />
  </div>
  <div>
    <BaseInput
      :model-value="amountOut"
      @update:model-value="handleAmountOutInput"
    />
    <TokenSelect
      :model-value="tokenOut"
      :options="tokenOptions"
      @update:model-value="handleTokenOutUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

import { Token } from '@/utils/tokens';

import BaseInput from './BaseInput.vue';
import TokenSelect from './TokenSelect.vue';

const props = defineProps<{
  tokens: Token[];
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  amountOut: string;
}>();

const emit = defineEmits<{
  (event: 'update:tokenIn', value: string): void;
  (event: 'update:tokenOut', value: string): void;
  (event: 'update:amountIn', value: string): void;
  (event: 'update:amountOut', value: string): void;
}>();

const tokenOptions = computed(() =>
  props.tokens.map((token) => {
    return {
      label: token.name,
      value: token.address,
    };
  }),
);

function handleTokenInUpdate(value: string): void {
  emit('update:tokenIn', value);
}

function handleTokenOutUpdate(value: string): void {
  emit('update:tokenOut', value);
}

function handleAmountInInput(value: string): void {
  emit('update:amountIn', value);
}

function handleAmountOutInput(value: string): void {
  emit('update:amountOut', value);
}
</script>
