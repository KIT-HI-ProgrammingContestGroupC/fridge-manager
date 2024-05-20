// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
  ],
  eslint: {
    config: {
      stylistic: true,
    },
  },
  devServer: {
    host: '0.0.0.0',
  },
})
