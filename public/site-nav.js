/**
 * site-nav.js — <site-nav> Web Component
 *
 * 用法：
 *   <site-nav position="side"></site-nav>    ← 桌面端侧边栏
 *   <site-nav position="footer"></site-nav>  ← 移动端底部栏
 *
 * 特性：
 * - 导航项集中定义，新增/删除页面只改一处
 * - 自动检测当前页并设置 active
 * - Shadow DOM 样式隔离
 * - 自动同步父页面暗色模式（body.dark-mode）
 * - 当前页链接点击回顶部，不刷新
 */
(function () {
  'use strict';

  // ========== 导航项配置（唯一数据源） ==========
  var NAV_ITEMS = [
    { href: './index.html',   label: '首页', icon: '<path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/>' },
    { href: './huodong.html', label: '活动', icon: '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>' },
    { href: './gouwu.html',   label: '购物', icon: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>' },
    { href: './haoka.html',   label: '号卡', icon: '<rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/>' },
    { href: './wifi.html',    label: 'WiFi', icon: '<path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/>' },
    { href: './wangpan.html', label: '网盘', icon: '<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>' },
    { href: './huiyuan.html', label: '会员', icon: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>' },
    { href: './about.html',   label: '关于', icon: '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>' },
  ];

  // ========== CSS 路径 ==========
  var CSS_URL = (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i].src || '';
      if (s.indexOf('site-nav.js') !== -1) {
        return s.replace(/site-nav\.js.*$/, 'site-nav.css');
      }
    }
    return './site-nav.css';
  })();

  // ========== 当前页检测 ==========
  function getCurrentPage() {
    return (location.pathname.split('/').pop() || 'index.html');
  }

  // ========== SVG 生成 ==========
  function makeSvg(iconInner) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + iconInner + '</svg>';
  }

  // ========== 导航 HTML 生成 ==========
  function buildNavHTML(currentPage) {
    var html = '';
    for (var i = 0; i < NAV_ITEMS.length; i++) {
      var item = NAV_ITEMS[i];
      var page = item.href.split('/').pop();
      var active = page === currentPage;
      var cls = active ? ' class="nav-link active"' : ' class="nav-link"';
      var aria = active ? ' aria-current="page"' : '';
      html += '<li><a href="' + item.href + '"' + cls + aria + '>' +
              makeSvg(item.icon) + '<span>' + item.label + '</span></a></li>';
    }
    return html;
  }

  // ========== Web Component ==========
  class SiteNav extends HTMLElement {
    constructor() {
      super();
      this._currentPage = getCurrentPage();
    }

    static get observedAttributes() {
      return ['position'];
    }

    connectedCallback() {
      var shadow = this.attachShadow({ mode: 'open' });
      var position = this.getAttribute('position') || 'footer';

      // 样式
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CSS_URL;
      shadow.appendChild(link);

      // CSS 加载后立即显示导航（覆盖 10s 兜底延迟）
      var _this = this;
      link.addEventListener('load', function () {
        _this.style.animation = 'none';
        _this.style.visibility = 'visible';
      });

      // 导航结构
      var nav = document.createElement('nav');
      nav.className = position === 'side' ? 'side-bar' : 'footer-bar';
      nav.setAttribute('aria-label', '页面导航');
      nav.innerHTML = '<ul class="nav-list">' + buildNavHTML(this._currentPage) + '</ul>';
      shadow.appendChild(nav);

      // 当前页点击回顶部
      var page = this._currentPage;
      nav.addEventListener('click', function (e) {
        var link = e.target.closest('a');
        if (!link) return;
        var target = link.getAttribute('href').split('/').pop();
        if (target === page) {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      });

      // 暗色模式同步
      this._syncDark();
      this._observeDark();
    }

    disconnectedCallback() {
      if (this._darkObserver) {
        this._darkObserver.disconnect();
        this._darkObserver = null;
      }
    }

    _syncDark() {
      var isDark = document.body.classList.contains('dark-mode') ||
                   document.documentElement.classList.contains('dark-mode');
      this.classList.toggle('dark-mode', isDark);
    }

    _observeDark() {
      var _this = this;
      this._darkObserver = new MutationObserver(function () {
        _this._syncDark();
      });
      this._darkObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['class']
      });
      this._darkObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class']
      });
    }
  }

  customElements.define('site-nav', SiteNav);

})();
