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
    description: 'OAS-driven Frontend-NoCode Administration Console',
    author: 'CAM, Inc.',
    authorURL: 'https://github.com/cam-inc/viron#authors',
    helpURL: 'https://discovery.viron.plus/docs/introduction',
    licenseURL: 'https://github.com/cam-inc/viron/blob/develop/LICENSE',
    keywords: [
      'OpenAPI Specification',
      'OAS',
      'administration',
      'admin',
      'Frontend-NoCode',
      'OSS',
    ],
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
  // @see: https://www.gatsbyjs.com/docs/api-proxy/#advanced-proxying
  developMiddleware: (app) => {
    app.use((req, res, next) => {
      res.set('x-viron-authtypes-path', '/authentication');
      next();
    });
  },
};
