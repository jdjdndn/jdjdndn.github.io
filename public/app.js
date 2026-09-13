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

// ========== DOM 引用 ==========
const tabNav = $('#tab-nav');
const tabContent = $('#tab-content');
const friendLinksEl = $('#friend-links');

// ========== 统计 ==========
const tabCounts = tabs.map((t) =>
  t.sections.reduce((sum, s) => sum + s.items.length, 0),
);

// ========== 渲染：Tab 导航 ==========
const renderTabNav = () => {
  tabNav.innerHTML = tabs
    .map(
      (t, i) =>
        `<button class="tab-btn" data-tab="${t.id}">${t.label}<span class="badge">${tabCounts[i]}</span></button>`,
    )
    .join('');
};

// ========== 渲染：卡片 ==========
const renderCodeCard = (item) => `
  <div class="activity-card">
    <div class="card-head">
      <span class="card-name">${item.name}</span>
      ${item.deadline ? `<span class="card-deadline">截止 ${item.deadline}</span>` : ''}
    </div>
    <div class="card-code">${item.code}</div>
    <div class="card-actions">
      <button class="btn-copy" data-copy="${item.code.replace(/"/g, '&quot;')}">📋 复制口令</button>
    </div>
  </div>
`;

const renderLinkCard = (item) => `
  <div class="activity-card">
    <div class="card-head">
      <span class="card-name">${item.name}</span>
    </div>
    <a class="card-link" href="${item.link}" target="_blank" rel="noopener" title="${item.link}">${item.link}</a>
    <div class="card-actions">
      <a class="btn-go" href="${item.link}" target="_blank" rel="noopener">🔗 前往活动</a>
      <button class="btn-qr" data-link="${item.link}" data-name="${item.name.replace(/"/g, '&quot;')}">📱 二维码</button>
    </div>
  </div>
`;

// ========== 渲染：Tab 内容 ==========
const renderTabContent = (tabId) => {
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
    return;
  }

  const qrBtn = e.target.closest('.btn-qr');
  if (qrBtn) {
    showQrModal(qrBtn.dataset.link, qrBtn.dataset.name);
  }
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
renderTabNav();
switchTab(activeTab);
renderFriendLinks();
