// CSS 已通过 <link> 标签在 HTML <head> 中同步加载

// ========== 随身WiFi 专区页面逻辑 ==========
import { wifiLinks, wifiProxyLinks } from './wifi-data.js';
import { track } from './analytics.js';
import { createSharePanel, shareItem } from './common/share.js';
import { initBackToTop } from './common/back-to-top.js';
// 暗色模式 analytics 回调
window.__darkModeOnToggle = (isDark) => track('dark_mode_toggle', { mode: isDark ? 'dark' : 'light', page: 'wifi' });
// qr-modal 按需加载
let _qrModalPromise = null;
const loadQrModal = () => {
  if (!_qrModalPromise) _qrModalPromise = import('./common/qr-modal.js');
  return _qrModalPromise;
};

const $ = (sel) => document.querySelector(sel);

const showToast = (msg = '已复制') => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 2500);
};

// ========== SVG 图标 ==========
const ICONS = {
  external: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  qr: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4" rx="1"/><line x1="22" y1="14" x2="22" y2="14.01"/><line x1="18" y1="18" x2="18" y2="18.01"/><line x1="14" y1="22" x2="14" y2="22.01"/><line x1="18" y1="22" x2="18" y2="22.01"/><line x1="22" y1="18" x2="22" y2="18.01"/><line x1="22" y1="22" x2="22" y2="22.01"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0114.08 0"/><path d="M1.42 9a16 16 0 0121.16 0"/><path d="M8.53 16.11a6 6 0 016.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  router: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="20" height="7" rx="2"/><circle cx="7" cy="17.5" r="1.5" fill="currentColor"/><circle cx="12" cy="17.5" r="1.5" fill="currentColor"/><path d="M12 3v8"/><path d="M8 7l4-4 4 4"/></svg>',
  battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="6" width="18" height="12" rx="2"/><line x1="23" y1="10" x2="23" y2="14"/><rect x="4" y="9" width="5" height="6" rx="1" fill="currentColor" opacity="0.3"/><rect x="11" y="9" width="5" height="6" rx="1" fill="currentColor" opacity="0.3"/></svg>',
  signal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 20V4"/></svg>',
};

// ========== 根据产品名判断图标 ==========
const getProductIcon = (name) => {
  if (name.includes('CPE') || name.includes('宽带')) return ICONS.router;
  if (name.includes('充电宝')) return ICONS.battery;
  if (name.includes('联通') || name.includes('单网')) return ICONS.signal;
  return ICONS.wifi;
};

// ========== 徽章 ==========
const BADGE_CLASS = { '热门': 'haoka-badge-hot', '新品': 'haoka-badge-new' };

// ========== 点击追踪 ==========
const getClickCounts = () => { try { return JSON.parse(localStorage.getItem('wifiClicks') || '{}'); } catch { return {}; } };
const trackClick = (name) => {
  const counts = getClickCounts();
  counts[name] = (counts[name] || 0) + 1;
  try { localStorage.setItem('wifiClicks', JSON.stringify(counts)); } catch {}
};
const formatCount = (n) => n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n >= 1000 ? `${(n / 1000).toFixed(1)}千` : String(n);

// ========== 已访问标记 ==========
const getVisited = () => { try { return JSON.parse(localStorage.getItem('wifiVisited') || '[]'); } catch { return []; } };
const markVisited = (url) => {
  const list = getVisited();
  if (!list.includes(url)) { list.push(url); try { localStorage.setItem('wifiVisited', JSON.stringify(list)); } catch {} }
};

// ========== 渲染 WiFi 卡片 ==========
const renderCards = () => {
  const main = $('#main-content');
  const countEl = $('#wifi-count');
  if (countEl) countEl.textContent = wifiLinks.length;

  const clickCounts = getClickCounts();
  main.innerHTML = wifiLinks.map((item) => {
    const tags = (item.tags || [])
      .map((t) => `<span class="card-tag">${t}</span>`)
      .join('');
    const productIcon = getProductIcon(item.name);
    const clickCount = clickCounts[item.name] || 0;

    // 构建标签
    const metaTags = [];
    if (tags) metaTags.push(tags);
    if (clickCount > 0) {
      metaTags.push(`<span class="card-tag">已购买${formatCount(clickCount)}次</span>`);
    }
    if (getVisited().includes(item.url)) {
      metaTags.push(`<span class="card-tag card-visited">✓ 已访问</span>`);
    }

    return `
      <product-card
        name="${item.name.replace(/"/g, '&quot;')}"
        description="${(item.description || '').replace(/"/g, '&quot;')}"
        price="${(item.priceRange || '').replace(/"/g, '&quot;')}"
        badge="${(item.badge || '').replace(/"/g, '&quot;')}"
        url="${item.url}"
        platform-icon="${productIcon.replace(/"/g, '&quot;')}"
      >
        ${metaTags.length ? `<div slot="card-meta" class="card-meta">${metaTags.join('')}</div>` : ''}
      </product-card>
    `;
  }).join('');
};

// ========== 事件委托 ==========
document.addEventListener('click', (e) => {
  const card = e.target.closest('product-card');
  if (card) {
    card.addEventListener('qr-click', handleQrClick);
    card.addEventListener('card-click', handleCardClick);
  }
});

// QR 码点击处理
const handleQrClick = (e) => {
  const { url, name } = e.detail;
  track('wifi_qr', { name });
  loadQrModal().then(m => m.showQrModal(url, name));
};

// 卡片点击处理
const handleCardClick = (e) => {
  const { url, name } = e.detail;
  track('wifi_click', { name: name || '' });
  if (name) trackClick(name);
  markVisited(url);
};

createSharePanel(track);

// ========== 渲染代理注册列表 ==========
const renderAgentHook = () => {
  const hook = document.querySelector('.agent-hook');
  if (!hook || !wifiProxyLinks.length) return;

  const registerBtns = wifiProxyLinks.map((p) => `
      <a class="agent-register-btn" href="${p.url}" target="_blank" rel="noopener sponsored">
        <span class="agent-register-name">${p.name}</span>
      </a>
    `).join('');

  const oldCta = hook.querySelector('.agent-cta');
  const oldContact = hook.querySelector('.agent-hook-contact');
  if (oldCta) {
    const container = document.createElement('div');
    container.className = 'agent-register-list';
    container.innerHTML = registerBtns;
    oldCta.replaceWith(container);
  }
  if (oldContact) oldContact.remove();
};

// ========== 回到顶部 ==========
initBackToTop();

// ========== 初始化 ==========
renderCards();
renderAgentHook();
