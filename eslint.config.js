import js from '@eslint/js'
import pluginVue from 'eslint-plugin-vue'
import prettierConfig from 'eslint-config-prettier'
import globals from 'globals'

export default [
  {
    ignores: [
      'dist/',
      'node_modules/',
      'vendor/',
      'src/article/',
      'src/templates/',
      'public/',
      '.playwright-mcp/',
      'api-data/',
      'api-docs/',
      'data/',
      '.codeartsdoer/',
      '.git/',
    ],
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  prettierConfig,
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off',
      'no-undef': 'warn',
      'no-empty': 'warn',
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
    },
  },
]
