// ============================================================
// 生成非文章链接汇总页 links.html → E:\code\wcbblll_cc\
// 数据源：src/data.js（tabs + friendLinks + FRIEND_LINKS_DATA）
//         src/views/fuye-data.js（fuyePages[].entries）
//         src/templates/wifi-data.js（wifiLinks + wifiProxyLinks）
//         src/views/Huiyuan.vue（members）
// 规则：排除 .html 文章链接；URL 去重；按计划分类体系归类
// 用法：node scripts/build-links-page.mjs
// ============================================================
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

// 模式：node scripts/build-links-page.mjs [links|index|json]（默认 links）
//   links: 生成 links.html（数据内联）
//   index: 生成 index.html（fetch links-data.json）+ links-data.json
//   json:  仅生成 links-data.json（供 npm run build 调用）
const MODE = process.argv[2] || 'links';
// 输出目录：github.io 的兄弟目录 ../wcbblll_cc（相对脚本位置推导，可移植）
const WCC_DIR = path.resolve(ROOT, '../wcbblll_cc');
const OUT = MODE === 'index' ? path.join(WCC_DIR, 'index.html') : MODE === 'links' ? path.join(WCC_DIR, 'links.html') : null;
const DATA_FILE = path.join(WCC_DIR, 'links-data.json');
const IS_INLINE = MODE === 'links';

// ---------- 分类体系（计划 1.3） ----------
const CATS = {
  ecommerce:   { name: '电商优惠', emoji: '🛒' },
  food:        { name: '外卖餐饮', emoji: '🍜' },
  travel:      { name: '出行旅行', emoji: '✈️' },
  member:      { name: '影视会员', emoji: '👑' },
  netdisk:     { name: '网盘资源', emoji: '💾' },
  simcard:     { name: '号卡办理', emoji: '📱' },
  wifi:        { name: '随身WiFi', emoji: '📶' },
  cloud:       { name: '云服务', emoji: '☁️' },
  miniprogram: { name: '小程序服务', emoji: '📲' },
  app:         { name: 'App拉新', emoji: '📢' },
  creditcard:  { name: '信用卡', emoji: '💳' },
  other:       { name: '其他', emoji: '🌐' },
};

// ---------- 链接类型 ----------
function getLinkType(url) {
  if (!url) return 'empty';
  if (url.startsWith('#小程序://')) return 'miniprogram';
  if (url.startsWith('alipays://')) return 'alipay-miniprogram';
  if (url.startsWith('weixin://dl/business/')) return 'wechat-business';
  if (url.startsWith('weixin://')) return 'wechat-other';
  return 'web';
}

// ---------- 数据源 ----------
const data = await import('file:///' + path.join(ROOT, 'src/data.js').replace(/\\/g, '/'));
const fuye = await import('file:///' + path.join(ROOT, 'src/views/fuye-data.js').replace(/\\/g, '/'));
const wifi = await import('file:///' + path.join(ROOT, 'src/templates/wifi-data.js').replace(/\\/g, '/'));

// Huiyuan.vue members（正则提取）
const vueSrc = fs.readFileSync(path.join(ROOT, 'src/views/Huiyuan.vue'), 'utf8');
const vm = vueSrc.match(/const members = (\[[\s\S]*?\])\n/s);
const members = vm ? eval(vm[1]) : [];

// ---------- 提取 ----------
const raw = []; // { name, url, desc, price, deadline, category, source }

// 1) tabs[].sections[].items[].link
const TAB_CAT = { bendishenghuo: 'food', ecommerce: 'ecommerce', travel: 'travel', yunfuwu: 'cloud', xinyonghu: 'app' };
for (const tab of data.tabs) {
  const cat = TAB_CAT[tab.id] || 'other';
  for (const section of tab.sections || []) {
    for (const item of section.items || []) {
      const url = item.link || '';
      if (!url || url.endsWith('.html')) continue;
      raw.push({ name: item.name, url, desc: item.description || '', deadline: item.deadline || '', category: cat, source: 'tabs' });
    }
  }
}

// 2) friendLinks（按名称分类）
const FL_CAT = (name) => {
  if (/电影票/.test(name)) return 'food';
  if (/花店|寄快递|回收/.test(name)) return 'miniprogram';
  if (/苏宁|当当|1688|电商/.test(name)) return 'ecommerce';
  return 'other';
};
for (const f of data.friendLinks) {
  const url = f.url || f.link || '';
  if (!url || url.endsWith('.html')) continue;
  raw.push({ name: f.name, url, desc: f.description || '', deadline: '', category: FL_CAT(f.name), source: 'friendLinks' });
}

// 3) FRIEND_LINKS_DATA（补充 tabs/friendLinks 没有的分类：member/netdisk/simcard/wifi）
const FLD_CAT = (title) => {
  if (/电商/.test(title)) return 'ecommerce';
  if (/外卖/.test(title)) return 'food';
  if (/出行/.test(title)) return 'travel';
  if (/会员/.test(title)) return 'member';
  if (/网盘/.test(title)) return 'netdisk';
  if (/号卡/.test(title)) return 'simcard';
  if (/WiFi/.test(title)) return 'wifi';
  if (/云服务/.test(title)) return 'cloud';
  return 'other';
};
for (const group of data.FRIEND_LINKS_DATA) {
  const cat = FLD_CAT(group.title);
  if (!['member', 'netdisk', 'simcard', 'wifi', 'food'].includes(cat)) continue; // 其余与 tabs 重叠，交由上面提取
  for (const l of group.links || []) {
    const url = l.url || '';
    if (!url || url.endsWith('.html')) continue;
    raw.push({ name: l.name, url, desc: l.desc || '', deadline: '', category: cat, source: 'FRIEND_LINKS_DATA' });
  }
}

// 4) fuyePages[].entries[].url
const FUYE_CAT = (p) => {
  const t = p.title || '';
  if (/号卡/.test(t)) return 'simcard';
  if (/电商/.test(t)) return 'ecommerce';
  if (/回收/.test(t)) return 'miniprogram';
  if (/会员/.test(t)) return 'member';
  if (/拉新/.test(t)) return 'app';
  if (/WiFi/.test(t)) return 'wifi';
  if (/快递/.test(t)) return 'miniprogram';
  if (/信用卡/.test(t)) return 'creditcard';
  return 'other';
};
for (const [slug, page] of Object.entries(fuye.fuyePages)) {
  if (page.hidden && slug === 'fuye/haoka-agent') continue; // 与 haoka 重复
  const cat = FUYE_CAT(page);
  for (const e of page.entries || []) {
    const url = e.url || '';
    if (!url || url.endsWith('.html')) continue;
    raw.push({ name: e.name, url, desc: e.desc || '', deadline: '', category: cat, source: 'fuye' });
  }
}

// 5) wifi-data.js：wifiLinks + wifiProxyLinks
for (const w of wifi.wifiLinks) {
  raw.push({ name: w.name, url: w.url, desc: w.description || '', price: w.priceRange || '', deadline: '', category: 'wifi', source: 'wifiLinks' });
}
for (const w of wifi.wifiProxyLinks) {
  raw.push({ name: w.name, url: w.url, desc: '立即注册成为代理', price: '', deadline: '', category: 'wifi', source: 'wifiProxyLinks' });
}

// 6) Huiyuan.vue members
for (const m of members) {
  raw.push({ name: m.name, url: m.url, desc: m.desc || '', price: '', deadline: '', category: 'member', source: 'huiyuan' });
}

// ---------- 去重（URL 唯一，重复项合并字段：name/price/deadline 补非空，desc 取较长） ----------
const byUrl = new Map();
for (const l of raw) {
  const key = l.url.trim();
  if (!key) continue;
  if (byUrl.has(key)) {
    const prev = byUrl.get(key);
    for (const f of ['name', 'price', 'deadline']) {
      if (!prev[f] && l[f]) prev[f] = l[f];
    }
    if ((l.desc || '').length > (prev.desc || '').length) prev.desc = l.desc;
  } else {
    byUrl.set(key, { ...l });
  }
}
const links = [...byUrl.values()].map(l => ({
  ...l,
  id: 'L' + Math.random().toString(36).slice(2, 8),
  type: getLinkType(l.url),
  isHttp: l.url.startsWith('http://'),
}));

// 分类统计
const catCount = {};
for (const l of links) catCount[l.category] = (catCount[l.category] || 0) + 1;

// ---------- 生成 HTML ----------
// ---------- 数据 JSON（json / index 模式输出） ----------
const updated = new Date().toISOString().slice(0, 10);
const dataJson = JSON.stringify(links).replace(/</g, '\\u003c');
if (MODE === 'json' || MODE === 'index') {
  const payload = { updated, links };
  fs.writeFileSync(DATA_FILE, JSON.stringify(payload), 'utf8');
  console.log(`✅ 生成 ${DATA_FILE}（${links.length} 个链接）`);
  if (MODE === 'json') process.exit(0);
}
const schemaItems = links.slice(0, 5).map((l, i) => ({
  '@type': 'ListItem',
  position: i + 1,
  item: { '@type': 'WebSite', name: l.name, url: l.url },
}));
const SITE_URL = MODE === 'index' ? 'https://wcbblll.cc/' : 'https://wcbblll.cc/links.html';
const PAGE_TITLE = MODE === 'index'
  ? '券宝 — 优惠链接导航 · 电商/出行/会员/生活优惠一站直达'
  : '优惠链接导航 — 电商/出行/会员/生活优惠汇总 | 券宝';
const BACK_LABEL = MODE === 'index' ? '← 券宝主站' : '← 首页';
const BACK_HREF = MODE === 'index' ? 'https://jdjdndn.github.io/' : 'https://wcbblll.cc/';
const LD_TYPE = MODE === 'index' ? 'WebSite' : 'CollectionPage';
const LD_MAIN = MODE === 'index'
  ? { '@type': 'WebSite', name: '券宝', alternateName: '优惠链接导航', url: 'https://wcbblll.cc/' }
  : { '@type': 'ItemList', numberOfItems: links.length, itemListElement: schemaItems };

const catTabs = Object.entries(CATS)
  .filter(([id]) => catCount[id])
  .map(([id, c]) => `<button class="tab" data-cat="${id}">${c.emoji} ${c.name}<span class="tab-count">${catCount[id]}</span></button>`)
  .join('\n      ');

const html = `<!DOCTYPE html>
<html lang="zh-CN" data-theme="light">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${PAGE_TITLE}</title>
<meta name="description" content="汇集京东、淘宝、拼多多、携程、美团等平台优惠链接，影视音乐会员、随身WiFi、号卡办理一站导航。实时更新，免费使用。">
<meta name="keywords" content="优惠链接,电商优惠,会员优惠,随身WiFi,号卡办理,券宝,省钱,优惠券">
<link rel="canonical" href="${SITE_URL}">
<meta name="robots" content="index, follow">
<meta name="geo.region" content="CN">
<meta name="geo.placename" content="中国">
<meta name="geo.position" content="39.9042;116.4074">
<meta name="ICBM" content="39.9042, 116.4074">
<link rel="alternate" hreflang="zh-CN" href="${SITE_URL}">
<meta property="og:title" content="优惠链接导航 — 一站汇总全网优惠">
<meta property="og:description" content="电商/出行/会员/生活优惠链接汇总，省钱从这里开始">
<meta property="og:type" content="website">
<meta property="og:url" content="${SITE_URL}">
<meta property="og:site_name" content="券宝">
<meta property="og:locale" content="zh_CN">
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "${LD_TYPE}",
  "name": "优惠链接导航",
  "description": "汇集全网优惠链接的导航页面",
  "url": "${SITE_URL}",
  "mainEntity": ${JSON.stringify(LD_MAIN)}
}
</script>
<style>
:root {
  --bg: #f5f5f7; --card: #ffffff; --border: #e5e2dd; --text: #1a1a2e; --text-2: #6b7280;
  --primary: #FF6B35; --primary-light: #fff4ed; --success: #16a34a; --success-light: #f0fdf4;
  --warn: #d97706; --warn-light: #fffbeb; --shadow: 0 2px 12px rgba(0,0,0,.06); --radius: 12px;
}
[data-theme="dark"] {
  --bg: #12121f; --card: #1e1e35; --border: #2d2d45; --text: #e8e8f0; --text-2: #9a9ab0;
  --primary-light: #2a2118; --success-light: #14291c; --warn-light: #2a2310;
  --shadow: 0 2px 12px rgba(0,0,0,.35);
}
* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
  background: var(--bg); color: var(--text); line-height: 1.5; transition: background .3s, color .3s;
}
a { color: inherit; text-decoration: none; }
.container { max-width: 1280px; margin: 0 auto; padding: 0 16px; }

/* Header */
header.site {
  position: sticky; top: 0; z-index: 100; background: var(--bg); border-bottom: 1px solid var(--border);
  backdrop-filter: blur(8px); padding: 12px 0;
}
.header-inner { display: flex; align-items: center; gap: 12px; }
.back-btn {
  display: inline-flex; align-items: center; gap: 4px; padding: 6px 12px; border-radius: 8px;
  background: var(--card); border: 1px solid var(--border); font-size: 13px; color: var(--text);
  white-space: nowrap; transition: all .2s;
}
.back-btn:hover { border-color: var(--primary); color: var(--primary); }
.header-inner h1 { font-size: 18px; font-weight: 700; flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.header-stat { font-size: 12px; color: var(--text-2); white-space: nowrap; }
.header-stat strong { color: var(--primary); }
.theme-btn {
  width: 34px; height: 34px; border-radius: 8px; border: 1px solid var(--border); background: var(--card);
  font-size: 16px; cursor: pointer; flex-shrink: 0;
}

/* Search */
.search-wrap { padding: 16px 0 4px; }
.search-box {
  display: flex; align-items: center; gap: 8px; background: var(--card); border: 1px solid var(--border);
  border-radius: 10px; padding: 10px 14px; max-width: 520px; transition: border-color .2s;
}
.search-box:focus-within { border-color: var(--primary); }
.search-box .icon { font-size: 15px; opacity: .5; }
.search-box input {
  flex: 1; border: 0; outline: 0; background: transparent; font-size: 14px; color: var(--text); min-width: 0;
}
.search-box input::placeholder { color: var(--text-2); }
.search-clear { border: 0; background: none; cursor: pointer; font-size: 16px; color: var(--text-2); padding: 2px; display: none; }
.search-clear.show { display: block; }

/* Tabs */
.tabs {
  display: flex; gap: 8px; padding: 14px 0 6px; overflow-x: auto; -webkit-overflow-scrolling: touch;
  scrollbar-width: none; position: sticky; top: 63px; z-index: 99; background: var(--bg);
}
.tabs::-webkit-scrollbar { display: none; }
.tab {
  display: inline-flex; align-items: center; gap: 6px; padding: 7px 13px; border-radius: 999px;
  border: 1px solid var(--border); background: var(--card); font-size: 13px; color: var(--text);
  cursor: pointer; white-space: nowrap; transition: all .2s;
}
.tab:hover { border-color: var(--primary); }
.tab.active { background: var(--primary); border-color: var(--primary); color: #fff; }
.tab-count { font-size: 11px; background: var(--primary-light); color: var(--primary); padding: 1px 6px; border-radius: 999px; }
.tab.active .tab-count { background: rgba(255,255,255,.25); color: #fff; }

/* Stats */
.stats-bar { font-size: 12px; color: var(--text-2); padding: 4px 2px 12px; }

/* Grid */
.link-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; padding-bottom: 40px; }
@media (max-width: 1023px) { .link-grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 767px) { .link-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; } }
@media (max-width: 479px) { .link-grid { grid-template-columns: 1fr; } }

.link-card {
  display: flex; flex-direction: column; gap: 8px; padding: 16px; background: var(--card);
  border: 1px solid var(--border); border-radius: var(--radius); transition: all .2s; cursor: pointer;
  box-shadow: var(--shadow);
}
.link-card:hover { border-color: var(--primary); transform: translateY(-2px); box-shadow: 0 6px 18px rgba(255,107,53,.12); }
.card-top { display: flex; align-items: center; gap: 10px; }
.card-icon {
  width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
  font-size: 20px; background: var(--primary-light); flex-shrink: 0;
}
.card-name { font-size: 14px; font-weight: 600; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.card-desc { font-size: 12px; color: var(--text-2); line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; min-height: 36px; }
.card-meta { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: auto; }
.tag { font-size: 11px; padding: 2px 7px; border-radius: 999px; background: var(--primary-light); color: var(--primary); }
.tag-web { background: var(--success-light); color: var(--success); }
.tag-warn { background: var(--warn-light); color: var(--warn); }
.price { font-size: 12px; font-weight: 600; color: var(--primary); }
.deadline { font-size: 11px; color: var(--text-2); margin-left: auto; }

/* Empty */
.empty-state { display: none; text-align: center; padding: 60px 0; color: var(--text-2); }
.empty-state.show { display: block; }
.empty-state .big { font-size: 40px; margin-bottom: 10px; }

/* Modal */
.modal-mask {
  position: fixed; inset: 0; background: rgba(0,0,0,.5); display: none; align-items: center; justify-content: center;
  z-index: 1000; padding: 20px;
}
.modal-mask.show { display: flex; }
.modal {
  background: var(--card); border-radius: 16px; padding: 24px; max-width: 420px; width: 100%;
  box-shadow: 0 10px 40px rgba(0,0,0,.2);
}
.modal-icon { font-size: 34px; text-align: center; margin-bottom: 10px; }
.modal h3 { font-size: 16px; text-align: center; margin-bottom: 8px; }
.modal p { font-size: 13px; color: var(--text-2); text-align: center; margin-bottom: 16px; }
.modal-link {
  font-size: 12px; word-break: break-all; background: var(--bg); border: 1px dashed var(--border);
  border-radius: 8px; padding: 10px; margin-bottom: 16px; max-height: 120px; overflow-y: auto;
}
.modal-btns { display: flex; gap: 10px; }
.modal-btns button {
  flex: 1; padding: 10px; border-radius: 8px; border: 0; font-size: 14px; cursor: pointer; transition: all .2s;
}
.btn-copy { background: var(--primary); color: #fff; }
.btn-copy:hover { opacity: .9; }
.btn-close { background: var(--bg); color: var(--text); border: 1px solid var(--border); }

/* Friend links */
.friend-links {
  display: flex; justify-content: center; align-items: center; gap: 8px; flex-wrap: wrap;
  margin-bottom: 14px; font-size: 13px;
}
.fl-label { font-weight: 600; color: var(--text); }
.friend-links a {
  color: var(--text-2); padding: 4px 12px; border: 1px solid var(--border); border-radius: 999px;
  transition: all .2s;
}
.friend-links a:hover { color: var(--primary); border-color: var(--primary); }

/* Footer */
footer.site {
  border-top: 1px solid var(--border); padding: 24px 0 32px; text-align: center; font-size: 12px; color: var(--text-2);
}
footer.site p { margin-bottom: 4px; }

/* Toast */
.toast {
  position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%) translateY(20px); z-index: 1100;
  background: #333; color: #fff; padding: 10px 18px; border-radius: 8px; font-size: 13px;
  opacity: 0; transition: all .3s; pointer-events: none; max-width: 90vw; text-align: center;
}
.toast.show { opacity: 1; transform: translateX(-50%) translateY(0); }
</style>
</head>
<body>
<header class="site">
  <div class="container header-inner">
    <a class="back-btn" href="${BACK_HREF}" aria-label="${BACK_LABEL}">${BACK_LABEL}</a>
    <h1>优惠链接导航</h1>
    <span class="header-stat">已收录 <strong>${links.length}</strong> 个链接</span>
    <button class="theme-btn" id="themeBtn" aria-label="切换深浅色">🌙</button>
  </div>
</header>

<main class="container">
  <div class="search-wrap">
    <div class="search-box">
      <span class="icon">🔍</span>
      <input id="searchInput" type="search" placeholder="搜索链接名称/关键词…" aria-label="搜索链接">
      <button class="search-clear" id="searchClear" aria-label="清除搜索">✕</button>
    </div>
  </div>

  <nav class="tabs" id="tabs" aria-label="链接分类">
    <button class="tab active" data-cat="all">全部<span class="tab-count">${links.length}</span></button>
    ${catTabs}
  </nav>

  <div class="stats-bar" id="statsBar"></div>

  <div class="link-grid" id="linkGrid"></div>

  <div class="empty-state" id="emptyState">
    <div class="big">🔍</div>
    <p>没有找到匹配的链接，换个关键词试试</p>
  </div>
</main>

<footer class="site">
  <div class="friend-links" role="navigation" aria-label="友情链接">
    <span class="fl-label">友情链接</span>
    <a href="https://jdjdndn.github.io" target="_blank" rel="noopener noreferrer">jdjdndn.github.io</a>
    <a href="https://zh.wcbblll.cc" target="_blank" rel="noopener noreferrer">zh.wcbblll.cc</a>
  </div>
  <p>© 2026 券宝 · 优惠链接导航 · 最后更新 ${updated}</p>
  <p>优惠信息有时效性，以各平台实际为准 · 小程序链接请在微信中打开</p>
</footer>

<div class="modal-mask" id="modalMask">
  <div class="modal" role="dialog" aria-modal="true" aria-label="微信链接提示">
    <div class="modal-icon">📲</div>
    <h3>需要在微信中打开</h3>
    <p>此链接为微信专属链接，请复制后在微信中粘贴打开</p>
    <div class="modal-link" id="modalLink"></div>
    <div class="modal-btns">
      <button class="btn-copy" id="copyBtn">复制链接</button>
      <button class="btn-close" id="closeBtn">关闭</button>
    </div>
  </div>
</div>
<div class="toast" id="toast"></div>

${IS_INLINE ? '<script id="link-data" type="application/json">${dataJson}</script>' : '<noscript><p style="text-align:center;padding:20px;color:#6b7280">本页面需要启用 JavaScript 才能加载优惠链接数据</p></noscript>'}
<script>
(function () {
  var LINKS = [];
  var linkDataEl = document.getElementById('link-data');
  if (linkDataEl) {
    try { LINKS = JSON.parse(linkDataEl.textContent); } catch (e) { LINKS = []; }
  }

  function boot() {
    render();
  }
  var currentCat = 'all', currentQuery = '';
  var grid = document.getElementById('linkGrid');
  var statsBar = document.getElementById('statsBar');
  var emptyState = document.getElementById('emptyState');
  var searchInput = document.getElementById('searchInput');
  var searchClear = document.getElementById('searchClear');
  var modalMask = document.getElementById('modalMask');
  var modalLink = document.getElementById('modalLink');
  var pendingUrl = '';

  var CATS = ${JSON.stringify(CATS)};

  function isWechat() { return /MicroMessenger/i.test(navigator.userAgent); }

  function typeLabel(type) {
    if (type === 'miniprogram' || type === 'wechat-business' || type === 'wechat-other') return '微信小程序';
    if (type === 'alipay-miniprogram') return '支付宝小程序';
    return '网站';
  }

  function render() {
    var list = LINKS.filter(function (l) {
      var catOk = currentCat === 'all' || l.category === currentCat;
      var q = currentQuery.trim().toLowerCase();
      var qOk = !q || (l.name + ' ' + (l.desc || '')).toLowerCase().indexOf(q) !== -1;
      return catOk && qOk;
    });
    var count = list.length;
    var catName = currentCat === 'all' ? '全部' : (CATS[currentCat] ? CATS[currentCat].name : '');
    statsBar.textContent = catName + '分类下 ' + count + ' 个链接';
    emptyState.classList.toggle('show', count === 0);

    grid.innerHTML = list.map(function (l) {
      var tags = '<span class="tag">' + typeLabel(l.type) + '</span>';
      if (l.isHttp) tags += '<span class="tag tag-warn">非HTTPS</span>';
      if (l.category === 'wifi' && /代理/.test(l.name)) tags += '<span class="tag tag-web">代理</span>';
      var price = l.price ? '<span class="price">' + l.price + '</span>' : '';
      var deadline = l.deadline ? '<span class="deadline">至 ' + l.deadline + '</span>' : '';
      return '<a class="link-card" href="' + l.url + '" data-idx="' + l.id + '" data-type="' + l.type + '"'
        + (l.type === 'web' ? ' target="_blank" rel="noopener noreferrer"' : '')
        + ' aria-label="' + l.name + '">'
        + '<div class="card-top"><div class="card-icon">' + (CATS[l.category] ? CATS[l.category].emoji : '🔗') + '</div>'
        + '<div class="card-name">' + l.name + '</div></div>'
        + '<div class="card-desc">' + (l.desc || '暂无描述') + '</div>'
        + '<div class="card-meta">' + tags + price + deadline + '</div>'
        + '</a>';
    }).join('');
  }

  function showToast(msg) {
    var t = document.getElementById('toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(t._timer);
    t._timer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text).then(function () { return true; }).catch(function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  function fallbackCopy(text) {
    var ta = document.createElement('textarea');
    ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); return true; } catch (e) { return false; }
    finally { document.body.removeChild(ta); }
  }

  function openWechat(url) {
    if (isWechat()) { window.location.href = url; return; }
    pendingUrl = url;
    modalLink.textContent = url;
    modalMask.classList.add('show');
  }

  // 事件绑定
  grid.addEventListener('click', function (e) {
    var card = e.target.closest('.link-card');
    if (!card) return;
    var type = card.getAttribute('data-type');
    if (type === 'web') return; // 新窗口打开
    e.preventDefault();
    openWechat(card.getAttribute('href'));
  });

  document.getElementById('closeBtn').addEventListener('click', function () {
    modalMask.classList.remove('show');
  });
  modalMask.addEventListener('click', function (e) {
    if (e.target === modalMask) modalMask.classList.remove('show');
  });
  document.getElementById('copyBtn').addEventListener('click', function () {
    copyText(pendingUrl).then(function (ok) {
      modalMask.classList.remove('show');
      showToast(ok ? '已复制，请打开微信粘贴发送，点击即可打开' : '复制失败，请长按链接手动复制');
    });
  });

  document.getElementById('tabs').addEventListener('click', function (e) {
    var tab = e.target.closest('.tab');
    if (!tab) return;
    document.querySelectorAll('.tab').forEach(function (t) { t.classList.remove('active'); });
    tab.classList.add('active');
    currentCat = tab.getAttribute('data-cat');
    if (currentCat !== 'all') { try { history.replaceState(null, '', '#cat-' + currentCat); } catch (e) {} }
    render();
  });

  searchInput.addEventListener('input', function () {
    currentQuery = this.value;
    searchClear.classList.toggle('show', this.value.length > 0);
    render();
  });
  searchClear.addEventListener('click', function () {
    searchInput.value = '';
    currentQuery = '';
    searchClear.classList.remove('show');
    render();
    searchInput.focus();
  });

  // 暗色模式
  var themeBtn = document.getElementById('themeBtn');
  function applyTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeBtn.textContent = dark ? '☀️' : '🌙';
    try { localStorage.setItem('links-theme', dark ? 'dark' : 'light'); } catch (e) {}
  }
  themeBtn.addEventListener('click', function () {
    applyTheme(document.documentElement.getAttribute('data-theme') !== 'dark');
  });
  var savedTheme = null;
  try { savedTheme = localStorage.getItem('links-theme'); } catch (e) {}
  var systemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(savedTheme ? savedTheme === 'dark' : systemDark);

  // URL hash 恢复分类
  try {
    var h = location.hash.replace('#cat-', '');
    if (h && h !== 'all' && document.querySelector('.tab[data-cat="' + h + '"]')) {
      document.querySelector('.tab[data-cat="' + h + '"]').click();
    }
  } catch (e) {}

  if (linkDataEl) {
    boot();
  } else {
    fetch('links-data.json')
      .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .then(function (d) {
        LINKS = d.links || [];
        var statStrong = document.querySelector('.header-stat strong');
        if (statStrong) statStrong.textContent = LINKS.length;
        var allTab = document.querySelector('.tab[data-cat="all"] .tab-count');
        if (allTab) allTab.textContent = LINKS.length;
        boot();
      })
      .catch(function () {
        statsBar.textContent = '数据加载失败，请刷新重试';
        emptyState.classList.add('show');
        emptyState.querySelector('p').textContent = '无法加载优惠链接数据，请稍后刷新页面';
      });
  }
})();
</script>
</body>
</html>
`;

fs.writeFileSync(OUT, html, 'utf8');
console.log(`✅ 生成 ${OUT}（模式: ${MODE}）`);
console.log(`   链接总数: ${links.length}`);
const typeCount = {};
for (const l of links) typeCount[l.type] = (typeCount[l.type] || 0) + 1;
console.log(`   类型分布: ${Object.entries(typeCount).map(([t, n]) => `${t}: ${n}`).join(' / ')}`);
for (const [id, c] of Object.entries(CATS)) {
  if (catCount[id]) console.log(`   ${c.emoji} ${c.name}: ${catCount[id]}`);
}
