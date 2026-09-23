// 构建时生成 sitemap.xml（lastmod 用源文件真实修改时间，非统一构建日）
import { writeFileSync, readdirSync } from 'fs';
import { resolve } from 'path';
import { SITE_URL, ROOT, fileMtime, discoverArticlePages } from './shared.js';

// 不应进 sitemap 的内部/辅助页（404 防索引、common-page 是嵌入模板）
const EXCLUDED_ROOT = new Set(['404.html', 'common-page.html']);

export default function generateSitemapPlugin() {
  return {
    name: 'generate-sitemap',
    writeBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const url = (loc, lastmod, changefreq, priority) => `
  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;

      // 着陆页：内容由 src/templates/landing-pages.js 配置生成 → lastmod = 配置修改时间
      const landingLastmod = fileMtime(resolve(ROOT, 'src/templates/landing-pages.js'));
      const landingPages = ['meituan-waimai', 'meituan-jiuLv', 'taobao-shangou', 'jingdong-pdd', 'chengxie', 'didi', 'liansuocanyin'];
      const landingUrls = landingPages.map((name) =>
        url(`${SITE_URL}/${name}.html`, landingLastmod, 'weekly', '0.7')
      ).join('');

      // Vue 功能页：构建后扫描 dist 根（vite 多页输出），自动覆盖全部路由页
      const distRoot = resolve(ROOT, 'dist');
      const subPageUrls = readdirSync(distRoot)
        .filter((f) => f.endsWith('.html') && !EXCLUDED_ROOT.has(f) && !landingPages.includes(f.replace('.html', '')))
        .map((f) => {
          const name = f.replace('.html', '');
          return url(`${SITE_URL}/${encodeURI(name)}.html`, fileMtime(resolve(distRoot, f)), 'weekly', '0.8');
        }).join('');

      // 文章页：lastmod = 文章源文件真实修改时间（递归含 card/haowu 子目录）
      const articleUrls = Object.keys(discoverArticlePages()).map((name) =>
        url(`${SITE_URL}/article/${encodeURI(name.replace('article/', ''))}.html`, fileMtime(resolve(ROOT, `src/article/${name.replace('article/', '')}.html`)), 'monthly', '0.6')
      ).join('');

      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${url(`${SITE_URL}/`, today, 'weekly', '1.0')}
  ${url(`${SITE_URL}/llms.txt`, today, 'weekly', '0.6')}
  ${url(`${SITE_URL}/llms-full.txt`, today, 'weekly', '0.5')}${subPageUrls}${landingUrls}${articleUrls}
</urlset>`;
      writeFileSync(resolve(ROOT, 'dist/sitemap.xml'), sitemap, 'utf-8');
    },
  };
}
