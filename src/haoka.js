// CSS 已通过 <link> 标签在 HTML <head> 中同步加载

// ========== 号卡专区页面逻辑 ==========
import { track } from './analytics.js';
import { initBackToTop } from './common/back-to-top.js';
import { createSharePanel } from './common/share.js';
import { haokaLinks, haokaProxyLinks } from './haoka-data.js';
// 暗色模式 analytics 回调
window.__darkModeOnToggle = (isDark) => track('dark_mode_toggle', { mode: isDark ? 'dark' : 'light', page: 'haoka' });
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
  check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
  // 平台专属图标
  platform: {
    'ksjhaoka': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>',
    '172': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
    'haokaxinyao': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    'kakatx': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
    'dandanhou': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
    'default': '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>',
  },
};

// ========== 徽章映射 ==========
const BADGE_CLASS = { '热门': 'haoka-badge-hot', '新品': 'haoka-badge-new', '四网': 'haoka-badge-four', '推荐': 'haoka-badge-rec' };

// ========== 点击追踪 ==========
const getClickCounts = () => { try { return JSON.parse(localStorage.getItem('haokaClicks') || '{}'); } catch { return {}; } };
const trackClick = (name) => {
  const counts = getClickCounts();
  counts[name] = (counts[name] || 0) + 1;
  try { localStorage.setItem('haokaClicks', JSON.stringify(counts)); } catch {}
};
const formatCount = (n) => n >= 10000 ? `${(n / 10000).toFixed(1)}万` : n >= 1000 ? `${(n / 1000).toFixed(1)}千` : String(n);

// ========== 已访问标记 ==========
const getVisited = () => { try { return JSON.parse(localStorage.getItem('haokaVisited') || '[]'); } catch { return []; } };
const markVisited = (url) => {
  const list = getVisited();
  if (!list.includes(url)) { list.push(url); try { localStorage.setItem('haokaVisited', JSON.stringify(list)); } catch {} }
};

// 根据 URL 获取平台标识
const getPlatformKey = (url) => {
  if (url.includes('ksjhaoka')) return 'ksjhaoka';
  if (url.includes('172.org')) return '172';
  if (url.includes('haokaxinyao')) return 'haokaxinyao';
  if (url.includes('kakatx')) return 'kakatx';
  if (url.includes('dandanhou')) return 'dandanhou';
  return 'default';
};

const getPlatformIcon = (url) => ICONS.platform[getPlatformKey(url)] || ICONS.platform.default;

// ========== 渲染号卡卡片 ==========
const renderCards = () => {
  const main = $('#main-content');
  const clickCounts = getClickCounts();

  main.innerHTML = haokaLinks.map((item) => {
    const clickCount = clickCounts[item.name] || 0;
    const platformIcon = getPlatformIcon(item.url);

    // 构建标签
    const metaTags = [];
    metaTags.push(`<span class="card-tag">${ICONS.check} 正规授权</span>`);
    if (item.nationwide) {
      metaTags.push(`<span class="card-tag">${ICONS.check} 全国配送</span>`);
    }
    if (clickCount > 0) {
      metaTags.push(`<span class="card-tag">${ICONS.check} 已办理${formatCount(clickCount)}次</span>`);
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
        platform-icon="${platformIcon.replace(/"/g, '&quot;')}"
        ${item.nationwide ? 'nationwide' : ''}
      >
        <div slot="card-meta" class="card-meta">
          ${metaTags.join('')}
        </div>
      </product-card>
    `;
  }).join('');
};

// ========== 事件委托 ==========
document.addEventListener('click', (e) => {
  // product-card 组件的自定义事件
  const card = e.target.closest('product-card');
  if (card) {
    // 处理自定义事件
    card.addEventListener('qr-click', handleQrClick);
    card.addEventListener('card-click', handleCardClick);
  }
});

// QR 码点击处理
const handleQrClick = (e) => {
  const { url, name } = e.detail;
  track('haoka_qr', { name });
  loadQrModal().then(m => m.showQrModal(url, name));
};

// 卡片点击处理
const handleCardClick = (e) => {
  const { url, name } = e.detail;
  track('haoka_click', { name: name || '' });
  if (name) trackClick(name);
  markVisited(url);
};

createSharePanel(track);

// ========== 渲染代理注册列表 ==========
const renderAgentHook = () => {
  const hook = document.querySelector('.agent-hook');
  if (!hook || !haokaProxyLinks.length) return;

  const registerBtns = haokaProxyLinks.map((p) => `
      <a class="agent-register-btn" href="${p.url}" target="_blank" rel="noopener sponsored">
        <span class="agent-register-name">${p.name}</span>
      </a>
    `).join('');

  // 替换原来的单个 CTA，改为多按钮注册列表
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

// ========== 充话费微信按钮 ==========
// const rechargeBtn = $('#recharge-wechat');
// if (rechargeBtn) {
//   rechargeBtn.addEventListener('click', async () => {
//     const wechatId = rechargeBtn.dataset.wechat;
//     try {
//       await navigator.clipboard.writeText(wechatId);
//       showToast(`微信号 ${wechatId} 已复制，打开微信搜索添加`);
//     } catch {
//       try {
//         const ta = document.createElement('textarea');
//         ta.value = wechatId;
//         ta.style.cssText = 'position:fixed;left:-9999px';
//         document.body.appendChild(ta);
//         ta.select();
//         document.execCommand('copy');
//         document.body.removeChild(ta);
//         showToast(`微信号 ${wechatId} 已复制，打开微信搜索添加`);
//       } catch {
//         showToast('复制失败，请手动搜索微信号：wcbblll');
//       }
//     }
//   });
// }
