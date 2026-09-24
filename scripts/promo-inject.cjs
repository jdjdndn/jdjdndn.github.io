// 产品优化：900 篇文章批量注入「更多省钱入口」区块（真实联盟链接，按层级适配相对路径）
const fs = require('fs');
const path = require('path');
const root = path.resolve('src/article');
const PROMO = (prefix) => `  <style>
  .promo-banner{background:linear-gradient(135deg,#fff5f0 0%,#fff 50%,#fff8f3 100%);border:1px solid rgba(255,107,53,.18);border-radius:14px;padding:18px 16px;margin:18px auto;max-width:760px;text-align:center}
  .promo-title{font-size:17px;font-weight:700;color:var(--primary,#FF6B35);margin-bottom:12px}
  .promo-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:12px}
  .promo-btn{display:flex;align-items:center;justify-content:center;gap:6px;padding:10px 12px;background:#fff;border:1px solid rgba(255,107,53,.22);border-radius:10px;color:var(--primary,#FF6B35);font-size:14px;font-weight:600;text-decoration:none;transition:all .2s;box-shadow:0 1px 3px rgba(255,107,53,.08)}
  .promo-btn:hover{background:var(--primary,#FF6B35);color:#fff;border-color:var(--primary,#FF6B35);transform:translateY(-2px);box-shadow:0 4px 12px rgba(255,107,53,.25)}
  .promo-icon{font-size:18px;line-height:1}
  .promo-home{display:inline-block;font-size:13px;color:var(--sub,#5b6472);text-decoration:none;padding:6px 14px;border-radius:999px;background:rgba(255,107,53,.06);transition:all .2s}
  .promo-home:hover{color:var(--primary,#FF6B35);background:rgba(255,107,53,.12)}
  @media(max-width:480px){.promo-grid{grid-template-columns:1fr 1fr}}
  </style>
  <section class="promo-banner" aria-label="更多省钱入口">
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
const OLD_PROMO_RE = /<section class="card promo-links"[\s\S]*?<\/section>\s*\n?/;
const files = walk(root);
let done = 0, skipped = 0;
for (const f of files) {
  const rel = path.relative(root, f).replace(/\\/g, '/');
  const depth = rel.includes('/') ? 1 : 0;
  const prefix = depth === 0 ? '../' : '../../';
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('promo-banner')) {
    c = c.replace(/<style>[\s\S]*?<\/style>\s*<section class="promo-banner"[\s\S]*?<\/section>/, PROMO(prefix));
    fs.writeFileSync(f, c, 'utf8');
    done++;
    continue;
  }
  if (c.includes('promo-links')) {
    c = c.replace(OLD_PROMO_RE, PROMO(prefix));
    fs.writeFileSync(f, c, 'utf8');
    done++;
    continue;
  }
  const anchor = '<footer';
  const idx = c.indexOf(anchor);
  if (idx === -1) { skipped++; continue; }
  c = c.slice(0, idx) + PROMO(prefix) + c.slice(idx);
  fs.writeFileSync(f, c, 'utf8');
  done++;
}
console.log(`注入完成: ${done} 篇（跳过 ${skipped} 篇：无 footer 或已有区块）`);
