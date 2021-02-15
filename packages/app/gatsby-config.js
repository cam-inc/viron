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
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        // Edit the paths option in the tsconfig.json file as well.
        alias: {
          $src: 'src',
          $components: 'src/components',
          $hooks: 'src/hooks',
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
  ],
};
