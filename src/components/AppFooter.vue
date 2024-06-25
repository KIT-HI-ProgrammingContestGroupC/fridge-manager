<template>
  <v-footer>
    <v-container
      class="footer-container"
    >
      <v-row justify="center">
        <v-col cols="auto">
          <v-btn
            href="https://github.com/KIT-HI-ProgrammingContestGroupC/fridge-manager/issues"
          >
            Report Issue
          </v-btn>
        </v-col>
      </v-row>

      <v-row justify="end">
        <v-col cols="auto">
          fridge-manager {{ appVersion }}
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
const appVersion: string = useRuntimeConfig().public.appVersion
</script>

<style>
.footer-container {
  border-top: 1px solid #ccc;
}
</style>
