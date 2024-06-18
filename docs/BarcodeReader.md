# バーコードリーダーについて

## 判定について
意外と判定がシビアです。

- しっかり近づいて
- ピントを合わせる

必要があります。

## コード中での使い方について
バーコードが見つかると、結果が`ProductInfo`型でemitされます。

```ts
interface ProductInfo {
  janCode: string
  displayName: string | undefined
  brand: string | undefined
  company: string | undefined
  imageUrl: string | undefined
}
```

親コンポーネントでは、以下のようにして値を受け取ってください。
```vue
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
import BarcodeReader from '~/components/BarcodeReader.vue'

const result: Ref<any> = ref()

const handleBarcodeDetected = async (value): Promise<void> => {
  result.value = value
}
</script>
```
