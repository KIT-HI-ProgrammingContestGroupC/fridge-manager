<template>
  <v-container>
    <v-form
      @submit.prevent="signIn({ username, password }, { callbackUrl: '/' })"
    >
      <v-card
        class="mx-auto"
        width="400"
      >
        <v-card-text>
          <v-text-field
            v-model="username"
            label="Username"
            prepend-icon="mdi-fridge"
            type="text"
          />
          <v-text-field
            v-model="password"
            label="Password"
            prepend-icon="mdi-lock"
            type="password"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            text="Sign In"
            color="primary"
            variant="flat"
            type="submit"
          />
        </v-card-actions>
      </v-card>
    </v-form>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  auth: {
    unauthenticatedOnly: true,
    navigateAuthenticatedTo: '/',
  },
})

const { signIn } = useAuth()

const username = ref('')
const password = ref('')
</script>
