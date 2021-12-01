exports.onCreateWebpackConfig = ({ actions }) => {
  actions.setWebpackConfig({
    resolve: {
      fallback: {
        // Necesary for using Tailwind JIT mode.
        fs: false,
      },
    },
  });
};
