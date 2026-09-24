#!/usr/bin/env node
/**
 * 文章页批量优化脚本（样式提取 + SEO + GEO）
 *
 * 1. 样式：将 866 篇共享同构内联样式提取为 src/article-shared.css，
 *    页面内替换为 <link rel="stylesheet"> + 品牌色 :root 覆盖（article/index.html 独立设计保留内联）
 * 2. SEO：dateModified 硬编码 → __BUILD_DATE__；canonical/og:url/JSON-LD url 相对 → 绝对；
 *    og:image 相对 → 绝对；补 og:image:alt / og:image:width / og:image:height
 * 3. GEO：补 notranslate meta 与 llms.txt alternate link
 *
 * 用法：node scripts/optimize-articles.cjs [--dry-run]
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ARTICLE_DIR = path.resolve(__dirname, '../src/article');
const SHARED_CSS = path.resolve(__dirname, '../src/article-shared.css');
const SITE = 'https://jdjdndn.github.io';
const DRY_RUN = process.argv.includes('--dry-run');

const BASE_COLOR = '#FF6B35';

// 基准样式（来自 606 篇 #FF6B35 页面），转换为 var 驱动后作为共享样式
const BASE_STYLE = `:root{--primary:#FF6B35;--primary2:#FF6B35;--dark:#FF6B35;--ink:#1a2233;--sub:#5b6472;--line:#e6ecf5;--bg:#f4f7fc;--card:#ffffff;}
*{box-sizing:border-box;margin:0;padding:0;}
friend-links{margin: 0 auto;}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;background:var(--bg);color:var(--ink);line-height:1.8;-webkit-font-smoothing:antialiased;}
.wrap{max-width:760px;margin:0 auto;padding:0 16px 48px;}
.hero{background:linear-gradient(135deg,var(--dark) 0%,var(--primary) 55%,var(--primary2) 100%);border-radius:0 0 22px 22px;padding:36px max(22px, calc(50% - 400px)) 28px;color:#fff;box-shadow:0 8px 22px #FF6B3540;}
.hero .tag{display:inline-block;background:rgba(255,255,255,.18);border:1px solid rgba(255,255,255,.35);color:#fff;font-size:12px;font-weight:700;padding:4px 12px;border-radius:999px;letter-spacing:.5px;}
.hero h1{font-size:26px;line-height:1.35;margin:14px 0 8px;font-weight:800;color:#fff;}
.hero p.lead{font-size:15px;color:rgba(255,255,255,.85);}
.deadline{margin:14px 0 0;background:rgba(255,255,255,.15);border:1.5px dashed rgba(255,255,255,.4);color:#fff;font-size:14px;font-weight:600;padding:9px 12px;border-radius:10px;display:inline-block;}
.card{background:var(--card);border:1px solid var(--line);border-radius:16px;padding:20px 18px;margin:18px 0;box-shadow:0 2px 10px #FF6B3515;}
h2{font-size:19px;margin:4px 0 12px;padding-left:10px;border-left:4px solid var(--primary);line-height:1.4;}
h3{font-size:16px;margin:14px 0 6px;color:var(--dark);}
p{font-size:15px;color:#2b3444;margin:8px 0;}
ul{margin:10px 0;padding-left:20px;}
li{font-size:15px;color:#2b3444;margin:6px 0;}
.cta{background:linear-gradient(135deg,var(--primary),var(--primary2));color:#fff;text-align:center;padding:22px 18px;border-radius:12px;margin:16px 0;}
.cta a{color:#fff;font-size:18px;font-weight:700;text-decoration:none;display:block;}
.grid2{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:10px 0;}
.mini{background:#FF6B3510;border-radius:10px;padding:10px 12px;font-size:13.5px;color:#2b3444;}
.mini b{color:var(--primary);}
.faq h3{margin-top:16px;}
.faq h3::before{content:"Q";display:inline-block;background:var(--primary);color:#fff;width:22px;height:22px;line-height:22px;text-align:center;border-radius:6px;font-size:13px;margin-right:8px;font-weight:800;}
.faq p{padding-left:30px;}
.disc{font-size:12.5px;color:#64748b;background:#f1f5f9;border-radius:10px;padding:10px 12px;margin-top:12px;}
.footer{text-align:center;color:#94a3b8;border-top:1px dashed var(--line);margin-top:24px;padding-top:16px;font-size:12.5px;}
@media(max-width:480px){.hero h1{font-size:22px;}.grid2{grid-template-columns:1fr;}}`;

// 将 3 处硬编码品牌色改为 var 驱动（color-mix），使 :root 覆盖对全站生效
function buildSharedCss() {
  return BASE_STYLE
    .replace('box-shadow:0 8px 22px #FF6B3540;', 'box-shadow:0 8px 22px color-mix(in srgb, var(--primary) 25%, transparent);')
    .replace('box-shadow:0 2px 10px #FF6B3515;', 'box-shadow:0 2px 10px color-mix(in srgb, var(--primary) 6%, transparent);')
    .replace('background:#FF6B3510;', 'background:color-mix(in srgb, var(--primary) 6%, transparent);');
}

// 美化共享 CSS（按花括号深度缩进，便于维护）
function prettifyCss(css) {
  let depth = 0;
  let out = '';
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '{') {
      out += ' {\n' + '  '.repeat(depth + 1);
      depth++;
    } else if (ch === '}') {
      depth = Math.max(0, depth - 1);
      out = out.replace(/[ \t]+\n/g, '\n').replace(/\s+$/, '');
      out += '\n' + '  '.repeat(depth) + '}\n' + '  '.repeat(depth);
    } else if (ch === ';') {
      out += ';\n' + '  '.repeat(depth);
    } else {
      out += ch;
    }
  }
  return out.replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function writeSharedCss() {
  const css = prettifyCss(buildSharedCss());
  if (DRY_RUN) {
    console.log(`[dry-run] 将写入 src/article-shared.css (${css.length} 字节)`);
    return;
  }
  fs.writeFileSync(SHARED_CSS, css, 'utf-8');
  console.log(`✅ src/article-shared.css 已生成 (${css.length} 字节)`);
}

// 从内联样式提取 --primary 品牌色（大写规范化）
function extractBrandColor(style) {
  const m = style.match(/:root\{--primary:\s*([^;]+);/);
  if (!m) return null;
  return m[1].trim().toUpperCase();
}

function processArticle(fileName, subDir = '') {
  const filePath = path.join(ARTICLE_DIR, subDir, fileName);
  let html = fs.readFileSync(filePath, 'utf-8');
  const absUrl = subDir
    ? `${SITE}/article/${subDir}/${encodeURI(fileName)}`
    : `${SITE}/article/${encodeURI(fileName)}`;
  const absOgp = `${SITE}/og-image.png`;
  const stats = { style: 0, date: 0, url: 0, og: 0, geo: 0 };

  // ---- 1. 样式提取（排除独立设计的 article/index.html）----
  if (fileName !== 'index.html') {
    // 幂等：已有 article-shared.css 链接则跳过，避免重复运行导致多次注入
    if (!html.includes('article-shared.css')) {
      const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
      if (styleMatch) {
        const style = styleMatch[1];
        const brand = extractBrandColor(style);
        let replacement = `<link rel="stylesheet" href="../article-shared.css" />`;
        // 品牌色非默认时，保留 :root 覆盖（颜色随页面差异）
        if (brand && brand !== BASE_COLOR) {
          replacement += `\n    <style>:root{--primary:${brand};--primary2:${brand};--dark:${brand};}</style>`;
        }
        if (html.includes(styleMatch[0])) {
          html = html.replace(styleMatch[0], replacement);
          stats.style++;
        }
      }
    }
  }

  // ---- 2. SEO: 日期 ----
  const dateRe = /("dateModified"\s*:\s*")(?!__BUILD_DATE__)(\d{4}-\d{2}-\d{2})(")/g;
  let d;
  while ((d = dateRe.exec(html)) !== null) { stats.date++; }
  html = html.replace(dateRe, '$1__BUILD_DATE__$3');

  // ---- 3. SEO: 相对 URL → 绝对 ----
  // canonical
  const canRe = /(<link rel="canonical" href=")[^"]*(")/;
  if (canRe.test(html)) {
    html = html.replace(canRe, `$1${absUrl}$2`);
    stats.url++;
  }
  // og:url
  const ogUrlRe = /(<meta property="og:url" content=")[^"]*(")/;
  if (ogUrlRe.test(html)) {
    html = html.replace(ogUrlRe, `$1${absUrl}$2`);
  }
  // og:image / twitter:image 相对路径
  const imgRe = /(<meta property="og:image" content=")\.\.\/og-image\.png(")/;
  if (imgRe.test(html)) {
    html = html.replace(imgRe, `$1${absOgp}$2`);
    stats.url++;
  }
  const twImgRe = /(<meta name="twitter:image" content=")\.\.\/og-image\.png(")/;
  if (twImgRe.test(html)) {
    html = html.replace(twImgRe, `$1${absOgp}$2`);
  }
  // JSON-LD url / mainEntityOfPage @id / BreadcrumbList item
  html = html.replace(/("url"\s*:\s*")\.\/[^"]*\.html(")/g, `$1${absUrl}$2`);
  html = html.replace(/("@id"\s*:\s*")\.\/[^"]*\.html(")/g, `$1${absUrl}$2`);
  html = html.replace(/"item"\s*:\s*"\.\.\/"/g, `"item": "${SITE}/"`);
  html = html.replace(/"item"\s*:\s*"\.\/"/g, `"item": "${SITE}/article/"`);
  html = html.replace(/"item"\s*:\s*"\.\/[^"]*\.html"/g, `"item": "${absUrl}"`);

  // ---- 4. OG 补充：alt / width / height ----
  if (!html.includes('og:image:alt') && html.includes('property="og:image"')) {
    const title = html.match(/<title>([^<]*)<\/title>/)?.[1] || '';
    html = html.replace(
      /(<meta property="og:image"[^>]*>)/,
      `$1\n<meta property="og:image:alt" content="${title}">\n<meta property="og:image:width" content="1200">\n<meta property="og:image:height" content="630">`,
    );
    stats.og++;
  }

  // ---- 5. GEO: notranslate + llms.txt ----
  if (!html.includes('notranslate')) {
    html = html.replace(
      /(<meta name="viewport"[^>]*>)/,
      `$1\n<meta name="google" content="notranslate">`,
    );
    stats.geo++;
  }
  if (!html.includes('llms.txt')) {
    html = html.replace(
      /(<link rel="canonical"[^>]*>)/,
      `$1\n<link rel="alternate" type="text/plain" href="${SITE}/llms.txt" title="站点摘要（供 AI 阅读）">`,
    );
    stats.geo++;
  }

  const total = stats.style + stats.date + stats.url + stats.og + stats.geo;
  if (total > 0) {
    if (!DRY_RUN) fs.writeFileSync(filePath, html, 'utf-8');
    return { file: fileName, ...stats, total };
  }
  return null;
}

// ========== 第二阶段：GEO/SEO 增强（hreflang / twitter / speakable / FAQPage） ==========

// 从 .faq 区块解析 Q/A 对生成 FAQPage JSON-LD
function buildFaqJsonLd(html) {
  const m = html.match(/<div class="faq">([\s\S]*?)<\/div>/);
  if (!m) return null;
  const pairs = [];
  const re = /<h3>\s*Q[：:]\s*([^<]+?)<\/h3>\s*<p>\s*A[：:]\s*([^<]+?)<\/p>/g;
  let x;
  while ((x = re.exec(m[1])) !== null) {
    pairs.push({ q: x[1].trim(), a: x[2].trim() });
  }
  if (!pairs.length) return null;
  const items = pairs.map((p, i) => ({
    '@type': 'Question',
    name: p.q,
    acceptedAnswer: { '@type': 'Answer', text: p.a },
  }));
  return `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".faq h3", ".faq p"] },
  "mainEntity": ${JSON.stringify(items, null, 2).replace(/\n/g, '\n  ')}
}
</script>`;
}

function enhanceArticle(fileName, subDir = '') {
  const filePath = path.join(ARTICLE_DIR, subDir, fileName);
  let html = fs.readFileSync(filePath, 'utf-8');
  const absUrl = subDir
    ? `${SITE}/article/${subDir}/${encodeURI(fileName)}`
    : `${SITE}/article/${encodeURI(fileName)}`;
  const absOgp = `${SITE}/og-image.png`;
  let changed = false;

  // ---- hreflang zh-CN + x-default ----
  if (!html.includes('hreflang')) {
    const canRe = /(<link rel="canonical"[^>]*>)/;
    if (canRe.test(html)) {
      html = html.replace(
        canRe,
        `$1\n<link rel="alternate" hreflang="zh-CN" href="${absUrl}" />\n<link rel="alternate" hreflang="x-default" href="${absUrl}" />`,
      );
      changed = true;
    }
  }

  // ---- twitter:card + twitter:image ----
  if (!html.includes('twitter:card')) {
    html = html.replace(
      /(<meta name="viewport"[^>]*>)/,
      `$1\n<meta name="twitter:card" content="summary_large_image" />\n<meta name="twitter:image" content="${absOgp}" />`,
    );
    changed = true;
  } else if (!html.includes('twitter:image')) {
    html = html.replace(
      /(<meta name="twitter:card"[^>]*>)/,
      `$1\n<meta name="twitter:image" content="${absOgp}" />`,
    );
    changed = true;
  }

  // ---- Article JSON-LD 增加 speakable ----
  if (html.includes('"@type": "Article"') && !html.includes('speakable')) {
    html = html.replace(
      /("@type": "Article",\r?\n)/,
      `$1  "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".hero h1", ".hero p"] },\n`,
    );
    changed = true;
  }

  // ---- FAQPage JSON-LD（有 .faq 区块且未添加时生成） ----
  if (html.includes('class="faq"') && !html.includes('"@type": "FAQPage"')) {
    const faqJsonLd = buildFaqJsonLd(html);
    if (faqJsonLd) {
      html = html.replace(/<\/head>/, `  ${faqJsonLd}\n  </head>`);
      changed = true;
    }
  }

  // ---- 已有 FAQPage JSON-LD 补 speakable（历史生成的页面） ----
  if (html.includes('"@type": "FAQPage"')) {
    // 检查最后一个 "FAQPage" 之后是否已有 speakable（新生成的都是最后一块）
    const afterFaq = html.split('FAQPage').pop() || '';
    if (!afterFaq.includes('speakable')) {
      html = html.replace(
        /("@type": "FAQPage",\r?\n)/,
        `$1  "speakable": { "@type": "SpeakableSpecification", "cssSelector": [".faq h3", ".faq p"] },\n`,
      );
      changed = true;
    }
  }

  // ---- article/index.html（独立设计的列表页）：补基础 JSON-LD ----
  if (fileName === 'index.html' && !html.includes('application/ld+json')) {
    const heroTitle = html.match(/<title>([^<]*)<\/title>/)?.[1] || '省钱攻略';
    const jsonLd = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "${heroTitle.replace(/"/g, '&quot;')}",
  "url": "${absUrl}",
  "isPartOf": { "@type": "WebSite", "@id": "${SITE}/#website" }
}
</script>`;
    html = html.replace(/<\/head>/, `  ${jsonLd}\n  </head>`);
    changed = true;
  }

  if (changed && !DRY_RUN) fs.writeFileSync(filePath, html, 'utf-8');
  return changed ? { file: fileName } : null;
}

// 递归收集文章文件
function collectArticleFiles(dir, subDir = '') {
  const files = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      // 递归处理子目录
      const subFiles = collectArticleFiles(
        path.join(dir, entry.name),
        subDir ? `${subDir}/${entry.name}` : entry.name
      );
      files.push(...subFiles);
    } else if (entry.name.endsWith('.html')) {
      files.push({ name: entry.name, subDir });
    }
  }

  return files;
}

function main() {
  console.log(`🔧 文章页批量优化 ${DRY_RUN ? '(dry-run)' : ''}`);
  writeSharedCss();

  // 递归收集所有文章文件（包括子目录）
  const allFiles = collectArticleFiles(ARTICLE_DIR);
  const results = [];
  for (const { name, subDir } of allFiles) {
    const r = processArticle(name, subDir);
    if (r) results.push(r);
  }
  const sum = (k) => results.reduce((a, r) => a + (r[k] || 0), 0);
  console.log(`\n📄 处理 ${allFiles.length} 篇文章`);
  console.log(`  样式提取: ${sum('style')} 页`);
  console.log(`  日期替换: ${sum('date')} 处`);
  console.log(`  URL 绝对化: ${sum('url')} 处`);
  console.log(`  OG 补充: ${sum('og')} 页`);
  console.log(`  GEO 补充: ${sum('geo')} 处`);

  // 第二阶段：GEO/SEO 增强
  console.log(`\n🔍 GEO/SEO 增强（hreflang/twitter/speakable/FAQPage）`);
  const enhanced = [];
  for (const { name, subDir } of allFiles) {
    const r = enhanceArticle(name, subDir);
    if (r) enhanced.push(r);
  }
  console.log(`  增强: ${enhanced.length} 页`);
  console.log(`  共修改: ${results.length + enhanced.length} 次`);
  if (DRY_RUN) console.log('（dry-run 模式，未写入）');
}

main();
