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
    },
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        // Edit the paths option in the tsconfig.json file as well.
        alias: {
          '@src': 'src',
          '@components': 'src/components'
        }
      }
    }
  ]
};
