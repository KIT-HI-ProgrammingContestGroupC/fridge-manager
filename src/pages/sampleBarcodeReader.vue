<template>
  <div>
    <p v-if="result">
      result: {{ result }}
    </p>

    <BarcodeReader
      @barcode-detected="handleBarcodeDetected"
    />
  </div>
</template>

<script setup lang="ts">
import BarcodeReader from '../components/BarcodeReader.vue'

const result: Ref<any> = ref()

const handleBarcodeDetected = async (value: string) => {
  const { data, error } = await useFetch('/api/yahooAPIWrapper', {
    query: {
      janCode: value,
    },
  })

  if (!error.value) {
    result.value = data.value
  }
  else {
    console.error('API request failed:', error.value)
    result.value = 'Yahoo API request failed'
  }
}
</script>
