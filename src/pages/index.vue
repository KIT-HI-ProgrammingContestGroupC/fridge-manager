<template>
  <v-app>
    <v-container>
      <v-main>
        <SearchBar
          v-model="searchQuery"
        />

        <ListItems
          :items="filteredRows"
          @activate-product-form="() => showPopup = true"
        />

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
                v-model="formFields.owner_name.value"
                label="Owner"
                :items="members"
                item-title="profile.real_name"
              />
              <v-text-field
                v-model="formFields.product_name.value"
                hint="Enter your product name you want to put on the fridge"
                label="Product Name"
                type="input"
              />
              <v-switch
                v-model="formFields.eating_allowed.value"
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
                :src="formFields.image_url.value"
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
  formFields.product_name.value = data.displayName
  formFields.image_url.value = data.imageUrl
  showBarcodeReader.value = false
}

// members is an array of user objects
// about user object, see https://api.slack.com/methods/users.info#examples
const { data: members } = useFetch('/api/slackMembers')

// ==============================================
// =============ここからDB関連のスクリプト===========
// ==============================================

// DBからデータを取得する関数。データの更新が行われるたびに都度表示を更新したいので、何か処理するたびに呼ぶ
// 何か実行した後に表のデータが更新されない！！！という時は、この関数を該当する処理の末尾に入れると解決します。多分。
const fetchItems = async (): Promise<void> => {
  const data = await $fetch('/api/fridge_items')
  rows.value = data // 更新したデータをitemsに入れ、itemsはリアルタイムで更新される
}

// データ保存用の変数。データ追加フォームの各textbox等と紐づけられる。
interface FormFields {
  owner_name: Ref<string>
  product_name: Ref<string>
  eating_allowed: Ref<boolean>
  image_url: Ref<string>
}
const formFields: FormFields = {
  owner_name: ref(''),
  product_name: ref(''),
  eating_allowed: ref(false),
  image_url: ref(''),
}

// エラーメッセージ保存用の変数。フォーム入力の不足・不正があればここに警告文を入れる。
const errorMessage: Ref<string> = ref('')
const image_binary: Ref<Blob | undefined> = ref(undefined)

// 画像ファイルがアップロードされたら、その画像をData URLに変換してimage_urlに入れる関数
const onFileUploaded = async (): Promise<void> => {
  const reader = new FileReader()
  reader.readAsDataURL(image_binary.value)
  reader.onload = (e) => {
    formFields.image_url.value = e.target.result
  }
}

// DBにデータを追加する関数
// +ボタンのポップアップから各種値を入力した後、REGISTERボタンを押すと呼び出される
// フォームに必要なデータが入力されているか確認した後、入力されていればDBに追加する
const addItem = async (): Promise<void> => {
  const oname = formFields.owner_name.value // 所有者名
  const pname = formFields.product_name.value // 製品名
  const eallowed = formFields.eating_allowed.value // 共有許可
  const iurl = formFields.image_url.value // 写真

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
    formFields.owner_name.value = ''
    formFields.product_name.value = ''
    formFields.eating_allowed.value = false
    formFields.image_url.value = ''
    image_binary.value = undefined

    showPopup.value = false // ポップアップを閉じる
    fetchItems() // リストを更新
  }
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
