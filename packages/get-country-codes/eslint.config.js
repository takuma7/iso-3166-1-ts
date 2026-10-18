import js from '@eslint/js'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importPlugin from 'eslint-plugin-import'
import prettierPlugin from 'eslint-plugin-prettier'
import globals from 'globals'

export default [
  {
    ignores: ['dist', 'node_modules', 'eslint.config.js'],
  },
  {
    ...js.configs.recommended,
    files: ['**/*.js', '.prettierrc.js', 'bin/*.js'],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      globals: { ...globals.node },
    },
    plugins: {
      import: importPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      'no-console': 'off',
      'import/prefer-default-export': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
      globals: { ...globals.node },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      import: importPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      'import/resolver': {
        typescript: {},
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      ...importPlugin.configs.recommended.rules,
      ...prettierPlugin.configs.recommended.rules,
      'no-console': 'off',
      '@typescript-eslint/no-shadow': 'off',
      'import/prefer-default-export': 'off',
    },
  },
]

