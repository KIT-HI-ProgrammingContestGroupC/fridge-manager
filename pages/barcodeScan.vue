<template>
  <div>
    <h1>Barcode Detector Example</h1>
    <BarcodeScanner
      @barcode-detected="handleBarcodeDetected"
    />
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from '#app'
import BarcodeScanner from '~/components/BarcodeScanner.vue'

const router = useRouter()

const handleBarcodeDetected = (barcode: string) => {
  router.push({ path: 'barcodeResult', query: { barcode } })
}
</script>
