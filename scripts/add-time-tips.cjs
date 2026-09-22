// 文章时效性提示（幂等）：在 CTA 领取按钮前插入醒目的时效提示条
// 优惠攻略全部涉及时效性内容（价格/活动/名额随时调整），统一提示
const fs = require('fs');
const path = require('path');
const ARTICLE_DIR = path.resolve(__dirname, '../src/article');
const DRY = process.argv.includes('--dry-run');

const TIP =
  '  <div class="time-tip"><span class="time-tip-title">时效提示</span>本页优惠价格、活动名额与截止时间可能随时调整，以下单时官方页面实时展示为准，建议尽快领取。</div>\n\n  <div class="cta">';

const files = fs.readdirSync(ARTICLE_DIR).filter(f => f.endsWith('.html') && f !== 'index.html');
let changed = 0, skipped = 0;
for (const f of files) {
  const fp = path.join(ARTICLE_DIR, f);
  let html = fs.readFileSync(fp, 'utf-8');
  if (html.includes('class="time-tip"')) { skipped++; continue; }
  const cta = '<div class="cta">';
  const i = html.indexOf(cta);
  if (i === -1) { skipped++; continue; }
  html = html.slice(0, i) + TIP + html.slice(i + cta.length);
  if (!DRY) fs.writeFileSync(fp, html, 'utf-8');
  changed++;
}
console.log(`✅ ${DRY ? '[dry-run] ' : ''}文章 ${files.length} 篇：插入提示 ${changed}，已存在/跳过 ${skipped}`);
