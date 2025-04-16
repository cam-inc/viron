/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Config}
 */
export default {
  '**/*.{js,ts}': ['prettier --write', 'eslint --fix'],
  /**
   * We need to run tsc by function syntax.
   * @see https://github.com/lint-staged/lint-staged/issues/825
   */
  '**/*.ts': () => 'tsc --noEmit',
};
