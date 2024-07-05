// https://nuxt.com/docs/api/configuration/nuxt-config
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import version from './app-version'

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
    '@sidebase/nuxt-auth',
  ],
  auth: {
    provider: {
      type: 'local',
    },
    globalAppMiddleware: true,
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  devServer: {
    host: '0.0.0.0',
  },
  srcDir: 'src/',
  imports: {
    dirs: ['~/types'],
  },
  runtimeConfig: { // token追加
    slackBotToken: process.env.SLACK_BOT_TOKEN,
    slackChannelId: process.env.SLACK_CHANNEL_ID,
    yahooClientId: process.env.YAHOO_CLIENT_ID,
    pepper: process.env.PEPPER_DB,

    public: {
      appVersion: version,
    },
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
  plugins: ['~/plugins/constants.ts'],
})
