/**
 * common-page.js — <common-page> Web Component
 *
 * 用法：父页面引入本文件后，使用：
 *   <common-page src="https://example.com"></common-page>
 *
 * 特性：
 * - Shadow DOM 样式隔离，不影响父页面
 * - 仅一层 iframe，无嵌套
 * - 加载中 / 加载失败 / 重试 状态管理
 * - postMessage 透传：父页面 ↔ iframe 内容
 * - 暗色模式：父页面调用 element.dark = true 或 postMessage
 */
(function () {
  'use strict';

  // 计算 common-page.css 的绝对路径（与本 JS 同目录）
  var CSS_URL = (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i].src || '';
      if (s.indexOf('common-page.js') !== -1) {
        return s.replace(/common-page\.js.*$/, 'common-page.css');
      }
    }
    return './common-page.css';
  })();

  // 模板
  var TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML =
    '<link rel="stylesheet" href="' + CSS_URL + '">' +
    '<div class="cp-wrap">' +
      '<div class="cp-loading">' +
        '<div class="cp-spinner"></div>' +
        '<span>加载中…</span>' +
      '</div>' +
      '<iframe class="cp-iframe" allowfullscreen loading="lazy"></iframe>' +
      '<div class="cp-error cp-hidden">' +
        '<p>页面加载失败，请检查网络后刷新</p>' +
        '<button class="cp-btn-retry">刷新重试</button>' +
      '</div>' +
    '</div>';

  var FAIL_TIMEOUT = 15000;

  class CommonPage extends HTMLElement {
    constructor() {
      super();
      this._loaded = false;
      this._failTimer = null;
      this._onMessage = this._handleMessage.bind(this);
    }

    static get observedAttributes() {
      return ['dark'];
    }

    // ========== 生命周期 ==========

    connectedCallback() {
      var shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(TEMPLATE.content.cloneNode(true));

      this._wrap = shadow.querySelector('.cp-wrap');
      this._iframe = shadow.querySelector('.cp-iframe');
      this._loading = shadow.querySelector('.cp-loading');
      this._error = shadow.querySelector('.cp-error');
      this._retryBtn = shadow.querySelector('.cp-btn-retry');

      this._initIframe();
      this._initRetry();
      this._initPostMessage();
      this._applyDark();
    }

    disconnectedCallback() {
      window.removeEventListener('message', this._onMessage);
      if (this._failTimer) clearTimeout(this._failTimer);
    }

    attributeChangedCallback() {
      if (this._wrap) this._applyDark();
    }

    // ========== 属性 ==========

    get src() {
      return this.getAttribute('src') || '';
    }

    set src(v) {
      this.setAttribute('src', v);
      if (this._iframe) this._reload(v);
    }

    get dark() {
      return this.hasAttribute('dark');
    }

    set dark(v) {
      if (v) this.setAttribute('dark', '');
      else this.removeAttribute('dark');
    }

    // ========== iframe 加载 ==========

    _initIframe() {
      var _this = this;
      var src = this.getAttribute('src');

      if (!src) {
        this._showError();
        return;
      }

      this._iframe.src = src;

      this._failTimer = setTimeout(function () {
        if (!_this._loaded) _this._showError();
      }, FAIL_TIMEOUT);

      this._iframe.addEventListener('load', function () {
        if (!_this._iframe.src || _this._iframe.src === 'about:blank') return;
        _this._loaded = true;
        if (_this._failTimer) clearTimeout(_this._failTimer);
        _this._loading.classList.add('fade-out');
        setTimeout(function () { _this._loading.style.display = 'none'; }, 300);
      });

      this._iframe.addEventListener('error', function () {
        if (_this._failTimer) clearTimeout(_this._failTimer);
        _this._showError();
      });
    }

    _reload(src) {
      if (this._failTimer) clearTimeout(this._failTimer);
      this._loaded = false;
      this._loading.style.display = '';
      this._loading.classList.remove('fade-out');
      this._error.classList.add('cp-hidden');

      if (!src) {
        this._showError();
        return;
      }

      var _this = this;
      this._iframe.src = src;

      this._failTimer = setTimeout(function () {
        if (!_this._loaded) _this._showError();
      }, FAIL_TIMEOUT);
    }

    _showError() {
      this._loading.classList.add('fade-out');
      this._error.classList.remove('cp-hidden');
    }

    _initRetry() {
      var _this = this;
      this._retryBtn.addEventListener('click', function () {
        _this._reload(_this.getAttribute('src'));
      });
    }

    // ========== postMessage 透传 ==========

    _initPostMessage() {
      window.addEventListener('message', this._onMessage);
    }

    _handleMessage(event) {
      if (event.data && event.data._cpRelay) return;

      // 父页面 → iframe
      if (event.source === window.parent && event.source !== null) {
        this._postToIframe(event.data);
        return;
      }

      // iframe → 父页面
      if (this._iframe.contentWindow && event.source === this._iframe.contentWindow) {
        this._postToParent(event.data);
      }
    }

    _postToIframe(data) {
      if (!this._iframe.contentWindow) return;
      try {
        var msg = typeof data === 'object' ? Object.assign({}, data, { _cpRelay: true }) : data;
        this._iframe.contentWindow.postMessage(msg, '*');
      } catch (_) { /* 跨域忽略 */ }
    }

    _postToParent(data) {
      if (!window.parent || window.parent === window) return;
      try {
        var msg = typeof data === 'object' ? Object.assign({}, data, { _cpRelay: true }) : data;
        window.parent.postMessage(msg, '*');
      } catch (_) { /* 忽略 */ }
    }

    // ========== 暗色模式 ==========

    _applyDark() {
      if (this.hasAttribute('dark')) {
        this._wrap.classList.add('dark');
      } else {
        this._wrap.classList.remove('dark');
      }
    }
  }

  customElements.define('common-page', CommonPage);

})();
