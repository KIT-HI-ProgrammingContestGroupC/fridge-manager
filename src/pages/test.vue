<template>
  <div v-if="error">
    Error: {{ error.message }}
  </div>
  <div v-else-if="result">
    {{ result }}
  </div>
  <div v-else>
    Loading...
  </div>
</template>

<script setup lang="ts">
const { data: result, error, pending } = useFetch('/api/productInfoFromJanCode', {
  query: {
    janCode: 4901085614730,
  },
})
// デバッグ用ログ
console.log('result:', result)
console.log('error:', error)
console.log('pending:', pending)
</script>
