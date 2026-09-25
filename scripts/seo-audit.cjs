#!/usr/bin/env node
/**
 * SEO/GEO 自动审计与修复脚本
 *
 * 功能：
 * 1. 扫描所有 HTML 文件，检查 SEO 元素完整性
 * 2. 自动修复：硬编码日期 → __BUILD_DATE__
 * 3. 自动补全：缺失的 meta 标签、JSON-LD 属性
 * 4. 生成审计报告
 *
 * 用法：node scripts/seo-audit.cjs [--fix]
 *   --fix  自动修复可修复的问题（默认仅报告）
 */

const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '../src');
const PUBLIC_DIR = path.resolve(__dirname, '../public');
const AUTO_FIX = process.argv.includes('--fix');

// ========== 工具函数 ==========

function getAllHtmlFiles() {
  const files = [];
  for (const f of fs.readdirSync(SRC_DIR)) {
    if (f.endsWith('.html') && !f.startsWith('llms')) {
      files.push(path.join(SRC_DIR, f));
    }
  }
  // 文章目录（src/article/）
  const articleDir = path.join(SRC_DIR, 'article');
  if (fs.existsSync(articleDir)) {
    for (const f of fs.readdirSync(articleDir)) {
      if (f.endsWith('.html')) {
        files.push(path.join(articleDir, f));
      }
    }
  }
  return files;
}

// noindex 页面（组件加载页等）豁免完整 SEO 检查
function isNoindexPage(filePath, content) {
  if (path.basename(filePath) === 'common-page.html') return true;
  return /<meta name="robots"[^>]*content="[^"]*noindex/.test(content);
}

function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}

function writeFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf-8');
}

// ========== 检查器 ==========

const issues = [];
const fixed = [];

function report(file, level, category, message, fixable = false) {
  issues.push({ file: path.basename(file), level, category, message, fixable });
}

function fix(file, message) {
  fixed.push({ file: path.basename(file), message });
}

// ---------- 1. 日期硬编码检查 ----------

function checkHardcodedDates(filePath, content) {
  const name = path.basename(filePath);
  // 匹配 "dateModified": "2025-07-18" 等硬编码日期（排除 __BUILD_DATE__）
  const datePattern = /"dateModified"\s*:\s*"(?!__BUILD_DATE__)\d{4}-\d{2}-\d{2}"/g;
  let match;
  let modified = content;

  while ((match = datePattern.exec(content)) !== null) {
    report(filePath, 'WARN', 'date', `硬编码 dateModified: ${match[0]}`, true);
    if (AUTO_FIX) {
      modified = modified.replace(match[0], '"dateModified": "__BUILD_DATE__"');
      fix(filePath, `将 ${match[0]} 替换为 __BUILD_DATE__`);
    }
  }

  // 同样检查 datePublished 中的硬编码（保留 datePublished 不动，只修 dateModified）

  if (AUTO_FIX && modified !== content) {
    writeFile(filePath, modified);
  }
  return modified !== content;
}

// ---------- 2. Meta 标签完整性 ----------

function checkMetaTags(filePath, content) {
  const name = path.basename(filePath);
  const isIndex = name === 'index.html';

  // 检查必需的 meta 标签
  const requiredMeta = [
    { pattern: /<title>[^<]+<\/title>/, label: 'title' },
    { pattern: /<meta name="description"/, label: 'description' },
    { pattern: /<meta name="robots"/, label: 'robots' },
    { pattern: /rel="canonical"/, label: 'canonical' },
  ];

  for (const { pattern, label } of requiredMeta) {
    if (!pattern.test(content)) {
      report(filePath, 'ERROR', 'meta', `缺少 ${label} 标签`);
    }
  }

  // 检查 OG 标签
  const ogRequired = ['og:type', 'og:url', 'og:title', 'og:description', 'og:image'];
  for (const prop of ogRequired) {
    if (!content.includes(`property="${prop}"`)) {
      report(filePath, 'WARN', 'og', `缺少 ${prop}`);
    }
  }

  // 检查 og:image:width/height（社交平台需要）
  if (!content.includes('og:image:width') && !isIndex) {
    report(filePath, 'INFO', 'og', '缺少 og:image:width/height（影响社交分享预览）', true);
    if (AUTO_FIX) {
      const ogImageAlt = content.includes('og:image:alt')
        ? /(<meta property="og:image:alt"[^/]*\/>)/
        : /(<meta property="og:image"[^/]*\/>)/;
      const insertAfter = content.match(ogImageAlt);
      if (insertAfter) {
        const tag = insertAfter[0];
        const widthTag = '\n    <meta property="og:image:width" content="1200" />\n    <meta property="og:image:height" content="630" />';
        const newContent = content.replace(tag, tag + widthTag);
        writeFile(filePath, newContent);
        fix(filePath, '添加 og:image:width/height');
        return true;
      }
    }
  }

  // 检查 hreflang
  if (!content.includes('hreflang')) {
    report(filePath, 'WARN', 'i18n', '缺少 hreflang 标签');
  }

  // 检查 x-default
  if (!content.includes('hreflang="x-default"')) {
    report(filePath, 'INFO', 'i18n', '缺少 hreflang="x-default"', true);
    if (AUTO_FIX && content.includes('hreflang="zh-CN"')) {
      const lastHreflang = content.lastIndexOf('<link rel="alternate" hreflang="zh-CN"');
      if (lastHreflang !== -1) {
        const lineEnd = content.indexOf('/>', lastHreflang) + 2;
        const slug = name.replace('.html', '');
        const xDefault = `\n    <link rel="alternate" hreflang="x-default" href="https://jdjdndn.github.io/${isIndex ? '' : name}" />`;
        const newContent = content.slice(0, lineEnd) + xDefault + content.slice(lineEnd);
        writeFile(filePath, newContent);
        fix(filePath, '添加 hreflang="x-default"');
        return true;
      }
    }
  }

  // 检查 Twitter Card
  if (!content.includes('twitter:card')) {
    report(filePath, 'WARN', 'twitter', '缺少 Twitter Card meta 标签', true);
    if (AUTO_FIX && content.includes('og:title')) {
      // 在 OG 标签后插入 Twitter Card
      const lastOg = content.lastIndexOf('<meta property="og:');
      if (lastOg !== -1) {
        const lineEnd = content.indexOf('/>', lastOg) + 2;
        const title = content.match(/<meta property="og:title" content="([^"]*)"/)?.[1] || '';
        const desc = content.match(/<meta property="og:description" content="([^"]*)"/)?.[1] || '';
        const twitterTags = `
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />`;
        const newContent = content.slice(0, lineEnd) + twitterTags + content.slice(lineEnd);
        writeFile(filePath, newContent);
        fix(filePath, '添加 Twitter Card meta 标签');
        return true;
      }
    }
  }

  return false;
}

// ---------- 3. JSON-LD 结构化数据检查 ----------

function checkJsonLd(filePath, content) {
  const jsonLdBlocks = [...content.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];

  if (jsonLdBlocks.length === 0) {
    report(filePath, 'ERROR', 'jsonld', '缺少 JSON-LD 结构化数据');
    return;
  }

  for (const block of jsonLdBlocks) {
    try {
      const data = JSON.parse(block[1]);

      // 检查 @type
      if (!data['@type']) {
        report(filePath, 'WARN', 'jsonld', 'JSON-LD 缺少 @type');
      }

      // 检查 CollectionPage 是否有 mainEntity
      if (data['@type'] === 'CollectionPage' && !data.mainEntity) {
        report(filePath, 'INFO', 'jsonld', `CollectionPage "${data.name}" 缺少 mainEntity（建议添加 ItemList）`);
      }

      // 检查 isPartOf 链接（仅主实体类型，不检查 FAQPage/BreadcrumbList/HowTo 等辅助类型）
      const mainEntityTypes = ['CollectionPage', 'WebPage', 'AboutPage', 'ItemPage'];
      if (mainEntityTypes.includes(data['@type']) && !data.isPartOf) {
        report(filePath, 'INFO', 'jsonld', `缺少 isPartOf 链接到 WebSite`);
      }

      // 检查 BreadcrumbList
      if (data['@type'] === 'BreadcrumbList') {
        const items = data.itemListElement || [];
        if (items.length < 2) {
          report(filePath, 'WARN', 'jsonld', 'BreadcrumbList 至少需要 2 个层级');
        }
      }

      // 检查 FAQPage 的 speakable
      if (data['@type'] === 'FAQPage' && !data.speakable) {
        report(filePath, 'INFO', 'jsonld', 'FAQPage 建议添加 speakable 属性（GEO 优化）');
      }
    } catch (e) {
      report(filePath, 'ERROR', 'jsonld', `JSON-LD 解析失败: ${e.message}`);
    }
  }

  // 非首页检查是否缺少 BreadcrumbList（index.html 是首页 Vue SPA 入口，豁免）
  const name = path.basename(filePath);
  if (name !== 'index.html' && !content.includes('"BreadcrumbList"')) {
    report(filePath, 'INFO', 'jsonld', '缺少 BreadcrumbList 结构化数据', true);
  }
}

// ---------- 4. 语义化 HTML 检查 ----------

function checkSemanticHtml(filePath, content) {
  // 检查 h1 标签
  const h1Count = (content.match(/<h1[\s>]/g) || []).length;
  if (h1Count === 0) {
    report(filePath, 'ERROR', 'semantic', '缺少 h1 标签');
  } else if (h1Count > 1) {
    report(filePath, 'WARN', 'semantic', `有 ${h1Count} 个 h1 标签（建议只有 1 个）`);
  }

  // 检查 lang 属性
  if (!content.includes('lang="zh-CN"')) {
    report(filePath, 'ERROR', 'semantic', 'html 标签缺少 lang="zh-CN"');
  }

  // 检查 aria-label（无障碍 + SEO）
  const name = path.basename(filePath);
  if (name === 'index.html' && !content.includes('aria-label')) {
    report(filePath, 'INFO', 'a11y', '建议添加 aria-label 提升无障碍和 SEO');
  }
}

// ---------- 5. 性能相关 SEO 检查 ----------

function checkPerformanceSeo(filePath, content) {
  // 检查 preload
  if (!content.includes('rel="preload"') && !content.includes('rel="modulepreload"')) {
    report(filePath, 'INFO', 'perf', '建议添加 preload/modulepreload 加速首屏');
  }

  // 检查图片 alt
  const imgTags = [...content.matchAll(/<img\s[^>]*>/g)];
  for (const img of imgTags) {
    if (!img[0].includes('alt=')) {
      report(filePath, 'WARN', 'a11y', `图片缺少 alt 属性: ${img[0].slice(0, 60)}...`);
    }
  }
}

// ---------- 6. GEO（AI 搜索）优化检查 ----------

function checkGeoOptimization(filePath, content) {
  const name = path.basename(filePath);

  // 检查 llms.txt（仅站点首页 src/index.html）
  // llms.txt / llms-full.txt 现由构建时生成（vite.config.js generate-llms 插件输出到 dist/），
  // 因此同时检查 dist 产物与 public 静态文件
  if (filePath === path.join(SRC_DIR, 'index.html')) {
    const llmsCandidates = [
      path.join(PUBLIC_DIR, 'llms.txt'),
      path.join(__dirname, '../dist/llms.txt'),
    ];
    if (!llmsCandidates.some((p) => fs.existsSync(p))) {
      report(filePath, 'WARN', 'geo', '缺少 llms.txt（AI 搜索优化）');
    }
    const llmsFullCandidates = [
      path.join(PUBLIC_DIR, 'llms-full.txt'),
      path.join(__dirname, '../dist/llms-full.txt'),
    ];
    if (!llmsFullCandidates.some((p) => fs.existsSync(p))) {
      report(filePath, 'WARN', 'geo', '缺少 llms-full.txt（AI 搜索优化）');
    }
  }

  // 检查 speakable（首页和子页面）
  if (!content.includes('speakable')) {
    report(filePath, 'INFO', 'geo', '缺少 speakable 属性（提升语音搜索/AI 引用）');
  }

  // 检查 FAQ 结构化数据
  if (!content.includes('FAQPage')) {
    report(filePath, 'INFO', 'geo', '建议添加 FAQPage JSON-LD（提升 AI 搜索引用率）');
  }

  // 检查 llms.txt alternate link（子页面）
  if (name !== 'index.html' && !content.includes('llms.txt')) {
    report(filePath, 'INFO', 'geo', '缺少 llms.txt alternate link（引导 AI 爬虫）', true);
  }

  // 检查 notranslate meta（防止 Google 翻译破坏中文）
  if (!content.includes('notranslate')) {
    report(filePath, 'INFO', 'geo', '缺少 notranslate meta（防止 Google 翻译破坏页面）', true);
  }
}

// ========== 主流程 ==========

function main() {
  console.log('🔍 SEO/GEO 自动审计');
  console.log(`   模式: ${AUTO_FIX ? '自动修复' : '仅报告（加 --fix 启用自动修复）'}`);
  console.log('');

  const files = getAllHtmlFiles();
  console.log(`📄 扫描 ${files.length} 个 HTML 文件\n`);

  for (const file of files) {
    const content = readFile(file);
    const name = path.basename(file);

    // noindex 页面（如 common-page.html 组件加载页）跳过完整检查
    if (isNoindexPage(file, content)) {
      continue;
    }

    console.log(`── ${name} ──`);

    checkHardcodedDates(file, content);
    // 可能被 fix 修改，重新读取
    const updated = AUTO_FIX ? readFile(file) : content;
    checkMetaTags(file, updated);
    checkJsonLd(file, updated);
    checkSemanticHtml(file, updated);
    checkPerformanceSeo(file, updated);
    checkGeoOptimization(file, updated);
  }

  // ========== 报告 ==========
  console.log('\n' + '='.repeat(60));
  console.log('📊 审计报告');
  console.log('='.repeat(60));

  const errors = issues.filter(i => i.level === 'ERROR');
  const warns = issues.filter(i => i.level === 'WARN');
  const infos = issues.filter(i => i.level === 'INFO');

  if (errors.length) {
    console.log(`\n❌ 错误 (${errors.length}):`);
    for (const i of errors) {
      console.log(`   [${i.file}] ${i.category}: ${i.message}`);
    }
  }

  if (warns.length) {
    console.log(`\n⚠️  警告 (${warns.length}):`);
    for (const i of warns) {
      const fixTag = i.fixable ? ' 🔧可修复' : '';
      console.log(`   [${i.file}] ${i.category}: ${i.message}${fixTag}`);
    }
  }

  if (infos.length) {
    console.log(`\n💡 建议 (${infos.length}):`);
    for (const i of infos) {
      const fixTag = i.fixable ? ' 🔧可修复' : '';
      console.log(`   [${i.file}] ${i.category}: ${i.message}${fixTag}`);
    }
  }

  if (AUTO_FIX && fixed.length) {
    console.log(`\n✅ 已自动修复 (${fixed.length}):`);
    for (const f of fixed) {
      console.log(`   [${f.file}] ${f.message}`);
    }
  }

  const fixableCount = issues.filter(i => i.fixable).length;
  console.log(`\n📈 总计: ${errors.length} 错误, ${warns.length} 警告, ${infos.length} 建议`);
  if (!AUTO_FIX && fixableCount > 0) {
    console.log(`   其中 ${fixableCount} 个可通过 --fix 自动修复`);
  }

  console.log('');
  // 门禁语义：0 错误 0 警告才算通过（建议级 INFO 放行）
  process.exit(errors.length > 0 || warns.length > 0 ? 1 : 0);
}

main();
