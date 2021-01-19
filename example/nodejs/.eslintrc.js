module.exports = {
  extends: [
    'eslint:recommended',
    'cam-recommended/backend',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
    'prettier/@typescript-eslint',
  ],
  plugins: ['@typescript-eslint', 'jest'],
  env: {
    es6: true,
    node: true,
    "jest/globals": true
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  rules: {
    'prettier/prettier': 'error',
    "@typescript-eslint/explicit-function-return-type": 2,
    "jest/expect-expect": 0
  },
};