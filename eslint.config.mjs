import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  {
    ignores: ['dist/', 'node_modules/'],
  },
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  {
    languageOptions: { globals: globals.browser },
    rules: {
      'prettier/prettier': ['error', { singleQuote: true }],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
];
