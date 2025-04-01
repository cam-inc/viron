module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [2, 'always', ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test', 'intent', 'version']],
    'scope-enum': [2, 'always', ['all', 'example', 'app', 'linter', 'nodejs', 'website', 'golang']],
  }
};
