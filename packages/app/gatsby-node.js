exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        // Necesary for roarr npm module.
        domain: false,
      },
    },
  });
};
