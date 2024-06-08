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

const handleBarcodeDetected = async (value): Promise<void> => {
  result.value = value
}
</script>
