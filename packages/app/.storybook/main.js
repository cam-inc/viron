const path = require('path');

module.exports = {
  "stories": [
    "../src/**/*.stories.mdx",
    "../src/**/*.stories.@(js|jsx|ts|tsx)"
  ],
  "addons": [
    "@storybook/addon-links",
    "@storybook/addon-essentials"
  ],
  "webpackFinal": async (config, { configType }) => {
    // @see: https://www.gatsbyjs.org/docs/visual-testing-with-storybook/
    // Transpile Gatsby module because Gatsby includes un-transpiled ES6 code.
    config.module.rules[0].exclude = [/node_modules\/(?!(gatsby)\/)/];
    // use installed babel-loader which is v8.0-beta (which is meant to work with @babel/core@7)
    config.module.rules[0].use[0].loader = require.resolve("babel-loader");
    // use @babel/preset-react for JSX and env (instead of staged presets)
    config.module.rules[0].use[0].options.presets = [
      require.resolve("@babel/preset-react"),
      require.resolve("@babel/preset-env"),
    ];
    config.module.rules[0].use[0].options.plugins = [
      // use @babel/plugin-proposal-class-properties for class arrow functions
      require.resolve("@babel/plugin-proposal-class-properties"),
      // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
      require.resolve("babel-plugin-remove-graphql-queries"),
    ];
    // Prefer Gatsby ES6 entrypoint (module) over commonjs (main) entrypoint
    config.resolve.mainFields = ["browser", "module", "main"];
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      loader: require.resolve("babel-loader"),
      options: {
        presets: [["react-app", { flow: false, typescript: true }]],
        plugins: [
          require.resolve("@babel/plugin-proposal-class-properties"),
          // use babel-plugin-remove-graphql-queries to remove static queries from components when rendering in storybook
          require.resolve("babel-plugin-remove-graphql-queries"),
        ],
      },
    })
    config.resolve.extensions.push(".ts", ".tsx")

    // PostCSS Support
    config.module.rules.push({
      test: /\.css$/,
      loaders: [
        // Loader for webpack to process CSS with PostCSS
        {
          loader: 'postcss-loader',
          options: {
            // Enable Source Maps
            sourceMap: true,
            // Set postcss.config.js config path && ctx
            config: {
              path: './.storybook/',
            },
          },
        },
      ],
      include: path.resolve(__dirname, '../'),
    });

    return config;
  }
}
