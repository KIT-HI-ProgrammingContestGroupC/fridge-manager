<template>
  <div>
    <h1>Login Page</h1>
    <form @submit.prevent="signIn({ username, password }, { callbackUrl: '/' })">
      <div>
        <label for="username">UserName:</label>
        <input
          id="username"
          v-model="username"
          type="text"
          placeholder="Username"
        >
      </div>
      <div>
        <label for="password">Password:</label>
        <input
          id="password"
          v-model="password"
          type="password"
          placeholder="Password"
        >
      </div>
      <button type="submit">
        sign in
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const { signIn } = useAuth()

const username = ref('')
const password = ref('')
</script>
