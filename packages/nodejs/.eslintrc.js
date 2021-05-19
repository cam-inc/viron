module.exports = {
  extends: [
    'eslint:recommended',
    'cam-recommended/backend',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  env: {
    es2020: true,
    node: true,
    'jest/globals': true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.test.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    'jest/expect-expect': 'off',
  },
};
