// ========== 推广活动页面逻辑 ==========
import QRCode from 'qrcode';
import { activities } from './jutuike-data.js';
import { track } from './analytics.js';

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const showToast = (msg = '已复制') => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast();
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast();
    } catch {
      showToast('复制失败，请长按手动复制');
    }
  }
};

// ========== 分类 Tab ==========
const CATE_ICONS = {
  '美团': '🍜',
  '饿了么': '🟢',
  '京东外卖': '🔴',
  '打车出行': '🚗',
  '特惠酒店': '🏨',
  '电影票': '🎬',
  '快递优惠': '📦',
  '连锁餐饮': '☕',
  '本地生活': '🏠',
  '电商': '🛒',
};

// 显示名映射（API 分类名 → 页面展示名）
const CATE_DISPLAY = {
  '饿了么': '淘宝闪购',
};

// 按分类聚合（过滤已过期活动）
const categorize = () => {
  const today = new Date().toISOString().slice(0, 10);
  const map = new Map();
  for (const act of activities) {
    // 过滤已过期活动
    if (act.endDate && act.endDate < today) continue;
    const cat = act.category;
    if (!map.has(cat)) map.set(cat, []);
    map.get(cat).push(act);
  }
  // 按 CATE_ICONS 顺序排列
  const ordered = [];
  for (const cat of Object.keys(CATE_ICONS)) {
    if (map.has(cat)) ordered.push({ category: cat, items: map.get(cat) });
  }
  // 其余分类
  for (const [cat, items] of map) {
    if (!(cat in CATE_ICONS)) ordered.push({ category: cat, items });
  }
  return ordered;
};

// ========== 渲染 Tab 导航 ==========
const renderTabNav = (categories) => {
  const nav = $('#tab-nav');
  const total = activities.length;
  let html = `<button class="tab-btn active" data-tab="all" role="tab" aria-selected="true"><span class="tab-name">全部</span><span class="badge">${total}</span></button>`;
  for (const cat of categories) {
    const icon = CATE_ICONS[cat.category] || '📋';
    const displayName = CATE_DISPLAY[cat.category] || cat.category;
    html += `<button class="tab-btn" data-tab="${cat.category}" role="tab" aria-selected="false"><span class="tab-name">${displayName}</span><span class="badge">${cat.items.length}</span></button>`;
  }
  html += `<button class="tab-btn" data-tab="ele-store" role="tab" aria-selected="false"><span class="tab-name">淘宝闪购单店</span></button>`;
  nav.innerHTML = html;
};

// ========== 渲染活动卡片 ==========
const renderCard = (act) => {
  const hasH5 = !!act.h5;
  const hasTkl = !!act.tkl;
  const iconHtml = act.icon
    ? `<img src="${act.icon}" alt="" loading="lazy" />`
    : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`;

  const desc = act.desc || act.name;
  const dateInfo = act.startDate && act.endDate
    ? `<span class="jt-card-tag date">活动时间: ${act.startDate} ~ ${act.endDate}</span>`
    : '';

  return `
    <article class="jt-card" data-act-id="${act.act_id}">
      <div class="jt-card-head">
        <div class="jt-card-icon">${iconHtml}</div>
        <div class="jt-card-info">
          <div class="jt-card-name">${act.name}</div>
          <div class="jt-card-category">${CATE_ICONS[act.category] || '📋'} ${CATE_DISPLAY[act.category] || act.category}</div>
        </div>
      </div>
      <div class="jt-card-body">
        <p class="jt-card-desc">${desc}</p>
        <div class="jt-card-meta">
          ${dateInfo}
        </div>
      </div>
      <div class="jt-card-actions">
        ${hasH5 ? `<a class="btn-go" href="${act.h5}" target="_blank" rel="noopener">前往活动</a>` : ''}
        ${hasH5 ? `<button class="btn-qr" data-link="${act.h5}" data-name="${act.name.replace(/"/g, '&quot;')}">二维码</button>` : ''}
        ${!hasH5 && hasTkl ? `<button class="btn-copy-tkl" data-tkl="${act.tkl.replace(/"/g, '&quot;')}">复制口令</button>` : ''}
      </div>
    </article>
  `;
};

const renderContent = (categories, query = '') => {
  const content = $('#tab-content');
  if (!categories.length) {
    content.innerHTML = `<div class="jt-empty">没有找到匹配的活动</div>`;
    return;
  }
  content.innerHTML = categories.map((cat) => `
    <section class="sub-section" aria-labelledby="section-${cat.category}">
      <h2 class="sub-section-title" id="section-${cat.category}">${CATE_ICONS[cat.category] || '📋'} ${CATE_DISPLAY[cat.category] || cat.category}（${cat.items.length}）</h2>
      <div class="jt-card-grid">
        ${cat.items.map(renderCard).join('')}
      </div>
    </section>
  `).join('');
};

// ========== Tab 切换 ==========
let activeTab = 'all';
let allCategories = [];

const switchTab = (tabId) => {
  activeTab = tabId;
  history.replaceState(null, '', `#${tabId}`);
  $$('.tab-btn').forEach((btn) => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  const activeBtn = $('#tab-nav')?.querySelector('.tab-btn.active');
  if (activeBtn) activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });

  if (tabId === 'ele-store') {
    $('.search-bar')?.classList.add('hidden');
    $('#search-count')?.classList.remove('visible');
    renderEleStore();
  } else {
    $('.search-bar')?.classList.remove('hidden');
    renderFiltered();
  }
};

const renderFiltered = () => {
  const query = ($('#search-input')?.value || '').trim().toLowerCase();
  let filtered = activeTab === 'all'
    ? allCategories
    : allCategories.filter((c) => c.category === activeTab);

  if (query) {
    filtered = filtered.map((cat) => ({
      ...cat,
      items: cat.items.filter((a) =>
        a.name.toLowerCase().includes(query) ||
        a.desc.toLowerCase().includes(query) ||
        a.category.toLowerCase().includes(query) ||
        (CATE_DISPLAY[a.category] || '').toLowerCase().includes(query)
      ),
    })).filter((cat) => cat.items.length > 0);
  }
  renderContent(filtered, query);

  // 搜索计数
  const countEl = $('#search-count');
  if (query) {
    const total = filtered.reduce((s, c) => s + c.items.length, 0);
    countEl.textContent = `找到 ${total} 个匹配结果`;
    countEl.classList.add('visible');
  } else {
    countEl.classList.remove('visible');
  }
};

// ========== 事件委托 ==========
$('#tab-nav').addEventListener('click', (e) => {
  const btn = e.target.closest('.btn-go, .tab-btn');
  if (!btn) return;
  if (btn.dataset.tab) switchTab(btn.dataset.tab);
});

$('#tab-content').addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.btn-copy-tkl');
  if (copyBtn) {
    const tkl = copyBtn.dataset.tkl.replace(/&quot;/g, '"').replace(/&amp;/g, '&');
    copyText(tkl);
    copyBtn.classList.add('success');
    copyBtn.textContent = '✓ 已复制';
    setTimeout(() => {
      copyBtn.classList.remove('success');
      copyBtn.textContent = '复制口令';
    }, 1500);
    return;
  }

  const qrBtn = e.target.closest('.btn-qr');
  if (qrBtn) {
    showQrModal(qrBtn.dataset.link, qrBtn.dataset.name);
  }
});

// 搜索
let searchTimer;
$('#search-input').addEventListener('input', () => {
  clearTimeout(searchTimer);
  searchTimer = setTimeout(renderFiltered, 150);
});
$('#search-clear').addEventListener('click', () => {
  $('#search-input').value = '';
  renderFiltered();
  $('#search-input').focus();
});

// ========== 二维码弹窗 ==========
const qrOverlay = $('#qr-overlay');
const qrImg = $('#qr-img');
const qrName = $('#qr-name');
const qrClose = $('#qr-close');
let lastFocusedElement = null;

const showQrModal = async (url, name) => {
  lastFocusedElement = document.activeElement;
  const qrLoading = $('#qr-loading');
  qrLoading.innerHTML = '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg><span>生成中…</span>';
  qrLoading.classList.remove('hidden');
  qrImg.classList.add('hidden');
  qrName.textContent = name;
  qrOverlay.classList.remove('hidden');
  qrClose.focus();
  try {
    qrImg.src = await QRCode.toDataURL(url, { width: 240, margin: 2 });
    qrLoading.classList.add('hidden');
    qrImg.classList.remove('hidden');
  } catch {
    qrLoading.innerHTML = '<span style="color:var(--danger)">生成失败，请重试</span>';
  }
};

const hideQrModal = () => {
  qrOverlay.classList.add('hidden');
  qrImg.src = '';
  if (lastFocusedElement) { lastFocusedElement.focus(); lastFocusedElement = null; }
};

qrClose.addEventListener('click', hideQrModal);
qrOverlay.addEventListener('click', (e) => { if (e.target === qrOverlay) hideQrModal(); });
document.addEventListener('keydown', (e) => {
  if (qrOverlay.classList.contains('hidden')) return;
  if (e.key === 'Escape') { hideQrModal(); return; }
  if (e.key === 'Tab') {
    const focusable = Array.from(qrOverlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
});

// ========== 饿了么单店 ==========
const ELE_STORE_API = 'http://api.jutuike.com/ele/store_list';
const ELE_API_KEY = '1F9whoRtiuKjGjYiH2KlAnhhyRXfdE4u';
const ELE_SID = 'h5mall';

let eleStoreState = { sessionId: null, loading: false, loaded: false };

const renderStoreCard = (store) => `
  <article class="jt-card jt-store-card">
    <div class="jt-card-head">
      <div class="jt-card-icon jt-store-logo">
        ${store.shop_logo ? `<img src="${store.shop_logo}" alt="" loading="lazy" />` : '🏪'}
      </div>
      <div class="jt-card-info">
        <div class="jt-card-name">${store.title}</div>
        <div class="jt-card-category">${store.indistinct_monthly_sales || ''}</div>
      </div>
    </div>
    <div class="jt-card-actions">
      ${store.link?.wx_appid ? `<button class="btn-go btn-wx" data-appid="${store.link.wx_appid}" data-path="${store.link.wx_path || ''}">打开小程序</button>` : ''}
    </div>
  </article>
`;

const renderEleStore = async () => {
  const content = $('#tab-content');

  if (!eleStoreState.loaded && !eleStoreState.loading) {
    content.innerHTML = `<div class="jt-loading" id="ele-store-loading">
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      <p>正在获取定位并加载附近店铺…</p>
    </div>`;

    try {
      const pos = await new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error('浏览器不支持定位'));
        navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 });
      });
      await fetchEleStores(pos.coords.longitude, pos.coords.latitude);
    } catch (err) {
      const msg = err.code === 1 ? '定位权限被拒绝，请在浏览器设置中允许定位' : err.message || '定位失败';
      content.innerHTML = `<div class="jt-empty">📍 ${msg}</div>`;
    }
    return;
  }

  if (eleStoreState.loaded) renderEleStoreList();
};

const fetchEleStores = async (lng, lat, append = false) => {
  eleStoreState.loading = true;
  const content = $('#tab-content');
  const loadingEl = $('#ele-store-loading');

  if (!append && loadingEl) {
    loadingEl.innerHTML = `<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--primary)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spinner"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg><p>加载中…</p>`;
  }

  try {
    let body = `apikey=${ELE_API_KEY}&longitude=${lng}&latitude=${lat}&page_size=10`;
    if (eleStoreState.sessionId) body += `&session_id=${eleStoreState.sessionId}`;

    const res = await fetch(ELE_STORE_API, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body }).then(r => r.json());

    if (res.code !== 1 || !res.data) throw new Error(res.msg || '请求失败');

    const stores = res.data.records?.store_promotion_dto || [];
    eleStoreState.sessionId = res.data.session_id || null;
    eleStoreState.loaded = true;
    eleStoreState.loading = false;

    if (!append) {
      window.__eleStores = [];
    }
    window.__eleStores.push(...stores);
    renderEleStoreList();
  } catch (err) {
    eleStoreState.loading = false;
    if (append) {
      showToast('加载失败，请重试');
    } else {
      content.innerHTML = `<div class="jt-empty">加载失败: ${err.message}</div>`;
    }
  }
};

const renderEleStoreList = () => {
  const content = $('#tab-content');
  const stores = window.__eleStores || [];

  if (!stores.length) {
    content.innerHTML = `<div class="jt-empty">附近暂无店铺</div>`;
    return;
  }

  content.innerHTML = `
    <section class="sub-section">
      <h2 class="sub-section-title">🏪 附近淘宝闪购店铺（${stores.length}）</h2>
      <div class="jt-card-grid">${stores.map(renderStoreCard).join('')}</div>
      ${eleStoreState.sessionId ? `<div class="jt-store-more"><button class="btn-load-more" id="btn-load-more-store">加载更多</button></div>` : ''}
    </section>
  `;

  $('#btn-load-more-store')?.addEventListener('click', loadMoreEleStores);
};

const loadMoreEleStores = async () => {
  const btn = $('#btn-load-more-store');
  if (!btn || !eleStoreState.sessionId) return;
  btn.textContent = '加载中…';
  btn.disabled = true;

  // 需要重新获取定位（或缓存）
  try {
    const pos = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 10000, maximumAge: 600000 });
    });
    await fetchEleStores(pos.coords.longitude, pos.coords.latitude, true);
  } catch {
    showToast('定位失败，请重试');
    btn.textContent = '加载更多';
    btn.disabled = false;
  }
};

// ========== 暗色模式 ==========
const initDarkMode = () => {
  const saved = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'true' || (!saved && prefersDark)) document.body.classList.add('dark-mode');
  updateDarkToggleText();
};
const updateDarkToggleText = () => {
  const textEl = $('#dark-toggle-text');
  if (textEl) textEl.textContent = document.body.classList.contains('dark-mode') ? '亮色' : '暗色';
};
const toggleDarkMode = () => {
  document.body.classList.toggle('dark-mode');
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  updateDarkToggleText();
};
$('#dark-toggle')?.addEventListener('click', toggleDarkMode);

// ========== 初始化 ==========
initDarkMode();

allCategories = categorize();
renderTabNav(allCategories);

// 从 hash 恢复上次的 tab
const hashTab = decodeURIComponent(location.hash.replace('#', ''));
if (hashTab && hashTab !== 'all') {
  const validTab = allCategories.some((c) => c.category === hashTab) || hashTab === 'ele-store';
  if (validTab) {
    activeTab = hashTab;
    $$('.tab-btn').forEach((btn) => {
      const isActive = btn.dataset.tab === hashTab;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-selected', isActive);
    });
  }
}

if (activeTab === 'ele-store') {
  $('.search-bar')?.classList.add('hidden');
  renderEleStore();
} else {
  renderFiltered();
}

// 更新统计
const statEl = $('#stat-activities');
if (statEl) {
  statEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg> 已收录 <strong>${activities.length}</strong> 个活动`;
}

// 回到顶部
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top hidden';
backToTop.setAttribute('aria-label', '回到顶部');
backToTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
document.body.appendChild(backToTop);
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('hidden', window.scrollY < 300);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
