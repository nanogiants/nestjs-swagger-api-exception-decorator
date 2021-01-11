module.exports = {
  plugins: ['plugin-image-zoom'],
  title: 'ApiException',
  // tagline: 'The tagline of my site',
  url: 'https://nanogiants.github.io/',
  baseUrl: '/nestjs-swagger-api-exception-decorator/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'nanogiants',
  projectName: 'nestjs-swagger-api-exception-decorator',
  themeConfig: {
    navbar: {
      title: '@ApiException',
      items: [
        {
          href: 'https://github.com/nanogiants/nestjs-swagger-api-exception-decorator',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@nanogiants/nestjs-swagger-api-exception-decorator',
          label: 'NPM',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'More',
          items: [
            {
              href: 'https://github.com/nanogiants/nestjs-swagger-api-exception-decorator',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} NanoGiants GmbH, Inc. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          // Please change this to your repo.
          editUrl: 'https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/edit/master/documentation/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
