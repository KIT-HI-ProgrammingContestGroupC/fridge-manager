<template>
  <div>
    <video
      id="video"
      ref="video"
      autoplay
    />
    <div id="barcode-status">
      {{ barcodeStatus }}
    </div>
    <div id="barcode-result">
      {{ barcodeResult }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue'
import { useNuxtApp } from '#app'

const video = ref<HTMLVideoElement | null>(null)
const barcodeStatus = ref<string>('No barcode detected')
const barcodeResult = ref<string>('')

interface Emits {
  (event: 'barcode-detected', barcodeResult: string): void
}
const emit = defineEmits<Emits>()

const { $getCameraStream, $detectBarcodes } = useNuxtApp()

const startBarcodeDetection = async () => {
  if (!video.value) return

  try {
    const stream = await $getCameraStream()
    video.value.srcObject = stream
    await video.value.play()

    const scanBarcode = async () => {
      if (video.value) {
        const barcodes = await $detectBarcodes(video.value)
        if (barcodes.length > 0) {
          barcodeStatus.value = `Barcode detected`
          barcodeResult.value = barcodes[0].rawValue
          emit('barcode-detected', barcodes[0].rawValue)
        }
        else {
          barcodeStatus.value = 'No barcode detected'
        }
      }
      requestAnimationFrame(scanBarcode)
    }

    scanBarcode()
  }
  catch (error) {
    console.error('Failed to start barcode detection:', error)
  }
}

onMounted(() => {
  startBarcodeDetection()
})
</script>

<style scoped>
#video {
  width: 100%;
  max-width: 600px;
}
#barcode-result {
  margin-top: 20px;
  font-size: 1.2em;
}
</style>
