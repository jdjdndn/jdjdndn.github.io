// ========== article 通用交互：Tab 切换 + 分页 + 搜索 ==========
// ⚠️ 此文件由 9 个分类文章页共享，请勿手动编辑

(function () {
  'use strict';
  if (window.__articleTabsLoaded) return;
  window.__articleTabsLoaded = true;

  // ===== DOM 元素 =====
  var TAB_BTNS = document.querySelectorAll('.tab-btn');
  var TAB_CONTENTS = document.querySelectorAll('.tab-content');
  var PAGE_SIZE = 12;
  var PAGINATION = document.getElementById('pagination');
  var pageState = {};

  // ===== URL 分页 =====
  function readURLPage() {
    try {
      var p = parseInt(new URLSearchParams(location.search).get('page') || '1', 10);
      return p > 0 ? p : 1;
    } catch (e) { return 1; }
  }
  function writeURLPage(page) {
    try {
      var url = new URL(location.href);
      if (page > 1) url.searchParams.set('page', String(page));
      else url.searchParams.delete('page');
      history.replaceState(null, '', url.pathname + url.search + url.hash);
    } catch (e) {}
  }

  // ===== 搜索状态（外部可设置） =====
  var searchQuery = '';
  window.setArticleSearchQuery = function (q) { searchQuery = q; };

  // ===== 分页 =====
  function initPagination(tabId) {
    var tabContent = document.getElementById(tabId);
    if (!tabContent || !PAGINATION) return;
    var list = tabContent.querySelector('.article-list');
    if (!list) return;
    var items = list.querySelectorAll('.article-item');
    var totalItems = items.length;
    var totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));

    if (totalPages <= 1) {
      PAGINATION.style.display = 'none';
      items.forEach(function (item) { item.style.display = ''; });
      pageState[tabId] = 1;
      writeURLPage(1);
      return;
    }

    PAGINATION.style.display = 'flex';
    var currentPage = Math.min(pageState[tabId] || 1, totalPages);
    if (pageState[tabId] === undefined) pageState[tabId] = currentPage;

    function showPage(page) {
      if (page < 1 || page > totalPages) return;
      currentPage = page;
      pageState[tabId] = page;
      writeURLPage(page);
      var start = (page - 1) * PAGE_SIZE;
      var end = start + PAGE_SIZE;
      items.forEach(function (item, index) {
        item.style.display = (index >= start && index < end) ? '' : 'none';
      });
      renderPagination();
    }

    function renderPagination() {
      var html = '';
      html += '<button class="page-btn" ' + (currentPage === 1 ? 'disabled' : '') + ' data-page="' + (currentPage - 1) + '">上一页</button>';

      var maxVisible = 5;
      var startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
      var endPage = Math.min(totalPages, startPage + maxVisible - 1);

      if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
      }

      if (startPage > 1) {
        html += '<button class="page-btn" data-page="1">1</button>';
        if (startPage > 2) html += '<span class="page-info">...</span>';
      }

      for (var i = startPage; i <= endPage; i++) {
        html += '<button class="page-btn ' + (i === currentPage ? 'active' : '') + '" data-page="' + i + '">' + i + '</button>';
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) html += '<span class="page-info">...</span>';
        html += '<button class="page-btn" data-page="' + totalPages + '">' + totalPages + '</button>';
      }

      html += '<button class="page-btn" ' + (currentPage === totalPages ? 'disabled' : '') + ' data-page="' + (currentPage + 1) + '">下一页</button>';
      html += '<span class="page-info">共 ' + totalItems + ' 篇</span>';

      PAGINATION.innerHTML = html;
      PAGINATION.querySelectorAll('.page-btn').forEach(function (btn) {
        btn.addEventListener('click', function () {
          if (!this.disabled) showPage(parseInt(this.getAttribute('data-page'), 10));
        });
      });
    }

    showPage(currentPage);
  }

  // ===== 搜索过滤 =====
  function applySearch() {
    var q = searchQuery.trim().toLowerCase();
    var tabContent = document.querySelector('.tab-content.active');
    if (!tabContent) return;
    var items = tabContent.querySelectorAll('.article-item');
    var matched = 0;
    items.forEach(function (item) {
      var text = (item.textContent || '').toLowerCase();
      var show = !q || text.indexOf(q) !== -1;
      item.style.display = show ? '' : 'none';
      if (show) matched++;
    });
    var countEl = document.getElementById('search-count');
    if (countEl) {
      if (q) {
        countEl.textContent = matched ? '找到 ' + matched + ' 篇相关文章' : '未找到相关文章';
        countEl.style.display = 'block';
      } else {
        countEl.style.display = 'none';
      }
    }
    if (q) {
      if (PAGINATION) PAGINATION.style.display = 'none';
    } else {
      var activeTab = document.querySelector('.tab-content.active');
      if (activeTab) initPagination(activeTab.id);
    }
  }

  // ===== Tab 切换 =====
  function switchTab(tabId, opts) {
    TAB_BTNS.forEach(function (btn) { btn.classList.toggle('active', btn.dataset.tab === tabId); });
    TAB_CONTENTS.forEach(function (c) { c.classList.toggle('active', c.id === tabId); });
    if (pageState[tabId] === undefined) {
      pageState[tabId] = (opts && opts.first) ? Math.max(1, readURLPage()) : 1;
    }
    if (searchQuery) applySearch(); else initPagination(tabId);
  }

  // ===== 暴露给外部 =====
  window.switchTab = switchTab;
  window.applySearch = applySearch;
  window.initPagination = initPagination;

  // ===== Tab 按钮点击 =====
  TAB_BTNS.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = this.dataset.tab;
      switchTab(tabId);
      try {
        if (location.hash !== '#' + tabId) history.replaceState(null, '', location.pathname + location.search + '#' + tabId);
      } catch (e) {}
    });
  });

  // ===== hash 恢复 =====
  function applyHash() {
    var tabId = location.hash.slice(1);
    var target = tabId && document.getElementById(tabId);
    switchTab(target ? tabId : 'tab1', { first: true });
  }

  // ===== 搜索绑定 =====
  var SEARCH_INPUT = document.getElementById('article-search');
  var SEARCH_CLEAR = document.getElementById('search-clear');

  if (SEARCH_INPUT) {
    SEARCH_INPUT.addEventListener('input', function () {
      searchQuery = this.value;
      applySearch();
      if (SEARCH_CLEAR) SEARCH_CLEAR.style.display = this.value ? '' : 'none';
    });
  }
  if (SEARCH_CLEAR) {
    SEARCH_CLEAR.addEventListener('click', function () {
      if (SEARCH_INPUT) SEARCH_INPUT.value = '';
      searchQuery = '';
      applySearch();
      this.style.display = 'none';
    });
  }

  // ===== 初始化 =====
  window.addEventListener('hashchange', applyHash);
  applyHash();
})();
