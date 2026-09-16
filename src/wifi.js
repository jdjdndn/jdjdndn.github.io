// ========== 随身WiFi 专区页面逻辑 ==========
import QRCode from 'qrcode';
import { wifiLinks, wifiProxyLinks } from './wifi-data.js';

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
const BADGE_CLASS = { '热门': 'wifi-badge-hot', '新品': 'wifi-badge-new' };

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
      .map((t) => `<span class="wifi-tag">${t}</span>`)
      .join('');
    const productIcon = getProductIcon(item.name);
    const badgeHtml = item.badge ? `<span class="wifi-badge ${BADGE_CLASS[item.badge] || ''}">${item.badge}</span>` : '';
    const clickCount = clickCounts[item.name] || 0;

    return `
      <article class="wifi-card">
        <div class="wifi-card-top"></div>
        <div class="wifi-card-body">
          <div class="wifi-card-header">
            <div class="wifi-card-platform-icon">${productIcon}</div>
            <div class="wifi-card-info">
              <span class="wifi-card-name">${item.name}${badgeHtml}</span>
            </div>
            ${item.priceRange ? `<span class="wifi-card-price">${item.priceRange}</span>` : ''}
          </div>
          <p class="wifi-card-desc">${item.description || ''}</p>
          ${tags ? `<div class="wifi-card-meta">${tags}${clickCount > 0 ? `<span class="wifi-tag">已购买${formatCount(clickCount)}次</span>` : ''}${getVisited().includes(item.url) ? `<span class="wifi-tag wifi-visited">✓ 已访问</span>` : ''}</div>` : ''}
          <div class="wifi-card-actions">
            <a class="btn-go" href="${item.url}" target="_blank" rel="noopener sponsored">
              ${ICONS.external}
              立即购买
            </a>
            <button class="btn-qr" data-link="${item.url}" data-name="${item.name.replace(/"/g, '&quot;')}">
              ${ICONS.qr}
              扫码
            </button>
          </div>
        </div>
      </article>
    `;
  }).join('');
};

// ========== 二维码弹窗 ==========
const qrOverlay = $('#qr-overlay');
const qrImg = $('#qr-img');
const qrName = $('#qr-name');
const qrClose = $('#qr-close');
let lastFocusedElement = null;
let currentQrUrl = '';

const showQrModal = async (url, name) => {
  lastFocusedElement = document.activeElement;
  currentQrUrl = url;
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
  currentQrUrl = '';
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

// ========== 事件委托 ==========
document.addEventListener('click', (e) => {
  const qrBtn = e.target.closest('.btn-qr');
  if (qrBtn) {
    showQrModal(qrBtn.dataset.link, qrBtn.dataset.name);
    return;
  }
  const goBtn = e.target.closest('.btn-go');
  if (goBtn) {
    const card = goBtn.closest('.wifi-card');
    if (card) {
      const nameEl = card.querySelector('.wifi-card-name');
      const name = nameEl?.childNodes?.[0]?.textContent?.trim() || nameEl?.textContent?.trim();
      if (name) trackClick(name);
      markVisited(goBtn.href);
    }
  }
});

qrClose.addEventListener('click', hideQrModal);
qrOverlay.addEventListener('click', (e) => {
  if (e.target === qrOverlay) hideQrModal();
});

// ========== QR弹窗分享按钮 ==========
const setupQrShare = () => {
  const qrBody = qrOverlay.querySelector('.qr-body');
  if (!qrBody || qrBody.querySelector('.qr-share')) return;
  const shareEl = document.createElement('div');
  shareEl.className = 'qr-share';
  shareEl.innerHTML = `<button class="qr-share-copy" aria-label="复制链接">复制链接</button><button class="qr-share-native" aria-label="分享给朋友" style="display:none">分享给朋友</button><button class="qr-share-download" aria-label="保存二维码">保存二维码</button>`;
  qrBody.appendChild(shareEl);
  const copyBtn = shareEl.querySelector('.qr-share-copy');
  const nativeBtn = shareEl.querySelector('.qr-share-native');
  const dlBtn = shareEl.querySelector('.qr-share-download');
  copyBtn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(currentQrUrl); showToast('链接已复制'); } catch { showToast('复制失败'); }
  });
  if (navigator.share) {
    nativeBtn.style.display = '';
    nativeBtn.addEventListener('click', async () => {
      try { await navigator.share({ title: qrName.textContent, url: currentQrUrl }); } catch {}
    });
  }
  dlBtn.addEventListener('click', () => {
    const a = document.createElement('a');
    a.href = qrImg.src;
    a.download = `${qrName.textContent || 'qrcode'}.png`;
    a.click();
  });
};
setupQrShare();
document.addEventListener('keydown', (e) => {
  if (qrOverlay.classList.contains('hidden')) return;
  if (e.key === 'Escape') {
    hideQrModal();
    return;
  }
  if (e.key === 'Tab') {
    const focusable = Array.from(qrOverlay.querySelectorAll('button, [href], [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
});

// ========== 暗色模式 ==========
const initDarkMode = () => {
  const saved = localStorage.getItem('darkMode');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'true' || (!saved && prefersDark)) {
    document.body.classList.add('dark-mode');
  }
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
const backToTop = document.createElement('button');
backToTop.className = 'back-to-top hidden';
backToTop.setAttribute('aria-label', '回到顶部');
backToTop.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>';
document.body.appendChild(backToTop);
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('hidden', window.scrollY < 300);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ========== 初始化 ==========
initDarkMode();
renderCards();
renderAgentHook();

const darkToggle = $('#dark-toggle');
if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
