const postcssPresetEnv = require('postcss-preset-env');
const tailwindcss = require('tailwindcss');
const tailwindConfig = require('./tailwind.config.js');

module.exports = {
  plugins: [tailwindcss(tailwindConfig), postcssPresetEnv({ stage: 3 })],
};
