<template>
  <v-container>
    <v-btn
      text="sign out"
      @click="signOut({ callbackUrl: '/login' })"
    />
  </v-container>
</template>

<script setup lang="ts">
const { signOut } = useAuth()
</script>
