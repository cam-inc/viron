module.exports = {
  map: true,
  plugins: {
    'postcss-import': {},
    'postcss-apply': {},
    'postcss-custom-properties': {
      "preserve": true
    },
    'postcss-flexbugs-fixes': {},
    'autoprefixer': {
      'browsers': [
        'ie >= 11',
        'last 2 Edge versions',
        'last 2 Firefox versions',
        'last 2 Chrome versions',
        'last 2 Safari versions',
        'last 2 Opera versions',
        'iOS >= 9',
        'Android >= 4.0',
        'last 2 ChromeAndroid versions'
      ]
    },
    'postcss-nesting': {},
    'postcss-overflow-wrap': {},
    'postcss-currentcolor': {},
    'postcss-sorting': {}
  }
};
