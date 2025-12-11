/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Archbase React Docs',
  tagline: 'Design System + Mantine v8',
  url: 'https://docs.archbase.com',
  baseUrl: '/docs/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'archbase',
  projectName: 'archbase-react',
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          path: 'docs',
          routeBasePath: '/',
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/edsonmartins/archbase-react'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
};

module.exports = config;
