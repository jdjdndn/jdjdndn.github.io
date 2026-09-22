// 文章级批量修复（幂等）：
// 1. datePublished → git 真实首发日
// 2. hreflang x-default → 站点首页
// 3. 相关攻略互链（FAQ 后、CTA 前，每篇 3 条，按标题 bigram 相似度）
const fs = require('fs');
const path = require('path');
const ARTICLE_DIR = path.resolve(__dirname, '../src/article');
const SITE = 'https://jdjdndn.github.io';
const DRY = process.argv.includes('--dry-run');

const dates = JSON.parse(fs.readFileSync(path.resolve(__dirname, './article-first-dates.json'), 'utf-8'));
const files = fs.readdirSync(ARTICLE_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');

// ---- 相似度：字符 bigram Jaccard ----
function bigrams(s) {
  const set = new Set();
  for (let i = 0; i < s.length - 1; i++) set.add(s.slice(i, i + 2));
  return set;
}
function jaccard(a, b) {
  const A = bigrams(a), B = bigrams(b);
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  const union = A.size + B.size - inter;
  return union ? inter / union : 0;
}
// 预计算全部标题的 bigram 集合与候选
const titles = files.map(f => f.replace(/\.html$/, ''));
const bigramSets = titles.map(t => bigrams(t));

function relatedFor(idx) {
  const scored = [];
  for (let j = 0; j < titles.length; j++) {
    if (j === idx) continue;
    const s = jaccard(titles[idx], titles[j]);
    if (s > 0) scored.push([j, s]);
  }
  scored.sort((a, b) => b[1] - a[1] || titles[a[0]].localeCompare(titles[b[0]]));
  const picks = scored.slice(0, 3).map(p => p[0]);
  // 相似度不足 3 条时，按标题字母序相邻补足（保证每篇都有互链）
  if (picks.length < 3) {
    const sortedAll = [...titles.keys()].filter(k => k !== idx)
      .sort((a, b) => titles[a].localeCompare(titles[b]));
    const pos = sortedAll.indexOf(idx);
    for (let d = 1; picks.length < 3 && d < sortedAll.length; d++) {
      for (const k of [sortedAll[pos - d], sortedAll[pos + d]]) {
        if (k !== undefined && !picks.includes(k) && picks.length < 3) picks.push(k);
      }
    }
  }
  return picks.map(k => files[k]);
}

let changed = 0, skipped = 0, err = 0;
for (let i = 0; i < files.length; i++) {
  const f = files[i];
  const fp = path.join(ARTICLE_DIR, f);
  let html = fs.readFileSync(fp, 'utf-8');
  const orig = html;
  const base = f.replace(/\.html$/, '');
  const targetDate = dates['src/article/' + f] || '2026-09-21';

  // 1. datePublished
  html = html.replace(/("datePublished"\s*:\s*")[^"]*(")/, `$1${targetDate}$2`);

  // 2. x-default → 首页
  html = html.replace(/<link rel="alternate" hreflang="x-default" href="[^"]*"/,
    `<link rel="alternate" hreflang="x-default" href="${SITE}/"`);

  // 3. 相关攻略（幂等）
  if (!html.includes('<h2>相关攻略</h2>')) {
    const rel = relatedFor(i, titles, bigramSets, files);
    if (rel.length) {
      const links = rel.map(r => {
        const t = r.replace(/\.html$/, '');
        return `        <a href="${encodeURI(r)}">${t}</a>`;
      }).join('\n');
      const block = `\n  <section class="card"><h2>相关攻略</h2><div class="related-links">\n${links}\n        </div></section>\n\n  <div class="cta">`;
      html = html.replace(/<div class="cta">/, block);
    }
  }

  if (html !== orig) {
    if (!DRY) fs.writeFileSync(fp, html, 'utf-8');
    changed++;
  } else skipped++;
}
console.log(`✅ ${DRY ? '[dry-run] ' : ''}处理 ${files.length} 篇：修改 ${changed}，无变化 ${skipped}，错误 ${err}`);
