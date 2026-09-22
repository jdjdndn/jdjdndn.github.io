// 构建时生成 sitemap.xml（lastmod 用源文件真实修改时间，非统一构建日）
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { SITE_URL, ROOT, fileMtime, discoverSubPages, discoverArticlePages } from './shared.js';

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

      // 子页面：lastmod = 源 HTML 真实修改时间
      const subPageUrls = discoverSubPages().map((name) =>
        url(`${SITE_URL}/${encodeURI(name)}.html`, fileMtime(resolve(ROOT, `src/${name}.html`)), 'weekly', '0.8')
      ).join('');

      // 着陆页：内容由 src/landing-pages.js 配置生成 → lastmod = 配置修改时间
      const landingLastmod = fileMtime(resolve(ROOT, 'src/landing-pages.js'));
      const landingPages = ['meituan-waimai', 'meituan-jiuLv', 'taobao-shangou', 'jingdong-pdd', 'chengxie', 'didi', 'liansuocanyin'];
      const landingUrls = landingPages.map((name) =>
        url(`${SITE_URL}/${name}.html`, landingLastmod, 'weekly', '0.7')
      ).join('');

      // 文章页：lastmod = 文章源文件真实修改时间
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
