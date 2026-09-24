// 产品优化：900 篇文章批量注入「更多省钱入口」区块（真实联盟链接，按层级适配相对路径）
const fs = require('fs');
const path = require('path');
const root = path.resolve('src/article');
const PROMO = (prefix) => `  <section class="promo-banner" aria-label="更多省钱入口">
    <div class="promo-title">🔥 更多省钱入口</div>
    <div class="promo-grid">
      <a class="promo-btn" href="https://kurl07.cn/te2qe9" target="_blank" rel="noopener sponsored">
        <span class="promo-icon">🍱</span><span class="promo-label">美团外卖红包</span>
      </a>
      <a class="promo-btn" href="https://1.yoourl.net/link/10009836aafbeff4e2171002ArLVtpn4" target="_blank" rel="noopener sponsored">
        <span class="promo-icon">🛍️</span><span class="promo-label">京东外卖红包</span>
      </a>
      <a class="promo-btn" href="https://s.ly.com/xscLym6Jj" target="_blank" rel="noopener sponsored">
        <span class="promo-icon">🚄</span><span class="promo-label">同程出行购票</span>
      </a>
    </div>
    <a class="promo-home" href="${prefix}index.html" rel="nofollow">返回首页看全部 →</a>
  </section>
`;
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}
const files = walk(root);
let done = 0, skipped = 0;
for (const f of files) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const depth = rel.includes('/') ? 1 : 0;
  const prefix = depth === 0 ? '../' : '../../';
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('promo-links')) { skipped++; continue; }
  const anchor = '<footer';
  const idx = c.indexOf(anchor);
  if (idx === -1) { skipped++; continue; }
  c = c.slice(0, idx) + PROMO(prefix) + c.slice(idx);
  fs.writeFileSync(f, c, 'utf8');
  done++;
}
console.log(`注入完成: ${done} 篇（跳过 ${skipped} 篇：无 footer 或已有区块）`);
