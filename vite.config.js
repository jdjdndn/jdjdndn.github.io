import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readdirSync, statSync, readFileSync, writeFileSync } from 'fs';
import vue from '@vitejs/plugin-vue';
import { ROOT, GENERATED_LANDING } from './scripts/vite-plugins/shared.js';

import injectBuildDate from './scripts/vite-plugins/inject-build-date.js';
import seoPrerender from './scripts/vite-plugins/seo-prerender.js';
import cacheControlMeta from './scripts/vite-plugins/cache-control-meta.js';
import generateSitemap from './scripts/vite-plugins/generate-sitemap.js';
import generateLlms from './scripts/vite-plugins/generate-llms.js';
import swHash from './scripts/vite-plugins/sw-hash.js';
import verifyAssets from './scripts/vite-plugins/verify-assets.js';
import Components from 'unplugin-vue-components/vite';

// ===== 递归扫描 src 目录下所有 HTML 页面 =====
function discoverAllPages() {
  const srcDir = resolve(ROOT, 'src');
  const entries = {};

  function scanDir(dir, prefix = '') {
    for (const file of readdirSync(dir)) {
      const fullPath = resolve(dir, file);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        // 跳过 common、templates 目录和以 _ 开头的目录
        if (file === 'common' || file === 'templates' || file.startsWith('_')) continue;
        scanDir(fullPath, prefix ? `${prefix}/${file}` : file);
      } else if (file.endsWith('.html')) {
        const name = file.replace('.html', '');
        // 跳过 llms 文件、_ 开头的模板文件、已生成的页面
        if (name.startsWith('llms') || name.startsWith('_')) continue;
        if (GENERATED_LANDING.has(name)) continue;
        const entryKey = prefix ? `${prefix}/${name}` : name;
        entries[entryKey] = fullPath;
      }
    }
  }

  scanDir(srcDir);
  return entries;
}

// ===== 扫描 templates 目录下的 HTML 页面（输出到 dist 根目录） =====
function discoverTemplatePages() {
  const templatesDir = resolve(ROOT, 'src/templates');
  const entries = {};

  // 检查 templates 目录是否存在
  try {
    for (const file of readdirSync(templatesDir)) {
      if (file.endsWith('.html')) {
        const name = file.replace('.html', '');
        // 跳过 _ 开头的模板文件
        if (name.startsWith('_')) continue;
        // 映射到根目录：templates/about.html → dist/about.html
        entries[name] = resolve(templatesDir, file);
      }
    }
  } catch (e) {
    // templates 目录不存在，忽略
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
        ...discoverAllPages(),
        ...discoverTemplatePages(),
      },
    },
  },
  server: { open: true },
  plugins: [
    vue(),
    Components({
      dts: false,
    }),
    injectBuildDate(),
    seoPrerender(),
    cacheControlMeta(),
    generateSitemap(),
    generateLlms(),
    swHash(),
    verifyAssets(),
  ],
});
