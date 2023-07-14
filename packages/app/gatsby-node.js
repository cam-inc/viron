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

exports.onCreatePage = ({ page, actions }) => {
  const { i18n } = page.context;
  const { languages } = i18n;
  const { createPage } = actions;

  const languageRegexPart = `^(?:/(${languages.join('|')}))?`;
  const clientRoutes = [
    {
      pathRegexPart: '/endpoints/[^/]+/$',
      matchPath: '/endpoints/:endpointId',
    },
  ];

  for (const route of clientRoutes) {
    const [matches, language] =
      page.path.match(
        new RegExp(`${languageRegexPart}${route.pathRegexPart}`)
      ) || [];
    if (matches) {
      const { matchPath } = route;
      page.matchPath = language ? `/${language}${matchPath}` : matchPath;
      createPage(page);
      break;
    }
  }
};
