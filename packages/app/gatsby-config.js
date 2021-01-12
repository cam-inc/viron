const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const tailwindConfig = require('./tailwind.config.js');

module.exports = {
  plugins: [
    {
      resolve: 'gatsby-plugin-postcss',
      options: {
        postCssPlugins: [
          tailwindcss(tailwindConfig),
          postcssPresetEnv({ stage: 3 })
        ]
      }
    }
  ]
};
