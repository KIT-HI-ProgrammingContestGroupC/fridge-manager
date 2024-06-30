# このプロジェクトにおけるDBへのアクセス

## データの型
```vue
interface Data {
  id: number
  owner_name: string
  uploaded_at: string
  product_name: string
  eating_allowed: boolean
  image_url: string
}
```

## サンプル
### データの全取得
```vue
const data = await $fetch('/api/fridge_items')
```

### データの追加
```vue
await $fetch('/api/fridge_items', {
  method: 'POST',
  body: {
    owner_name: 'J Smith',
    product_name: 'wine',
    eating_allowed: true,
    image_url: 'https://en.wikipedia.org/wiki/File:Red_and_white_wine_12-2015.jpg',
  },
})
```

### データの削除
```vue
await $fetch('/api/fridge_items', {
  method: 'DELETE',
  body: {
    delete_id: 3, // id=3のデータを消す場合
  },
})
```
