/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Config}
 */
export default {
  '**/*.{js?(x),ts?(x),json}': ['prettier --write --loglevel warn'],
  /**
   * We need to run tsc by function syntax.
   * @see https://github.com/lint-staged/lint-staged/issues/825
   */
  '**/*.ts?(x)': () => 'tsc',
  '**/*.{js?(x),ts?(x)}': ['eslint --fix'],
};
