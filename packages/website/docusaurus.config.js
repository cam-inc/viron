// @see: https://docusaurus.io/docs/docusaurus.config.js
module.exports = {
  title: 'VIRON',
  url: 'https://cam-inc.github.io',
  baseUrl: '/viron/website/',
  favicon: 'img/favicon.ico',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
  },
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'warn',
  tagline: 'OAS-base Admin Tool.',
  organizationName: 'CAM, Inc.',
  projectName: 'viron',
  themeConfig: {
    navbar: {
      title: 'Viron',
      logo: {
        alt: 'VIRON',
        src: 'img/logo.svg',
      },
      items: [
        {
          to: 'docs/introduction',
          label: 'Docs',
          position: 'left',
        },
        {
          to: 'blog',
          label: 'Blog',
          position: 'left'
        },
        {
          href: 'https://github.com/cam-inc/viron',
          label: 'GitHub',
          position: 'right',
        },
        {
          type: 'localeDropdown',
          position: 'right',
        },
      ],
    },
    footer: {
      links: [{
          title: 'Docs',
          items: [{
              label: 'Documentation',
              to: 'docs',
            },
            {
              label: 'Quick start',
              to: 'docs/doc1',
            },
          ],
        },
        {
          title: 'Community',
          items: [{
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/viron',
            },
            {
              label: 'Github Issues',
              href: 'https://github.com/cam-inc/viron/issues',
            },
          ],
        },
        {
          title: 'More',
          items: [{
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/cam-inc/viron',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CAM, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
