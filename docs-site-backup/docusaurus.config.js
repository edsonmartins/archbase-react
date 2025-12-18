/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Archbase React',
  tagline: 'Biblioteca completa de componentes React para aplicações empresariais',
  url: 'https://docs.archbase.com',
  baseUrl: '/docs/',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'archbase',
  projectName: 'archbase-react',

  i18n: {
    defaultLocale: 'pt-BR',
    locales: ['pt-BR'],
  },

  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/edsonmartins/archbase-react/tree/main/docs-site/',
          showLastUpdateTime: true,
          showLastUpdateAuthor: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'Archbase React',
      logo: {
        alt: 'Archbase Logo',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docs',
          position: 'left',
          label: 'Documentação',
        },
        {
          href: 'http://localhost:6006',
          label: 'Storybook',
          position: 'left',
        },
        {
          href: 'https://github.com/edsonmartins/archbase-react',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentação',
          items: [
            {
              label: 'Getting Started',
              to: '/getting-started/installation',
            },
            {
              label: 'Componentes',
              to: '/components/overview',
            },
            {
              label: 'Templates',
              to: '/templates/overview',
            },
          ],
        },
        {
          title: 'Recursos',
          items: [
            {
              label: 'Storybook',
              href: 'http://localhost:6006',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/edsonmartins/archbase-react',
            },
          ],
        },
        {
          title: 'Pacotes',
          items: [
            {
              label: '@archbase/core',
              href: 'https://www.npmjs.com/package/@archbase/core',
            },
            {
              label: '@archbase/components',
              href: 'https://www.npmjs.com/package/@archbase/components',
            },
            {
              label: '@archbase/data',
              href: 'https://www.npmjs.com/package/@archbase/data',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Archbase. Built with Docusaurus.`,
    },
    prism: {
      theme: require('prism-react-renderer').themes.github,
      darkTheme: require('prism-react-renderer').themes.dracula,
      additionalLanguages: ['bash', 'json', 'typescript', 'tsx'],
    },
    colorMode: {
      defaultMode: 'light',
      disableSwitch: false,
      respectPrefersColorScheme: true,
    },
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  },
};

module.exports = config;
