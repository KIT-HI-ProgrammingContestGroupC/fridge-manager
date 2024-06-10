<template>
  <v-app>
    <v-container>
      <!-- header -->
      <v-app-bar>
        <v-btn
          id="menu-activator"
          color="primary"
        >
          <v-icon
            color="info"
            icon="mdi-menu"
          />
        </v-btn>
        <v-menu activator="#menu-activator">
          <v-list>
            <v-list-item
              v-for="(item, index) in menuItems"
              :key="index"
            >
              <v-list-item-title @click="clickMenu(item.action)">
                {{ item.title }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-app-bar>

      <!-- Search Bar -->
      <v-main>
        <v-row>
          <v-col
            cols="12"
            class="d-flex justify-end"
          >
            <v-expand-transition>
              <v-text-field
                v-if="showSearchBar"
                v-model="searchQuery"
                label="Search"
                prepend-inner-icon="mdi-magnify"
              />
            </v-expand-transition>
          </v-col>
        </v-row>

        <!-- Data Table -->
        <v-data-table
          :headers="headers"
          :items="filteredRows"
          item-value="id"
          class="elevation-1"
        >
          <template #item.selected="{ item }">
            <v-checkbox
              v-if="showCheckboxes"
              v-model="checkBoxes"
              :value="item.id"
            />
          </template>
          <template #item.image_url="{ item }">
            <v-img
              :src="item.image_url"
            />
          </template>
        </v-data-table>
        <v-expand-transition>
          <v-btn
            v-if="showCheckboxes"
            label="Delete"
            color="error"
            @click="deleteItem(checkBoxes)"
          >
            削除
          </v-btn>
        </v-expand-transition>

        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="auto">
            <!-- Plus Action Button -->
            <v-btn
              color="red"
              density="comfortable"
              icon="mdi-plus"
              style="bottom: 100px; position: fixed;"
              variant="tonal"
              @click="showPopup = true"
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <!-- Search Action Button -->
            <v-btn
              color="blue"
              density="comfortable"
              icon="mdi-magnify"
              style="bottom: 100px; position: fixed;"
              variant="tonal"
              @click="toggleSearchBar"
            />
          </v-col>
        </v-row>

        <!-- Popup Dialog -->
        <!-- ここに谷君のコード or Componentsが入る？ -->
        <v-dialog
          v-model="showPopup"
          persistent
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Popup</span>
            </v-card-title>
            <v-card-text>
              <v-card-text>
                <v-select
                  v-model="selectedMember"
                  label="Owner"
                  :items="members"
                  item-title="profile.real_name"
                  return-object
                />
                <v-text-field
                  v-model="product_name"
                  hint="Enter your product name you want to put on the fridge"
                  label="Product Name"
                  type="input"
                />
                <v-switch
                  v-model="eating_allowed"
                  color="primary"
                  label="Take free?"
                  inset
                />
                Photo
                <v-img
                  :src="image_url"
                />
              </v-card-text>
            </v-card-text>

            <v-card-actions>
              <v-btn
                text="Autofill with Barcode Reader"
                color="green"
                variant="flat"
                @click="showBarcodeReader = true"
              />
            </v-card-actions>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text="Register"
                color="blue"
                variant="flat"
                @click="addItem"
              />
              <v-btn
                text="close"
                @click="showPopup = false"
              />
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="showBarcodeReader"
        >
          <v-card>
            <v-card-title>
              <span class="headline">Barcode Reader</span>
            </v-card-title>
            <v-card-text>
              <BarcodeReader
                @barcode-detected="handleBarcodeDetected"
              />
            </v-card-text>
            <v-card-actions>
              <v-btn
                text="close"
                @click="showBarcodeReader = false"
              />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const headers = ref([
  { title: 'ID', key: 'id' },
  { title: 'Owner', key: 'owner_name' },
  { title: 'Date', key: 'uploaded_at' },
  { title: 'Name', key: 'product_name' },
  { title: 'Take', key: 'eating_allowed' },
  { title: 'Photo', key: 'image_url' },
  { title: '', key: 'selected' },
])
const menuItems = ref([
  { title: '項目削除', action: 'delete' },
  { title: '項目編集', action: 'edit' },
])

const rows = ref([]) // 表に表示する内容

const searchQuery = ref('')
const showSearchBar = ref(false)
const showPopup = ref(false)
const showBarcodeReader = ref(false)
const showCheckboxes = ref(false)

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
const checkBoxes = ref([])

const toggleSearchBar = () => {
  showSearchBar.value = !showSearchBar.value
  if (!showSearchBar.value) {
    searchQuery.value = ''
  }
}

const toggleCheckboxes = () => {
  showCheckboxes.value = !showCheckboxes.value
}

const clickMenu = (action) => {
  if (action == 'delete') {
    checkBoxes.value = []
    toggleCheckboxes()
  }
  else if (action == 'edit') {
    editItem()
  }
}

const editItem = () => {

}

const handleBarcodeDetected = async (data) => {
  product_name.value = data.displayName
  image_url.value = data.imageUrl
  showBarcodeReader.value = false
}

watch(filteredRows, (newfilteredRows) => {
  const lengthDifference = newfilteredRows.length - checkBoxes.value.length
  if (lengthDifference > 0) {
    checkBoxes.value.push(...Array(lengthDifference).fill(false))
  }
  else if (lengthDifference < 0) {
    checkBoxes.value.splice(lengthDifference)
  }
})

const { data: members } = useFetch('/api/getSlackMembers')

// membersが取得できた場合の処理
const selectedMember = ref(null)

watch(members, (newMembers) => {
  if (newMembers.length > 0) {
    selectedMember.value = newMembers[0]
    console.log('Members fetched successfully:', newMembers)
    newMembers.forEach((member) => {
      console.log(member.name)
    })
  }
})

// ==============================================
// =============ここからDB関連のスクリプト===========
// ==============================================

// DBからデータを取得する関数。データの更新が行われるたびに都度表示を更新したいので、何か処理するたびに呼ぶ
// 何か実行した後に表のデータが更新されない！！！という時は、この関数を該当する処理の末尾に入れると解決します。多分。
const fetchItems = async () => {
  const data = await $fetch('/api/fridge_items')
  rows.value = data // 更新したデータをitemsに入れ、itemsはリアルタイムで更新される
}
// 初回のみこちらを呼び出す(useFetch, $fetchの使い分けのため)
const firstFetchItems = async () => {
  const { data } = await useFetch('/api/fridge_items')
  rows.value = data.value // 更新したデータをitemsに入れ、itemsはリアルタイムで更新される
}

// データ保存用の変数。データ追加フォームの各textbox等と紐づけられる。
const product_name = ref('')
const eating_allowed = ref('')
const image_url = ref('')

// DBにデータを追加する関数
// +ボタンのポップアップから各種値を入力した後、REGISTERボタンを押すと呼び出される
const addItem = async () => {
  // fridge_items.post.tsの中身を呼び出す
  await $fetch('/api/fridge_items', {
    method: 'post',
    body: {
      owner_name: selectedMember.value.real_name,
      product_name: product_name.value,
      eating_allowed: eating_allowed.value,
      image_url: image_url.value,
    },
  })

  // 対応するテキストボックス等を空にする
  selectedMember.value = ''
  product_name.value = ''
  eating_allowed.value = false
  image_url.value = ''

  showPopup.value = false // ポップアップを閉じる
  fetchItems() // リストを更新
}

// DBからデータを削除する関数
// チェックボックスにチェックを入れた後、削除ボタンを押すと呼び出される
const deleteItem = async (check) => {
  /*
  check：チェックの入ったひとのIDが入っている
  全てチェックの場合、[1,2,3]
  上から□✓□の場合[2]
  */

  for (let i = 0; i < check.length; i++) {
    // fridge_items.delete.tsの中身を呼び出す
    await $fetch('/api/fridge_items', {
      method: 'delete',
      body: {
        delete_id: check[i],
      },
    })
  }

  toggleCheckboxes() // チェックボックスを非表示にする
  fetchItems() // リストを更新
}

firstFetchItems()// 初回読み込み時にDBからデータを取得
</script>

<style scoped>
  .v-application {
    font-family: 'Roboto', sans-serif;
  }

  .fab {
    right: 16px;
    bottom: 16px;
  }

  .v-toolbar {
    background-color: #1976d2;
  }

  .v-icon {
    color: white;
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
