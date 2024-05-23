import stylistic from '@stylistic/eslint-plugin'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  stylistic.configs['recommended-flat'],
  // your custom flat configs go here, for example:
  // {
  //   files: ['**/*.ts', '**/*.tsx'],
  //   rules: {
  //     'no-console': 'off' // allow console.log in TypeScript files
  //   }
  // },
  // {
  //   ...
  // }
)
