<template>
  <v-app>
    <v-container>
      <v-main>
        <SearchBar
          v-model="searchQuery"
        />

        <ListItems
          :items="filteredRows"
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
const rows = ref([]) // 表に表示する内容
rows.value = await $fetch('/api/fridge_items')

const searchQuery: Ref<string> = ref('')
const showPopup: Ref<boolean> = ref(false)

const filteredRows = computed(() => {
  if (!searchQuery.value) {
    return rows.value
  }
  else {
    return rows.value.filter(row =>
      Object.values(row).some(val =>
        String(val).toLowerCase().includes(searchQuery.value.toLowerCase()),
      ),
    )
  }
})

// DBからデータを取得する関数。データの更新が行われるたびに都度表示を更新したいので、何か処理するたびに呼ぶ
// 何か実行した後に表のデータが更新されない！！！という時は、この関数を該当する処理の末尾に入れると解決します。多分。
const fetchItems = async (): Promise<void> => {
  rows.value = await $fetch('/api/fridge_items')
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
