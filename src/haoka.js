// ========== 号卡专区页面逻辑 ==========
import QRCode from 'qrcode';
import { haokaLinks, haokaProxyLinks } from './haoka-data.js';
import { track } from './analytics.js';

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
    const badgeHtml = item.badge ? `<span class="haoka-badge ${BADGE_CLASS[item.badge] || ''}">${item.badge}</span>` : '';
    const clickCount = clickCounts[item.name] || 0;
    return `
      <article class="haoka-card">
        <div class="haoka-card-top"></div>
        <div class="haoka-card-body">
          <div class="haoka-card-header">
            <div class="haoka-card-platform-icon">${getPlatformIcon(item.url)}</div>
            <div class="haoka-card-info">
              <span class="haoka-card-name">${item.name}${badgeHtml}</span>
            </div>
            ${item.priceRange ? `<span class="haoka-card-price"><span class="haoka-price-text">${item.priceRange}</span></span>` : ''}
          </div>
          <p class="haoka-card-desc">${item.description || ''}</p>
          <div class="haoka-card-meta">
            <span class="haoka-tag">${ICONS.check} 正规授权</span>
            ${item.nationwide ? `<span class="haoka-tag">${ICONS.check} 全国配送</span>` : ''}
            ${clickCount > 0 ? `<span class="haoka-tag">${ICONS.check} 已办理${formatCount(clickCount)}次</span>` : ''}
            ${getVisited().includes(item.url) ? `<span class="haoka-tag haoka-visited">✓ 已访问</span>` : ''}
          </div>
          <div class="haoka-card-actions">
            <a class="btn-go" href="${item.url}" target="_blank" rel="noopener sponsored">
              ${ICONS.external}
              立即办理
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
    track('haoka_qr', { name: qrBtn.dataset.name });
    showQrModal(qrBtn.dataset.link, qrBtn.dataset.name);
    return;
  }
  const goBtn = e.target.closest('.btn-go');
  if (goBtn) {
    const card = goBtn.closest('.haoka-card');
    if (card) {
      const nameEl = card.querySelector('.haoka-card-name');
      const name = nameEl?.childNodes?.[0]?.textContent?.trim() || nameEl?.textContent?.trim();
      track('haoka_click', { name: name || '' });
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
  const isDark = document.body.classList.contains('dark-mode');
  track('dark_mode_toggle', { mode: isDark ? 'dark' : 'light', page: 'haoka' });
  localStorage.setItem('darkMode', isDark);
  updateDarkToggleText();
};

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

// 动态更新"最近更新"时间
const updateEl = $('#haoka-update-time');
if (updateEl) {
  const now = new Date();
  updateEl.textContent = `${now.getFullYear()}年${now.getMonth() + 1}月`;
}

const darkToggle = $('#dark-toggle');
if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);

// ========== 充话费微信按钮 ==========
const rechargeBtn = $('#recharge-wechat');
if (rechargeBtn) {
  rechargeBtn.addEventListener('click', async () => {
    const wechatId = rechargeBtn.dataset.wechat;
    try {
      await navigator.clipboard.writeText(wechatId);
      showToast(`微信号 ${wechatId} 已复制，打开微信搜索添加`);
    } catch {
      try {
        const ta = document.createElement('textarea');
        ta.value = wechatId;
        ta.style.cssText = 'position:fixed;left:-9999px';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        showToast(`微信号 ${wechatId} 已复制，打开微信搜索添加`);
      } catch {
        showToast('复制失败，请手动搜索微信号：wcbblll');
      }
    }
  });
}
