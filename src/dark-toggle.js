/**
 * dark-toggle.js — <dark-toggle> Web Component
 *
 * 用法：<dark-toggle></dark-toggle>
 * 移动端 iframe 页面浮动暗色切换按钮。
 */
(function () {
  'use strict';

  var TEMPLATE = document.createElement('template');
  TEMPLATE.innerHTML =
    '<style>' +
      ':host { display: none; }' +
      '@media (max-width: 1023px) { :host { display: flex; } }' +
      'button {' +
        'display: flex; align-items: center; gap: 4px;' +
        'padding: 6px 12px; border: 1.5px solid rgba(255,255,255,0.18);' +
        'border-radius: 14px; background: rgba(255,255,255,0.12);' +
        'backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);' +
        'color: #fff; font-size: 12px; font-weight: 500;' +
        'cursor: pointer; transition: all 0.2s ease;' +
        'position: fixed; top: calc(var(--safe-area-inset-top, 0px) + 12px);' +
        'right: 12px; z-index: 150;' +
      '}' +
      'button:hover { background: rgba(255,255,255,0.22); border-color: rgba(255,255,255,0.35); }' +
      ':host(.dark-mode) button { background: rgba(26,26,46,0.9); border-color: rgba(255,255,255,0.12); }' +
    '</style>' +
    '<button aria-label="切换暗色模式">' +
      '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>' +
      '<span class="dt-text">暗色</span>' +
    '</button>';

  class DarkToggle extends HTMLElement {
    connectedCallback() {
      var shadow = this.attachShadow({ mode: 'open' });
      shadow.appendChild(TEMPLATE.content.cloneNode(true));

      var btn = shadow.querySelector('button');
      var text = shadow.querySelector('.dt-text');
      var _this = this;

      btn.addEventListener('click', function () {
        document.body.classList.toggle('dark-mode');
        document.documentElement.classList.toggle('dark-mode');
        var isDark = document.body.classList.contains('dark-mode');
        try { localStorage.setItem('darkMode', isDark); } catch (_) {}
        _this._syncDark(text);
        if (typeof window.__darkModeOnToggle === 'function') window.__darkModeOnToggle(isDark);
      });

      this._syncDark(text);
    }

    _syncDark(text) {
      var isDark = document.body.classList.contains('dark-mode') ||
                   document.documentElement.classList.contains('dark-mode');
      text.textContent = isDark ? '亮色' : '暗色';
      this.classList.toggle('dark-mode', isDark);
    }
  }

  customElements.define('dark-toggle', DarkToggle);

})();
