require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const package = require('./package.json');

// @see: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
module.exports = {
  pathPrefix: package.version,
  siteMetadata: {
    // TODO: 増やす
    title: 'Viron',
    description: 'TODO: description',
    author: 'TODO',
    authorURL: 'TODO: readmeのauthorかpackage.jsonのauthorへのurlを使うこと。',
    helpURL: 'TODO: vironのドキュメントページへのURL。',
    licenseURL:
      'TODO: readmeのlicenseかpackage.jsonのlicenseへのurlを使うこと。',
    keywords: ['TODO'],
    creator: 'CAM, Inc.',
    publisher: 'CAM, Inc.',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-postcss',
    },
    {
      resolve: 'gatsby-plugin-lodash',
    },
    {
      resolve: 'gatsby-plugin-react-helmet-async',
    },
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        // Edit the paths option in the tsconfig.json file as well.
        alias: {
          '~': './src',
        },
      },
    },
    {
      resolve: 'gatsby-plugin-page-creator',
      options: {
        path: `${__dirname}/src/pages`,
        ignore: {
          // Ignore files and directories with prefix of `_`.
          patterns: ['**/_*/**'],
        },
      },
    },
  ],
  // @see: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/#flags
  flags: {
    FAST_DEV: true,
  },
};
