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
            v-if="tokens.length > 0"
            v-model:token-in="swapTokenInValue"
            v-model:token-out="swapTokenOutValue"
            v-model:amount-in="swapAmountInValue"
            v-model:amount-out="swapAmountOutValue"
            :tokens="tokens"
          />
          <textarea
            v-if="snippet"
            :value="snippet"
            readonly
          />
          <div><button @click="queryAllPools">Query</button></div>
          <textarea
            v-if="result"
            :value="result"
            readonly
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
              v-if="tokens.length > 0"
              v-model:token-in="swapTokenInValue"
              v-model:token-out="swapTokenOutValue"
              v-model:amount-in="swapAmountInValue"
              v-model:amount-out="swapAmountOutValue"
              :tokens="tokens"
            />
          </div>
          <div><button @click="querySelectedPools">Query</button></div>
          <textarea
            v-if="result"
            :value="result"
            readonly
          />
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
import { BalancerSDK, SwapTypes, SubgraphPoolBase } from '@balancer-labs/sdk';
import {
  Address,
  configureChains,
  createClient,
  mainnet,
  readContract,
} from '@wagmi/core';
import { alchemyProvider } from '@wagmi/core/providers/alchemy';
import { BigNumber } from 'ethers';
import { computed, onMounted, ref, watch } from 'vue';

import { vaultAbi } from '@/abi';
import BaseMultiSelect from '@/components/BaseMultiSelect.vue';
import BaseTabs from '@/components/BaseTabs.vue';
import SwapInput from '@/components/SwapInput.vue';
import useEnv from '@/composables/useEnv';
import TokenlistService, { DEFAULT_LIST } from '@/services/tokenlist';
import { Token } from '@/utils/tokens';

interface Pool {
  name: string;
  address: string;
}

const { providerKey } = useEnv();

const { provider } = configureChains(
  [mainnet],
  [alchemyProvider({ apiKey: providerKey })],
);
createClient({
  autoConnect: true,
  provider,
});
const sdk = new BalancerSDK({
  network: 1,
  rpcUrl: `https://eth-mainnet.g.alchemy.com/v2/${providerKey}`,
});
const service = new TokenlistService(DEFAULT_LIST);

onMounted(() => {
  initSdk();
  fetchTokens();
});

async function initSdk(): Promise<void> {
  await sdk.sor.fetchPools();
  pools.value = sdk.sor.getPools();
}

const tokens = ref<Token[]>([]);
async function fetchTokens(): Promise<void> {
  const list = await service.get();
  tokens.value = list.tokens;
}

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
watch(queryBatchSwapSelectedOption, () => {
  result.value = '';
});

const pools = ref<SubgraphPoolBase[]>([]);
const poolOptions = computed(() => {
  return pools.value.map((pool) => {
    return {
      label: pool.tokens
        .map((poolToken) => {
          const token = tokens.value.find(
            (token) => token.address === poolToken.address,
          );
          return token?.symbol || poolToken.address.substring(0, 8);
        })
        .join('/'),
      value: pool.address,
    };
  });
});
const selectedPools = ref<string[]>([]);

const isExactIn = ref(true);
const swapTokenInValue = ref('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
const swapTokenOutValue = ref('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
const swapAmountInValue = ref('');
const swapAmountOutValue = ref('');

watch(swapAmountInValue, () => {
  isExactIn.value = true;
});
watch(swapAmountOutValue, () => {
  isExactIn.value = false;
});

const snippet = computed<string | null>(() => {
  if (selectedItem.value !== 'Query batch swap') {
    return null;
  }
  if (queryBatchSwapSelectedOption.value !== 'ALL_POOLS') {
    return null;
  }
  return `const swapInfo = await sdk.sor.getSwaps(
  '${swapTokenInValue.value}',
  '${swapTokenOutValue.value}',
  ${isExactIn.value ? 'SwapTypes.SwapExactIn' : 'SwapTypes.SwapExactOut'},
  ${
    isExactIn.value
      ? `BigNumber.from('${swapAmountInValue.value}')`
      : `BigNumber.from('${swapAmountOutValue.value}')`
  },
);

const vaultAddress = '0xBA12222222228d8Ba445958a75a0704d566BF2C8';
const vault = new ethers.Contract(vaultAddress, vaultAbi, provider);
const values = await vault.queryBatchSwap(
  ${isExactIn.value ? 'SwapTypes.SwapExactIn' : 'SwapTypes.SwapExactOut'},
  swapInfo,
  ['${swapTokenInValue.value}', '${swapTokenOutValue.value}'],
  {
    sender: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    fromInternalBalance: false,
    recipient: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
    toInternalBalance: false,
  }
)
  `;
});

const result = ref('');

async function queryAllPools(): Promise<void> {
  const amount = isExactIn.value
    ? BigNumber.from(swapAmountInValue.value)
    : BigNumber.from(swapAmountOutValue.value);
  const swapType = isExactIn.value
    ? SwapTypes.SwapExactIn
    : SwapTypes.SwapExactOut;
  const swapInfo = await sdk.sor.getSwaps(
    swapTokenInValue.value,
    swapTokenOutValue.value,
    swapType,
    amount,
  );
  const values = await readContract({
    address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
    abi: vaultAbi,
    functionName: 'queryBatchSwap',
    args: [
      swapType,
      swapInfo.swaps.map((swap) => {
        return {
          poolId: swap.poolId as Address,
          assetInIndex: BigNumber.from(swap.assetInIndex),
          assetOutIndex: BigNumber.from(swap.assetOutIndex),
          amount: BigNumber.from(swap.amount),
          userData: swap.userData as Address,
        };
      }),
      [swapTokenInValue.value as Address, swapTokenOutValue.value as Address],
      {
        sender: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        fromInternalBalance: false,
        recipient: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
        toInternalBalance: false,
      },
    ],
  });
  result.value = JSON.stringify(values.map((value) => value.toString()));
}

async function querySelectedPools(): Promise<void> {
  console.log('todo');
}
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

textarea {
  font-family: 'Courier New', Courier, monospace;
}
</style>
