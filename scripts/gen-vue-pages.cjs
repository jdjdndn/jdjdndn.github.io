// 生成 Vue 路由壳页：为每个 vue-router 路由生成独立 HTML（GitHub Pages 无 SPA fallback，每路由需真实文件）
// 模板基于 src/index.html（Vue SPA 入口），SEO meta 取自 src/router/index.js 的 route.meta
// 用法：node scripts/gen-vue-pages.cjs（build 前执行）
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const SITE = 'https://jdjdndn.github.io';

// ========== 从 router/index.js 解析路由 meta（正则，避免执行 ES module） ==========
function parseRouter() {
  const code = fs.readFileSync(path.join(SRC, 'router/index.js'), 'utf8');
  const routes = [];
  // 匹配 path + component + meta 块
  const pathRe = /path:\s*'([^']+)'[\s\S]*?component:\s*\(\)\s*=>\s*import\([^)]+\)[\s\S]*?meta:\s*\{([\s\S]*?)\n\s*\}/g;
  let m;
  while ((m = pathRe.exec(code)) !== null) {
    const p = m[1];
    const metaBlock = m[2];
    const get = (key) => {
      const km = metaBlock.match(new RegExp(`${key}:\\s*'([^']*)'`));
      return km ? km[1] : '';
    };
    // 跳过动态路由 /fuye/:slug.html（由 FuyePage 处理，不生成壳）
    if (p.includes(':')) continue;
    routes.push({
      path: p,
      file: p === '/' ? 'index.html' : p.replace(/^\//, '').replace(/\.html$/, '') + '.html',
      title: get('title'),
      description: get('description'),
      keywords: get('keywords'),
    });
  }
  return routes;
}

// ========== 生成单个壳页 ==========
function buildPage(route, isHome) {
  const url = isHome ? `${SITE}/` : `${SITE}/${route.file}`;
  const name = route.title.split('—')[0].trim() || route.title;
  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': isHome ? 'CollectionPage' : 'WebPage',
      name: route.title,
      description: route.description,
      url,
      isPartOf: { '@type': 'WebSite', '@id': `${SITE}/#website`, name: '券宝' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      name: '券宝',
      url: `${SITE}/`,
      description: '券宝优惠券聚合平台，汇聚全网热门优惠券，一站式省钱利器',
      inLanguage: 'zh-CN',
      potentialAction: {
        '@type': 'SearchAction',
        target: { '@type': 'EntryPoint', urlTemplate: `${SITE}/index.html?q={search_term_string}` },
        'query-input': 'required name=search_term_string',
      },
    },
  ];
  if (!isHome) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: '首页', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name, item: url },
      ],
    });
  }
  if (isHome) {
    jsonLd.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        { '@type': 'Question', name: '券宝是什么？', acceptedAnswer: { '@type': 'Answer', text: '券宝是一个一站式优惠券导航站，收录全网热门优惠活动，覆盖美团外卖、淘宝闪购、京东、拼多多、携程/同程/飞猪酒店旅行、滴滴出行、连锁餐饮、电影票、快递寄件等场景。复制口令码或点击链接即可跳转领取，每天更新。' } },
        { '@type': 'Question', name: '如何使用优惠口令码？', acceptedAnswer: { '@type': 'Answer', text: '两步即可领取：1) 在本站点击复制口令按钮复制口令码；2) 打开对应App（美团/淘宝/京东等），口令自动识别并跳转到领取页面。整个过程约10秒完成。' } },
        { '@type': 'Question', name: '本站收录了哪些平台的优惠？', acceptedAnswer: { '@type': 'Answer', text: '本站收录了美团外卖、淘宝闪购、京东、拼多多、携程旅行、同程旅行、飞猪出行、滴滴出行等主流平台的优惠活动，以及肯德基、瑞幸咖啡、星巴克等连锁餐饮品牌的优惠券。' } },
      ],
    });
  }

  const jsonLdHtml = jsonLd.map((d) => `    <script type="application/ld+json">\n${JSON.stringify(d, null, 2).replace(/\n/g, '\n    ')}\n    </script>`).join('\n\n');

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

    <!-- SEO 基础 -->
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <meta name="keywords" content="${route.keywords}" />
    <meta name="author" content="jdjdndn" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#FF6B35" />
    <meta name="application-name" content="券宝" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="color-scheme" content="light dark" />
    <link rel="canonical" href="${url}" />
    <link rel="alternate" hreflang="zh-CN" href="${url}" />
    <link rel="alternate" hreflang="x-default" href="${url}" />

    <!-- Open Graph -->
    <meta property="og:type" content="${isHome ? 'website' : 'website'}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:image" content="${SITE}/og-image.png" />
    <meta property="og:image:alt" content="${route.title}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:site_name" content="券宝" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23FF6B35' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z'/%3E%3C/svg%3E" />
    <link rel="apple-touch-icon" href="../icons/icon-192.png" />

    <!-- PWA -->
    <link rel="manifest" href="../manifest.json" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="优惠券" />

    <!-- JSON-LD 结构化数据 -->
${jsonLdHtml}

    <meta name="google" content="notranslate" />

    <link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="站点摘要（供 AI 阅读）" />

    <link rel="stylesheet" href="../shared.css" />
    <link rel="stylesheet" href="../vue-app.css" />
  </head>
  <body>
    <h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap">${route.title}</h1>
    <div id="app"></div>
    <noscript>
      <div style="text-align:center;padding:2rem;color:#333;max-width:800px;margin:0 auto;">
        <h2>券宝 — 一站式优惠券中心</h2>
        <p>本站聚合美团外卖红包、淘宝闪购券、京东优惠、携程/同程/飞猪酒店旅行券、滴滴出行券、连锁餐饮优惠、电影票折扣、快递寄件折扣等全网热门优惠。</p>
        <p>本站需要 JavaScript 才能正常显示完整优惠内容。请启用 JavaScript 后访问。</p>
        <p>完整优惠列表请查看 <a href="../llms-full.txt">llms-full.txt</a>，站点说明请查看 <a href="../llms.txt">llms.txt</a>。</p>
      </div>
    </noscript>
    <script type="module" src="../main.js"></script>
  </body>
</html>
`;
}

// ========== 主流程 ==========
function main() {
  const routes = parseRouter();
  console.log(`解析到 ${routes.length} 条路由`);
  let generated = 0;
  for (const route of routes) {
    // 首页壳已有 src/index.html（Vue SPA 入口），不再覆盖；生成其余路由壳
    if (route.path === '/') continue;
    // 输出到 templates 目录
    const out = path.join(SRC, 'templates', route.file);
    const html = buildPage(route, false);
    fs.writeFileSync(out, html, 'utf8');
    generated++;
    console.log(`  ✓ templates/${route.file} (${route.title})`);
  }
  console.log(`\n生成 ${generated} 个 Vue 路由壳页到 src/templates/`);
}

main();
