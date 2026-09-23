#!/usr/bin/env node
/**
 * 修复文章页面子目录的 URL 问题
 *
 * 问题：card/ 和 haowu/ 子目录下的文章页面的 canonical URL、og:url、JSON-LD url
 *       缺少子目录前缀，导致 SEO 问题。
 *
 * 修复：将 URL 从 /article/xxx.html 改为 /article/card/xxx.html 或 /article/haowu/xxx.html
 *
 * 用法：node scripts/fix-article-urls.cjs [--dry-run]
 */
const fs = require('fs');
const path = require('path');

const ARTICLE_DIR = path.resolve(__dirname, '../src/article');
const SITE = 'https://jdjdndn.github.io';
const DRY_RUN = process.argv.includes('--dry-run');

// 需要处理的子目录
const SUBDIRS = ['card', 'haowu'];

function fixArticleUrls(subdir, fileName) {
  const filePath = path.join(ARTICLE_DIR, subdir, fileName);
  let html = fs.readFileSync(filePath, 'utf-8');
  const correctUrl = `${SITE}/article/${subdir}/${encodeURI(fileName)}`;
  const wrongUrl = `${SITE}/article/${encodeURI(fileName)}`;
  let changed = false;

  // 1. 修复 canonical URL
  const canonicalRe = /(<link rel="canonical" href=")[^"]*(")/;
  if (canonicalRe.test(html)) {
    const newHtml = html.replace(canonicalRe, `$1${correctUrl}$2`);
    if (newHtml !== html) {
      html = newHtml;
      changed = true;
    }
  }

  // 2. 修复 og:url
  const ogUrlRe = /(<meta property="og:url" content=")[^"]*(")/;
  if (ogUrlRe.test(html)) {
    const newHtml = html.replace(ogUrlRe, `$1${correctUrl}$2`);
    if (newHtml !== html) {
      html = newHtml;
      changed = true;
    }
  }

  // 3. 修复 JSON-LD url
  const jsonLdUrlRe = /("url"\s*:\s*")[^"]*(")/;
  if (jsonLdUrlRe.test(html)) {
    const newHtml = html.replace(jsonLdUrlRe, `$1${correctUrl}$2`);
    if (newHtml !== html) {
      html = newHtml;
      changed = true;
    }
  }

  // 4. 修复 JSON-LD mainEntityOfPage @id
  const entityIdRe = /("@id"\s*:\s*")[^"]*(")/;
  if (entityIdRe.test(html)) {
    const newHtml = html.replace(entityIdRe, `$1${correctUrl}$2`);
    if (newHtml !== html) {
      html = newHtml;
      changed = true;
    }
  }

  // 5. 修复 hreflang
  const hreflangRe = /(<link rel="alternate" hreflang="zh-CN" href=")[^"]*(")/;
  if (hreflangRe.test(html)) {
    const newHtml = html.replace(hreflangRe, `$1${correctUrl}$2`);
    if (newHtml !== html) {
      html = newHtml;
      changed = true;
    }
  }

  // 6. 修复 x-default
  const xDefaultRe = /(<link rel="alternate" hreflang="x-default" href=")[^"]*(")/;
  if (xDefaultRe.test(html)) {
    const newHtml = html.replace(xDefaultRe, `$1${correctUrl}$2`);
    if (newHtml !== html) {
      html = newHtml;
      changed = true;
    }
  }

  if (changed && !DRY_RUN) {
    fs.writeFileSync(filePath, html, 'utf-8');
  }

  return changed;
}

function main() {
  console.log(`🔧 修复文章页面子目录 URL ${DRY_RUN ? '(dry-run)' : ''}`);

  let totalFixed = 0;

  for (const subdir of SUBDIRS) {
    const subdirPath = path.join(ARTICLE_DIR, subdir);
    if (!fs.existsSync(subdirPath)) {
      console.log(`  ⚠️  子目录不存在: ${subdir}`);
      continue;
    }

    const files = fs.readdirSync(subdirPath).filter(f => f.endsWith('.html'));
    let fixedCount = 0;

    for (const file of files) {
      const fixed = fixArticleUrls(subdir, file);
      if (fixed) fixedCount++;
    }

    console.log(`  📁 ${subdir}/: ${fixedCount}/${files.length} 个文件已修复`);
    totalFixed += fixedCount;
  }

  console.log(`\n✅ 共修复 ${totalFixed} 个文件`);
  if (DRY_RUN) console.log('（dry-run 模式，未写入）');
}

main();
