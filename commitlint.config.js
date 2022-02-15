module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['version']],
    'scope-enum': [2, 'always', ['all', 'example', 'app', 'linter', 'nodejs', 'website']],
    'subject-empty': [1, 'always'],
  }
};
