/**
 * page-progress.js — <page-progress> Web Component
 *
 * 用法：<page-progress></page-progress>
 * 页面顶部加载进度条，挂载即自动播放动画。
 */
(function () {
  'use strict';

  class PageProgress extends HTMLElement {
    connectedCallback() {
      var bar = document.createElement('div');
      var primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#FF6B35';
      var primaryHover = getComputedStyle(document.documentElement).getPropertyValue('--primary-hover').trim() || primary;
      bar.style.cssText =
        'position:fixed;top:0;left:0;height:3px;width:0;' +
        'background:linear-gradient(90deg,' + primary + ',' + primaryHover + ');' +
        'z-index:10001;transition:width 0.3s ease,opacity 0.3s ease;' +
        'box-shadow:0 0 10px ' + primary + ';pointer-events:none;';
      this.appendChild(bar);

      // 挂载后开始动画
      requestAnimationFrame(function () {
        bar.style.width = '90%';
        setTimeout(function () {
          bar.style.width = '100%';
          bar.style.opacity = '0';
        }, 300);
        setTimeout(function () {
          bar.style.display = 'none';
        }, 600);
      });
    }
  }

  customElements.define('page-progress', PageProgress);

})();
