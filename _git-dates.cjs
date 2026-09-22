// 对 fallback(mtime) 的中文名文章逐个查 git 首提交日
const { execSync } = require('child_process');
const fs = require('fs');
const dates = JSON.parse(fs.readFileSync('_article-dates.json', 'utf-8'));
const fallbackKeys = Object.keys(dates).filter(k => dates[k] === '2026-09-22');
console.log('待查文件数:', fallbackKeys.length);
let hit = 0, miss = 0;
for (const key of fallbackKeys) {
  try {
    const d = execSync('git log --diff-filter=A --format=%aI -1 -- "' + key + '"', { encoding: 'utf-8', timeout: 10000 }).trim();
    if (d) { dates[key] = d.slice(0, 10); hit++; }
    else { miss++; }
  } catch { miss++; }
}
const agg = {};
for (const d of Object.values(dates)) agg[d] = (agg[d] || 0) + 1;
console.log('最终日期分布:', JSON.stringify(agg));
console.log('git 命中:', hit, ' 未命中(保留 mtime):', miss);
fs.writeFileSync('_article-dates.json', JSON.stringify(dates, null, 2), 'utf-8');
