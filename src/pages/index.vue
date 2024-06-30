<template>
  <v-app>
    <v-container>
      <v-main>
        <!-- Search Bar -->
        <v-expand-transition>
          <v-text-field
            v-model="searchQuery"
            label="Search"
            prepend-inner-icon="mdi-magnify"
          />
        </v-expand-transition>

        <!-- Data List -->
        <v-list>
          <v-list-item
            border
          >
            <v-list-item-title>
              Fridge Items
            </v-list-item-title>
            <template #append>
              <v-btn
                icon="mdi-plus"
                color="primary"
                density="compact"
                @click="showPopup = true"
              />
            </template>
          </v-list-item>

          <v-list-item
            v-for="(item, index) in filteredRows"
            :key="index"
            lines="three"
            border
          >
            <!-- Image -->
            <template #prepend>
              <!-- ma-2 = Margin All-direction 2x4 -->
              <div class="ma-2">
                <!-- FIXME: :width=50 -->
                <v-img
                  :width="50"
                  :src="item.image_url"
                />
              </div>
            </template>

            <!-- Discription -->
            <v-list-item-title>
              {{ item.product_name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              <p>
                {{ item.owner_name }}
              </p>
              <p>
                {{ item.uploaded_at }}
              </p>
              <p v-if="item.eating_allowed">
                Take free!
              </p>
            </v-list-item-subtitle>

            <!-- 3 dots vertical button -->
            <template #append>
              <v-menu>
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon="mdi-dots-vertical"
                    density="compact"
                    variant="text"
                  />
                </template>

                <v-list>
                  <v-list-item
                    title="Delete Item"
                    @click="deleteItem([item.id])"
                  />
                </v-list>
              </v-menu>
            </template>
          </v-list-item>
        </v-list>

        <!-- Popup Dialog -->
        <v-dialog
          v-model="showPopup"
          persistent
          max-width="600px"
        >
          <v-card>
            <v-card-title>
              <v-container>
                <v-row>
                  Add Item
                  <v-spacer />
                  <!-- Close Button -->
                  <v-icon
                    icon="mdi-close"
                    @click="showPopup = false"
                  />
                </v-row>
              </v-container>
            </v-card-title>
            <!-- Input area -->
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
              <v-file-input
                v-model="image_binary"
                label="No Barcode? Input your product image manually"
                accept="image/*"
                @change="onFileUploaded"
              />
              <v-img
                :src="image_url"
              />
            </v-card-text>

            <!-- Button area -->
            <v-card-actions>
              <v-btn
                text="Autofill with Barcode Reader"
                color="green"
                variant="flat"
                @click="showBarcodeReader = true"
              />
            </v-card-actions>
            <v-card-actions>
              <v-btn
                text="Register"
                color="blue"
                variant="flat"
                @click="addItem"
              />
            </v-card-actions>
          </v-card>
          <!-- Error Message -->
          <v-card
            v-if="errorMessage"
            color="error"
          >
            {{ errorMessage }}
          </v-card>
        </v-dialog>

        <!-- Barcode Reader Dialog -->
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
      </v-main>
    </v-container>
    <AppFooter />
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const rows = ref([]) // 表に表示する内容

const searchQuery: Ref<string> = ref('')
const showPopup: Ref<boolean> = ref(false)
const showBarcodeReader: Ref<boolean> = ref(false)

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

// 項目編集の機能は最終報告までに間に合わなかったのでいったんコメントアウトしています
// const editItem = () => {

// }

const handleBarcodeDetected = async (data): Promise<void> => {
  product_name.value = data.displayName
  image_url.value = data.imageUrl
  showBarcodeReader.value = false
}

// members is an array of user objects, selectedMember is a user object
// about user object, see https://api.slack.com/methods/users.info#examples
const { data: members } = useFetch('/api/slackMembers')
const selectedMember = ref()

// ==============================================
// =============ここからDB関連のスクリプト===========
// ==============================================

// DBからデータを取得する関数。データの更新が行われるたびに都度表示を更新したいので、何か処理するたびに呼ぶ
// 何か実行した後に表のデータが更新されない！！！という時は、この関数を該当する処理の末尾に入れると解決します。多分。
const fetchItems = async (): Promise<void> => {
  const data = await $fetch('/api/fridge_items')
  rows.value = data // 更新したデータをitemsに入れ、itemsはリアルタイムで更新される
}
// 初回のみこちらを呼び出す(useFetch, $fetchの使い分けのため)
const firstFetchItems = async (): Promise<void> => {
  const { data } = await useFetch('/api/fridge_items')
  rows.value = data.value // 更新したデータをitemsに入れ、itemsはリアルタイムで更新される
}

// データ保存用の変数。データ追加フォームの各textbox等と紐づけられる。
const product_name: Ref<string> = ref('')
const eating_allowed: Ref<boolean> = ref(false)
const image_url: Ref<string> = ref('')
// エラーメッセージ保存用の変数。フォーム入力の不足・不正があればここに警告文を入れる。
const errorMessage: Ref<string> = ref('')
const image_binary: Ref<Blob | undefined> = ref(undefined)

// 画像ファイルがアップロードされたら、その画像をData URLに変換してimage_urlに入れる関数
const onFileUploaded = async (): Promise<void> => {
  const reader = new FileReader()
  reader.readAsDataURL(image_binary.value)
  reader.onload = (e) => {
    image_url.value = e.target.result
  }
}

// DBにデータを追加する関数
// +ボタンのポップアップから各種値を入力した後、REGISTERボタンを押すと呼び出される
// フォームに必要なデータが入力されているか確認した後、入力されていればDBに追加する
const addItem = async (): Promise<void> => {
  const oname = selectedMember.value.real_name // 所有者名
  const pname = product_name.value // 製品名
  const eallowed = eating_allowed.value // 共有許可
  const iurl = image_url.value // 写真

  // ===フォーム確認======================================
  // 所有者名、製品名の2項目のみ確認しています。
  // 他の項目を追加する場合はこのif文に項目を追加してください。
  errorMessage.value = ''

  if (!oname || !pname || !iurl) {
    errorMessage.value = 'Please fill following data! : '
    if (!oname) {
      errorMessage.value += 'Owner '
    }
    if (!pname) {
      errorMessage.value += 'ProductName '
    }
    if (!iurl) {
      errorMessage.value += 'Image '
    }
  }

  // ===DBへの追加======================================
  // 必要な情報が全て入力されている時だけ処理を行う
  if (!errorMessage.value) {
    // fridge_items.post.tsの中身を呼び出す
    await $fetch('/api/fridge_items', {
      method: 'post',
      body: {
        owner_name: oname,
        product_name: pname,
        eating_allowed: eallowed,
        image_url: iurl,
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
}

// DBからデータを削除する関数
// チェックボックスにチェックを入れた後、削除ボタンを押すと呼び出される
const deleteItem = async (check: number[]): Promise<void> => {
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

  fetchItems() // リストを更新
}

firstFetchItems()// 初回読み込み時にDBからデータを取得
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
