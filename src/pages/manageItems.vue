<script setup>
const owner_name = ref('')
const product_name = ref('')
const eating_allowed = ref('')
const image_url = ref('')
const { data: items } = useFetch('/api/fridge_items')

const addItem = () => {
  useFetch('/api/fridge_items', {
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
}
</script>

<template>
  <div>
    <h1>ここでは冷蔵庫アイテムたちの情報を取得して一覧表示できるよ！追加もできるよ！！</h1>
    <!-- 表示部分 -->
    <ul>
      <li
        v-for="item in items"
        :key="item.id"
      >
        {{ item.id + ", " + item.owner_name + ", " + item.uploaded_at + ", " + item.product_name + ", " + item.eating_allowed + ", " + item.image_url }}
      </li>
    </ul>

    <!-- 入力部分 -->
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
  </div>
</template>
