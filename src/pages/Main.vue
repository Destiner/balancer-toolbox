<template>
  <div>
    <h1>Main page</h1>
  </div>
  <div class="sections">
    <div class="section list">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="item"
        :class="{ selected: item === selectedItem }"
        @click="selectItem(item)"
      >
        {{ item }}
      </div>
    </div>
    <div class="section form">
      <div v-if="selectedItem === 'Query batch swap'">
        <div>
          1. Option
          <BaseTabs
            v-model="queryBatchSwapSelectedOption"
            :options="queryBatchSwapOptions"
          />
        </div>
        <div v-if="queryBatchSwapSelectedOption === 'ALL_POOLS'">
          2. Swap
          <SwapInput
            v-model:token-in="swapTokenInValue"
            v-model:token-out="swapTokenOutValue"
            v-model:amount-in="swapAmountInValue"
            v-model:amount-out="swapAmountOutValue"
            :tokens="TOKENS"
          />
        </div>
        <div v-else-if="queryBatchSwapSelectedOption === 'SELECTED_POOLS'">
          <div>
            2. Pools
            <BaseMultiSelect
              v-model="selectedPools"
              :options="poolOptions"
            />
          </div>
          <div>
            3. Swap
            <SwapInput
              v-model:token-in="swapTokenInValue"
              v-model:token-out="swapTokenOutValue"
              v-model:amount-in="swapAmountInValue"
              v-model:amount-out="swapAmountOutValue"
              :tokens="TOKENS"
            />
          </div>
        </div>
        <div v-else-if="queryBatchSwapSelectedOption === 'SELECTED_PATH'">
          todo
        </div>
      </div>
      <div v-else>todo</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import BaseMultiSelect from '@/components/BaseMultiSelect.vue';
import BaseTabs from '@/components/BaseTabs.vue';
import SwapInput from '@/components/SwapInput.vue';
import { POOLS } from '@/utils/pools';
import { TOKENS } from '@/utils/tokens';

const items: string[] = ['Query batch swap', 'Pool state', 'Pool spot price'];

const selectedItem = ref(items[0]);

function selectItem(item: string): void {
  selectedItem.value = item;
}

const queryBatchSwapOptions = [
  { label: 'All pools', value: 'ALL_POOLS' },
  { label: 'Selected pools', value: 'SELECTED_POOLS' },
  { label: 'Selected path', value: 'SELECTED_PATH' },
];
const queryBatchSwapSelectedOption = ref('ALL_POOLS');

const poolOptions = POOLS.map((pool) => {
  return {
    label: pool.name,
    value: pool.address,
  };
});
const selectedPools = ref<string[]>([]);

const swapTokenInValue = ref('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
const swapTokenOutValue = ref('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
const swapAmountInValue = ref('0');
const swapAmountOutValue = ref('0');
</script>

<style scoped>
.sections {
  display: flex;
}

.list {
  width: 300px;
}

.item {
  padding: 4px 8px;
  cursor: pointer;
}

.item:hover {
  background: #0000001a;
}

.item.selected {
  font-weight: bold;
}

.form {
  padding: 16px;
}
</style>
