module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'scope-enum': [2, 'always', ['all', 'example', 'app', 'linter', 'nodejs', 'website']]
  }
};
