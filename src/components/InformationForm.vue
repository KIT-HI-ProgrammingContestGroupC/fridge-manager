<template>
  <div>
    <v-dialog
      v-model="isOpen"
      persistent
      max-width="600px"
    >
      <v-card>
        <!-- Title -->
        <v-card-title>
          <v-container>
            <v-row>
              Add Item
              <v-spacer />
              <!-- Close Button -->
              <v-icon
                icon="mdi-close"
                @click="isOpen = false"
              />
            </v-row>
          </v-container>
        </v-card-title>

        <!-- Input area -->
        <v-card-text>
          <v-combobox
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

    <AutoFillBarcodeReaderDialogue
      v-model:showBarcodeReader="showBarcodeReader"
      @get-product-info="handleProductInfo"
    />
  </div>
</template>

<script setup lang="ts">
const isOpen = defineModel('isopen', { type: Boolean })
// members is an array of user objects
// about user object, see https://api.slack.com/methods/users.info#examples
const { data: members } = useFetch('/api/slackMembers')
const showBarcodeReader: Ref<boolean> = ref(false)

const emit = defineEmits<{
  (e: 'post-data-added'): void
}>()

const { data } = useAuth()

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

const image_binary: Ref<Blob | undefined> = ref(undefined)
// 画像ファイルがアップロードされたら、その画像をData URLに変換してimage_urlに入れる関数
const onFileUploaded = async (): Promise<void> => {
  const reader = new FileReader()
  reader.readAsDataURL(image_binary.value)
  reader.onload = (e) => {
    formFields.image_url.value = e.target.result
  }
}

// エラーメッセージ保存用の変数。フォーム入力の不足・不正があればここに警告文を入れる。
const errorMessage: Ref<string> = ref('')
// フォームに必要なデータが入力されているか確認した後、入力されていればDBに追加する
const addItem = async (): Promise<void> => {
  const oname = formFields.owner_name.value // 所有者名
  const pname = formFields.product_name.value // 製品名
  const eallowed = formFields.eating_allowed.value // 共有許可
  const iurl = formFields.image_url.value // 写真

  // ===フォーム確認======================================
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
        fridge_id: data.value.username,
      },
    })

    // 対応するテキストボックス等を空にする
    formFields.owner_name.value = ''
    formFields.product_name.value = ''
    formFields.eating_allowed.value = false
    formFields.image_url.value = ''
    image_binary.value = undefined

    isOpen.value = false // ポップアップを閉じる
    emit('post-data-added') // データが追加されたことを親コンポーネントに通知
  }
}

const handleProductInfo = async (productName: string, imageURL: string): Promise<void> => {
  // 読み取った情報をフォームに入力
  formFields.product_name.value = productName
  formFields.image_url.value = imageURL
  // バーコードリーダーを閉じる
  showBarcodeReader.value = false
}
</script>
