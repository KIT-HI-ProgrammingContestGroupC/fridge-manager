<template>
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
          @click="emit('activate-product-form')"
        />
      </template>
    </v-list-item>

    <v-list-item
      v-for="(item, index) in filteredItems"
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
          <template #activator="{ props: menuProps }">
            <v-btn
              v-bind="menuProps"
              icon="mdi-dots-vertical"
              density="compact"
              variant="text"
            />
          </template>

          <v-list>
            <v-list-item
              title="Delete Item"
              @click="openConfirmDeleteDialog(item)"
            />
          </v-list>
        </v-menu>
      </template>
    </v-list-item>
  </v-list>

  <ConfirmDeleteDialogue
    v-model:is-dialog-open="isConfirmDeleteDialogOpen"
    :target-item="deleteTargetItem"
    @delete-item="deleteItem([deleteTargetItem.id])"
  />
</template>

<script setup lang="ts">
const items = defineModel('items', { type: Array })
const props = defineProps<{
  filterQuery: string
}>()

const emit = defineEmits<{
  (e: 'activate-product-form'): void
}>()

// DBからデータを削除する関数
const deleteItem = async (itemIDs: number[]): Promise<void> => {
  for (let i = 0; i < itemIDs.length; i++) {
    // fridge_items.delete.tsの中身を呼び出す
    await $fetch('/api/fridge_items', {
      method: 'delete',
      body: {
        delete_id: itemIDs[i],
      },
    })
  }

  items.value = await $fetch('/api/fridge_items')
}

const isConfirmDeleteDialogOpen = ref(false)
const deleteTargetItem: Ref<FridgeItem | undefined> = ref()
const openConfirmDeleteDialog = (item: FridgeItem): void => {
  deleteTargetItem.value = item
  isConfirmDeleteDialogOpen.value = true
}

// 表示する行を検索クエリに基づいてフィルタリングする
const filteredItems = computed(() => {
  if (!props.filterQuery) {
    return items.value
  }
  else {
    return items.value.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(props.filterQuery.toLowerCase()),
      ),
    )
  }
})

// init items
items.value = await $fetch('/api/fridge_items')
</script>
