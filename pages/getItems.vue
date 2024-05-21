<script setup>
const { data: items } = useFetch('/api/fridge_items');
</script>
<template>
  <div>
    <h1>ここでは冷蔵庫アイテムたちの情報を取得して一覧表示できるよ！</h1>
    <ul>
      <li>id owner_name uploaded_at product_name eating_allowed image_url</li>
      <li v-for="item in items" :key="item.id">{{ item.id + " " + item.owner_name + " " + item.uploaded_at + " " + item.product_name + " " + item.eating_allowed + " " + item.image_url }}</li>
    </ul>
  </div>
</template>