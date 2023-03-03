<template>
  <div class="select">
    <div v-if="selectedOption">
      <Listbox
        :model-value="selectedOption"
        @update:model-value="handleUpdate"
      >
        <ListboxButton class="trigger">
          <div>{{ selectedOption.label }}</div>
          <IconChevronDown class="trigger-icon" />
        </ListboxButton>

        <transition name="list">
          <ListboxOptions class="list">
            <ListboxOption
              v-for="option in options"
              v-slot="{ active, selected }"
              :key="option.value"
              :value="option.value"
              as="template"
            >
              <li
                class="item"
                :class="{ active, selected }"
              >
                {{ option.label }}
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </Listbox>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from '@headlessui/vue';
import { computed } from 'vue';

import IconChevronDown from '@/components/__common/icon/ChevronDown.vue';
import useChain, {
  ARBITRUM,
  CHAINS,
  ETHEREUM,
  OPTIMISM,
  POLYGON,
  Chain,
} from '@/composables/useChain';

const { id: chainId, setChain } = useChain();

function handleUpdate(value: Chain): void {
  setChain(value);
}

function getChainName(chain: Chain): string {
  switch (chain) {
    case ETHEREUM:
      return 'Ethereum';
    case POLYGON:
      return 'Polygon';
    case OPTIMISM:
      return 'Optimism';
    case ARBITRUM:
      return 'Arbitrum';
  }
}

const options = CHAINS.map((chain) => {
  return {
    label: getChainName(chain),
    value: chain,
  };
});
const selectedOption = computed(() =>
  options.find((option) => option.value === chainId.value),
);
</script>

<style scoped>
.select {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-small);
}

.trigger {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin: 0;
  padding: 4px 12px;
  border: 1px solid var(--color-bg-inverted);
  border-radius: var(--border-radius-medium);
  outline: none;
  background: transparent;
  box-shadow: var(--shadow-small);
  color: var(--color-text-inverted);
  font-size: var(--font-size-normal);
  cursor: pointer;
}

.trigger:hover {
  border-color: hsla(var(--color-text-inverted-hsl) / 30%);
}

.trigger.disabled {
  opacity: 0.6;
  pointer-events: none;
}

.trigger-icon {
  width: 14px;
  height: 14px;
}

.list-enter-active {
  transition: all 200ms ease-out;
}

.list-enter-from {
  opacity: 0;
}

.list-enter-to {
  opacity: 1;
}

.list-leave-active {
  transition: all 150ms ease-in;
}

.list-leave-form {
  opacity: 1;
}

.list-leave-to {
  opacity: 0;
}

.list {
  display: flex;
  position: absolute;
  z-index: 2;
  gap: var(--spacing-small);
  flex-direction: column;
  margin-top: var(--spacing-small);
  padding: 2px;
  border: 1px solid var(--color-border-secondary);
  border-radius: var(--border-radius-medium);
  background: var(--color-bg-primary);
}

.item {
  padding: 4px 12px;
  overflow: hidden;
  border-radius: var(--border-radius-medium);
  color: var(--color-text-primary);
  font-size: var(--font-size-normal);
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.item.active {
  background: var(--color-bg-secondary);
}
</style>
