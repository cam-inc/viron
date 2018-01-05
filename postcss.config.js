module.exports = {
  map: false,
  plugins: {
    'postcss-import': {},
    'postcss-apply': {},
    'postcss-mixins': {},
    'postcss-custom-properties': {
      'preserve': true,
      'warnings': false
    },
    'postcss-flexbugs-fixes': {},
    'autoprefixer': {
      'browsers': [
        'last 2 Edge versions',
        'last 2 Firefox versions',
        'last 2 Chrome versions',
        'last 2 Safari versions',
        'last 2 Opera versions',
        'last 2 ChromeAndroid versions'
      ]
    },
    'postcss-nested': {},
    'postcss-overflow-wrap': {},
    'postcss-currentcolor': {},
    'postcss-sorting': {}
  }
};
