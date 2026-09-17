// ========== 数据（来自 data.js） ==========
import QRCode from 'qrcode';
import { track } from './analytics.js';
import { friendLinks, tabs } from './data.js';

// ========== 精选活动数据 ==========
let jingxuanData = [];
const loadJingxuan = async () => {
  try {
    const res = await fetch('./api-data/jingxuan_list.json');
    if (!res.ok) return;
    jingxuanData = await res.json();
    // 更新精选 tab 的 badge 数量
    const jingxuanTab = tabs.find(t => t.id === 'jingxuan');
    if (jingxuanTab) {
      jingxuanTab.sections = [{ title: '精选活动', items: jingxuanData.map(d => ({ name: d.name })) }];
    }
    renderStats();
    renderTabNav();
    if (activeTab === 'jingxuan') renderTabContent('jingxuan');
  } catch {}
};

// ========== :has() 兼容性降级 ==========
if (document.body && !CSS.supports('selector(:has(*))')) {
  document.body.classList.add('no-has');
}

// ========== 工具函数 ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

/** 防抖：延迟执行，连续触发时重新计时 */
const debounce = (fn, ms = 150) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
};

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

// ========== 过期判断 ==========
const isExpired = (deadline) => {
  if (!deadline) return false;
  const d = new Date(deadline);
  return d < new Date();
};

const isExpiringSoon = (deadline) => {
  if (!deadline) return false;
  const d = new Date(deadline);
  const now = new Date();
  const diff = d - now;
  return diff > 0 && diff < 7 * 24 * 60 * 60 * 1000;
};

// ========== DOM 引用 ==========
const tabNav = $('#tab-nav');
const tabContent = $('#tab-content');
const friendLinksEl = $('#friend-links');
const searchInput = $('#search-input');
const searchClear = $('#search-clear');
const searchCount = $('#search-count');
const headerStats = $('#header-stats');

// ========== SVG 图标 ==========
const ICONS = {
  stats_total: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>',
  stats_update: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>',
  empty_search: '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  meituan: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><circle cx="9" cy="10" r="1" fill="currentColor"/><circle cx="15" cy="10" r="1" fill="currentColor"/></svg>',
  taobaoshangou: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>',
  ecommerce: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>',
  xiecheng_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/><path d="M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>',
  tongcheng_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>',
  feizhu_travel: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>',
  didi_ride: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 16H9m10 0h3v-3.15a1 1 0 00-.84-.99L16 11l-2.7-6.06A1 1 0 0012.38 4H5.62a1 1 0 00-.92.63L2 11l-2 .85A1 1 0 00-.84 12.85V16h3"/><circle cx="6.5" cy="16.5" r="2.5"/><circle cx="16.5" cy="16.5" r="2.5"/></svg>',
  huaxiaozhu_ride: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  dinner: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>',
  life: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  huiyuan: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  jingxuan: '<svg class="tab-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
};

// ========== sections 规范化 ==========
// featured tab 的 sections 可能是原始字符串数组，需要转换为 {title, items} 格式
const normalizeSections = (sections) =>
  sections.map((s) => {
    if (typeof s === 'string') {
      // 从字符串中提取名称和链接
      const lines = s.split('\n').map((l) => l.trim()).filter(Boolean);
      const name = lines[0] || s.slice(0, 30);
      const linkMatch = s.match(/【下单链接】(https?:\/\/\S+)/);
      return {
        title: name.slice(0, 20),
        items: linkMatch
          ? [{ name, link: linkMatch[1] }]
          : [{ name, code: s }],
      };
    }
    return s;
  });

// ========== 统计 ==========
const calcTabCounts = () => tabs.map((t) =>
  normalizeSections(t.sections).reduce((sum, s) => sum + s.items.length, 0),
);
let tabCounts = calcTabCounts();
let totalCount = tabCounts.reduce((a, b) => a + b, 0);

// 统计过期优惠数量
const expiredCount = tabs.reduce((count, tab) => {
  return count + normalizeSections(tab.sections).reduce((sectionCount, section) => {
    return sectionCount + section.items.filter(item => isExpired(item.deadline)).length;
  }, 0);
}, 0);

// 渲染头部统计
const renderStats = () => {
  tabCounts = calcTabCounts();
  totalCount = tabCounts.reduce((a, b) => a + b, 0);
  headerStats.innerHTML = `
    <span class="stat-badge">${ICONS.stats_total} 已收录 <strong>${totalCount}</strong> 个优惠</span>
    ${expiredCount > 0 ? `<span class="stat-badge expired-count">${ICONS.stats_total} 已过期 <strong>${expiredCount}</strong> 个</span>` : ''}
    <span class="stat-badge">${ICONS.stats_update} 数据持续更新中</span>
  `;
};

// ========== 渲染：Tab 导航 ==========
const renderTabNav = () => {
  const tabBtns = tabs
    .map(
      (t, i) =>
        `<button class="tab-btn" data-tab="${t.id}" role="tab" aria-selected="false">${ICONS[t.id] || ''}<span class="tab-name">${t.name || t.label}</span><span class="badge">${tabCounts[i]}</span></button>`,
    )
    .join('');
  tabNav.innerHTML = tabBtns;
};

// Tab 行对齐：仅最后一行不拉伸，保持自然宽度
let alignLock = false;
const alignTabRows = () => {
  if (alignLock) return;
  const btns = Array.from(tabNav.querySelectorAll('.tab-btn'));
  if (!btns.length) return;
  alignLock = true;
  btns.forEach(b => { b.style.flex = ''; });
  const rows = [];
  btns.forEach((b) => {
    const top = b.offsetTop;
    const last = rows[rows.length - 1];
    if (last && Math.abs(last.top - top) < 2) {
      last.indices.push(b);
    } else {
      rows.push({ top, indices: [b] });
    }
  });
  if (rows.length > 1) {
    const lastSet = new Set(rows[rows.length - 1].indices);
    btns.forEach((b) => {
      b.style.flex = lastSet.has(b) ? '0 1 auto' : '1 1 auto';
    });
  }
  requestAnimationFrame(() => { alignLock = false; });
};

// ========== 渲染：卡片 ==========
const renderCodeCard = (item, query) => {
  const isMiniApp = item.code.startsWith('mp://')|| item.code.startsWith('weixin://');
  const expired = isExpired(item.deadline);
  if (hideExpired && expired) return '';
  const expiringSoon = isExpiringSoon(item.deadline);
  const expiredClass = expired ? ' expired' : '';
  const expiringClass = expiringSoon ? ' expiring-soon' : '';
  const expiredTag = expired ? '<span class="expired-tag">已过期</span>' : '';
  return `
  <div class="activity-card${expiredClass}${expiringClass}">
    <div class="card-head">
      <span class="card-name"${query ? ' data-highlight' : ''}>${item.name}</span>
      ${isMiniApp ? '<span class="miniapp-tag">小程序</span>' : ''}
      ${item.deadline ? `<span class="card-deadline">截止 ${item.deadline}</span>` : ''}
      ${expiredTag}
    </div>
    <div class="card-code"${query ? ' data-highlight' : ''}>${item.code}</div>
    <div class="card-actions">
      <button class="btn-copy" data-copy="${item.code.replace(/"/g, '&quot;')}" ${expired ? 'disabled' : ''}>复制口令</button>
      <button class="btn-share" data-share-name="${item.name.replace(/"/g, '&quot;')}" data-share-text="${item.code.replace(/"/g, '&quot;')}">分享</button>
    </div>
  </div>
  `;
};

const renderLinkCard = (item, query) => {
  const expired = isExpired(item.deadline);
  if (hideExpired && expired) return '';
  const expiringSoon = isExpiringSoon(item.deadline);
  const expiredClass = expired ? ' expired' : '';
  const expiringClass = expiringSoon ? ' expiring-soon' : '';
  const expiredTag = expired ? '<span class="expired-tag">已过期</span>' : '';
  let host = '';
  try { host = new URL(item.link).hostname.replace('www.', ''); } catch { host = item.link; }
  return `
  <div class="activity-card${expiredClass}${expiringClass}">
    <div class="card-head">
      <span class="card-name"${query ? ' data-highlight' : ''}>${item.name}</span>
      ${expiredTag}
    </div>
    <a class="card-link" href="${item.link}" target="_blank" rel="noopener" title="${item.link}">${host || '前往活动'}</a>
    <div class="card-actions">
      <a class="btn-go" href="${item.link}" target="_blank" rel="noopener" ${expired ? 'tabindex="-1"' : ''}>前往活动</a>
      <button class="btn-qr" data-link="${item.link}" data-name="${item.name.replace(/"/g, '&quot;')}">二维码</button>
      <button class="btn-share" data-share-name="${item.name.replace(/"/g, '&quot;')}" data-share-url="${item.link}">分享</button>
    </div>
  </div>
  `;
};

// ========== 渲染：精选活动卡片 ==========
const renderJingxuanCard = (item) => {
  const name = item.brandName ? `${item.brandName} · ${item.name}` : item.name;
  const price = parseFloat(item.sellPrice);
  const origPrice = parseFloat(item.originalPrice);
  const hasDiscount = !isNaN(price) && !isNaN(origPrice) && origPrice > price;
  const hasLink = !!item.h5;
  const tag = !hasLink ? '<span class="jingxuan-tag">仅门店</span>' : '';
  return `
  <${hasLink ? 'a' : 'div'} class="jingxuan-card${hasLink ? '' : ' no-link'}"${hasLink ? ` href="${item.h5}" target="_blank" rel="noopener"` : ''}>
    <div class="jingxuan-img-wrap">
      <img class="jingxuan-img" src="${item.img}" alt="${name}" loading="lazy" />
      ${tag}
    </div>
    <div class="jingxuan-info">
      <div class="jingxuan-name">${name}</div>
      <div class="jingxuan-price">
        ${hasDiscount ? `<span class="jingxuan-price-sell">¥${item.sellPrice}</span><span class="jingxuan-price-orig">¥${item.originalPrice}</span>` : item.sellPrice ? `<span class="jingxuan-price-sell">¥${item.sellPrice}</span>` : ''}
      </div>
    </div>
  </${hasLink ? 'a' : 'div'}>`;
};

// ========== 渲染：Tab 内容 ==========
const renderTabContent = (tabId) => {
  const tab = tabs.find((t) => t.id === tabId);
  if (!tab) return;

  // 精选活动：从 JSON 加载，渲染图片卡片
  if (tabId === 'jingxuan') {
    if (!jingxuanData.length) {
      tabContent.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div class="empty-state-title">精选活动加载中…</div>
          <div class="empty-state-hint">请稍候</div>
        </div>`;
      loadJingxuan();
      return;
    }

    const html = jingxuanData.length
      ? `<section class="sub-section"><h2 class="sub-section-title">精选活动（${jingxuanData.length}）</h2><div class="jingxuan-grid">${jingxuanData.map(renderJingxuanCard).join('')}</div></section>`
      : `<div class="empty-state">
          <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
          <div class="empty-state-title">精选活动即将上线</div>
          <div class="empty-state-hint">敬请期待，我们会为你挑选最值得入手的优惠</div>
        </div>`;
    tabContent.innerHTML = html;
    return;
  }

  const sections = normalizeSections(tab.sections);

  if (!sections.length) {
    tabContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <div class="empty-state-title">精选活动即将上线</div>
        <div class="empty-state-hint">敬请期待，我们会为你挑选最值得入手的优惠</div>
      </div>
    `;
    return;
  }

  tabContent.innerHTML = sections
    .map(
      (sec, i) => `
    <section class="sub-section" aria-labelledby="section-${tab.id}-${i}">
      <h2 class="sub-section-title" id="section-${tab.id}-${i}">${sec.title}（${sec.items.length}）</h2>
      <div class="card-grid">
        ${sec.items.map((item) => (item.code ? renderCodeCard(item) : renderLinkCard(item))).join('')}
      </div>
    </section>
  `,
    )
    .join('');
};

// ========== 渲染：友情链接 ==========
const renderFriendLinks = () => {
  const haokaEntry = `<a class="friend-link friend-link-highlight" href="./haoka.html">号卡专区</a>`;
  const wifiEntry = `<a class="friend-link friend-link-highlight" href="./wifi.html">随身WiFi</a>`;
  const wangpanEntry = `<a class="friend-link friend-link-highlight" href="./wangpan.html">网盘资源</a>`;
  friendLinksEl.innerHTML = haokaEntry + wifiEntry + wangpanEntry + friendLinks
    .map((f) => {
      const description = f.description ? ` title="${f.description.replace(/"/g, '&quot;')}"` : '';
      const category = f.category ? ` data-category="${f.category}"` : '';
      return `<a class="friend-link" href="${f.url}" target="_blank" rel="noopener sponsored"${description}${category}>${f.name}</a>`;
    })
    .join('');
};

// ========== Tab 切换 ==========
let activeTab = tabs[0].id;

const switchTab = (tabId) => {
  activeTab = tabId;
  track('tab_switch', { tab: tabId });
  localStorage.setItem('activeTab', tabId);
  // 更新 URL hash
  history.replaceState(null, '', `#${tabId}`);
  // 更新按钮状态和 ARIA
  $$('.tab-btn').forEach((btn) => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  // H5 端自动将当前 tab 滚入可视区域
  const activeBtn = tabNav.querySelector('.tab-btn.active');
  if (activeBtn) {
    activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
  }
  renderTabContent(tabId);
};

// ========== 过期筛选 ==========
let hideExpired = localStorage.getItem('hideExpired') === 'true';
let footerCollapsed = localStorage.getItem('footerCollapsed') === 'true';

const toggleHideExpired = () => {
  hideExpired = !hideExpired;
  localStorage.setItem('hideExpired', hideExpired);
  const btn = $('#hide-expired');
  if (btn) {
    btn.classList.toggle('active', hideExpired);
    btn.setAttribute('aria-pressed', hideExpired);
  }
  // 重新渲染当前 tab
  renderTabContent(activeTab);
  if (searchQuery) handleSearch();
};

// ========== 事件委托 ==========
tabNav.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (btn) switchTab(btn.dataset.tab);
});

// Tab 键盘导航（左右箭头）
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

tabContent.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.btn-copy');
  if (copyBtn) {
    if (copyBtn.disabled) return;
    const text = copyBtn.dataset.copy
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    const cardName = copyBtn.closest('.activity-card')?.querySelector('.card-name')?.textContent || '';
    track('copy_code', { name: cardName });
    copyText(text);
    // 按钮反馈
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
    showQrModal(qrBtn.dataset.link, qrBtn.dataset.name);
    return;
  }

  const shareBtn = e.target.closest('.btn-share');
  if (shareBtn) {
    track('share', { name: shareBtn.dataset.shareName });
    shareItem(shareBtn.dataset.shareName, shareBtn.dataset.shareUrl, shareBtn.dataset.shareText || '');
  }
});

// ========== 搜索 ==========
let searchQuery = '';

const searchCoupons = (query) => {
  if (!query.trim()) return null;
  const q = query.toLowerCase();
  const results = [];
  tabs.forEach((tab) => {
    normalizeSections(tab.sections).forEach((sec) => {
      sec.items.forEach((item) => {
        if (hideExpired && isExpired(item.deadline)) return;
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code && item.code.toLowerCase().includes(q);
        const matchSection = sec.title.toLowerCase().includes(q);
        if (matchName || matchCode || matchSection) {
          results.push({ ...item, tabLabel: tab.label, tabId: tab.id, sectionTitle: sec.title });
        }
      });
    });
  });
  // 搜索精选活动数据
  jingxuanData.forEach((d) => {
    const fullName = d.brandName ? `${d.brandName} ${d.name}` : d.name;
    if (fullName.toLowerCase().includes(q)) {
      results.push({ name: fullName, link: d.h5 || '#', tabLabel: '⭐ 精选', tabId: 'jingxuan', sectionTitle: '精选活动' });
    }
  });
  return results;
};

const renderSearchResults = (results) => {
  if (!results.length) {
    tabContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">${ICONS.empty_search}</div>
        <div class="empty-state-title">未找到匹配的优惠</div>
        <div class="empty-state-hint">换个关键词试试？</div>
      </div>
    `;
    return;
  }

  // 按 tab + section 分组
  const grouped = {};
  results.forEach((item) => {
    const key = `${item.tabId}__${item.sectionTitle || ''}`;
    if (!grouped[key]) grouped[key] = { label: item.tabLabel, sectionTitle: item.sectionTitle || '', items: [] };
    grouped[key].items.push(item);
  });

  tabContent.innerHTML = Object.values(grouped)
    .map(
      (group) => `
    <div class="sub-section">
      <div class="sub-section-title">${group.label}${group.sectionTitle ? ' · ' + group.sectionTitle : ''}（${group.items.length}）</div>
      <div class="card-grid">
        ${group.items.map((item) => (item.code ? renderCodeCard(item, searchQuery) : renderLinkCard(item, searchQuery))).join('')}
      </div>
    </div>
  `,
    )
    .join('');
};

const handleSearch = () => {
  const query = searchInput.value.trim();
  searchQuery = query;

  if (!query) {
    track('search_clear');
    searchClear.classList.remove('visible');
    searchCount.classList.remove('visible');
    renderTabContent(activeTab);
    return;
  }

  searchClear.classList.add('visible');
  const results = searchCoupons(query);
  track('search', { query, results_count: results.length });
  searchCount.textContent = `找到 ${results.length} 个匹配结果`;
  searchCount.classList.add('visible');
  renderSearchResults(results);
};

const debouncedSearch = debounce(handleSearch, 150);

searchInput.addEventListener('input', debouncedSearch);
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  handleSearch();
  searchInput.focus();
});

// 过期筛选按钮
// const filterBar = $('#filter-bar');
// filterBar.addEventListener('click', (e) => {
//   if (e.target.closest('.hide-expired-toggle')) {
//     toggleHideExpired();
//   }
// });

// ========== 二维码弹窗 ==========
const qrOverlay = $('#qr-overlay');
const qrImg = $('#qr-img');
const qrName = $('#qr-name');
const qrClose = $('#qr-close');

// ========== 焦点陷阱 ==========
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
  if (lastFocusedElement) {
    lastFocusedElement.focus();
    lastFocusedElement = null;
  }
};

const qrModal = qrOverlay.querySelector('.qr-modal');
const getFocusableEls = () =>
  qrModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');

qrClose.addEventListener('click', hideQrModal);
qrOverlay.addEventListener('click', (e) => {
  if (e.target === qrOverlay) hideQrModal();
});
document.addEventListener('keydown', (e) => {
  if (qrOverlay.classList.contains('hidden')) return;

  if (e.key === 'Escape') {
    hideQrModal();
    return;
  }

  // 焦点陷阱：Tab 循环
  if (e.key === 'Tab') {
    const focusable = Array.from(getFocusableEls());
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

// ========== 键盘快捷键 ==========
document.addEventListener('keydown', (e) => {
  // "/" 聚焦搜索框（排除已在输入框中的情况）
  if (e.key === '/' && document.activeElement !== searchInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
    e.preventDefault();
    searchInput.focus();
  }
});

// ========== URL hash 同步 ==========
const handleHashChange = () => {
  const hash = window.location.hash.slice(1);
  if (hash && tabs.some((t) => t.id === hash)) {
    switchTab(hash);
  }
};
window.addEventListener('hashchange', handleHashChange);

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
  track('dark_mode_toggle', { mode: isDark ? 'dark' : 'light' });
  localStorage.setItem('darkMode', isDark);
  updateDarkToggleText();
};

// ========== 分享 ==========
// 创建分享面板 DOM（仅创建一次）
const createSharePanel = () => {
  if ($('#share-panel')) return;
  const panel = document.createElement('div');
  panel.id = 'share-panel';
  panel.className = 'share-panel hidden';
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-modal', 'true');
  panel.setAttribute('aria-label', '分享');
  panel.innerHTML = `
    <div class="share-panel-mask"></div>
    <div class="share-panel-body">
      <div class="share-panel-header">
        <span class="share-panel-title">分享给朋友</span>
        <button class="share-panel-close" aria-label="关闭">✕</button>
      </div>
      <div class="share-panel-content">
        <p class="share-panel-name" id="share-panel-name"></p>
        <div class="share-panel-options">
          <button class="share-option" data-action="copy-link">
            <span class="share-option-icon">🔗</span>
            <span class="share-option-label">复制链接</span>
          </button>
          <button class="share-option" data-action="copy-text">
            <span class="share-option-icon">📋</span>
            <span class="share-option-label">复制口令</span>
          </button>
          <button class="share-option" data-action="wechat">
            <span class="share-option-icon">💬</span>
            <span class="share-option-label">微信</span>
          </button>
          <button class="share-option" data-action="weibo">
            <span class="share-option-icon">📢</span>
            <span class="share-option-label">微博</span>
          </button>
          <button class="share-option" data-action="qq">
            <span class="share-option-icon">🐧</span>
            <span class="share-option-label">QQ</span>
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(panel);

  // 关闭面板
  const closePanel = () => panel.classList.add('hidden');
  panel.querySelector('.share-panel-close').addEventListener('click', closePanel);
  panel.querySelector('.share-panel-mask').addEventListener('click', closePanel);
  panel.addEventListener('keydown', (e) => { if (e.key === 'Escape') closePanel(); });

  // 处理分享选项
  panel.querySelector('.share-panel-options').addEventListener('click', async (e) => {
    const option = e.target.closest('.share-option');
    if (!option) return;
    const action = option.dataset.action;
    const shareUrl = panel.dataset.shareUrl || window.location.href;
    const shareName = panel.dataset.shareName || '';
    const shareText = panel.dataset.shareText || '';

    if (action === 'copy-link') {
      await robustCopy(shareUrl, '链接已复制');
    } else if (action === 'copy-text') {
      const content = shareText || shareUrl;
      await robustCopy(content, shareText ? '口令已复制' : '链接已复制');
    } else if (action === 'wechat') {
      // 微信：复制内容，引导用户去微信粘贴
      const content = shareText || `${shareName} ${shareUrl}`;
      await robustCopy(content, '已复制，打开微信粘贴发送');
    } else if (action === 'weibo') {
      const wbUrl = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(shareName)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(wbUrl, '_blank', 'noopener,width=600,height=500');
    } else if (action === 'qq') {
      const qqUrl = `https://connect.qq.com/widget/shareqq/index.html?title=${encodeURIComponent(shareName)}&url=${encodeURIComponent(shareUrl)}`;
      window.open(qqUrl, '_blank', 'noopener,width=600,height=500');
    }
    closePanel();
  });
};

/** 剪贴板写入（含降级） */
const robustCopy = async (text, successMsg) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast(successMsg);
  } catch {
    try {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.cssText = 'position:fixed;left:-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(successMsg);
    } catch {
      showToast('复制失败，请长按手动复制');
    }
  }
};

createSharePanel();

const shareItem = async (name, url, text) => {
  // 移动端：优先用原生分享
  if (navigator.share) {
    const shareData = text
      ? { title: name, text }
      : { title: name, url };
    try { await navigator.share(shareData); return; } catch {}
  }
  // 桌面端 / 原生分享失败：弹出分享面板
  const panel = $('#share-panel');
  panel.dataset.shareName = name || '';
  panel.dataset.shareUrl = url || window.location.href;
  panel.dataset.shareText = text || '';
  $('#share-panel-name').textContent = name || '';
  panel.classList.remove('hidden');
  panel.querySelector('.share-panel-close').focus();
};

// ========== 初始化 ==========
initDarkMode();
renderStats();
// 同步 localStorage 中的过期筛选状态到 UI
if (hideExpired) {
  const hideBtn = $('#hide-expired');
  if (hideBtn) {
    hideBtn.classList.add('active');
    hideBtn.setAttribute('aria-pressed', 'true');
  }
}
renderTabNav();
loadJingxuan();

// 支持 URL hash 直接定位，无 hash 时从 localStorage 恢复
const initialHash = window.location.hash.slice(1);
if (initialHash && tabs.some((t) => t.id === initialHash)) {
  activeTab = initialHash;
} else {
  const saved = localStorage.getItem('activeTab');
  if (saved && tabs.some((t) => t.id === saved)) {
    activeTab = saved;
  }
}
switchTab(activeTab);

renderFriendLinks();
if (typeof ResizeObserver !== 'undefined') {
  new ResizeObserver(alignTabRows).observe(tabNav);
} else {
  window.addEventListener('resize', debounce(alignTabRows, 200));
  alignTabRows();
}

// ========== Footer 吸底宽度同步 + 收起 ==========
const appEl = $('#app');
const footer = $('#footer');
const footerToggle = $('#footer-toggle');
const footerInner = document.querySelector('.footer-inner');
const syncFooter = () => {
  const style = getComputedStyle(appEl);
  footerInner.style.maxWidth = style.maxWidth;
  footerInner.style.marginLeft = style.marginLeft;
  footerInner.style.marginRight = style.marginRight;
};
syncFooter();
window.addEventListener('resize', syncFooter);

// Footer 初始化收起状态
if (footerCollapsed) {
  footer.classList.add('collapsed');
  footerToggle.setAttribute('aria-expanded', 'false');
  document.body.classList.add('footer-collapsed');
}

// Footer 收起/展开
footerToggle.addEventListener('click', () => {
  const collapsed = footer.classList.toggle('collapsed');
  footerToggle.setAttribute('aria-expanded', !collapsed);
  document.body.classList.toggle('footer-collapsed', collapsed);
  localStorage.setItem('footerCollapsed', collapsed);
});

// 暗色模式切换
const darkToggle = $('#dark-toggle');
if (darkToggle) darkToggle.addEventListener('click', toggleDarkMode);
