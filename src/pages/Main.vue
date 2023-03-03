<template>
  <AppHeader />
  <div class="sections">
    <div class="section list">
      <div class="links">
        <div
          v-for="(item, index) in items"
          :key="index"
          class="link"
          :class="{ active: item === selectedItem }"
          @click="selectItem(item)"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div class="section form">
      <div
        v-if="selectedItem === ACTION_QUERY_BATCH_SWAP"
        class="form-elements"
      >
        <div class="form-element">
          <BaseTabs
            v-model="queryBatchSwapSelectedOption"
            :options="queryBatchSwapOptions"
            :label="'Type'"
          />
        </div>
        <div
          v-if="queryBatchSwapSelectedOption === QUERY_BATCH_SWAP_ALL_POOLS"
          class="form-element"
        >
          <BaseLabel :value="'Pair'" />
          <SwapInput
            v-if="tokens.length > 0"
            v-model:token-in="swapTokenInValue"
            v-model:token-out="swapTokenOutValue"
            v-model:amount-in="swapAmountInValue"
            v-model:amount-out="swapAmountOutValue"
            :tokens="tokens"
            :in-only="false"
          />
        </div>
        <div
          v-else-if="
            queryBatchSwapSelectedOption === QUERY_BATCH_SWAP_SELECTED_POOLS
          "
          class="form-element"
        >
          <div class="pool-path">
            <BaseLabel :value="'Pool path'" />
            <PoolSelect
              v-model="selectedPools"
              :options="poolOptions"
            />
          </div>
          <div>
            <BaseLabel
              v-if="tokens.length > 0"
              :value="'Pair'"
            />
            <SwapInput
              v-if="tokens.length > 0"
              v-model:token-in="swapTokenInValue"
              v-model:token-out="swapTokenOutValue"
              v-model:amount-in="swapAmountInValue"
              v-model:amount-out="swapAmountOutValue"
              :tokens="tokens"
              :in-only="true"
            />
          </div>
        </div>
        <div
          v-else-if="
            queryBatchSwapSelectedOption === QUERY_BATCH_SWAP_SELECTED_PATH
          "
        >
          todo
        </div>
      </div>
      <div v-else>todo</div>
    </div>
    <div
      v-if="selectedItem === ACTION_QUERY_BATCH_SWAP"
      class="section result"
    >
      <BaseLabel
        v-if="snippet"
        :value="'Code'"
      />
      <div
        v-if="snippet"
        class="snippet-view"
      >
        <TextView
          :value="snippet"
          compact
        />
        <button
          class="query-button"
          @click="query"
        >
          Query
        </button>
      </div>
      <BaseLabel
        v-if="result"
        :value="'Result'"
      />
      <TextView
        v-if="result"
        class="text-view"
        :value="result"
        readonly
      />
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
import AppHeader from '@/components/AppHeader.vue';
import PoolSelect from '@/components/PoolSelect.vue';
import SwapInput from '@/components/SwapInput.vue';
import TextView from '@/components/TextView.vue';
import BaseLabel from '@/components/__common/BaseLabel.vue';
import BaseTabs from '@/components/__common/BaseTabs.vue';
import useEnv from '@/composables/useEnv';
import TokenlistService, { DEFAULT_LIST } from '@/services/tokenlist';
import {
  getQueryBatchSwapAllPoolsSnippet,
  getQueryBatchSwapSelectedPoolsSnippet,
} from '@/utils/snippets';
import { Token } from '@/utils/tokens';

const ACTION_QUERY_BATCH_SWAP = 'Query batch swap';
const ACTION_POOL_STATE = 'Pool state';
const ACTION_POOL_SPOT_PRICE = 'Pool spot price';

const QUERY_BATCH_SWAP_ALL_POOLS = 'ALL_POOLS';
const QUERY_BATCH_SWAP_SELECTED_POOLS = 'SELECTED_POOLS';
const QUERY_BATCH_SWAP_SELECTED_PATH = 'SELECTED_PATH';

interface Swap {
  poolId: Address;
  assetInIndex: BigNumber;
  assetOutIndex: BigNumber;
  amount: BigNumber;
  userData: Address;
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

const allTokens = ref<Token[]>([]);
const tokens = ref<Token[]>([]);
async function fetchTokens(): Promise<void> {
  const list = await service.get();
  allTokens.value = list.tokens;
  tokens.value = list.tokens;
}

const items: string[] = [
  ACTION_QUERY_BATCH_SWAP,
  ACTION_POOL_STATE,
  ACTION_POOL_SPOT_PRICE,
];

const selectedItem = ref(items[0]);

function selectItem(item: string): void {
  selectedItem.value = item;
}

const queryBatchSwapOptions = [
  { label: 'All pools', value: QUERY_BATCH_SWAP_ALL_POOLS },
  { label: 'Selected pools', value: QUERY_BATCH_SWAP_SELECTED_POOLS },
  { label: 'Selected path', value: QUERY_BATCH_SWAP_SELECTED_PATH },
];
const queryBatchSwapSelectedOption = ref(QUERY_BATCH_SWAP_ALL_POOLS);
watch(queryBatchSwapSelectedOption, (newValue) => {
  result.value = '';
  if (newValue === QUERY_BATCH_SWAP_ALL_POOLS) {
    tokens.value = allTokens.value;
  }
  if (newValue === QUERY_BATCH_SWAP_SELECTED_POOLS) {
    tokens.value = getPoolTokens(selectedPools.value);
  }
});

const pools = ref<SubgraphPoolBase[]>([]);
const poolOptions = computed(() => {
  return pools.value.map((pool) => {
    return {
      label: pool.tokens
        .map((poolToken) => {
          const token = allTokens.value.find(
            (token) => token.address === poolToken.address,
          );
          return token?.symbol || poolToken.address.substring(0, 8);
        })
        .join('/'),
      value: pool.id,
    };
  });
});
const selectedPools = ref<string[]>([]);
watch(selectedPools, (newValue) => {
  tokens.value = getPoolTokens(newValue);
});

function getPoolTokens(poolIds: string[]): Token[] {
  const poolTokenAddresses = poolIds
    .map((poolId) => {
      const pool = pools.value.find((pool) => pool.id === poolId);
      if (!pool) {
        return [];
      }
      return pool.tokensList;
    })
    .flat();
  const uniquePoolTokenAddresses = [...new Set(poolTokenAddresses)];
  return uniquePoolTokenAddresses
    .map((address) => {
      return allTokens.value.find((token) => token.address === address);
    })
    .filter((token): token is Token => !!token);
}

const isExactIn = ref(true);
const swapTokenInValue = ref('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2');
const swapTokenOutValue = ref('0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48');
const swapAmountInValue = ref('');
const swapAmountOutValue = ref('');

watch(swapAmountInValue, () => {
  isExactIn.value = true;
  swapAmountOutValue.value = '';
});
watch(swapAmountOutValue, () => {
  isExactIn.value = false;
  swapAmountInValue.value = '';
});

const snippet = computed<string | null>(() => {
  if (selectedItem.value !== ACTION_QUERY_BATCH_SWAP) {
    return null;
  }
  if (queryBatchSwapSelectedOption.value === QUERY_BATCH_SWAP_ALL_POOLS) {
    return getQueryBatchSwapAllPoolsSnippet(
      swapTokenInValue.value,
      swapTokenOutValue.value,
      isExactIn.value,
      swapAmountInValue.value,
      swapAmountOutValue.value,
    );
  }
  if (queryBatchSwapSelectedOption.value === QUERY_BATCH_SWAP_SELECTED_POOLS) {
    const swapData = getSelectedPoolSwapData();
    return getQueryBatchSwapSelectedPoolsSnippet(
      swapData.swaps,
      swapData.tokens,
    );
  }
  return null;
});

const result = ref('');

function query(): void {
  if (selectedItem.value !== ACTION_QUERY_BATCH_SWAP) {
    return;
  }
  if (queryBatchSwapSelectedOption.value === QUERY_BATCH_SWAP_ALL_POOLS) {
    queryAllPools();
  }
  if (queryBatchSwapSelectedOption.value === QUERY_BATCH_SWAP_SELECTED_POOLS) {
    querySelectedPools();
  }
}

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
  try {
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
        swapInfo.tokenAddresses as Address[],
        {
          sender: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          fromInternalBalance: false,
          recipient: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          toInternalBalance: false,
        },
      ],
    });
    result.value = JSON.stringify(values.map((value) => value.toString()));
  } catch (e) {
    console.warn(e);
  }
}

function getSelectedPoolSwapData(): {
  swaps: Swap[];
  tokens: string[];
} {
  if (swapAmountInValue.value === '') {
    return {
      swaps: [],
      tokens: [],
    };
  }
  const initialAmount = BigNumber.from(swapAmountInValue.value);
  const swapTokens: string[] = [];
  const swaps: Swap[] = [];
  const activePools = selectedPools.value
    .map((poolId) => {
      return pools.value.find((pool) => pool.id === poolId);
    })
    .filter((pool): pool is SubgraphPoolBase => !!pool);
  for (let i = 0; i < activePools.length; i++) {
    const pool = activePools[i];
    const amount = i === 0 ? initialAmount : BigNumber.from('0');
    const prevPoolCommonTokens = getIntersection(
      i === 0 ? [] : activePools[i - 1].tokensList,
      activePools[i].tokensList,
    );
    const nextPoolCommonTokens = getIntersection(
      activePools[i].tokensList,
      i === activePools.length - 1 ? [] : activePools[i + 1].tokensList,
    );
    const assetIn = i === 0 ? swapTokenInValue.value : prevPoolCommonTokens[0];
    const assetOut =
      i === activePools.length - 1
        ? swapTokenOutValue.value
        : nextPoolCommonTokens[0];
    if (!swapTokens.includes(assetIn)) {
      swapTokens.push(assetIn);
    }
    if (!swapTokens.includes(assetOut)) {
      swapTokens.push(assetOut);
    }
    const swap: Swap = {
      poolId: pool.id as Address,
      assetInIndex: BigNumber.from(swapTokens.indexOf(assetIn)),
      assetOutIndex: BigNumber.from(swapTokens.indexOf(assetOut)),
      amount,
      userData: '0x',
    };
    swaps.push(swap);
  }
  return { swaps, tokens: swapTokens };
}

async function querySelectedPools(): Promise<void> {
  const { swaps, tokens } = getSelectedPoolSwapData();
  try {
    const values = await readContract({
      address: '0xBA12222222228d8Ba445958a75a0704d566BF2C8',
      abi: vaultAbi,
      functionName: 'queryBatchSwap',
      args: [
        SwapTypes.SwapExactIn,
        swaps.map((swap) => {
          return {
            poolId: swap.poolId,
            assetInIndex: swap.assetInIndex,
            assetOutIndex: swap.assetOutIndex,
            amount: swap.amount,
            userData: swap.userData,
          };
        }),
        tokens as Address[],
        {
          sender: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          fromInternalBalance: false,
          recipient: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
          toInternalBalance: false,
        },
      ],
    });
    result.value = JSON.stringify(values.map((value) => value.toString()));
  } catch (e) {
    console.warn(e);
  }
}

function getIntersection<T>(a: T[], b: T[]): T[] {
  return a.filter((value) => b.includes(value));
}
</script>

<style scoped>
.sections {
  display: flex;
  flex-direction: column;
}

@media (min-width: 768px) {
  .sections {
    flex-direction: row;
  }
}

.section {
  margin: 32px 24px;
}

.list {
  display: flex;
  flex-direction: column;
  min-width: 300px;
  max-width: 300px;
  overflow-y: auto;
}

.links {
  display: flex;
  gap: var(--spacing-small);
  flex-direction: column;
  overflow-x: auto;
  overflow-y: auto;
}

.link {
  padding: 4px 8px;
  overflow-x: hidden;
  border-radius: var(--border-radius-medium);
  color: var(--color-text-secondary);
  font-size: var(--font-size-big);
  text-decoration: none;
  text-overflow: ellipsis;
  white-space: nowrap;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

@media (min-width: 768px) {
  .link {
    overflow-x: initial;
    font-size: var(--font-size-normal);
  }
}

.link:hover {
  background: var(--color-bg-secondary);
  cursor: pointer;
}

.link.active {
  background: hsla(var(--color-accent-hsl) / 8%);
  color: var(--color-accent);
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
  flex: 3;
}

.form-elements {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-big);
}

.form-element {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
}

.pool-path {
  display: flex;
  flex-direction: column;
}

.result {
  flex: 2;
}

.snippet-view {
  position: relative;
  width: 100%;
}

.query-button {
  position: absolute;
  right: 8px;
  bottom: 8px;
  margin: 0;
  padding: 10px 20px;
  transition: all 0.25s ease-in-out;
  border: none;
  border-radius: var(--border-radius-big);
  background: var(--color-accent);
  box-shadow: var(--shadow-medium);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

.query-button:hover {
  background: var(--color-accent);
}

.query-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  pointer-events: none;
}
</style>
