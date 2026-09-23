/**
 * page-hero.js — <page-hero> Web Component
 *
 * 用法：
 *   <page-hero icon='<path d="..."/>' title="号卡办理" subtitle="流量卡·四网可选">
 *     <span class="stat-badge">已收录 <strong>5</strong> 个平台</span>
 *   </page-hero>
 *
 * 属性：icon / title / subtitle / aria
 * 插槽：默认插槽 → hero-stats 统计徽章
 */
(function () {
  'use strict';

  var CSS_URL = (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i].src || '';
      if (s.indexOf('page-hero.js') !== -1) {
        return s.replace(/page-hero\.js.*$/, 'page-hero.css');
      }
    }
    return './page-hero.css';
  })();

  var WAVE_SVG = '<svg viewBox="0 0 1440 28" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M0,14 C180,28 360,0 540,14 C720,28 900,0 1080,14 C1260,28 1440,8 1440,8 L1440,28 L0,28 Z" fill="var(--bg, #fff)"/>' +
    '</svg>';

  var TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML =
    '<link rel="stylesheet" href="' + CSS_URL + '">' +
    '<div class="ph-wrapper" part="wrapper">' +
      '<div class="ph-deco" aria-hidden="true"></div>' +
      '<div class="ph-nav">' +
        '<a href="./" class="ph-back" aria-label="返回首页">' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>' +
          '返回首页' +
        '</a>' +
        '<div class="ph-controls">' +
          '<button class="ph-dark-btn" aria-label="切换暗色模式">' +
            '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>' +
            '<span class="ph-dark-text">暗色</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="ph-icon"></div>' +
      '<h1 class="ph-title"></h1>' +
      '<p class="ph-subtitle"></p>' +
      '<div class="ph-stats"><slot></slot></div>' +
      '<div class="ph-wave" aria-hidden="true">' + WAVE_SVG + '</div>' +
    '</div>';

  class PageHero extends HTMLElement {

    static get observedAttributes() {
      return ['icon', 'title', 'subtitle'];
    }

    connectedCallback() {
      // 防止重复初始化
      if (this._initialized) return;
      this._initialized = true;

      var shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(TEMPLATE.content.cloneNode(true));

      this._iconEl = shadow.querySelector('.ph-icon');
      this._titleEl = shadow.querySelector('.ph-title');
      this._subtitleEl = shadow.querySelector('.ph-subtitle');
      this._darkBtn = shadow.querySelector('.ph-dark-btn');
      this._darkText = shadow.querySelector('.ph-dark-text');

      this._renderIcon();
      this._renderText();
      this._initDark();

      // 修正"返回"链接：一级页面不显示，其他页面显示"返回上级"
      var back = shadow.querySelector('.ph-back');
      if (back) {
        var path = (window.location.pathname || '').replace(/\/+$/, '');
        var segments = path.split('/').filter(Boolean);
        if (segments.length <= 1) {
          // 一级页面：隐藏返回按钮
          back.style.display = 'none';
        } else {
          // 二级及以上页面：显示"返回上级"，链接为 ../
          back.setAttribute('href', '../');
          back.querySelector('svg').nextSibling.textContent = '返回上级';
        }
      }

      // 无障碍
      var ariaLabel = this.getAttribute('aria');
      if (ariaLabel) this.setAttribute('aria-label', ariaLabel);
    }

    disconnectedCallback() {
      if (this._darkObserver) {
        this._darkObserver.disconnect();
        this._darkObserver = null;
      }
      // 不重置 _initialized，避免重新连接时闪烁
    }

    /**
     * 更新统计徽章内容（供外部 JS 调用）
     * 用法: document.querySelector('page-hero').updateStats('<span class="stat-badge">...</span>')
     */
    updateStats(html) {
      if (!this._initialized) return;
      var slot = this.shadowRoot.querySelector('slot');
      if (!slot) return;
      // 用一个容器包裹 HTML，替换 slot 的投射内容
      var container = slot.parentElement;
      if (container) container.innerHTML = '<slot></slot>' + html;
    }

    attributeChangedCallback() {
      if (!this._initialized) return;
      this._renderIcon();
      this._renderText();
    }

    _renderIcon() {
      var icon = this.getAttribute('icon');
      if (icon && this._iconEl) {
        this._iconEl.innerHTML =
          '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          icon + '</svg>';
      }
    }

    _renderText() {
      if (!this._titleEl) return;
      this._titleEl.textContent = this.getAttribute('title') || '';
      var sub = this.getAttribute('subtitle');
      if (this._subtitleEl) {
        if (sub) {
          this._subtitleEl.textContent = sub;
          this._subtitleEl.style.display = '';
        } else {
          this._subtitleEl.style.display = 'none';
        }
      }
    }

    // ========== 暗色模式 ==========

    _initDark() {
      var _this = this;

      // 按钮点击切换
      this._darkBtn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('dark-mode');
        var isDark = document.body.classList.contains('dark-mode');
        try { localStorage.setItem('darkMode', isDark); } catch (_) {}
        _this._syncDark();
        if (typeof window.__darkModeOnToggle === 'function') window.__darkModeOnToggle(isDark);
      });

      // MutationObserver 监听外部暗色模式变化（其他按钮切换时同步）
      this._syncDark();
      this._darkObserver = new MutationObserver(function () {
        _this._syncDark();
      });
      if (document.body) {
        this._darkObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      }
      this._darkObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    }

    _syncDark() {
      var isDark = document.body.classList.contains('dark-mode') ||
                   document.documentElement.classList.contains('dark-mode');
      this.classList.toggle('dark-mode', isDark);
      if (this._darkText) this._darkText.textContent = isDark ? '亮色' : '暗色';
    }
  }

  customElements.define('page-hero', PageHero);

})();
