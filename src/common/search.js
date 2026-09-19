// ========== 搜索系统 ==========

import { $, debounce, normalizeSections } from './utils.js';
import { ICONS } from './icons.js';
import { renderCodeCard, renderLinkCard, renderApiCard } from './cards.js';
import { tabs, getActiveTab, renderTabContent, tabContent } from './tabs.js';

const searchInput = $('#search-input');
const searchClear = $('#search-clear');
const searchCount = $('#search-count');

// ========== 搜索历史 ==========
const SEARCH_HISTORY_KEY = 'searchHistory';
const MAX_HISTORY = 5;
const getSearchHistory = () => {
  try { return JSON.parse(localStorage.getItem(SEARCH_HISTORY_KEY) || '[]'); } catch { return []; }
};
const addSearchHistory = (query) => {
  if (!query.trim()) return;
  const history = getSearchHistory().filter(h => h !== query);
  history.unshift(query);
  if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
  localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(history));
};
const clearSearchHistory = () => {
  localStorage.removeItem(SEARCH_HISTORY_KEY);
};

// ========== 搜索逻辑 ==========
export let searchQuery = '';

const searchCoupons = (query, hideExpired) => {
  if (!query.trim()) return null;
  const q = query.toLowerCase();
  const results = [];
  tabs.forEach((tab) => {
    normalizeSections(tab.sections).forEach((sec) => {
      sec.items.forEach((item) => {
        if (hideExpired && item.deadline) {
          const d = new Date(item.deadline);
          if (d < new Date()) return;
        }
        if (item.endDate && item.endDate < new Date().toISOString().slice(0, 10)) return;
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.code && item.code.toLowerCase().includes(q);
        const matchDesc = item.desc && item.desc.toLowerCase().includes(q);
        const matchTkl = item.tkl && item.tkl.toLowerCase().includes(q);
        const matchSection = sec.title.toLowerCase().includes(q);
        if (matchName || matchCode || matchDesc || matchTkl || matchSection) {
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
      <div class="empty-state">
        <div class="empty-state-icon">${ICONS.empty_search}</div>
        <div class="empty-state-title">未找到匹配的优惠</div>
        <div class="empty-state-hint">换个关键词试试？</div>
      </div>
    `;
    return;
  }

  const grouped = {};
  results.forEach((item) => {
    const key = `${item.tabId}__${item.sectionTitle || ''}`;
    if (!grouped[key]) grouped[key] = { label: item.tabLabel, sectionTitle: item.sectionTitle || '', items: [] };
    grouped[key].items.push(item);
  });

  let resultIndex = 0;
  tabContent.innerHTML = Object.values(grouped)
    .map(
      (group) => `
    <div class="sub-section">
      <div class="sub-section-title">${group.label}${group.sectionTitle ? ' · ' + group.sectionTitle : ''}（${group.items.length}）</div>
      <div class="card-grid">
        ${group.items.map((item) => {
          resultIndex++;
          if (item.actionType) return `<div style="position:relative">${renderApiCard(item, searchQuery)}</div>`;
          const card = item.code ? renderCodeCard(item, searchQuery) : renderLinkCard(item, searchQuery);
          return `<div style="position:relative">${card}</div>`;
        }).join('')}
      </div>
    </div>
  `,
    )
    .join('');
};

// ========== handleSearch 需要外部传入 track 和 hideExpired ==========
let _track = () => {};
let _getHideExpired = () => false;

export const initSearch = (track, getHideExpired) => {
  _track = track;
  _getHideExpired = getHideExpired;
};

export const handleSearch = () => {
  const query = searchInput.value.trim();
  searchQuery = query;

  if (!query) {
    _track('search_clear');
    searchClear.classList.remove('visible');
    searchCount.classList.remove('visible');
    renderTabContent(getActiveTab());
    hideSearchHistory();
    return;
  }

  searchClear.classList.add('visible');
  const results = searchCoupons(query, _getHideExpired());
  addSearchHistory(query);
  _track('search', { query, results_count: results.length });
  searchCount.textContent = `找到 ${results.length} 个匹配结果`;
  searchCount.classList.add('visible');
  renderSearchResults(results);
};

const debouncedSearch = debounce(handleSearch, 150);

// ========== 搜索历史 UI ==========
const searchHistoryEl = document.createElement('div');
searchHistoryEl.className = 'search-history';
searchInput.parentNode.style.position = 'relative';
searchInput.parentNode.appendChild(searchHistoryEl);

const renderSearchHistory = () => {
  const history = getSearchHistory();
  if (!history.length) { searchHistoryEl.classList.remove('visible'); return; }
  searchHistoryEl.innerHTML = `
    <div class="search-history-header">
      <span>最近搜索</span>
      <button class="search-history-clear" id="search-history-clear">清除</button>
    </div>
    ${history.map(h => `
      <div class="search-history-item" data-query="${h.replace(/"/g, '&quot;')}">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${h}
      </div>
    `).join('')}
  `;
  searchHistoryEl.classList.add('visible');

  searchHistoryEl.querySelector('#search-history-clear').addEventListener('click', (e) => {
    e.stopPropagation();
    clearSearchHistory();
    searchHistoryEl.classList.remove('visible');
  });

  searchHistoryEl.querySelectorAll('.search-history-item').forEach(item => {
    item.addEventListener('click', () => {
      searchInput.value = item.dataset.query;
      handleSearch();
      searchHistoryEl.classList.remove('visible');
    });
  });
};

const hideSearchHistory = () => searchHistoryEl.classList.remove('visible');

// ========== 快捷键面板 ==========
const createShortcutsPanel = () => {
  const overlay = document.createElement('div');
  overlay.className = 'shortcuts-overlay hidden';
  overlay.innerHTML = `
    <div class="shortcuts-panel">
      <div class="shortcuts-title">⌨️ 键盘快捷键</div>
      <div class="shortcuts-list">
        <div class="shortcut-row"><span class="shortcut-label">聚焦搜索</span><div class="shortcut-keys"><kbd>/</kbd></div></div>
        <div class="shortcut-row"><span class="shortcut-label">切换到下一个 Tab</span><div class="shortcut-keys"><kbd>→</kbd></div></div>
        <div class="shortcut-row"><span class="shortcut-label">切换到上一个 Tab</span><div class="shortcut-keys"><kbd>←</kbd></div></div>
        <div class="shortcut-row"><span class="shortcut-label">关闭弹窗</span><div class="shortcut-keys"><kbd>Esc</kbd></div></div>
        <div class="shortcut-row"><span class="shortcut-label">显示快捷键</span><div class="shortcut-keys"><kbd>?</kbd></div></div>
      </div>
      <button class="shortcuts-close">知道了</button>
    </div>
  `;
  document.body.appendChild(overlay);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) overlay.classList.add('hidden'); });
  overlay.querySelector('.shortcuts-close').addEventListener('click', () => overlay.classList.add('hidden'));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') overlay.classList.add('hidden'); });
  return overlay;
};
const shortcutsOverlay = createShortcutsPanel();

// ========== 绑定事件 ==========
export const bindSearchEvents = () => {
  searchInput.addEventListener('input', debouncedSearch);
  searchClear.addEventListener('click', () => {
    searchInput.value = '';
    handleSearch();
    searchInput.focus();
  });

  searchInput.addEventListener('focus', () => {
    if (!searchInput.value.trim()) renderSearchHistory();
  });
  searchInput.addEventListener('blur', () => {
    setTimeout(hideSearchHistory, 200);
  });

  // "?" 打开快捷键面板
  document.addEventListener('keydown', (e) => {
    if (e.key === '?' && !e.ctrlKey && !e.metaKey && !e.altKey && document.activeElement !== searchInput) {
      e.preventDefault();
      shortcutsOverlay.classList.toggle('hidden');
    }
  });

  // "/" 聚焦搜索框
  document.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== searchInput && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault();
      searchInput.focus();
    }
  });
};

// ========== 搜索无障碍增强 ==========
export const enhanceSearchA11y = () => {
  if (searchInput) {
    searchInput.setAttribute('aria-autocomplete', 'list');
    searchInput.setAttribute('aria-controls', 'tab-content');
  }
};
