// SPA 优惠列表预渲染（真实导入 data.js，供爬虫/无 JS 环境读取）
import { resolve } from 'path';
import { loadTabs, buildPrerenderHTML, ROOT } from './shared.js';

export default function seoPrerenderPlugin() {
  return {
    name: 'seo-prerender',
    transformIndexHtml: {
      order: 'pre',
      async handler(html) {
        const tabs = await loadTabs();
        const staticHTML = buildPrerenderHTML(tabs);
        // 注入到 <main> 内部，SPA 启动后会被 JS 覆盖
        return html.replace(
          '<main id="tab-content" class="tab-content"></main>',
          `<main id="tab-content" class="tab-content">${staticHTML}</main>`,
        );
      },
    },
  };
}
