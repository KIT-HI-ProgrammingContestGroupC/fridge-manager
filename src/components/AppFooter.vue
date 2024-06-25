<template>
  <v-container
    class="footer-container"
  >
    <v-footer>
      <v-row
        justify="center"
      >
        <v-btn
          href="https://github.com/KIT-HI-ProgrammingContestGroupC/fridge-manager/issues"
        >
          Report Issue
        </v-btn>
      </v-row>
      fridge-manager {{ appVersion }}
    </v-footer>
  </v-container>
</template>

<script setup lang="ts">
const appVersion: string = useRuntimeConfig().public.appVersion
</script>

<style>
.footer-container {
  border-top: 1px solid #ccc;
}
</style>
