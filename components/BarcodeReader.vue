<template>
  <div>
    <v-select
      v-model="selectedDevice"
      label="Choose your camera"
      :items="devices"
      item-title="label"
      return-object
    />

    <div
      v-if="error"
    >
      <v-alert
        color="error"
        icon="$error"
        title="Camera error"
        :text="error"
      />
    </div>

    <qrcode-stream
      v-if="selectedDevice !== null"
      :constraints="{ deviceId: selectedDevice.deviceId }"
      :formats="barcodeFormats"
      @error="onError"
      @detect="onDetect"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { QrcodeStream } from 'vue-qrcode-reader'
import type { DetectedBarcode, BarcodeFormat } from 'barcode-detector/pure'

/** * barcode formats ***/
const barcodeFormats: BarcodeFormat[] = ['ean_13', 'ean_8']

/** * detection handling ***/
const result: Ref<string> = ref('')

const emit = defineEmits<{
  (e: 'barcode-detected', value: string): void
}>()

function onDetect(detectedCodes: DetectedBarcode[]) {
  console.log(detectedCodes)
  result.value = JSON.stringify(detectedCodes.map(code => code.rawValue))
  emit('barcode-detected', result.value)
}

/** * select camera ***/
const selectedDevice: Ref<MediaDeviceInfo | null> = ref(null)
const devices: Ref<MediaDeviceInfo[]> = ref([])

onMounted(async () => {
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === 'videoinput',
  )

  if (devices.value.length > 0) {
    selectedDevice.value = devices.value[0]
  }
})

/** * error handling ***/
const error: Ref<string> = ref('')

function onError(err: Error) {
  error.value = `[${err.name}]: `

  if (err.name === 'NotAllowedError') {
    error.value += 'You need to grant camera access permission'
  }
  else if (err.name === 'NotFoundError') {
    error.value += 'No camera on this device'
  }
  else if (err.name === 'NotSupportedError') {
    error.value += 'Secure context required (HTTPS, localhost)'
  }
  else if (err.name === 'NotReadableError') {
    error.value += 'Is the camera already in use?'
  }
  else if (err.name === 'OverconstrainedError') {
    error.value += 'Installed cameras are not suitable'
  }
  else if (err.name === 'StreamApiNotSupportedError') {
    error.value += 'Stream API is not supported in this browser'
  }
  else if (err.name === 'InsecureContextError') {
    error.value
      += 'Camera access is only permitted in secure context. Use HTTPS or localhost rather than HTTP.'
  }
  else {
    error.value += err.message
  }
}
</script>
