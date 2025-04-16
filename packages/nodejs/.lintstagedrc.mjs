/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Config}
 */
export default {
  '**/*.{js,ts}': ['prettier --write --loglevel warn', 'eslint'],
};
