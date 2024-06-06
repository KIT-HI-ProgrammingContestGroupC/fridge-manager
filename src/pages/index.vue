<template>
  <v-app>
    <v-container>
      <!-- header -->
      <v-app-bar>
        <v-btn
          id="menu-activator"
          color="primary"
        >
          Sibling activator
        </v-btn>
        <v-menu activator="#menu-activator">
          <v-list>
            <v-list-item
              v-for="(item, index) in menuItems"
              :key="index"
              :value="index"
            >
              <v-list-item-title>{{ item.title }}</v-list-item-title>
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
          :items="filteredRows"
          class="elevation-1"
          item-value="name"
        />

        <v-row
          align="center"
          justify="center"
        >
          <v-col cols="auto">
            <!-- Puls Action Button -->
            <v-btn
              density="comfortable"
              icon="mdi-plus"
              style="bottom: 100px"
              @click="showPopup = true"
            />
          </v-col>
          <v-spacer />
          <v-col cols="auto">
            <!-- Search Action Button -->
            <v-btn
              density="comfortable"
              icon="mdi-magnify"
              style="bottom: 100px"
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
                  hint="Enter your product name you want to put on the fridge"
                  label="Product Name"
                  type="input"
                />
                <v-col cols="6">
                  <v-switch
                    :model-value="true"
                    color="primary"
                    label="Take free?"
                    inset
                  />
                </v-col>
                Photo
                <v-img
                  :width="350"
                  aspect-ratio="16/9"
                  cover
                  src="https://cdn.vuetifyjs.com/images/parallax/material.jpg"
                />
              </v-card-text>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-chip
                color="blue"
                size="x-large"
                class="ma-4"
                variant="flat"
                @click="showPopup = false"
              >
                <span class="text-h5">Register</span>
              </v-chip>
              <v-chip
                size="x-large"
                class="ma-2"
                @click="showPopup = false"
              >
                <span class="text-h5">close</span>
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-main>
    </v-container>
  </v-app>
</template>

<script setup>
const menuItems = ref([
  { title: '項目削除' },
  { title: '項目編集' },
])
const rows = ref([
  {
    owner: 'Alice',
    date: '2024-05-01',
    name: 'Item1',
    take: '10',
    photo: 'Photo1',
  },
  {
    owner: 'Bob',
    date: '2024-05-02',
    name: 'Item2',
    take: '20',
    photo: 'Photo2',
  },
  {
    owner: 'Charlie',
    date: '2024-05-03',
    name: 'Item3',
    take: '30',
    photo: 'Photo3',
  },
])

const searchQuery = ref('')
const showSearchBar = ref(false)
const showPopup = ref(false)

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

const toggleSearchBar = () => {
  showSearchBar.value = !showSearchBar.value
  if (!showSearchBar.value) {
    searchQuery.value = ''
  }
}

const deleteItem = () => {
  // 削除ボタンでこの関数に飛ぶ「予定」
  alert('項目削除')
}

const editItem = () => {
  // 編集ボタンでこの関数に飛ぶ「予定」
  alert('項目編集')
}

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
</script>

<style scoped>
  .v-application {
    font-family: 'Roboto', sans-serif;
  }

  .v-btn {
    position: fixed;
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

  .v-card {
    max-width: 400px;
  }
</style>
