import js from '@eslint/js'
import vue from 'eslint-plugin-vue'
import prettier from '@vue/eslint-config-prettier'

export default [
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        process: 'readonly',
        localStorage: 'readonly',
        sessionStorage: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        global: 'readonly',
        Blob: 'readonly',
        FormData: 'readonly',
        URLSearchParams: 'readonly',
        navigator: 'readonly',
        performance: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        IntersectionObserver: 'readonly',
        PerformanceObserver: 'readonly',
        FileReader: 'readonly',
        Image: 'readonly',
        WebSocket: 'readonly',
        Notification: 'readonly',
        CustomEvent: 'readonly',
        Event: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        alert: 'readonly',
        confirm: 'readonly',
        screen: 'readonly',
        File: 'readonly',
        h: 'readonly',
        getCurrentInstance: 'readonly',
        nextTick: 'readonly',
        watch: 'readonly',
        useAuth: 'readonly',
        axios: 'readonly',

        // Node.js globals for config files
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',

        // Vitest globals
        describe: 'readonly',
        it: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        vi: 'readonly'
      }
    },
    rules: {
      // Vue-specific rules
      'vue/multi-word-component-names': 'error',
      'vue/no-unused-vars': 'error',
      'vue/no-unused-components': 'error',
      'vue/require-prop-types': 'error',
      'vue/require-default-prop': 'error',
      'vue/no-v-html': 'warn',
      // 'vue/component-tags-order': rule not available in current vue plugin version
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      // 'vue/no-template-shadow': 'error', // May not be available in current version
      'vue/no-duplicate-attributes': 'error',
      'vue/no-multiple-template-root': 'off', // Vue 3 allows multiple roots
      'vue/valid-v-slot': 'error',

      // JavaScript rules
      'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      'no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_'
        }
      ],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'template-curly-spacing': 'error',
      'arrow-spacing': 'error',
      'comma-dangle': ['error', 'never'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'never'],
      indent: ['error', 2],
      'max-len': ['warn', { code: 120, ignoreUrls: true }],
      eqeqeq: ['error', 'always'],
      curly: ['error', 'multi-line'],

      // Import rules
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
          ignoreMemberSort: false
        }
      ]
    }
  },
  {
    files: ['**/*.config.{js,mjs,cjs}', '**/vite.config.{js,mjs,cjs}'],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly'
      }
    }
  },
  {
    files: ['tests/**/*.{js,mjs,cjs}', '**/*.{test,spec}.{js,mjs,cjs}'],
    rules: {
      'no-console': 'off'
    }
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.git/',
      'coverage/',
      '*.min.js',
      'public/build/',
      'storage/',
      'bootstrap/'
    ]
  }
]
