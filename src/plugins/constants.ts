import { defineNuxtPlugin } from '#app'
import { TWO_WEEKS, TWO_WEEKS_STRING } from '~/constants'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      constants: {
        TWO_WEEKS,
        TWO_WEEKS_STRING,
      },
    },
  }
})
