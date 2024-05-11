import globals from 'globals';
import js from '@eslint/js';
import prettier from 'eslint-plugin-prettier';
import pluginVue from 'eslint-plugin-vue';

export default [
  {
    ignores: ['dist', 'node_modules', '/*.js', '/*.json'],
    languageOptions: { globals: globals.browser },
  },
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 2,
      'no-var': 2,
      'no-debugger': 2,
      'no-console': import.meta.env === 'development' ? 1 : 2,
      'vue/multi-word-component-names': 0,
    },
  },
];
