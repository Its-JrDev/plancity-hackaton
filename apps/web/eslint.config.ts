import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import betterTailwind from 'eslint-plugin-better-tailwindcss';

export default [
  js.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ['dist'] },
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Node-runtime files: Vite/Vitest/Jest/ESLint configs and CLI scripts.
    files: [
      '**/*.config.{ts,mts}',
      'eslint.config.ts',
      'scripts/**/*.{ts,mts}',
      'scripts/**/*.mjs',
      'jest.setup.ts',
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
  },
  {
    // Test files also see Jest globals (Vitest suites import explicitly).
    files: ['**/*.test.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: { ...globals.browser, ...globals.jest },
    },
  },
  {
    plugins: {
      'better-tailwindcss': betterTailwind,
    },
    rules: {
      'better-tailwindcss/enforce-canonical-classes': 'warn',
    },
  },
  prettier,
];
