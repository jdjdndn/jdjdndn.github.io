// ========== Tab 导航与内容渲染 ==========

import { $, $$, normalizeSections } from './utils.js';
import { renderCodeCard, renderLinkCard, renderApiCard, setHideExpired, getHideExpired } from './cards.js';
import { renderSkeletonGrid } from './skeleton.js';
import { tabs } from '../data.js';
export { tabs }; // 供 search.js 等模块使用

// ========== DOM 引用 ==========
export const tabNav = $('#tab-nav');
export const tabContent = $('#tab-content');
export const headerStats = $('#header-stats');
export const quickShortcuts = $('#quick-shortcuts');

// ========== 统计 ==========
export const calcTabCounts = () => tabs.map((t) =>
  normalizeSections(t.sections).reduce((sum, s) => sum + s.items.length, 0),
);
export let tabCounts = calcTabCounts();
export let totalCount = tabCounts.reduce((a, b) => a + b, 0);

// ========== Tab 行对齐 ==========
let alignLock = false;
export const alignTabRows = () => {
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

// ========== 渲染：Tab 导航 ==========
export const renderTabNav = () => {
  if (tabCounts.length !== tabs.length) {
    tabCounts = calcTabCounts();
  }
  const tabBtns = tabs
    .map(
      (t, i) => {
        const isActive = t.id === _activeTab;
        const count = tabCounts[i] ?? 0;
        return `<button class="tab-btn${isActive ? ' active' : ''}" data-tab="${t.id}" role="tab" aria-selected="${isActive}"><span class="tab-name">${t.name || t.label}</span><span class="badge">${count}</span></button>`;
      },
    )
    .join('');
  tabNav.innerHTML = tabBtns;
};

// ========== Tab 内容 DOM 缓存池 ==========
const tabContentCache = {};
let skeletonGeneration = 0;

const cacheTabContent = (key) => {
  const nodes = Array.from(tabContent.childNodes).filter(n => {
    if (n.nodeType !== 1) return true;
    return !n.classList?.contains('prerender') && !n.querySelector?.('.prerender');
  });
  if (nodes.length) tabContentCache[key] = nodes;
};

const restoreTabContent = (key) => {
  const cached = tabContentCache[key];
  if (!cached || !cached.length) return false;
  const hasInvalidContent = cached.some(n =>
    n.nodeType === 1 && (
      n.classList?.contains('skeleton-grid') ||
      n.classList?.contains('prerender') ||
      n.querySelector?.('.skeleton-grid') ||
      n.querySelector?.('.prerender')
    )
  );
  if (hasInvalidContent) {
    delete tabContentCache[key];
    return false;
  }
  tabContent.textContent = '';
  tabContent.classList.add('restoring-cache');
  const frag = document.createDocumentFragment();
  cached.forEach(n => frag.appendChild(n));
  tabContent.appendChild(frag);
  requestAnimationFrame(() => {
    tabContent.classList.remove('restoring-cache');
  });
  return true;
};

export const setTabContent = (key, html) => {
  if (restoreTabContent(key)) {
    requestAnimationFrame(() => {
      const activeSubBtn = tabContent.querySelector('.sub-tab-btn.active');
      if (activeSubBtn) {
        activeSubBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
      }
    });
    return;
  }
  if (!html) {
    tabContent.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <div class="empty-state-title">暂无内容</div>
        <div class="empty-state-hint">敬请期待</div>
      </div>
    `;
    return;
  }
  const skeletonShownAt = performance.now();
  const gen = ++skeletonGeneration;
  tabContent.innerHTML = renderSkeletonGrid(6, 'mixed');
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (gen !== skeletonGeneration) return;
      const elapsed = performance.now() - skeletonShownAt;
      const remaining = Math.max(0, 200 - elapsed);
      const render = () => {
        if (gen !== skeletonGeneration) return;
        tabContent.innerHTML = html;
        const activeSubBtn = tabContent.querySelector('.sub-tab-btn.active');
        if (activeSubBtn) {
          activeSubBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
        }
      };
      if (remaining > 0) {
        setTimeout(render, remaining);
      } else {
        render();
      }
    });
  });
};

// ========== 渲染：快捷入口 ==========
const SHORTCUTS_DATA = [
  { tabId: 'ecommerce', name: '电商', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>', color: 'orange' },
  { tabId: 'xiecheng_travel', name: '携程', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V7l8-4v18"/><path d="M19 21V11l-6-4"/></svg>', color: 'blue' },
  { tabId: 'tongcheng_travel', name: '同程', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>', color: 'blue' },
  { tabId: 'feizhu_travel', name: '飞猪', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/></svg>', color: 'green' },
  { tabId: 'life', name: '电影票', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8h1a4 4 0 010 8h-1"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>', color: 'purple' },
  { tabId: 'qita', name: '其他', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>', color: 'gray' },
];

export const renderQuickShortcuts = () => {
  if (!quickShortcuts) return;
  const available = SHORTCUTS_DATA.filter(s => tabs.some(t => t.id === s.tabId));
  quickShortcuts.innerHTML = available.map(s => `
    <button class="quick-shortcut" data-tab="${s.tabId}" data-color="${s.color}" aria-label="${s.name}">
      <span class="quick-shortcut-icon">${s.icon}</span>
      <span class="quick-shortcut-name">${s.name}</span>
    </button>
  `).join('');
};

// ========== 渲染：Tab 内容 ==========
export let activeSubTab = {};

export const renderTabContent = (tabId) => {
  const tab = tabs.find((t) => t.id === tabId);
  if (!tab) {
    if (tabs.length > 0 && tabId !== tabs[0].id) {
      switchTab(tabs[0].id);
    }
    return;
  }

  const sections = normalizeSections(tab.sections);

  if (!sections.length) {
    setTabContent(`${tabId}::`, `
      <div class="empty-state">
        <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
        <div class="empty-state-title">精选活动即将上线</div>
        <div class="empty-state-hint">敬请期待，我们会为你挑选最值得入手的优惠</div>
      </div>
    `);
    return;
  }

  if (tab.hasSubTabs && sections.length > 1) {
    const savedSubTab = activeSubTab[tabId];
    if (!savedSubTab || !sections.some(s => s && s.title === savedSubTab)) {
      activeSubTab[tabId] = sections[0]?.title || '';
    }
    const currentSubTab = activeSubTab[tabId];
    const currentSection = sections.find(s => s.title === currentSubTab) || sections[0];

    const subTabNavHtml = `
      <div class="sub-tab-nav">
        ${sections.map(sec => {
          const displayLabel = sec._tabLabel || sec.title;
          return `
          <button class="sub-tab-btn ${sec.title === currentSubTab ? 'active' : ''}"
                  data-subtab="${sec.title}">
            ${displayLabel}（${sec.items.length}）
          </button>
        `;}).join('')}
      </div>
    `;

    const contentHtml = currentSection._hasSections
      ? currentSection._sections.map(sec => `
          <section class="sub-section">
            <h2 class="sub-section-title">${sec.title}（${sec.items.length}）</h2>
            <div class="card-grid">
              ${sec.items.map((item) => {
                if (item.actionType) return renderApiCard(item);
                return item.code ? renderCodeCard(item) : renderLinkCard(item);
              }).join('')}
            </div>
          </section>
        `).join('')
      : `
          <section class="sub-section">
            <div class="card-grid">
              ${currentSection.items.map((item) => {
                if (item.actionType) return renderApiCard(item);
                return item.code ? renderCodeCard(item) : renderLinkCard(item);
              }).join('')}
            </div>
          </section>
        `;

    setTabContent(`${tabId}::${currentSubTab}`, subTabNavHtml + contentHtml);
    return;
  }

  const noSubHtml = sections
    .filter(sec => sec && sec.items && sec.items.length > 0)
    .map(
      (sec, i) => `
    <section class="sub-section" aria-labelledby="section-${tab.id}-${i}">
      <h2 class="sub-section-title" id="section-${tab.id}-${i}">${sec.title}（${sec.items.length}）</h2>
      <div class="card-grid">
        ${sec.items.map((item) => {
          if (item.actionType) return renderApiCard(item);
          return item.code ? renderCodeCard(item) : renderLinkCard(item);
        }).join('')}
      </div>
    </section>
  `,
    )
    .join('');
  setTabContent(`${tabId}::`, noSubHtml || `
    <div class="empty-state">
      <div class="empty-state-icon"><svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--muted)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
      <div class="empty-state-title">精选活动即将上线</div>
      <div class="empty-state-hint">敬请期待，我们会为你挑选最值得入手的优惠</div>
    </div>
  `);
};

// ========== Tab 切换 ==========
let _activeTab = tabs[0].id;
export const getActiveTab = () => _activeTab;

export const switchTab = (tabId) => {
  const oldSubTab = activeSubTab[_activeTab] || '';
  const cacheKey = oldSubTab ? `${_activeTab}::${oldSubTab}` : `${_activeTab}::`;
  cacheTabContent(cacheKey);

  saveScrollPosition();
  _activeTab = tabId;
  // track('tab_switch', { tab: tabId }); // 由 app.js 通过回调处理
  localStorage.setItem('activeTab', tabId);
  history.replaceState(null, '', `#${tabId}`);
  $$('.tab-btn').forEach((btn) => {
    const isActive = btn.dataset.tab === tabId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', isActive);
  });
  renderTabContent(tabId);
  if (scrollPositions[tabId] !== undefined) {
    restoreScrollPosition();
  } else {
    const activeBtn = tabNav.querySelector('.tab-btn.active');
    if (activeBtn) {
      activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    }
    // 二级tab滚入可视区
    const subNav = tabContent.querySelector('.sub-tab-nav');
    if (subNav) {
      requestAnimationFrame(() => subNav.scrollIntoView({ block: 'nearest', behavior: 'smooth' }));
    }
  }
};

// ========== 滚动位置记忆 ==========
const scrollPositions = {};
const saveScrollPosition = () => { scrollPositions[_activeTab] = window.scrollY; };
const restoreScrollPosition = () => {
  const pos = scrollPositions[_activeTab];
  if (pos !== undefined) {
    requestAnimationFrame(() => window.scrollTo(0, pos));
  }
};

// ========== 过期筛选 ==========
export let hideExpired = localStorage.getItem('hideExpired') === 'true';
setHideExpired(hideExpired);

export const toggleHideExpired = () => {
  hideExpired = !hideExpired;
  localStorage.setItem('hideExpired', hideExpired);
  setHideExpired(hideExpired);
  const btn = $('#hide-expired');
  if (btn) {
    btn.classList.toggle('active', hideExpired);
    btn.setAttribute('aria-pressed', hideExpired);
  }
  renderTabContent(_activeTab);
  // searchQuery 检查由 app.js 处理
};
