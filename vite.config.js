import { defineConfig } from 'vite';
import { resolve } from 'path';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import compression from 'vite-plugin-compression';

// ========== 预渲染：从 data.js 提取优惠数据生成静态 HTML ==========
function extractBracketBlock(src, startIdx) {
  // 从 startIdx 处的 [ 开始，找到匹配的 ]（处理嵌套括号）
  let depth = 0;
  let inString = false;
  let stringChar = '';
  for (let i = startIdx; i < src.length; i++) {
    const ch = src[i];
    if (inString) {
      if (ch === stringChar && src[i - 1] !== '\\') inString = false;
    } else {
      if (ch === "'" || ch === '"') { inString = true; stringChar = ch; }
      else if (ch === '[') depth++;
      else if (ch === ']') { depth--; if (depth === 0) return src.slice(startIdx, i + 1); }
    }
  }
  return src.slice(startIdx);
}

function extractTabs(srcPath) {
  const src = readFileSync(srcPath, 'utf-8');
  const tabs = [];

  // 找到所有 tab 的 id: 'xxx' 位置作为边界
  const tabIdPattern = /\bid:\s*['"]([^'"]+)['"]/g;
  const tabStarts = [];
  let m;
  while ((m = tabIdPattern.exec(src)) !== null) {
    if (src.lastIndexOf('export const tabs', m.index) > 0 || tabStarts.length > 0) {
      tabStarts.push({ id: m[1], pos: m.index });
    }
  }

  for (let i = 0; i < tabStarts.length; i++) {
    const tabId = tabStarts[i].id;
    const start = tabStarts[i].pos;
    const end = i + 1 < tabStarts.length ? tabStarts[i + 1].pos : src.length;
    const tabBody = src.slice(start, end);

    const labelMatch = tabBody.match(/label:\s*['"]([^'"]+)['"]/);
    const tabLabel = labelMatch ? labelMatch[1] : tabId;

    const sections = [];
    // 用括号计数提取 sections 数组
    const secArrStart = tabBody.indexOf('sections:');
    if (secArrStart === -1) continue;
    const bracketStart = tabBody.indexOf('[', secArrStart);
    if (bracketStart === -1) continue;
    const sectionsBody = extractBracketBlock(tabBody, bracketStart);

    // 按 {title: 分割 sections（{ 和 title: 之间有换行和空格）
    const secParts = sectionsBody.split(/\{\s*title:/);
    for (let j = 1; j < secParts.length; j++) {
      const part = secParts[j];
      const titleMatch = part.match(/^\s*['"]([^'"]+)['"]/);
      if (!titleMatch) continue;
      const secTitle = titleMatch[1];

      // 用括号计数提取 items 数组
      const itemArrStart = part.indexOf('items:');
      if (itemArrStart === -1) continue;
      const itemBracketStart = part.indexOf('[', itemArrStart);
      if (itemBracketStart === -1) continue;
      const itemsBody = extractBracketBlock(part, itemBracketStart);

      const items = [];
      const itemPattern = /\{\s*name:\s*['"]([^'"]+)['"]/g;
      let itemMatch;
      while ((itemMatch = itemPattern.exec(itemsBody)) !== null) {
        const itemName = itemMatch[1];
        const rest = itemsBody.slice(itemMatch.index, itemMatch.index + 500);
        const dlMatch = rest.match(/deadline:\s*['"]([^'"]+)['"]/);
        items.push({ name: itemName, deadline: dlMatch ? dlMatch[1] : null });
      }
      if (items.length > 0) sections.push({ title: secTitle, items });
    }
    if (sections.length > 0) tabs.push({ id: tabId, label: tabLabel, sections });
  }
  return tabs;
}

function buildPrerenderHTML(tabs) {
  let html = '<div class="prerender" aria-hidden="true">';
  for (const tab of tabs) {
    html += `<section><h2>${tab.label}</h2>`;
    for (const sec of tab.sections) {
      html += `<div><h3>${sec.title}（${sec.items.length}）</h3><ul>`;
      for (const item of sec.items) {
        const dl = item.deadline ? ` <small>截止: ${item.deadline}</small>` : '';
        html += `<li>${item.name}${dl}</li>`;
      }
      html += '</ul></div>';
    }
    html += '</section>';
  }
  html += '</div>';
  return html;
}

// ========== 自动发现着陆页（无独立 JS 的非首页 HTML） ==========
function discoverLandingPages() {
  const landingDir = resolve(__dirname, 'src');
  const entries = {};
  try {
    for (const file of readdirSync(landingDir)) {
      if (!file.endsWith('.html') || file === 'index.html' || file.startsWith('llms')) continue;
      const name = file.replace('.html', '');
      // 有对应 JS 文件的是子页面，不是着陆页
      try {
        statSync(resolve(landingDir, `${name}.js`));
        continue;
      } catch {}
      entries[name] = resolve(landingDir, file);
    }
  } catch {}
  return entries;
}

// ========== 自动发现子页面（有独立 JS 模块的页面） ==========
function discoverSubPages() {
  const srcDir = resolve(__dirname, 'src');
  const pages = [];
  try {
    for (const file of readdirSync(srcDir)) {
      if (!file.endsWith('.html') || file === 'index.html' || file.startsWith('llms')) continue;
      const name = file.replace('.html', '');
      try {
        statSync(resolve(srcDir, `${name}.js`));
        pages.push(name);
      } catch {}
    }
  } catch {}
  return pages;
}

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  base: './',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        haoka: resolve(__dirname, 'src/haoka.html'),
        wifi: resolve(__dirname, 'src/wifi.html'),
        wangpan: resolve(__dirname, 'src/wangpan.html'),
        huiyuan: resolve(__dirname, 'src/huiyuan.html'),
        yangmao: resolve(__dirname, 'src/yangmao.html'),
        about: resolve(__dirname, 'src/about.html'),
        ...discoverLandingPages(),
      },
    },
  },
  server: {
    open: true,
  },
  plugins: [
    {
      name: 'inject-build-date',
      transformIndexHtml(html) {
        const today = new Date().toISOString().slice(0, 10);
        return html.replaceAll('__BUILD_DATE__', today);
      },
    },
    {
      name: 'seo-prerender',
      transformIndexHtml: {
        order: 'pre',
        handler(html) {
          const dataPath = resolve(__dirname, 'src/data.js');
          const tabs = extractTabs(dataPath);
          const staticHTML = buildPrerenderHTML(tabs);
          // 注入到 <main> 内部，SPA 启动后会被 JS 覆盖
          return html.replace(
            '<main id="tab-content" class="tab-content"></main>',
            `<main id="tab-content" class="tab-content">${staticHTML}</main>`,
          );
        },
      },
    },
    {
      name: 'seo-preload',
      transformIndexHtml(html) {
        // 在 </head> 前注入 preload，加速首屏渲染
        const preload = [
          '<link rel="preload" href="./shared.css" as="style" />',
          '<link rel="modulepreload" href="./app.js" />',
        ].join('\n    ');
        return html.replace('</head>', `    ${preload}\n  </head>`);
      },
    },
    {
      name: 'generate-sitemap',
      writeBundle() {
        const today = new Date().toISOString().slice(0, 10);

        // 子页面（haoka/wifi/wangpan/huiyuan 等）自动发现
        const subPages = discoverSubPages();
        const subPageUrls = subPages.map((name) => `
  <url>
    <loc>https://jdjdndn.github.io/${name}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('');

        // 着陆页（meituan-waimai 等 SEO 长尾页）自动发现
        const landingPages = discoverLandingPages();
        const landingUrls = Object.keys(landingPages).map((name) => `
  <url>
    <loc>https://jdjdndn.github.io/${name}.html</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('');

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://jdjdndn.github.io/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://jdjdndn.github.io/llms.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://jdjdndn.github.io/llms-full.txt</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>${subPageUrls}${landingUrls}
</urlset>`;
        writeFileSync(resolve(__dirname, 'dist/sitemap.xml'), sitemap, 'utf-8');
      },
    },
    compression({ algorithm: 'gzip' }),
    compression({ algorithm: 'brotliCompress' }),
  ],
});
