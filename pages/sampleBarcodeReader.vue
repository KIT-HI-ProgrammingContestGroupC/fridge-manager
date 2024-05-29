<template>
  <div>
    <p>
      result: {{ barcodeResult }}
    </p>

    <BarcodeReader
      @barcode-detected="handleBarcodeDetected"
    />
  </div>
</template>

<script setup lang="ts">
import BarcodeReader from '../components/BarcodeReader.vue'

const barcodeResult: Ref<string> = ref('')
const handleBarcodeDetected = (value: string) => {
  barcodeResult.value = value
}
</script>
