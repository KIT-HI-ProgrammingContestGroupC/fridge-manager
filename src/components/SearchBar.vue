<template>
  <v-text-field
    v-model="query"
    label="Search"
    prepend-inner-icon="mdi-magnify"
  />
</template>

<script setup lang="ts">
const query = defineModel('searchQuery', { type: String })
</script>
