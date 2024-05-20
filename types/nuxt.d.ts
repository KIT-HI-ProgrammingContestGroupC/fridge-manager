import type { BarcodeFormat } from './barcode-detector'

declare module '#app' {
  interface NuxtApp {
    $getCameraStream: () => Promise<MediaStream>
    $detectBarcodes: (video: HTMLVideoElement) => Promise<BarcodeFormat[]>
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $getCameraStream: () => Promise<MediaStream>
    $detectBarcodes: (video: HTMLVideoElement) => Promise<BarcodeFormat[]>
  }
}
