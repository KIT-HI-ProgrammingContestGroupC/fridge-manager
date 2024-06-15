import { defineNuxtPlugin } from '#app'
import { PERIOD_EXCEEDED_MS, PERIOD_EXCEEDED_STRING } from '~/constants'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      constants: {
        PERIOD_EXCEEDED_MS,
        PERIOD_EXCEEDED_STRING,
      },
    },
  }
})
