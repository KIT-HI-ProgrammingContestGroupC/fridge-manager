<template>
  <v-dialog
    v-model="isDialogOpen"
  >
    <v-card>
      <v-card-title>
        Do you want to delete this item?
      </v-card-title>

      <v-list-item
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
              :src="targetItem.image_url"
            />
          </div>
        </template>

        <!-- Discription -->
        <v-list-item-title>
          {{ targetItem.product_name }}
        </v-list-item-title>

        <v-list-item-subtitle>
          <p>
            {{ targetItem.owner_name }}
          </p>
          <p>
            {{ targetItem.uploaded_at }}
          </p>
          <p v-if="targetItem.eating_allowed">
            Take free!
          </p>
        </v-list-item-subtitle>
      </v-list-item>

      <v-card-actions>
        <v-btn
          text="Delete"
          color="red"
          variant="flat"
          @click="emit('delete-item'); isDialogOpen = false"
        />
        <v-btn
          text="Cancel"
          color="blue"
          variant="outlined"
          @click="isDialogOpen = false"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
const isDialogOpen = defineModel('isDialogOpen', { type: Boolean }, { default: false })

interface FridgeItem {
  id: number
  owner_name: string
  uploaded_at: string
  product_name: string
  eating_allowed: boolean
  image_url: string
}
const props = defineProps<{ targetItem: FridgeItem | undefined }>()

const emit = defineEmits<{
  (e: 'delete-item'): void
}>()
</script>
