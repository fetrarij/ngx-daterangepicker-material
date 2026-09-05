// ESM: eslint.config.mjs is required so the tsconfigRootDir helper below can use import.meta.url
// (the package itself has no "type": "module" set, so a plain .js file would load as CommonJS).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const tsconfigRootDir = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
  {
    ignores: ['projects/**/*', 'schematics/**/*', 'dist/**/*', 'demo/dist/**/*']
  },
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['tsconfig.json', 'demo/src/tsconfig.app.json', 'demo/src/tsconfig.spec.json'],
        tsconfigRootDir
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        ...globals.amd,
        ...globals.jasmine
      }
    },
    extends: [js.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'space-in-parens': 'off',
      'lines-between-class-members': ['error', 'always', { exceptAfterSingleLine: true }],
      'lines-around-comment': 'off',
      'array-bracket-spacing': 'off',
      'space-before-function-paren': 'off',
      'computed-property-spacing': 'off',
      quotes: ['error', 'single', { allowTemplateLiterals: true }],
      'consistent-return': 'off',
      'no-param-reassign': ['error', { ignorePropertyModificationsFor: ['consoleElement'] }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'none',
          tabWidth: 2,
          semi: true,
          singleQuote: true,
          endOfLine: 'auto'
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        { type: 'attribute', prefix: 'ngx-daterangepicker-material', style: 'camelCase' }
      ],
      '@angular-eslint/component-selector': [
        'error',
        { type: 'element', prefix: 'ngx-daterangepicker-material', style: 'kebab-case' }
      ],
      '@angular-eslint/prefer-standalone': 'off',
      '@angular-eslint/prefer-on-push-component-change-detection': 'off'
    }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended],
    rules: {}
  },
  {
    files: ['**/*.html'],
    ignores: ['**/*inline-template-*.component.html'],
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'prettier/prettier': ['error', { parser: 'angular', bracketSameLine: true }]
    }
  },
  prettierConfig
);
