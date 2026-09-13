// ========== 数据（来自 data.js） ==========
import { tabs, friendLinks } from './data.js';

// ========== 工具函数 ==========
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const showToast = (msg = '已复制') => {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.remove('hidden');
  setTimeout(() => t.classList.add('hidden'), 1500);
};

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    showToast();
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;left:-9999px';
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast();
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

// ========== 统计 ==========
const tabCounts = tabs.map((t) =>
  t.sections.reduce((sum, s) => sum + s.items.length, 0),
);
const totalCount = tabCounts.reduce((a, b) => a + b, 0);

// 渲染头部统计
const renderStats = () => {
  headerStats.innerHTML = `
    <span>📦 已收录 <strong>${totalCount}</strong> 个优惠</span>
    <span>🔄 数据持续更新中</span>
  `;
};

// ========== 渲染：Tab 导航 ==========
const renderTabNav = () => {
  const allBtn = `<button class="tab-btn" data-tab="all">📋 全部<span class="badge">${totalCount}</span></button>`;
  const tabBtns = tabs
    .map(
      (t, i) =>
        `<button class="tab-btn" data-tab="${t.id}">${t.label}<span class="badge">${tabCounts[i]}</span></button>`,
    )
    .join('');
  tabNav.innerHTML = allBtn + tabBtns;
};

// 通过 offsetTop 检测换行行号，仅最后一行不拉伸
let alignLock = false;
const alignTabRows = () => {
  if (alignLock) return;
  const btns = Array.from(tabNav.querySelectorAll('.tab-btn'));
  if (!btns.length) return;

  alignLock = true;

  // 先清除行内样式，让浏览器自然排布以确定换行位置
  btns.forEach(b => { b.style.flex = ''; });

  // 按 offsetTop 分组，得到每行的按钮索引
  const rows = [];
  btns.forEach((b, i) => {
    const top = b.offsetTop;
    const last = rows[rows.length - 1];
    if (last && Math.abs(last.top - top) < 2) {
      last.indices.push(i);
    } else {
      rows.push({ top, indices: [i] });
    }
  });

  // 仅当多行时才处理
  if (rows.length > 1) {
    const lastRow = rows[rows.length - 1];
    const lastSet = new Set(lastRow.indices);

    // 非末排拉伸铺满，末排保持自然宽度
    btns.forEach((b, i) => {
      b.style.flex = lastSet.has(i) ? '0 1 auto' : '1 1 auto';
    });
  }

  // 下一帧解锁，防止 ResizeObserver 重入
  requestAnimationFrame(() => { alignLock = false; });
};

// ========== 渲染：卡片 ==========
const renderCodeCard = (item) => {
  const isMiniApp = item.code.startsWith('mp://');
  const expired = isExpired(item.deadline);
  const expiringSoon = isExpiringSoon(item.deadline);
  const expiredClass = expired ? ' expired' : '';
  const expiringClass = expiringSoon ? ' expiring-soon' : '';
  const expiredTag = expired ? '<span class="expired-tag">已过期</span>' : '';
  return `
  <div class="activity-card${expiredClass}${expiringClass}">
    <div class="card-head">
      <span class="card-name">${item.name}</span>
      ${isMiniApp ? '<span class="miniapp-tag">小程序</span>' : ''}
      ${item.deadline ? `<span class="card-deadline">截止 ${item.deadline}</span>` : ''}
      ${expiredTag}
    </div>
    <div class="card-code">${item.code}</div>
    <div class="card-actions">
      <button class="btn-copy" data-copy="${item.code.replace(/"/g, '&quot;')}">📋 复制口令</button>
    </div>
  </div>
  `;
};

const renderLinkCard = (item) => {
  const expired = isExpired(item.deadline);
  const expiringSoon = isExpiringSoon(item.deadline);
  const expiredClass = expired ? ' expired' : '';
  const expiringClass = expiringSoon ? ' expiring-soon' : '';
  const expiredTag = expired ? '<span class="expired-tag">已过期</span>' : '';
  return `
  <div class="activity-card${expiredClass}${expiringClass}">
    <div class="card-head">
      <span class="card-name">${item.name}</span>
      ${expiredTag}
    </div>
    <a class="card-link" href="${item.link}" target="_blank" rel="noopener" title="${item.link}">${item.link}</a>
    <div class="card-actions">
      <a class="btn-go" href="${item.link}" target="_blank" rel="noopener">🔗 前往活动</a>
      <button class="btn-qr" data-link="${item.link}" data-name="${item.name.replace(/"/g, '&quot;')}">📱 二维码</button>
    </div>
  </div>
  `;
};

// ========== 渲染：Tab 内容 ==========
const renderTabContent = (tabId) => {
  if (tabId === 'all') {
    // 全部 Tab：展示所有平台的优惠，按平台分组
    tabContent.innerHTML = tabs
      .map(
        (tab) => `
      <div class="sub-section">
        <div class="sub-section-title">${tab.label}（${tabCounts[tabs.indexOf(tab)]}）</div>
        <div class="card-grid">
          ${tab.sections
            .flatMap((sec) => sec.items)
            .map((item) => (item.code ? renderCodeCard(item) : renderLinkCard(item)))
            .join('')}
        </div>
      </div>
    `,
      )
      .join('');
    return;
  }

  const tab = tabs.find((t) => t.id === tabId);
  if (!tab) return;

  tabContent.innerHTML = tab.sections
    .map(
      (sec) => `
    <div class="sub-section">
      <div class="sub-section-title">${sec.title}（${sec.items.length}）</div>
      <div class="card-grid">
        ${sec.items.map((item) => (item.code ? renderCodeCard(item) : renderLinkCard(item))).join('')}
      </div>
    </div>
  `,
    )
    .join('');
};

// ========== 渲染：友情链接 ==========
const renderFriendLinks = () => {
  friendLinksEl.innerHTML = friendLinks
    .map((f) => `<a class="friend-link" href="${f.url}" target="_blank" rel="noopener">${f.name}</a>`)
    .join('');
};

// ========== Tab 切换 ==========
let activeTab = tabs[0].id;

const switchTab = (tabId) => {
  activeTab = tabId;
  $$('.tab-btn').forEach((btn) => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });
  renderTabContent(tabId);
};

// ========== 事件委托 ==========
tabNav.addEventListener('click', (e) => {
  const btn = e.target.closest('.tab-btn');
  if (btn) switchTab(btn.dataset.tab);
});

tabContent.addEventListener('click', (e) => {
  const copyBtn = e.target.closest('.btn-copy');
  if (copyBtn) {
    const text = copyBtn.dataset.copy
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
    copyText(text);
    // 按钮反馈
    const orig = copyBtn.textContent;
    copyBtn.textContent = '✓ 已复制';
    copyBtn.style.background = 'var(--success-light)';
    copyBtn.style.color = 'var(--success)';
    setTimeout(() => {
      copyBtn.textContent = orig;
      copyBtn.style.background = '';
      copyBtn.style.color = '';
    }, 1200);
    return;
  }

  const qrBtn = e.target.closest('.btn-qr');
  if (qrBtn) {
    showQrModal(qrBtn.dataset.link, qrBtn.dataset.name);
  }
});

// ========== 搜索 ==========
let searchQuery = '';

const searchCoupons = (query) => {
  if (!query.trim()) return null;
  const q = query.toLowerCase();
  const results = [];
  tabs.forEach((tab) => {
    tab.sections.forEach((sec) => {
      sec.items.forEach((item) => {
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code && item.code.toLowerCase().includes(q);
        const matchSection = sec.title.toLowerCase().includes(q);
        if (matchName || matchCode || matchSection) {
          results.push({ ...item, tabLabel: tab.label, tabId: tab.id, sectionTitle: sec.title });
        }
      });
    });
  });
  return results;
};

const renderSearchResults = (results) => {
  if (!results.length) {
    tabContent.innerHTML = `
      <div style="text-align:center;padding:48px 16px;color:var(--muted);">
        <div style="font-size:48px;margin-bottom:12px;">🔍</div>
        <div style="font-size:15px;font-weight:600;color:var(--text);margin-bottom:4px;">未找到匹配的优惠</div>
        <div style="font-size:13px;">换个关键词试试？</div>
      </div>
    `;
    return;
  }

  // 按 tab 分组
  const grouped = {};
  results.forEach((item) => {
    const key = item.tabId;
    if (!grouped[key]) grouped[key] = { label: item.tabLabel, items: [] };
    grouped[key].items.push(item);
  });

  tabContent.innerHTML = Object.values(grouped)
    .map(
      (group) => `
    <div class="sub-section">
      <div class="sub-section-title">${group.label} · ${group.sectionTitle || ''}（${group.items.length}）</div>
      <div class="card-grid">
        ${group.items.map((item) => (item.code ? renderCodeCard(item) : renderLinkCard(item))).join('')}
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
    searchClear.classList.remove('visible');
    searchCount.classList.remove('visible');
    renderTabContent(activeTab);
    return;
  }

  searchClear.classList.add('visible');
  const results = searchCoupons(query);
  searchCount.textContent = `找到 ${results.length} 个匹配结果`;
  searchCount.classList.add('visible');
  renderSearchResults(results);
};

searchInput.addEventListener('input', handleSearch);
searchClear.addEventListener('click', () => {
  searchInput.value = '';
  handleSearch();
  searchInput.focus();
});

// ========== 二维码弹窗 ==========
const qrOverlay = $('#qr-overlay');
const qrImg = $('#qr-img');
const qrName = $('#qr-name');
const qrClose = $('#qr-close');

const showQrModal = (url, name) => {
  qrImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(url)}`;
  qrName.textContent = name;
  qrOverlay.classList.remove('hidden');
};

const hideQrModal = () => {
  qrOverlay.classList.add('hidden');
  qrImg.src = '';
};

qrClose.addEventListener('click', hideQrModal);
qrOverlay.addEventListener('click', (e) => {
  if (e.target === qrOverlay) hideQrModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !qrOverlay.classList.contains('hidden')) {
    hideQrModal();
  }
});

// ========== 初始化 ==========
renderStats();
renderTabNav();
switchTab(activeTab);
renderFriendLinks();
// ResizeObserver 在每次布局完成后精确触发，替代不可靠的手动定时
new ResizeObserver(alignTabRows).observe(tabNav);

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

// Footer 收起/展开
footerToggle.addEventListener('click', () => {
  footer.classList.toggle('collapsed');
});
