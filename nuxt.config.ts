// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
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
  srcDir: 'src/',
  runtimeConfig: { // token追加
    slackBotToken: process.env.SLACK_BOT_TOKEN,
    slackChannelId: process.env.SLACK_CHANNEL_ID,
    yahooClientId: process.env.YAHOO_CLIENT_ID,
  },
  nitro: {
    scheduledTasks: {
      // cron構文で実行間隔を設定
      '0 12 * * *': ['sendSlackTask'], // 毎日12時にタスクを実行する
    },
    experimental: {
      tasks: true,
    },
  },
})
