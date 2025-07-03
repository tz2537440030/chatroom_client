import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { globalIgnores } from 'eslint/config'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      ecmaFeatures: { jsx: true }, // 解析 JSX
    },
    settings: {
      react: {
        version: 'detect', // 自动检测 React 版本
      },
    },
     env: {
      browser: true,
      node: true,
      es2021: true,
    },
    plugins: [
      'react',
      'react-hooks',
      '@typescript-eslint',
      'jsx-a11y',
      'prettier',
    ],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'prettier/prettier': 'warn',
      'react/react-in-jsx-scope': 'off', // React 17+ 无需 import React
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'react/prop-types': 'off', // 使用 TS 可关闭 prop-types
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'jsx-a11y/anchor-is-valid': 'off', // 可以根据你项目关闭部分 jsx-a11y 的规则
    },
  },
])
