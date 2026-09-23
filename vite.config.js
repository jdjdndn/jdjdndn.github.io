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
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';

// ===== 递归扫描 src 目录下所有 HTML 页面 =====
function discoverAllPages() {
  const srcDir = resolve(ROOT, 'src');
  const entries = {};

  function scanDir(dir, prefix = '') {
    for (const file of readdirSync(dir)) {
      const fullPath = resolve(dir, file);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        // 跳过 common 目录和以 _ 开头的目录
        if (file === 'common' || file.startsWith('_')) continue;
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
        'index-vue': resolve(ROOT, 'src/index-vue.html'),
        ...discoverAllPages(),
      },
    },
  },
  server: { open: true },
  plugins: [
    // 开发时将页面路由重定向到 Vue SPA 入口
    {
      name: 'redirect-to-vue-spa',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // 需要重定向的页面路径
          const vuePages = [
            '/',
            '/index.html',
            '/haoka.html',
            '/huodong.html',
            '/huiyuan.html',
            '/wangpan.html',
            '/wifi.html',
            '/about.html',
            '/fuye.html',
            '/gouwu.html',
            '/privacy.html',
            '/qunliao.html',
            '/haoka-agent.html',
          ];

          // 检查是否是 Vue 页面路由
          const path = req.url.split('?')[0].split('#')[0];
          if (vuePages.includes(path)) {
            req.url = '/index-vue.html';
          }

          next();
        });
      }
    },
    vue(),
    // Naive UI 按需引入（模板中 n-* 组件自动导入，大幅减小主包体积）
    Components({
      resolvers: [NaiveUiResolver()],
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
