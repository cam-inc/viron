exports.onCreateWebpackConfig = ({ actions, plugins }) => {
  actions.setWebpackConfig({
    plugins: [
      // Just use DefinePlugin. Using .env.* files is too much.
      plugins.define({
        __NODE_ENV__: JSON.stringify(process.env.NODE_ENV),
      }),
    ],
    resolve: {
      fallback: {
        fs: false,
      },
    },
  });
};
