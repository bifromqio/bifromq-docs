// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const tailwindPlugin = require('./plugins/tailwind-plugin.cjs')

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: ' BifroMQ.io - Multi-tenancy MQTT Broker',
  tagline: 'BifroMQ is a Java-based high-performance MQTT Broker messaging middleware that adopts Multi-tenancy architecture. Open-sourced by Baidu.',
  favicon: 'img/favicon.ico',
  // Set the production url of your site here
  url: 'https://bifromq.io/',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',
  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'baidu', // Usually your GitHub org/user name.
  projectName: 'bifromq', // Usually your repo name.
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  trailingSlash: true,
  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh-Hans'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          showLastUpdateTime: true,
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/baidu/bifromq-docs/tree/master/website',
          editLocalizedFiles: true,
        },
        blog: {
          showReadingTime: true,
          blogSidebarCount: 0,
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/baidu/bifromq-docs/tree/master/website/',
          editLocalizedFiles: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [tailwindPlugin],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
      },
      navbar: {
        title: 'BifroMQ',
        hideOnScroll: true,
        logo: {
          alt: 'BifroMQ Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo_dark.svg',
          className: 'bifromq-navbar-logo-class',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'right',
            label: 'Docs',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'right'
          },
          {
            to: 'https://github.com/baidu/bifromq',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownItemsAfter: [{to: '/versions'}],
            dropdownActiveClassDisabled: true,
          },
        ],
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),

  scripts: [
      'https://bifromq-api.gz.bcebos.com/commonHeader.js',
  ],
};

module.exports = config;
