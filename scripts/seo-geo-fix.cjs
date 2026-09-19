#!/usr/bin/env node
/**
 * SEO/GEO 批量增强脚本
 *
 * 处理 seo-audit.cjs 无法自动修复的问题：
 * 1. 所有 landing pages 补全 llms.txt alternate link
 * 2. 所有 landing pages 补全 notranslate meta
 * 3. open.html 补全完整 SEO meta + JSON-LD
 * 4. index.html BreadcrumbList 补全
 * 5. gen-landing-pages.cjs 模板增强（未来生成自动包含）
 *
 * 用法: node scripts/seo-geo-fix.cjs [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');
const DRY_RUN = process.argv.includes('--dry-run');

function readFile(p) { return fs.readFileSync(p, 'utf-8'); }
function writeFile(p, c) {
  if (DRY_RUN) { console.log(`  [DRY] 跳过写入 ${path.basename(p)}`); return; }
  fs.writeFileSync(p, c, 'utf-8');
}

let totalFixes = 0;

// ========== 1. Landing pages: 补全 llms.txt + notranslate ==========
const landingPages = [
  'chengxie.html', 'didi.html', 'jingdong-pdd.html', 'liansuocanyin.html',
  'meituan-jiuLv.html', 'meituan-waimai.html', 'taobao-shangou.html',
  'haoka.html', 'huiyuan.html', 'wifi.html',
];

for (const name of landingPages) {
  const filePath = path.join(SRC_DIR, name);
  if (!fs.existsSync(filePath)) { console.log(`⚠ ${name} 不存在，跳过`); continue; }
  let content = readFile(filePath);
  let fixes = 0;

  // 1a. 补全 llms.txt alternate link
  if (!content.includes('llms.txt')) {
    // 插入到 canonical 之后
    const canonicalMatch = content.match(/<link rel="canonical"[^>]*\/>/);
    if (canonicalMatch) {
      const insertAfter = canonicalMatch[0];
      const idx = content.indexOf(insertAfter) + insertAfter.length;
      const llmsLink = '\n    <link rel="alternate" type="text/plain" href="https://jdjdndn.github.io/llms.txt" title="站点摘要（供 AI 阅读）" />';
      content = content.slice(0, idx) + llmsLink + content.slice(idx);
      fixes++;
    }
  }

  // 1b. 补全 notranslate meta
  if (!content.includes('notranslate')) {
    // 插入到 viewport meta 之后
    const vpMatch = content.match(/<meta name="viewport"[^/]*\/>/);
    if (vpMatch) {
      const insertAfter = vpMatch[0];
      const idx = content.indexOf(insertAfter) + insertAfter.length;
      const notranslate = '\n    <meta name="google" content="notranslate" />';
      content = content.slice(0, idx) + notranslate + content.slice(idx);
      fixes++;
    }
  }

  if (fixes > 0) {
    writeFile(filePath, content);
    console.log(`✅ ${name}: +${fixes} 项`);
    totalFixes += fixes;
  } else {
    console.log(`  ${name}: 无需修复`);
  }
}

// ========== 2. open.html: 补全完整 SEO ==========
const openPath = path.join(SRC_DIR, 'open.html');
if (fs.existsSync(openPath)) {
  let content = readFile(openPath);
  let fixes = 0;

  // open.html 是跳转提示页，SEO 权重低，但需要基本 meta
  if (!content.includes('name="description"')) {
    // 在 title 后插入
    const titleMatch = content.match(/<title>[^<]+<\/title>/);
    if (titleMatch) {
      const idx = content.indexOf(titleMatch[0]) + titleMatch[0].length;
      const meta = '\n  <meta name="description" content="券宝 — 优惠券聚合平台，跳转提示页" />\n  <meta name="robots" content="noindex, follow" />\n  <meta name="theme-color" content="#FF6B35" />\n  <meta name="google" content="notranslate" />\n  <link rel="canonical" href="https://jdjdndn.github.io/open.html" />';
      content = content.slice(0, idx) + meta + content.slice(idx);
      fixes++;
    }
  }

  if (fixes > 0) {
    writeFile(openPath, content);
    console.log(`✅ open.html: +${fixes} 项`);
    totalFixes += fixes;
  } else {
    console.log('  open.html: 无需修复');
  }
}

// ========== 3. index.html: BreadcrumbList 补全第二层级 ==========
const indexPath = path.join(SRC_DIR, 'index.html');
if (fs.existsSync(indexPath)) {
  let content = readFile(indexPath);
  let fixes = 0;

  // 检查 BreadcrumbList 是否只有 1 个 item
  const blMatch = content.match(/"BreadcrumbList"[\s\S]*?"itemListElement"\s*:\s*\[([\s\S]*?)\]\s*\}/);
  if (blMatch) {
    const itemsStr = blMatch[1];
    const positionCount = (itemsStr.match(/"position"/g) || []).length;
    if (positionCount < 2) {
      // 在现有 ListItem 后添加 "活动" 层级（主页面有活动 tab）
      const lastListItemEnd = itemsStr.lastIndexOf('}') + 1;
      const before = content.indexOf(blMatch[0]);
      const listStart = content.indexOf('[', before + blMatch[0].indexOf('"itemListElement"'));
      const insertPos = listStart + itemsStr.lastIndexOf('}') + 1;
      const addition = ',\n        {\n          "@type": "ListItem",\n          "position": 2,\n          "name": "活动",\n          "item": "https://jdjdndn.github.io/huodong.html"\n        }';
      content = content.slice(0, insertPos) + addition + content.slice(insertPos);
      fixes++;
    }
  }

  if (fixes > 0) {
    writeFile(indexPath, content);
    console.log(`✅ index.html: +${fixes} 项`);
    totalFixes += fixes;
  } else {
    console.log('  index.html: 无需修复');
  }
}

// ========== 4. 更新 gen-landing-pages.cjs 模板 ==========
const genLandingPath = path.resolve(__dirname, '../scripts/gen-landing-pages.cjs');
if (fs.existsSync(genLandingPath)) {
  let genContent = readFile(genLandingPath);
  let fixes = 0;

  // 4a. 确保模板包含 llms.txt link
  if (!genContent.includes('llms.txt')) {
    // 在 canonical link 后添加 llms.txt
    const genCanonicalMatch = genContent.match(/<link rel="canonical"[^`]*`/);
    // 用更简单的方式：在 template literal 中找到 canonical 行
    const canonicalLine = "    <link rel=\"canonical\" href=\"https://jdjdndn.github.io/${page.slug}.html\" />";
    if (genContent.includes(canonicalLine)) {
      const insertAfter = canonicalLine + '\n    <link rel="alternate" hreflang="zh-CN"';
      const replacement = canonicalLine + '\n    <link rel="alternate" type="text/plain" href="https://jdjdndn.github.io/llms.txt" title="站点摘要（供 AI 阅读）" />\n    <link rel="alternate" hreflang="zh-CN"';
      genContent = genContent.replace(insertAfter, replacement);
      fixes++;
    }
  }

  // 4b. 确保模板包含 notranslate
  if (!genContent.includes('notranslate')) {
    const viewportLine = '    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />';
    if (genContent.includes(viewportLine)) {
      genContent = genContent.replace(
        viewportLine,
        viewportLine + '\n    <meta name="google" content="notranslate" />'
      );
      fixes++;
    }
  }

  // 4c. 确保模板有 WebPage speakable JSON-LD
  if (!genContent.includes('WebPage') && !genContent.includes('speakable')) {
    // 在 BreadcrumbList JSON-LD 后添加 WebPage
    const bcEnd = '    </script>\n`;\n';
    // 更可靠的方式：在 template literal 的 JSON-LD 区域添加
    const faqBlock = genContent.indexOf('${page.faq.length > 0 ?');
    if (faqBlock !== -1) {
      const webPageJsonLd = `\n    <script type="application/ld+json">\n    {\n      "@context": "https://schema.org",\n      "@type": "WebPage",\n      "name": "\${page.heroTitle}",\n      "speakable": {\n        "@type": "SpeakableSpecification",\n        "cssSelector": [".hero h1", ".hero p"]\n      }\n    }\n    </script>\n`;
      genContent = genContent.slice(0, faqBlock) + webPageJsonLd + genContent.slice(faqBlock);
      fixes++;
    }
  }

  if (fixes > 0) {
    writeFile(genLandingPath, genContent);
    console.log(`✅ gen-landing-pages.cjs: +${fixes} 项（模板已增强）`);
    totalFixes += fixes;
  } else {
    console.log('  gen-landing-pages.cjs: 无需修复');
  }
}

// ========== 5. 更新 seo-audit.cjs 检查逻辑 ==========
const auditPath = path.resolve(__dirname, '../scripts/seo-audit.cjs');
if (fs.existsSync(auditPath)) {
  let auditContent = readFile(auditPath);
  let fixes = 0;

  // 5a. 修复 h1 检测：当前 regex 不匹配带属性的 h1
  const oldH1Pattern = '/<h1[\\\\s>]/g';
  const newH1Pattern = '/<h1[\\\\s>\\\\/]/g';
  if (auditContent.includes(oldH1Pattern) && !auditContent.includes(newH1Pattern)) {
    auditContent = auditContent.replace(oldH1Pattern, newH1Pattern);
    fixes++;
  }

  // 5b. 增强 isPartOf 检测：搜索 JSON-LD 块内的 isPartOf
  if (!auditContent.includes('blockJson.includes')) {
    // 当前 isPartOf 检查用的是顶层 content.includes，不检查具体 JSON-LD 块
    // 这是个已知限制，记录但不修改 audit 逻辑（避免引入 bug）
  }

  if (fixes > 0) {
    writeFile(auditPath, auditContent);
    console.log(`✅ seo-audit.cjs: +${fixes} 项`);
    totalFixes += fixes;
  } else {
    console.log('  seo-audit.cjs: 无需修复');
  }
}

console.log(`\n📊 共修复 ${totalFixes} 项`);
if (DRY_RUN) console.log('（dry-run 模式，未实际写入）');
