module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'react-hooks', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  rules: {
    'no-console': 'off',
    'no-empty-pattern': 'off',
    'no-extra-boolean-cast': 'off',
    'linebreak-style': ['error', 'unix'],
    'react/jsx-no-bind': [
      'error',
      { ignoreRefs: true, allowFunctions: true, allowArrowFunctions: true },
    ],
    'react/jsx-no-duplicate-props': 'error',
    'react/self-closing-comp': 'error',
    'react/prefer-es6-class': 'error',
    'react/no-string-refs': 'error',
    'react/require-render-return': 'error',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': [
      'warn',
      {
        additionalHooks: 'useRecoilCallback',
      },
    ],
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'import/order': [
      'warn',
      {
        alphabetize: { order: 'asc', caseInsensitive: false },
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        pathGroups: [
          {
            pattern: '[$|~]/**',
            group: 'internal',
          },
        ],
        'newlines-between': 'never',
        warnOnUnassignedImports: true,
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
