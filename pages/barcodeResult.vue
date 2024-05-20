<template>
  <div>
    <h1>Result Page</h1>
    <p>Barcode: {{ barcode }}</p>
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'

const route = useRoute()
const barcode = route.query.barcode
</script>
