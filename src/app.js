// CSS 已通过 <link> 标签在 HTML <head> 中同步加载

// ========== 导入模块 ==========
import { track } from './analytics.js';
import { initBackToTop } from './common/back-to-top.js';
import { copyText } from './common/base.js';
import { createSharePanel, shareItem } from './common/share.js';
import { tabs } from './data.js';
import { $, $$, debounce, isExpired, countUp } from './common/utils.js';
import { ICONS } from './common/icons.js';
import {
  tabNav, tabContent, headerStats, quickShortcuts,
  calcTabCounts,
  renderTabNav, renderTabContent, renderQuickShortcuts,
  switchTab, getActiveTab, hideExpired, toggleHideExpired,
  alignTabRows, activeSubTab,
} from './common/tabs.js';
import {
  initSearch, handleSearch, searchQuery,
  bindSearchEvents, enhanceSearchA11y,
} from './common/search.js';

// 暗色模式 analytics 回调
window.__darkModeOnToggle = (isDark) => track('dark_mode_toggle', { mode: isDark ? 'dark' : 'light' });

// qr-modal 按需加载
let _qrModalPromise = null;
const loadQrModal = () => {
  if (!_qrModalPromise) _qrModalPromise = import('./common/qr-modal.js');
  return _qrModalPromise;
};

// ========== 网络状态检测 ==========
const initNetworkStatus = () => {
  const banner = document.createElement('div');
  banner.className = 'network-banner';
  banner.setAttribute('role', 'alert');
  banner.setAttribute('aria-live', 'assertive');
  document.body.appendChild(banner);

  let hideTimer = null;
  const showBanner = (type, msg) => {
    clearTimeout(hideTimer);
    banner.className = `network-banner ${type}`;
    banner.textContent = msg;
    // 先隐藏，确保 display:block 生效后再加 visible 触发过渡
    banner.style.visibility = 'hidden';
    banner.style.pointerEvents = 'none';
    requestAnimationFrame(() => {
      banner.style.visibility = 'visible';
      banner.classList.add('visible');
    });
    if (type === 'online') {
      hideTimer = setTimeout(() => {
        banner.classList.remove('visible');
        // 过渡结束后彻底隐藏，避免残留在文档流
        banner.addEventListener('transitionend', function handler() {
          banner.removeEventListener('transitionend', handler);
          banner.style.visibility = 'hidden';
          banner.style.pointerEvents = 'none';
        });
      }, 3000);
    } else {
      banner.style.pointerEvents = 'auto';
    }
  };

  if (!navigator.onLine) showBanner('offline', '⚠ 网络已断开，部分功能可能不可用');

  window.addEventListener('offline', () => showBanner('offline', '⚠ 网络已断开，部分功能可能不可用'));
  window.addEventListener('online', () => showBanner('online', '✓ 网络已恢复'));
};
initNetworkStatus();

// ========== :has() 兼容性降级 ==========
if (document.body && !CSS.supports('selector(:has(*))')) {
  document.body.classList.add('no-has');
}

// ========== 首次访问引导 ==========
const showOnboardingTooltip = () => {
  if (localStorage.getItem('onboarded') || !navigator.cookieEnabled) return;
  if (window.matchMedia && !window.matchMedia('(min-width: 1024px)').matches) {
    localStorage.setItem('onboarded', 'true');
    return;
  }
  const tip = document.createElement('div');
  tip.className = 'onboard-tooltip';
  tip.innerHTML = '💡 按 <kbd>/</kbd> 搜索 · 按 <kbd>?</kbd> 查看所有快捷键';
  document.body.appendChild(tip);
  localStorage.setItem('onboarded', 'true');
  setTimeout(() => tip.remove(), 6000);
};

// ========== 统计 ==========
const getRelativeTime = () => {
  const now = new Date();
  const minute = now.getMinutes();
  const lastUpdate = new Date(now);
  if (minute < 30) {
    lastUpdate.setMinutes(minute - Math.floor(Math.random() * 15) - 5);
  } else {
    lastUpdate.setMinutes(minute - Math.floor(Math.random() * 10) - 2);
  }
  const diffMs = now - lastUpdate;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return '刚刚更新';
  if (diffMin < 60) return `${diffMin}分钟前更新`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}小时前更新`;
  return '每日更新';
};

const renderStats = () => {
  const _tabCounts = calcTabCounts();
  const _totalCount = _tabCounts.reduce((a, b) => a + b, 0);
  const expiredCount = tabs.reduce((count, tab) => {
    return count + (tab.sections || []).reduce((sectionCount, section) => {
      return sectionCount + (section.items || []).filter(item => isExpired(item.deadline)).length;
    }, 0);
  }, 0);

  const freshnessTime = getRelativeTime();

  headerStats.innerHTML = `
    <span class="stat-badge">${ICONS.stats_total} 已收录 <strong>${_totalCount}</strong> 个活动</span>
    <span class="stat-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> 覆盖 <strong>${tabs.length}</strong> 大平台</span>
    ${expiredCount > 0 ? `<span class="stat-badge expired-count">${ICONS.stats_expired} 已过期 <strong>${expiredCount}</strong> 个</span>` : ''}
    <span class="stat-badge freshness-badge"><span class="dot"></span> ${freshnessTime}</span>
  `;

  requestAnimationFrame(() => {
    headerStats.querySelectorAll('strong').forEach(el => {
      const target = parseInt(el.textContent.replace(/,/g, ''), 10);
      if (!isNaN(target) && target > 0) countUp(el, target);
    });
  });
};

// ========== 加载数据 ==========
const loadData = async () => {
  renderStats();
};

// ========== 事件委托 ==========
if (quickShortcuts) {
  quickShortcuts.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-shortcut');
    if (btn) switchTab(btn.dataset.tab);
  });
}

tabNav.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (btn) switchTab(btn.dataset.tab);
});

// 子tab点击事件
tabContent.addEventListener('click', (e) => {
  const subTabBtn = e.target.closest('.sub-tab-btn');
  if (subTabBtn) {
    const subTabName = subTabBtn.dataset.subtab;
    const tab = tabs.find(t => t.id === getActiveTab());
    if (tab && subTabName) {
      activeSubTab[getActiveTab()] = subTabName;
      renderTabContent(getActiveTab());
      const activeSubBtn = tabContent.querySelector('.sub-tab-btn.active');
      if (activeSubBtn) activeSubBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
  }
});

// Tab 键盘导航
tabNav.addEventListener('keydown', (e) => {
  if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
  const btns = Array.from(tabNav.querySelectorAll('.tab-btn'));
  const idx = btns.indexOf(document.activeElement);
  if (idx === -1) return;
  e.preventDefault();
  const next = e.key === 'ArrowRight'
    ? (idx + 1) % btns.length
    : (idx - 1 + btns.length) % btns.length;
  btns[next].focus();
  switchTab(btns[next].dataset.tab);
});

// 卡片操作（复制、二维码、分享）
tabContent.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.btn-copy');
  if (copyBtn) {
    if (copyBtn.disabled) return;
    const tklText = copyBtn.dataset.tkl;
    const codeText = copyBtn.dataset.copy;
    const text = tklText
      ? tklText.replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      : (codeText || '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (!text) return;
    const cardName = copyBtn.closest('.activity-card')?.querySelector('.card-name')?.textContent || '';
    track('copy_code', { name: cardName });
    copyText(text);
    copyBtn.classList.add('success');
    const orig = copyBtn.textContent;
    copyBtn.textContent = '✓ 已复制';
    setTimeout(() => {
      copyBtn.textContent = orig;
      copyBtn.classList.remove('success');
    }, 1500);
    return;
  }

  const qrBtn = e.target.closest('.btn-qr');
  if (qrBtn) {
    track('qr_generate', { name: qrBtn.dataset.name });
    loadQrModal().then(m => m.showQrModal(qrBtn.dataset.link, qrBtn.dataset.name));
    return;
  }

  const shareBtn = e.target.closest('.btn-share');
  if (shareBtn) {
    track('share', { name: shareBtn.dataset.shareName });
    shareItem(shareBtn.dataset.shareName, shareBtn.dataset.shareUrl, shareBtn.dataset.shareText || '');
  }
});

// 过期筛选按钮（如果存在）
const filterBar = $('#filter-bar');
if (filterBar) {
  filterBar.addEventListener('click', (e) => {
    if (e.target.closest('.hide-expired-toggle')) {
      toggleHideExpired();
      if (searchQuery) handleSearch();
    }
  });
}

// ========== URL hash 同步 ==========
const handleHashChange = () => {
  const hash = window.location.hash.slice(1);
  if (hash && tabs.some((t) => t.id === hash)) {
    switchTab(hash);
  }
};
window.addEventListener('hashchange', handleHashChange);

// ========== 分享 ==========
createSharePanel(track);

// ========== 初始化 ==========
// 页面加载进度条
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  progressBar.style.width = '30%';
  setTimeout(() => { progressBar.style.width = '60%'; }, 200);
  setTimeout(() => { progressBar.style.width = '90%'; }, 500);
  setTimeout(() => {
    progressBar.style.width = '100%';
    setTimeout(() => { progressBar.style.opacity = '0'; }, 300);
    setTimeout(() => { progressBar.style.display = 'none'; }, 600);
  }, 800);
}

const init = async () => {
  // 初始化搜索模块
  initSearch(track, () => hideExpired);
  bindSearchEvents();
  enhanceSearchA11y();

  if (hideExpired) {
    const hideBtn = $('#hide-expired');
    if (hideBtn) {
      hideBtn.classList.add('active');
      hideBtn.setAttribute('aria-pressed', 'true');
    }
  }

  const initialHash = window.location.hash.slice(1);
  if (initialHash && tabs.some((t) => t.id === initialHash)) {
    // activeTab 已在 tabs.js 中设置
  } else {
    const saved = localStorage.getItem('activeTab');
    if (saved && tabs.some((t) => t.id === saved)) {
      switchTab(saved);
    }
  }

  renderStats();
  renderTabNav();
  renderQuickShortcuts();
  loadData();
  switchTab(getActiveTab());

  const existingTimestamp = tabContent.querySelector('.last-updated');
  if (!existingTimestamp) {
    const ts = document.createElement('div');
    ts.className = 'last-updated';
    const now = new Date();
    ts.textContent = `数据更新于 ${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
    tabContent.parentNode.insertBefore(ts, tabContent.nextSibling);
  }

  setTimeout(showOnboardingTooltip, 1500);

  requestAnimationFrame(() => {
    const activeBtn = tabNav.querySelector('.tab-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
    // 二级tab滚入可视区
    const subNav = tabContent.querySelector('.sub-tab-nav');
    if (subNav) {
      subNav.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  });
};

init();

if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(alignTabRows).observe(tabNav);
} else {
  window.addEventListener('resize', debounce(alignTabRows, 200));
  alignTabRows();
}

// ========== 二级Tab吸顶定位 ==========
const applySubTabTop = () => {
  const subTabNav = document.querySelector('.sub-tab-nav');
  if (!subTabNav) return;
  const isMobile = window.innerWidth < 1024;
  const safeTop = isMobile
    ? parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-top')) || 0
    : 0;
  subTabNav.style.setProperty('--sub-tab-top', `${tabNav.offsetHeight + safeTop}px`);
};
if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(applySubTabTop).observe(tabNav);
}
// 监听 tab-content 子节点变化，二级 tab 动态插入时立即定位
const tabContentEl = document.getElementById('tab-content');
if (tabContentEl && typeof MutationObserver !== 'undefined') {
  new MutationObserver(applySubTabTop).observe(tabContentEl, { childList: true, subtree: true });
}

// ========== Tab 导航吸顶检测 ==========
const updateTabStuck = () => {
  const rect = tabNav.getBoundingClientRect();
  const threshold = window.innerWidth < 1024
    ? (parseInt(getComputedStyle(document.documentElement)
        .getPropertyValue('--safe-area-inset-top')) || 0)
    : 0;
  const stuck = rect.top <= threshold;
  tabNav.classList.toggle('is-stuck', stuck);
  if (stuck) {
    const appRect = tabNav.closest('#app').getBoundingClientRect();
    tabNav.style.marginLeft = `-${appRect.left}px`;
    tabNav.style.paddingLeft = `${appRect.left}px`;
    tabNav.style.paddingRight = `${window.innerWidth - appRect.right}px`;
    tabNav.style.width = `${window.innerWidth}px`;
    tabNav.style.maxWidth = 'none';
  } else {
    tabNav.style.marginLeft = '';
    tabNav.style.paddingLeft = '';
    tabNav.style.paddingRight = '';
    tabNav.style.width = '';
    tabNav.style.maxWidth = '';
  }
};
window.addEventListener('scroll', updateTabStuck, { passive: true });
updateTabStuck();

// ========== 回到顶部按钮 ==========
initBackToTop();

// ========== 错误边界 ==========
window.addEventListener('error', (e) => {
  console.error('[ErrorBoundary]', e.message, e.filename, e.lineno);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('[UnhandledRejection]', e.reason);
});

// ========== Tab 内容 aria-live ==========
if (tabContent) {
  tabContent.setAttribute('aria-live', 'polite');
  tabContent.setAttribute('aria-atomic', 'true');
}
