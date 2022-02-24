exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        // Necesary for using Tailwind JIT mode.
        // @see: https://www.gatsbyjs.com/docs/how-to/local-development/troubleshooting-common-errors/#issues-with-fs-resolution
        fs: false,
      },
    },
  });
};
