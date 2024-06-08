<script setup>
const owner_name = ref('')
const product_name = ref('')
const eating_allowed = ref('')
const image_url = ref('')
const delete_id = ref('')
const items = ref([])

const fetchItems = async () => {
  const { data } = await useFetch('/api/fridge_items')
  items.value = data.value
}

const addItem = async () => {
  await useFetch('/api/fridge_items', {
    method: 'post',
    body: {
      owner_name: owner_name.value,
      product_name: product_name.value,
      eating_allowed: eating_allowed.value,
      image_url: image_url.value,
    },
  })
  owner_name.value = ''
  product_name.value = ''
  eating_allowed.value = ''
  image_url.value = ''
  fetchItems()  // リストを更新
}

const deleteItem = async () => {
  await useFetch('/api/fridge_items', {
    method: 'delete',
    body: {
      delete_id: delete_id.value,
    },
  })
  delete_id.value = ''
  fetchItems()  // リストを更新
}

// 初回読み込み時にデータを取得
fetchItems()
</script>

<template>
  <div>
    <h1>ここでは冷蔵庫アイテムたちの情報を取得して一覧表示できるよ！追加もできるよ！！</h1>
    <!-- 一覧表示部分 -->
    <ul>
      <li
        v-for="item in items"
        :key="item.id"
      >
        {{ item.id + ", " + item.owner_name + ", " + item.uploaded_at + ", " + item.product_name + ", " + item.eating_allowed + ", " + item.image_url }}
      </li>
    </ul>

    <hr>

    <!-- 入力部分 -->
    <!-- 追加用 -->
    <form @submit.prevent="addItem">
      <div>
        <label>所有者名</label>
        <input
          v-model="owner_name"
          @keypress.enter.prevent="submitForm"
        >
        <br>

        <label>商品名</label>
        <input
          v-model="product_name"
          @keypress.enter.prevent="submitForm"
        >
        <br>

        <label>他の人が食べていいか</label>
        <br>
        <input
          id="OK"
          v-model="eating_allowed"
          type="radio"
          value="true"
          @keypress.enter.prevent="submitForm"
        >
        <label>OK</label>
        <input
          id="NG"
          v-model="eating_allowed"
          type="radio"
          value="false"
          @keypress.enter.prevent="submitForm"
        >
        <label>NG</label>
        <br>

        <label>画像のURL</label>
        <input
          v-model="image_url"
          @keypress.enter.prevent="submitForm"
        >
        <br>
      </div>
      <hr>
      <div>
        <p>以下の内容で登録します。</p>
        <p>{{ "owner_name: " + owner_name }}</p>
        <p>{{ "product_name: " + product_name }}</p>
        <p>{{ "eating_allowed: " + eating_allowed }}</p>
        <p>{{ "image_url: " + image_url }}</p>
        <button type="submit">
          登録
        </button>
      </div>
    </form>

    <hr>

    <!-- 削除用 -->
    <form @submit.prevent="deleteItem">
      <div>
        <label>削除するID</label>
        <input
          v-model="delete_id"
          @keypress.enter.prevent="submitForm"
        >
        <br>
        <button type="submit">
        削除
        </button>
      </div>
    </form>
  </div>
</template>
