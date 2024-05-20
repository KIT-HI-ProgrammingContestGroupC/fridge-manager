import { defineNuxtPlugin } from '#app'
import type { BarcodeFormat } from '~/types/barcode-detector'

export default defineNuxtPlugin((nuxtApp) => {
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    const barcodeDetector = new BarcodeDetector({ formats: ['qr_code', 'ean_13', 'code_128'] })

    const getCameraStream = async (): Promise<MediaStream> => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        return stream
      }
      catch (error) {
        console.error('Error accessing the camera: ', error)
        throw error
      }
    }

    const detectBarcodes = async (video: HTMLVideoElement): Promise<BarcodeFormat[]> => {
      try {
        const barcodes = await barcodeDetector.detect(video)
        return barcodes
      }
      catch (error) {
        console.error('Barcode detection failed: ', error)
        throw error
      }
    }

    nuxtApp.provide('getCameraStream', getCameraStream)
    nuxtApp.provide('detectBarcodes', detectBarcodes)
  }
  else {
    console.warn('Barcode Detector is not supported in this browser.')
  }
})
