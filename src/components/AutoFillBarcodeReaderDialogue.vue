<template>
  <v-dialog
    v-model="showBarcodeReader"
  >
    <v-card>
      <v-card-title>
        <v-container>
          <v-row>
            Barcode Reader
            <v-spacer />
            <!-- Close Button -->
            <v-icon
              icon="mdi-close"
              @click="showBarcodeReader = false"
            />
          </v-row>
        </v-container>
      </v-card-title>
      <v-card-text>
        <BarcodeReader
          @barcode-detected="handleBarcodeDetected"
        />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const showBarcodeReader = defineModel('showBarcodeReader', { type: Boolean })

const emit = defineEmits<{
  (e: 'get-product-info', productName: string, imageURL: string): void
}>()

const handleBarcodeDetected = async (data): Promise<void> => {
  // 読み取った情報をフォームに入力
  emit('get-product-info', data.displayName, data.imageUrl)
  // バーコードリーダーを閉じる
  showBarcodeReader.value = false
}
</script>
