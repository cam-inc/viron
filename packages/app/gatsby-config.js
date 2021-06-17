// @see: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
module.exports = {
  siteMetadata: {
    title: 'Viron',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-postcss',
    },
    {
      resolve: 'gatsby-plugin-lodash',
    },
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        // Edit the paths option in the tsconfig.json file as well.
        alias: {
          $src: 'src',
          $components: 'src/components',
          $hooks: 'src/hooks',
          $i18n: 'src/i18n',
          $layouts: 'src/layouts',
          $oas: 'src/oas',
          $storage: 'src/storage',
          $store: 'src/store',
          $styles: 'src/styles',
          $types: 'src/types',
          $utils: 'src/utils',
          $wrappers: 'src/wrappers',
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
  flags: {
    // @see: https://github.com/gatsbyjs/gatsby/discussions/28331
    PRESERVE_FILE_DOWNLOAD_CACHE: true,
    PRESERVE_WEBPACK_CACHE: true,
  },
};
