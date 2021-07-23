module.exports = {
  plugins: ['plugin-image-zoom'],
  title: 'ApiException',
  url: 'https://nanogiants.github.io/',
  baseUrl: '/nestjs-swagger-api-exception-decorator/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logoDark.svg',
  organizationName: 'nanogiants',
  projectName: 'nestjs-swagger-api-exception-decorator',
  themeConfig: {
    navbar: {
      title: '@ApiException',
      logo: {
        alt: 'NanoGiants',
        src: 'img/logo.svg',
        srcDark: 'img/logoDark.svg',
      },
      items: [
        {
          href: 'https://github.com/nanogiants/nestjs-swagger-api-exception-decorator',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://www.npmjs.com/package/@nanogiants/nestjs-swagger-api-exception-decorator',
          label: 'npm',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      logo: {
        alt: 'NanoGiants Logo',
        src: 'img/footerLinedDark.svg',
        href: 'https://nanogiants.de',
      },
      copyright: `Copyright © ${new Date().getFullYear()} NanoGiants GmbH. Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          routeBasePath: '/',
          editUrl: 'https://github.com/nanogiants/nestjs-swagger-api-exception-decorator/edit/master/documentation/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
