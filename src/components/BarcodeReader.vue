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
        :text="error"
      />
    </div>

    <qrcode-stream
      :constraints="constraints"
      :formats="barcodeFormats"
      @error="onError"
      @detect="onDetect"
      @camera-on="onCameraReady"
    />
  </div>
</template>

<script setup lang="ts">
import { QrcodeStream } from 'vue-qrcode-reader'
import type { DetectedBarcode, BarcodeFormat } from 'barcode-detector/pure'

/** * barcode formats ***/
const barcodeFormats: BarcodeFormat[] = ['ean_13', 'ean_8']

const emit = defineEmits<{
  (e: 'barcode-detected', value): void
}>()

const onDetect = async (detectedCodes: DetectedBarcode[]): Promise<void> => {
  console.log(detectedCodes)

  try {
    const data = await $fetch('/api/yahooAPIWrapper', {
      method: 'get',
      query: {
        janCode: detectedCodes[0].rawValue,
      },
    })
    emit('barcode-detected', data)
  }
  catch (err) {
    error.value = 'Sorry, we could not find the product information for this barcode. Please input the product information manually.'
  }
}

/** * select camera ***/
const selectedDevice: Ref<MediaDeviceInfo | null> = ref(null)
const devices: Ref<MediaDeviceInfo[]> = ref([])

async function onCameraReady() {
  // NOTE: on iOS we can't invoke `enumerateDevices` before the user has given
  // camera access permission. `QrcodeStream` internally takes care of
  // requesting the permissions. The `camera-on` event should guarantee that this
  // has happened.
  devices.value = (await navigator.mediaDevices.enumerateDevices()).filter(
    ({ kind }) => kind === 'videoinput',
  )
}

const constraints = computed(() => {
  if (selectedDevice.value === null) {
    return { facingMode: 'environment' }
  }
  else {
    return { deviceId: selectedDevice.value.deviceId }
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
