import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync } from 'fs';
import { ROOT, GENERATED_LANDING } from './scripts/vite-plugins/shared.js';

import injectBuildDate from './scripts/vite-plugins/inject-build-date.js';
import seoPrerender from './scripts/vite-plugins/seo-prerender.js';
import cacheControlMeta from './scripts/vite-plugins/cache-control-meta.js';
import generateSitemap from './scripts/vite-plugins/generate-sitemap.js';
import generateLlms from './scripts/vite-plugins/generate-llms.js';
import swHash from './scripts/vite-plugins/sw-hash.js';
import verifyAssets from './scripts/vite-plugins/verify-assets.js';

// ===== 页面发现（逻辑在 shared.js，这里只装配入口） =====
function discoverLandingPages() {
  const srcDir = resolve(ROOT, 'src');
  const entries = {};
  for (const file of readdirSync(srcDir)) {
    if (!file.endsWith('.html') || file === 'index.html' || file.startsWith('llms')) continue;
    const name = file.replace('.html', '');
    if (GENERATED_LANDING.has(name)) continue;
    try { statSync(resolve(srcDir, `${name}.js`)); continue; } catch {}
    entries[name] = resolve(srcDir, file);
  }
  return entries;
}

function discoverArticlePages() {
  const articleDir = resolve(ROOT, 'src/article');
  const entries = {};
  for (const file of readdirSync(articleDir)) {
    if (!file.endsWith('.html')) continue;
    entries[`article/${file.replace('.html', '')}`] = resolve(articleDir, file);
  }
  return entries;
}

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    reportCompressedSize: false,
    rollupOptions: {
      input: {
        main: resolve(ROOT, 'src/index.html'),
        haoka: resolve(ROOT, 'src/haoka.html'),
        wifi: resolve(ROOT, 'src/wifi.html'),
        wangpan: resolve(ROOT, 'src/wangpan.html'),
        huiyuan: resolve(ROOT, 'src/huiyuan.html'),
        gouwu: resolve(ROOT, 'src/gouwu.html'),
        about: resolve(ROOT, 'src/about.html'),
        ...discoverLandingPages(),
        ...discoverArticlePages(),
      },
    },
  },
  server: { open: true },
  plugins: [
    injectBuildDate(),
    seoPrerender(),
    cacheControlMeta(),
    generateSitemap(),
    generateLlms(),
    swHash(),
    verifyAssets(),
  ],
});
