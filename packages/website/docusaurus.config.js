// @see: https://docusaurus.io/docs/docusaurus.config.js
module.exports = {
  title: 'VIRON',
  url: process.env.VIRON_WEBSITE_URL || 'https://cam-inc.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ja'],
  },
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  onDuplicateRoutes: 'warn',
  tagline: 'Provide OAS document, Get GUI.',
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
      links: [
        {
          title: 'Resources',
          items: [
            {
              label: 'Blog',
              to: 'blog',
            },
            {
              label: 'Documentation',
              to: 'docs/introduction',
            },
            {
              label: 'Introduction',
              to: 'docs/introduction',
            },
            {
              label: 'Quick Start',
              to: 'docs/Getting-Started/quick-start',
            },
            {
              label: 'Demo',
              to: 'docs/Getting-Started/demo',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/cam-inc/viron',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/viron/TODO',
            },
            {
              label: 'Issues',
              href: 'https://github.com/cam-inc/viron/issues',
            },
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/viron',
            },
          ],
        },
        {
          title: 'Legal',
          items: [
            {
              label: 'Privacy Policy',
              href: 'https://viron.app/privacyPolicy/TODO',
            },
            {
              label: 'Terms of Service',
              href: 'https://viron.app/termsOfServicey/TODO',
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
