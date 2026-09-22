// 构建插件共享工具：路径、站点常量、页面发现、数据加载（真实 ESM 导入）
import { resolve, dirname, basename } from 'path';
import { readFileSync, readdirSync, statSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';

export const ROOT = resolve(fileURLToPath(new URL('../../', import.meta.url)));
export const SITE_URL = 'https://jdjdndn.github.io';

// 着陆页由 scripts/gen-landing-pages.cjs 从 src/landing-pages.js 生成，
// 即使 src 下出现同名手写文件也一律排除（单一事实源）
export const GENERATED_LANDING = new Set([
  'meituan-waimai', 'meituan-jiuLv', 'taobao-shangou',
  'jingdong-pdd', 'chengxie', 'didi', 'liansuocanyin',
]);

export function fileMtime(p) {
  try { return statSync(p).mtime.toISOString().slice(0, 10); }
  catch { return new Date().toISOString().slice(0, 10); }
}

// ===== 页面发现 =====
export function discoverLandingPages() {
  const dir = resolve(ROOT, 'src');
  const entries = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.html') || file === 'index.html' || file.startsWith('llms')) continue;
    const name = file.replace('.html', '');
    if (GENERATED_LANDING.has(name)) continue;
    try { statSync(resolve(dir, `${name}.js`)); continue; } catch {}
    entries[name] = resolve(dir, file);
  }
  return entries;
}

export function discoverArticlePages() {
  const dir = resolve(ROOT, 'src/article');
  const entries = {};
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.html')) continue;
    const name = file.replace('.html', '');
    entries[`article/${name}`] = resolve(dir, file);
  }
  return entries;
}

export function discoverSubPages() {
  const dir = resolve(ROOT, 'src');
  const pages = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith('.html') || file === 'index.html' || file.startsWith('llms')) continue;
    const name = file.replace('.html', '');
    try { statSync(resolve(dir, `${name}.js`)); pages.push(name); } catch {}
  }
  return pages;
}

// ===== 数据加载（真实 ESM 导入，替代文本正则解析） =====
export async function loadTabs() {
  const mod = await import(pathToFileURL(resolve(ROOT, 'src/data.js')).href);
  return mod.tabs || [];
}

export async function loadLandingSlugs() {
  const mod = await import(pathToFileURL(resolve(ROOT, 'src/landing-pages.js')).href);
  return (mod.landingPages || []).map(p => p.slug);
}

// ===== 页面 title（供 llms 生成） =====
export function readPageTitle(filePath, fallback) {
  try {
    const content = readFileSync(filePath, 'utf-8');
    const m = content.match(/<title>([^<]*)<\/title>/);
    if (m && m[1].trim()) return m[1].trim().replace(/—.*$/, '').trim();
    return fallback;
  } catch { return fallback; }
}

// ===== SPA 预渲染 HTML =====
export function buildPrerenderHTML(tabs) {
  let html = '<div class="prerender" aria-hidden="true">';
  for (const tab of tabs) {
    html += `<section><h2>${tab.label}</h2>`;
    for (const sec of tab.sections || []) {
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

export { dirname, basename };
