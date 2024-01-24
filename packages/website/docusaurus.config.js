// @see: https://docusaurus.io/docs/docusaurus.config.js
module.exports = {
  title: "VIRON",
  tagline: "The Magic to Turn OAS into GUI.",
  url: process.env.VIRON_WEBSITE_URL || "https://discovery.viron.plus",
  baseUrl: "/",
  favicon: "img/favicon.ico",
  i18n: {
    defaultLocale: "en",
    locales: ["en", "ja"],
  },
  organizationName: "CAM, Inc.",
  projectName: "viron",
  themeConfig: {
    colorMode: {
      defaultMode: "dark",
      disableSwitch: true,
    },
    navbar: {
      title: "Viron",
      logo: {
        alt: "VIRON",
        src: "img/logo.svg",
      },
      items: [
        {
          to: "docs/introduction",
          label: "Docs",
          position: "left",
        },
        /*
        {
          to: 'blog',
          label: 'Blog',
          position: 'left'
        },
        */
        {
          href: "https://github.com/cam-inc/viron",
          label: "GitHub",
          position: "right",
        },
        {
          type: "localeDropdown",
          position: "right",
        },
      ],
    },
    footer: {
      links: [
        {
          title: "Resources",
          items: [
            /*
            {
              label: 'Blog',
              to: 'blog',
            },
            */
            {
              label: "Documentation",
              to: "docs/introduction",
            },
            {
              label: "Introduction",
              to: "docs/introduction",
            },
            {
              label: "Quick Start",
              to: "docs/Getting-Started/quick-start",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/cam-inc/viron",
            },
            {
              label: "Issues",
              href: "https://github.com/cam-inc/viron/issues",
            },
            {
              label: "Contributing",
              href: "https://github.com/cam-inc/viron/blob/develop/CONTRIBUTING.md",
            },
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/viron",
            },
          ],
        },
        {
          title: "Legal",
          items: [
            {
              label: "Code of Conduct",
              href: "https://github.com/cam-inc/viron/blob/develop/CODE_OF_CONDUCT.md",
            },
            {
              label: "License",
              href: "https://github.com/cam-inc/viron/blob/develop/LICENSE",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} CAM, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
        },
        blog: {
          showReadingTime: true,
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
}
