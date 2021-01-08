module.exports = {
  plugins: ['plugin-image-zoom'],
  title: 'ApiException',
  // tagline: 'The tagline of my site',
  url: 'https://github.com/nanogiants/nestjs-swagger-api-exception-decorator',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'NanoGiants', // Usually your GitHub org/user name.
  projectName: 'nestjs-swagger-api-exception-decorator', // Usually your repo name.
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
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2/',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Stack Overflow',
              href: 'https://stackoverflow.com/questions/tagged/docusaurus',
            },
            {
              label: 'Discord',
              href: 'https://discordapp.com/invite/docusaurus',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/docusaurus',
            },
          ],
        },
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
