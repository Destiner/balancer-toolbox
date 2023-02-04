<template>
  <textarea
    :value="value"
    readonly
    rows="15"
  />
</template>

<script setup lang="ts">
defineProps<{
  value: string;
}>();
</script>

<style scoped>
textarea {
  font-family: 'Courier New', Courier, monospace;
}
</style>
