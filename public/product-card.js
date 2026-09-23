/**
 * product-card.js — <product-card> 通用卡片 Web Component
 *
 * 用法：
 *   <product-card
 *     name="产品名称"
 *     description="产品描述"
 *     price="¥9.9/月"
 *     badge="热门"
 *     url="https://example.com"
 *     platform-icon='<svg>...</svg>'
 *   ></product-card>
 *
 * 特性：
 * - 主题色穿透：通过 CSS 变量继承宿主页面主题色
 * - Slot 支持：可自定义头部、主体、底部内容
 * - 默认样式：提供完整的卡片样式
 * - 暗色模式：自动同步暗色模式
 *
 * CSS 变量覆盖：
 *   product-card {
 *     --card-primary: #0891b2;
 *     --card-primary-hover: #0e7490;
 *     --card-primary-light: #ecfeff;
 *   }
 *
 * Slot：
 *   - card-top：顶部装饰区域
 *   - card-header：头部内容（替换默认头部）
 *   - card-body：主体内容（替换默认主体）
 *   - card-meta：标签区域（替换默认标签）
 *   - card-footer：底部内容（替换默认按钮）
 */
(function () {
  'use strict';

  // ========== CSS 路径 ==========
  var CSS_URL = (function () {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var s = scripts[i].src || '';
      if (s.indexOf('product-card.js') !== -1) {
        return s.replace(/product-card\.js.*$/, 'product-card.css');
      }
    }
    return './product-card.css';
  })();

  // ========== 默认图标 ==========
  var DEFAULT_ICONS = {
    external: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    qr: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4" rx="1"/><line x1="22" y1="14" x2="22" y2="14.01"/><line x1="18" y1="18" x2="18" y2="18.01"/><line x1="14" y1="22" x2="14" y2="22.01"/><line x1="18" y1="22" x2="18" y2="22.01"/><line x1="22" y1="18" x2="22" y2="18.01"/><line x1="22" y1="22" x2="22" y2="22.01"/></svg>',
    check: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>'
  };

  // ========== 徽章颜色映射 ==========
  var BADGE_COLORS = {
    '热门': { bg: '#FF4D4F', color: '#fff' },
    '新品': { bg: '#52C41A', color: '#fff' },
    '推荐': { bg: '#FA8C16', color: '#fff' },
    '四网': { bg: '#1677FF', color: '#fff' }
  };

  // ========== Web Component ==========
  class ProductCard extends HTMLElement {
    constructor() {
      super();
      this._defaults = {
        name: '',
        description: '',
        price: '',
        badge: '',
        url: '',
        platformIcon: '',
        nationwide: false
      };
    }

    static get observedAttributes() {
      return ['name', 'description', 'price', 'badge', 'url', 'platform-icon', 'nationwide', 'disabled', 'external'];
    }

    connectedCallback() {
      this._render();
      this._setupDarkMode();
    }

    attributeChangedCallback() {
      if (this.shadowRoot) {
        this._render();
      }
    }

    disconnectedCallback() {
      if (this._darkObserver) {
        this._darkObserver.disconnect();
        this._darkObserver = null;
      }
    }

    _getAttr(name, defaultVal) {
      return this.getAttribute(name) || defaultVal;
    }

    _render() {
      var shadow = this.attachShadow({ mode: 'open' });

      // 样式
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CSS_URL;
      shadow.appendChild(link);

      // 获取属性
      var name = this._getAttr('name', this._defaults.name);
      var description = this._getAttr('description', this._defaults.description);
      var price = this._getAttr('price', this._defaults.price);
      var badge = this._getAttr('badge', this._defaults.badge);
      var url = this._getAttr('url', this._defaults.url);
      var platformIcon = this._getAttr('platform-icon', this._defaults.platformIcon);
      var nationwide = this.hasAttribute('nationwide');
      var disabled = this.hasAttribute('disabled');
      var external = this.hasAttribute('external');

      // 徽章样式
      var badgeStyle = '';
      var badgeHtml = '';
      if (badge && BADGE_COLORS[badge]) {
        var colors = BADGE_COLORS[badge];
        badgeStyle = 'background:' + colors.bg + ';color:' + colors.color;
        badgeHtml = '<span class="card-badge" style="' + badgeStyle + '">' + badge + '</span>';
      } else if (badge) {
        badgeHtml = '<span class="card-badge">' + badge + '</span>';
      }

      // 平台图标
      var iconHtml = platformIcon || DEFAULT_ICONS.default;

      // 构建 HTML
      var disabledClass = disabled ? ' disabled' : '';
      var html = '<article class="card' + disabledClass + '">';

      // 顶部装饰（slot）
      html += '<slot name="card-top"><div class="card-top"></div></slot>';

      // 主体
      html += '<div class="card-body">';

      // 头部（slot）
      html += '<slot name="card-header">';
      html += '<div class="card-header">';
      html += '<div class="card-platform-icon">' + iconHtml + '</div>';
      html += '<div class="card-info">';
      html += '<span class="card-name">' + name + badgeHtml + '</span>';
      html += '</div>';
      if (price) {
        html += '<span class="card-price"><span class="card-price-text">' + price + '</span></span>';
      }
      html += '</div>';
      html += '</slot>';

      // 描述
      if (description) {
        html += '<p class="card-desc">' + description + '</p>';
      }

      // 标签区域（slot）
      html += '<slot name="card-meta">';
      html += '<div class="card-meta">';
      html += '<span class="card-tag">' + DEFAULT_ICONS.check + ' 正规授权</span>';
      if (nationwide) {
        html += '<span class="card-tag">' + DEFAULT_ICONS.check + ' 全国配送</span>';
      }
      html += '</div>';
      html += '</slot>';

      // 底部按钮（slot）
      html += '<slot name="card-footer">';
      html += '<div class="card-actions">';
      if (url) {
        // external 属性控制：有则新标签页打开，无则当前页面跳转
        var targetAttr = external ? ' target="_blank" rel="noopener sponsored"' : '';
        html += '<a class="btn-go" href="' + url + '"' + targetAttr + '>';
        html += DEFAULT_ICONS.external + ' 立即查看';
        html += '</a>';
        html += '<button class="btn-qr" data-url="' + url + '" data-name="' + name.replace(/"/g, '&quot;') + '">';
        html += DEFAULT_ICONS.qr + ' 扫码';
        html += '</button>';
      }
      html += '</div>';
      html += '</slot>';

      html += '</div>'; // card-body
      html += '</article>';

      shadow.innerHTML = '';
      shadow.appendChild(link);
      var wrapper = document.createElement('div');
      wrapper.innerHTML = html;
      shadow.appendChild(wrapper);

      // 按钮事件
      this._setupEvents(shadow);
    }

    _setupEvents(shadow) {
      var _this = this;
      shadow.addEventListener('click', function (e) {
        var qrBtn = e.target.closest('.btn-qr');
        if (qrBtn) {
          _this.dispatchEvent(new CustomEvent('qr-click', {
            bubbles: true,
            detail: {
              url: qrBtn.dataset.url,
              name: qrBtn.dataset.name
            }
          }));
          return;
        }

        var goBtn = e.target.closest('.btn-go');
        if (goBtn) {
          e.preventDefault();
          _this.dispatchEvent(new CustomEvent('card-click', {
            bubbles: true,
            detail: {
              url: goBtn.href,
              name: _this.getAttribute('name')
            }
          }));
          // Shadow DOM 中 <a> 默认行为不生效，手动导航
          window.location.href = goBtn.href;
        }
      });
    }

    _setupDarkMode() {
      var _this = this;
      var syncDark = function () {
        var isDark = document.body.classList.contains('dark-mode') ||
                     document.documentElement.classList.contains('dark-mode');
        _this.classList.toggle('dark-mode', isDark);
      };

      syncDark();

      this._darkObserver = new MutationObserver(syncDark);
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

  customElements.define('product-card', ProductCard);

})();
