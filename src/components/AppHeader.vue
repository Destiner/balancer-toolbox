<template>
  <header>
    <div class="top">
      <div class="brand">
        <img
          src="/icon.svg"
          class="icon"
        />
        Toolbox
      </div>
    </div>
    <div class="bottom">
      <div class="side">
        <ChainSelector class="selector" />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import ChainSelector from './ChainSelector.vue';
</script>

<style scoped>
header {
  background: var(--color-bg-inverted);
  color: var(--color-text-inverted);
}

.top {
  display: flex;
  align-items: center;
  height: 52px;
  padding: 0 24px;
  border-bottom: 1px solid hsla(var(--color-text-inverted-hsl) / 40%);
}

.brand {
  display: flex;
  gap: 16px;
  align-items: center;
  font-weight: bold;
}

.bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 24px;
}

.side {
  display: flex;
  gap: var(--spacing-normal);
  align-items: center;
}

.selector {
  width: 110px;
}

.icon {
  width: 24px;
  height: 24px;
}
</style>
