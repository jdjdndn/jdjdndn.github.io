// ============================================================
//  着陆页生成脚本
//  从 src/landing-pages.js 读取配置，生成静态 HTML 到 dist/ 目录
//  在 vite build 后运行，绕过 Vite 直接输出（纯静态 HTML，无需打包）
// ============================================================

const fs = require('fs');
const path = require('path');

const LANDING_PAGES_CONFIG = path.resolve(__dirname, '../src/landing-pages.js');
const DIST_DIR = path.resolve(__dirname, '../dist');
const BUILD_DATE = new Date().toISOString().slice(0, 10);

// 解析 landing-pages.js 中的配置（文本解析，避免 ES module 问题）
function parseConfig(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const pages = [];

  // 先提取所有 slug 位置，用于界定每个页面的搜索范围
  const slugPositions = [];
  const slugPattern = /slug:\s*'([^']+)'/g;
  let slugMatch;
  while ((slugMatch = slugPattern.exec(content)) !== null) {
    slugPositions.push({ slug: slugMatch[1], pos: slugMatch.index });
  }

  // 匹配每个页面配置块
  const pagePattern = /\{[^}]*slug:\s*'([^']+)'[^}]*\}/gs;
  let match;
  while ((match = pagePattern.exec(content)) !== null) {
    const block = match[0];
    const get = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*'([^']*)'`));
      return m ? m[1] : '';
    };
    const getList = (key) => {
      const m = block.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`));
      if (!m) return [];
      const items = [];
      const itemPattern = /\{\s*label:\s*'([^']*)',\s*url:\s*'([^']*)'\s*\}/g;
      let itemMatch;
      while ((itemMatch = itemPattern.exec(m[1])) !== null) {
        items.push({ label: itemMatch[1], url: itemMatch[2] });
      }
      return items;
    };

    // 解析 faq 数组（从 slug 位置向后搜索到下一个页面的 slug 或数组末尾）
    const faq = [];
    const currentSlugIdx = slugPositions.findIndex(sp => sp.pos >= match.index);
    const nextSlugPos = currentSlugIdx + 1 < slugPositions.length
      ? slugPositions[currentSlugIdx + 1].pos
      : content.length;
    const searchRegion = content.slice(match.index, nextSlugPos);
    const faqArrMatch = searchRegion.match(/faq:\s*\[([\s\S]*?)\]\s*,?\s*\n/);
    if (faqArrMatch) {
      const faqItemPattern = /\{\s*q:\s*'([^']*)',\s*a:\s*'([^']*)'\s*\}/g;
      let faqMatch;
      while ((faqMatch = faqItemPattern.exec(faqArrMatch[1])) !== null) {
        faq.push({ q: faqMatch[1], a: faqMatch[2] });
      }
    }

    pages.push({
      slug: get('slug'),
      title: get('title'),
      description: get('description'),
      keywords: get('keywords'),
      heroTitle: get('heroTitle'),
      heroDesc: get('heroDesc'),
      tabId: get('tabId'),
      sectionFilter: get('sectionFilter'),
      relatedPages: getList('relatedPages'),
      faq,
    });
  }
  return pages;
}

function generateHTML(page) {
  // 转义助手：JSON 字符串转义 / HTML 属性转义 / HTML 文本转义
  const jsonStr = (v) => JSON.stringify(String(v == null ? '' : v));
  const escAttr = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const escHtml = (v) => String(v == null ? '' : v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const relatedLinks = page.relatedPages
    .map((r) => `<a href="${escAttr(r.url)}" class="related-link">${escHtml(r.label)}</a>`)
    .join('\n        ');

  // FAQPage JSON-LD 数据（统一 JSON.stringify 转义）
  const faqItemsJson = page.faq.length
    ? JSON.stringify(page.faq.map((item) => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })), null, 2).split('\n').map((l) => '        ' + l).join('\n')
    : '';

  return `<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

    <!-- SEO -->
    <title>${escHtml(page.title)}</title>
    <meta name="description" content="${escAttr(page.description)}" />
    <meta name="keywords" content="${escAttr(page.keywords)}" />
    <meta name="author" content="jdjdndn" />
    <meta name="robots" content="index, follow" />
    <meta name="theme-color" content="#FF6B35" />
    <link rel="canonical" href="https://jdjdndn.github.io/${page.slug}.html" />
    <link rel="alternate" hreflang="zh-CN" href="https://jdjdndn.github.io/${page.slug}.html" />
    <link rel="alternate" hreflang="x-default" href="https://jdjdndn.github.io/" />
    <link rel="alternate" type="text/plain" href="https://jdjdndn.github.io/llms.txt" title="站点摘要（供 AI 阅读）" />
    <meta name="google" content="notranslate" />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://jdjdndn.github.io/${page.slug}.html" />
    <meta property="og:title" content="${escAttr(page.title)}" />
    <meta property="og:description" content="${escAttr(page.description)}" />
    <meta property="og:image" content="https://jdjdndn.github.io/og-image.png" />
    <meta property="og:image:alt" content="${escAttr(page.heroTitle)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:locale" content="zh_CN" />
    <meta property="og:site_name" content="优惠活动聚合" />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escAttr(page.title)}" />
    <meta name="twitter:description" content="${escAttr(page.description)}" />
    <meta name="twitter:image" content="https://jdjdndn.github.io/og-image.png" />

    <!-- JSON-LD 结构化数据 -->
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": ${jsonStr(page.heroTitle)},
      "description": ${jsonStr(page.description)},
      "datePublished": "2026-09-16",
      "dateModified": "__BUILD_DATE__",
      "url": "https://jdjdndn.github.io/${page.slug}.html",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://jdjdndn.github.io/#website",
        "name": "优惠活动聚合"
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".hero h1", ".hero p"]
      }
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "首页", "item": "https://jdjdndn.github.io/" },
        { "@type": "ListItem", "position": 2, "name": ${jsonStr(page.heroTitle.replace(/^[^\s]+\s/, ''))}, "item": "https://jdjdndn.github.io/${page.slug}.html" }
      ]
    }
    </script>

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "name": ${jsonStr(page.heroTitle)},
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://jdjdndn.github.io/#website"
      },
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".hero h1", ".hero p"]
      }
    }
    </script>
${page.faq.length > 0 ? `
    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": [".faq-question", ".faq-answer"]
      },
      "mainEntity": [
${faqItemsJson}
      ]
    }
    </script>
` : ''}
    <style>
      :root {
        --bg: #f5f3f0; --card: #ffffff; --text: #1a1a2e; --muted: #6b7280;
        --primary: #FF6B35; --border: #e8e5e1; --radius: 12px;
      }
      * { box-sizing: border-box; margin: 0; padding: 0; }
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
        color: var(--text); background: var(--bg); line-height: 1.6;
        padding: 0 16px 80px;
      }
      .container { max-width: 800px; margin: 0 auto; padding-top: 24px; }

      /* Hero */
      .hero {
        background: linear-gradient(135deg, #FF6B35 0%, #FF8F65 100%);
        color: #fff; border-radius: var(--radius); padding: 32px 24px;
        text-align: center; margin-bottom: 24px;
      }
      .hero h1 { font-size: 28px; font-weight: 800; margin-bottom: 8px; }
      .hero p { font-size: 16px; opacity: 0.9; }

      /* 面包屑 */
      .breadcrumb { font-size: 13px; color: var(--muted); margin-bottom: 16px; }
      .breadcrumb a { color: var(--primary); text-decoration: none; }

      /* 导引卡片 */
      .guide-card {
        background: var(--card); border: 1px solid var(--border);
        border-radius: var(--radius); padding: 20px; margin-bottom: 16px;
      }
      .guide-card h2 { font-size: 18px; font-weight: 700; margin-bottom: 12px; color: var(--primary); }
      .guide-steps { list-style: none; counter-reset: step; }
      .guide-steps li {
        counter-increment: step; padding: 12px 0; border-bottom: 1px solid var(--border);
        display: flex; align-items: flex-start; gap: 12px;
      }
      .guide-steps li:last-child { border-bottom: none; }
      .guide-steps li::before {
        content: counter(step); background: var(--primary); color: #fff;
        width: 28px; height: 28px; border-radius: 50%; display: flex;
        align-items: center; justify-content: center; font-weight: 700;
        font-size: 14px; flex-shrink: 0;
      }

      /* 相关链接 */
      .related-section { margin-top: 24px; }
      .related-section h2 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
      .related-links { display: flex; gap: 12px; flex-wrap: wrap; }
      .related-link {
        display: inline-block; padding: 10px 20px; background: var(--card);
        border: 1px solid var(--border); border-radius: var(--radius);
        color: var(--primary); text-decoration: none; font-weight: 600;
        transition: all 0.2s;
      }
      .related-link:hover { border-color: var(--primary); box-shadow: 0 2px 12px rgba(255,107,53,0.12); }

      /* CTA */
      .cta-box {
        background: linear-gradient(135deg, #FF6B35 0%, #FF8F65 100%);
        border-radius: var(--radius); padding: 24px; text-align: center;
        margin-top: 24px; color: #fff;
      }
      .cta-box a {
        display: inline-block; margin-top: 12px; padding: 12px 32px;
        background: #fff; color: var(--primary); border-radius: 8px;
        text-decoration: none; font-weight: 700; font-size: 16px;
      }

      /* Footer */
      .page-footer {
        text-align: center; padding: 24px 0; font-size: 13px; color: var(--muted);
        border-top: 1px solid var(--border); margin-top: 32px;
      }
      .page-footer a { color: var(--primary); text-decoration: none; }

      /* FAQ */
      .faq-section { margin-top: 24px; }
      .faq-section h2 { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
      .faq-item { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); margin-bottom: 12px; overflow: hidden; }
      .faq-question {
        width: 100%; padding: 16px 20px; background: none; border: none; cursor: pointer;
        font-size: 15px; font-weight: 600; color: var(--text); text-align: left;
        display: flex; justify-content: space-between; align-items: center;
      }
      .faq-question::after { content: '+'; font-size: 20px; color: var(--primary); transition: transform 0.2s; }
      .faq-question[aria-expanded="true"]::after { transform: rotate(45deg); }
      .faq-answer { padding: 0 20px 16px; font-size: 14px; color: var(--muted); line-height: 1.7; display: none; }
      .faq-question[aria-expanded="true"] + .faq-answer { display: block; }

      @media (prefers-color-scheme: dark) {
        :root { --bg: #1a1a2e; --card: #16213e; --text: #e0e0e0; --muted: #9ca3af; --border: #2d3748; }
        .hero { background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%); }
        .related-link { background: var(--card); color: var(--primary); }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <nav class="breadcrumb">
        <a href="./index.html">首页</a> &gt; ${escHtml(page.heroTitle)}
      </nav>

      <div class="hero">
        <h1>${escHtml(page.heroTitle)}</h1>
        <p>${escHtml(page.heroDesc)}</p>
      </div>

      <div class="guide-card">
        <h2>📋 领取步骤</h2>
        <ol class="guide-steps">
          <li><div><strong>复制口令码</strong> — 在本站找到想要的优惠，点击"复制口令"按钮</div></li>
          <li><div><strong>打开App</strong> — 打开对应的App（美团/淘宝/京东等），口令码会自动识别</div></li>
          <li><div><strong>领取优惠</strong> — 在活动页面领取红包或优惠券，下单时自动抵扣</div></li>
        </ol>
      </div>

      <div class="cta-box">
        <p>查看更多优惠活动</p>
        <a href="./index.html">浏览全部优惠 →</a>
      </div>
${page.faq.length > 0 ? `
      <section class="faq-section" itemscope itemtype="https://schema.org/FAQPage">
        <h2>常见问题</h2>
${page.faq.map((item, i) => `        <div class="faq-item" itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
          <button class="faq-question" aria-expanded="false" itemprop="name">${escHtml(item.q)}</button>
          <div class="faq-answer" itemscope itemprop="acceptedEntity" itemtype="https://schema.org/Answer">
            <p itemprop="text">${escHtml(item.a)}</p>
          </div>
        </div>`).join('\n')}
      </section>

      <script>
        document.querySelectorAll('.faq-question').forEach(btn => {
          btn.addEventListener('click', () => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            btn.setAttribute('aria-expanded', String(!expanded));
          });
        });
      </script>
` : ''}
      <div class="related-section">
        <h2>相关页面</h2>
        <div class="related-links">
          ${relatedLinks}
        </div>
      </div>

      <footer class="page-footer">
        <p>本站为优惠信息聚合平台，非官方平台。优惠信息仅供参考，以各平台实际页面为准。</p>
        <p><a href="./index.html">返回首页</a> · <a href="./about.html">关于我们</a></p>
      </footer>
    </div>
  </body>
</html>`;
}

function main() {
  const pages = parseConfig(LANDING_PAGES_CONFIG);
  let generated = 0;

  for (const page of pages) {
    let html = generateHTML(page);
    // 注入构建日期
    html = html.replace(/__BUILD_DATE__/g, BUILD_DATE);
    const outPath = path.join(DIST_DIR, `${page.slug}.html`);
    fs.writeFileSync(outPath, html, 'utf-8');
    generated++;
    console.log(`  ✓ ${page.slug}.html`);
  }

  console.log(`\n生成 ${generated} 个着陆页（GitHub Pages 已自动 gzip，不再输出预压缩副本）`);
}

main();
