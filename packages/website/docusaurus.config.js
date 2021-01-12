module.exports = {
  title: 'VIRON',
  tagline: 'Automated admin tool',
  url: 'https://github.com/cam-inc/viron',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'cam-inc', // Usually your GitHub org/user name.
  projectName: 'viron', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: 'VIRON',
      logo: {
        alt: 'VIRON',
        src: 'img/logo.svg',
      },
      items: [{
          to: 'docs/',
          activeBasePath: 'docs',
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
      ],
    },
    footer: {
      style: 'dark',
      links: [{
          title: 'Docs',
          items: [{
              label: 'Documentation',
              to: 'docs/',
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
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/edit/master/website/blog/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};