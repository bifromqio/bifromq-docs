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
  url: 'https://bifromq.io/',
  baseUrl: '/',
  organizationName: 'baidu',
  projectName: 'bifromq',
  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  trailingSlash: true,
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
          sidebarPath: require.resolve("./sidebars.js"),
          editUrl: ({locale, versionDocsDirPath, docPath}) => {
            if (locale !== config.i18n.defaultLocale) {
              return `https://github.com/baidu/bifromq-docs/tree/master/website/i18n/zh-Hans/docusaurus-plugin-content-docs/`;
            }
            // Link to GitHub for English docs
            return `https://github.com/baidu/bifromq-docs/tree/master/website/${versionDocsDirPath}/${docPath}`;
          },
          lastVersion: 'current',
          versions: {
            current: {
              label: '2.0.0',
              path: '',
            },
          },
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl: ({locale}) => {
            if (locale !== config.i18n.defaultLocale) {
              return "https://github.com/baidu/bifromq-docs/blob/master/website/i18n/zh-Hans/docusaurus-plugin-content-blog";
            }
            return "https://github.com/baidu/bifromq-docs/tree/master/website/blog";
          },
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],

  plugins: [tailwindPlugin, require.resolve('docusaurus-plugin-image-zoom')],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
      },
      zoom: {
        selector: '.markdown :not(em) > img',
        background: {
          light: 'rgb(255, 255, 255)',
          dark: 'rgb(50, 50, 50)'
        },
        config: {
          // options you can specify via https://github.com/francoischalifour/medium-zoom#usage
        }
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
      '/js/baiduHM.js',
  ],
};

module.exports = config;
