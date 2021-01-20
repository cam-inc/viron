// @see: https://www.gatsbyjs.com/docs/reference/config-files/gatsby-config/
module.exports = {
  siteMetadata: {
    title: 'Viron'
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-postcss'
    },
    {
      resolve: 'gatsby-plugin-alias-imports',
      options: {
        // Edit the paths option in the tsconfig.json file as well.
        alias: {
          '@src': 'src',
          '@components': 'src/components',
          '@layouts': 'src/layouts',
          '@state': 'src/state',
          '@styles': 'src/styles',
          '@wrappers': 'src/wrappers'
        }
      }
    }
  ]
};
