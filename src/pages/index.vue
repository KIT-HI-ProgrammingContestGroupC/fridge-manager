<template>
  <v-app>
    <AppHeader />
    <v-container>
      <v-main>
        <SearchBar
          v-model="searchQuery"
        />

        <ListItems
          v-model:items="rows"
          :filter-query="searchQuery"
          @activate-product-form="() => { showPopup = true }"
        />

        <InformationForm
          v-model:isopen="showPopup"
          @post-data-added="fetchItems"
        />
      </v-main>
    </v-container>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
const searchQuery: Ref<string> = ref('')
const showPopup: Ref<boolean> = ref(false)

const { data } = useAuth()

// 冷蔵庫の中身のデータを取得する
const rows: Ref<FridgeItem[]> = await $fetch('/api/fridge_items', {
  method: 'GET',
  query: {
    fridge_id: data.value.username,
  },
})

// DBからデータを取得する関数。データの更新が行われるたびに都度表示を更新したいので、何か処理するたびに呼ぶ
// 何か実行した後に表のデータが更新されない！！！という時は、この関数を該当する処理の末尾に入れると解決します。多分。
const fetchItems = async (): Promise<void> => {
  rows.value = await $fetch('/api/fridge_items', {
    method: 'GET',
    query: {
      fridge_id: data.value.username,
    },
  })
}
</script>

<style scoped>
  .v-application {
    font-family: 'Roboto', sans-serif;
  }

  .v-list-item {
    cursor: pointer;
  }

  .v-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
