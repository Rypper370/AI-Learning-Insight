const js = require('@eslint/js');
const globals = require('globals');
const { defineConfig } = require('eslint/config');
const daStyle = require('eslint-config-dicodingacademy');

module.exports = defineConfig([
  // Dicoding Academy style guide (Standar Internasional Dicoding Academy :v aowkwkwkwk)
  daStyle,

  {
    files: ['**/*.{js,mjs,cjs}'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      'no-console': 'off',
      'linebreak-style': 'off',

      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
    },
  },
  {
    files: ['migrations/**/*.{js,mjs,cjs}'],
    rules: {
      camelcase: 'off',
      indent: ['error', 2],
    },
  },
]);
