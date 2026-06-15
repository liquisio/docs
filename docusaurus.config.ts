import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const config: Config = {
  title: 'Liquisio Docs',
  tagline: 'Guides, API references, and support docs for Liquisio products',
  favicon: 'img/favicon.ico',

  // Note: we intentionally do NOT enable Docusaurus Faster (the `future.v4`
  // shortcut turns it on via `fasterByDefault`). Faster uses the rspack bundler,
  // which needs platform-specific native binaries (@rspack/binding-<platform>)
  // that npm frequently fails to install across machines. The standard webpack
  // bundler has no native deps and is plenty fast for a docs site.

  // Production URL and base path. The repo is `liquisio/docs`, so GitHub Pages
  // serves it from https://liquisio.github.io/docs/. (If you later point a
  // custom domain at it, set url to that domain and baseUrl to '/'.)
  url: 'https://liquisio.github.io',
  baseUrl: '/docs/',

  // GitHub Pages deployment config.
  organizationName: 'liquisio',
  projectName: 'docs',

  onBrokenLinks: 'throw',

  // Treat .md as CommonMark and .mdx as MDX. Synced product docs are plain
  // Markdown and may contain angle-bracket placeholders (e.g. `<token>`); the
  // CommonMark parser handles those without the MDX compiler choking on them.
  markdown: {
    format: 'detect',
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Serve docs at the site root so URLs are /docs/<product>/... rather
          // than /docs/docs/<product>/... (baseUrl already contributes /docs/).
          routeBasePath: '/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/docusaurus-social-card.jpg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Liquisio Docs',
      logo: {
        alt: 'Liquisio',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Docs',
        },
        {
          href: 'https://github.com/liquisio/docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Products',
          items: [
            {
              label: 'Plans LQ',
              to: '/plans/setup',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/liquisio/docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Liquisio. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
